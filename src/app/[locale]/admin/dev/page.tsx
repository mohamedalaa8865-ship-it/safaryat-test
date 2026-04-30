// // 'use client';

// // import { useFirestore, useCollection, useMemoFirebase, useFunctions } from '@/firebase';
// // import { collection, query, orderBy, limit, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
// // import { httpsCallable } from 'firebase/functions';
// // import { useState, useEffect, useMemo, useCallback } from 'react';
// // import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// // import {
// //   Terminal, Database, ShieldAlert, Cpu, Wrench, CheckCircle2,
// //   Loader2, ShieldCheck, Lock, Eye, RotateCcw, FileText,
// //   Binary, XCircle, Network
// // } from 'lucide-react';
// // import { Skeleton } from '@/components/ui/skeleton';
// // import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// // import { Badge } from '@/components/ui/badge';
// // import { formatDate } from '@/lib/formatters';
// // import { useLocale } from 'next-intl';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// // import { Button } from '@/components/ui/button';
// // import { Input } from '@/components/ui/input';
// // import { Label } from '@/components/ui/label';
// // import { useUserProfile } from '@/hooks/use-user-profile';
// // import { useToast } from '@/hooks/use-toast';
// // import { cn, triggerHaptic } from '@/lib/utils';
// // import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// // import { SovereignSystemTree } from '@/components/admin/cockpit/sovereign-system-tree';

// // /**
// //  * @page DevCenterPage
// //  * @description THE REINFORCED BLACK BOX TERMINAL [SCR-942 - ARTERIAL RELOCATION]
// //  * [SCR-942]: Injected [ شجرة النظام ] button for surgical architectural inspection.
// //  * Protocol 16: Sterilized. Protocol 14: Relocation.
// //  */
// // export default function DevCenterPage() {
// //   const firestore = useFirestore();
// //   const functions = useFunctions();
// //   const locale = useLocale();
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const pathname = usePathname();

// //   const { profile, pulseStatus, securityLevel } = useUserProfile();
// //   const { toast } = useToast();

// //   const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
// //   const [detailDialogOpen, setDetailDialogOpen] = useState(false);
// //   const [isTreeOpen, setIsTreeOpen] = useState(false);
// //   const [selectedCrash, setSelectedCrash] = useState<any>(null);
// //   const [resolveNote, setResolveNote] = useState('');
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [isNetworkOffline, setIsNetworkOffline] = useState(false);

// //   const activeTab = searchParams.get('tab') || 'active';

// //   const handleTabChange = useCallback((val: string) => {
// //     const params = new URLSearchParams(searchParams.toString());
// //     params.set('tab', val);
// //     router.replace(`${pathname}?${params.toString()}`);
// //   }, [router, pathname, searchParams]);

// //   useEffect(() => {
// //     if (typeof window === 'undefined') return;
// //     setIsNetworkOffline(!navigator.onLine);
// //     const handleOnline = () => setIsNetworkOffline(false);
// //     const handleOffline = () => setIsNetworkOffline(true);
// //     window.addEventListener('online', handleOnline);
// //     window.addEventListener('offline', handleOffline);
// //     return () => {
// //       window.removeEventListener('online', handleOnline);
// //       window.removeEventListener('offline', handleOffline);
// //     };
// //   }, []);

// //   const crashQuery = useMemoFirebase(() => {
// //     if (!firestore || isNetworkOffline) return null;
// //     return query(collection(firestore, 'fatal_crashes'), orderBy('timestamp', 'desc'), limit(100));
// //   }, [firestore, isNetworkOffline]);

// //   const { data: crashes, isLoading } = useCollection(crashQuery);

// //   const activeCrashes = useMemo(() => crashes?.filter((c: any) => c.status !== 'resolved') || [], [crashes]);
// //   const resolvedCrashes = useMemo(() => crashes?.filter((c: any) => c.status === 'resolved') || [], [crashes]);
// //   const totalCount = crashes?.length || 0;

// //   const handleResolveSubmit = useCallback(async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!selectedCrash || !functions || isProcessing) return;

// //     setIsProcessing(true);
// //     try {
// //       const repairFn = httpsCallable(functions, 'repairSystemRupture');
// //       await repairFn({ crashId: selectedCrash.id, resolveNote });
// //       triggerHaptic('success');
// //       toast({ title: 'تم الإنفاذ والتوثيق السيادي بنجاح ✅' });
// //       setResolveDialogOpen(false);
// //       setResolveNote('');
// //     } catch (error: any) {
// //       toast({ variant: 'destructive', title: 'فشل الإنفاذ', description: error.message });
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   }, [functions, selectedCrash, resolveNote, isProcessing, toast]);

// //   const handleReopen = async (crashId: string) => {
// //     if (!firestore || isProcessing) return;
// //     setIsProcessing(true);
// //     try {
// //       const crashRef = doc(firestore, 'fatal_crashes', crashId);
// //       await updateDoc(crashRef, {
// //         status: 'active',
// //         reopenedAt: serverTimestamp(),
// //         reopenedBy: 'DEVELOPER_OVERRIDE'
// //       });
// //       toast({ title: 'تم إعادة فتح العطل 🔓' });
// //     } catch (error: any) {
// //       toast({ variant: 'destructive', title: 'فشل الإجراء', description: error.message });
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const isCloudStable = !isNetworkOffline && pulseStatus === 'STABLE';
// //   const pulseColor = (isNetworkOffline || pulseStatus === 'ERR_RUPTURE') ? 'red' : 'emerald';

