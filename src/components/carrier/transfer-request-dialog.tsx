// // // // // 'use client';

// // // // // import { useState, useMemo } from 'react';
// // // // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { ScrollArea } from '@/components/ui/scroll-area';
// // // // // import { useToast } from '@/hooks/use-toast';
// // // // // import type { Trip, UserProfile, TransferRequest } from '@/lib/data';
// // // // // import { Loader2, Send, Users, ArrowRight, UserCheck, Search } from 'lucide-react';
// // // // // import { useCollection, useFirestore, useUser, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
// // // // // import { collection, query, where, serverTimestamp } from 'firebase/firestore';
// // // // // import { Input } from '../ui/input';
// // // // // import { Avatar, AvatarFallback } from '../ui/avatar';
// // // // // import { Skeleton } from '../ui/skeleton';
// // // // // import { getCityName } from '@/lib/constants';
// // // // // import { useLocale } from 'next-intl';

// // // // // interface TransferRequestDialogProps {
// // // // //     isOpen: boolean;
// // // // //     onOpenChange: (isOpen: boolean) => void;
// // // // //     trip: Trip | null;
// // // // // }

// // // // // function CarrierListItem({ carrier, onSelect, isSelected }: { carrier: UserProfile, onSelect: (carrier: UserProfile) => void, isSelected: boolean }) {
// // // // //     return (
// // // // //         <div
// // // // //             className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50 border-transparent'} border-2`}
// // // // //             onClick={() => onSelect(carrier)}
// // // // //         >
// // // // //             <div className="flex items-center gap-3">
// // // // //                 <Avatar>
// // // // //                     {/* [SCR-2026-031]: تأمين استخراج الحرف الأول من الاسم */}
// // // // //                     <AvatarFallback>{carrier.firstName?.charAt(0) || 'U'}</AvatarFallback>
// // // // //                 </Avatar>
// // // // //                 <div>
// // // // //                     {/* [SCR-2026-031]: تأمين عرض الاسم الكامل لمنع ظهور undefined */}
// // // // //                     <p className="font-bold text-sm">{carrier.firstName || ''} {carrier.lastName || ''}</p>
// // // // //                     <p className="text-xs text-muted-foreground">يعمل على نفس الخط</p>
// // // // //                 </div>
// // // // //             </div>
// // // // //             {isSelected && <UserCheck className="h-5 w-5 text-primary" />}
// // // // //         </div>
// // // // //     )
// // // // // }

// // // // // /**
// // // // //  * @component TransferRequestDialog
// // // // //  * @description THE REINFORCED TRANSFER HUB (SC-806 V2.6.1)
// // // // //  * Enforced useMemoFirebase for queries to ensure zero redundant reads and resolve memo errors.
// // // // //  */
// // // // // export function TransferRequestDialog({ isOpen, onOpenChange, trip }: TransferRequestDialogProps) {
// // // // //     const { user } = useUser();
// // // // //     const firestore = useFirestore();
// // // // //     const { toast } = useToast();
// // // // //     const locale = useLocale();

// // // // //     const [isSubmitting, setIsSubmitting] = useState(false);
// // // // //     const [selectedCarrier, setSelectedCarrier] = useState<UserProfile | null>(null);
// // // // //     const [searchTerm, setSearchTerm] = useState('');

// // // // //     const carriersQuery = useMemoFirebase(() => {
// // // // //         if (!firestore || !trip || !user) return null;
// // // // //         return query(
// // // // //             collection(firestore, 'users'),
// // // // //             where('role', '==', 'carrier'),
// // // // //             where('jurisdiction.origin', '==', trip.origin),
// // // // //             where('jurisdiction.destination', '==', trip.destination),
// // // // //         );
// // // // //     }, [firestore, trip, user]);

// // // // //     const { data: availableCarriers, isLoading } = useCollection<UserProfile>(carriersQuery);

// // // // //     const filteredCarriers = useMemo(() => {
// // // // //         if (!availableCarriers) return [];
// // // // //         return availableCarriers.filter(c =>
// // // // //             c.id !== user?.uid &&
// // // // //             (c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
// // // // //         );
// // // // //     }, [availableCarriers, searchTerm, user]);

// // // // //     const totalPassengers = useMemo(() => {
// // // // //         if (!trip?.bookingIds) return 0;
// // // // //         return trip.bookingIds.length;
// // // // //     }, [trip]);

// // // // //     const handleSendRequest = async () => {
// // // // //         if (!firestore || !user || !trip || !selectedCarrier) {
// // // // //             toast({ title: 'خطأ', description: 'الرجاء اختيار ناقل لإرسال العرض إليه', variant: 'destructive' });
// // // // //             return;
// // // // //         }
// // // // //         setIsSubmitting(true);

// // // // //         try {
// // // // //             const transferRequestsCollection = collection(firestore, 'transferRequests');

// // // // //             const newTransferRequest: Omit<TransferRequest, 'id'> = {
// // // // //                 originalTripId: trip.id,
// // // // //                 fromCarrierId: user.uid,
// // // // //                 toCarrierId: selectedCarrier.id,
// // // // //                 status: 'Pending',
// // // // //                 createdAt: serverTimestamp(),
// // // // //                 updatedAt: serverTimestamp(),
// // // // //                 tripId: trip.id,
// // // // //                 tripDetails: {
// // // // //                     origin: trip.origin,
// // // // //                     destination: trip.destination,
// // // // //                     departureDate: trip.departureDate,
// // // // //                     passengerCount: totalPassengers
// // // // //                 }
// // // // //             };

// // // // //             await addDocumentNonBlocking(transferRequestsCollection, newTransferRequest);

// // // // //             toast({
// // // // //                 title: 'تم إرسال طلب النقل بنجاح!',
// // // // //                 description: `تم إرسال طلب نقل الرحلة إلى الناقل ${selectedCarrier.firstName}.`,
// // // // //             });
// // // // //             onOpenChange(false);

// // // // //         } catch (error) {
// // // // //             toast({
// // // // //                 title: 'فشل إرسال الطلب',
// // // // //                 description: 'حدث خطأ أثناء إنشاء طلب النقل.',
// // // // //                 variant: 'destructive',
// // // // //             });
// // // // //         } finally {
// // // // //             setIsSubmitting(false);
// // // // //         }
// // // // //     };

// // // // //     return (
// // // // //         <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // // //             <DialogContent className="sm:max-w-md">
// // // // //                 <DialogHeader>
// // // // //                     <DialogTitle>طلب نقل رحلة وركابها</DialogTitle>
// // // // //                     <DialogDescription>
// // // // //                         اختر ناقلاً بديلاً من زملائك الذين يعملون على نفس خط السير.
// // // // //                     </DialogDescription>
// // // // //                 </DialogHeader>

// // // // //                 <div className="py-4 space-y-4">
// // // // //                     <div className="p-3 bg-muted rounded-lg border border-dashed text-sm">
// // // // //                         <p className="font-bold flex items-center justify-between">
// // // // //                             <span>
// // // // //                                 الرحلة: {getCityName(trip?.origin || '', locale)}
// // // // //                                 <ArrowRight className="inline h-3 w-3" />
// // // // //                                 {getCityName(trip?.destination || '', locale)}
// // // // //                             </span>
// // // // //                             <span className="flex items-center gap-1">
// // // // //                                 <Users className="h-4 w-4" /> {totalPassengers}
// // // // //                             </span>
// // // // //                         </p>
// // // // //                         <p className="text-xs text-muted-foreground pt-1">
// // // // //                             التاريخ: {trip?.departureDate ? new Date(trip.departureDate).toLocaleDateString('ar-SA') : '...'}
// // // // //                         </p>
// // // // //                     </div>

