// 'use client';

// /**
//  * @component AdminLoginModal
//  * @perf-fix PERF-FIX-3: فصل الـ Admin Login Modal عن Landing Page
//  *
//  * المشكلة: كانت الـ landing page كلها 'use client' بسبب useAuth/useFirestore
//  * اللي بيتستخدموا بس في الـ Admin Modal الخفي ده.
//  * النتيجة: كل الـ Firebase SDK بيتحمل على أول render حتى للزوار.
//  *
//  * الحل: فصل المودال في component منفصلة lazy-loaded — Firebase مش هيتحمل
//  * خالص إلا لو الأدمن ضغط على اللوجو.
//  */

// import { useState } from 'react';
// import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from '@/hooks/use-toast';
// import {
//     Dialog, DialogContent, DialogDescription, DialogTitle,
//     DialogFooter, DialogHeader
// } from '@/components/ui/dialog';
// import { useAuth, useFirestore } from '@/firebase';
// import { signInWithEmail } from '@/lib/simple-auth';
// import { useTranslations, useLocale } from 'next-intl';

// export interface AdminLoginModalProps {
//     open: boolean;
//     onClose: () => void;
// }

// export function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
//     const auth = useAuth();
//     const firestore = useFirestore();
//     const locale = useLocale();
//     const ta = useTranslations();
//     const isRTL = locale === 'ar';

//     const [email, setEmail] = useState('FAYZ@safar.com');
//     const [password, setPassword] = useState('');
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     const handleAdminLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!auth || !firestore) return;
//         setIsLoading(true);
//         setError('');
//         try {
//             const result = await signInWithEmail(auth, firestore, email, password);
//             if (result?.user) {
//                 const idToken = await result.user.getIdToken(true);
//                 document.cookie = `__session=${idToken}; path=/; max-age=3600; SameSite=Lax`;
//                 toast({ title: 'تم التحقق من الهوية السيادية ✅' });
//                 setTimeout(() => { window.location.href = `/${locale}/admin`; }, 100);
//             }
//         } catch (err: any) {
//             let msg = 'فشل في عملية المصادقة الرقمية.';
//             if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') msg = 'كلمة المرور غير صحيحة.';
//             else if (err.code === 'auth/too-many-requests') msg = 'تم حظر المحاولات مؤقتاً.';
//             setError(msg);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <Dialog open={open} onOpenChange={onClose}>
//             <DialogContent className="max-w-md">
//                 <form onSubmit={handleAdminLogin}>
//                     <DialogHeader>
//                         <button
//                             type="button"
//                             onClick={onClose}
//                             className={`absolute top-3 border-0 text-[#BFAF78] hover:text-white transition-colors ${isRTL ? 'left-5' : 'right-5'}`}
//                             aria-label="Close"
//                         >✕</button>
//                         <DialogTitle className="flex items-center gap-2">
//                             <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
//                             {ta('admin.login')}
//                         </DialogTitle>
//                         <DialogDescription>{ta('admin.title')}</DialogDescription>
//                     </DialogHeader>
//                     <div className="grid gap-4 py-4">
//                         {error && (
//                             <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-destructive text-sm text-center font-bold flex items-center gap-2" role="alert">
//                                 <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
//                                 {error}
//                             </div>
//                         )}
//                         <div className="space-y-2">
//                             <Label htmlFor="email-secret">{ta('auth.email')}</Label>
//                             <Input id="email-secret" type="email" value={email}
//                                 onChange={e => setEmail(e.target.value)}
//                                 required dir="ltr" disabled={isLoading}
//                                 className="font-mono" autoComplete="email" />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="password-secret">{ta('auth.password')}</Label>
//                             <div className="relative">
//                                 <Input id="password-secret" type={showPassword ? 'text' : 'password'} value={password}
//                                     onChange={e => setPassword(e.target.value)} required dir="ltr" disabled={isLoading}
//                                     className="font-mono pr-10" autoComplete="current-password" />
//                                 <button type="button" onClick={() => setShowPassword(p => !p)}
//                                     className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
//                                     aria-label={showPassword ? 'Hide password' : 'Show password'}>
//                                     {showPassword
//                                         ? <EyeOff className="w-4 h-4" aria-hidden="true" />
//                                         : <Eye className="w-4 h-4" aria-hidden="true" />}
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                     <DialogFooter>
//                         <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
//                             {ta('common.cancel')}
//                         </Button>
//                         <Button type="submit" disabled={isLoading} className="min-w-[120px]">
//                             {isLoading
//                                 ? <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
//                                 : ta('admin.loginAdmin')}
//                         </Button>
//                     </DialogFooter>
//                 </form>
//             </DialogContent>
//         </Dialog>
//     );
// }
'use client';

