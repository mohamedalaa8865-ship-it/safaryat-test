// 'use client';

// import { useState, useCallback, useEffect } from 'react';
// import { useUser, useFirestore } from '@/firebase';
// import { collection, query, where, orderBy, limit, getDocs, startAfter, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Archive, CheckCircle2, XCircle, Clock, PlaneTakeoff, Loader2 } from 'lucide-react';
// import { getCityName } from '@/lib/constants';
// import { useLocale } from 'next-intl';
// import { useToast } from '@/hooks/use-toast';
// // import { ERROR_CODES } from '@/lib/error-dictionary';
// import { SOVEREIGN_ERROR_DICTIONARY } from '@/lib/error-dictionary';

// /**
//  * @component FieldArchive
//  * @description THE REINFORCED SOVEREIGN ARCHIVE (STERILIZED - V1.2 - SCR-860)
//  * [V1.2]: Integrated ERROR_CODES (SSOT). Applied Protocol 16 Cleanup.
//  * Protocol 88: Enforced Rule of 12 (Max pull per fetch). 
//  */
// export function FieldArchive() {
//     const { user } = useUser();
//     const firestore = useFirestore();
//     const locale = useLocale() as 'ar' | 'en';
//     const { toast } = useToast();

//     const [trips, setTrips] = useState<any[]>([]);
//     const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
//     const [isLoading, setIsLoading] = useState(false);
//     const [hasMore, setHasMore] = useState(true);

//     // [PROTOCOL 16]: Memoized fetch handler to prevent closure rot
//     const fetchTrips = useCallback(async (isNext = false) => {
//         if (!firestore || !user) return;

//         setIsLoading(true);
//         try {
//             // [COMMAND COMPLIANCE]: Limit exactly to 12 as per Sovereign Command.
//             let q = query(
//                 collection(firestore, 'trips'),
//                 where('agentId', '==', user.uid),
//                 orderBy('createdAt', 'desc'),
//                 limit(12)
//             );

//             if (isNext && lastDoc) {
//                 q = query(q, startAfter(lastDoc));
//             }

//             const snapshot = await getDocs(q);

//             const newTrips = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//             if (snapshot.docs.length < 12) {
//                 setHasMore(false);
//             }

//             setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
//             setTrips(prev => isNext ? [...prev, ...newTrips] : newTrips);
//         } catch (error) {
//             console.error("[Field Archive] Read failed:", error);
//             // [PROTOCOL 20]: Unified SSOT Immune Response - [SCR-860]
//             toast({
//                 variant: 'destructive',
//                 title: 'تعثر الأرشيف (ERR_AGENT_ARCHIVE_FETCH)',
//                 // description: ERROR_CODES.ERR_AGENT_ARCHIVE_FETCH[locale] || ERROR_CODES.ERR_AGENT_ARCHIVE_FETCH.ar
//                 description: SOVEREIGN_ERROR_DICTIONARY.DEFAULT.guidance
//             });
//         } finally {
//             setIsLoading(false);
//         }
//     }, [firestore, user, lastDoc, toast, locale]);

//     // Initial Pulse
//     useEffect(() => {
//         fetchTrips();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [user?.uid]);

//     // [PROTOCOL 16]: Pure rendering logic for status badges
//     const renderStatus = useCallback((status: string) => {
//         const base = "text-[9px] font-black px-2 py-0.5 rounded-full uppercase border";
//         switch (status) {
//             case 'Confirmed':
//             case 'Completed':
//                 return <span className={`${base} bg-emerald-500/10 text-emerald-500 border-emerald-500/20`}>مؤكدة</span>;
//             case 'Cancelled':
//                 return <span className={`${base} bg-destructive/10 text-destructive border-destructive/20`}>ملغاة</span>;
//             default:
//                 return <span className={`${base} bg-amber-500/10 text-amber-500 border-amber-500/20`}>معلقة</span>;
//         }
//     }, []);

