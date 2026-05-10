'use client';

import { useMemo, useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from '@/components/ui/dialog';
import { useManifestEngine } from '@/hooks/use-manifest-engine';
import { Loader2, Users, Printer, MapPin, Bus, ShieldCheck, FileText, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Trip } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { formatDate } from '@/lib/formatters';

interface TripManifestDialogProps {
    tripId: string | null;
    trip?: Trip | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * @component TripManifestDialog
 * @description THE SECURE SOVEREIGN MANIFEST (STERILIZED - SC-705)
 * [SC-705]: Relocated to components/carrier/ for structural hygiene.
 * Protocol 16: Pure presentation of official data.
 */
export function TripManifestDialog({ tripId, trip, open, onOpenChange }: TripManifestDialogProps) {
    const locale = useLocale();
    const { generateManifest, isGenerating, manifestError } = useManifestEngine();
    const [secureData, setSecureData] = useState<any>(null);

    useEffect(() => {
        if (open && tripId) {
            generateManifest(tripId).then(data => {
                if (data) setSecureData(data);
            });
        } else if (!open) {
            setSecureData(null);
        }
    }, [open, tripId, generateManifest]);

    const handlePrint = () => {
        if (typeof window !== 'undefined') {
            window.print();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[95vh] flex flex-col p-0 overflow-hidden border-0 shadow-2xl">

                {/* Navigation Bar (Invisible during print) */}
                <div className="p-4 border-b bg-background flex justify-between items-center no-print">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary/10 p-2 rounded-full text-primary">
                            <Users className="h-5 w-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg">كشف الركاب الرسمي</DialogTitle>
                            <DialogDescription className="text-[10px]">Secure Official Manifest v3.5 [SC-705]</DialogDescription>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {secureData && (
                            <Button onClick={handlePrint} variant="default" size="sm" className="gap-2 bg-turquoise text-black hover:bg-turquoise/90 font-bold">
                                <Printer className="h-4 w-4" />
                                طباعة الكشف
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* The Official Document */}
                <div className="flex-1 min-h-0 bg-white dark:bg-slate-950 overflow-hidden print-manifest-container">
                    <ScrollArea className="h-full">
                        {isGenerating ? (
                            <div className="flex flex-col items-center justify-center py-24 gap-4 opacity-40">
                                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                                <p className="font-bold text-black dark:text-white">جاري تجميع البيانات السحابية وتوثيق الهوية...</p>
                            </div>
                        ) : manifestError ? (
                            <div className="p-12 text-center text-destructive">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p className="font-bold">{manifestError}</p>
                            </div>
                        ) : secureData ? (
                            <div className="p-6 md:p-10 space-y-8 max-w-3xl mx-auto text-black dark:text-white">

                                {/* Header */}
                                <div className="flex justify-between items-start border-b-4 border-black pb-6">
                                    <div className="space-y-1 text-right">
                                        <h1 className="text-4xl font-black tracking-tighter">SAFAR GATE</h1>
                                        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">International Passenger Manifest</p>
                                        <p className="text-lg font-bold text-primary mt-2">{secureData.officialHeader.officeName}</p>
                                        <p className="text-xs opacity-60">Tel: {secureData.officialHeader.officePhone}</p>
                                    </div>
                                    <div className="text-left space-y-1 text-xs font-mono">
                                        <p>TRIP REF: {secureData.tripDetails.id.slice(-8).toUpperCase()}</p>
                                        <p>PRINTED: {formatDate(secureData.generatedAt, 'dd/MM/yyyy HH:mm', locale)}</p>
                                    </div>
                                </div>

                                {/* Operational Details */}
                                <div className="grid grid-cols-2 gap-8 text-sm">
                                    <div className="space-y-3 text-right">
                                        <h3 className="font-bold flex items-center gap-2 border-b border-black/10 pb-1 justify-end uppercase">
                                            Carrier Identity <ShieldCheck className="h-4 w-4" />
                                        </h3>
                                        <p><span className="opacity-60">Captain:</span> <span className="font-bold">{secureData.officialHeader.carrierName}</span></p>
                                        <p><span className="opacity-60">National ID:</span> <span className="font-bold ltr">{secureData.officialHeader.carrierNationalId}</span></p>
                                        <p><span className="opacity-60">Plate:</span> <span className="font-bold ltr">{secureData.officialHeader.plateNumber}</span></p>
                                    </div>
                                    <div className="space-y-3 text-right">
                                        <h3 className="font-bold flex items-center gap-2 border-b border-black/10 pb-1 justify-end uppercase">
                                            Route Summary <MapPin className="h-4 w-4" />
                                        </h3>
                                        <p className="text-lg font-black">
                                            {getCityName(secureData.tripDetails.origin, locale)}
                                            <span className="mx-2 opacity-30">◄</span>
                                            {getCityName(secureData.tripDetails.destination, locale)}
                                        </p>
                                        <p><span className="opacity-60">Departure:</span> <span className="font-bold">{formatDate(secureData.tripDetails.departureDate, 'dd/MM/yyyy', locale)}</span></p>
                                    </div>
                                </div>

                                {/* Passenger Table */}
                                <div className="space-y-4">
                                    <h3 className="font-bold flex items-center gap-2 border-b-2 border-black pb-2 text-xl justify-end">
                                        قائمة الركاب المعتمدة <Users className="h-5 w-5" />
                                    </h3>

                                    <table className="w-full text-xs border-collapse">
                                        <thead>
                                            <tr className="bg-slate-100">
                                                <th className="w-8 border border-black/10 p-2">#</th>
                                                <th className="text-right border border-black/10 p-2">Passenger Full Name</th>
                                                <th className="text-center border border-black/10 p-2">Nationality</th>
                                                <th className="text-center border border-black/10 p-2">National ID / Passport</th>
                                                <th className="text-center border border-black/10 p-2">Type</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {secureData.passengersList.map((pax: any, idx: number) => (
                                                <tr key={idx} className="border-b border-black/5">
                                                    <td className="text-center font-mono py-3 border border-black/10">{idx + 1}</td>
                                                    <td className="font-bold py-3 px-2 border border-black/10 text-right">{pax.name}</td>
                                                    <td className="text-center py-3 border border-black/10">{pax.nationality}</td>
                                                    <td className="text-center font-mono py-3 border border-black/10 font-bold">{pax.documentNumber}</td>
                                                    <td className="text-center py-3 border border-black/10 opacity-60">
                                                        {pax.type === 'adult' ? 'Adult' : pax.type === 'minor' ? 'Minor' : 'Infant'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer */}
                                <div className="pt-12 grid grid-cols-2 gap-12 text-right">
                                    <div className="space-y-8">
                                        <p className="text-[8px] font-bold uppercase opacity-50 tracking-tighter">Captain & Office Final Seal / الختم والتوقيع</p>
                                        <div className="border-b-2 border-black w-48 h-12"></div>
                                    </div>
                                    <div className="flex flex-col items-start text-left space-y-2 opacity-20 grayscale">
                                        <ShieldCheck className="h-10 w-10" />
                                        <p className="text-[7px] font-black leading-none">SAFAR GATE<br />SOVEREIGN LOGISTICS</p>
                                    </div>
                                </div>

                            </div>
                        ) : (
                            <div className="p-24 text-center text-muted-foreground opacity-30 font-bold">بانتظار نداء السحابة...</div>
                        )}
                    </ScrollArea>
                </div>
            </DialogContent>
        </Dialog>
    );
}