// // // // //                     <div className="relative">
// // // // //                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // // // //                         <Input
// // // // //                             placeholder="ابحث عن اسم الناقل..."
// // // // //                             value={searchTerm}
// // // // //                             onChange={(e) => setSearchTerm(e.target.value)}
// // // // //                             className="pl-10"
// // // // //                         />
// // // // //                     </div>

// // // // //                     <ScrollArea className="h-64 border rounded-md">
// // // // //                         <div className="p-2 space-y-1">
// // // // //                             {isLoading ? (
// // // // //                                 <div className="p-4 text-center text-muted-foreground">جاري تحميل قائمة الناقلين...</div>
// // // // //                             ) : filteredCarriers.length > 0 ? (
// // // // //                                 filteredCarriers.map(carrier => (
// // // // //                                     <CarrierListItem
// // // // //                                         key={carrier.id}
// // // // //                                         carrier={carrier}
// // // // //                                         onSelect={setSelectedCarrier}
// // // // //                                         isSelected={selectedCarrier?.id === carrier.id}
// // // // //                                     />
// // // // //                                 ))
// // // // //                             ) : (
// // // // //                                 <div className="p-4 text-center text-muted-foreground">لا يوجد ناقلون متاحون على هذا الخط حالياً.</div>
// // // // //                             )}
// // // // //                         </div>
// // // // //                     </ScrollArea>
// // // // //                 </div>

// // // // //                 <DialogFooter className="gap-2 sm:gap-0">
// // // // //                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>إلغاء</Button>
// // // // //                     <Button type="button" onClick={handleSendRequest} disabled={!selectedCarrier || isSubmitting}>
// // // // //                         {isSubmitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
// // // // //                         إرسال عرض نقل الرحلة
// // // // //                     </Button>
// // // // //                 </DialogFooter>
// // // // //             </DialogContent>
// // // // //         </Dialog>
// // // // //     );
// // // // // }

// // // // 'use client';

// // // // import { useState, useMemo } from 'react';
// // // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// // // // import { Button } from '@/components/ui/button';
// // // // import { ScrollArea } from '@/components/ui/scroll-area';
// // // // import { useToast } from '@/hooks/use-toast';
// // // // import type { Trip, UserProfile, TransferRequest } from '@/lib/data';
// // // // import { Loader2, Send, Users, ArrowRight, UserCheck, Search } from 'lucide-react';
// // // // import { useCollection, useFirestore, useUser, addDocumentNonBlocking, useMemoFirebase } from '@/firebase';
// // // // import { collection, query, where, serverTimestamp } from 'firebase/firestore';
// // // // import { Input } from '../ui/input';
// // // // import { Avatar, AvatarFallback } from '../ui/avatar';
// // // // import { Skeleton } from '../ui/skeleton';
// // // // import { getCityName } from '@/lib/constants';
// // // // import { useLocale } from 'next-intl';

// // // // interface TransferRequestDialogProps {
// // // //     isOpen: boolean;
// // // //     onOpenChange: (isOpen: boolean) => void;
// // // //     trip: Trip | null;
// // // // }

// // // // function CarrierListItem({ carrier, onSelect, isSelected }: { carrier: UserProfile, onSelect: (carrier: UserProfile) => void, isSelected: boolean }) {
// // // //     return (
// // // //         <div
// // // //             className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50 border-transparent'} border-2`}
// // // //             onClick={() => onSelect(carrier)}
// // // //         >
// // // //             <div className="flex items-center gap-3">
// // // //                 <Avatar>
// // // //                     {/* [SCR-2026-031]: تأمين استخراج الحرف الأول من الاسم */}
// // // //                     <AvatarFallback>{carrier.firstName?.charAt(0) || 'U'}</AvatarFallback>
// // // //                 </Avatar>
// // // //                 <div>
// // // //                     {/* [SCR-2026-031]: تأمين عرض الاسم الكامل لمنع ظهور undefined */}
// // // //                     <p className="font-bold text-sm">{carrier.firstName || ''} {carrier.lastName || ''}</p>
// // // //                     <p className="text-xs text-muted-foreground">يعمل على نفس الخط</p>
// // // //                 </div>
// // // //             </div>
// // // //             {isSelected && <UserCheck className="h-5 w-5 text-primary" />}
// // // //         </div>
// // // //     )
// // // // }

// // // // /**
// // // //  * @component TransferRequestDialog
// // // //  * @description THE REINFORCED TRANSFER HUB (SC-806 V2.6.1)
// // // //  * Enforced useMemoFirebase for queries to ensure zero redundant reads and resolve memo errors.
// // // //  */
// // // // export function TransferRequestDialog({ isOpen, onOpenChange, trip }: TransferRequestDialogProps) {
// // // //     const { user } = useUser();
// // // //     const firestore = useFirestore();
// // // //     const { toast } = useToast();
// // // //     const locale = useLocale();

// // // //     const [isSubmitting, setIsSubmitting] = useState(false);
// // // //     const [selectedCarrier, setSelectedCarrier] = useState<UserProfile | null>(null);
// // // //     const [searchTerm, setSearchTerm] = useState('');

// // // //     // [FIX]: بدل الاعتماد على jurisdiction (قد يكون غير مكتمل أو بصيغة مختلفة)،
// // // //     // نجلب الناقلين من خلال رحلاتهم الفعلية على نفس الخط (origin + destination).
// // // //     const tripsOnRouteQuery = useMemoFirebase(() => {
// // // //         if (!firestore || !trip || !user) return null;
// // // //         return query(
// // // //             collection(firestore, 'trips'),
// // // //             where('origin', '==', trip.origin),
// // // //             where('destination', '==', trip.destination),
// // // //             where('status', 'in', ['Planned', 'Ongoing', 'In-Transit']),
// // // //         );
// // // //     }, [firestore, trip, user]);

// // // //     const { data: tripsOnRoute, isLoading } = useCollection<Trip>(tripsOnRouteQuery);

// // // //     const filteredCarriers = useMemo(() => {
// // // //         if (!tripsOnRoute) return [];

// // // //         // استخرج الناقلين الفريدين من الرحلات على نفس الخط
// // // //         const carrierMap = new Map<string, UserProfile>();
// // // //         for (const t of tripsOnRoute) {
// // // //             const carrierId = t.carrierId || t.userId;
// // // //             if (!carrierId || carrierId === user?.uid) continue;
// // // //             if (!carrierMap.has(carrierId)) {
// // // //                 // نبني UserProfile مؤقت من بيانات الرحلة
// // // //                 carrierMap.set(carrierId, {
// // // //                     id: carrierId,
// // // //                     firstName: t.carrierName?.split(' ')[0] || '',
// // // //                     lastName: t.carrierName?.split(' ').slice(1).join(' ') || '',
// // // //                     role: 'carrier',
// // // //                 } as UserProfile);
// // // //             }
// // // //         }

// // // //         const carriers = Array.from(carrierMap.values());
// // // //         return carriers.filter(c =>
// // // //         (c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // // //             c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
// // // //         );
// // // //     }, [tripsOnRoute, searchTerm, user]);

