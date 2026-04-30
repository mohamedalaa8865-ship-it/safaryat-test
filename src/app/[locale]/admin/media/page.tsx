/**
 * @page SovereignMediaHub
 * @description THE REINFORCED MEDIA CENTER (STERILIZED - V5.0 - SCR-987)
 * [SCR-987]: Corrected CardFooter import. Enforced official domain.
 */
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, addDoc, doc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { useUserProfile } from '@/hooks/use-user-profile';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Globe, Share2, ShieldCheck, 
  Loader2, Save, MessageSquare, 
  Facebook, Instagram, Twitter, Linkedin, Ghost, Video, Plus, Trash2, Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SOVEREIGN_MASTER_EMAIL } from '@/lib/constants';

const PLATFORM_CONFIG: Record<string, { icon: any, color: string, label: string }> = {
  facebook: { icon: Facebook, color: 'bg-blue-600 hover:bg-blue-700', label: 'فيسبوك' },
  instagram: { icon: Instagram, color: 'bg-pink-600 hover:bg-pink-700', label: 'إنستغرام' },
  x: { icon: Twitter, color: 'bg-slate-900 hover:bg-slate-800', label: 'منصة X' },
  tiktok: { icon: Video, color: 'bg-black hover:bg-slate-900', label: 'تيك توك' },
  snapchat: { icon: Ghost, color: 'bg-yellow-500 hover:bg-yellow-600 text-black', label: 'سناب شات' },
  whatsapp: { icon: MessageSquare, color: 'bg-green-500 hover:bg-green-600', label: 'واتساب' },
  linkedin: { icon: Linkedin, color: 'bg-blue-700 hover:bg-blue-800', label: 'لينكد إن' },
  website: { icon: Globe, color: 'bg-primary hover:bg-primary/90', label: 'موقع إلكتروني' },
};

