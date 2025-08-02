'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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

const partySchema = z.object({
  name: z.string().min(3, { message: 'Party name must be at least 3 characters.' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters.' }),
  date: z.date({ required_error: 'A date is required.' }),
  place: z.string().min(3, { message: 'A location is required.' }),
  menu: z.array(z.object({ value: z.string().min(1, { message: 'Menu item cannot be empty.' }) })),
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
      menu: [{ value: 'Burgers' }, { value: 'Hot Dogs' }],
      comments: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'menu',
  });

  const onSubmit = (values: CreatePartyFormValues) => {
    onPartyCreate({ ...values, menu: values.menu.map(item => item.value) });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-headline">Create a New Party</DialogTitle>
          <DialogDescription>Fill in the details below to plan your next get-together.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Party Name</FormLabel>
                    <FormControl><Input placeholder="e.g., Summer BBQ" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Date & Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}
                          >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem><FormLabel>Location</FormLabel>
                  <FormControl><Input placeholder="e.g., Community Park" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem><FormLabel>Description</FormLabel>
                  <FormControl><Textarea placeholder="Describe the party..." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormItem>
                <FormLabel>Menu Items</FormLabel>
                <FormDescription>List the food items you plan to have.</FormDescription>
                <div className="space-y-2">
                    {fields.map((field, index) => (
                        <div key={field.id} className="flex items-center gap-2">
                            <FormField
                                control={form.control}
                                name={`menu.${index}.value`}
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                    <FormControl><Input {...field} placeholder={`Menu item #${index + 1}`} /></FormControl>
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
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Menu Item
                </Button>
            </FormItem>

            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Comments</FormLabel>
                  <FormControl><Textarea placeholder="e.g., Bring your own chairs." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit">Create Party</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