// //   return (
// //     <div className="space-y-6 animate-in fade-in duration-1000 p-2 md:p-4" dir="rtl">
// //       <header className="border-b border-primary/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
// //         <div>
// //           <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 font-mono text-foreground">
// //             <Terminal className="h-8 w-8 text-primary animate-pulse" />
// //             Terminal: Sovereign Monitoring
// //           </h1>
// //           <p className="text-muted-foreground text-sm mt-1">مركز الرصد الاستخباراتي ودورة حياة الأعطال.</p>
// //         </div>

// //         <div className="flex items-center gap-3">
// //           {/* [SCR-942]: THE RELOCATED SOVEREIGN TREE BUTTON */}
// //           <Button
// //             variant="outline"
// //             className="h-12 px-6 rounded-2xl font-black text-sm gap-2 border-primary/40 text-primary hover:bg-primary/10 shadow-[0_0_15px_rgba(190,174,119,0.1)] transition-all animate-in zoom-in duration-700"
// //             onClick={() => { triggerHaptic('light'); setIsTreeOpen(true); }}
// //           >
// //             <Network className="h-5 w-5" /> [ شجرة النظام ]
// //           </Button>

// //           <Badge variant="outline" className={cn(
// //             "font-mono bg-black px-4 py-1 uppercase tracking-widest text-[10px] gap-2",
// //             securityLevel === 'MASTER' ? "text-blue-400 border-blue-500/30" : "text-primary border-primary/30"
// //           )}>
// //             {securityLevel === 'MASTER' ? <ShieldCheck className="h-3 w-3 animate-pulse" /> : <Lock className="h-3 w-3" />}
// //             LVL: {securityLevel}
// //           </Badge>
// //         </div>
// //       </header>

// //       <div className="grid gap-4 md:grid-cols-3 ">
// //         <Card className="bg-black border-emerald-500/30 overflow-hidden relative">
// //           <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
// //           <CardContent className="p-4 flex flex-col gap-1">
// //             <span className="text-[10px] font-black text-emerald-500/70 uppercase">Cloud Pulse</span>
// //             <span className="text-xl font-mono text-emerald-500 font-black">{isCloudStable ? 'STABLE' : 'BOOTING...'}</span>
// //           </CardContent>
// //         </Card>

// //         <Card className="bg-black border-blue-500/30 overflow-hidden relative">
// //           <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
// //           <CardContent className="p-4 flex flex-col gap-1">
// //             <span className="text-[10px] font-black text-blue-500/70 uppercase">Data Artery</span>
// //             <span className="text-xl font-mono text-blue-500 font-black">{isNetworkOffline ? 'SEVERED' : 'SECURE'}</span>
// //           </CardContent>
// //         </Card>

// //         <Card className="bg-black border-red-500/30 overflow-hidden relative">
// //           <div className="absolute top-0 left-0 w-1 h-full bg-red-500 animate-pulse" />
// //           <CardContent className="p-4 flex flex-col gap-1">
// //             <span className="text-[10px] font-black text-red-500/70 uppercase">Active Ruptures</span>
// //             <span className="text-xl font-mono text-red-500 font-black">{activeCrashes.length}</span>
// //           </CardContent>
// //         </Card>
// //       </div>

// //       <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full ">
// //         <TabsList className="grid w-full grid-cols-2 h-14 bg-black border border-primary/20 p-1 rounded-xl mb-6">
// //           <TabsTrigger value="active" className="font-mono gap-2 text-sm data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
// //             <ShieldAlert className="h-4 w-4" /> ACTIVE ({activeCrashes.length})
// //           </TabsTrigger>
// //           <TabsTrigger value="resolved" className="font-mono gap-2 text-sm data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
// //             <CheckCircle2 className="h-4 w-4" /> ARCHIVE ({resolvedCrashes.length})
// //           </TabsTrigger>
// //         </TabsList>

// //         <TabsContent value="active" className="m-0 ">
// //           <Card className="border-red-500/20 bg-black/90 shadow-2xl overflow-hidden rounded-2xl">
// //             <CardContent className="p-0">
// //               {isLoading ? <div className="p-12"><Skeleton className="h-12 w-full" /></div> : (
// //                 <Table>
// //                   <TableHeader className="bg-red-500/10">
// //                     <TableRow className="border-red-500/10">
// //                       <TableHead className="text-right text-red-500/70 font-black py-4">السياق</TableHead>
// //                       <TableHead className="text-right text-red-500/70 font-black">البيانات</TableHead>
// //                       <TableHead className="text-left text-red-500/70 font-black">التوقيت</TableHead>
// //                       <TableHead className="text-center text-red-500/70 font-black">الإجراء</TableHead>
// //                     </TableRow>
// //                   </TableHeader>
// //                   <TableBody>
// //                     {activeCrashes.map((crash: any) => (
// //                       <TableRow key={crash.id} className="border-red-500/5 hover:bg-red-500/10 transition-colors">
// //                         <TableCell className="font-mono text-[10px] text-red-400 cursor-pointer">{crash.context}</TableCell>
// //                         <TableCell className="text-xs text-slate-300 font-medium text-right line-clamp-1">{crash.message}</TableCell>
// //                         <TableCell className="text-[10px] font-mono text-slate-500 text-left">{formatDate(crash.timestamp, 'HH:mm:ss', locale)}</TableCell>
// //                         <TableCell className="text-center">
// //                           <Button size="sm" variant="outline" className="h-8 bg-black border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20 font-black text-[10px]" onClick={() => { setSelectedCrash(crash); setResolveDialogOpen(true); }}>
// //                             <Wrench className="h-3 w-3 ml-1" /> صيانة
// //                           </Button>
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                   </TableBody>
// //                 </Table>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </TabsContent>

