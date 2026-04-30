// 'use client';

// import { useState, useMemo, useCallback } from 'react';
// import { useFirestore, useCollection, useMemoFirebase, useFunctions } from '@/firebase';
// import { StaffService } from '@/services/staff-service';
// import { type Staff, PERMISSION_MATRIX } from '@/types/staff';
// import { useUserProfile } from '@/hooks/use-user-profile';
// import { useToast } from '@/hooks/use-toast';
// import { useRouter } from 'next/navigation';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from '@/components/ui/table';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { Skeleton } from '@/components/ui/skeleton';
// import { Progress } from '@/components/ui/progress';
// import {
//   Search, Power, Eye, Loader2,
//   ShieldAlert, Target, Zap
// } from 'lucide-react';
// import { AddStaffDialog } from '@/components/admin/staff/add-staff-dialog';
// import { cn } from '@/lib/utils';

// /**
//  * @component StaffRegistryHub
//  * @description THE REINFORCED SOVEREIGN DNA (DIAMOND STERILIZED - SC-806 V7.2 - REACTOR EDITION)
//  * [SC-806 V7.2]: Injected Agent Target Radar and financial status.
//  * Protocol 16: Pure presentational island. Protocol 88: Resource Protected.
//  */
// export default function StaffRegistryHub() {
//   const firestore = useFirestore();
//   const functions = useFunctions();
//   const { profile } = useUserProfile();
//   const router = useRouter();
//   const { toast } = useToast();

//   const [searchTerm, setSearchTerm] = useState('');
//   const [isProcessing, setIsProcessing] = useState<string | null>(null);

//   const registryQuery = useMemoFirebase(() => {
//     if (!firestore) return null;
//     return StaffService.getRegistryQuery(firestore);
//   }, [firestore]);

//   const { data: staffList, isLoading } = useCollection<Staff>(registryQuery);

//   const filteredStaff = useMemo(() => {
//     if (!staffList) return [];
//     const q = searchTerm.toLowerCase().trim();
//     if (!q) return staffList;
//     return staffList.filter(s =>
//       s.fullName?.toLowerCase().includes(q) ||
//       s.email?.toLowerCase().includes(q) ||
//       s.role?.toLowerCase().includes(q)
//     );
//   }, [staffList, searchTerm]);

//   const handleToggleStatus = useCallback(async (staff: Staff) => {
//     if (!functions) return;

//     const actionLabel = staff.isActive ? 'تجميد' : 'تفعيل';
//     // [PROTOCOL 16]: Safe Browser Prompt
//     const reason = typeof window !== 'undefined' ? window.prompt(`⚠️ تأكيد إجراء سيادي: ${actionLabel} الكادر\nيرجى كتابة سبب الإجراء لتوثيق في السجل الجنائي:`) : null;

//     if (!reason || reason.trim().length < 5) {
//       if (reason !== null) {
//         toast({ variant: 'destructive', title: 'فشل الإجراء', description: 'يجب ذكر سبب واضح (5 أحرف على الأقل) للتوثيق.' });
//       }
//       return;
//     }

//     setIsProcessing(staff.id);
//     try {
//       // [SCR-979]: Corrected Call Signature (Functions, ID, Status, Reason)
//       await StaffService.toggleStaffStatus(functions, staff.id, staff.isActive, reason);
//       toast({ title: staff.isActive ? "تم تجميد الكادر ❄️" : "تم إعادة التفعيل ✅" });
//     } catch (e: any) {
//       toast({ variant: 'destructive', title: 'فشل الإجراء', description: e.message });
//     } finally {
//       setIsProcessing(null);
//     }
//   }, [functions, toast]);

//   return (
//     <div className="space-y-6 animate-in fade-in duration-500 bg-white p-6 rounded-2xl border border-slate-200" dir="rtl">