export default function MediaReachPage() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { profile, isLoading: profileLoading, checkPermission } = useUserProfile();
  const { toast } = useToast();
  
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newType, setNewType] = useState('facebook');
  const [newName, setNewName] = useState('');
  const [newUrl, setNewUrl] = useState('');

  // [SCR-987]: Official Master Email Sync
  const isAbsoluteOwner = useMemo(() => 
    user?.email?.toLowerCase() === SOVEREIGN_MASTER_EMAIL.toLowerCase() || profile?.role === 'owner'
  , [user, profile]);

  const isAuthority = useMemo(() => 
    isAbsoluteOwner || profile?.role === 'admin' || profile?.role === 'developer' || profile?.isAdmin === true
  , [isAbsoluteOwner, profile]);

  const isManagement = useMemo(() => {
    const roleStr = (profile?.role as string) || '';
    return isAuthority || roleStr === 'operations_manager' || roleStr === 'marketing' || checkPermission('socialMedia');
  }, [isAuthority, profile, checkPermission]);

  const hubQuery = useMemoFirebase(() => (firestore && isManagement) ? collection(firestore, 'social_media_hub') : null, [firestore, isManagement]);
  const staffQuery = useMemoFirebase(() => (firestore && isAuthority) ? collection(firestore, 'staff_registry') : null, [firestore, isAuthority]);

  const { data: platforms, isLoading: loadingHub } = useCollection(hubQuery);
  const { data: staffList } = useCollection(staffQuery);

  const mediaStaffList = useMemo(() => {
    if (!staffList) return [];
    return staffList.filter((s: any) => 
      s.role === 'owner' || 
      s.role === 'admin' || 
      s.permissions?.socialMedia === true ||
      s.permissions?.marketing === true
    );
  }, [staffList]);

  const handleAddPlatform = useCallback(async () => {
    if (!firestore || !newType || !newName || !newUrl) {
        toast({ variant: 'destructive', title: 'بيانات ناقصة', description: 'يرجى ملء كافة حقول المنصة الجديدة.' });
        return;
    }
    setIsAdding(true);
    try {
        await addDoc(collection(firestore, 'social_media_hub'), {
            type: newType,
            name: newName,
            url: newUrl,
            assignedStaffId: '',
            assignedStaffName: '',
            status: 'active',
            lastPostUrl: '',
            notes: '',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        toast({ title: 'تم تأسيس الأصل الرقمي ✅' });
        setNewName(''); setNewUrl('');
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'فشل التأسيس', description: e.message });
    } finally {
        setIsAdding(false);
    }
  }, [firestore, newType, newName, newUrl, toast]);

  const handleDeletePlatform = useCallback(async (platformId: string) => {
    if (!firestore || !confirm('هل أنت متأكد من إعدام هذا الأصل الرقمي نهائياً؟')) return;
    try {
        await deleteDoc(doc(firestore, 'social_media_hub', platformId));
        toast({ title: 'تم بتر الأصل الرقمي 🗑️' });
    } catch (e: any) {
        toast({ variant: 'destructive', title: 'فشل البتر', description: e.message });
    }
  }, [firestore, toast]);

  const handleUpdatePlatform = useCallback(async (platformId: string, updates: any) => {
    if (!firestore) return;
    setIsUpdating(platformId);
    try {
      const pRef = doc(firestore, 'social_media_hub', platformId);
      await updateDoc(pRef, { ...updates, updatedAt: serverTimestamp(), lastUpdatedBy: profile?.id || 'admin' });
      toast({ title: "تم تحديث بيانات التشغيل ✅" });
    } catch (e) {
      toast({ variant: 'destructive', title: "فشل التحديث", description: "ليس لديك صلاحية سحابية لتعديل هذه المنصة." });
    } finally {
      setIsUpdating(null);
    }
  }, [firestore, profile?.id, toast]);

  if (profileLoading) {
    return <div className="flex h-[60vh] items-center justify-center opacity-30"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 p-2 md:p-6" dir="rtl">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6 border-primary/10">
        <div>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-3 text-foreground drop-shadow-md">
            <Share2 className="h-8 w-8 text-primary animate-pulse" />
            وكالة الإعلام والانتشار السيادي
          </h1>
          <p className="text-muted-foreground text-sm mt-1 flex items-center gap-2 font-bold">
            <ShieldCheck className="h-4 w-4 text-green-600" />
            إدارة الأصول الرقمية، تفويض المهام، ورصد الصدى الميداني [SCR-987].
          </p>
        </div>
      </header>

      {isAuthority && (
        <Card className="border-2 border-dashed border-primary/30 bg-primary/5 shadow-inner animate-in slide-in-from-top-4 duration-500">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-black flex items-center gap-2 text-foreground">
                    <Plus className="h-5 w-5 text-primary" /> مصنع الأصول الرقمية
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">نوع المنصة</Label>
                        <Select value={newType} onValueChange={setNewType}>
                            <SelectTrigger className="h-12 bg-background font-bold border-primary/20"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                {Object.entries(PLATFORM_CONFIG).map(([key, config]) => (
                                    <SelectItem key={key} value={key} className="font-bold">{config.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">اسم الحساب</Label>
                        <Input placeholder="مثال: فيسبوك الأردن" value={newName} onChange={e => setNewName(e.target.value)} className="h-12 bg-background font-bold border-primary/20" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">الرابط الرسمي</Label>
                        <Input placeholder="https://..." value={newUrl} onChange={e => setNewUrl(e.target.value)} className="h-12 bg-background font-mono text-left border-primary/20" dir="ltr" />
                    </div>
                    <Button onClick={handleAddPlatform} disabled={isAdding || !newName || !newUrl} className="h-12 font-black gap-2 shadow-lg">
                        {isAdding ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                        اعتماد الأصل
                    </Button>
                </div>
            </CardContent>
        </Card>
      )}

      {loadingHub ? (
         <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary opacity-50" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {platforms?.map((platform: any) => {
            const config = PLATFORM_CONFIG[platform.type] || PLATFORM_CONFIG['website'];
            const Icon = config.icon;
            const isAssignedToMe = platform.assignedStaffId === profile?.id;
            const canOperate = isAuthority || isAssignedToMe;

            return (
              <Card key={platform.id} className="relative overflow-hidden transition-all duration-300 flex flex-col bg-card border-primary/10 shadow-xl hover:shadow-2xl">
                <div className={cn("h-2 w-full", config.color)} />
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={cn("p-3 rounded-xl text-white shadow-md", config.color)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                          <CardTitle className="text-lg font-black text-foreground">{platform.name}</CardTitle>
                          <Badge variant="outline" className="text-[9px] font-mono mt-1 opacity-70 border-primary/20">ID: {platform.id.slice(0,5)}</Badge>
                      </div>
                    </div>
                    {isAuthority && (
                      <Button variant="ghost" size="icon" onClick={() => handleDeletePlatform(platform.id)} className="text-red-500 hover:bg-red-50 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 flex-1">
                  <Button 
                      onClick={() => window.open(platform.url, '_blank')}
                      className={cn("w-full h-14 text-white text-lg font-black gap-3 shadow-lg hover:scale-[1.02] transition-transform", config.color)}
                  >
                      <Rocket className="h-5 w-5" />
                      الدخول لغرفة العمليات
                  </Button>

                  <div className="bg-muted/30 p-4 rounded-xl border border-dashed border-primary/20 space-y-2">
                      <Label className="text-xs font-black text-primary flex items-center gap-2">
                          <Plus className="h-4 w-4" /> تفويض المسؤولية
                      </Label>
                      {isAuthority ? (
                          <div className="space-y-2">
                              <Select 
                                  value={platform.assignedStaffId || 'unassigned'} 
                                  onValueChange={(val) => {
                                      const staff = mediaStaffList?.find((s: any) => s.id === val);
                                      handleUpdatePlatform(platform.id, { 
                                          assignedStaffId: val === 'unassigned' ? '' : val, 
                                          assignedStaffName: val === 'unassigned' ? '' : (staff?.fullName || 'Unknown') 
                                      });
                                  }}
                              >
                                  <SelectTrigger className="h-10 text-xs font-bold bg-background border-primary/20">
                                      <SelectValue placeholder="اختر موظفاً..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="unassigned" className="text-destructive font-bold">بدون تفويض</SelectItem>
                                      {mediaStaffList?.map((s: any) => (
                                          <SelectItem key={s.id} value={s.id} className="font-bold">{s.fullName}</SelectItem>
                                      ))}
                                  </SelectContent>
                              </Select>
                          </div>
                      ) : (
                          <div className="h-10 bg-background rounded-md border flex items-center px-3 text-xs font-bold border-primary/10">
                              المسؤول الميداني: {platform.assignedStaffName || 'غير محدد'}
                          </div>
                      )}
                  </div>

                  {canOperate && (
                      <div className="space-y-4">
                          <div className="space-y-1.5">
                              <Label className="text-[10px] font-black opacity-60">رابط آخر منشور (للتوثيق)</Label>
                              <Input 
                                  placeholder="https://..." 
                                  defaultValue={platform.lastPostUrl}
                                  className="h-10 text-xs font-mono bg-muted/10 text-left border-primary/10" dir="ltr"
                                  id={`url-${platform.id}`}
                              />
                          </div>
                          <div className="space-y-1.5">
                              <Label className="text-[10px] font-black opacity-60">ملاحظات التشغيل اليومية</Label>
                              <Input 
                                  placeholder="تم إطلاق حملة جديدة..." 
                                  defaultValue={platform.notes}
                                  className="h-10 text-xs font-medium bg-muted/10 border-primary/10"
                                  id={`notes-${platform.id}`}
                              />
                          </div>
                      </div>
                  )}
                </CardContent>

                {canOperate && (
                  <CardFooter className="bg-muted/10 border-t border-primary/10 p-4 mt-auto">
                      <Button 
                      className="w-full h-12 font-black gap-2 shadow-sm" 
                      disabled={isUpdating === platform.id}
                      onClick={() => {
                          const url = (document.getElementById(`url-${platform.id}`) as HTMLInputElement)?.value;
                          const notes = (document.getElementById(`notes-${platform.id}`) as HTMLInputElement)?.value;
                          handleUpdatePlatform(platform.id, { lastPostUrl: url, notes });
                      }}
                      >
                      {isUpdating === platform.id ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                      حفظ التحديثات الميدانية
                      </Button>
                  </CardFooter>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {!loadingHub && platforms?.length === 0 && (
          <div className="text-center py-20 bg-muted/10 rounded-3xl border-2 border-dashed border-primary/30">
              <Globe className="h-16 w-16 mx-auto text-primary/40 mb-4 animate-pulse" />
              <h3 className="text-xl font-black text-foreground drop-shadow-sm">لا توجد أصول رقمية مسجلة</h3>
              <p className="text-sm text-muted-foreground mt-2 font-medium">استخدم "مصنع الأصول" بالأعلى لإضافة روابط القلعة الرسمية.</p>
          </div>
      )}

    </div>
  );
}