// //         <TabsContent value="resolved" className="m-0">
// //           <Card className="border-emerald-500/20 bg-black/90 shadow-2xl overflow-hidden rounded-2xl">
// //             <CardContent className="p-0">
// //               <Table>
// //                 <TableHeader className="bg-emerald-500/10">
// //                   <TableRow className="border-emerald-500/10">
// //                     <TableHead className="text-right text-emerald-500/70 font-black py-4">السياق</TableHead>
// //                     <TableHead className="text-right text-emerald-500/70 font-black">الحل</TableHead>
// //                     <TableHead className="text-left text-emerald-500/70 font-black">توقيت الإغلاق</TableHead>
// //                   </TableRow>
// //                 </TableHeader>
// //                 <TableBody>
// //                   {resolvedCrashes.map((crash: any) => (
// //                     <TableRow key={crash.id} className="border-emerald-500/5 opacity-80">
// //                       <TableCell className="font-mono text-[10px] text-red-400 text-right line-through">{crash.context}</TableCell>
// //                       <TableCell className="text-xs text-emerald-300 font-bold text-right">{crash.resolveNote}</TableCell>
// //                       <TableCell className="text-[10px] font-mono text-emerald-500 text-left">{formatDate(crash.resolvedAt, 'dd/MM HH:mm', locale)}</TableCell>
// //                     </TableRow>
// //                   ))}
// //                 </TableBody>
// //               </Table>
// //             </CardContent>
// //           </Card>
// //         </TabsContent>
// //       </Tabs>

// //       {/* [SCR-942]: SOVEREIGN SYSTEM TREE OVERLAY */}
// //       <Dialog open={isTreeOpen} onOpenChange={setIsTreeOpen}>
// //         <DialogContent className="max-w-[95vw] h-[90vh] bg-black/95 border-2 border-primary/30 p-0 overflow-hidden rounded-[3rem] shadow-[0_0_50px_rgba(190,174,119,0.2)]">
// //           <DialogHeader className="p-8 border-b border-white/10 bg-primary/5 flex flex-row items-center justify-between">
// //             <div className="flex items-center gap-4">
// //               <div className="p-4 bg-primary text-black rounded-2xl shadow-lg"><Binary className="h-8 w-8" /></div>
// //               <div className="text-right">
// //                 <DialogTitle className="text-3xl font-black tracking-tighter text-white italic uppercase">شجرة النظام</DialogTitle>
// //                 <DialogDescription className="text-xs font-bold text-primary/70 uppercase tracking-widest mt-1">Sovereign DNA & Protocol Mapping v2.1</DialogDescription>
// //               </div>
// //             </div>
// //             <Button variant="ghost" size="icon" onClick={() => setIsTreeOpen(false)} className="text-primary hover:bg-primary/10 rounded-full h-12 w-12"><XCircle className="h-8 w-8" /></Button>
// //           </DialogHeader>
// //           <div className="flex-1 overflow-hidden p-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent">
// //             <SovereignSystemTree />
// //           </div>
// //           <div className="p-4 border-t border-white/5 bg-black text-center">
// //             <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.5em]">Deep Architectural Intelligence • Secure DNA Manifest</p>
// //           </div>
// //         </DialogContent>
// //       </Dialog>

// //       {/* RESOLUTION DIALOG */}
// //       <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
// //         <DialogContent className="sm:max-w-md bg-black border-2 border-primary/30" dir="rtl">
// //           <form onSubmit={handleResolveSubmit}>
// //             <DialogHeader className="text-right">
// //               <DialogTitle className="text-xl font-black text-primary font-mono flex items-center gap-2"><Wrench className="h-5 w-5" /> Execute Atomic Repair</DialogTitle>
// //             </DialogHeader>
// //             <div className="py-6 space-y-4">
// //               <div className="space-y-2">
// //                 <Label className="text-xs font-black text-slate-300 block uppercase">ملاحظة الصيانة</Label>
// //                 <Input required placeholder="أدخل تفاصيل الترقيع..." value={resolveNote} onChange={e => setResolveNote(e.target.value)} className="bg-white/5 border-white/10 text-white font-mono h-12 text-right" />
// //               </div>
// //             </div>
// //             <DialogFooter>
// //               <Button type="submit" disabled={isProcessing || !resolveNote} className="w-full font-black tracking-widest uppercase py-6">
// //                 {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Commit Resolution"}
// //               </Button>
// //             </DialogFooter>
// //           </form>
// //         </DialogContent>
// //       </Dialog>
// //     </div>
// //   );
// // }
// 'use client';

// import { useFirestore, useCollection, useMemoFirebase, useFunctions } from '@/firebase';
// import { collection, query, orderBy, limit } from 'firebase/firestore';
// import { httpsCallable } from 'firebase/functions';
// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import {
//   Terminal, ShieldAlert, Wrench, CheckCircle2,
//   Loader2, ShieldCheck, Lock, Eye, Network, XCircle,
//   FileCode, AlertCircle, Fingerprint, Activity, Database
// } from 'lucide-react';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Badge } from '@/components/ui/badge';
// import { formatDate } from '@/lib/formatters';
// import { useLocale } from 'next-intl';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { useToast } from '@/hooks/use-toast';
// import { cn, triggerHaptic } from '@/lib/utils';
// import { useRouter, useSearchParams, usePathname } from 'next/navigation';
// import { ScrollArea } from '@/components/ui/scroll-area';

