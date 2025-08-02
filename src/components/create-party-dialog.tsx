'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
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
import { Party } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

const partySchema = z.object({
  name: z.string().min(3, { message: 'Le nom de la fête doit comporter au moins 3 caractères.' }),
  description: z.string().min(10, { message: 'La description doit comporter au moins 10 caractères.' }),
  date: z.date({ required_error: 'Une date est requise.' }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, { message: "L\\'heure doit être au format HH:mm." }),
  place: z.string().min(3, { message: 'Un lieu est requis.' }),
  menu: z.array(z.object({ value: z.string().min(1, { message: 'Le plat ne peut pas être vide.' }) })),
  comments: z.string().optional(),
});

type CreatePartyFormValues = z.infer<typeof partySchema>;

interface CreatePartyDialogProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPartyCreate: (party: Omit<Party, 'id'>) => void;
}

export function CreatePartyDialog({ children, open, onOpenChange, onPartyCreate }: CreatePartyDialogProps) {
  const form = useForm<CreatePartyFormValues>({
    resolver: zodResolver(partySchema),
    defaultValues: {
      name: '',
      description: '',
      place: '',
      time: '18:00',
      menu: [{ value: 'Burgers' }, { value: 'Hot Dogs' }],
      comments: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'menu',
  });

  const onSubmit = (values: CreatePartyFormValues) => {
    const [hours, minutes] = values.time.split(':').map(Number);
    const combinedDate = new Date(values.date);
    combinedDate.setHours(hours);
    combinedDate.setMinutes(minutes);

    const { time, ...partyData } = values;

    onPartyCreate({ ...partyData, date: combinedDate, menu: values.menu.map(item => item.value) });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">Créer une nouvelle fête</DialogTitle>
          <DialogDescription>Remplissez les détails ci-dessous pour planifier votre prochaine rencontre.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                            {field.value ? format(field.value, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
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
                <FormDescription>Listez les plats que vous prévoyez de servir.</FormDescription>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name={`menu.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                    <FormControl><Input {...field} placeholder={`Plat #${index + 1}`} /></FormControl>
                                    <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ value: '' })} >
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
            <DialogFooter className="sticky bottom-0 bg-background/95 py-4 -mx-6 px-6">
              <Button type="submit">Créer la Fête</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
