
'use client';

import { useState, useEffect } from 'react';
import { Party, Neighbor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle, UtensilsCrossed } from 'lucide-react';
import { CreatePartyDialog } from '@/components/create-party-dialog';
import { EditPartyDialog } from '@/components/edit-party-dialog';
import { PartyCard } from '@/components/party-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getParties, createParty, updateParty, deleteParty } from '@/lib/party-service';
import { getNeighbors } from '@/lib/neighbor-service';

export default function Home() {
  const [parties, setParties] = useState<Party[]>([]);
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingParty, setEditingParty] = useState<Party | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [partiesData, neighborsData] = await Promise.all([getParties(), getNeighbors()]);
      const sortedParties = partiesData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setParties(sortedParties);
      setNeighbors(neighborsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // This function will be called by child components to trigger a data refresh
  const refreshData = async () => {
    const partiesData = await getParties();
    setParties(partiesData.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }

  const handleAddParty = async (newPartyData: Omit<Party, 'id'>) => {
    await createParty(newPartyData);
    await refreshData();
  };
  
  const handleUpdateParty = async (partyId: string, updatedPartyData: Partial<Omit<Party, 'id'>>) => {
    await updateParty(partyId, updatedPartyData);
    setEditingParty(null);
    await refreshData();
  };

  const handleDeleteParty = async (partyId: string) => {
    await deleteParty(partyId);
    await refreshData();
  };
  
  const handleAttendeeChange = async (partyId: string, updatedAttendees: Party['attendees']) => {
    await updateParty(partyId, { attendees: updatedAttendees });
    await refreshData();
  };

  const handleMenuChange = async (partyId: string, updatedMenu: Party['menu']) => {
    await updateParty(partyId, { menu: updatedMenu });
    await refreshData();
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-headline text-gray-800 dark:text-gray-200">Prochaines Fêtes</h1>
        <CreatePartyDialog 
          neighbors={neighbors} 
          onPartyCreate={handleAddParty} 
          open={isCreateDialogOpen} 
          onOpenChange={setCreateDialogOpen}
        >
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Créer une Fête
          </Button>
        </CreatePartyDialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[450px] w-full" />)}
        </div>
      ) : parties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {parties.map((party) => (
            <PartyCard 
              key={party.id} 
              party={party} 
              neighbors={neighbors}
              onEdit={() => setEditingParty(party)}
              onDelete={handleDeleteParty}
              onAttendeeChange={handleAttendeeChange}
              onMenuChange={handleMenuChange}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <UtensilsCrossed className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-4 text-2xl font-semibold text-gray-600 dark:text-gray-400">Aucune Fête de Prévue</h2>
          <p className="mt-2 text-muted-foreground">Pourquoi ne pas en créer une pour commencer à vous amuser ?</p>
        </div>
      )}
      
      {editingParty && (
        <EditPartyDialog
          party={editingParty}
          neighbors={neighbors}
          onPartyUpdate={handleUpdateParty}
          open={!!editingParty}
          onOpenChange={(open) => !open && setEditingParty(null)}
        />
      )}
    </div>
  );
}
