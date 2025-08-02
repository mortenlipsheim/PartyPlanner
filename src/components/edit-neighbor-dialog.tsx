'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Neighbor } from '@/lib/types';

const neighborSchema = z.object({
  address: z.string().min(5, { message: 'Veuillez saisir une adresse valide.' }),
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères.' }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }).optional().or(z.literal('')),
  phone: z.string().optional(),
});

type EditNeighborFormValues = z.infer<typeof neighborSchema>;

interface EditNeighborDialogProps {
  neighbor: Neighbor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNeighborUpdate: (neighbor: Neighbor) => void;
}

export function EditNeighborDialog({ neighbor, open, onOpenChange, onNeighborUpdate }: EditNeighborDialogProps) {
  const form = useForm<EditNeighborFormValues>({
    resolver: zodResolver(neighborSchema),
    defaultValues: {
      address: neighbor.address,
      name: neighbor.name,
      email: neighbor.email,
      phone: neighbor.phone,
    },
  });

  useEffect(() => {
    form.reset(neighbor);
  }, [neighbor, form]);

  const onSubmit = (values: EditNeighborFormValues) => {
    onNeighborUpdate({ ...neighbor, ...values });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Modifier un voisin</DialogTitle>
          <DialogDescription>
            Mettez à jour les informations de votre voisin.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Rue de la Paix" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom(s)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="ex: Les Martin, Jeanne Dupont..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail (Optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="nom@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone (Optionnel)</FormLabel>
                  <FormControl>
                    <Input placeholder="06 12 34 56 78" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
