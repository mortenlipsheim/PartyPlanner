'use client';

import { Party, Neighbor, MenuItem, Attendee } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, MenuSquare, Trash2, Send, Users, UserCheck, Pencil, Utensils, UserX, UserPlus, MailQuestion, ChefHat, CheckCircle2 } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { sendInvitationEmail } from '@/lib/server-actions';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface PartyCardProps {
  party: Party;
  neighbors: Neighbor[];
  onEdit: () => void;
  onDelete: (id: string) => void;
  onAttendeeChange: (partyId: string, attendees: Attendee[]) => void;
  onMenuChange: (partyId: string, menu: MenuItem[]) => void;
}

export function PartyCard({ party, neighbors, onEdit, onDelete, onAttendeeChange, onMenuChange }: PartyCardProps) {
  const [isSending, setIsSending] = useState(false);
  const [selectedToInvite, setSelectedToInvite] = useState<Set<string>>(new Set());

  const attendeesMap = useMemo(() => new Map(party.attendees.map(a => [a.neighborId, a.status])), [party.attendees]);
  const neighborsMap = useMemo(() => new Map(neighbors.map(n => [n.id, n])), [neighbors]);

  const attending = party.attendees.filter(a => a.status === 'attending');
  const declined = party.attendees.filter(a => a.status === 'declined');
  const invited = party.attendees.filter(a => a.status === 'invited');

  const handleInviteSelectionChange = (neighborId: string, checked: boolean) => {
    setSelectedToInvite(prev => {
      const newSet = new Set(prev);
      if (checked) newSet.add(neighborId);
      else newSet.delete(neighborId);
      return newSet;
    });
  }

  const handleInvite = async () => {
    const neighborsToInvite = neighbors.filter(n => selectedToInvite.has(n.id));

    if (neighborsToInvite.length === 0) {
      toast({ title: "Aucun invité sélectionné", description: "Veuillez sélectionner au moins un voisin à inviter.", variant: 'destructive' });
      return;
    }

    setIsSending(true);

    const result = await sendInvitationEmail({ party, neighbors: neighborsToInvite });
    
    if (result.success) {
      const newAttendees: Attendee[] = [...party.attendees];
      neighborsToInvite.forEach(n => {
        if (!attendeesMap.has(n.id)) {
          newAttendees.push({ neighborId: n.id, status: 'invited' });
        } else {
            const existing = newAttendees.find(a => a.neighborId === n.id);
            if(existing) existing.status = 'invited';
        }
      });
      await onAttendeeChange(party.id, newAttendees);
      setSelectedToInvite(new Set()); // Reset selection
      toast({ title: 'Invitations envoyées !', description: `Les invitations pour "${party.name}" sont en cours d'envoi.` });
    } else {
      toast({ title: "Erreur d'envoi", description: result.error, variant: 'destructive' });
    }
    
    setIsSending(false);
  };

  const handleMenuAssignment = (itemIndex: number, neighborId: string) => {
    const newMenu = [...party.menu];
    newMenu[itemIndex].broughtBy = neighborId;
    onMenuChange(party.id, newMenu);
  }

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
        <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{party.place}</span>
        </div>
        
        <Accordion type="multiple" className="w-full space-y-2">
            <AccordionItem value="menu">
                <AccordionTrigger>
                    <div className="flex items-center gap-2"><Utensils className="h-4 w-4"/>Menu ({party.menu.length})</div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-3 pt-2">
                        {party.menu.map((item, index) => (
                            <div key={index} className="flex items-center justify-between gap-4">
                                <span className="text-sm">{item.name}</span>
                                <Select onValueChange={(neighborId) => handleMenuAssignment(index, neighborId)} value={item.broughtBy ?? undefined}>
                                    <SelectTrigger className="w-[180px] h-8">
                                        <ChefHat className="h-4 w-4 mr-2 text-muted-foreground"/>
                                        <SelectValue placeholder="Qui apporte ?" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="personne">Personne</SelectItem>
                                        {neighbors.map(n => <SelectItem key={n.id} value={n.id}>{n.name.split(',')[0]}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>

            <AccordionItem value="invites">
                <AccordionTrigger>
                    <div className="flex items-center gap-2"><UserPlus className="h-4 w-4"/>Inviter des voisins</div>
                </AccordionTrigger>
                <AccordionContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2 pt-2">
                        {neighbors.map(neighbor => (
                            <div key={neighbor.id} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`inv-${party.id}-${neighbor.id}`}
                                    onCheckedChange={(checked) => handleInviteSelectionChange(neighbor.id, !!checked)}
                                    disabled={attendeesMap.get(neighbor.id) === 'attending'}
                                />
                                <Label htmlFor={`inv-${party.id}-${neighbor.id}`} className='font-normal text-sm w-full flex items-center justify-between'>
                                    {neighbor.name}
                                    {attendeesMap.get(neighbor.id) === 'attending' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                </Label>
                            </div>
                        ))}
                    </div>
                </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="attendees">
                <AccordionTrigger>
                    <div className="flex items-center gap-2"><Users className="h-4 w-4"/>Suivi des réponses</div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                        <UserCheck className="h-4 w-4"/> Participants ({attending.length})
                    </div>
                    <ul className="list-disc pl-6 text-sm text-muted-foreground mt-1">
                        {attending.map(a => <li key={a.neighborId}>{neighborsMap.get(a.neighborId)?.name ?? 'Inconnu'}</li>)}
                    </ul>

                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium mt-3">
                        <UserX className="h-4 w-4"/> Absents ({declined.length})
                    </div>
                     <ul className="list-disc pl-6 text-sm text-muted-foreground mt-1">
                        {declined.map(a => <li key={a.neighborId}>{neighborsMap.get(a.neighborId)?.name ?? 'Inconnu'}</li>)}
                    </ul>

                    <div className="flex items-center gap-2 text-sm text-blue-600 font-medium mt-3">
                        <MailQuestion className="h-4 w-4"/> En attente ({invited.length})
                    </div>
                     <ul className="list-disc pl-6 text-sm text-muted-foreground mt-1">
                        {invited.map(a => <li key={a.neighborId}>{neighborsMap.get(a.neighborId)?.name ?? 'Inconnu'}</li>)}
                    </ul>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter className="flex justify-between gap-2 border-t pt-6">
        <div className='flex gap-2'>
          <Button variant="outline" size="icon" onClick={onEdit}>
              <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => onDelete(party.id)} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/50">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleInvite} disabled={isSending || selectedToInvite.size === 0}>
          {isSending ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          {isSending ? 'Envoi...' : `Inviter (${selectedToInvite.size})`}
        </Button>
      </CardFooter>
    </Card>
  );
}
