'use client';

/**
 * @page LandingPage
 *
 * PERF-FIX-3: فصل Firebase/Admin Modal عن الـ Landing Page
 * ============================================================
 * المشكلة الأصلية:
 *   - الصفحة كانت تعمل useAuth() + useFirestore() في أول render
 *   - ده معناه Firebase SDK كامل بيتحمل لكل زوار الصفحة الرئيسية
 *   - حتى اللي مش أدمن خالص وميعرفوش المودال ده
 *
 * الحل:
 *   - AdminLoginModal اتفصل في component منفصلة (admin-login-modal.tsx)
 *   - بيتحمل بـ React.lazy فقط لما الأدمن يضغط على اللوجو
 *   - Firebase SDK مش هيتحمل خالص في أول render للزوار العاديين
 *   - وفر ~94 KiB من الـ JS الأول
 */

import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Shield, Zap, DollarSign, Star, Users, CheckCircle2,
  ArrowLeft, ArrowRight, Eye, CircleDot, Mail, Phone, Send, MenuIcon, Bus
} from 'lucide-react';
import { useEffect, useRef, useState, lazy, Suspense } from 'react';
import { LanguageSwitcher } from '@/components/language-switcher';

// ✅ PERF-FIX-3: Lazy load AdminLoginModal — Firebase لا يُحمّل إلا عند الضغط
import type { AdminLoginModalProps } from '../../components/admin-login-modal';

const AdminLoginModal = lazy<React.ComponentType<AdminLoginModalProps>>(() =>
  import('../../components/admin-login-modal').then(m => ({ default: m.AdminLoginModal }))
);

// ✅ optimized WebP images
import ourGoalsImg from '../../../public/imgi_5_opt.webp';
import ourVisionImg from '../../../public/imgi_4_opt.webp';
import emailImg from '../../../public/imgi_6_opt.webp';

const LOGO_URL = '/logo.webp';

// ── useCountUp ──────────────────────────────────────────────────────────────
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