// /**
//  * @page DevCenterPage
//  * @description THE SUPREME DIAMOND BLACK BOX TERMINAL [SCR-2026-049 - FULL FORENSICS]
//  * [SCR-049]: Full Wing Realignment. Real-time Crash Pulse & Metadata dissection.
//  * Protocol 16: Sterilized. Protocol 20: Immune System Watchdog.
//  */
// export default function DevCenterPage() {
//   const firestore = useFirestore();
//   const functions = useFunctions();
//   const locale = useLocale();
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const pathname = usePathname();

//   const { profile, pulseStatus, securityLevel } = useUserProfile();
//   const { toast } = useToast();

//   const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
//   const [detailDialogOpen, setDetailDialogOpen] = useState(false);
//   const [selectedCrash, setSelectedCrash] = useState<any>(null);
//   const [resolveNote, setResolveNote] = useState('');
//   const [isProcessing, setIsProcessing] = useState(false);

//   const activeTab = searchParams.get('tab') || 'active';

//   const handleTabChange = useCallback((val: string) => {
//     const params = new URLSearchParams(searchParams.toString());
//     params.set('tab', val);
//     router.replace(`${pathname}?${params.toString()}`);
//   }, [router, pathname, searchParams]);

//   const crashQuery = useMemoFirebase(() => {
//     if (!firestore) return null;
//     return query(collection(firestore, 'fatal_crashes'), orderBy('timestamp', 'desc'), limit(100));
//   }, [firestore]);

//   const { data: crashes, isLoading } = useCollection(crashQuery);

//   const activeCrashes = useMemo(() => crashes?.filter((c: any) => c.status !== 'resolved') || [], [crashes]);
//   const resolvedCrashes = useMemo(() => crashes?.filter((c: any) => c.status === 'resolved') || [], [crashes]);

//   const handleSelectError = (crash: any) => {
//     triggerHaptic('light');
//     setSelectedCrash(crash);
//     setDetailDialogOpen(true);
//   };

//   const handleResolveSubmit = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedCrash || !functions || isProcessing) return;

//     setIsProcessing(true);
//     try {
//       const repairFn = httpsCallable(functions, 'repairSystemRupture');
//       await repairFn({ crashId: selectedCrash.id, resolveNote });
//       triggerHaptic('success');
//       toast({ title: 'تم الإنفاذ والتوثيق السيادي بنجاح ✅' });
//       setResolveDialogOpen(false);
//       setDetailDialogOpen(false);
//       setResolveNote('');
//     } catch (error: any) {
//       toast({ variant: 'destructive', title: 'فشل الإنفاذ', description: error.message });
//     } finally {
//       setIsProcessing(false);
//     }
//   }, [functions, selectedCrash, resolveNote, isProcessing, toast]);

//   return (
//     <div className="space-y-6 animate-in fade-in duration-1000 p-2 md:p-4 bg-zinc-950/20 rounded-[2.5rem] border border-white/5" dir="rtl">
//       <header className="border-b border-primary/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div className="flex items-center gap-4">
//           <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
//             <Terminal className="h-8 w-8 text-primary animate-pulse" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-black tracking-tight font-mono text-foreground uppercase italic">Sovereign Black Box</h1>
//             <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Forensic Terminal v4.9 [SCR-049]</p>
//           </div>
//         </div>

//         <Badge variant="outline" className={cn(
//           "font-mono bg-black px-6 py-2 uppercase tracking-widest text-[10px] gap-2 rounded-full border-primary/30 shadow-lg",
//           securityLevel === 'MASTER' ? "text-blue-400 border-blue-500/30" : "text-primary"
//         )}>
//           {securityLevel === 'MASTER' ? <ShieldCheck className="h-3 w-3 animate-pulse" /> : <Lock className="h-3 w-3" />}
//           System Immunity: {securityLevel}
//         </Badge>
//       </header>

//       <div className="grid gap-4 md:grid-cols-4">
//         <Card className="bg-black/40 border-emerald-500/20 overflow-hidden relative rounded-2xl">
//           <CardContent className="p-4 flex flex-col gap-1">
//             <span className="text-[10px] font-black text-emerald-500/70 uppercase flex items-center gap-1"><Activity className="h-3 w-3" /> Cloud Artery</span>
//             <span className="text-xl font-mono text-emerald-500 font-black">{pulseStatus === 'STABLE' ? 'CONNECTED' : 'PULSING...'}</span>
//           </CardContent>
//         </Card>
//         <Card className="bg-black/40 border-primary/20 overflow-hidden relative rounded-2xl">
//           <CardContent className="p-4 flex flex-col gap-1">
//             <span className="text-[10px] font-black text-primary/70 uppercase flex items-center gap-1"><Database className="h-3 w-3" /> Field Vault</span>
//             <span className="text-xl font-mono text-primary font-black">{crashes?.length || 0} TOTAL</span>
//           </CardContent>
//         </Card>
//         <Card className="bg-black/40 border-red-500/20 overflow-hidden relative rounded-2xl">
//           <CardContent className="p-4 flex flex-col gap-1">
//             <span className="text-[10px] font-black text-red-500/70 uppercase flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Active Ruptures</span>
//             <span className="text-xl font-mono text-red-500 font-black animate-pulse">{activeCrashes.length}</span>
//           </CardContent>
//         </Card>
//         <Card className="bg-black/40 border-blue-500/20 overflow-hidden relative rounded-2xl">
//           <CardContent className="p-4 flex flex-col gap-1">
//             <span className="text-[10px] font-black text-blue-500/70 uppercase flex items-center gap-1"><Fingerprint className="h-3 w-3" /> Integrity Score</span>
//             <span className="text-xl font-mono text-blue-500 font-black">99.2%</span>
//           </CardContent>
//         </Card>
//       </div>

