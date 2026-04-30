// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useRouter } from "@/i18n/routing";
// import { useTranslations, useLocale } from "next-intl";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Car, Eye, EyeOff, Loader2, Shield, Ship, User } from "lucide-react";

// import { useLogin } from "@/hooks/use-login";
// import { Logo } from "@/components/logo";
// import { getCountries, getCountryCallingCode } from "react-phone-number-input";
// import arNames from "react-phone-number-input/locale/ar";
// import enNames from "react-phone-number-input/locale/en";

// import Select from "react-select";

// import { useToast } from "@/hooks/use-toast";
// import { Checkbox } from "@/components/ui/checkbox";
// import { triggerHaptic } from "@/lib/utils";

// /**
//  * @page LoginPhone
//  * @description THE REINFORCED SOVEREIGN PORTAL (STERILIZED - V10.0 - SCR-960)
//  * [SCR-960]: Conflict Resolution - Enforced 8-char password shield and terms sync.
//  * Protocol 30: Dictatorship of the Token. Protocol 16: Sterilized.
//  */
// export default function LoginPhone() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const t = useTranslations();
//   const locale = useLocale();
//   const { toast } = useToast();

//   const [roleFromUrl, setRoleFromUrl] = useState<string | null>(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState("JO");
//   const [callingCode, setCallingCode] = useState("962");
//   const [redirectingToTerms, setRedirectingToTerms] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const {
//     loading,
//     formData,
//     setFormData,
//     handleCheckPhone,
//     returningUser,
//     handleReturningUserLogin,
//   } = useLogin();

//   const countries = getCountries().map((country) => ({
//     value: country,
//     label: `${locale === "ar" ? arNames[country] : enNames[country]} (+${getCountryCallingCode(country)})`,
//     code: getCountryCallingCode(country)
//   }));

//   useEffect(() => {
//     // [SCR-952] NEURAL SYNC: Capturing the legal seal from local storage
//     const agreed = localStorage.getItem("termsAgreed");
//     if (agreed === "true") {
//       setFormData((prev) => ({ ...prev, agreed: true }));
//     }
//   }, [setFormData]);

//   useEffect(() => {
//     const role = searchParams.get("role");
//     // if (role === "carrier" || role === "traveler") {
//     if (role === "carrier" || role === "traveler" || role === "agent") {
//       setRoleFromUrl(role);
//       setFormData((prev) => ({ ...prev, role }));
//     } else {
//       router.replace("/");
//     }
//   }, [searchParams, setFormData, router]);

//   if (!roleFromUrl) return null;

//   const handleNext = async () => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const phoneRegex = /^\d{7,15}$/;
//     const passwordRegex = /^.{8,}$/;
//     const nameRegex = /^[\u0600-\u06FF a-zA-Z]{2,50}$/;

//     if (!nameRegex.test(formData.firstName.trim())) {
//       toast({ variant: "destructive", title: "اسم غير صحيح", description: "أدخل اسمك بالعربي أو الإنجليزي (2-50 حرف)" });
//       return;
//     }
//     if (!phoneRegex.test(formData.phone.trim())) {
//       toast({ variant: "destructive", title: "رقم هاتف غير صحيح", description: "أدخل أرقام فقط من 7 إلى 15 خانة" });
//       return;
//     }
//     if (!emailRegex.test(formData.email.trim())) {
//       toast({ variant: "destructive", title: "بريد إلكتروني غير صحيح", description: "مثال: example@gmail.com" });
//       return;
//     }
//     if (!passwordRegex.test(formData.password)) {
//       toast({ variant: "destructive", title: "كلمة مرور ضعيفة", description: "8 خانات على الأقل" });
//       return;
//     }
//     // [SCR-960] ATOMIC VALIDATION: 8-char password is non-negotiable
//     if (
//       !formData.email.trim() ||
//       (formData.password?.length || 0) < 8 ||
//       !formData.firstName
//     ) {
//       toast({
//         variant: "destructive",
//         title: "بيانات ناقصة أو ضعيفة",
//         description: "يجب إدخال الاسم والبريد وكلمة مرور من 8 خانات على الأقل.",
//       });
//       return;
//     }

//     setSubmitting(true);
//     const result = await handleCheckPhone();