// // // //     const totalPassengers = useMemo(() => {
// // // //         if (!trip?.bookingIds) return 0;
// // // //         return trip.bookingIds.length;
// // // //     }, [trip]);

// // // //     const handleSendRequest = async () => {
// // // //         if (!firestore || !user || !trip || !selectedCarrier) {
// // // //             toast({ title: 'خطأ', description: 'الرجاء اختيار ناقل لإرسال العرض إليه', variant: 'destructive' });
// // // //             return;
// // // //         }
// // // //         setIsSubmitting(true);

// // // //         try {
// // // //             const transferRequestsCollection = collection(firestore, 'transferRequests');

// // // //             const newTransferRequest: Omit<TransferRequest, 'id'> = {
// // // //                 originalTripId: trip.id,
// // // //                 fromCarrierId: user.uid,
// // // //                 toCarrierId: selectedCarrier.id,
// // // //                 status: 'pending',
// // // //                 createdAt: serverTimestamp(),
// // // //                 updatedAt: serverTimestamp(),
// // // //                 tripId: trip.id,
// // // //                 tripDetails: {
// // // //                     origin: trip.origin,
// // // //                     destination: trip.destination,
// // // //                     departureDate: trip.departureDate,
// // // //                     passengerCount: totalPassengers
// // // //                 }
// // // //             };

// // // //             await addDocumentNonBlocking(transferRequestsCollection, newTransferRequest);

// // // //             toast({
// // // //                 title: 'تم إرسال طلب النقل بنجاح!',
// // // //                 description: `تم إرسال طلب نقل الرحلة إلى الناقل ${selectedCarrier.firstName}.`,
// // // //             });
// // // //             onOpenChange(false);

// // // //         } catch (error) {
// // // //             toast({
// // // //                 title: 'فشل إرسال الطلب',
// // // //                 description: 'حدث خطأ أثناء إنشاء طلب النقل.',
// // // //                 variant: 'destructive',
// // // //             });
// // // //         } finally {
// // // //             setIsSubmitting(false);
// // // //         }
// // // //     };

// // // //     return (
// // // //         <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // // //             <DialogContent className="sm:max-w-md">
// // // //                 <DialogHeader>
// // // //                     <DialogTitle>طلب نقل رحلة وركابها</DialogTitle>
// // // //                     <DialogDescription>
// // // //                         اختر ناقلاً بديلاً من زملائك الذين يعملون على نفس خط السير.
// // // //                     </DialogDescription>
// // // //                 </DialogHeader>

// // // //                 <div className="py-4 space-y-4">
// // // //                     <div className="p-3 bg-muted rounded-lg border border-dashed text-sm">
// // // //                         <p className="font-bold flex items-center justify-between">
// // // //                             <span>
// // // //                                 الرحلة: {getCityName(trip?.origin || '', locale)}
// // // //                                 <ArrowRight className="inline h-3 w-3" />
// // // //                                 {getCityName(trip?.destination || '', locale)}
// // // //                             </span>
// // // //                             <span className="flex items-center gap-1">
// // // //                                 <Users className="h-4 w-4" /> {totalPassengers}
// // // //                             </span>
// // // //                         </p>
// // // //                         <p className="text-xs text-muted-foreground pt-1">
// // // //                             التاريخ: {trip?.departureDate ? new Date(trip.departureDate).toLocaleDateString('ar-SA') : '...'}
// // // //                         </p>
// // // //                     </div>

// // // //                     <div className="relative">
// // // //                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // // //                         <Input
// // // //                             placeholder="ابحث عن اسم الناقل..."
// // // //                             value={searchTerm}
// // // //                             onChange={(e) => setSearchTerm(e.target.value)}
// // // //                             className="pl-10"
// // // //                         />
// // // //                     </div>

// // // //                     <ScrollArea className="h-64 border rounded-md">
// // // //                         <div className="p-2 space-y-1">
// // // //                             {isLoading ? (
// // // //                                 <div className="p-4 text-center text-muted-foreground">جاري تحميل قائمة الناقلين...</div>
// // // //                             ) : filteredCarriers.length > 0 ? (
// // // //                                 filteredCarriers.map(carrier => (
// // // //                                     <CarrierListItem
// // // //                                         key={carrier.id}
// // // //                                         carrier={carrier}
// // // //                                         onSelect={setSelectedCarrier}
// // // //                                         isSelected={selectedCarrier?.id === carrier.id}
// // // //                                     />
// // // //                                 ))
// // // //                             ) : (
// // // //                                 <div className="p-4 text-center text-muted-foreground">لا يوجد ناقلون متاحون على هذا الخط حالياً.</div>
// // // //                             )}
// // // //                         </div>
// // // //                     </ScrollArea>
// // // //                 </div>

// // // //                 <DialogFooter className="gap-2 sm:gap-0">
// // // //                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>إلغاء</Button>
// // // //                     <Button type="button" onClick={handleSendRequest} disabled={!selectedCarrier || isSubmitting}>
// // // //                         {isSubmitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
// // // //                         إرسال عرض نقل الرحلة
// // // //                     </Button>
// // // //                 </DialogFooter>
// // // //             </DialogContent>
// // // //         </Dialog>
// // // //     );
// // // // }
// // // 'use client';

// // // import { useState, useMemo } from 'react';
// // // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// // // import { Button } from '@/components/ui/button';
// // // import { ScrollArea } from '@/components/ui/scroll-area';
// // // import { useToast } from '@/hooks/use-toast';
// // // import type { Trip, UserProfile, TransferRequest } from '@/lib/data';
// // // import { Loader2, Send, Users, ArrowRight, UserCheck, Search } from 'lucide-react';
// // // import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
// // // import { collection, query, where, serverTimestamp, addDoc } from 'firebase/firestore';
// // // import { Input } from '@/components/ui/input';
// // // import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// // // import { getCityName } from '@/lib/constants';
// // // import { useLocale } from 'next-intl';

// // // interface TransferRequestDialogProps {
// // //     isOpen: boolean;
// // //     onOpenChange: (isOpen: boolean) => void;
// // //     trip: Trip | null;
// // // }

// // // function CarrierListItem({ carrier, onSelect, isSelected }: { carrier: UserProfile, onSelect: (carrier: UserProfile) => void, isSelected: boolean }) {
// // //     return (
// // //         <div
// // //             className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50 border-transparent'} border-2`}
// // //             onClick={() => onSelect(carrier)}
// // //         >
// // //             <div className="flex items-center gap-3">
// // //                 <Avatar>
// // //                     {/* [SCR-2026-031]: تأمين استخراج الحرف الأول من الاسم */}
// // //                     <AvatarFallback>{carrier.firstName?.charAt(0) || 'U'}</AvatarFallback>
// // //                 </Avatar>
// // //                 <div>
// // //                     {/* [SCR-2026-031]: تأمين عرض الاسم الكامل لمنع ظهور undefined */}
// // //                     <p className="font-bold text-sm">{carrier.firstName || ''} {carrier.lastName || ''}</p>
// // //                     <p className="text-xs text-muted-foreground">يعمل على نفس الخط</p>
// // //                 </div>
// // //             </div>
// // //             {isSelected && <UserCheck className="h-5 w-5 text-primary" />}
// // //         </div>
// // //     )
// // // }