//       <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
//         <TabsList className="grid w-full grid-cols-2 h-14 bg-black/60 border border-white/5 p-1 rounded-2xl mb-6 shadow-2xl">
//           <TabsTrigger value="active" className="font-mono gap-2 text-xs data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 rounded-xl transition-all uppercase tracking-widest">
//             <ShieldAlert className="h-4 w-4" /> [ ACTIVE_LOG ]
//           </TabsTrigger>
//           <TabsTrigger value="resolved" className="font-mono gap-2 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 rounded-xl transition-all uppercase tracking-widest">
//             <CheckCircle2 className="h-4 w-4" /> [ ARCHIVE ]
//           </TabsTrigger>
//         </TabsList>

//         <TabsContent value="active" className="m-0">
//           <Card className="border-white/5 bg-black/40 shadow-2xl overflow-hidden rounded-[2rem]">
//             <CardContent className="p-0">
//               {isLoading ? <div className="p-12 space-y-4"><Skeleton className="h-12 w-full bg-white/5" /><Skeleton className="h-12 w-full bg-white/5" /></div> : (
//                 <Table>
//                   <TableHeader className="bg-white/5">
//                     <TableRow className="border-white/5">
//                       <TableHead className="text-right text-muted-foreground font-black py-4 uppercase text-[10px]">Location</TableHead>
//                       <TableHead className="text-right text-muted-foreground font-black uppercase text-[10px]">Message</TableHead>
//                       <TableHead className="text-center text-muted-foreground font-black uppercase text-[10px]">Hits</TableHead>
//                       <TableHead className="text-left text-muted-foreground font-black uppercase text-[10px]">Last Pulse</TableHead>
//                       <TableHead className="text-center text-muted-foreground font-black uppercase text-[10px]">Inspect</TableHead>
//                     </TableRow>
//                   </TableHeader>
//                   <TableBody>
//                     {activeCrashes.map((crash: any) => (
//                       <TableRow key={crash.id} className="border-white/5 hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => handleSelectError(crash)}>
//                         <TableCell className="font-mono text-[10px] text-primary group-hover:text-white transition-colors">
//                           {crash.filePath?.split('/').pop() || 'Internal'}:{crash.lineNumber || 0}
//                         </TableCell>
//                         <TableCell className="text-xs text-slate-300 font-bold text-right truncate max-w-[350px]">{crash.message}</TableCell>
//                         <TableCell className="text-center">
//                           <Badge variant="secondary" className="font-mono text-[10px] bg-red-500/10 text-red-400 border-0">{crash.occurrenceCount || 1}</Badge>
//                         </TableCell>
//                         <TableCell className="text-[10px] font-mono text-slate-500 text-left">{formatDate(crash.timestamp, 'HH:mm:ss', locale)}</TableCell>
//                         <TableCell className="text-center">
//                           <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/10 rounded-full">
//                             <Eye className="h-4 w-4" />
//                           </Button>
//                         </TableCell>
//                       </TableRow>
//                     ))}
//                     {activeCrashes.length === 0 && (
//                       <TableRow><TableCell colSpan={5} className="py-20 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-30">The Fortress is Silent. No active ruptures.</TableCell></TableRow>
//                     )}
//                   </TableBody>
//                 </Table>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="resolved" className="m-0">
//           <Card className="border-white/5 bg-black/40 shadow-2xl overflow-hidden rounded-[2rem]">
//             <CardContent className="p-0">
//               <Table>
//                 <TableHeader className="bg-emerald-500/5">
//                   <TableRow className="border-white/5">
//                     <TableHead className="text-right text-emerald-500/70 font-black py-4 uppercase text-[10px]">Repaired Artery</TableHead>
//                     <TableHead className="text-right text-emerald-500/70 font-black uppercase text-[10px]">Forensic Note</TableHead>
//                     <TableHead className="text-left text-emerald-500/70 font-black uppercase text-[10px]">Seal Time</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {resolvedCrashes.map((crash: any) => (
//                     <TableRow key={crash.id} className="border-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleSelectError(crash)}>
//                       <TableCell className="font-mono text-[10px] text-slate-500 text-right line-through">{crash.filePath}</TableCell>
//                       <TableCell className="text-xs text-emerald-300 font-bold text-right italic">"{crash.resolveNote}"</TableCell>
//                       <TableCell className="text-[10px] font-mono text-emerald-500 text-left">{formatDate(crash.resolvedAt, 'dd/MM HH:mm', locale)}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       {/* RUPTURE DETAIL DIALOG (Groomed for Command) */}
//       <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
//         <DialogContent className="max-w-6xl bg-zinc-950 border-2 border-primary/20 p-0 overflow-hidden rounded-[3rem] shadow-[0_0_80px_rgba(190,174,119,0.15)]">
//           {selectedCrash && (
//             <div className="flex flex-col h-[85vh]" dir="rtl">
//               <div className="p-8 bg-primary/5 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
//                 <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><ShieldAlert className="h-32 w-32" /></div>
//                 <div className="flex items-center gap-4 relative z-10">
//                   <div className="p-4 bg-primary text-black rounded-[1.5rem] shadow-xl"><AlertCircle className="h-8 w-8" /></div>
//                   <div>
//                     <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Forensic Audit Report</h2>
//                     <p className="text-[10px] font-mono text-primary uppercase tracking-widest mt-1">HASH_TOKEN: {selectedCrash.errorHash}</p>
//                   </div>
//                 </div>
//                 <Button variant="ghost" size="icon" onClick={() => setDetailDialogOpen(false)} className="text-slate-500 hover:bg-white/5 rounded-full h-12 w-12"><XCircle className="h-8 w-8" /></Button>
//               </div>

