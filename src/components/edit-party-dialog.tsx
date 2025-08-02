
'use client';

import { useEffect, useMemo } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format as formatDate } from 'date-fns';
import { fr } from 'date-fns/locale';
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, PlusCircle, Trash2 } from 'lucide-react';
import { Party, Neighbor } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const partySchema = z.object({
  name: z.string().min(3, { message: 'Le nom de la fête doit comporter au moins 3 caractères.' }),
  description: z.string().min(10, { message: 'La description doit comporter au moins 10 caractères.' }),
  date: z.date({ required_error: 'Une date est requise.' }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "L'heure doit être au format HH:mm." }),
  place: z.string().min(3, { message: 'Un lieu est requis.' }),
  menu: z.array(z.object({ 
    name: z.string().min(1, { message: 'Le plat ne peut pas être vide.' }),
    broughtBy: z.string().nullable(),
  })),
  comments: z.string().optional(),
});

type EditPartyFormValues = z.infer<typeof partySchema>;

interface EditPartyDialogProps {
  party: Party;
  neighbors: Neighbor[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPartyUpdate: (partyId: string, party: Partial<Omit<Party, 'id'>>) => void;
}

export function EditPartyDialog({ party, neighbors, open, onOpenChange, onPartyUpdate }: EditPartyDialogProps) {
  const form = useForm<EditPartyFormValues>({
    resolver: zodResolver(partySchema),
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: 'menu',
  });
  
  const attendingNeighbors = useMemo(() => {
    const attendingIds = new Set(party.attendees.filter(a => a.status === 'attending').map(a => a.neighborId));
    return neighbors.filter(n => attendingIds.has(n.id));
  }, [party.attendees, neighbors]);
  
  useEffect(() => {
    if (party) {
      form.reset({
        name: party.name,
        description: party.description,
        date: new Date(party.date),
        time: formatDate(new Date(party.date), 'HH:mm'),
        place: party.place,
        menu: party.menu.map(item => ({ name: item.name, broughtBy: item.broughtBy })),
        comments: party.comments,
      });
    }
  }, [party, form, open]); // Added open to reset form on re-open

  const handleMenuAssignment = (itemIndex: number, neighborId: string) => {
    const newMenu = form.getValues('menu');
    const finalNeighborId = neighborId === 'personne' ? null : neighborId;
    
    // Ensure one person brings at most one item from the menu
    if (finalNeighborId) {
      newMenu.forEach((item, idx) => {
          if (item.broughtBy === finalNeighborId && idx !== itemIndex) {
            // This person was bringing something else, un-assign it
            update(idx, { ...newMenu[idx], broughtBy: null });
          }
      });
    }

    // Assign the new item
    update(itemIndex, { ...newMenu[itemIndex], broughtBy: finalNeighborId });
  };


  const onSubmit = (values: EditPartyFormValues) => {
    const [hours, minutes] = values.time.split(':').map(Number);
    const combinedDate = new Date(values.date);
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);

    const { time, ...partyData } = values;

    onPartyUpdate(party.id, { 
      ...partyData, 
      date: combinedDate, 
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Modifier la fête</DialogTitle>
          <DialogDescription>Mettez à jour les détails de votre fête.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom de la fête</FormLabel>
                  <FormControl><Input placeholder="ex: Barbecue d'été" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? formatDate(field.value, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar locale={fr} mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Heure</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem><FormLabel>Lieu</FormLabel>
                  <FormControl><Input placeholder="ex: Parc communautaire" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Décrivez la fête..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
                <FormLabel>Plats du menu</FormLabel>
                <FormDescription>Listez les plats et assignez qui les apporte.</FormDescription>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name={`menu.${index}.name`}
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                    <FormControl><Input {...field} placeholder={`Plat #${index + 1}`} /></FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name={`menu.${index}.broughtBy`}
                                render={({ field }) => (
                                    <FormItem>
                                      <Select onValueChange={(value) => handleMenuAssignment(index, value)} value={field.value ?? 'personne'}>
                                          <FormControl>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Qui apporte ?" />
                                            </SelectTrigger>
                                          </FormControl>
                                          <SelectContent>
                                            <SelectItem value="personne">Personne</SelectItem>
                                            {attendingNeighbors.map(n => <SelectItem key={n.id} value={n.id}>{n.name.split('\n')[0].split(',')[0]}</SelectItem>)}
                                          </SelectContent>
                                      </Select>
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', broughtBy: null })} >
                    <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un plat
                </Button>
            </FormItem>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaires supplémentaires</FormLabel>
                  <FormControl><Textarea placeholder="ex: Apportez vos propres chaises." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <Button type="submit">Enregistrer les modifications</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