// // // /**
// // //  * @component TransferRequestDialog
// // //  * @description THE REINFORCED TRANSFER HUB (SC-806 V2.6.1)
// // //  * Enforced useMemoFirebase for queries to ensure zero redundant reads and resolve memo errors.
// // //  */
// // // export function TransferRequestDialog({ isOpen, onOpenChange, trip }: TransferRequestDialogProps) {
// // //     const { user } = useUser();
// // //     const firestore = useFirestore();
// // //     const { toast } = useToast();
// // //     const locale = useLocale();

// // //     const [isSubmitting, setIsSubmitting] = useState(false);
// // //     const [selectedCarrier, setSelectedCarrier] = useState<UserProfile | null>(null);
// // //     const [searchTerm, setSearchTerm] = useState('');

// // //     // [FIX]: بدل الاعتماد على jurisdiction (قد يكون غير مكتمل أو بصيغة مختلفة)،
// // //     // نجلب الناقلين من خلال رحلاتهم الفعلية على نفس الخط (origin + destination).
// // //     const tripsOnRouteQuery = useMemoFirebase(() => {
// // //         if (!firestore || !trip || !user) return null;
// // //         return query(
// // //             collection(firestore, 'trips'),
// // //             where('origin', '==', trip.origin),
// // //             where('destination', '==', trip.destination),
// // //             where('status', 'in', ['Planned', 'Ongoing', 'In-Transit']),
// // //         );
// // //     }, [firestore, trip, user]);

// // //     const { data: tripsOnRoute, isLoading } = useCollection<Trip>(tripsOnRouteQuery);

// // //     const filteredCarriers = useMemo(() => {
// // //         if (!tripsOnRoute) return [];

// // //         // استخرج الناقلين الفريدين من الرحلات على نفس الخط
// // //         const carrierMap = new Map<string, UserProfile>();
// // //         for (const t of tripsOnRoute) {
// // //             const carrierId = t.carrierId || t.userId;
// // //             if (!carrierId || carrierId === user?.uid) continue;
// // //             if (!carrierMap.has(carrierId)) {
// // //                 // نبني UserProfile مؤقت من بيانات الرحلة
// // //                 carrierMap.set(carrierId, {
// // //                     id: carrierId,
// // //                     firstName: t.carrierName?.split(' ')[0] || '',
// // //                     lastName: t.carrierName?.split(' ').slice(1).join(' ') || '',
// // //                     role: 'carrier',
// // //                 } as UserProfile);
// // //             }
// // //         }

// // //         const carriers = Array.from(carrierMap.values());
// // //         return carriers.filter(c =>
// // //         (c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// // //             c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
// // //         );
// // //     }, [tripsOnRoute, searchTerm, user]);

// // //     const totalPassengers = useMemo(() => {
// // //         if (!trip?.bookingIds) return 0;
// // //         return trip.bookingIds.length;
// // //     }, [trip]);

// // //     const handleSendRequest = async () => {
// // //         if (!firestore || !user || !trip || !selectedCarrier) {
// // //             toast({ title: 'خطأ', description: 'الرجاء اختيار ناقل لإرسال العرض إليه', variant: 'destructive' });
// // //             return;
// // //         }
// // //         setIsSubmitting(true);

// // //         try {
// // //             const transferRequestsCollection = collection(firestore, 'transferRequests');

// // //             const newTransferRequest: Omit<TransferRequest, 'id'> = {
// // //                 originalTripId: trip.id,
// // //                 fromCarrierId: user.uid,
// // //                 toCarrierId: selectedCarrier.id,
// // //                 status: 'pending',
// // //                 createdAt: serverTimestamp(),
// // //                 updatedAt: serverTimestamp(),
// // //                 tripId: trip.id,
// // //                 tripDetails: {
// // //                     origin: trip.origin,
// // //                     destination: trip.destination,
// // //                     departureDate: trip.departureDate,
// // //                     passengerCount: totalPassengers
// // //                 }
// // //             };

// // //             console.log('[TransferRequest] DEBUG:', {
// // //                 'user.uid': user.uid,
// // //                 'selectedCarrier.id': selectedCarrier.id,
// // //                 'fromCarrierId': user.uid,
// // //                 'toCarrierId': selectedCarrier.id,
// // //                 'trip.id': trip.id,
// // //             });

// // //             const docRef = await addDoc(transferRequestsCollection, newTransferRequest);
// // //             console.log('[TransferRequest] Created successfully:', docRef.id);

// // //             toast({
// // //                 title: 'تم إرسال طلب النقل بنجاح!',
// // //                 description: `تم إرسال طلب نقل الرحلة إلى الناقل ${selectedCarrier.firstName}.`,
// // //             });
// // //             onOpenChange(false);

// // //         } catch (error: any) {
// // //             console.error('[TransferRequest] Failed:', error?.code, error?.message);
// // //             toast({
// // //                 title: 'فشل إرسال الطلب',
// // //                 description: error?.code === 'permission-denied'
// // //                     ? 'ليس لديك صلاحية إرسال طلب نقل. تحقق من إعدادات Firestore.'
// // //                     : `خطأ: ${error?.message || 'حدث خطأ أثناء إنشاء طلب النقل.'}`,
// // //                 variant: 'destructive',
// // //             });
// // //         } finally {
// // //             setIsSubmitting(false);
// // //         }
// // //     };

// // //     return (
// // //         <Dialog open={isOpen} onOpenChange={onOpenChange}>
// // //             <DialogContent className="sm:max-w-md">
// // //                 <DialogHeader>
// // //                     <DialogTitle>طلب نقل رحلة وركابها</DialogTitle>
// // //                     <DialogDescription>
// // //                         اختر ناقلاً بديلاً من زملائك الذين يعملون على نفس خط السير.
// // //                     </DialogDescription>
// // //                 </DialogHeader>

// // //                 <div className="py-4 space-y-4">
// // //                     <div className="p-3 bg-muted rounded-lg border border-dashed text-sm">
// // //                         <p className="font-bold flex items-center justify-between">
// // //                             <span>
// // //                                 الرحلة: {getCityName(trip?.origin || '', locale)}
// // //                                 <ArrowRight className="inline h-3 w-3" />
// // //                                 {getCityName(trip?.destination || '', locale)}
// // //                             </span>
// // //                             <span className="flex items-center gap-1">
// // //                                 <Users className="h-4 w-4" /> {totalPassengers}
// // //                             </span>
// // //                         </p>
// // //                         <p className="text-xs text-muted-foreground pt-1">
// // //                             التاريخ: {trip?.departureDate ? new Date(trip.departureDate).toLocaleDateString('ar-SA') : '...'}
// // //                         </p>
// // //                     </div>

// // //                     <div className="relative">
// // //                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// // //                         <Input
// // //                             placeholder="ابحث عن اسم الناقل..."
// // //                             value={searchTerm}
// // //                             onChange={(e) => setSearchTerm(e.target.value)}
// // //                             className="pl-10"
// // //                         />
// // //                     </div>