//               <ScrollArea className="flex-1 p-8 ">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//                   <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-1 shadow-inner">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Source File</p>
//                     <p className="text-sm font-mono text-primary truncate" dir="ltr">{selectedCrash.filePath}</p>
//                   </div>
//                   <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-1 shadow-inner">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Line Index</p>
//                     <p className="text-sm font-mono text-primary">{selectedCrash.lineNumber}</p>
//                   </div>
//                   <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-1 shadow-inner">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operation Context</p>
//                     <Badge className="bg-blue-500/10 text-blue-400 border-0 text-[10px] font-black uppercase tracking-tighter">{selectedCrash.context}</Badge>
//                   </div>
//                 </div>

//                 <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] mb-8 relative">
//                   <div className="absolute top-4 left-4 opacity-20"><FileCode className="h-6 w-6 text-red-500" /></div>
//                   <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">Diagnostic Message</p>
//                   <p className="text-base font-bold text-white leading-relaxed">{selectedCrash.message}</p>
//                 </div>

//                 {selectedCrash.metadata && (
//                   <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] mb-8">
//                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Operational Metadata (Agent Context)</p>
//                     <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto ltr" dir="ltr">
//                       {JSON.stringify(selectedCrash.metadata, null, 2)}
//                     </pre>
//                   </div>
//                 )}

//                 <div className="p-6 bg-black/60 rounded-[2rem] border border-white/10 shadow-2xl">
//                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
//                     <Database className="h-4 w-4" /> Full Stack Trace Analysis
//                   </p>
//                   <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto p-4 bg-zinc-900/50 rounded-2xl leading-relaxed ltr" dir="ltr">
//                     {selectedCrash.stack}
//                   </pre>
//                 </div>
//               </ScrollArea>

//               {selectedCrash.status === 'active' && (
//                 <div className="p-8 bg-zinc-900 border-t border-white/5">
//                   <Button
//                     className="w-full h-16 bg-primary text-black hover:bg-primary/90 font-black text-xl gap-3 rounded-[1.5rem] shadow-2xl active:scale-[0.98] transition-all"
//                     onClick={() => setResolveDialogOpen(true)}
//                   >
//                     <Wrench className="h-6 w-6" /> تنفيذ الإصلاح السيادي النهائي
//                   </Button>
//                 </div>
//               )}
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* RESOLUTION DIALOG (The Final Seal) */}
//       <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
//         <DialogContent className="sm:max-w-md bg-black border-2 border-primary/30 rounded-[2.5rem] shadow-2xl" dir="rtl">
//           <form onSubmit={handleResolveSubmit}>
//             <DialogHeader className="text-right">
//               <div className="p-3 bg-primary/10 w-fit rounded-xl mb-4"><Wrench className="h-6 w-6 text-primary" /></div>
//               <DialogTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Commit Forensic Fix</DialogTitle>
//               <DialogDescription className="text-xs font-bold text-muted-foreground">توثيق الحل وإغلاق الصدع الهيكلي للأبد.</DialogDescription>
//             </DialogHeader>
//             <div className="py-8 space-y-4">
//               <div className="space-y-2">
//                 <Label className="text-[10px] font-black text-primary uppercase tracking-widest px-1">Maintenance Seal (Required)</Label>
//                 <Input
//                   required
//                   placeholder="مثال: تم إصلاح التعارض النمطي في مفاعل الوكلاء..."
//                   value={resolveNote}
//                   onChange={e => setResolveNote(e.target.value)}
//                   className="bg-white/5 border-white/10 text-white font-bold h-14 rounded-xl focus:ring-primary/30"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button type="submit" disabled={isProcessing || !resolveNote} className="w-full font-black text-lg h-14 rounded-2xl shadow-xl">
//                 {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Commit Resolution"}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


//==============================


'use client';

import { useFirestore, useCollection, useMemoFirebase, useFunctions } from '@/firebase';
import { collection, query, orderBy, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Terminal, ShieldAlert, Wrench, CheckCircle2,
  Loader2, ShieldCheck, Lock, Eye, Network, XCircle,
  FileCode, AlertCircle, Fingerprint, Activity, Database
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/formatters';
import { useLocale } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useToast } from '@/hooks/use-toast';
import { cn, triggerHaptic } from '@/lib/utils';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @page DevCenterPage
 * @description THE SUPREME DIAMOND BLACK BOX TERMINAL [SCR-2026-049 - FULL FORENSICS]
 * [SCR-049]: Full Wing Realignment. Real-time Crash Pulse & Metadata dissection.
 * Protocol 16: Sterilized. Protocol 20: Immune System Watchdog.
 */
