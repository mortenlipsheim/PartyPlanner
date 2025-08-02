
'use client';

import { useEffect, useState, useCallback } from 'react';
import { Party } from '@/lib/types';
import { getParty, assignMenuItem, updateAttendeeStatus } from '@/lib/party-service';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { ChefHat, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RsvpPageProps {
  params: {
    partyId: string;
    neighborId: string;
  };
}

export default function RsvpPage({ params }: RsvpPageProps) {
  const { partyId, neighborId } = params;
  const [party, setParty] = useState<Party | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  
  const fetchPartyAndConfirmAttendance = useCallback(async () => {
    setLoading(true);
    try {
      // First, confirm attendance
      await updateAttendeeStatus(partyId, neighborId, 'attending');
      // Then, fetch the updated party details
      const partyData = await getParty(partyId);
      setParty(partyData);
    } catch (error) {
      console.error('Failed to fetch party details or confirm attendance', error);
      toast({ title: 'Erreur', description: "Impossible de confirmer votre présence ou de charger les détails de la fête.", variant: 'destructive'});
    } finally {
      setLoading(false);
    }
  }, [partyId, neighborId, toast]);

  useEffect(() => {
    fetchPartyAndConfirmAttendance();
  }, [fetchPartyAndConfirmAttendance]);

  const availableMenuItems = party?.menu.filter(item => item.broughtBy === null) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMenuItem) {
        toast({ title: 'Aucun plat sélectionné', description: "Veuillez choisir un plat à apporter ou sélectionner l'option pour ne rien apporter.", variant: 'destructive'});
        return;
    }
    setSubmitting(true);
    try {
      if (selectedMenuItem !== 'none') {
        await assignMenuItem(partyId, selectedMenuItem, neighborId);
      }
      setSubmitted(true);
    } catch (error) {
        console.error('Failed to assign menu item', error);
        toast({ title: 'Erreur', description: "Une erreur s'est produite lors de l'enregistrement de votre choix.", variant: 'destructive'});
    } finally {
        setSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-10 w-3/4 self-center" />
                <Skeleton className="h-6 w-1/2" />
                <div className="space-y-3 pt-4">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
                <Skeleton className="h-12 w-full mt-4" />
            </div>
      </div>
    );
  }

  if (!party) {
    return <div className="text-center py-10">Fête non trouvée.</div>;
  }
  
  if (submitted) {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4 text-center">
             <div className="bg-card p-8 rounded-xl shadow-lg">
                <PartyPopper className="h-16 w-16 text-primary mx-auto mb-4" />
                <h1 className="text-3xl font-bold font-headline mb-2">Merci pour votre réponse !</h1>
                <p className="text-muted-foreground max-w-md">
                    Votre participation et votre contribution au menu ont bien été enregistrées.
                    Nous avons hâte de vous voir à la fête : <span className="font-semibold text-foreground">{party.name}</span>!
                </p>
             </div>
        </div>
    )
  }

  return (
    <div className="container mx-auto flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center font-headline mb-2">Participation à : {party.name}</h1>
        <p className="text-center text-muted-foreground mb-6">Merci de nous dire ce que vous aimeriez apporter !</p>
        
        {availableMenuItems.length > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-6">
                <RadioGroup onValueChange={setSelectedMenuItem} value={selectedMenuItem} className="space-y-3">
                    <p className="font-semibold text-lg flex items-center gap-2"><ChefHat className="h-5 w-5 text-primary"/> Plats disponibles</p>
                    {availableMenuItems.map((item) => (
                        <div key={item.name} className="flex items-center space-x-3 p-3 rounded-lg border bg-background has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary transition-colors">
                            <RadioGroupItem value={item.name} id={item.name} />
                            <Label htmlFor={item.name} className="text-base font-normal w-full cursor-pointer">{item.name}</Label>
                        </div>
                    ))}
                    <div className="flex items-center space-x-3 p-3 rounded-lg border bg-background has-[[data-state=checked]]:bg-primary/10 has-[[data-state=checked]]:border-primary transition-colors">
                        <RadioGroupItem value="none" id="none" />
                        <Label htmlFor="none" className="text-base font-normal w-full cursor-pointer">Je viens, mais je n'apporte rien du menu</Label>
                    </div>
                </RadioGroup>
                <Button type="submit" className="w-full text-lg py-6" disabled={submitting}>
                    {submitting ? 'Enregistrement...' : 'Confirmer ma contribution'}
                </Button>
            </form>
        ) : (
            <div className="text-center p-6 bg-background rounded-lg">
                <p className="text-lg">Tous les plats du menu ont déjà été choisis !</p>
                <p className="text-muted-foreground mt-2">Merci pour votre enthousiasme. Votre participation est confirmée.</p>
                 <Button onClick={() => setSubmitted(true)} className="mt-4">Terminer</Button>
            </div>
        )}
      </div>
    </div>
  );
}