// // //                     <ScrollArea className="h-64 border rounded-md">
// // //                         <div className="p-2 space-y-1">
// // //                             {isLoading ? (
// // //                                 <div className="p-4 text-center text-muted-foreground">جاري تحميل قائمة الناقلين...</div>
// // //                             ) : filteredCarriers.length > 0 ? (
// // //                                 filteredCarriers.map(carrier => (
// // //                                     <CarrierListItem
// // //                                         key={carrier.id}
// // //                                         carrier={carrier}
// // //                                         onSelect={setSelectedCarrier}
// // //                                         isSelected={selectedCarrier?.id === carrier.id}
// // //                                     />
// // //                                 ))
// // //                             ) : (
// // //                                 <div className="p-4 text-center text-muted-foreground">لا يوجد ناقلون متاحون على هذا الخط حالياً.</div>
// // //                             )}
// // //                         </div>
// // //                     </ScrollArea>
// // //                 </div>

// // //                 <DialogFooter className="gap-2 sm:gap-0">
// // //                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>إلغاء</Button>
// // //                     <Button type="button" onClick={handleSendRequest} disabled={!selectedCarrier || isSubmitting}>
// // //                         {isSubmitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
// // //                         إرسال عرض نقل الرحلة
// // //                     </Button>
// // //                 </DialogFooter>
// // //             </DialogContent>
// // //         </Dialog>
// // //     );
// // // }
// // 'use client';

// // import { useState, useMemo } from 'react';
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// // import { Button } from '@/components/ui/button';
// // import { ScrollArea } from '@/components/ui/scroll-area';
// // import { useToast } from '@/hooks/use-toast';
// // import type { Trip, UserProfile, TransferRequest } from '@/lib/data';
// // import { Loader2, Send, Users, ArrowRight, UserCheck, Search } from 'lucide-react';
// // import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
// // import { collection, query, where, serverTimestamp, addDoc, doc } from 'firebase/firestore';
// // import { Input } from '@/components/ui/input';
// // import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// // import { getCityName } from '@/lib/constants';
// // import { useLocale } from 'next-intl';

// // interface TransferRequestDialogProps {
// //     isOpen: boolean;
// //     onOpenChange: (isOpen: boolean) => void;
// //     trip: Trip | null;
// // }

// // function CarrierListItem({ carrier, onSelect, isSelected }: { carrier: UserProfile, onSelect: (carrier: UserProfile) => void, isSelected: boolean }) {
// //     return (
// //         <div
// //             className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50 border-transparent'} border-2`}
// //             onClick={() => onSelect(carrier)}
// //         >
// //             <div className="flex items-center gap-3">
// //                 <Avatar>
// //                     {/* [SCR-2026-031]: تأمين استخراج الحرف الأول من الاسم */}
// //                     <AvatarFallback>{carrier.firstName?.charAt(0) || 'U'}</AvatarFallback>
// //                 </Avatar>
// //                 <div>
// //                     {/* [SCR-2026-031]: تأمين عرض الاسم الكامل لمنع ظهور undefined */}
// //                     <p className="font-bold text-sm">{carrier.firstName || ''} {carrier.lastName || ''}</p>
// //                     <p className="text-xs text-muted-foreground">يعمل على نفس الخط</p>
// //                 </div>
// //             </div>
// //             {isSelected && <UserCheck className="h-5 w-5 text-primary" />}
// //         </div>
// //     )
// // }

// // /**
// //  * @component TransferRequestDialog
// //  * @description THE REINFORCED TRANSFER HUB (SC-806 V2.6.1)
// //  * Enforced useMemoFirebase for queries to ensure zero redundant reads and resolve memo errors.
// //  */
// // export function TransferRequestDialog({ isOpen, onOpenChange, trip }: TransferRequestDialogProps) {
// //     const { user } = useUser();
// //     const firestore = useFirestore();
// //     const { toast } = useToast();
// //     const locale = useLocale();

// //     const [isSubmitting, setIsSubmitting] = useState(false);
// //     const [selectedCarrier, setSelectedCarrier] = useState<UserProfile | null>(null);
// //     const [searchTerm, setSearchTerm] = useState('');

// //     // [FIX]: بدل الاعتماد على jurisdiction (قد يكون غير مكتمل أو بصيغة مختلفة)،
// //     // نجلب الناقلين من خلال رحلاتهم الفعلية على نفس الخط (origin + destination).
// //     const tripsOnRouteQuery = useMemoFirebase(() => {
// //         if (!firestore || !trip || !user) return null;
// //         return query(
// //             collection(firestore, 'trips'),
// //             where('origin', '==', trip.origin),
// //             where('destination', '==', trip.destination),
// //             where('status', 'in', ['Planned', 'Ongoing', 'In-Transit']),
// //         );
// //     }, [firestore, trip, user]);

// //     const { data: tripsOnRoute, isLoading } = useCollection<Trip>(tripsOnRouteQuery);

// //     const filteredCarriers = useMemo(() => {
// //         if (!tripsOnRoute) return [];

// //         // استخرج الناقلين الفريدين من الرحلات على نفس الخط
// //         const carrierMap = new Map<string, UserProfile>();
// //         for (const t of tripsOnRoute) {
// //             const carrierId = t.carrierId || t.userId;
// //             if (!carrierId || carrierId === user?.uid) continue;
// //             if (!carrierMap.has(carrierId)) {
// //                 // نبني UserProfile مؤقت من بيانات الرحلة
// //                 carrierMap.set(carrierId, {
// //                     id: carrierId,
// //                     firstName: t.carrierName?.split(' ')[0] || '',
// //                     lastName: t.carrierName?.split(' ').slice(1).join(' ') || '',
// //                     role: 'carrier',
// //                 } as UserProfile);
// //             }
// //         }

// //         const carriers = Array.from(carrierMap.values());
// //         return carriers.filter(c =>
// //         (c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
// //             c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
// //         );
// //     }, [tripsOnRoute, searchTerm, user]);

// //     const totalPassengers = useMemo(() => {
// //         if (!trip?.bookingIds) return 0;
// //         return trip.bookingIds.length;
// //     }, [trip]);

// //     const handleSendRequest = async () => {
// //         if (!firestore || !user || !trip || !selectedCarrier) {
// //             toast({ title: 'خطأ', description: 'الرجاء اختيار ناقل لإرسال العرض إليه', variant: 'destructive' });
// //             return;
// //         }
// //         setIsSubmitting(true);

// //         try {
// //             const transferRequestsCollection = collection(firestore, 'transferRequests');

// //             const newTransferRequest: Omit<TransferRequest, 'id'> = {
// //                 originalTripId: trip.id,
// //                 fromCarrierId: user.uid,
// //                 toCarrierId: selectedCarrier.id,
// //                 status: 'pending',
// //                 createdAt: serverTimestamp(),
// //                 updatedAt: serverTimestamp(),
// //                 tripId: trip.id,
// //                 tripDetails: {
// //                     origin: trip.origin,
// //                     destination: trip.destination,
// //                     departureDate: trip.departureDate,
// //                     passengerCount: totalPassengers
// //                 }
// //             };

// //             console.log('[TransferRequest] DEBUG:', {
// //                 'user.uid': user.uid,
// //                 'selectedCarrier.id': selectedCarrier.id,
// //                 'fromCarrierId': user.uid,
// //                 'toCarrierId': selectedCarrier.id,
// //                 'trip.id': trip.id,
// //             });

// //             const docRef = await addDoc(transferRequestsCollection, newTransferRequest);
// //             console.log('[TransferRequest] Created successfully:', docRef.id);

