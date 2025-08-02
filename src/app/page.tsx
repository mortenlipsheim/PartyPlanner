'use client';

import { useState } from 'react';
import { Party } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CreatePartyDialog } from '@/components/create-party-dialog';
import { PartyCard } from '@/components/party-card';

const initialParties: Party[] = [
  {
    id: '1',
    name: 'Fête de quartier d\'été',
    description: 'Célébrons l\'été avec une fête de quartier ! Barbecues, musique et bonne humeur seront au rendez-vous.',
    date: new Date('2024-08-15T16:00:00'),
    place: 'Pavillon du parc communautaire',
    menu: ['Hot-dogs', 'Hamburgers', 'Maïs grillé', 'Pastèque', 'Salade de pommes de terre', 'Brownies'],
    comments: 'Apportez vos chaises de jardin et vos jeux préférés !',
  },
  {
    id: '2',
    name: 'Spécial Halloween',
    description: 'Une rencontre effrayante et amusante pour tous les âges. Concours de costumes pour enfants et adultes !',
    date: new Date('2024-10-31T18:00:00'),
    place: 'L\'allée des Miller (123 Rue du Chêne)',
    menu: ['Chili', 'Saucisses de maïs', 'Biscuits à la citrouille', 'Cidre de pomme'],
    comments: 'Le meilleur costume remporte un prix !',
  },
];


export default function Home() {
  const [parties, setParties] = useState<Party[]>(initialParties);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const handleAddParty = (newParty: Omit<Party, 'id'>) => {
    setParties((prevParties) => [
      ...prevParties,
      { ...newParty, id: (prevParties.length + 1).toString() },
    ]);
  };
  
  const handleDeleteParty = (partyId: string) => {
    setParties(parties.filter(p => p.id !== partyId));
  };


  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-headline text-gray-800 dark:text-gray-200">Prochaines Fêtes</h1>
        <CreatePartyDialog onPartyCreate={handleAddParty} open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une Fête
          </Button>
        </CreatePartyDialog>
      </div>

      {parties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parties.map((party) => (
            <PartyCard key={party.id} party={party} onDelete={handleDeleteParty} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">Aucune Fête de Prévue</h2>
          <p className="mt-2 text-muted-foreground">Pourquoi ne pas en créer une pour commencer à vous amuser ?</p>
        </div>
      )}
    </div>
  );
}
