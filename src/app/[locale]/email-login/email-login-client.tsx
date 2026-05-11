'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useAuth, useFirestore } from '@/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs, limit, doc, getDoc } from 'firebase/firestore';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2, Mail, Lock, ArrowRight, ArrowLeft, ShieldCheck, User, Car, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SignJWT } from 'jose';
import { useSearchParams } from 'next/navigation';

/**
 * @page EmailLoginPage
 * @description صفحة تسجيل الدخول بالإيميل للمستخدمين القدامى
 * تدعم جميع الأدوار: مسافر، ناقل، وكيل
 */
export default function EmailLoginPage() {
    const locale = useLocale();
    const t = useTranslations();
    const router = useRouter();
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [detectedRole, setDetectedRole] = useState<string | null>(null);

    const isRTL = locale === 'ar';
    const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
    // const [selectedRole, setSelectedRole] = useState<'traveler' | 'carrier' | 'agent'>('traveler'); //
    // ✅ بعد - نقرأ الـ role من الـ URL
    const searchParams = useSearchParams();
    const roleFromUrl = searchParams.get('role') as 'traveler' | 'carrier' | 'agent' | null;
    const [selectedRole, setSelectedRole] = useState<'traveler' | 'carrier' | 'agent'>(
        roleFromUrl || 'traveler'
    );
    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'carrier': return <Car className="w-5 h-5" />;
            case 'agent': return <Briefcase className="w-5 h-5" />;
            default: return <User className="w-5 h-5" />;
        }
    };

    const getRoleLabel = (role: string) => {
        const labels: Record<string, Record<string, string>> = {
            ar: { traveler: 'مسافر', carrier: 'ناقل', agent: 'وكيل', admin: 'مدير', owner: 'مالك', developer: 'مطور' },
            en: { traveler: 'Traveler', carrier: 'Carrier', agent: 'Agent', admin: 'Admin', owner: 'Owner', developer: 'Developer' },
        };
        return labels[locale]?.[role] || role;
    };

    const getRedirectPath = (role: string) => {
        switch (role) {
            case 'carrier': return '/carrier';
            case 'agent': return '/agent';
            case 'admin':
            case 'owner':
            case 'developer':
            case 'operations_manager': return '/admin';
            default: return '/dashboard';
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!auth || !firestore) return;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            toast({
                variant: 'destructive',
                title: isRTL ? 'بريد إلكتروني غير صحيح' : 'Invalid email',
                description: isRTL ? 'مثال: example@gmail.com' : 'Example: example@gmail.com',
            });
            return;
        }

        if (password.length < 8) {
            toast({
                variant: 'destructive',
                title: isRTL ? 'كلمة مرور ضعيفة' : 'Weak password',
                description: isRTL ? '8 خانات على الأقل' : 'At least 8 characters',
            });
            return;
        }

        setLoading(true);
        try {
            // 1. تسجيل الدخول بـ Firebase Auth
            const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
            const user = credential.user;

            // 2. جيب الـ role من Firestore
            // let role = 'traveler';
            // let isDeactivated = false;
            // const userQuery = query(collection(firestore, 'users'), where('uid', '==', user.uid), limit(1));
            // const userSnap = await getDocs(userQuery);
            // if (!userSnap.empty) {
            //     const userData = userSnap.docs[0].data();
            //     role = userData.role || 'traveler';
            //     isDeactivated = userData.isDeactivated || false;
            // }
            let role = 'traveler';
            let isDeactivated = false;
            const userRef = doc(firestore, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.data();
                role = userData.role || 'traveler';
                isDeactivated = userData.isDeactivated || false;
            }
            if (isDeactivated) {
                toast({
                    variant: 'destructive',
                    title: isRTL ? 'الحساب موقوف' : 'Account suspended',
                    description: isRTL ? 'تواصل مع الدعم' : 'Contact support',
                });
                setLoading(false);
                return;
            }

            setDetectedRole(role);

            // 3. ابني session JWT فيه الـ role
            const secret = new TextEncoder().encode(
                process.env.NEXT_PUBLIC_JWT_SECRET || 'safar-gate-secret-2026'
            );
            const sessionToken = await new SignJWT({
                uid: user.uid,
                email: user.email || '',
                role,
                isDeactivated: false,
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('5d')
                .sign(secret);

            document.cookie = `__session=${sessionToken}; path=/; max-age=432000; SameSite=Strict; Secure`;

            toast({
                title: isRTL ? `أهلاً بك! 👋` : `Welcome back! 👋`,
                description: isRTL
                    ? `تم تسجيل الدخول كـ ${getRoleLabel(role)}`
                    : `Logged in as ${getRoleLabel(role)}`,
            });

            // 4. Redirect حسب الـ role
            await new Promise(r => setTimeout(r, 600));
            window.location.href = `/${locale}${getRedirectPath(role)}`;

        } catch (err: any) {
            let msg = isRTL ? 'فشل تسجيل الدخول' : 'Login failed';
            if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
                msg = isRTL ? 'البريد الإلكتروني غير مسجل' : 'Email not registered';
            } else if (err.code === 'auth/wrong-password') {
                msg = isRTL ? 'كلمة المرور غير صحيحة' : 'Incorrect password';
            } else if (err.code === 'auth/too-many-requests') {
                msg = isRTL ? 'تم حظر المحاولات مؤقتاً' : 'Too many attempts, try later';
            }
            toast({ variant: 'destructive', title: msg });
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 bg-background"
            dir={isRTL ? 'rtl' : 'ltr'}
        >
            <div className="w-full max-w-md space-y-3">

                {/* Header */}
                <div className="flex flex-col items-center text-center gap-3">
                    <Logo />
                    <div>
                        <h1 className="text-2xl font-bold">
                            {isRTL ? 'بوابتك للسفر البري' : 'Your gateway to overland travel'}
                        </h1>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isRTL
                                ? 'تسجيل الدخول'
                                : 'Login to your account'}
                        </p>
                    </div>
                </div>
                <div className="text-center pt-3">
                    <p className="text-lg text-muted-foreground">
                        {locale === 'ar' ? 'اذا لم يكن لديك حساب ؟ ' : `If you don't have an account? `}
                        <button
                            type="button"
                            // onClick={() => router.push(`/${locale}/login?role=carrier`)}
                            onClick={() => router.push(`/login?role=${selectedRole}`)}
                            className="text-primary underline font-bold hover:opacity-80"
                        >
                            {locale === 'ar' ? 'أنشاء حساب جديد' : 'Create now account'}
                        </button>
                    </p>
                </div>

                {/* Card */}
                <div className="bg-card border rounded-2xl shadow-sm p-6 space-y-5">

                    {/* Role badges */}
                    <div className="flex gap-2 justify-center flex-wrap">
                        {/* {['traveler', 'carrier', 'agent'].map(r => (
                            <div
                                key={r}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${detectedRole === r
                                    ? 'bg-primary text-primary-foreground border-primary scale-105'
                                    : 'bg-muted text-muted-foreground border-transparent'
                                    }`}
                            >
                                {getRoleIcon(r)}
                                {getRoleLabel(r)}
                            </div>
                        ))} */}
                        {/*  {['traveler', 'carrier', 'agent'].map(r => (
                            <button
                                type="button"
                                key={r}
                                onClick={() => setSelectedRole(r as any)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedRole === r
                                    ? 'bg-primary text-primary-foreground border-primary scale-105'
                                    : 'bg-muted text-muted-foreground border-transparent hover:scale-105'
                                    }`}
                            >
                                {getRoleIcon(r)}
                                {getRoleLabel(r)}
                            </button>
                        ))} */}
                        {roleFromUrl ? (
                            // عرض badge ثابت للـ role المحدد فقط
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border bg-primary text-primary-foreground border-primary">
                                {getRoleIcon(roleFromUrl)}
                                {getRoleLabel(roleFromUrl)}
                            </div>
                        ) : (
                            // لو مفيش role في الـ URL، اعرض كل الأزرار
                            ['traveler', 'carrier', 'agent'].map(r => (
                                <button
                                    type="button"
                                    key={r}
                                    onClick={() => setSelectedRole(r as any)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedRole === r
                                        ? 'bg-primary text-primary-foreground border-primary scale-105'
                                        : 'bg-muted text-muted-foreground border-transparent hover:scale-105'
                                        }`}
                                >
                                    {getRoleIcon(r)}
                                    {getRoleLabel(r)}
                                </button>
                            ))
                        )}
                    </div>

                    <div className="h-px bg-border" />

                    <form onSubmit={handleLogin} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-muted-foreground" />
                                {isRTL ? 'البريد الإلكتروني' : 'Email Address'}
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                dir="ltr"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                disabled={loading}
                                className="h-11"
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2">
                                <Lock className="w-4 h-4 text-muted-foreground" />
                                {isRTL ? 'كلمة المرور' : 'Password'}
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    dir="ltr"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    disabled={loading}
                                    className="h-11 pr-10"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(p => !p)}
                                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full h-12 text-base font-bold gap-2"
                            disabled={loading || !email || password.length < 8}
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <ShieldCheck className="w-5 h-5" />
                                    {isRTL ? 'تسجيل الدخول' : 'Sign In'}
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="h-px bg-border" />

                    {/* Back */}
                    <Button
                        variant="ghost"
                        className="w-full gap-2 text-muted-foreground"
                        onClick={() => router.push('/')}
                        disabled={loading}
                    >
                        <ArrowIcon className="w-4 h-4" />
                        {isRTL ? 'العودة للرئيسية' : 'Back to Home'}
                    </Button>
                </div>
            </div>
        </div>
    );
}