//     if (result.success && !result.isReturningUser) {
//       localStorage.setItem("tempEmail", formData.email);
//       localStorage.setItem("tempPassword", formData.password);
//       localStorage.setItem("tempPhone", formData.phone);
//       localStorage.setItem("tempName", formData.firstName);
//       localStorage.setItem("tempCallingCode", callingCode);
//       localStorage.setItem("tempCountryCode", selectedCountry);
//       const returnPath = searchParams.get("returnTo");
//       const nextUrl = `/login-client?role=${formData.role}${returnPath ? `&returnTo=${encodeURIComponent(returnPath)}` : ""}`;
//       router.push(nextUrl);
//     }
//     setSubmitting(false);
//   };

//   const goToTerms = () => {
//     triggerHaptic('light');
//     setRedirectingToTerms(true);
//     localStorage.setItem("tempFirstName", formData.firstName);
//     router.push("/terms?from=login");
//   };

//   if (returningUser) {
//     return (
//       <div
//         className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
//         dir={locale === "ar" ? "rtl" : "ltr"}
//       >
//         <div className="w-full max-w-md space-y-8">
//           <div className="text-center">
//             <Logo />
//             <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
//             <p className="text-muted-foreground">{t("auth.login")}</p>
//           </div>

//           <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm text-center">
//             <User className="mx-auto h-10 w-10 text-primary" />
//             <h3 className="text-xl font-bold">
//               {locale === "ar"
//                 ? `مرحباً بعودتك، ${returningUser.firstName}`
//                 : `Welcome back, ${returningUser.firstName}`}
//             </h3>
//             <Button
//               className="w-full"
//               onClick={handleReturningUserLogin}
//               disabled={loading}
//             >
//               {loading ? <Loader2 className="animate-spin" /> : (locale === "ar" ? "دخول إلى حسابي" : "Login")}
//             </Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
//       dir={locale === "ar" ? "rtl" : "ltr"}
//     >
//       <div className="w-full max-w-md space-y-3 ">
//         <div className="flex flex-col items-center text-center">
//           <Logo />
//           <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
//           <p className="text-muted-foreground">{t("auth.signup")}</p>
//         </div>
//         <div className="text-center pt-3">
//           <p className="text-xs text-muted-foreground">
//             {locale === 'ar' ? 'هل تمتلك حساب بالفعل؟ ' : 'Do you already have an account?'}
//             <button
//               type="button"
//               onClick={() => router.push(`/email-login?role=${formData.role}`)}
//               // onClick={() => router.push('/{locale}/email-login')}
//               className="text-primary underline font-bold hover:opacity-80"
//             >
//               {locale === 'ar' ? 'سجّل دخول من هنا' : 'Log in here'}
//             </button>
//           </p>
//         </div>
//         <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
//           <div className="space-y-4">
//             <div className="border rounded-lg p-4 text-center flex flex-col items-center gap-2 bg-primary/10 border-primary">
//               {formData.role === "carrier" ? (
//                 <>
//                   <Car className="h-8 w-8 text-primary" />
//                   <span className="font-bold">{t("carrier.title")}</span>
//                 </>
//               ) : formData.role === "traveler" ? (
//                 <>
//                   <User className="h-8 w-8 text-primary" />
//                   <span className="font-bold">{t("traveler.title")}</span>
//                 </>
//               )
//                 :
//                 (<>
//                   <Shield className="h-8 w-8 text-primary" />
//                   <span className="font-bold">{t("agent.title")}</span>
//                 </>)
//               }
//             </div>
//             {/* phone */}
//             <div className="space-y-2">
//               <Label>{t("auth.phone")}</Label>
//               <div className="flex rounded-md h-10 focus-within:ring-2 focus-within:ring-primary overflow-hidden border border-input" dir="rtl">
//                 <Input
//                   type="tel"
//                   inputMode="numeric"
//                   className="border-0 rounded-none focus-visible:ring-0 text-left h-full"
//                   placeholder="998xxxxx"
//                   value={formData.phone}
//                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                   disabled={loading}
//                 />
//                 <div className="flex items-center px-2 bg-muted text-sm border-l border-r">+{callingCode}</div>
//                 <div className="min-w-[155px] bg-muted">
//                   <Select
//                     options={countries}
//                     isSearchable
//                     menuPortalTarget={document.body}
//                     menuPosition="fixed"
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     placeholder={locale === "ar" ? "الدولة" : "Country"}
//                     value={countries.find((c) => c.value === selectedCountry)}
//                     onChange={(selected: any) => {
//                       setSelectedCountry(selected.value);
//                       setCallingCode(selected.code);
//                     }}
//                     styles={{
//                       control: (base) => ({
//                         ...base,
//                         border: "none",
//                         boxShadow: "none",
//                         minHeight: "40px",
//                         background: "transparent"
//                       }),
//                       menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                       menu: (base) => ({ ...base, backgroundColor: "hsl(var(--card))" }),
//                       option: (base, state) => ({
//                         ...base,
//                         backgroundColor: state.isFocused ? "hsl(var(--primary) / 0.1)" : "transparent",
//                         color: "inherit",
//                         cursor: "pointer"
//                       }),
//                       singleValue: (base) => ({ ...base, color: "inherit" }),
//                       input: (base) => ({ ...base, color: "inherit" })
//                     }}
//                   />
//                 </div>
//               </div>
//             </div>
//             {/* name */}
//             <div className="space-y-2">
//               <Label>{t("auth.name")}</Label>
//               <Input
//                 type="text"
//                 placeholder="Your Name"
//                 value={formData.firstName}
//                 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
//                 disabled={loading}
//               />
//             </div>
//             {/* email */}
//             <div className="space-y-2">
//               <Label>{t("auth.email")}</Label>
//               <Input
//                 type="email"
//                 placeholder="example@gmail.com"
//                 value={formData.email}
//                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//                 disabled={loading}
//               />
//             </div>
//             {/* password */}
//             <div className="space-y-2">
//               <Label>{t("auth.password")}</Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="8 characters min"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   disabled={loading}
//                   className="pr-10"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(p => !p)}
//                   className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//             </div>
//             {/* checkbox */}
//             <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-dashed border-primary/20">
//               <Checkbox
//                 id="terms-check"
//                 checked={formData.agreed}
//                 onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreed: Boolean(checked) }))}
//               />
//               <label htmlFor="terms-check" className="text-xs font-bold cursor-pointer">
//                 {locale === "ar" ? (
//                   <>
//                     أوافق على{" "}
//                     <button
//                       type="button"
//                       disabled={redirectingToTerms}
//                       onClick={goToTerms}
//                       className="inline-flex items-center text-primary underline hover:opacity-80"
//                     >
//                       الميثاق السيادي (الشروط)
//                       {redirectingToTerms && (
//                         <Loader2 className="ml-1 h-3 w-3 animate-spin" />
//                       )}
//                     </button>
//                   </>
//                 ) : (
//                   <>
//                     I agree to the{" "}
//                     <button
//                       type="button"
//                       disabled={redirectingToTerms}
//                       onClick={goToTerms}
//                       className="inline-flex items-center text-primary underline hover:opacity-80"
//                     >
//                       Sovereign Constitution
//                       {redirectingToTerms && (
//                         <Loader2 className="ml-1 h-3 w-3 animate-spin" />
//                       )}
//                     </button>
//                   </>
//                 )}
//               </label>
//             </div>
//             {/* buttons */}
//             <div className="flex gap-2 pt-2">
//               <Button
//                 className="w-2/3 h-12 text-lg font-black"
//                 onClick={handleNext}
//                 disabled={submitting || !formData.phone || !formData.email || (formData.password?.length || 0) < 8 || !formData.firstName || !formData.agreed}
//               >
//                 {submitting ? <Loader2 className="animate-spin" /> : t("common.next")}
//               </Button>
//               <Button
//                 variant="outline"
//                 className="w-1/3 h-12 font-bold"
//                 onClick={() => router.push("/")}
//               >
//                 {t("common.back")}
//               </Button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Car, Eye, EyeOff, Loader2, Ship, User, ShieldCheck } from "lucide-react";

