'use client';

import { toast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Mail, Trash2 } from 'lucide-react';
import { Neighbor } from '@/lib/types';

interface NeighborTableProps {
  neighbors: Neighbor[];
  onDelete: (id: string) => void;
}

export function NeighborTable({ neighbors, onDelete }: NeighborTableProps) {
  const handleSendEmail = (name: string) => {
    toast({
      title: 'Action non disponible',
      description: `La fonctionnalité d'envoi d'e-mail a été désactivée.`,
      variant: 'destructive',
    });
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Adresse</TableHead>
            <TableHead>Nom(s)</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {neighbors.length > 0 ? (
            neighbors.map((neighbor) => (
              <TableRow key={neighbor.id}>
                <TableCell className="font-medium">{neighbor.address}</TableCell>
                <TableCell style={{ whiteSpace: 'pre-wrap' }}>{neighbor.name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendEmail(neighbor.name)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Envoyer un e-mail de mise à jour
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(neighbor.id)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="h-24 text-center">
                Aucun voisin trouvé. Ajoutez-en un pour commencer !
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
