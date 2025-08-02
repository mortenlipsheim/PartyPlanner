'use client';

import { Party } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, MapPin, MenuSquare, Trash2, Send } from 'lucide-react';

interface PartyCardProps {
  party: Party;
  onDelete: (id: string) => void;
}

export function PartyCard({ party, onDelete }: PartyCardProps) {
  const handleInvite = () => {
    toast({
      title: 'Invitations envoyées !',
      description: `Les invitations pour "${party.name}" ont été envoyées.`,
    });
  };

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
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
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
