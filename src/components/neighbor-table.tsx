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
      title: 'Email Sent!',
      description: `An update request email has been sent to ${name}.`,
    });
  };

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="hidden sm:table-cell">Email</TableHead>
            <TableHead className="hidden md:table-cell">Phone</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {neighbors.length > 0 ? (
            neighbors.map((neighbor) => (
              <TableRow key={neighbor.id}>
                <TableCell className="font-medium">{neighbor.name}</TableCell>
                <TableCell>{neighbor.address}</TableCell>
                <TableCell className="hidden sm:table-cell">{neighbor.email}</TableCell>
                <TableCell className="hidden md:table-cell">{neighbor.phone}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleSendEmail(neighbor.name)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Send Update Email
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(neighbor.id)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No neighbors found. Add one to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