// //             // إشعار للناقل المستقبل
// //             await addDoc(collection(doc(firestore, 'users', selectedCarrier.id), 'notifications'), {
// //                 userId: selectedCarrier.id,
// //                 title: 'طلب نقل رحلة جديد 🚗',
// //                 message: `يطلب زميلك استلام رحلة من ${trip.origin} إلى ${trip.destination}`,
// //                 type: 'transfer_request',
// //                 tripId: trip.id,
// //                 isRead: false,
// //                 createdAt: serverTimestamp(),
// //             });

// //             toast({
// //                 title: 'تم إرسال طلب النقل بنجاح!',
// //                 description: `تم إرسال طلب نقل الرحلة إلى الناقل ${selectedCarrier.firstName}.`,
// //             });
// //             onOpenChange(false);

// //         } catch (error: any) {
// //             console.error('[TransferRequest] Failed:', error?.code, error?.message);
// //             toast({
// //                 title: 'فشل إرسال الطلب',
// //                 description: error?.code === 'permission-denied'
// //                     ? 'ليس لديك صلاحية إرسال طلب نقل. تحقق من إعدادات Firestore.'
// //                     : `خطأ: ${error?.message || 'حدث خطأ أثناء إنشاء طلب النقل.'}`,
// //                 variant: 'destructive',
// //             });
// //         } finally {
// //             setIsSubmitting(false);
// //         }
// //     };

// //     return (
// //         <Dialog open={isOpen} onOpenChange={onOpenChange}>
// //             <DialogContent className="sm:max-w-md">
// //                 <DialogHeader>
// //                     <DialogTitle>طلب نقل رحلة وركابها</DialogTitle>
// //                     <DialogDescription>
// //                         اختر ناقلاً بديلاً من زملائك الذين يعملون على نفس خط السير.
// //                     </DialogDescription>
// //                 </DialogHeader>

// //                 <div className="py-4 space-y-4">
// //                     <div className="p-3 bg-muted rounded-lg border border-dashed text-sm">
// //                         <p className="font-bold flex items-center justify-between">
// //                             <span>
// //                                 الرحلة: {getCityName(trip?.origin || '', locale)}
// //                                 <ArrowRight className="inline h-3 w-3" />
// //                                 {getCityName(trip?.destination || '', locale)}
// //                             </span>
// //                             <span className="flex items-center gap-1">
// //                                 <Users className="h-4 w-4" /> {totalPassengers}
// //                             </span>
// //                         </p>
// //                         <p className="text-xs text-muted-foreground pt-1">
// //                             التاريخ: {trip?.departureDate ? new Date(trip.departureDate).toLocaleDateString('ar-SA') : '...'}
// //                         </p>
// //                     </div>

// //                     <div className="relative">
// //                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
// //                         <Input
// //                             placeholder="ابحث عن اسم الناقل..."
// //                             value={searchTerm}
// //                             onChange={(e) => setSearchTerm(e.target.value)}
// //                             className="pl-10"
// //                         />
// //                     </div>

// //                     <ScrollArea className="h-64 border rounded-md">
// //                         <div className="p-2 space-y-1">
// //                             {isLoading ? (
// //                                 <div className="p-4 text-center text-muted-foreground">جاري تحميل قائمة الناقلين...</div>
// //                             ) : filteredCarriers.length > 0 ? (
// //                                 filteredCarriers.map(carrier => (
// //                                     <CarrierListItem
// //                                         key={carrier.id}
// //                                         carrier={carrier}
// //                                         onSelect={setSelectedCarrier}
// //                                         isSelected={selectedCarrier?.id === carrier.id}
// //                                     />
// //                                 ))
// //                             ) : (
// //                                 <div className="p-4 text-center text-muted-foreground">لا يوجد ناقلون متاحون على هذا الخط حالياً.</div>
// //                             )}
// //                         </div>
// //                     </ScrollArea>
// //                 </div>

// //                 <DialogFooter className="gap-2 sm:gap-0">
// //                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>إلغاء</Button>
// //                     <Button type="button" onClick={handleSendRequest} disabled={!selectedCarrier || isSubmitting}>
// //                         {isSubmitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
// //                         إرسال عرض نقل الرحلة
// //                     </Button>
// //                 </DialogFooter>
// //             </DialogContent>
// //         </Dialog>
// //     );
// // }
// 'use client';

// import { useState, useMemo } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { ScrollArea } from '@/components/ui/scroll-area';
// import { useToast } from '@/hooks/use-toast';
// import type { Trip, UserProfile, TransferRequest } from '@/lib/data';
// import { Loader2, Send, Users, ArrowRight, UserCheck, Search } from 'lucide-react';
// import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
// import { collection, query, where, serverTimestamp, addDoc, doc } from 'firebase/firestore';
// import { Input } from '@/components/ui/input';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { getCityName } from '@/lib/constants';
// import { useLocale } from 'next-intl';

// interface TransferRequestDialogProps {
//     isOpen: boolean;
//     onOpenChange: (isOpen: boolean) => void;
//     trip: Trip | null;
// }

// function CarrierListItem({ carrier, onSelect, isSelected }: { carrier: UserProfile, onSelect: (carrier: UserProfile) => void, isSelected: boolean }) {
//     return (
//         <div
//             className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50 border-transparent'} border-2`}
//             onClick={() => onSelect(carrier)}
//         >
//             <div className="flex items-center gap-3">
//                 <Avatar>
//                     {/* [SCR-2026-031]: تأمين استخراج الحرف الأول من الاسم */}
//                     <AvatarFallback>{carrier.firstName?.charAt(0) || 'U'}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                     {/* [SCR-2026-031]: تأمين عرض الاسم الكامل لمنع ظهور undefined */}
//                     <p className="font-bold text-sm">{carrier.firstName || ''} {carrier.lastName || ''}</p>
//                     <p className="text-xs text-muted-foreground">يعمل على نفس الخط</p>
//                 </div>
//             </div>
//             {isSelected && <UserCheck className="h-5 w-5 text-primary" />}
//         </div>
//     )
// }

// /**
//  * @component TransferRequestDialog
//  * @description THE REINFORCED TRANSFER HUB (SC-806 V2.6.1)
//  * Enforced useMemoFirebase for queries to ensure zero redundant reads and resolve memo errors.
//  */
// export function TransferRequestDialog({ isOpen, onOpenChange, trip }: TransferRequestDialogProps) {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const { toast } = useToast();
//     const locale = useLocale();

//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [selectedCarrier, setSelectedCarrier] = useState<UserProfile | null>(null);
//     const [searchTerm, setSearchTerm] = useState('');

//     // [FIX]: بدل الاعتماد على jurisdiction (قد يكون غير مكتمل أو بصيغة مختلفة)،
//     // نجلب الناقلين من خلال رحلاتهم الفعلية على نفس الخط (origin + destination).
//     const tripsOnRouteQuery = useMemoFirebase(() => {
//         if (!firestore || !trip || !user) return null;
//         return query(
//             collection(firestore, 'trips'),
//             where('origin', '==', trip.origin),
//             where('destination', '==', trip.destination),
//             where('status', 'in', ['Planned', 'Ongoing', 'In-Transit']),
//         );
//     }, [firestore, trip, user]);

//     const { data: tripsOnRoute, isLoading } = useCollection<Trip>(tripsOnRouteQuery);

//     const filteredCarriers = useMemo(() => {
//         if (!tripsOnRoute) return [];

