'use server';

import { Party, Neighbor } from '@/lib/types';
import { Resend } from 'resend';
import InvitationEmail from '@/components/email-templates/invitation-email';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendInvitationEmailProps {
    party: Party;
    attendees: Neighbor[];
}

export async function sendInvitationEmail({ party, attendees }: SendInvitationEmailProps): Promise<{ success: boolean; error?: string }> {
    if (!process.env.RESEND_API_KEY) {
        console.error('Resend API key is not configured.');
        return { success: false, error: "La configuration du service d'email est incomplète sur le serveur." };
    }
    
    const emails = attendees
        .map(n => n.email)
        .filter((email): email is string => typeof email === 'string' && email.length > 0);

    if (emails.length === 0) {
        return { success: false, error: "Aucune adresse e-mail valide à qui envoyer l'invitation." };
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Party Planner <onboarding@resend.dev>', // Vous devrez configurer un domaine vérifié sur Resend
            to: emails,
            subject: `Invitation : ${party.name}`,
            react: InvitationEmail({ party }),
        });

        if (error) {
            console.error('Error sending email with Resend:', error);
            return { success: false, error: "Le service d'envoi d'e-mails a rencontré une erreur." };
        }

        return { success: true };
    } catch (e) {
        console.error('Exception while sending email:', e);
        return { success: false, error: "Une erreur inattendue est survenue lors de l'envoi des invitations." };
    }
}
