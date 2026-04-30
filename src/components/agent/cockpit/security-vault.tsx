
// 'use client';

// import { useState } from 'react';
// import { useUser } from '@/firebase';
// import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Shield, Mail, Phone, KeyRound, Loader2, CheckCircle2 } from 'lucide-react';
// import { useToast } from '@/hooks/use-toast';

// /**
//  * @component SecurityVault
//  * @description THE REINFORCED SECURITY VAULT (SCR-858)
//  * Ensures agent identity verification and secure password lifecycle.
//  * Protocol 30: Delegation of reset logic to Firebase Auth Core.
//  */
// export function SecurityVault() {
//   const { user } = useUser();
//   const [isResetting, setIsResetting] = useState(false);
//   const { toast } = useToast();

//   const handlePasswordReset = async () => {
//     if (!user?.email) return;
//     setIsResetting(true);
//     try {
//       await sendPasswordResetEmail(getAuth(), user.email);
//       toast({ 
//         title: 'تم إرسال الرابط السيادي ✅', 
//         description: 'راجع بريدك الإلكتروني لإعادة تعيين مفتاح الدخول بأمان.' 
//       });
//     } catch (error) {
//       console.error("[Security Vault] Reset rupture:", error);
//       toast({ variant: 'destructive', title: 'فشل الإرسال', description: 'حدث خلل أمني، يرجى المحاولة لاحقاً.' });
//     } finally {
//       setIsResetting(false);
//     }
//   };

//   return (
//     <Card className="border-primary/10 shadow-2xl rounded-[2.5rem] bg-card overflow-hidden">
//         <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
//             <CardTitle className="text-sm font-black text-primary flex items-center gap-2">
//                 <Shield className="h-5 w-5 text-primary" /> الهوية والتحصين السيادي
//             </CardTitle>
//         </CardHeader>
//         <CardContent className="p-6 space-y-6">
//             <div className="space-y-4">
//                 <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-primary/5">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-primary/10 p-2 rounded-lg"><Mail className="h-4 w-4 text-primary" /></div>
//                         <div className="text-right">
//                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">البريد المعتمد</p>
//                             <p className="text-xs font-bold font-mono text-foreground">{user?.email || 'N/A'}</p>
//                         </div>
//                     </div>
//                     <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-50" />
//                 </div>

//                 <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-primary/5">
//                     <div className="flex items-center gap-3">
//                         <div className="bg-primary/10 p-2 rounded-lg"><Phone className="h-4 w-4 text-primary" /></div>
//                         <div className="text-right">
//                             <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">رقم الاتصال الميداني</p>
//                             <p className="text-xs font-bold text-foreground">{user?.phoneNumber || 'غير مربوط'}</p>
//                         </div>
//                     </div>
//                     <span className="text-[8px] font-black text-muted-foreground opacity-40 italic">Audit Locked</span>
//                 </div>
//             </div>

//             <Button 
//                 onClick={handlePasswordReset} 
//                 disabled={isResetting || !user?.email}
//                 className="w-full h-14 rounded-2xl bg-background border-2 border-primary/20 text-primary hover:bg-primary/10 font-black gap-2 transition-all shadow-lg active:scale-95"
//             >
//                 {isResetting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><KeyRound className="h-5 w-5" /> طلب إعادة تعيين كلمة المرور</>}
//             </Button>
//         </CardContent>
//     </Card>
//   );
// }

'use client';

import { useState } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Mail, Phone, KeyRound, Loader2, CheckCircle2, Pencil, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUserProfile } from '@/hooks/use-user-profile';

export function SecurityVault() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { profile } = useUserProfile();
    const [isResetting, setIsResetting] = useState(false);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [phoneValue, setPhoneValue] = useState('');
    const [isSavingPhone, setIsSavingPhone] = useState(false);
    const { toast } = useToast();

    const displayPhone = profile?.phoneNumber || user?.phoneNumber || null;

    const handlePasswordReset = async () => {
        if (!user?.email) return;
        setIsResetting(true);
        try {
            await sendPasswordResetEmail(getAuth(), user.email);
            toast({ title: 'تم إرسال الرابط السيادي ✅', description: 'راجع بريدك الإلكتروني لإعادة تعيين مفتاح الدخول بأمان.' });
        } catch {
            toast({ variant: 'destructive', title: 'فشل الإرسال', description: 'حدث خلل أمني، يرجى المحاولة لاحقاً.' });
        } finally {
            setIsResetting(false);
        }
    };

    const handleSavePhone = async () => {
        if (!firestore || !user?.uid || !phoneValue.trim()) return;
        setIsSavingPhone(true);
        try {
            await updateDoc(doc(firestore, 'users', user.uid), { phoneNumber: phoneValue.trim() });
            toast({ title: 'تم الحفظ ✅', description: 'تم تحديث رقم الاتصال بنجاح.' });
            setIsEditingPhone(false);
        } catch {
            toast({ variant: 'destructive', title: 'فشل الحفظ', description: 'حدث خطأ، يرجى المحاولة مجدداً.' });
        } finally {
            setIsSavingPhone(false);
        }
    };

    return (
        <Card className="border-primary/10 shadow-2xl rounded-[2.5rem] bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                <CardTitle className="text-sm font-black text-primary flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> الهوية والتحصين السيادي
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-primary/5">
                        <div className="flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-lg"><Mail className="h-4 w-4 text-primary" /></div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">البريد المعتمد</p>
                                <p className="text-xs font-bold font-mono text-foreground">{user?.email || 'N/A'}</p>
                            </div>
                        </div>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 opacity-50" />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-primary/5">
                        <div className="flex items-center gap-3 flex-1">
                            <div className="bg-primary/10 p-2 rounded-lg"><Phone className="h-4 w-4 text-primary" /></div>
                            <div className="text-right flex-1">
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">رقم الاتصال الميداني</p>
                                {isEditingPhone ? (
                                    <div className="flex items-center gap-2 mt-1">
                                        <Input
                                            value={phoneValue}
                                            onChange={e => setPhoneValue(e.target.value)}
                                            placeholder="+9627XXXXXXXX"
                                            dir="ltr"
                                            className="h-8 text-xs font-mono bg-background border-primary/20 rounded-lg"
                                            autoFocus
                                        />
                                        <button onClick={handleSavePhone} disabled={isSavingPhone} className="text-emerald-500 hover:text-emerald-400">
                                            {isSavingPhone ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                        </button>
                                        <button onClick={() => setIsEditingPhone(false)} className="text-muted-foreground hover:text-destructive">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-xs font-bold font-mono text-foreground" dir="ltr">
                                        {displayPhone || <span className="text-muted-foreground italic text-[11px]">غير مربوط — اضغط للإضافة</span>}
                                    </p>
                                )}
                            </div>
                        </div>
                        {!isEditingPhone && (
                            <button onClick={() => { setPhoneValue(displayPhone || ''); setIsEditingPhone(true); }} className="text-muted-foreground hover:text-primary transition-colors p-1">
                                <Pencil className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                <Button
                    onClick={handlePasswordReset}
                    disabled={isResetting || !user?.email}
                    className="w-full h-14 rounded-2xl bg-background border-2 border-primary/20 text-primary hover:bg-primary/10 font-black gap-2 transition-all shadow-lg active:scale-95"
                >
                    {isResetting ? <Loader2 className="h-5 w-5 animate-spin" /> : <><KeyRound className="h-5 w-5" /> طلب إعادة تعيين كلمة المرور</>}
                </Button>
            </CardContent>
        </Card>
    );
}