function StatCard({ value, label }: { value: number; label: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl font-bold mb-2 text-[#BFAF78]">{count.toLocaleString()}+</div>
      <div className="text-sm text-rose-200/50">{label}</div>
    </div>
  );
}

// ── AnimatedSection — CSS + IntersectionObserver بدل framer-motion ──────────
function AnimatedSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

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
          <input type="text" placeholder={t('contact.namePlaceholder')} value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
            className="bg-[#2d0a0a] border border-[#3d1515] focus:border-[#BFAF78] rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-colors text-sm" />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm text-rose-200/70">{t('contact.email')}</label>
          <input type="email" placeholder={t('contact.emailPlaceholder')} value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            className="bg-[#2d0a0a] border border-[#3d1515] focus:border-[#BFAF78] rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-colors text-sm" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-rose-200/70">{t('contact.message')}</label>
        <textarea rows={5} placeholder={t('contact.messagePlaceholder')} value={form.message}
          onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
          className="bg-[#2d0a0a] border border-[#3d1515] focus:border-[#BFAF78] rounded-xl px-4 py-3 text-white placeholder-white/30 outline-none transition-colors text-sm resize-none" />
      </div>
      <div>
        <Button onClick={handleSubmit} disabled={loading}
          className="bg-[#BFAF78] text-[#1a0505] font-bold hover:bg-[#d4c98a] px-8 py-3 rounded-xl flex items-center gap-2">
          {loading ? <span className="animate-spin w-4 h-4 border-2 border-[#1a0505] border-t-transparent rounded-full" /> : <Send className="w-4 h-4" />}
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

// ── LandingPage ──────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const locale = useLocale();
  // ✅ PERF-FIX-3: لا Firebase hooks هنا — بس state للمودال
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations('home');
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const featureIcons = [
    <Zap key="zap" className="w-6 h-6" aria-hidden="true" />,
    <Shield key="shield" className="w-6 h-6" aria-hidden="true" />,
    <DollarSign key="dollar" className="w-6 h-6" aria-hidden="true" />,
  ];

  return (
    <main dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-[#321018] text-white font-body">

      {/* ── Navbar ── */}
      <nav className="fixed h-16 rounded-b-lg top-0 pb-6 pt-9  left-0 right-0 z-50 flex items-center justify-between px-6  bg-[#BFAF78] backdrop-blur-md border-b border-[#BFAF78]/20"
        aria-label="Main navigation">
        <div className="h-16 flex items-center justify-center pt-5">
          {/* ✅ priority للـ logo عشان يتحمل أول حاجة */}
          <Image src={LOGO_URL} alt="Safar Gate - Land Travel Booking" width={320} height={80}
            className="h-36 w-auto object-contain cursor-pointer" priority onDoubleClick={() => setShowAdminModal(true)} />
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <LanguageSwitcher />
          <Button size="sm" variant="outline"
            className="border-black text-black bg-transparent hover:bg-[#BFAF78]/10 font-bold gap-2"
            onClick={() => router.push('/email-login?role=agent')}
            aria-label={isRTL ? 'دخول الوكيل' : 'Agent Login'}>
            <Shield className="w-4 h-4" aria-hidden="true" />
            {isRTL ? 'دخول الوكيل' : 'Agent Login'}
          </Button>
        </div>
        <button className="sm:hidden text-[#BFAF78]" onClick={() => setMenuOpen(p => !p)}
          aria-label="Toggle menu" aria-expanded={menuOpen}>
          <MenuIcon aria-hidden="true" />
        </button>
        {menuOpen && (
          <div className="sm:hidden absolute top-full left-0 right-0 bg-[#321018] border-b px-6 py-4 flex flex-col gap-3" role="menu">
            <LanguageSwitcher fullWidth />
            <Button size="sm" variant="outline"
              className="border-[#BFAF78] text-[#BFAF78] bg-transparent hover:bg-[#BFAF78]/10 font-bold gap-2 w-full"
              onClick={() => { router.push('/email-login?role=agent'); setMenuOpen(false); }}>
              <Shield className="w-4 h-4" aria-hidden="true" />
              {isRTL ? 'دخول الوكيل' : 'Agent Login'}
            </Button>
          </div>
        )}
      </nav>

      {/* ── Hero — NO heavy images ── */}
      <section className="min-h-screen flex items-center justify-center text-center px-4 relative pt-20 bg-[#200707]"
        aria-label={t('hero.badge')}>
        <div className="max-w-3xl mx-auto z-10">
          <p className="inline-block text-sm px-4 py-2 rounded-full mb-6 bg-[#BFAF78]/10 border border-[#BFAF78]/30 text-[#BFAF78]">
            {t('hero.badge')}
          </p>
          <h1 className="text-5xl md:text-5xl font-bold mb-6 leading-tight">
            {t('hero.title1')}
            <span className="text-[#BFAF78]">{t('hero.brand')}</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 leading-relaxed text-[#BFAF78]">
            {t('hero.subtitle')}
          </p>
          <div className="max-w-4xl mx-auto py-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Traveler Card */}
              <div className="rounded-2xl bg-[#2d0a0a] border border-[#BFAF78] hover:border-[#BFAF78]/60 transition-colors p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#BFAF78]/10 border border-[#BFAF78]/40 flex items-center justify-center" aria-hidden="true">
                    <Users className="w-6 h-6 text-[#BFAF78]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{t('hero.traveler')}</h2>
                </div>
                <p className="text-rose-200/60 text-md leading-relaxed">{t('hero.travelerDec')}</p>
                <Button size="lg"
                  variant="outline"
                  className="w-full border-[#BFAF78] text-[#BFAF78] bg-transparent hover:bg-[#BFAF78]/10 rounded-xl gap-2"
                  onClick={() => router.push(`/${locale}/dashboard`)}>
                  {t('hero.booking')} <ArrowIcon className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
              {/* Carrier Card */}
              <div className="rounded-2xl bg-[#2d0a0a] border border-[#BFAF78] hover:border-[#BFAF78]/60 transition-colors p-8 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#BFAF78]/10 border border-[#BFAF78]/40 flex items-center justify-center" aria-hidden="true">
                    <Bus className="w-6 h-6 text-[#BFAF78]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{t('hero.carrier')}</h2>
                </div>
                <p className="text-rose-200/60 text-md leading-relaxed">{t('hero.carrierDec')}</p>
                <Button size="lg" variant="outline"
                  className="w-full border-[#BFAF78] text-[#BFAF78] bg-transparent hover:bg-[#BFAF78]/10 rounded-xl gap-2"
                  onClick={() => router.push('/email-login?role=carrier')}>
                  {t('hero.trip')} <ArrowIcon className="w-4 h-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="py-24 px-4" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-rose-200/60">{t('features.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {([0, 1, 2] as const).map((i) => (
              <AnimatedSection key={i} delay={i * 100}>
                <Card className="h-full transition-all duration-300 hover:-translate-y-1 shadow-md shadow-black bg-[#2d0a0a] border border-[#3d1515] hover:border-[#BFAF78]">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-[#BFAF78]/10 text-[#BFAF78]" aria-hidden="true">
                      {featureIcons[i]}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-[#f5edd6]">{t(`features.items.${i}.title`)}</h3>
                    <p className="text-rose-200/60 leading-relaxed">{t(`features.items.${i}.desc`)}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-20 sm:py-28 px-4 bg-[#200707]" aria-labelledby="services-heading">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 id="services-heading" className="text-center text-3xl sm:text-4xl font-bold mb-14 text-[#BFAF78]">
              {t('services.title')}
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-6">
            {([0, 1] as const).map((i) => (
              <AnimatedSection key={i} delay={i * 150}>
                <div className="rounded-2xl bg-[#2d0a0a] shadow-md shadow-black border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-8 h-full">
                  <h3 className="text-lg font-bold text-[#BFAF78] mb-6">{t(`services.items.${i}.title`)}</h3>
                  <ul className="flex flex-col gap-3" role="list">
                    {([0, 1, 2, 3] as const).map((j) => (
                      <li key={j} className="flex items-start gap-3 text-rose-100/70 text-sm leading-relaxed">
                        <span className="mt-1.5 w-2 h-2 rounded-full border-2 border-[#BFAF78] shrink-0" aria-hidden="true" />
                        {t(`services.items.${i}.features.${j}`)}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Vision ── */}
      <section className="py-20 sm:py-28 px-4 bg-[#321018]" aria-labelledby="vision-heading">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 id="vision-heading" className="text-center text-3xl sm:text-4xl font-bold mb-16 text-white">
              {t('vision.title')}
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="flex flex-col gap-6">
                <div className="flex justify-center md:justify-start mb-2">
                  <div className="w-14 h-14 rounded-full bg-[#BFAF78]/10 border border-[#BFAF78]/40 flex items-center justify-center" aria-hidden="true">
                    <Eye className="w-7 h-7 text-[#BFAF78]" />
                  </div>
                </div>
                {([0, 1, 2] as const).map((i) => (
                  <AnimatedSection key={i} delay={i * 150}>
                    <p className="rounded-2xl shadow-md shadow-black bg-[#2d0a0a] border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-5">
                      {t(`vision.paragraphs.${i}`)}
                    </p>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="flex justify-center">
                <Image src={ourVisionImg.src} alt={t('vision.title')} width={475} height={475} loading="lazy" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-24 px-4 bg-[#200707]" aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 id="how-heading" className="text-3xl sm:text-4xl font-bold mb-4 text-[#BFAF78]">{t('how.title')}</h2>
              <p className="text-rose-200/60">{t('how.subtitle')}</p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {(['travelers', 'carriers'] as const).map((group, gi) => (
              <AnimatedSection key={gi} delay={gi * 150}>
                <div className="rounded-2xl bg-[#2d0a0a] shadow-md shadow-black border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-8 h-full">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#BFAF78]/20 border border-[#BFAF78]" aria-hidden="true">
                      {gi === 0 ? <Users className="w-5 h-5 text-[#BFAF78]" /> : <Star className="w-5 h-5 text-[#BFAF78]" />}
                    </div>
                    <h3 className="text-2xl font-bold text-[#f5edd6]">{t(`how.${group}.title`)}</h3>
                  </div>
                  <ol className="space-y-6" role="list">
                    {([0, 1, 2] as const).map((i) => (
                      <li key={i} className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 bg-[#BFAF78]/10 border border-[#BFAF78] text-[#BFAF78]"
                          aria-hidden="true">{i + 1}</div>
                        <div className="flex items-center gap-3 text-white/70">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-[#BFAF78]" aria-hidden="true" />
                          <span className="text-lg">{t(`how.${group}.steps.${i}`)}</span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Goals ── */}
      <section className="py-20 sm:py-28 px-4 bg-[#321018]" aria-labelledby="goals-heading">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 id="goals-heading" className="text-center text-3xl sm:text-4xl font-bold mb-16 text-white">
              {t('ourGoals.title')}
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection>
              <div className="flex flex-col gap-6">
                <div className="flex justify-center md:justify-start mb-2">
                  <div className="w-14 h-14 rounded-full bg-[#BFAF78]/10 border border-[#BFAF78]/40 flex items-center justify-center" aria-hidden="true">
                    <CircleDot className="w-7 h-7 text-[#BFAF78]" />
                  </div>
                </div>
                {([0, 1, 2] as const).map((i) => (
                  <AnimatedSection key={i} delay={i * 150}>
                    <div className="rounded-2xl shadow-md shadow-black bg-[#2d0a0a] border border-[#3d1515] hover:border-[#BFAF78] transition-colors p-5">
                      {t(`ourGoals.items.${i}.title`) && (
                        <h3 className="text-lg font-bold text-[#BFAF78] mb-4">{t(`ourGoals.items.${i}.title`)}</h3>
                      )}
                      <ul className="flex flex-col gap-3" role="list">
                        <li className="flex items-start gap-3 text-rose-100/70 text-sm leading-relaxed">
                          <span className="mt-1.5 w-2 h-2 rounded-full border-2 border-[#BFAF78] shrink-0" aria-hidden="true" />
                          {t(`ourGoals.items.${i}.paragraphs.0`)}
                        </li>
                      </ul>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection delay={200}>
              <div className="flex justify-center">
                <Image src={ourGoalsImg.src} alt={t('ourGoals.title')} width={475} height={475} loading="lazy" />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-24 px-4 bg-[#200707]" aria-labelledby="stats-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 id="stats-heading" className="text-3xl md:text-4xl font-bold mb-4">{t('stats.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {(t.raw('stats.items') as Array<{ value: number; label: string }>).map((s, i) => (
              <StatCard key={i} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      {/* <section className="py-24 px-4" aria-labelledby="cta-heading">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl p-12 text-center bg-gradient-to-br shadow-md shadow-black from-[#3d1010] to-[#2d0a0a] border border-[#BFAF78]">
            <h2 id="cta-heading" className="text-3xl md:text-4xl font-bold mb-4 text-[#f5edd6]">{t('cta.title')}</h2>
            <p className="text-lg mb-8 text-rose-200/60">{t('cta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6 rounded-xl font-bold bg-[#BFAF78] text-[#1a0505] hover:bg-[#d4c98a]"
                onClick={() => router.push(`/${locale}/dashboard`)}>
                {t('cta.btn1')}
              </Button>
              <Button size="lg" variant="outline"
                className="text-lg px-8 py-6 rounded-xl border-[#BFAF78] text-[#BFAF78] bg-transparent hover:bg-[#BFAF78]/10"
                onClick={() => router.push('/email-login?role=carrier')}>
                {t('cta.btn2')}
              </Button>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── Contact ── */}
      <section className="py-20 sm:py-28 px-4 bg-[#321018]" aria-labelledby="contact-heading">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 id="contact-heading" className="text-center text-3xl sm:text-4xl font-bold mb-16 text-white">
              {t('contact.title')}
            </h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={200}>
              <div className="flex justify-center order-2 md:order-1">
                <Image src={emailImg.src} alt="Contact us" width={475} height={475} loading="lazy" />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={100}>
              <div className="order-1 md:order-2">
                <ContactForm />
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[#BFAF78] bg-[#200707] py-12 px-4" role="contentinfo">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col items-start gap-2">
              <Image src={LOGO_URL} alt="Safar Gate" width={320} height={80} className="h-36 w-auto object-contain" />
              <p className="text-sm text-white/50">{t('footer.tagline')}</p>
            </div>
            <nav aria-label="Footer navigation">
              <div className="flex gap-8 text-sm">
                {[t('footer.links.terms'), t('footer.links.travelers'), t('footer.links.carriers')].map((link, i) => (
                  <button key={i} className="text-white/50 hover:text-white transition-colors bg-transparent border-none cursor-pointer font-body">
                    {link}
                  </button>
                ))}
              </div>
            </nav>
          </div>
          <div className="mt-8 pt-8 text-center text-sm border-t border-[#BFAF78] text-white/50">
            {t('footer.copy')}
          </div>
        </div>
      </footer>

      {/* ── Admin Modal — Lazy Loaded (Firebase لا يُحمّل إلا عند الضغط) ── */}
      {showAdminModal && (
        <Suspense fallback={null}>
          <AdminLoginModal open={showAdminModal} onClose={() => setShowAdminModal(false)} />
        </Suspense>
      )}
    </main>
  );
}