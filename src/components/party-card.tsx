'use client';

import { Party, Neighbor } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, MenuSquare, Trash2, Send, Users, UserCheck, Pencil } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { sendInvitationEmail } from '@/lib/server-actions';
import { useState } from 'react';

interface PartyCardProps {
  party: Party;
  neighbors: Neighbor[];
  onEdit: () => void;
  onDelete: (id: string) => void;
  onAttendeeChange: (partyId: string, neighborId: string, isAttending: boolean) => void;
}

export function PartyCard({ party, neighbors, onEdit, onDelete, onAttendeeChange }: PartyCardProps) {
  const [isSending, setIsSending] = useState(false);
  
  const handleInvite = async () => {
    const attendees = neighbors.filter(n => party.attendees.includes(n.id) && n.email);
    
    if (attendees.length === 0) {
      toast({
        title: 'Aucun invité avec e-mail',
        description: "Veuillez sélectionner au moins un invité avec une adresse e-mail pour envoyer une invitation.",
        variant: 'destructive',
      });
      return;
    }
    
    setIsSending(true);
    const result = await sendInvitationEmail({
      party,
      attendees,
    });
    setIsSending(false);

    if (result.success) {
      toast({
        title: 'Invitations envoyées !',
        description: `Les invitations pour "${party.name}" sont en cours d'envoi.`,
      });
    } else {
       toast({
        title: "Erreur d'envoi",
        description: result.error,
        variant: 'destructive',
      });
    }
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
        <div className='flex gap-2'>
          <Button variant="outline" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" onClick={() => onDelete(party.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleInvite} disabled={isSending}>
          {isSending ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isSending ? 'Envoi...' : 'Inviter'}
        </Button>
      </CardFooter>
    </Card>
  );
}
