'use client';

import { useState, useEffect } from 'react';
import { Neighbor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NeighborTable } from '@/components/neighbor-table';
import { AddNeighborDialog } from '@/components/add-neighbor-dialog';
import { EditNeighborDialog } from '@/components/edit-neighbor-dialog';
import { getNeighbors, createNeighbor, updateNeighbor, deleteNeighbor } from '@/lib/neighbor-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function NeighborsPage() {
  const [neighbors, setNeighbors] = useState<Neighbor[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [editingNeighbor, setEditingNeighbor] = useState<Neighbor | null>(null);

  const fetchAndSetNeighbors = async () => {
    setLoading(true);
    const neighborsData = await getNeighbors();
    setNeighbors(neighborsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchAndSetNeighbors();
  }, []);

  const handleAddNeighbor = async (newNeighbor: Omit<Neighbor, 'id'>) => {
    await createNeighbor(newNeighbor);
    await fetchAndSetNeighbors();
  };

  const handleUpdateNeighbor = async (updatedNeighbor: Neighbor) => {
    await updateNeighbor(updatedNeighbor.id, updatedNeighbor);
    setEditingNeighbor(null);
    await fetchAndSetNeighbors();
  };

  const handleDeleteNeighbor = async (id: string) => {
    await deleteNeighbor(id);
    await fetchAndSetNeighbors();
  };

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-headline text-gray-800 dark:text-gray-200">Registre des Voisins</h1>
        <AddNeighborDialog onNeighborCreate={handleAddNeighbor} open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Ajouter un voisin
            </Button>
        </AddNeighborDialog>
      </div>
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <NeighborTable neighbors={neighbors} onEdit={setEditingNeighbor} onDelete={handleDeleteNeighbor} />
      )}
      {editingNeighbor && (
        <EditNeighborDialog
          neighbor={editingNeighbor}
          onNeighborUpdate={handleUpdateNeighbor}
          open={!!editingNeighbor}
          onOpenChange={(open) => !open && setEditingNeighbor(null)}
        />
      )}
    </div>
  );
}