//     return (
//         <Card className="border-primary/10 shadow-2xl rounded-[2.5rem] bg-card overflow-hidden">
//             <CardHeader className="bg-muted/10 border-b border-primary/5 pb-4">
//                 <CardTitle className="text-sm font-black text-foreground flex items-center gap-2">
//                     <Archive className="h-4 w-4 text-primary" /> الأرشيف الميداني السيادي
//                 </CardTitle>
//             </CardHeader>
//             <CardContent className="p-4 space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {trips.map(trip => (
//                         <div key={trip.id} className="p-4 rounded-[1.5rem] border border-primary/5 bg-background flex items-center justify-between hover:border-primary/20 transition-colors group">
//                             <div className="flex items-center gap-3">
//                                 <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
//                                     {trip.status === 'Confirmed' || trip.status === 'Completed' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> :
//                                         trip.status === 'Cancelled' ? <XCircle className="h-5 w-5 text-destructive" /> :
//                                             <Clock className="h-5 w-5 text-amber-500 animate-pulse" />}
//                                 </div>
//                                 <div className="text-right">
//                                     <h4 className="text-[11px] font-black">{trip.passengerName || 'مسافر سيادي'}</h4>
//                                     <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground mt-1">
//                                         <PlaneTakeoff className="h-3 w-3 text-primary opacity-60" />
//                                         {getCityName(trip.origin, locale)} <span>←</span> {getCityName(trip.destination, locale)}
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="text-left flex flex-col items-end gap-1">
//                                 {renderStatus(trip.status)}
//                                 <span className="text-[8px] font-mono text-muted-foreground opacity-50">
//                                     {trip.createdAt?.toDate ? trip.createdAt.toDate().toLocaleDateString('ar-SA') : '...'}
//                                 </span>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 {trips.length === 0 && !isLoading && (
//                     <div className="text-center py-8 text-[10px] font-bold text-muted-foreground italic">لا يوجد عمليات مؤرشفة حالياً.</div>
//                 )}

//                 {hasMore && trips.length > 0 && (
//                     <Button
//                         variant="outline"
//                         onClick={() => fetchTrips(true)}
//                         disabled={isLoading}
//                         className="w-full rounded-2xl h-12 border-primary/20 text-xs font-black text-primary hover:bg-primary/5 transition-all"
//                     >
//                         {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'استدعاء المزيد (قانون 12)'}
//                     </Button>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }


'use client';

import { useState, useCallback, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { collection, query, where, limit, getDocs, startAfter, type DocumentData, type QueryDocumentSnapshot } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Archive, CheckCircle2, XCircle, Clock, PlaneTakeoff, Loader2 } from 'lucide-react';
import { getCityName } from '@/lib/constants';
import { useLocale } from 'next-intl';
import { useToast } from '@/hooks/use-toast';
// import { ERROR_CODES } from '@/lib/error-dictionary';
import { SOVEREIGN_ERROR_DICTIONARY } from '@/lib/error-dictionary';

/**
 * @component FieldArchive
 * @description THE REINFORCED SOVEREIGN ARCHIVE (STERILIZED - V1.2 - SCR-860)
 * [V1.2]: Integrated ERROR_CODES (SSOT). Applied Protocol 16 Cleanup.
 * Protocol 88: Enforced Rule of 12 (Max pull per fetch). 
 */
