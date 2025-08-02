'use server';

import { Party, Neighbor } from '@/lib/types';
import { Resend } from 'resend';
import InvitationEmail from '@/components/email-templates/invitation-email';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInvitationEmailProps {
    party: Party;
    neighbors: Neighbor[];
}

export async function sendInvitationEmail({ party, neighbors }: SendInvitationEmailProps): Promise<{ success: boolean; error?: string }> {
    if (!process.env.RESEND_API_KEY) {
        console.error('Resend API key is not configured.');
        return { success: false, error: "La configuration du service d'email est incomplète sur le serveur." };
    }
    
    const emailsAndNeighbors = neighbors
        .map(n => ({ email: n.email, neighborId: n.id }))
        .filter((item): item is { email: string; neighborId: string } => typeof item.email === 'string' && item.email.length > 0);

    if (emailsAndNeighbors.length === 0) {
        return { success: false, error: "Aucune adresse e-mail valide à qui envoyer l'invitation." };
    }

    try {
        const emailPromises = emailsAndNeighbors.map(({ email, neighborId }) => {
            return resend.emails.send({
                from: 'Party Planner <onboarding@resend.dev>',
                to: [email],
                subject: `Invitation : ${party.name}`,
                react: InvitationEmail({ 
                    party, 
                    neighborId 
                }),
            });
        });
        
        const results = await Promise.allSettled(emailPromises);

        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
             console.error('Some emails failed to send with Resend:', failed);
             // We can still return success if at least one email was sent
        }

        if (results.every(r => r.status === 'rejected')) {
             return { success: false, error: "Le service d'envoi d'e-mails a rencontré une erreur pour toutes les adresses." };
        }

        return { success: true };

    } catch (e) {
        console.error('Exception while sending email:', e);
        return { success: false, error: "Une erreur inattendue est survenue lors de l'envoi des invitations." };
    }
}
