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
    name: 'Summer Block Party',
    description: 'Let\'s celebrate summer with a neighborhood-wide block party! Grills will be running, music will be playing, and good times will be had.',
    date: new Date('2024-08-15T16:00:00'),
    place: 'Community Park Pavilion',
    menu: ['Hot Dogs', 'Hamburgers', 'Corn on the Cob', 'Watermelon', 'Potato Salad', 'Brownies'],
    comments: 'Bring your favorite lawn chairs and games!',
  },
  {
    id: '2',
    name: 'Halloween Spooktacular',
    description: 'A spooky and fun get-together for all ages. Costume contest for kids and adults!',
    date: new Date('2024-10-31T18:00:00'),
    place: 'The Miller\'s Driveway (123 Oak St)',
    menu: ['Chili', 'Corndogs', 'Pumpkin Cookies', 'Apple Cider'],
    comments: 'Best costume wins a prize!',
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
        <h1 className="text-4xl font-headline text-gray-800 dark:text-gray-200">Upcoming Parties</h1>
        <CreatePartyDialog onPartyCreate={handleAddParty} open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Party
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
          <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400">No Parties Planned</h2>
          <p className="mt-2 text-muted-foreground">Why not create one and get the fun started?</p>
        </div>
      )}
    </div>
  );
}