export function FieldArchive() {
    const { user } = useUser();
    const firestore = useFirestore();
    const locale = useLocale() as 'ar' | 'en';
    const { toast } = useToast();

    const [trips, setTrips] = useState<any[]>([]);
    const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // [PROTOCOL 16]: Memoized fetch handler to prevent closure rot
    const fetchTrips = useCallback(async (isNext = false) => {
        if (!firestore || !user) return;

        setIsLoading(true);
        try {
            // [COMMAND COMPLIANCE]: Limit exactly to 12 as per Sovereign Command.
            let q = query(
                collection(firestore, 'trips'),
                where('agentId', '==', user.uid),
                limit(12)
            );

            if (isNext && lastDoc) {
                q = query(q, startAfter(lastDoc));
            }

            const snapshot = await getDocs(q);

            const newTrips = snapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .sort((a: any, b: any) => {
                    const aTime = a.createdAt?.toMillis?.() || 0;
                    const bTime = b.createdAt?.toMillis?.() || 0;
                    return bTime - aTime;
                });

            if (snapshot.docs.length < 12) {
                setHasMore(false);
            }

            setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
            setTrips(prev => isNext ? [...prev, ...newTrips] : newTrips);
        } catch (error) {
            console.error("[Field Archive] Read failed:", error);
            // [PROTOCOL 20]: Unified SSOT Immune Response - [SCR-860]
            toast({
                variant: 'destructive',
                title: 'تعثر الأرشيف (ERR_AGENT_ARCHIVE_FETCH)',
                // description: ERROR_CODES.ERR_AGENT_ARCHIVE_FETCH[locale] || ERROR_CODES.ERR_AGENT_ARCHIVE_FETCH.ar
                description: SOVEREIGN_ERROR_DICTIONARY.DEFAULT.guidance
            });
        } finally {
            setIsLoading(false);
        }
    }, [firestore, user, lastDoc, toast, locale]);

    // Initial Pulse
    useEffect(() => {
        fetchTrips();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.uid]);

    // [PROTOCOL 16]: Pure rendering logic for status badges
    const renderStatus = useCallback((status: string) => {
        const base = "text-[9px] font-black px-2 py-0.5 rounded-full uppercase border";
        switch (status) {
            case 'Confirmed':
            case 'Completed':
                return <span className={`${base} bg-emerald-500/10 text-emerald-500 border-emerald-500/20`}>مؤكدة</span>;
            case 'Cancelled':
                return <span className={`${base} bg-destructive/10 text-destructive border-destructive/20`}>ملغاة</span>;
            default:
                return <span className={`${base} bg-amber-500/10 text-amber-500 border-amber-500/20`}>معلقة</span>;
        }
    }, []);

    return (
        <Card className="border-primary/10 shadow-2xl rounded-[2.5rem] bg-card overflow-hidden">
            <CardHeader className="bg-muted/10 border-b border-primary/5 pb-4">
                <CardTitle className="text-sm font-black text-foreground flex items-center gap-2">
                    <Archive className="h-4 w-4 text-primary" /> الأرشيف الميداني السيادي
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {trips.map(trip => (
                        <div key={trip.id} className="p-4 rounded-[1.5rem] border border-primary/5 bg-background flex items-center justify-between hover:border-primary/20 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                                    {trip.status === 'Confirmed' || trip.status === 'Completed' ? <CheckCircle2 className="h-5 w-5 text-emerald-500" /> :
                                        trip.status === 'Cancelled' ? <XCircle className="h-5 w-5 text-destructive" /> :
                                            <Clock className="h-5 w-5 text-amber-500 animate-pulse" />}
                                </div>
                                <div className="text-right">
                                    <h4 className="text-[11px] font-black">{trip.passengerName || 'مسافر سيادي'}</h4>
                                    <div className="flex items-center gap-1 text-[9px] font-bold text-muted-foreground mt-1">
                                        <PlaneTakeoff className="h-3 w-3 text-primary opacity-60" />
                                        {getCityName(trip.origin, locale)} <span>←</span> {getCityName(trip.destination, locale)}
                                    </div>
                                </div>
                            </div>
                            <div className="text-left flex flex-col items-end gap-1">
                                {renderStatus(trip.status)}
                                <span className="text-[8px] font-mono text-muted-foreground opacity-50">
                                    {trip.createdAt?.toDate ? trip.createdAt.toDate().toLocaleDateString('ar-SA') : '...'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {trips.length === 0 && !isLoading && (
                    <div className="text-center py-8 text-[10px] font-bold text-muted-foreground italic">لا يوجد عمليات مؤرشفة حالياً.</div>
                )}

                {hasMore && trips.length > 0 && (
                    <Button
                        variant="outline"
                        onClick={() => fetchTrips(true)}
                        disabled={isLoading}
                        className="w-full rounded-2xl h-12 border-primary/20 text-xs font-black text-primary hover:bg-primary/5 transition-all"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'استدعاء المزيد (قانون 12)'}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}