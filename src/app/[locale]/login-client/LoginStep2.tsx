"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Ship, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/use-login";
import { Logo } from "@/components/logo";
import { triggerHaptic } from "@/lib/utils";

/**
 * @page LoginStep2
 * @description THE REINFORCED REGISTRATION HUB (STERILIZED - V12.0 - SCR-952)
 * [SCR-952]: Neural Sync - Shared agreement state with login and terms.
 */
export default function LoginStep2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();

  const [role, setRole] = useState<string | null>(null);
  const [redirectingToTerms, setRedirectingToTerms] = useState(false);

  const {
    formData,
    setFormData,
    loading,
    handleRegister,
    returningUser,
  } = useLogin();

  // ✅ جيب الـ role من URL
  useEffect(() => {
    const roleFromUrl = searchParams.get("role");
    // if (roleFromUrl === "carrier" || roleFromUrl === "traveler")
    if (roleFromUrl === "carrier" || roleFromUrl === "traveler" || roleFromUrl === "agent") {
      setRole(roleFromUrl);
      setFormData((prev) => ({ ...prev, role: roleFromUrl }));
    } else {
      router.replace("/");
    }
  }, [searchParams, setFormData, router]);

  // ✅ جيب البيانات من localStorage
  useEffect(() => {
    const savedEmail = localStorage.getItem("tempEmail");
    const savedPassword = localStorage.getItem("tempPassword");
    const savedPhone = localStorage.getItem("tempPhone");
    const savedName = localStorage.getItem("tempName") || localStorage.getItem("tempFirstName");
    const agreed = localStorage.getItem("termsAgreed") === "true";

    setFormData((prev) => ({
      ...prev,
      email: savedEmail || prev.email,
      password: savedPassword || prev.password,
      phone: savedPhone || prev.phone,
      firstName: savedName || prev.firstName,
      agreed: agreed || prev.agreed
    }));
  }, [setFormData]);

  // ✅ لو المستخدم راجع، نرجعه لصفحة الـ login
  useEffect(() => {
    if (returningUser) {
      router.replace(`/login?role=${formData.role}`);
    }
  }, [returningUser, router, formData.role]);

  // ✅ مسح كل البيانات المؤقتة بعد التسجيل
  const handleRegisterWrapper = async () => {
    await handleRegister();
    localStorage.removeItem("tempFirstName");
    localStorage.removeItem("tempEmail");
    localStorage.removeItem("tempPassword");
    localStorage.removeItem("tempPhone");
    localStorage.removeItem("tempName");
    localStorage.removeItem("termsAgreed");
  };

  const goToTerms = () => {
    triggerHaptic('light');
    setRedirectingToTerms(true);
    localStorage.setItem("tempFirstName", formData.firstName);
    router.push("/terms?from=login-client");
  };

  if (!role) return null;

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
      dir={locale === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="cursor-pointer hover:scale-110 transition-transform duration-300">
              <Logo />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t('common.appName')}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t('auth.signup')}
          </p>
        </div>

        <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
          <div className="space-y-4">

            {/* الاسم */}
            <div className="space-y-2">
              <Label>{t('auth.name')}</Label>
              <Input
                placeholder={t('auth.name')}
                value={formData.firstName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData({ ...formData, firstName: value });
                  localStorage.setItem("tempFirstName", value);
                }}
                disabled={loading}
              />
            </div>

            {/* موافقة الشروط */}
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl border border-dashed border-primary/20">
              <Checkbox
                id="terms-check-2"
                checked={formData.agreed}
                disabled={loading}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({ ...prev, agreed: Boolean(checked) }));
                }}
              />
              <span className="text-xs font-bold">
                {locale === "ar" ? (
                  <>
                    أوافق على{" "}
                    <button
                      type="button"
                      disabled={redirectingToTerms}
                      onClick={goToTerms}
                      className="inline-flex items-center text-primary underline hover:opacity-80"
                    >
                      الميثاق القانوني والسيادي
                      {redirectingToTerms && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
                    </button>
                  </>
                ) : (
                  <>
                    I agree to the{" "}
                    <button
                      type="button"
                      disabled={redirectingToTerms}
                      onClick={goToTerms}
                      className="inline-flex items-center text-primary underline hover:opacity-80"
                    >
                      Sovereign Constitution
                      {redirectingToTerms && <Loader2 className="ml-1 h-3 w-3 animate-spin" />}
                    </button>
                  </>
                )}
              </span>
            </div>

            {/* زر التسجيل */}
            <Button
              className="w-full h-14 text-xl font-black"
              onClick={handleRegisterWrapper}
              disabled={loading || !formData.firstName || !formData.agreed}
            >
              {loading ? <Loader2 className="animate-spin" /> : t('auth.login')}
            </Button>

            {/* زر العودة */}
            <Button
              variant="outline"
              className="w-full h-12 font-bold"
              onClick={() => router.push(`/login?role=${formData.role}`)}
              disabled={loading}
            >
              {t('common.back')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
