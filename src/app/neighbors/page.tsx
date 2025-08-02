'use client';

import { useState } from 'react';
import { Neighbor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NeighborTable } from '@/components/neighbor-table';
import { AddNeighborDialog } from '@/components/add-neighbor-dialog';

const initialNeighbors: Neighbor[] = [
  { id: '1', name: 'Les Martins', address: '123 Rue de la Paix', email: 'martin@example.com', phone: '0612345678' },
  { id: '2', name: 'Jeanne Dupont', address: '456 Avenue des Champs-Élysées', email: 'jeanne.d@example.com', phone: '0687654321' },
  { id: '3', name: 'La famille Garcia', address: '789 Boulevard Saint-Germain', email: 'garcia.fam@example.com', phone: '0700112233' },
  { id: '4', name: 'Robert Leroy', address: '101 Place de la Concorde', email: 'robert.l@example.com', phone: '0655443322' },
];

export default function NeighborsPage() {
  const [neighbors, setNeighbors] = useState<Neighbor[]>(initialNeighbors);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const handleAddNeighbor = (newNeighbor: Omit<Neighbor, 'id'>) => {
    setNeighbors((prev) => [...prev, { ...newNeighbor, id: (prev.length + 1).toString() }]);
  };

  const handleDeleteNeighbor = (id: string) => {
    setNeighbors((prev) => prev.filter((n) => n.id !== id));
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
      <NeighborTable neighbors={neighbors} onDelete={handleDeleteNeighbor} />
    </div>
  );
}
