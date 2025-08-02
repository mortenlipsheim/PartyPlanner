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
import { MoreHorizontal, Mail, Trash2, Phone } from 'lucide-react';
import { Neighbor } from '@/lib/types';

interface NeighborTableProps {
  neighbors: Neighbor[];
  onDelete: (id: string) => void;
}

export function NeighborTable({ neighbors, onDelete }: NeighborTableProps) {
  const handleSendEmail = (neighbor: Neighbor) => {
    if (neighbor.email) {
      window.location.href = `mailto:${neighbor.email}`;
    } else {
      toast({
        title: 'E-mail non disponible',
        description: `Aucune adresse e-mail n'est enregistrée pour ${neighbor.name}.`,
        variant: 'destructive',
      });
    }
  };

  const handleCall = (neighbor: Neighbor) => {
    if (neighbor.phone) {
      window.location.href = `tel:${neighbor.phone}`;
    } else {
      toast({
        title: 'Téléphone non disponible',
        description: `Aucun numéro de téléphone n'est enregistré pour ${neighbor.name}.`,
        variant: 'destructive',
      });
    }
  };


  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Adresse</TableHead>
            <TableHead>Nom(s)</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Téléphone</TableHead>
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
                <TableCell>{neighbor.email}</TableCell>
                <TableCell>{neighbor.phone}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendEmail(neighbor)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Envoyer un e-mail
                      </DropdownMenuItem>
                       <DropdownMenuItem onClick={() => handleCall(neighbor)}>
                        <Phone className="mr-2 h-4 w-4" />
                        Appeler
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
              <TableCell colSpan={5} className="h-24 text-center">
                Aucun voisin trouvé. Ajoutez-en un pour commencer !
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