//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//         <div className="flex-1 relative w-full max-w-md">
//           <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
//           <Input
//             placeholder="البحث في السجل الذهبي (اسم، بريد، رتبة)..."
//             className="pr-10 h-11 bg-slate-50 border-slate-200 font-bold text-slate-900"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//         <AddStaffDialog onSuccess={() => { }} />
//       </div>

//       <div className="overflow-x-auto">
//         <Table>
//           <TableHeader className="bg-slate-50 border-b border-slate-200">
//             <TableRow>
//               <TableHead className="py-4 text-right text-slate-600 font-black">الكادر السيادي</TableHead>
//               <TableHead className="text-right text-slate-600 font-black">الرتبة والدور</TableHead>
//               <TableHead className="text-right text-slate-600 font-black min-w-[180px]">مؤشر الهدف (للوكلاء)</TableHead>
//               <TableHead className="text-right text-slate-600 font-black">المستحقات / الراتب</TableHead>
//               <TableHead className="text-center text-slate-600 font-black">الحالة</TableHead>
//               <TableHead className="text-center text-slate-600 font-black w-[120px]">إجراءات</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               [...Array(5)].map((_, i) => (
//                 <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-14 w-full opacity-50" /></TableCell></TableRow>
//               ))
//             ) : (
//               filteredStaff.map(staff => {
//                 const isAgent = staff.role === 'agent';
//                 const target = staff.agentTarget || 1;
//                 const current = staff.currentBalance || 0;
//                 const progress = Math.min((current / target) * 100, 100);
//                 const displayName = staff.fullName || `${(staff as any).firstName || ''} ${(staff as any).lastName || ''}`.trim() || staff.email;

//                 return (
//                   <TableRow key={staff.id} className={cn(
//                     "hover:bg-slate-50/80 transition-colors border-slate-100",
//                     !staff.isActive && "opacity-60 grayscale-[0.5] bg-slate-50/30"
//                   )}>
//                     <TableCell>
//                       <div className="flex items-center gap-3 text-right">
//                         <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
//                           {/* <AvatarFallback className="bg-primary/10 text-primary font-black">{staff.fullName?.charAt(0)}</AvatarFallback> */}
//                           <AvatarFallback className="bg-primary/10 text-primary font-black">{displayName?.charAt(0)}</AvatarFallback>
//                         </Avatar>
//                         <div className="flex flex-col min-w-0">
//                           {/* <span className="font-black text-sm text-slate-900 truncate">{staff.fullName}</span> */}
//                           <span className="font-black text-sm text-slate-900 truncate">{displayName}</span>