//         // استخرج الناقلين الفريدين من الرحلات على نفس الخط
//         // [FIX-TRANSFER-TRIP]: نحفظ tripId الخاص بكل ناقل عشان نستخدمه وقت إتمام النقل
//         const carrierMap = new Map<string, UserProfile & { _tripId?: string }>();
//         for (const t of tripsOnRoute) {
//             const carrierId = t.carrierId || t.userId;
//             if (!carrierId || carrierId === user?.uid) continue;
//             if (!carrierMap.has(carrierId)) {
//                 carrierMap.set(carrierId, {
//                     id: carrierId,
//                     firstName: t.carrierName?.split('\u0020')[0] || '',
//                     lastName: t.carrierName?.split('\u0020').slice(1).join('\u0020') || '',
//                     role: 'carrier',
//                     _tripId: t.id,
//                 } as UserProfile & { _tripId?: string });
//             }
//         }

//         const carriers = Array.from(carrierMap.values());
//         return carriers.filter(c =>
//         (c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
//         );
//     }, [tripsOnRoute, searchTerm, user]);

//     const totalPassengers = useMemo(() => {
//         if (!trip?.bookingIds) return 0;
//         return trip.bookingIds.length;
//     }, [trip]);

//     const handleSendRequest = async () => {
//         if (!firestore || !user || !trip || !selectedCarrier) {
//             toast({ title: 'خطأ', description: 'الرجاء اختيار ناقل لإرسال العرض إليه', variant: 'destructive' });
//             return;
//         }
//         setIsSubmitting(true);

//         try {
//             const transferRequestsCollection = collection(firestore, 'transferRequests');

//             // [FIX-TRANSFER-TRIP]: نحفظ toCarrierTripId (رحلة الناقل المستلم الموجودة)
//             // هيتستخدم في transfer-deposit-confirm-card لدمج الـ bookings فيها وحذف الرحلة الأصلية
//             const toCarrierTripId = (selectedCarrier as any)._tripId || null;

//             const newTransferRequest: Omit<TransferRequest, 'id'> = {
//                 originalTripId: trip.id,
//                 fromCarrierId: user.uid,
//                 toCarrierId: selectedCarrier.id,
//                 toCarrierTripId: toCarrierTripId,
//                 status: 'pending',
//                 createdAt: serverTimestamp(),
//                 updatedAt: serverTimestamp(),
//                 tripId: trip.id,
//                 tripDetails: {
//                     origin: trip.origin,
//                     destination: trip.destination,
//                     departureDate: trip.departureDate,
//                     passengerCount: totalPassengers
//                 }
//             };

//             console.log('[TransferRequest] DEBUG:', {
//                 'user.uid': user.uid,
//                 'selectedCarrier.id': selectedCarrier.id,
//                 'fromCarrierId': user.uid,
//                 'toCarrierId': selectedCarrier.id,
//                 'trip.id': trip.id,
//             });

//             const docRef = await addDoc(transferRequestsCollection, newTransferRequest);
//             console.log('[TransferRequest] Created successfully:', docRef.id);

//             // إشعار للناقل المستقبل
//             await addDoc(collection(doc(firestore, 'users', selectedCarrier.id), 'notifications'), {
//                 userId: selectedCarrier.id,
//                 title: 'طلب نقل رحلة جديد 🚗',
//                 message: `يطلب زميلك استلام رحلة من ${trip.origin} إلى ${trip.destination}`,
//                 type: 'transfer_request',
//                 tripId: trip.id,
//                 isRead: false,
//                 createdAt: serverTimestamp(),
//             });

//             toast({
//                 title: 'تم إرسال طلب النقل بنجاح!',
//                 description: `تم إرسال طلب نقل الرحلة إلى الناقل ${selectedCarrier.firstName}.`,
//             });
//             onOpenChange(false);

