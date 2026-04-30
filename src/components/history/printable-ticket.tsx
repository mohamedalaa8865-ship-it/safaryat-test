
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Printer, MapPin, Bus, User, CreditCard, ShieldCheck, FileText, X, Clock } from 'lucide-react';
import type { Booking, Trip, UserProfile } from '@/lib/data';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { formatDate } from '@/lib/formatters';
import { addHours } from 'date-fns';
import QRCode from "react-qr-code";
import { useState, useEffect } from 'react';

interface PrintableTicketProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  trip: Trip;
  booking: Booking;
  carrier: UserProfile | null;
  isAdminView?: boolean; // [SC-533] Audit Watermark Prop
}

/**
 * @component PrintableTicket
 * @description THE OFFICIAL TRAVELER VOUCHER (STERILIZED - SC-529)
 * High-contrast, sterile document for physical evidence.
 * [SC-533] Injected: Sovereign Audit Watermark for admin views.
 * [SC-547-FIX] Defer timestamp to prevent Hydration mismatch.
 */
export function PrintableTicket({ isOpen, onOpenChange, trip, booking, carrier, isAdminView }: PrintableTicketProps) {
  const locale = useLocale();
  const [mounted, setMounted] = useState(false);
  const [currentTimestamp, setCurrentTimestamp] = useState('');

  useEffect(() => {
    setMounted(true);
    setCurrentTimestamp(new Date().toISOString());
  }, []);

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
        window.print();
    }
  };

  const depositPercentage = trip.depositPercentage || 20;
  const depositAmount = (booking.totalPrice * (depositPercentage / 100)).toFixed(2);
  const remainingAmount = (booking.totalPrice - parseFloat(depositAmount)).toFixed(2);

  const arrivalDate = trip.estimatedDurationHours ? addHours(new Date(trip.departureDate), trip.estimatedDurationHours) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] flex flex-col p-0 overflow-hidden border-0 shadow-2xl">
        <div className="p-4 border-b bg-background flex justify-between items-center no-print">
            <div className="flex items-center gap-2">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                    <Printer className="h-5 w-5" />
                </div>
                <div>
                    <DialogTitle className="text-lg">تذكرة العبور الرسمية</DialogTitle>
                    <p className="text-[10px] text-muted-foreground">Official Traveler Voucher v3.5</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button onClick={handlePrint} size="sm" className="gap-2 bg-turquoise text-black hover:bg-turquoise/90 font-bold">
                    <Printer className="h-4 w-4" />
                    طباعة التذكرة
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
        </div>

        <div className="flex-1 min-h-0 bg-white dark:bg-slate-950 overflow-y-auto print-manifest-container relative">
            {/* [SC-533] Sovereign Audit Watermark */}
            {isAdminView && (
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none z-0">
                    <span className="text-9xl font-black rotate-[-45deg] uppercase tracking-widest text-red-600">AUDIT COPY</span>
                </div>
            )}
            
            <div className="p-8 space-y-8 max-w-2xl mx-auto text-black smart-ticket-print relative z-10">
                
                <div className="flex justify-between items-start border-b-4 border-black pb-4">
                    <div className="space-y-1 text-right">
                        <h1 className="text-4xl font-black tracking-tighter italic">SAFAR GATE</h1>
                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">Traveler Official Voucher</p>
                    </div>
                    <div className="bg-black p-3 rounded text-white text-center">
                        <p className="text-[8px] font-bold">RESERVATION ID</p>
                        <p className="text-xl font-black font-mono leading-none tracking-tighter">{booking.id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                <div className="text-center py-6 border-b border-black/10">
                    <div className="flex items-center justify-center gap-6 text-4xl font-black">
                        <span>{getCityName(trip.origin, locale)}</span>
                        <span className="opacity-20 text-2xl">←</span>
                        <span>{getCityName(trip.destination, locale)}</span>
                    </div>
                    <p className="text-sm font-bold text-muted-foreground mt-2 uppercase tracking-widest">
                        {formatDate(trip.departureDate, 'EEEE, dd MMMM yyyy', locale)}
                    </p>
                    
                    {arrivalDate && (
                        <div className="mt-4 flex items-center justify-center gap-4 bg-slate-50 p-2 rounded-full border border-black/5">
                            <span className="text-xs font-bold">{formatDate(trip.departureDate, 'hh:mm a', locale)}</span>
                            <div className="flex-1 flex items-center gap-1 border-b-2 border-dashed border-black/20 relative min-w-[100px]">
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] font-black bg-white px-2">DURATION: {trip.estimatedDurationHours}H</span>
                                <Clock className="h-3 w-3 opacity-20 mx-auto" />
                            </div>
                            <span className="text-xs font-black text-primary">ETA: {formatDate(arrivalDate, 'hh:mm a', locale)}</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-6 border-r border-black/10 pr-10">
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-1"><MapPin className="h-3 w-3"/> Pickup Point</p>
                            <p className="font-bold text-sm leading-tight">{trip.meetingPoint || 'Main Terminal'}</p>
                        </div>
                        <div className="space-y-1.5">
                            <p className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-1"><Bus className="h-3 w-3"/> Transport Details</p>
                            {carrier?.officeName && (
                                <p className="font-bold text-sm border-b border-black/10 pb-1 mb-1">
                                    {carrier.officeName}
                                    {carrier.officePhone && <span className="opacity-60 font-normal ml-2">({carrier.officePhone})</span>}
                                </p>
                            )}
                            <p className="font-bold text-sm">{carrier?.vehicleType || trip.vehicleType} | {carrier?.plateNumber || trip.vehiclePlateNumber || 'N/A'}</p>
                            {carrier?.sidePanelNumber && (
                                <p className="text-xs bg-slate-100 p-1 inline-block border border-black/20 font-black mt-1">
                                    Side Number: {carrier.sidePanelNumber}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-1"><CreditCard className="h-3 w-3"/> Financial Balance</p>
                            <div className="bg-slate-50 p-3 rounded border border-black/10 space-y-1">
                                <div className="flex justify-between text-xs"><span>Total Price:</span> <span>{booking.totalPrice} {booking.currency}</span></div>
                                <div className="flex justify-between text-xs text-green-700 font-bold border-b border-black/5 pb-1">
                                    <span>Deposit (Paid):</span> <span>-{depositAmount} {booking.currency}</span>
                                </div>
                                <div className="flex justify-between font-black text-sm pt-1">
                                    <span>Due to Captain:</span> <span className="text-lg underline decoration-double">{remainingAmount} {booking.currency}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 flex flex-col">
                        <div className="space-y-3 flex-1">
                            <p className="text-[10px] font-bold uppercase opacity-50 flex items-center gap-1"><User className="h-3 w-3"/> Passenger Identity</p>
                            {booking.passengersDetails?.map((pax, idx) => (
                                <div key={idx} className="flex justify-between items-start border-b border-black/5 pb-2">
                                    <div className="space-y-0.5">
                                        <p className="font-bold text-sm">{pax.name}</p>
                                        <p className="text-[10px] opacity-60 font-mono flex items-center gap-1">
                                            <FileText className="h-2 w-2" /> ID: {pax.documentNumber}
                                        </p>
                                    </div>
                                    <span className="text-[8px] font-black border border-black/20 rounded px-1 flex items-center h-4">
                                        {pax.nationality}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center p-4 bg-white border-2 border-black/5 rounded-2xl shadow-inner">
                            <QRCode value={booking.id} size={100} />
                        </div>
                    </div>
                </div>

                <div className="pt-10 border-t-2 border-black/10 space-y-6">
                    <div className="bg-slate-100 p-4 rounded-lg text-center shadow-sm">
                        <p className="text-[10px] font-bold text-black leading-relaxed" dir="rtl">
                            "تم اصدار هذه التذكرة من الوسيط المشترك بين الناقل والراكب ومنصة سفريات وهي خالية المسؤولية وفق براءة الورقة البيضاء في شروط وسياسة سفريات التي وافق عليها الطرفين الناقل والراكب"
                        </p>
                    </div>
                    
                    <div className="flex items-center justify-between opacity-30 grayscale filter">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-8 w-8" />
                            <div className="text-[8px] font-black leading-none uppercase">
                                Safar Gate<br/>Sovereign Verified
                            </div>
                        </div>
                        <p className="text-[7px] font-mono">TIMESTAMP: {mounted ? currentTimestamp : '...'}</p>
                    </div>
                </div>

            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