import { useLogin } from "@/hooks/use-login";
import { Logo } from "@/components/logo";
import { getCountries, getCountryCallingCode } from "react-phone-number-input";
import arNames from "react-phone-number-input/locale/ar";
import enNames from "react-phone-number-input/locale/en";

import Select from "react-select";

import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { triggerHaptic } from "@/lib/utils";

/**
 * @page LoginPhone
 * @description THE REINFORCED SOVEREIGN PORTAL (STERILIZED - V10.0 - SCR-960)
 * [SCR-960]: Conflict Resolution - Enforced 8-char password shield and terms sync.
 * Protocol 30: Dictatorship of the Token. Protocol 16: Sterilized.
 */
export default function LoginPhone() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations();
  const locale = useLocale();
  const { toast } = useToast();

  const [roleFromUrl, setRoleFromUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("JO");
  const [callingCode, setCallingCode] = useState("962");
  const [redirectingToTerms, setRedirectingToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    loading,
    formData,
    setFormData,
    handleCheckPhone,
    returningUser,
    handleReturningUserLogin,
  } = useLogin();

  const countries = getCountries().map((country) => ({
    value: country,
    label: `${locale === "ar" ? arNames[country] : enNames[country]} (+${getCountryCallingCode(country)})`,
    code: getCountryCallingCode(country)
  }));

  useEffect(() => {
    // [SCR-952] NEURAL SYNC: Capturing the legal seal from local storage
    const agreed = localStorage.getItem("termsAgreed");
    if (agreed === "true") {
      setFormData((prev) => ({ ...prev, agreed: true }));
    }
  }, [setFormData]);

  useEffect(() => {
    const role = searchParams.get("role");
    // if (role === "carrier" || role === "traveler" || role === "agent") {
    //   setRoleFromUrl(role);
    //   setFormData((prev) => ({ ...prev, role }));
    // } else {
    //   router.replace("/");
    // }
    if (role === "carrier" || role === "traveler" || role === "agent") {
      setRoleFromUrl(role);
      setFormData((prev) => ({ ...prev, role }));
    } else {
      router.replace("/");
    }
  }, [searchParams, setFormData, router]);

  if (!roleFromUrl) return null;

  const handleNext = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const phoneRegex = /^\d{7,15}$/;
    const passwordRegex = /^.{8,}$/;
    const nameRegex = /^[\u0600-\u06FF a-zA-Z]{2,50}$/;

    if (!nameRegex.test(formData.firstName.trim())) {
      toast({ variant: "destructive", title: "اسم غير صحيح", description: "أدخل اسمك بالعربي أو الإنجليزي (2-50 حرف)" });
      return;
    }
    if (!phoneRegex.test(formData.phone.trim())) {
      toast({ variant: "destructive", title: "رقم هاتف غير صحيح", description: "أدخل أرقام فقط من 7 إلى 15 خانة" });
      return;
    }
    if (!emailRegex.test(formData.email.trim())) {
      toast({ variant: "destructive", title: "بريد إلكتروني غير صحيح", description: "مثال: example@gmail.com" });
      return;
    }
    if (!passwordRegex.test(formData.password)) {
      toast({ variant: "destructive", title: "كلمة مرور ضعيفة", description: "8 خانات على الأقل" });
      return;
    }
    // [SCR-960] ATOMIC VALIDATION: 8-char password is non-negotiable
    if (
      !formData.email.trim() ||
      (formData.password?.length || 0) < 8 ||
      !formData.firstName
    ) {
      toast({
        variant: "destructive",
        title: "بيانات ناقصة أو ضعيفة",
        description: "يجب إدخال الاسم والبريد وكلمة مرور من 8 خانات على الأقل.",
      });
      return;
    }

    setSubmitting(true);
    const result = await handleCheckPhone();

    if (result.success && !result.isReturningUser) {
      localStorage.setItem("tempEmail", formData.email);
      localStorage.setItem("tempPassword", formData.password);
      localStorage.setItem("tempPhone", formData.phone);
      localStorage.setItem("tempName", formData.firstName);
      localStorage.setItem("tempCallingCode", callingCode);
      localStorage.setItem("tempCountryCode", selectedCountry);
      const returnPath = searchParams.get("returnTo");
      const nextUrl = `/login-client?role=${formData.role}${returnPath ? `&returnTo=${encodeURIComponent(returnPath)}` : ""}`;
      router.push(nextUrl);
    }
    setSubmitting(false);
  };

  const goToTerms = () => {
    triggerHaptic('light');
    setRedirectingToTerms(true);
    localStorage.setItem("tempFirstName", formData.firstName);
    router.push("/terms?from=login");
  };

  if (returningUser) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
        dir={locale === "ar" ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <Logo />
            <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
            <p className="text-muted-foreground">{t("auth.login")}</p>
          </div>

          <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm text-center">
            <User className="mx-auto h-10 w-10 text-primary" />
            <h3 className="text-xl font-bold">
              {locale === "ar"
                ? `مرحباً بعودتك، ${returningUser.firstName}`
                : `Welcome back, ${returningUser.firstName}`}
            </h3>
            <Button
              className="w-full"
              onClick={handleReturningUserLogin}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : (locale === "ar" ? "دخول إلى حسابي" : "Login")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md space-y-3 ">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
          <p className="text-muted-foreground">{t("auth.signup")}</p>
        </div>
        <div className="text-center pt-3">
          <p className="text-xs text-muted-foreground">
            {locale === 'ar' ? 'هل تمتلك حساب بالفعل؟ ' : 'Do you already have an account?'}
            <button
              type="button"
              onClick={() => router.push(`/email-login?role=${formData.role}`)}
              // onClick={() => router.push('/{locale}/email-login')}
              className="text-primary underline font-bold hover:opacity-80"
            >
              {locale === 'ar' ? 'سجّل دخول من هنا' : 'Log in here'}
            </button>
          </p>
        </div>
        <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 text-center flex flex-col items-center gap-2 bg-primary/10 border-primary">
              {formData.role === "carrier" ? (
                <>
                  <Car className="h-8 w-8 text-primary" />
                  <span className="font-bold">{t("carrier.title")}</span>
                </>
              ) : formData.role === "agent" ? (
                <>
                  <ShieldCheck className="h-8 w-8 text-primary" />
                  <span className="font-bold">وكيل</span>
                </>
              ) : (
                <>
                  <User className="h-8 w-8 text-primary" />
                  <span className="font-bold">{t("traveler.title")}</span>
                </>
              )}
            </div>
            {/* phone */}
            <div className="space-y-2">
              <Label>{t("auth.phone")}</Label>
              <div className="flex rounded-md h-10 focus-within:ring-2 focus-within:ring-primary overflow-hidden border border-input" dir="rtl">
                <Input
                  type="tel"
                  inputMode="numeric"
                  className="border-0 rounded-none focus-visible:ring-0 text-left h-full"
                  placeholder="998xxxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  disabled={loading}
                />
                <div className="flex items-center px-2 bg-muted text-sm border-l border-r">+{callingCode}</div>
                <div className="min-w-[155px] bg-muted">
                  <Select
                    options={countries}
                    isSearchable
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder={locale === "ar" ? "الدولة" : "Country"}
                    value={countries.find((c) => c.value === selectedCountry)}
                    onChange={(selected: any) => {
                      setSelectedCountry(selected.value);
                      setCallingCode(selected.code);
                    }}
                    styles={{
                      control: (base) => ({
                        ...base,
                        border: "none",
                        boxShadow: "none",
                        minHeight: "40px",
                        background: "transparent"
                      }),
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      menu: (base) => ({ ...base, backgroundColor: "hsl(var(--card))" }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "hsl(var(--primary) / 0.1)" : "transparent",
                        color: "inherit",
                        cursor: "pointer"
                      }),
                      singleValue: (base) => ({ ...base, color: "inherit" }),
                      input: (base) => ({ ...base, color: "inherit" })
                    }}
                  />
                </div>
              </div>
            </div>
            {/* name */}
            <div className="space-y-2">
              <Label>{t("auth.name")}</Label>
              <Input
                type="text"
                placeholder="Your Name"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={loading}
              />
            </div>
            {/* email */}
            <div className="space-y-2">
              <Label>{t("auth.email")}</Label>
              <Input
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>
            {/* password */}
            <div className="space-y-2">
              <Label>{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8 characters min"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={loading}
                  className="pr-10"
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
            {/* checkbox */}
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-dashed border-primary/20">
              <Checkbox
                id="terms-check"
                checked={formData.agreed}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreed: Boolean(checked) }))}
              />
              <label htmlFor="terms-check" className="text-xs font-bold cursor-pointer">
                {locale === "ar" ? (
                  <>
                    أوافق على{" "}
                    <button
                      type="button"
                      disabled={redirectingToTerms}
                      onClick={goToTerms}
                      className="inline-flex items-center text-primary underline hover:opacity-80"
                    >
                      الميثاق السيادي (الشروط)
                      {redirectingToTerms && (
                        <Loader2 className="ml-1 h-3 w-3 animate-spin" />
                      )}
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
                      {redirectingToTerms && (
                        <Loader2 className="ml-1 h-3 w-3 animate-spin" />
                      )}
                    </button>
                  </>
                )}
              </label>
            </div>
            {/* buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                className="w-2/3 h-12 text-lg font-black"
                onClick={handleNext}
                disabled={submitting || !formData.phone || !formData.email || (formData.password?.length || 0) < 8 || !formData.firstName || !formData.agreed}
              >
                {submitting ? <Loader2 className="animate-spin" /> : t("common.next")}
              </Button>
              <Button
                variant="outline"
                className="w-1/3 h-12 font-bold"
                onClick={() => router.push("/")}
              >
                {t("common.back")}
              </Button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