export default function DevCenterPage() {
  const firestore = useFirestore();
  const functions = useFunctions();
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { profile, pulseStatus, securityLevel } = useUserProfile();
  const { toast } = useToast();

  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedCrash, setSelectedCrash] = useState<any>(null);
  const [resolveNote, setResolveNote] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const activeTab = searchParams.get('tab') || 'active';

  const handleTabChange = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', val);
    router.replace(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const crashQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'fatal_crashes'), orderBy('timestamp', 'desc'), limit(100));
  }, [firestore]);

  const { data: crashes, isLoading } = useCollection(crashQuery);

  const activeCrashes = useMemo(() => crashes?.filter((c: any) => c.status !== 'resolved') || [], [crashes]);
  const resolvedCrashes = useMemo(() => crashes?.filter((c: any) => c.status === 'resolved') || [], [crashes]);

  const handleSelectError = (crash: any) => {
    triggerHaptic('light');
    setSelectedCrash(crash);
    setDetailDialogOpen(true);
  };

  const handleResolveSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrash || !functions || isProcessing) return;

    setIsProcessing(true);
    try {
      const repairFn = httpsCallable(functions, 'repairSystemRupture');
      await repairFn({ crashId: selectedCrash.id, resolveNote });
      triggerHaptic('success');
      toast({ title: 'تم الإنفاذ والتوثيق السيادي بنجاح ✅' });
      setResolveDialogOpen(false);
      setDetailDialogOpen(false);
      setResolveNote('');
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'فشل الإنفاذ', description: error.message });
    } finally {
      setIsProcessing(false);
    }
  }, [functions, selectedCrash, resolveNote, isProcessing, toast]);

  return (
    <div className="space-y-6 animate-in fade-in duration-1000 p-2 md:p-4 bg-zinc-950/20 rounded-[2.5rem] border border-white/5" dir="rtl">
      <header className="border-b border-primary/20 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20 shadow-inner">
            <Terminal className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight font-mono text-foreground uppercase italic">Sovereign Black Box</h1>
            <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Forensic Terminal v4.9 [SCR-049]</p>
          </div>
        </div>

        <Badge variant="outline" className={cn(
          "font-mono bg-black px-6 py-2 uppercase tracking-widest text-[10px] gap-2 rounded-full border-primary/30 shadow-lg",
          securityLevel === 'MASTER' ? "text-blue-400 border-blue-500/30" : "text-primary"
        )}>
          {securityLevel === 'MASTER' ? <ShieldCheck className="h-3 w-3 animate-pulse" /> : <Lock className="h-3 w-3" />}
          System Immunity: {securityLevel}
        </Badge>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-black/40 border-emerald-500/20 overflow-hidden relative rounded-2xl">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-emerald-500/70 uppercase flex items-center gap-1"><Activity className="h-3 w-3" /> Cloud Artery</span>
            <span className="text-xl font-mono text-emerald-500 font-black">{pulseStatus === 'STABLE' ? 'CONNECTED' : 'PULSING...'}</span>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-primary/20 overflow-hidden relative rounded-2xl">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-primary/70 uppercase flex items-center gap-1"><Database className="h-3 w-3" /> Field Vault</span>
            <span className="text-xl font-mono text-primary font-black">{crashes?.length || 0} TOTAL</span>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-red-500/20 overflow-hidden relative rounded-2xl">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-red-500/70 uppercase flex items-center gap-1"><ShieldAlert className="h-3 w-3" /> Active Ruptures</span>
            <span className="text-xl font-mono text-red-500 font-black animate-pulse">{activeCrashes.length}</span>
          </CardContent>
        </Card>
        <Card className="bg-black/40 border-blue-500/20 overflow-hidden relative rounded-2xl">
          <CardContent className="p-4 flex flex-col gap-1">
            <span className="text-[10px] font-black text-blue-500/70 uppercase flex items-center gap-1"><Fingerprint className="h-3 w-3" /> Integrity Score</span>
            <span className="text-xl font-mono text-blue-500 font-black">99.2%</span>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-14 bg-black/60 border border-white/5 p-1 rounded-2xl mb-6 shadow-2xl">
          <TabsTrigger value="active" className="font-mono gap-2 text-xs data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400 rounded-xl transition-all uppercase tracking-widest">
            <ShieldAlert className="h-4 w-4" /> [ ACTIVE_LOG ]
          </TabsTrigger>
          <TabsTrigger value="resolved" className="font-mono gap-2 text-xs data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400 rounded-xl transition-all uppercase tracking-widest">
            <CheckCircle2 className="h-4 w-4" /> [ ARCHIVE ]
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="m-0">
          <Card className="border-white/5 bg-black/40 shadow-2xl overflow-hidden rounded-[2rem]">
            <CardContent className="p-0">
              {isLoading ? <div className="p-12 space-y-4"><Skeleton className="h-12 w-full bg-white/5" /><Skeleton className="h-12 w-full bg-white/5" /></div> : (
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5">
                      <TableHead className="text-right text-muted-foreground font-black py-4 uppercase text-[10px]">Location</TableHead>
                      <TableHead className="text-right text-muted-foreground font-black uppercase text-[10px]">Message</TableHead>
                      <TableHead className="text-center text-muted-foreground font-black uppercase text-[10px]">Hits</TableHead>
                      <TableHead className="text-left text-muted-foreground font-black uppercase text-[10px]">Last Pulse</TableHead>
                      <TableHead className="text-center text-muted-foreground font-black uppercase text-[10px]">Inspect</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCrashes.map((crash: any) => (
                      <TableRow key={crash.id} className="border-white/5 hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => handleSelectError(crash)}>
                        <TableCell className="font-mono text-[10px] text-primary group-hover:text-white transition-colors">
                          {crash.filePath?.split('/').pop() || 'Internal'}:{crash.lineNumber || 0}
                        </TableCell>
                        <TableCell className="text-xs text-slate-300 font-bold text-right truncate max-w-[350px]">{crash.message}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="font-mono text-[10px] bg-red-500/10 text-red-400 border-0">{crash.occurrenceCount || 1}</Badge>
                        </TableCell>
                        <TableCell className="text-[10px] font-mono text-slate-500 text-left">{formatDate(crash.timestamp, 'HH:mm:ss', locale)}</TableCell>
                        <TableCell className="text-center">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-primary hover:bg-primary/10 rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {activeCrashes.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="py-20 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest opacity-30">The Fortress is Silent. No active ruptures.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved" className="m-0">
          <Card className="border-white/5 bg-black/40 shadow-2xl overflow-hidden rounded-[2rem]">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-emerald-500/5">
                  <TableRow className="border-white/5">
                    <TableHead className="text-right text-emerald-500/70 font-black py-4 uppercase text-[10px]">Repaired Artery</TableHead>
                    <TableHead className="text-right text-emerald-500/70 font-black uppercase text-[10px]">Forensic Note</TableHead>
                    <TableHead className="text-left text-emerald-500/70 font-black uppercase text-[10px]">Seal Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolvedCrashes.map((crash: any) => (
                    <TableRow key={crash.id} className="border-white/5 opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => handleSelectError(crash)}>
                      <TableCell className="font-mono text-[10px] text-slate-500 text-right line-through">{crash.filePath}</TableCell>
                      <TableCell className="text-xs text-emerald-300 font-bold text-right italic">"{crash.resolveNote}"</TableCell>
                      <TableCell className="text-[10px] font-mono text-emerald-500 text-left">{formatDate(crash.resolvedAt, 'dd/MM HH:mm', locale)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* RUPTURE DETAIL DIALOG (Groomed for Command) */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-6xl bg-zinc-950 border-2 border-primary/20 p-0 overflow-hidden rounded-[3rem] shadow-[0_0_80px_rgba(190,174,119,0.15)]">
          {selectedCrash && (
            <div className="flex flex-col h-[85vh]" dir="rtl">
              <div className="p-8 bg-primary/5 border-b border-white/5 flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none"><ShieldAlert className="h-32 w-32" /></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-4 bg-primary text-black rounded-[1.5rem] shadow-xl"><AlertCircle className="h-8 w-8" /></div>
                  <div>
                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Forensic Audit Report</h2>
                    <p className="text-[10px] font-mono text-primary uppercase tracking-widest mt-1">HASH_TOKEN: {selectedCrash.errorHash}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setDetailDialogOpen(false)} className="text-slate-500 hover:bg-white/5 rounded-full h-12 w-12"><XCircle className="h-8 w-8" /></Button>
              </div>

              <ScrollArea className="flex-1 p-8 ">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-1 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Source File</p>
                    <p className="text-sm font-mono text-primary truncate" dir="ltr">{selectedCrash.filePath}</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-1 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Line Index</p>
                    <p className="text-sm font-mono text-primary">{selectedCrash.lineNumber}</p>
                  </div>
                  <div className="p-5 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-1 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Operation Context</p>
                    <Badge className="bg-blue-500/10 text-blue-400 border-0 text-[10px] font-black uppercase tracking-tighter">{selectedCrash.context}</Badge>
                  </div>
                </div>

                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[2rem] mb-8 relative">
                  <div className="absolute top-4 left-4 opacity-20"><FileCode className="h-6 w-6 text-red-500" /></div>
                  <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-3">Diagnostic Message</p>
                  <p className="text-base font-bold text-white leading-relaxed">{selectedCrash.message}</p>
                </div>

                {selectedCrash.metadata && (
                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-[2rem] mb-8">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Operational Metadata (Agent Context)</p>
                    <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto ltr" dir="ltr">
                      {JSON.stringify(selectedCrash.metadata, null, 2)}
                    </pre>
                  </div>
                )}

                <div className="p-6 bg-black/60 rounded-[2rem] border border-white/10 shadow-2xl">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Database className="h-4 w-4" /> Full Stack Trace Analysis
                  </p>
                  <pre className="text-[10px] font-mono text-slate-400 overflow-x-auto p-4 bg-zinc-900/50 rounded-2xl leading-relaxed ltr" dir="ltr">
                    {selectedCrash.stack}
                  </pre>
                </div>
              </ScrollArea>

              {selectedCrash.status === 'active' && (
                <div className="p-8 bg-zinc-900 border-t border-white/5">
                  <Button
                    className="w-full h-16 bg-primary text-black hover:bg-primary/90 font-black text-xl gap-3 rounded-[1.5rem] shadow-2xl active:scale-[0.98] transition-all"
                    onClick={() => setResolveDialogOpen(true)}
                  >
                    <Wrench className="h-6 w-6" /> تنفيذ الإصلاح السيادي النهائي
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* RESOLUTION DIALOG (The Final Seal) */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent className="sm:max-w-md bg-black border-2 border-primary/30 rounded-[2.5rem] shadow-2xl" dir="rtl">
          <form onSubmit={handleResolveSubmit}>
            <DialogHeader className="text-right">
              <div className="p-3 bg-primary/10 w-fit rounded-xl mb-4"><Wrench className="h-6 w-6 text-primary" /></div>
              <DialogTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Commit Forensic Fix</DialogTitle>
              <DialogDescription className="text-xs font-bold text-muted-foreground">توثيق الحل وإغلاق الصدع الهيكلي للأبد.</DialogDescription>
            </DialogHeader>
            <div className="py-8 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-primary uppercase tracking-widest px-1">Maintenance Seal (Required)</Label>
                <Input
                  required
                  placeholder="مثال: تم إصلاح التعارض النمطي في مفاعل الوكلاء..."
                  value={resolveNote}
                  onChange={e => setResolveNote(e.target.value)}
                  className="bg-white/5 border-white/10 text-white font-bold h-14 rounded-xl focus:ring-primary/30"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isProcessing || !resolveNote} className="w-full font-black text-lg h-14 rounded-2xl shadow-xl">
                {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Commit Resolution"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}