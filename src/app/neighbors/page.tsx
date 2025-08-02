'use client';

import { useState } from 'react';
import { Neighbor } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { NeighborTable } from '@/components/neighbor-table';
import { AddNeighborDialog } from '@/components/add-neighbor-dialog';

const initialNeighbors: Neighbor[] = [
  { id: '1', name: 'The Smiths', address: '123 Maple St', email: 'smith@example.com', phone: '555-1234' },
  { id: '2', name: 'Jane Doe', address: '456 Oak Ave', email: 'jane.d@example.com', phone: '555-5678' },
  { id: '3', name: 'The Garcias', address: '789 Pine Ln', email: 'garcia.fam@example.com', phone: '555-9101' },
  { id: '4', name: 'Bob Johnson', address: '101 Birch Rd', email: 'bobbyj@example.com', phone: '555-1121' },
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
        <h1 className="text-4xl font-headline text-gray-800 dark:text-gray-200">Neighbor Registry</h1>
        <AddNeighborDialog onNeighborCreate={handleAddNeighbor} open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Neighbor
            </Button>
        </AddNeighborDialog>
      </div>
      <NeighborTable neighbors={neighbors} onDelete={handleDeleteNeighbor} />
    </div>
  );
}