//                           <span className="text-[10px] font-mono text-slate-500 truncate" dir="ltr">{staff.email}</span>
//                         </div>
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       {isAgent ? (
//                         <Badge className="bg-blue-100 text-blue-700 font-black text-[10px] gap-1 border-blue-200">
//                           <Zap className="h-3 w-3" /> وكيل سيادي
//                         </Badge>
//                       ) : (
//                         <Badge variant="outline" className="font-bold text-[10px] bg-white text-slate-700 uppercase tracking-tighter border-slate-200">
//                           {staff.role}
//                         </Badge>
//                       )}
//                     </TableCell>
//                     <TableCell>
//                       {isAgent ? (
//                         <div className="flex flex-col gap-1.5 min-w-[150px]">
//                           <div className="flex justify-between text-[9px] font-black text-slate-600">
//                             <span className="flex items-center gap-1"><Target className="h-3 w-3 text-primary" /> {current} / {target}</span>
//                             <span className="text-emerald-600">مكافأة: {staff.agentBonus} {staff.currency}</span>
//                           </div>
//                           <Progress value={progress} className="h-1.5 bg-slate-100 [&>div]:bg-blue-500 rounded-full" />
//                         </div>
//                       ) : (
//                         <div className="flex flex-wrap gap-1 max-w-[200px]">
//                           {PERMISSION_MATRIX.map(p => {
//                             const hasPerm = (staff.permissions as any)?.[p.id];
//                             if (!hasPerm) return null;
//                             return (
//                               <div key={p.id} title={p.label} className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
//                                 <p.icon className="h-3 w-3" />
//                               </div>
//                             );
//                           })}
//                         </div>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-right font-black text-emerald-600 text-xs">
//                       {isAgent ? (
//                         <span dir="ltr">{staff.lifetimeEarnings || 0} {staff.currency}</span>
//                       ) : (
//                         <span dir="ltr">{staff.baseSalary || 0} {staff.currency}</span>
//                       )}
//                     </TableCell>
//                     <TableCell className="text-center">
//                       <Badge className={cn(
//                         "font-black text-[10px] h-5 px-2",
//                         staff.isActive ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
//                       )}>
//                         {staff.isActive ? "نشط" : "مجمد"}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex items-center justify-center gap-1">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8 text-primary hover:bg-primary/5"
//                           onClick={() => router.push(`/admin/staff/${staff.id}`)}
//                         >
//                           <Eye className="h-4 w-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           className={cn(
//                             "h-8 w-8",
//                             staff.isActive ? "text-destructive hover:bg-destructive/5" : "text-emerald-600 hover:bg-emerald-50"
//                           )}
//                           onClick={() => handleToggleStatus(staff)}
//                           disabled={isProcessing === staff.id || staff.role === 'owner'}
//                         >
//                           {isProcessing === staff.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
//         <ShieldAlert className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
//         <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
//           <strong>ميثاق مفاعل العمولات [SCR-704]:</strong> يتم احتساب مستحقات الوكلاء وتحديث عداد الأهداف آلياً فور وصول الركاب. صرف المكافأة يتم ترحيله فوراً إلى السجل المالي المركزي لضمان الشفافية المطلقة.
//         </p>
//       </div>

//     </div>
//   );
// }


'use client';

import { useState, useMemo, useCallback } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useFunctions } from '@/firebase';
import { StaffService } from '@/services/staff-service';
import { type Staff, PERMISSION_MATRIX } from '@/types/staff';
import { useUserProfile } from '@/hooks/use-user-profile';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { doc, deleteDoc } from 'firebase/firestore';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search, Power, Eye, Loader2, ShieldAlert, Target, Zap, Trash2, Briefcase,
  Edit,
} from 'lucide-react';
import { AddStaffDialog } from '@/components/admin/staff/add-staff-dialog';
import { EditJobOfferDialog } from '@/components/admin/staff/edit-job-offer-dialog';
import { cn } from '@/lib/utils';

