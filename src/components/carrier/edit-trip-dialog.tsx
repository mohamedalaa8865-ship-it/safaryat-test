'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Trip } from '@/lib/data';
import { Loader2, Save, Calendar as CalendarIcon, AlertCircle, Facebook, Instagram, Video } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useTranslations } from 'next-intl';

interface EditTripDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip | null;
  onConfirm: (trip: Trip, data: EditTripFormValues) => Promise<void>;
}

const editTripSchema = z.object({
  price: z.coerce.number().positive('السعر يجب أن يكون رقماً موجباً'),
  availableSeats: z.coerce.number().int().min(0, 'عدد المقاعد لا يمكن أن يكون سالباً'),
  departureDate: z.date({ required_error: 'تاريخ المغادرة مطلوب' }),
  facebookProfile: z.string().url('رابط فيسبوك غير صالح').optional().or(z.literal('')),
  instagramProfile: z.string().url('رابط إنستغرام غير صالح').optional().or(z.literal('')),
  tiktokProfile: z.string().url('رابط تيك توك غير صالح').optional().or(z.literal('')),
});

export type EditTripFormValues = z.infer<typeof editTripSchema>;

export function EditTripDialog({ isOpen, onOpenChange, trip, onConfirm }: EditTripDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const t = useTranslations('editTripDialog')
  const form = useForm<EditTripFormValues>({
    resolver: zodResolver(editTripSchema),
    defaultValues: {
      price: 0,
      availableSeats: 0,
      facebookProfile: '',
      instagramProfile: '',
      tiktokProfile: '',
    },
  });

  useEffect(() => {
    if (trip && isOpen) {
      const departureDate = trip.departureDate
        ? (typeof (trip.departureDate as any).toDate === 'function'
          ? (trip.departureDate as any).toDate()
          : new Date(trip.departureDate))
        : new Date();

      form.reset({
        price: trip.price || 0,
        availableSeats: trip.availableSeats || 0,
        departureDate,
        facebookProfile: trip.facebookProfile || '',
        instagramProfile: trip.instagramProfile || '',
        tiktokProfile: trip.tiktokProfile || '',
      });
    }
  }, [trip, isOpen, form]);

  const onSubmit = async (data: EditTripFormValues) => {
    if (!trip) return;
    setIsSubmitting(true);
    try {
      await onConfirm(trip, data);
      onOpenChange(false);
    } catch (e) {
      console.error("[Sovereign Edit] Update Rupture:", e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const bookedCount = trip ? (trip.vehicleCapacity || 0) - (trip.availableSeats || 0) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-black pt-3"> {t('title')} </DialogTitle>
          <DialogDescription className="flex items-center gap-2  pt-2 text-xs font-bold">
            {t('desc')}
          </DialogDescription>
        </DialogHeader>

        {bookedCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-3 animate-in zoom-in">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-[10px] font-black text-amber-800 uppercase"> {t('seatsWarningTitle')} </p>
              <p className="text-[11px] text-amber-700 font-bold">  {t('seatsWarningDesc', { count: bookedCount })}</p>
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs font-bold"> {t('date')} </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full h-12 justify-between font-bold rounded-xl",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value && !isNaN(new Date(field.value).getTime())
                            ? format(new Date(field.value), "PPP")
                            : <span>{t('selectDate')} </span>
                          }
                          <CalendarIcon className="h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            date.setHours(12, 0, 0, 0);
                            field.onChange(date);
                          }
                        }}
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">{t('price')} ({trip?.currency})</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-12 bg-muted/20 font-black text-lg rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="availableSeats"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold">المقاعد المتاحة</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} className="h-12 bg-muted/20 font-black text-lg rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
            </div>

            <div className="space-y-4 bg-primary/5 p-4 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-black text-primary uppercase">  {t('socialLinks')}</p>
              <div className="space-y-3">
                <FormField control={form.control} name="facebookProfile" render={({ field }) => (
                  <FormItem><FormControl><div className="relative"><Facebook className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" /><Input placeholder={t('facebookPlaceholder')} className="pl-10 h-10 text-[10px] ltr rounded-xl" {...field} /></div></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="instagramProfile" render={({ field }) => (
                  <FormItem><FormControl><div className="relative"><Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-600" /><Input placeholder={t('instagramPlaceholder')} className="pl-10 h-10 text-[10px] ltr rounded-xl" {...field} /></div></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>{t('cancel')}</Button>
              <Button type="submit" disabled={isSubmitting} className="font-black h-12 shadow-lg rounded-xl px-8">
                {isSubmitting ? (
                  <><Loader2 className="ml-2 h-4 w-4 animate-spin" /> {t('saving')}</>
                ) : (
                  <><Save className="ml-2 h-4 w-4" />  {t('save')}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