/**
 * @component AdminLoginModal
 * @perf-fix PERF-FIX-3: فصل الـ Admin Login Modal عن Landing Page
 *
 * المشكلة: كانت الـ landing page كلها 'use client' بسبب useAuth/useFirestore
 * اللي بيتستخدموا بس في الـ Admin Modal الخفي ده.
 * النتيجة: كل الـ Firebase SDK بيتحمل على أول render حتى للزوار.
 *
 * الحل: فصل المودال في component منفصلة lazy-loaded — Firebase مش هيتحمل
 * خالص إلا لو الأدمن ضغط على اللوجو.
 */

import { useState } from 'react';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
    Dialog, DialogContent, DialogDescription, DialogTitle,
    DialogFooter, DialogHeader
} from '@/components/ui/dialog';
// [PERF-FIX]: لا firebase hooks هنا — نستخدم getAuth/getFirestore مباشرة عند الحاجة
import { signInWithEmail } from '@/lib/simple-auth';
import { useTranslations, useLocale } from 'next-intl';

export interface AdminLoginModalProps {
    open: boolean;
    onClose: () => void;
}

export function AdminLoginModal({ open, onClose }: AdminLoginModalProps) {
    // [PERF-FIX]: auth and firestore loaded lazily inside handleAdminLogin
    const locale = useLocale();
    const ta = useTranslations();
    const isRTL = locale === 'ar';

    const [email, setEmail] = useState('FAYZ@safar.com');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // auth and firestore will be loaded lazily below
        setIsLoading(true);
        setError('');
        try {
            const { getAuth } = await import('firebase/auth');
            const { getFirestore } = await import('firebase/firestore');
            const auth = getAuth();
            const firestore = getFirestore();
            const result = await signInWithEmail(auth, firestore, email, password);
            if (result?.user) {
                const idToken = await result.user.getIdToken(true);
                document.cookie = `__session=${idToken}; path=/; max-age=3600; SameSite=Lax`;
                toast({ title: 'تم التحقق من الهوية السيادية ✅' });
                setTimeout(() => { window.location.href = `/${locale}/admin`; }, 100);
            }
        } catch (err: any) {
            let msg = 'فشل في عملية المصادقة الرقمية.';
            if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') msg = 'كلمة المرور غير صحيحة.';
            else if (err.code === 'auth/too-many-requests') msg = 'تم حظر المحاولات مؤقتاً.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <form onSubmit={handleAdminLogin}>
                    <DialogHeader>
                        <button
                            type="button"
                            onClick={onClose}
                            className={`absolute top-3 border-0 text-[#BFAF78] hover:text-white transition-colors ${isRTL ? 'left-5' : 'right-5'}`}
                            aria-label="Close"
                        >✕</button>
                        <DialogTitle className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
                            {ta('admin.login')}
                        </DialogTitle>
                        <DialogDescription>{ta('admin.title')}</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        {error && (
                            <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-destructive text-sm text-center font-bold flex items-center gap-2" role="alert">
                                <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email-secret">{ta('auth.email')}</Label>
                            <Input id="email-secret" type="email" value={email}
                                onChange={e => setEmail(e.target.value)}
                                required dir="ltr" disabled={isLoading}
                                className="font-mono" autoComplete="email" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password-secret">{ta('auth.password')}</Label>
                            <div className="relative">
                                <Input id="password-secret" type={showPassword ? 'text' : 'password'} value={password}
                                    onChange={e => setPassword(e.target.value)} required dir="ltr" disabled={isLoading}
                                    className="font-mono pr-10" autoComplete="current-password" />
                                <button type="button" onClick={() => setShowPassword(p => !p)}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}>
                                    {showPassword
                                        ? <EyeOff className="w-4 h-4" aria-hidden="true" />
                                        : <Eye className="w-4 h-4" aria-hidden="true" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
                            {ta('common.cancel')}
                        </Button>
                        <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                            {isLoading
                                ? <Loader2 className="animate-spin h-4 w-4" aria-hidden="true" />
                                : ta('admin.loginAdmin')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}