//         } catch (error: any) {
//             console.error('[TransferRequest] Failed:', error?.code, error?.message);
//             toast({
//                 title: 'فشل إرسال الطلب',
//                 description: error?.code === 'permission-denied'
//                     ? 'ليس لديك صلاحية إرسال طلب نقل. تحقق من إعدادات Firestore.'
//                     : `خطأ: ${error?.message || 'حدث خطأ أثناء إنشاء طلب النقل.'}`,
//                 variant: 'destructive',
//             });
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     return (
//         <Dialog open={isOpen} onOpenChange={onOpenChange}>
//             <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                     <DialogTitle>طلب نقل رحلة وركابها</DialogTitle>
//                     <DialogDescription>
//                         اختر ناقلاً بديلاً من زملائك الذين يعملون على نفس خط السير.
//                     </DialogDescription>
//                 </DialogHeader>

//                 <div className="py-4 space-y-4">
//                     <div className="p-3 bg-muted rounded-lg border border-dashed text-sm">
//                         <p className="font-bold flex items-center justify-between">
//                             <span>
//                                 الرحلة: {getCityName(trip?.origin || '', locale)}
//                                 <ArrowRight className="inline h-3 w-3" />
//                                 {getCityName(trip?.destination || '', locale)}
//                             </span>
//                             <span className="flex items-center gap-1">
//                                 <Users className="h-4 w-4" /> {totalPassengers}
//                             </span>
//                         </p>
//                         <p className="text-xs text-muted-foreground pt-1">
//                             التاريخ: {trip?.departureDate ? new Date(trip.departureDate).toLocaleDateString('ar-SA') : '...'}
//                         </p>
//                     </div>

//                     <div className="relative">
//                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                         <Input
//                             placeholder="ابحث عن اسم الناقل..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             className="pl-10"
//                         />
//                     </div>

//                     <ScrollArea className="h-64 border rounded-md">
//                         <div className="p-2 space-y-1">
//                             {isLoading ? (
//                                 <div className="p-4 text-center text-muted-foreground">جاري تحميل قائمة الناقلين...</div>
//                             ) : filteredCarriers.length > 0 ? (
//                                 filteredCarriers.map(carrier => (
//                                     <CarrierListItem
//                                         key={carrier.id}
//                                         carrier={carrier}
//                                         onSelect={setSelectedCarrier}
//                                         isSelected={selectedCarrier?.id === carrier.id}
//                                     />
//                                 ))
//                             ) : (
//                                 <div className="p-4 text-center text-muted-foreground">لا يوجد ناقلون متاحون على هذا الخط حالياً.</div>
//                             )}
//                         </div>
//                     </ScrollArea>
//                 </div>

//                 <DialogFooter className="gap-2 sm:gap-0">
//                     <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>إلغاء</Button>
//                     <Button type="button" onClick={handleSendRequest} disabled={!selectedCarrier || isSubmitting}>
//                         {isSubmitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
//                         إرسال عرض نقل الرحلة
//                     </Button>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// }
'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import type { Trip, UserProfile, TransferRequest } from '@/lib/data';
import { Loader2, Send, Users, ArrowRight, UserCheck, Search } from 'lucide-react';
import { useCollection, useFirestore, useUser, useMemoFirebase } from '@/firebase';
import { collection, query, where, serverTimestamp, addDoc, doc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';

interface TransferRequestDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    trip: Trip | null;
}

function CarrierListItem({ carrier, onSelect, isSelected }: { carrier: UserProfile, onSelect: (carrier: UserProfile) => void, isSelected: boolean }) {
    return (
        <div
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 border-primary' : 'hover:bg-muted/50 border-transparent'} border-2`}
            onClick={() => onSelect(carrier)}
        >
            <div className="flex items-center gap-3">
                <Avatar>
                    {/* [SCR-2026-031]: تأمين استخراج الحرف الأول من الاسم */}
                    <AvatarFallback>{carrier.firstName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    {/* [SCR-2026-031]: تأمين عرض الاسم الكامل لمنع ظهور undefined */}
                    <p className="font-bold text-sm">{carrier.firstName || ''} {carrier.lastName || ''}</p>
                    <p className="text-xs text-muted-foreground">يعمل على نفس الخط</p>
                </div>
            </div>
            {isSelected && <UserCheck className="h-5 w-5 text-primary" />}
        </div>
    )
}

/**
 * @component TransferRequestDialog
 * @description THE REINFORCED TRANSFER HUB (SC-806 V2.6.1)
 * Enforced useMemoFirebase for queries to ensure zero redundant reads and resolve memo errors.
 */
export function TransferRequestDialog({ isOpen, onOpenChange, trip }: TransferRequestDialogProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const locale = useLocale();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedCarrier, setSelectedCarrier] = useState<UserProfile | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // [FIX]: بدل الاعتماد على jurisdiction (قد يكون غير مكتمل أو بصيغة مختلفة)،
    // نجلب الناقلين من خلال رحلاتهم الفعلية على نفس الخط (origin + destination).
    const tripsOnRouteQuery = useMemoFirebase(() => {
        if (!firestore || !trip || !user) return null;
        return query(
            collection(firestore, 'trips'),
            where('origin', '==', trip.origin),
            where('destination', '==', trip.destination),
            where('status', 'in', ['Planned', 'Ongoing', 'In-Transit']),
        );
    }, [firestore, trip, user]);

    const { data: tripsOnRoute, isLoading } = useCollection<Trip>(tripsOnRouteQuery);

    const filteredCarriers = useMemo(() => {
        if (!tripsOnRoute) return [];

        // استخرج الناقلين الفريدين من الرحلات على نفس الخط
        // [FIX-TRANSFER-TRIP]: نحفظ tripId الخاص بكل ناقل عشان نستخدمه وقت إتمام النقل
        const carrierMap = new Map<string, UserProfile & { _tripId?: string }>();
        for (const t of tripsOnRoute) {
            const carrierId = t.carrierId || t.userId;
            if (!carrierId || carrierId === user?.uid) continue;
            if (!carrierMap.has(carrierId)) {
                carrierMap.set(carrierId, {
                    id: carrierId,
                    firstName: t.carrierName?.split('\u0020')[0] || '',
                    lastName: t.carrierName?.split('\u0020').slice(1).join('\u0020') || '',
                    role: 'carrier',
                    _tripId: t.id,
                } as UserProfile & { _tripId?: string });
            }
        }

        const carriers = Array.from(carrierMap.values());
        return carriers.filter(c =>
        (c.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [tripsOnRoute, searchTerm, user]);

    const totalPassengers = useMemo(() => {
        if (!trip?.bookingIds) return 0;
        return trip.bookingIds.length;
    }, [trip]);

    const handleSendRequest = async () => {
        if (!firestore || !user || !trip || !selectedCarrier) {
            toast({ title: 'خطأ', description: 'الرجاء اختيار ناقل لإرسال العرض إليه', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);

        try {
            const transferRequestsCollection = collection(firestore, 'transferRequests');

            // [FIX-TRANSFER-TRIP]: نحفظ toCarrierTripId (رحلة الناقل المستلم الموجودة)
            // هيتستخدم في transfer-deposit-confirm-card لدمج الـ bookings فيها وحذف الرحلة الأصلية
            const toCarrierTripId = (selectedCarrier as any)._tripId || null;

            const newTransferRequest: Omit<TransferRequest, 'id'> = {
                originalTripId: trip.id,
                fromCarrierId: user.uid,
                toCarrierId: selectedCarrier.id,
                toCarrierTripId: toCarrierTripId,
                status: 'pending',
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                tripId: trip.id,
                tripDetails: {
                    origin: trip.origin,
                    destination: trip.destination,
                    departureDate: trip.departureDate,
                    passengerCount: totalPassengers
                }
            };

            console.log('[TransferRequest] DEBUG:', {
                'user.uid': user.uid,
                'selectedCarrier.id': selectedCarrier.id,
                'fromCarrierId': user.uid,
                'toCarrierId': selectedCarrier.id,
                'trip.id': trip.id,
            });

            const docRef = await addDoc(transferRequestsCollection, newTransferRequest);
            console.log('[TransferRequest] Created successfully:', docRef.id);

            // إشعار للناقل المستقبل
            await addDoc(collection(doc(firestore, 'users', selectedCarrier.id), 'notifications'), {
                userId: selectedCarrier.id,
                title: 'طلب نقل رحلة جديد 🚗',
                message: `يطلب زميلك استلام رحلة من ${trip.origin} إلى ${trip.destination}`,
                type: 'transfer_request',
                tripId: trip.id,
                isRead: false,
                link: `/${locale}/carrier/bookings`,
                createdAt: serverTimestamp(),
            });

            toast({
                title: 'تم إرسال طلب النقل بنجاح!',
                description: `تم إرسال طلب نقل الرحلة إلى الناقل ${selectedCarrier.firstName}.`,
            });
            onOpenChange(false);

        } catch (error: any) {
            console.error('[TransferRequest] Failed:', error?.code, error?.message);
            toast({
                title: 'فشل إرسال الطلب',
                description: error?.code === 'permission-denied'
                    ? 'ليس لديك صلاحية إرسال طلب نقل. تحقق من إعدادات Firestore.'
                    : `خطأ: ${error?.message || 'حدث خطأ أثناء إنشاء طلب النقل.'}`,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>طلب نقل رحلة وركابها</DialogTitle>
                    <DialogDescription>
                        اختر ناقلاً بديلاً من زملائك الذين يعملون على نفس خط السير.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <div className="p-3 bg-muted rounded-lg border border-dashed text-sm">
                        <p className="font-bold flex items-center justify-between">
                            <span>
                                الرحلة: {getCityName(trip?.origin || '', locale)}
                                <ArrowRight className="inline h-3 w-3" />
                                {getCityName(trip?.destination || '', locale)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" /> {totalPassengers}
                            </span>
                        </p>
                        <p className="text-xs text-muted-foreground pt-1">
                            التاريخ: {trip?.departureDate ? new Date(trip.departureDate).toLocaleDateString('ar-SA') : '...'}
                        </p>
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="ابحث عن اسم الناقل..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <ScrollArea className="h-64 border rounded-md">
                        <div className="p-2 space-y-1">
                            {isLoading ? (
                                <div className="p-4 text-center text-muted-foreground">جاري تحميل قائمة الناقلين...</div>
                            ) : filteredCarriers.length > 0 ? (
                                filteredCarriers.map(carrier => (
                                    <CarrierListItem
                                        key={carrier.id}
                                        carrier={carrier}
                                        onSelect={setSelectedCarrier}
                                        isSelected={selectedCarrier?.id === carrier.id}
                                    />
                                ))
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">لا يوجد ناقلون متاحون على هذا الخط حالياً.</div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>إلغاء</Button>
                    <Button type="button" onClick={handleSendRequest} disabled={!selectedCarrier || isSubmitting}>
                        {isSubmitting ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Send className="ml-2 h-4 w-4" />}
                        إرسال عرض نقل الرحلة
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}