export default function StaffRegistryHub() {
  const firestore = useFirestore();
  const functions = useFunctions();
  const { profile: adminProfile } = useUserProfile();
  const router = useRouter();
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Staff | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [editTarget, setEditTarget] = useState<Staff | null>(null);

  const registryQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return StaffService.getRegistryQuery(firestore);
  }, [firestore]);

  const { data: staffList, isLoading } = useCollection<Staff>(registryQuery);

  const filteredStaff = useMemo(() => {
    if (!staffList) return [];
    const q = searchTerm.toLowerCase().trim();
    if (!q) return staffList;
    return staffList.filter(s =>
      s.fullName?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q) ||
      s.role?.toLowerCase().includes(q)
    );
  }, [staffList, searchTerm]);

  // Toggle Active
  const handleToggleStatus = useCallback(async (staff: Staff) => {
    if (!functions) return;
    const actionLabel = staff.isActive ? 'تجميد' : 'تفعيل';
    const reason = typeof window !== 'undefined'
      ? window.prompt(`⚠️ تأكيد: ${actionLabel} الكادر\nاكتب سبب الإجراء:`)
      : null;
    if (!reason || reason.trim().length < 5) {
      if (reason !== null) toast({ variant: 'destructive', title: 'فشل الإجراء', description: 'يجب ذكر سبب واضح (5 أحرف على الأقل).' });
      return;
    }
    setIsProcessing(staff.id);
    try {
      await StaffService.toggleStaffStatus(functions, staff.id, staff.isActive, reason);
      toast({ title: staff.isActive ? 'تم تجميد الكادر ❄️' : 'تم إعادة التفعيل ✅' });
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'فشل الإجراء', description: e.message });
    } finally {
      setIsProcessing(null);
    }
  }, [functions, toast]);

  // Permanent Delete
  const handleConfirmDelete = useCallback(async () => {
    if (!firestore || !deleteTarget || deleteReason.trim().length < 5) return;
    setIsProcessing(deleteTarget.id);
    try {
      await deleteDoc(doc(firestore, 'users', deleteTarget.id));
      toast({ title: 'تم الحذف النهائي 🗑️', description: `تم حذف ${deleteTarget.fullName || deleteTarget.email}` });
      setDeleteTarget(null);
      setDeleteReason('');
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'فشل الحذف', description: e.message });
    } finally {
      setIsProcessing(null);
    }
  }, [firestore, deleteTarget, deleteReason, toast]);

  // Open Edit Dialog
  const openEditDialog = (staff: Staff) => setEditTarget(staff);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 bg-white p-6 rounded-2xl border border-slate-200" dir="rtl">

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 relative w-full max-w-md">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="البحث في السجل الذهبي (اسم، بريد، رتبة)..."
            className="pr-10 h-11 bg-slate-50 border-slate-200 font-bold text-slate-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <AddStaffDialog onSuccess={() => { }} />
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50 border-b border-slate-200">
            <TableRow>
              <TableHead className="py-4 text-right text-slate-600 font-black">الكادر السيادي</TableHead>
              <TableHead className="text-right text-slate-600 font-black">الرتبة والدور</TableHead>
              <TableHead className="text-right text-slate-600 font-black min-w-[180px]">مؤشر الهدف (للوكلاء)</TableHead>
              <TableHead className="text-right text-slate-600 font-black">المستحقات / الراتب</TableHead>
              <TableHead className="text-center text-slate-600 font-black">الحالة</TableHead>
              <TableHead className="text-center text-slate-600 font-black w-[160px]">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}><TableCell colSpan={6}><Skeleton className="h-14 w-full opacity-50" /></TableCell></TableRow>
              ))
            ) : (
              filteredStaff.map(staff => {
                const isAgent = staff.role === 'agent';
                const isOwner = staff.role === 'owner';
                const target = staff.agentTarget || 1;
                const current = staff.currentBalance || 0;
                const progress = Math.min((current / target) * 100, 100);
                const displayName = staff.fullName || `${(staff as any).firstName || ''} ${(staff as any).lastName || ''}`.trim() || staff.email;

                return (
                  <TableRow key={staff.id} className={cn(
                    "hover:bg-slate-50/80 transition-colors border-slate-100",
                    !staff.isActive && "opacity-60 grayscale-[0.5] bg-slate-50/30"
                  )}>
                    <TableCell>
                      <div className="flex items-center gap-3 text-right">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm ring-1 ring-slate-100">
                          <AvatarFallback className="bg-primary/10 text-primary font-black">{displayName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="font-black text-sm text-slate-900 truncate">{displayName}</span>
                          <span className="text-[10px] font-mono text-slate-500 truncate" dir="ltr">{staff.email}</span>
                          {(staff as any).jobTitle && (
                            <span className="text-[9px] text-amber-600 font-bold">{(staff as any).jobTitle}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {isAgent ? (
                        <Badge className="bg-blue-100 text-blue-700 font-black text-[10px] gap-1 border-blue-200">
                          <Zap className="h-3 w-3" /> وكيل سيادي
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="font-bold text-[10px] bg-white text-slate-700 uppercase tracking-tighter border-slate-200">
                          {staff.role}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {isAgent ? (
                        <div className="flex flex-col gap-1.5 min-w-[150px]">
                          <div className="flex justify-between text-[9px] font-black text-slate-600">
                            <span className="flex items-center gap-1"><Target className="h-3 w-3 text-primary" /> {current} / {target}</span>
                            <span className="text-emerald-600">مكافأة: {staff.agentBonus} {staff.currency}</span>
                          </div>
                          <Progress value={progress} className="h-1.5 bg-slate-100 [&>div]:bg-blue-500 rounded-full" />
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {PERMISSION_MATRIX.map(p => {
                            const hasPerm = (staff.permissions as any)?.[p.id];
                            if (!hasPerm) return null;
                            return (
                              <div key={p.id} title={p.label} className="h-5 w-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                                <p.icon className="h-3 w-3" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-black text-emerald-600 text-xs">
                      {isAgent
                        ? <span dir="ltr">{staff.lifetimeEarnings || 0} {staff.currency}</span>
                        : <span dir="ltr">{(staff as any).baseSalary || 0} {staff.currency}</span>
                      }
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "font-black text-[10px] h-5 px-2",
                        staff.isActive ? "bg-emerald-500 text-white" : "bg-slate-400 text-white"
                      )}>
                        {staff.isActive ? "نشط" : "مجمد"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        {/* <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/5"
                          onClick={() => router.push(`/admin/staff/${staff.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button> */}

                        <Button variant="ghost" size="icon"
                          className="h-8 w-8 text-amber-600 hover:bg-amber-50"
                          title="تعديل عرض الشغل"
                          onClick={() => openEditDialog(staff)}>
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button variant="ghost" size="icon"
                          className={cn("h-8 w-8", staff.isActive ? "text-destructive hover:bg-destructive/5" : "text-emerald-600 hover:bg-emerald-50")}
                          onClick={() => handleToggleStatus(staff)}
                          disabled={isProcessing === staff.id || isOwner}>
                          {isProcessing === staff.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4" />}
                        </Button>
                        {!isOwner && (
                          <Button variant="ghost" size="icon"
                            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700"
                            title="حذف نهائي"
                            onClick={() => { setDeleteTarget(staff); setDeleteReason(''); }}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
        <ShieldAlert className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
        <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
          <strong>ميثاق مفاعل العمولات [SCR-704]:</strong> يتم احتساب مستحقات الوكلاء وتحديث عداد الأهداف آلياً فور وصول الركاب. صرف المكافأة يتم ترحيله فوراً إلى السجل المالي المركزي لضمان الشفافية المطلقة.
        </p>
      </div>

      {/* Delete Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => { if (!o) setDeleteTarget(null); }}>
        <DialogContent className="max-w-md" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> حذف نهائي لا رجعة فيه
            </DialogTitle>
            <DialogDescription>
              أنت على وشك حذف <strong>{deleteTarget?.fullName || deleteTarget?.email}</strong> نهائياً. لا يمكن التراجع عن هذا الإجراء.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <Label className="text-sm font-bold text-slate-700">سبب الحذف (إلزامي)</Label>
            <Input
              placeholder="اكتب سبب الحذف النهائي..."
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              className="border-red-200 focus-visible:ring-red-400"
            />
          </div>
          <DialogFooter className="gap-2 flex-row-reverse">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>إلغاء</Button>
            <Button variant="destructive"
              disabled={deleteReason.trim().length < 5 || isProcessing === deleteTarget?.id}
              onClick={handleConfirmDelete}>
              {isProcessing === deleteTarget?.id && <Loader2 className="h-4 w-4 animate-spin ml-2" />}
              تأكيد الحذف النهائي
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Job Dialog */}
      <EditJobOfferDialog
        staff={editTarget}
        open={!!editTarget}
        onOpenChange={(o) => { if (!o) setEditTarget(null); }}
        adminId={adminProfile?.id}
      />

    </div>
  );
}