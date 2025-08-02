'use client';

import { Party, Neighbor } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, MenuSquare, Trash2, Send, Users, UserCheck } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface PartyCardProps {
  party: Party;
  neighbors: Neighbor[];
  onDelete: (id: string) => void;
  onAttendeeChange: (partyId: string, neighborId: string, isAttending: boolean) => void;
}

export function PartyCard({ party, neighbors, onDelete, onAttendeeChange }: PartyCardProps) {
  const handleInvite = () => {
    const attendees = neighbors.filter(n => party.attendees.includes(n.id));
    const attendeeEmails = attendees.map(a => a.email).filter(Boolean);

    if (attendeeEmails.length === 0) {
      toast({
        title: 'Aucun invité sélectionné',
        description: 'Veuillez sélectionner au moins un invité à qui envoyer une invitation.',
        variant: 'destructive',
      });
      return;
    }
    
    // In a real app, this would trigger a backend service.
    // Here, we'll simulate it by opening the mail client.
    const subject = `Invitation : ${party.name}`;
    const body = `Bonjour,

Vous êtes invité(e) à la fête : ${party.name} !
Elle aura lieu le ${format(party.date, 'PPPP p', { locale: fr })} à ${party.place}.

Au menu : ${party.menu.join(', ')}.
${party.comments}

Pourriez-vous nous indiquer si vous serez présent ?
Cliquez ici pour confirmer : [Lien de confirmation]
Cliquez ici pour décliner : [Lien de non participation]

Merci !`;
    
    window.location.href = `mailto:${attendeeEmails.join(',')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;


    toast({
      title: 'Invitations envoyées !',
      description: `Les invitations pour "${party.name}" ont été envoyées aux invités sélectionnés.`,
    });
  };

  const totalAttendees = party.attendees.length;

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{party.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 pt-1">
          <Calendar className="h-4 w-4" />
          <span>{format(party.date, 'PPPP p', { locale: fr })}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-muted-foreground">{party.description}</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{party.place}</span>
          </div>
          <div className="flex items-start gap-2">
            <MenuSquare className="h-4 w-4 text-primary mt-1" />
            <div className="flex flex-wrap gap-2">
              {party.menu.slice(0, 4).map((item, index) => (
                <span key={index} className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                  {item}
                </span>
              ))}
              {party.menu.length > 4 && (
                 <span className="bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded-full">
                  +{party.menu.length - 4} de plus
                </span>
              )}
            </div>
          </div>
        </div>
        <Separator />
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="attendees">
                <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4"/>
                        <span>Participants ({totalAttendees})</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {neighbors.map(neighbor => (
                            <div key={neighbor.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`att-${party.id}-${neighbor.id}`}
                                    checked={party.attendees.includes(neighbor.id)}
                                    onCheckedChange={(checked) => onAttendeeChange(party.id, neighbor.id, !!checked)}
                                />
                                <Label htmlFor={`att-${party.id}-${neighbor.id}`} className='font-normal text-sm w-full'>
                                    {neighbor.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 border-t pt-6">
        <Button variant="outline" onClick={() => onDelete(party.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </Button>
        <Button onClick={handleInvite}>
          <Send className="mr-2 h-4 w-4" />
          Inviter
        </Button>
      </CardFooter>
    </Card>
  );
}
