
// import LandingScreen from '@/components/landing-screen';

// /**
//  * @page HomePage
//  * @description THE REINFORCED SOVEREIGN ENTRY (STERILIZED - SCR-961)
//  * Optimized as a Server Component for Next.js 14 performance and SEO.
//  */
// export default function HomePage() {
//   return <LandingScreen />;
// }


'use client';

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield, Zap, DollarSign, Star, Users, CheckCircle2,
  ArrowLeft, ArrowRight, Eye, AlertCircle, Loader2,
  CircleDot, Mail, Phone, Send,
  EyeOff,
  MusicIcon,
  MenuIcon,
  Bus
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { LanguageSwitcher } from '@/components/language-switcher';
import imgHero from '../../../public/imgi_11_hero-bg6.jpg';
import WavyDivider from '@/components/ui/WavyDivider';
import {
  Dialog, DialogContent, DialogDescription, DialogTitle,
  DialogFooter, DialogHeader
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { signInWithEmail } from '@/lib/simple-auth';
import { useAuth, useFirestore } from '@/firebase';
import { Label } from '@/components/ui/label';
import ourGoalsImg from '../../../public/imgi_5_8892d3e6-f7a8-4949-9101-11c74403ebea-removebg-preview.png';
import ourVisionImg from '../../../public/imgi_4_Wavy_Bus-01_Single-08.webp';
import emailImg from '../../../public/imgi_6_email-marketing-internet-chatting-24-hours-support.png';

const LOGO_URL = '/logo.png';
function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !started) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, ref };
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
function StatCard({ value, label }: { value: number; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold mb-2 text-[#BFAF78]">{count.toLocaleString()}+</div>
      <div className="text-sm text-rose-200/50">{label}</div>
    </div>
  );
}

// ─── ContactForm — defined OUTSIDE LandingPage ────────────────────────────────
function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useTranslations('home');

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="w-16 h-16 rounded-full bg-[#BFAF78]/20 border border-[#BFAF78] flex items-center justify-center">
          <Send className="w-8 h-8 text-[#BFAF78]" />
        </div>
        <p className="text-[#BFAF78] font-bold text-lg">{t('contact.success')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm text-rose-200/70">{t('contact.name')}</label>
          <input
            type="text"
            placeholder={t('contact.namePlaceholder')}
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="bg-[#2d0a0a] border border-[#3d1515] focus:border-[#BFAF78] rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-colors text-sm"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-rose-200/70">{t('contact.email')}</label>
          <input
            type="email"
            placeholder={t('contact.emailPlaceholder')}
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            className="bg-[#2d0a0a] border border-[#3d1515] focus:border-[#BFAF78] rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-colors text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-rose-200/70">{t('contact.message')}</label>
        <textarea
          rows={5}
          placeholder={t('contact.messagePlaceholder')}
          value={form.message}
          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          className="bg-[#2d0a0a] border border-[#3d1515] focus:border-[#BFAF78] rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-colors text-sm resize-none"
        />
      </div>
      <div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-[#BFAF78] text-[#1a0505] font-bold hover:bg-[#d4c98a] px-8 py-3 rounded-xl flex items-center gap-2"
        >
          {loading
            ? <span className="animate-spin w-4 h-4 border-2 border-[#1a0505] border-t-transparent rounded-full" />
            : <Send className="w-4 h-4" />}
          {t('contact.send')}
        </Button>
      </div>
      <div className="flex flex-wrap gap-4 mt-2">
        <a href="mailto:booking@safaryat.net" className="flex items-center gap-2 text-[#BFAF78] text-sm hover:underline">
          <Mail className="w-4 h-4" /> booking@safaryat.net
        </a>
        <a href="tel:+962798338178" className="flex items-center gap-2 text-[#BFAF78] text-sm hover:underline" dir="ltr">
          <Phone className="w-4 h-4" /> +962 798338178
        </a>
      </div>
    </div>
  );
}

// ─── LandingPage ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const locale = useLocale();
  const auth = useAuth();
  const firestore = useFirestore();

  const [email, setEmail] = useState('FAYZ@safar.com');
  const [password, setPassword] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  // const text: LocaleText = locale === 'ar' ? t.ar : t.en;
  // const isRTL = text.dir === 'rtl';
  const t = useTranslations('home');
  const ta = useTranslations();
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  // const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const handleLogoClick = () => {
    setShowAdminModal(true);
  };


  const featureIcons = [
    <Zap key="zap" className="w-6 h-6" />,
    <Shield key="shield" className="w-6 h-6" />,
    <DollarSign key="dollar" className="w-6 h-6" />,
  ];

  // const handleAdminLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!auth || !firestore) return;
  //   setIsLoading(true);
  //   setError('');
  //   try {
  //     const result = await signInWithEmail(auth, firestore, email, password);
  //     console.log('result:', result); // ← شوف إيه اللي بيرجع
  //     console.log('user:', result?.user);
  //     if (result?.user) {
  //       // await result.user.getIdToken(true);
  //       const idToken = await result.user.getIdToken(true);
  //       console.log('token:', idToken);
  //       toast({ title: 'تم التحقق من الهوية السيادية ✅' });
  //       window.location.href = `/${locale}/admin`;
  //     }
  //   } catch (err: any) {
  //     let msg = 'فشل في عملية المصادقة الرقمية.';
  //     if (err.message === 'PASSWORD_INCORRECT' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
  //       msg = 'كلمة المرور غير صحيحة لهذا الحساب. يرجى التأكد والمحاولة مجدداً.';
  //     } else if (err.code === 'auth/too-many-requests') {
  //       msg = 'تم حظر المحاولات مؤقتاً لكثرة الأخطاء. يرجى المحاولة لاحقاً.';
  //     }
  //     setError(msg);
  //     toast({ variant: 'destructive', title: 'خطأ في الختم السيادي', description: msg });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setIsLoading(true);
    setError('');

    try {
      const result = await signInWithEmail(auth, firestore, email, password);

      if (result?.user) {
        // 🛡️ إجراء سيادي: إجبار التوكن على التحديث لجلب الـ Admin Claims
        const idToken = await result.user.getIdToken(true);

        // 📝 هام جداً: Firebase SDK يضع الكوكي تلقائياً باسم __session في بعض الإعدادات
        // ولكن لضمان أن الـ Middleware سيقرأ النسخة المحدثة فوراً:
        document.cookie = `__session=${idToken}; path=/; max-age=3600; SameSite=Lax`;

        toast({ title: 'تم التحقق من الهوية السيادية ✅' });

        // انتظر 100ms بسيطة لضمان استقرار الكوكي قبل إعادة التحميل
        setTimeout(() => {
          window.location.href = `/${locale}/admin`;
        }, 100);
      }
    } catch (err: any) {
      // ... كود معالجة الخطأ كما هو ...
    } finally {
      setIsLoading(false);
    }
  };
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#321018] text-white font-body">
      {/* ── Navbar ── */}
      <nav className="fixed h-16 rounded-b-lg  top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-[#321018]/80 backdrop-blur-md border-b border-[#BFAF78]/20">
        {/* Logo */}
        <div className="h-16  flex items-center justify-center pt-5 ">
          <Image
            src={LOGO_URL}
            alt="Safar Gate"
            width={320}
            height={80}
            className="h-36 w-auto object-fill cursor-pointer"
            unoptimized
            onClick={handleLogoClick}
          />
        </div>

        {/* Desktop buttons - مخفية على الموبايل */}
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher />
          <Button
            size="sm"
            variant="outline"
            className="border-[#BFAF78] text-[#BFAF78] bg-transparent hover:bg-[#BFAF78]/10 font-bold gap-2"
            onClick={() => router.push('/email-login?role=agent')}
          >
            <Shield className="w-4 h-4" />
            {isRTL ? 'دخول الوكيل' : 'Agent Login'}
          </Button>
        </div>

        {/* Hamburger - ظاهر على الموبايل بس */}
        <button
          className="sm:hidden text-[#BFAF78]"
          onClick={() => setMenuOpen(p => !p)}
        >
          <MenuIcon />
        </button>
        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-[#321018bd] border-b  px-6 py-4 flex flex-col gap-3">
            <LanguageSwitcher fullWidth />
            <Button
              size="sm"
              variant="outline"
              className="border-[#BFAF78] text-[#BFAF78] bg-transparent hover:bg-[#BFAF78]/10 font-bold gap-2 w-full"
              onClick={() => { router.push('/email-login?role=agent'); setMenuOpen(false); }}
            >
              <Shield className="w-4 h-4" />
              {isRTL ? 'دخول الوكيل' : 'Agent Login'}
            </Button>
          </div>
        )}
      </nav>
      {/* ── Hero ── */}
      <section className="min-h-screen flex items-center justify-center text-center px-4 relative pt-20 bg-[#200707]">
        <div className="max-w-3xl mx-auto z-10">
          <div className="inline-block text-sm px-4 py-2 rounded-full mb-6 bg-[#BFAF78]/10 border border-[#BFAF78]/30 text-[#BFAF78]">
            {t('hero.badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t('hero.title1')}
            <span className="text-[#BFAF78]">{t('hero.brand')}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 leading-relaxed text-rose-200/60">
            {t('hero.subtitle')}
          </p>
          {/* ── Role Selection Cards ── */}
          <div className="max-w-4xl mx-auto py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Traveler Card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="rounded-2xl bg-[#2d0a0a] border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-8 flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#BFAF78]/10 border border-[#BFAF78]/40 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#BFAF78]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t('hero.traveler')}
                  </h3>
                </div>
                <p className="text-rose-200/60 text-md leading-relaxed">
                  {t('hero.travelerDec')}
                </p>
                <Button
                  size="lg"
                  className="w-full bg-[#BFAF78] text-[#1a0505] font-bold hover:bg-[#d4c98a] rounded-xl gap-2"
                  onClick={() => router.push(`/${locale}/dashboard`)}
                >
                  {t('hero.booking')}
                  <ArrowIcon className="w-4 h-4" />

                </Button>
              </motion.div>

              {/* Carrier Card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }}
                className="rounded-2xl bg-[#2d0a0a] border border-[#BFAF78] hover:border-[#BFAF78]/60 transition-colors p-8 flex flex-col gap-6"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#BFAF78]/10 border border-[#BFAF78]/40 flex items-center justify-center">
                    <Bus className="w-6 h-6 text-[#BFAF78]" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {t('hero.carrier')}
                  </h3>
                </div>
                <p className="text-rose-200/60 text-md leading-relaxed">

                  {t('hero.carrierDec')}
                </p>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-[#BFAF78] text-[#BFAF78] bg-transparent hover:bg-[#BFAF78]/10 rounded-xl gap-2"
                  onClick={() => router.push('/email-login?role=carrier')}
                >
                  {t('hero.trip')}
                  <ArrowIcon className="w-4 h-4" />
                </Button>
              </motion.div>

            </div>
          </div>
        </div>
      </section>
      {/* ── Features ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-rose-200/60">{t('features.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([0, 1, 2] as const).map((i) => (
              <Card key={i} className="transition-all duration-300 hover:-translate-y-1 shadow-md shadow-black bg-[#2d0a0a] border border-[#3d1515] hover:border-[#BFAF78]">
                <CardContent className="p-8">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#BFAF78]/10 text-[#BFAF78]">
                    {featureIcons[i]}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[#f5edd6]">{t(`features.items.${i}.title`)}</h3>
                  <p className="text-rose-200/60 leading-relaxed">{t(`features.items.${i}.desc`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 sm:py-28 px-4 bg-[#200707]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center text-3xl sm:text-4xl font-bold mb-14 text-[#BFAF78]"
          >
            {t('services.title')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6">
            {([0, 1] as const).map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                className="rounded-2xl bg-[#2d0a0a] shadow-md shadow-black border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-8"
              >
                <h3 className="text-lg font-bold text-[#BFAF78] mb-6">{t(`services.items.${i}.title`)}</h3>
                <ul className="flex flex-col gap-3">
                  {([0, 1, 2, 3] as const).map((j) => (
                    <li key={j} className="flex items-start gap-3 text-rose-100/70 text-sm leading-relaxed">
                      <span className="mt-1.5 w-2 h-2 rounded-full border-2 border-[#BFAF78] shrink-0" />
                      {t(`services.items.${i}.features.${j}`)}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-20 sm:py-28 px-4 bg-[#321018]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center text-3xl sm:text-4xl font-bold mb-16 text-white"
          >
            {t('vision.title')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 32 : -32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-center md:justify-start mb-2">
                <div className="w-14 h-14 rounded-full bg-[#BFAF78]/10 border border-[#BFAF78]/40 flex items-center justify-center">
                  <Eye className="w-7 h-7 text-[#BFAF78]" />
                </div>
              </div>
              {([0, 1, 2] as const).map((i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="rounded-2xl shadow-md shadow-black bg-[#2d0a0a] border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-5"
                >
                  {t(`vision.paragraphs.${i}`)}
                </motion.p>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -32 : 32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              {/* <img src={ourVisionImg.src} alt="" /> */}
              <Image src={ourVisionImg.src} alt="Our Vision" width={475} height={475} />

            </motion.div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4 bg-[#200707]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center text-3xl sm:text-4xl font-bold mb-14 text-[#BFAF78]"
          >
            <div className="text-center mb-16">
              <h2 className="font-bold mb-4">{t('how.title')}</h2>
              <p className="text-rose-200/60">{t('how.subtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {(['travelers', 'carriers'] as const).map((group, gi) => (
                <motion.div
                  key={gi}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: gi * 0.15 }}
                  className="rounded-2xl bg-[#2d0a0a] shadow-md shadow-black border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#BFAF78]/20 border border-[#BFAF78]">
                      {gi === 0
                        ? <Users className="w-5 h-5 text-[#BFAF78]" />
                        : <Star className="w-5 h-5 text-[#BFAF78]" />}
                    </div>
                    <h3 className="text-2xl font-bold text-[#f5edd6]">{t(`how.${group}.title`)}</h3>
                  </div>
                  <div className="space-y-6">
                    {([0, 1, 2] as const).map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-[#BFAF78]/10 border border-[#BFAF78] text-[#BFAF78]">
                          {i + 1}
                        </div>
                        <div className="flex items-center gap-3 text-white/70">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#BFAF78]" />
                          <span className='text-lg'>{t(`how.${group}.steps.${i}`)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.h2>

          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {(['travelers', 'carriers'] as const).map((group, gi) => (
              <div key={gi}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#BFAF78]/20 border border-[#BFAF78]">
                    {gi === 0
                      ? <Users className="w-5 h-5 text-[#BFAF78]" />
                      : <Star className="w-5 h-5 text-[#BFAF78]" />}
                  </div>
                  <h3 className="text-2xl font-bold text-[#f5edd6]">{t(`how.${group}.title`)}</h3>
                </div>
                <div className="space-y-6">
                  {([0, 1, 2] as const).map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-[#BFAF78]/10 border border-[#BFAF78] text-[#BFAF78]">
                        {i + 1}
                      </div>
                      <div className="flex items-center gap-3 text-rose-100/70">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#BFAF78]" />
                        <span>{t(`how.${group}.steps.${i}`)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>

      {/* ── Our Goals ── */}
      <section className="py-20 sm:py-28 px-4 bg-[#321018]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center text-3xl sm:text-4xl font-bold mb-16 text-white"
          >
            {t('ourGoals.title')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 32 : -32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-center md:justify-start mb-2">
                <div className="w-14 h-14 rounded-full bg-[#BFAF78]/10 border border-[#BFAF78]/40 flex items-center justify-center">
                  <CircleDot className="w-7 h-7 text-[#BFAF78]" />
                </div>
              </div>
              {([0, 1, 2] as const).map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.15 }}
                  className="rounded-2xl shadow-md shadow-black bg-[#2d0a0a] border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-5"
                >
                  {t(`ourGoals.items.${i}.title`) && (
                    <h3 className="text-lg font-bold text-[#BFAF78] mb-4">{t(`ourGoals.items.${i}.title`)}</h3>
                  )}
                  <ul className="flex flex-col gap-3">
                    {([0] as const).map((j) => (
                      <li key={j} className="flex items-start gap-3 text-rose-100/70 text-sm leading-relaxed">
                        <span className="mt-1.5 w-2 h-2 rounded-full border-2 border-[#BFAF78] shrink-0" />
                        {t(`ourGoals.items.${i}.paragraphs.${j}`)}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -32 : 32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="flex justify-center"
            >
              {/* <img src={ourGoalsImg.src} alt="Our Goals" /> */}
              <Image src={ourGoalsImg.src} alt="Our Goals" width={475} height={475} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 px-4 bg-[#200707]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('stats.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(t.raw('stats.items') as Array<{ value: number, label: string }>).map((s, i) => (
              <StatCard key={i} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-12 text-center bg-gradient-to-br shadow-md shadow-black from-[#3d1010] to-[#2d0a0a] border border-[#BFAF78]">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#f5edd6]">{t('cta.title')}</h2>
            <p className="text-lg mb-8 text-rose-200/60">{t('cta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 rounded-xl font-bold bg-[#BFAF78] text-[#1a0505] hover:bg-[#d4c98a]"
                onClick={() => router.push(
                  // `/${locale}/login?role=traveler`
                  `/${locale}/dashboard`
                )}
              >
                {t('cta.btn1')}
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 rounded-xl border-[#BFAF78] text-[#BFAF78] bg-transparent hover:bg-[#BFAF78]/10"
                onClick={() => router.push('/email-login?role=carrier')}
              >
                {t('cta.btn2')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact ── */}
      <section className="py-20 sm:py-28 px-4 bg-[#200707]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.5 }}
            className="text-center text-3xl sm:text-4xl font-bold mb-16 text-white"
          >
            {t('contact.title')}
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Illustration */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? -32 : 32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex justify-center order-2 md:order-1"
            >
              {/* <img src={emailImg.src} alt='emailIcon' /> */}
              <Image src={emailImg.src} alt="Our emailImg" width={475} height={475} />

            </motion.div>
            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 32 : -32 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.15 }}
              className="order-1 md:order-2"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#BFAF78] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-start gap-2">
              <Image src={LOGO_URL} alt="Safar Gate" width={120} height={40} className="h-10 w-auto object-contain" unoptimized />
              <p className="text-sm text-white/50">{t('footer.tagline')}</p>
            </div>
            <div className="flex gap-8 text-sm">
              {
                [
                  t("footer.links.terms"),
                  t("footer.links.travelers"),
                  t("footer.links.carriers")
                ].map((link, i) => (
                  <button key={i} className="text-white/50 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-body">
                    {link}
                  </button>
                ))
              }
            </div>
          </div>
          <div className="mt-8 pt-8 text-center text-sm border-t border-[#BFAF78] text-white/50">
            {t('footer.copy')}
          </div>
        </div>
      </footer>

      {/* ── Admin Modal ── */}
      <Dialog open={showAdminModal} onOpenChange={setShowAdminModal}>
        <DialogContent className="sm:max-w-md bg-card border-primary z-50 [&>button]:hidden">
          <form onSubmit={handleAdminLogin}>
            <DialogHeader>
              <button
                type="button"
                onClick={() => setShowAdminModal(false)}
                className={`absolute top-3 border-0 text-[#BFAF78] hover:text-white transition-colors ${isRTL ? 'left-5' : 'right-5'
                  }`}
              >
                ✕
              </button>
              <DialogTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                {ta('admin.login')}
              </DialogTitle>
              <DialogDescription>{ta('admin.title')}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {error && (
                <div className="bg-destructive/10 p-4 rounded-xl border border-destructive/20 text-destructive text-sm text-center font-bold flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2 ">
                <Label htmlFor="email-secret">{ta('auth.email')}</Label>
                <Input id="email-secret" type="email" value={email} onChange={e => setEmail(e.target.value)} required dir="ltr" disabled={isLoading} className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-secret">{ta('auth.password')}</Label>
                <div className="relative">
                  <Input
                    id="password-secret"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    dir="ltr"
                    disabled={isLoading}
                    className="font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setShowAdminModal(false)} disabled={isLoading}>
                {ta('common.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading} className="min-w-[120px]">
                {isLoading ? <Loader2 className="animate-spin h-4 w-4" /> : ta('admin.loginAdmin')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </main>
  );
}



