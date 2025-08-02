'use client';

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
  DialogTrigger,
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
});

type AddNeighborFormValues = z.infer<typeof neighborSchema>;

interface AddNeighborDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNeighborCreate: (neighbor: Omit<Neighbor, 'id' | 'email' | 'phone'>) => void;
}

export function AddNeighborDialog({ children, open, onOpenChange, onNeighborCreate }: AddNeighborDialogProps) {
  const form = useForm<AddNeighborFormValues>({
    resolver: zodResolver(neighborSchema),
    defaultValues: {
      address: '',
      name: '',
    },
  });

  const onSubmit = (values: AddNeighborFormValues) => {
    onNeighborCreate(values);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Ajouter un voisin</DialogTitle>
          <DialogDescription>
            Saisissez l'adresse et le nom de votre voisin pour l'ajouter au registre.
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
            <DialogFooter>
              <Button type="submit">Ajouter un voisin</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
