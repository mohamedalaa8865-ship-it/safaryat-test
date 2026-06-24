// // // // "use client";

// // // // import { useEffect, useState } from "react";
// // // // import { useSearchParams } from "next/navigation";
// // // // import { useRouter } from "@/i18n/routing";
// // // // import { useTranslations, useLocale } from "next-intl";

// // // // import { Button } from "@/components/ui/button";
// // // // import { Input } from "@/components/ui/input";
// // // // import { Label } from "@/components/ui/label";
// // // // import { Car, Eye, EyeOff, Loader2, Shield, Ship, User } from "lucide-react";

// // // // import { useLogin } from "@/hooks/use-login";
// // // // import { Logo } from "@/components/logo";
// // // // import { getCountries, getCountryCallingCode } from "react-phone-number-input";
// // // // import arNames from "react-phone-number-input/locale/ar";
// // // // import enNames from "react-phone-number-input/locale/en";

// // // // import Select from "react-select";

// // // // import { useToast } from "@/hooks/use-toast";
// // // // import { Checkbox } from "@/components/ui/checkbox";
// // // // import { triggerHaptic } from "@/lib/utils";

// // // // /**
// // // //  * @page LoginPhone
// // // //  * @description THE REINFORCED SOVEREIGN PORTAL (STERILIZED - V10.0 - SCR-960)
// // // //  * [SCR-960]: Conflict Resolution - Enforced 8-char password shield and terms sync.
// // // //  * Protocol 30: Dictatorship of the Token. Protocol 16: Sterilized.
// // // //  */
// // // // export default function LoginPhone() {
// // // //   const router = useRouter();
// // // //   const searchParams = useSearchParams();
// // // //   const t = useTranslations();
// // // //   const locale = useLocale();
// // // //   const { toast } = useToast();

// // // //   const [roleFromUrl, setRoleFromUrl] = useState<string | null>(null);
// // // //   const [submitting, setSubmitting] = useState(false);
// // // //   const [selectedCountry, setSelectedCountry] = useState("JO");
// // // //   const [callingCode, setCallingCode] = useState("962");
// // // //   const [redirectingToTerms, setRedirectingToTerms] = useState(false);
// // // //   const [showPassword, setShowPassword] = useState(false);
// // // //   const {
// // // //     loading,
// // // //     formData,
// // // //     setFormData,
// // // //     handleCheckPhone,
// // // //     returningUser,
// // // //     handleReturningUserLogin,
// // // //   } = useLogin();

// // // //   const countries = getCountries().map((country) => ({
// // // //     value: country,
// // // //     label: `${locale === "ar" ? arNames[country] : enNames[country]} (+${getCountryCallingCode(country)})`,
// // // //     code: getCountryCallingCode(country)
// // // //   }));

// // // //   useEffect(() => {
// // // //     // [SCR-952] NEURAL SYNC: Capturing the legal seal from local storage
// // // //     const agreed = localStorage.getItem("termsAgreed");
// // // //     if (agreed === "true") {
// // // //       setFormData((prev) => ({ ...prev, agreed: true }));
// // // //     }
// // // //   }, [setFormData]);

// // // //   useEffect(() => {
// // // //     const role = searchParams.get("role");
// // // //     // if (role === "carrier" || role === "traveler") {
// // // //     if (role === "carrier" || role === "traveler" || role === "agent") {
// // // //       setRoleFromUrl(role);
// // // //       setFormData((prev) => ({ ...prev, role }));
// // // //     } else {
// // // //       router.replace("/");
// // // //     }
// // // //   }, [searchParams, setFormData, router]);

// // // //   if (!roleFromUrl) return null;

// // // //   const handleNext = async () => {
// // // //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// // // //     const phoneRegex = /^\d{7,15}$/;
// // // //     const passwordRegex = /^.{8,}$/;
// // // //     const nameRegex = /^[\u0600-\u06FF a-zA-Z]{2,50}$/;

// // // //     if (!nameRegex.test(formData.firstName.trim())) {
// // // //       toast({ variant: "destructive", title: "اسم غير صحيح", description: "أدخل اسمك بالعربي أو الإنجليزي (2-50 حرف)" });
// // // //       return;
// // // //     }
// // // //     if (!phoneRegex.test(formData.phone.trim())) {
// // // //       toast({ variant: "destructive", title: "رقم هاتف غير صحيح", description: "أدخل أرقام فقط من 7 إلى 15 خانة" });
// // // //       return;
// // // //     }
// // // //     if (!emailRegex.test(formData.email.trim())) {
// // // //       toast({ variant: "destructive", title: "بريد إلكتروني غير صحيح", description: "مثال: example@gmail.com" });
// // // //       return;
// // // //     }
// // // //     if (!passwordRegex.test(formData.password)) {
// // // //       toast({ variant: "destructive", title: "كلمة مرور ضعيفة", description: "8 خانات على الأقل" });
// // // //       return;
// // // //     }
// // // //     // [SCR-960] ATOMIC VALIDATION: 8-char password is non-negotiable
// // // //     if (
// // // //       !formData.email.trim() ||
// // // //       (formData.password?.length || 0) < 8 ||
// // // //       !formData.firstName
// // // //     ) {
// // // //       toast({
// // // //         variant: "destructive",
// // // //         title: "بيانات ناقصة أو ضعيفة",
// // // //         description: "يجب إدخال الاسم والبريد وكلمة مرور من 8 خانات على الأقل.",
// // // //       });
// // // //       return;
// // // //     }

// // // //     setSubmitting(true);
// // // //     const result = await handleCheckPhone();

// // // //     if (result.success && !result.isReturningUser) {
// // // //       localStorage.setItem("tempEmail", formData.email);
// // // //       localStorage.setItem("tempPassword", formData.password);
// // // //       localStorage.setItem("tempPhone", formData.phone);
// // // //       localStorage.setItem("tempName", formData.firstName);
// // // //       localStorage.setItem("tempCallingCode", callingCode);
// // // //       localStorage.setItem("tempCountryCode", selectedCountry);
// // // //       const returnPath = searchParams.get("returnTo");
// // // //       const nextUrl = `/login-client?role=${formData.role}${returnPath ? `&returnTo=${encodeURIComponent(returnPath)}` : ""}`;
// // // //       router.push(nextUrl);
// // // //     }
// // // //     setSubmitting(false);
// // // //   };

// // // //   const goToTerms = () => {
// // // //     triggerHaptic('light');
// // // //     setRedirectingToTerms(true);
// // // //     localStorage.setItem("tempFirstName", formData.firstName);
// // // //     router.push("/terms?from=login");
// // // //   };

// // // //   if (returningUser) {
// // // //     return (
// // // //       <div
// // // //         className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
// // // //         dir={locale === "ar" ? "rtl" : "ltr"}
// // // //       >
// // // //         <div className="w-full max-w-md space-y-8">
// // // //           <div className="text-center">
// // // //             <Logo />
// // // //             <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
// // // //             <p className="text-muted-foreground">{t("auth.login")}</p>
// // // //           </div>

// // // //           <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm text-center">
// // // //             <User className="mx-auto h-10 w-10 text-primary" />
// // // //             <h3 className="text-xl font-bold">
// // // //               {locale === "ar"
// // // //                 ? `مرحباً بعودتك، ${returningUser.firstName}`
// // // //                 : `Welcome back, ${returningUser.firstName}`}
// // // //             </h3>
// // // //             <Button
// // // //               className="w-full"
// // // //               onClick={handleReturningUserLogin}
// // // //               disabled={loading}
// // // //             >
// // // //               {loading ? <Loader2 className="animate-spin" /> : (locale === "ar" ? "دخول إلى حسابي" : "Login")}
// // // //             </Button>
// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   return (
// // // //     <div
// // // //       className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
// // // //       dir={locale === "ar" ? "rtl" : "ltr"}
// // // //     >
// // // //       <div className="w-full max-w-md space-y-3 ">
// // // //         <div className="flex flex-col items-center text-center">
// // // //           <Logo />
// // // //           <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
// // // //           <p className="text-muted-foreground">{t("auth.signup")}</p>
// // // //         </div>
// // // //         <div className="text-center pt-3">
// // // //           <p className="text-xs text-muted-foreground">
// // // //             {locale === 'ar' ? 'هل تمتلك حساب بالفعل؟ ' : 'Do you already have an account?'}
// // // //             <button
// // // //               type="button"
// // // //               onClick={() => router.push(`/email-login?role=${formData.role}`)}
// // // //               // onClick={() => router.push('/{locale}/email-login')}
// // // //               className="text-primary underline font-bold hover:opacity-80"
// // // //             >
// // // //               {locale === 'ar' ? 'سجّل دخول من هنا' : 'Log in here'}
// // // //             </button>
// // // //           </p>
// // // //         </div>
// // // //         <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
// // // //           <div className="space-y-4">
// // // //             <div className="border rounded-lg p-4 text-center flex flex-col items-center gap-2 bg-primary/10 border-primary">
// // // //               {formData.role === "carrier" ? (
// // // //                 <>
// // // //                   <Car className="h-8 w-8 text-primary" />
// // // //                   <span className="font-bold">{t("carrier.title")}</span>
// // // //                 </>
// // // //               ) : formData.role === "traveler" ? (
// // // //                 <>
// // // //                   <User className="h-8 w-8 text-primary" />
// // // //                   <span className="font-bold">{t("traveler.title")}</span>
// // // //                 </>
// // // //               )
// // // //                 :
// // // //                 (<>
// // // //                   <Shield className="h-8 w-8 text-primary" />
// // // //                   <span className="font-bold">{t("agent.title")}</span>
// // // //                 </>)
// // // //               }
// // // //             </div>
// // // //             {/* phone */}
// // // //             <div className="space-y-2">
// // // //               <Label>{t("auth.phone")}</Label>
// // // //               <div className="flex rounded-md h-10 focus-within:ring-2 focus-within:ring-primary overflow-hidden border border-input" dir="rtl">
// // // //                 <Input
// // // //                   type="tel"
// // // //                   inputMode="numeric"
// // // //                   className="border-0 rounded-none focus-visible:ring-0 text-left h-full"
// // // //                   placeholder="998xxxxx"
// // // //                   value={formData.phone}
// // // //                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// // // //                   disabled={loading}
// // // //                 />
// // // //                 <div className="flex items-center px-2 bg-muted text-sm border-l border-r">+{callingCode}</div>
// // // //                 <div className="min-w-[155px] bg-muted">
// // // //                   <Select
// // // //                     options={countries}
// // // //                     isSearchable
// // // //                     menuPortalTarget={document.body}
// // // //                     menuPosition="fixed"
// // // //                     className="react-select-container"
// // // //                     classNamePrefix="react-select"
// // // //                     placeholder={locale === "ar" ? "الدولة" : "Country"}
// // // //                     value={countries.find((c) => c.value === selectedCountry)}
// // // //                     onChange={(selected: any) => {
// // // //                       setSelectedCountry(selected.value);
// // // //                       setCallingCode(selected.code);
// // // //                     }}
// // // //                     styles={{
// // // //                       control: (base) => ({
// // // //                         ...base,
// // // //                         border: "none",
// // // //                         boxShadow: "none",
// // // //                         minHeight: "40px",
// // // //                         background: "transparent"
// // // //                       }),
// // // //                       menuPortal: (base) => ({ ...base, zIndex: 9999 }),
// // // //                       menu: (base) => ({ ...base, backgroundColor: "hsl(var(--card))" }),
// // // //                       option: (base, state) => ({
// // // //                         ...base,
// // // //                         backgroundColor: state.isFocused ? "hsl(var(--primary) / 0.1)" : "transparent",
// // // //                         color: "inherit",
// // // //                         cursor: "pointer"
// // // //                       }),
// // // //                       singleValue: (base) => ({ ...base, color: "inherit" }),
// // // //                       input: (base) => ({ ...base, color: "inherit" })
// // // //                     }}
// // // //                   />
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //             {/* name */}
// // // //             <div className="space-y-2">
// // // //               <Label>{t("auth.name")}</Label>
// // // //               <Input
// // // //                 type="text"
// // // //                 placeholder="Your Name"
// // // //                 value={formData.firstName}
// // // //                 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
// // // //                 disabled={loading}
// // // //               />
// // // //             </div>
// // // //             {/* email */}
// // // //             <div className="space-y-2">
// // // //               <Label>{t("auth.email")}</Label>
// // // //               <Input
// // // //                 type="email"
// // // //                 placeholder="example@gmail.com"
// // // //                 value={formData.email}
// // // //                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// // // //                 disabled={loading}
// // // //               />
// // // //             </div>
// // // //             {/* password */}
// // // //             <div className="space-y-2">
// // // //               <Label>{t("auth.password")}</Label>
// // // //               <div className="relative">
// // // //                 <Input
// // // //                   type={showPassword ? 'text' : 'password'}
// // // //                   placeholder="8 characters min"
// // // //                   value={formData.password}
// // // //                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// // // //                   disabled={loading}
// // // //                   className="pr-10"
// // // //                 />
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={() => setShowPassword(p => !p)}
// // // //                   className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
// // // //                 >
// // // //                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
// // // //                 </button>
// // // //               </div>
// // // //             </div>
// // // //             {/* checkbox */}
// // // //             <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-dashed border-primary/20">
// // // //               <Checkbox
// // // //                 id="terms-check"
// // // //                 checked={formData.agreed}
// // // //                 onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreed: Boolean(checked) }))}
// // // //               />
// // // //               <label htmlFor="terms-check" className="text-xs font-bold cursor-pointer">
// // // //                 {locale === "ar" ? (
// // // //                   <>
// // // //                     أوافق على{" "}
// // // //                     <button
// // // //                       type="button"
// // // //                       disabled={redirectingToTerms}
// // // //                       onClick={goToTerms}
// // // //                       className="inline-flex items-center text-primary underline hover:opacity-80"
// // // //                     >
// // // //                       الميثاق السيادي (الشروط)
// // // //                       {redirectingToTerms && (
// // // //                         <Loader2 className="ml-1 h-3 w-3 animate-spin" />
// // // //                       )}
// // // //                     </button>
// // // //                   </>
// // // //                 ) : (
// // // //                   <>
// // // //                     I agree to the{" "}
// // // //                     <button
// // // //                       type="button"
// // // //                       disabled={redirectingToTerms}
// // // //                       onClick={goToTerms}
// // // //                       className="inline-flex items-center text-primary underline hover:opacity-80"
// // // //                     >
// // // //                       Sovereign Constitution
// // // //                       {redirectingToTerms && (
// // // //                         <Loader2 className="ml-1 h-3 w-3 animate-spin" />
// // // //                       )}
// // // //                     </button>
// // // //                   </>
// // // //                 )}
// // // //               </label>
// // // //             </div>
// // // //             {/* buttons */}
// // // //             <div className="flex gap-2 pt-2">
// // // //               <Button
// // // //                 className="w-2/3 h-12 text-lg font-black"
// // // //                 onClick={handleNext}
// // // //                 disabled={submitting || !formData.phone || !formData.email || (formData.password?.length || 0) < 8 || !formData.firstName || !formData.agreed}
// // // //               >
// // // //                 {submitting ? <Loader2 className="animate-spin" /> : t("common.next")}
// // // //               </Button>
// // // //               <Button
// // // //                 variant="outline"
// // // //                 className="w-1/3 h-12 font-bold"
// // // //                 onClick={() => router.push("/")}
// // // //               >
// // // //                 {t("common.back")}
// // // //               </Button>
// // // //             </div>

// // // //           </div>
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import { useSearchParams } from "next/navigation";
// // // import { useRouter } from "@/i18n/routing";
// // // import { useTranslations, useLocale } from "next-intl";

// // // import { Button } from "@/components/ui/button";
// // // import { Input } from "@/components/ui/input";
// // // import { Label } from "@/components/ui/label";
// // // import { Car, Eye, EyeOff, Loader2, Ship, User, ShieldCheck } from "lucide-react";

// // // import { useLogin } from "@/hooks/use-login";
// // // import { Logo } from "@/components/logo";
// // // import { getCountries, getCountryCallingCode } from "react-phone-number-input";
// // // import arNames from "react-phone-number-input/locale/ar";
// // // import enNames from "react-phone-number-input/locale/en";

// // // import Select from "react-select";

// // // import { useToast } from "@/hooks/use-toast";
// // // import { Checkbox } from "@/components/ui/checkbox";
// // // import { triggerHaptic } from "@/lib/utils";

// // // /**
// // //  * @page LoginPhone
// // //  * @description THE REINFORCED SOVEREIGN PORTAL (STERILIZED - V10.0 - SCR-960)
// // //  * [SCR-960]: Conflict Resolution - Enforced 8-char password shield and terms sync.
// // //  * Protocol 30: Dictatorship of the Token. Protocol 16: Sterilized.
// // //  */
// // // export default function LoginPhone() {
// // //   const router = useRouter();
// // //   const searchParams = useSearchParams();
// // //   const t = useTranslations();
// // //   const locale = useLocale();
// // //   const { toast } = useToast();

// // //   const [roleFromUrl, setRoleFromUrl] = useState<string | null>(null);
// // //   const [submitting, setSubmitting] = useState(false);
// // //   const [selectedCountry, setSelectedCountry] = useState("JO");
// // //   const [callingCode, setCallingCode] = useState("962");
// // //   const [redirectingToTerms, setRedirectingToTerms] = useState(false);
// // //   const [showPassword, setShowPassword] = useState(false);
// // //   const {
// // //     loading,
// // //     formData,
// // //     setFormData,
// // //     handleCheckPhone,
// // //     returningUser,
// // //     handleReturningUserLogin,
// // //   } = useLogin();

// // //   const countries = getCountries().map((country) => ({
// // //     value: country,
// // //     label: `${locale === "ar" ? arNames[country] : enNames[country]} (+${getCountryCallingCode(country)})`,
// // //     code: getCountryCallingCode(country)
// // //   }));

// // //   useEffect(() => {
// // //     // [SCR-952] NEURAL SYNC: Capturing the legal seal from local storage
// // //     const agreed = localStorage.getItem("termsAgreed");
// // //     if (agreed === "true") {
// // //       setFormData((prev) => ({ ...prev, agreed: true }));
// // //     }
// // //   }, [setFormData]);

// // //   useEffect(() => {
// // //     const role = searchParams.get("role");
// // //     // if (role === "carrier" || role === "traveler" || role === "agent") {
// // //     //   setRoleFromUrl(role);
// // //     //   setFormData((prev) => ({ ...prev, role }));
// // //     // } else {
// // //     //   router.replace("/");
// // //     // }
// // //     if (role === "carrier" || role === "traveler" || role === "agent") {
// // //       setRoleFromUrl(role);
// // //       setFormData((prev) => ({ ...prev, role }));
// // //     } else {
// // //       router.replace("/");
// // //     }
// // //   }, [searchParams, setFormData, router]);

// // //   if (!roleFromUrl) return null;

// // //   const handleNext = async () => {
// // //     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// // //     const phoneRegex = /^\d{7,15}$/;
// // //     const passwordRegex = /^.{8,}$/;
// // //     const nameRegex = /^[\u0600-\u06FF a-zA-Z]{2,50}$/;

// // //     if (!nameRegex.test(formData.firstName.trim())) {
// // //       toast({ variant: "destructive", title: "اسم غير صحيح", description: "أدخل اسمك بالعربي أو الإنجليزي (2-50 حرف)" });
// // //       return;
// // //     }
// // //     if (!phoneRegex.test(formData.phone.trim())) {
// // //       toast({ variant: "destructive", title: "رقم هاتف غير صحيح", description: "أدخل أرقام فقط من 7 إلى 15 خانة" });
// // //       return;
// // //     }
// // //     if (!emailRegex.test(formData.email.trim())) {
// // //       toast({ variant: "destructive", title: "بريد إلكتروني غير صحيح", description: "مثال: example@gmail.com" });
// // //       return;
// // //     }
// // //     if (!passwordRegex.test(formData.password)) {
// // //       toast({ variant: "destructive", title: "كلمة مرور ضعيفة", description: "8 خانات على الأقل" });
// // //       return;
// // //     }
// // //     // [SCR-960] ATOMIC VALIDATION: 8-char password is non-negotiable
// // //     if (
// // //       !formData.email.trim() ||
// // //       (formData.password?.length || 0) < 8 ||
// // //       !formData.firstName
// // //     ) {
// // //       toast({
// // //         variant: "destructive",
// // //         title: "بيانات ناقصة أو ضعيفة",
// // //         description: "يجب إدخال الاسم والبريد وكلمة مرور من 8 خانات على الأقل.",
// // //       });
// // //       return;
// // //     }

// // //     setSubmitting(true);
// // //     const result = await handleCheckPhone();

// // //     if (result.success && !result.isReturningUser) {
// // //       localStorage.setItem("tempEmail", formData.email);
// // //       localStorage.setItem("tempPassword", formData.password);
// // //       localStorage.setItem("tempPhone", formData.phone);
// // //       localStorage.setItem("tempName", formData.firstName);
// // //       localStorage.setItem("tempCallingCode", callingCode);
// // //       localStorage.setItem("tempCountryCode", selectedCountry);
// // //       const returnPath = searchParams.get("returnTo");
// // //       const nextUrl = `/login-client?role=${formData.role}${returnPath ? `&returnTo=${encodeURIComponent(returnPath)}` : ""}`;
// // //       router.push(nextUrl);
// // //     }
// // //     setSubmitting(false);
// // //   };

// // //   const goToTerms = () => {
// // //     triggerHaptic('light');
// // //     setRedirectingToTerms(true);
// // //     localStorage.setItem("tempFirstName", formData.firstName);
// // //     router.push("/terms?from=login");
// // //   };

// // //   if (returningUser) {
// // //     return (
// // //       <div
// // //         className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
// // //         dir={locale === "ar" ? "rtl" : "ltr"}
// // //       >
// // //         <div className="w-full max-w-md space-y-8">
// // //           <div className="text-center">
// // //             <Logo />
// // //             <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
// // //             <p className="text-muted-foreground">{t("auth.login")}</p>
// // //           </div>

// // //           <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm text-center">
// // //             <User className="mx-auto h-10 w-10 text-primary" />
// // //             <h3 className="text-xl font-bold">
// // //               {locale === "ar"
// // //                 ? `مرحباً بعودتك، ${returningUser.firstName}`
// // //                 : `Welcome back, ${returningUser.firstName}`}
// // //             </h3>
// // //             <Button
// // //               className="w-full"
// // //               onClick={handleReturningUserLogin}
// // //               disabled={loading}
// // //             >
// // //               {loading ? <Loader2 className="animate-spin" /> : (locale === "ar" ? "دخول إلى حسابي" : "Login")}
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div
// // //       className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
// // //       dir={locale === "ar" ? "rtl" : "ltr"}
// // //     >
// // //       <div className="w-full max-w-md space-y-3 ">
// // //         <div className="flex flex-col items-center text-center">
// // //           <Logo />
// // //           <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
// // //           <p className="text-muted-foreground">{t("auth.signup")}</p>
// // //         </div>
// // //         <div className="text-center pt-3">
// // //           <p className="text-xs text-muted-foreground">
// // //             {locale === 'ar' ? 'هل تمتلك حساب بالفعل؟ ' : 'Do you already have an account?'}
// // //             <button
// // //               type="button"
// // //               onClick={() => router.push(`/email-login?role=${formData.role}`)}
// // //               // onClick={() => router.push('/{locale}/email-login')}
// // //               className="text-primary underline font-bold hover:opacity-80"
// // //             >
// // //               {locale === 'ar' ? 'سجّل دخول من هنا' : 'Log in here'}
// // //             </button>
// // //           </p>
// // //         </div>
// // //         <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
// // //           <div className="space-y-4">
// // //             <div className="border rounded-lg p-4 text-center flex flex-col items-center gap-2 bg-primary/10 border-primary">
// // //               {formData.role === "carrier" ? (
// // //                 <>
// // //                   <Car className="h-8 w-8 text-primary" />
// // //                   <span className="font-bold">{t("carrier.title")}</span>
// // //                 </>
// // //               ) : formData.role === "agent" ? (
// // //                 <>
// // //                   <ShieldCheck className="h-8 w-8 text-primary" />
// // //                   <span className="font-bold">{t('agent.title')}</span>
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <User className="h-8 w-8 text-primary" />
// // //                   <span className="font-bold">{t("traveler.title")}</span>
// // //                 </>
// // //               )}
// // //             </div>
// // //             {/* phone */}
// // //             <div className="space-y-2">
// // //               <Label>{t("auth.phone")}</Label>
// // //               <div className="flex rounded-md h-10 focus-within:ring-2 focus-within:ring-primary overflow-hidden border border-input" dir="rtl">
// // //                 <Input
// // //                   type="tel"
// // //                   inputMode="numeric"
// // //                   className="border-0 rounded-none focus-visible:ring-0 text-left h-full"
// // //                   placeholder="998xxxxx"
// // //                   value={formData.phone}
// // //                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// // //                   disabled={loading}
// // //                 />
// // //                 <div className="flex items-center px-2 bg-muted text-sm border-l border-r">+{callingCode}</div>
// // //                 <div className="min-w-[155px] bg-muted">
// // //                   <Select
// // //                     options={countries}
// // //                     isSearchable
// // //                     menuPortalTarget={document.body}
// // //                     menuPosition="fixed"
// // //                     className="react-select-container"
// // //                     classNamePrefix="react-select"
// // //                     placeholder={locale === "ar" ? "الدولة" : "Country"}
// // //                     value={countries.find((c) => c.value === selectedCountry)}
// // //                     onChange={(selected: any) => {
// // //                       setSelectedCountry(selected.value);
// // //                       setCallingCode(selected.code);
// // //                     }}
// // //                     styles={{
// // //                       control: (base) => ({
// // //                         ...base,
// // //                         border: "none",
// // //                         boxShadow: "none",
// // //                         minHeight: "40px",
// // //                         background: "transparent"
// // //                       }),
// // //                       menuPortal: (base) => ({ ...base, zIndex: 9999 }),
// // //                       menu: (base) => ({ ...base, backgroundColor: "hsl(var(--card))" }),
// // //                       option: (base, state) => ({
// // //                         ...base,
// // //                         backgroundColor: state.isFocused ? "hsl(var(--primary) / 0.1)" : "transparent",
// // //                         color: "inherit",
// // //                         cursor: "pointer"
// // //                       }),
// // //                       singleValue: (base) => ({ ...base, color: "inherit" }),
// // //                       input: (base) => ({ ...base, color: "inherit" })
// // //                     }}
// // //                   />
// // //                 </div>
// // //               </div>
// // //             </div>
// // //             {/* name */}
// // //             <div className="space-y-2">
// // //               <Label>{t("auth.name")}</Label>
// // //               <Input
// // //                 type="text"
// // //                 placeholder="Your Name"
// // //                 value={formData.firstName}
// // //                 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
// // //                 disabled={loading}
// // //               />
// // //             </div>
// // //             {/* email */}
// // //             <div className="space-y-2">
// // //               <Label>{t("auth.email")}</Label>
// // //               <Input
// // //                 type="email"
// // //                 placeholder="example@gmail.com"
// // //                 value={formData.email}
// // //                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// // //                 disabled={loading}
// // //               />
// // //             </div>
// // //             {/* password */}
// // //             <div className="space-y-2">
// // //               <Label>{t("auth.password")}</Label>
// // //               <div className="relative">
// // //                 <Input
// // //                   type={showPassword ? 'text' : 'password'}
// // //                   placeholder="8 characters min"
// // //                   value={formData.password}
// // //                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// // //                   disabled={loading}
// // //                   className="pr-10"
// // //                 />
// // //                 <button
// // //                   type="button"
// // //                   onClick={() => setShowPassword(p => !p)}
// // //                   className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
// // //                 >
// // //                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
// // //                 </button>
// // //               </div>
// // //             </div>
// // //             {/* checkbox */}
// // //             <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-dashed border-primary/20">
// // //               <Checkbox
// // //                 id="terms-check"
// // //                 checked={formData.agreed}
// // //                 onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreed: Boolean(checked) }))}
// // //               />
// // //               <label htmlFor="terms-check" className="text-xs font-bold cursor-pointer">
// // //                 {locale === "ar" ? (
// // //                   <>
// // //                     أوافق على{" "}
// // //                     <button
// // //                       type="button"
// // //                       disabled={redirectingToTerms}
// // //                       onClick={goToTerms}
// // //                       className="inline-flex items-center text-primary underline hover:opacity-80"
// // //                     >
// // //                       الميثاق السيادي (الشروط)
// // //                       {redirectingToTerms && (
// // //                         <Loader2 className="ml-1 h-3 w-3 animate-spin" />
// // //                       )}
// // //                     </button>
// // //                   </>
// // //                 ) : (
// // //                   <>
// // //                     I agree to the{" "}
// // //                     <button
// // //                       type="button"
// // //                       disabled={redirectingToTerms}
// // //                       onClick={goToTerms}
// // //                       className="inline-flex items-center text-primary underline hover:opacity-80"
// // //                     >
// // //                       Sovereign Constitution
// // //                       {redirectingToTerms && (
// // //                         <Loader2 className="ml-1 h-3 w-3 animate-spin" />
// // //                       )}
// // //                     </button>
// // //                   </>
// // //                 )}
// // //               </label>
// // //             </div>
// // //             {/* buttons */}
// // //             <div className="flex gap-2 pt-2">
// // //               <Button
// // //                 className="w-2/3 h-12 text-lg font-black"
// // //                 onClick={handleNext}
// // //                 disabled={submitting || !formData.phone || !formData.email || (formData.password?.length || 0) < 8 || !formData.firstName || !formData.agreed}
// // //               >
// // //                 {submitting ? <Loader2 className="animate-spin" /> : t("common.next")}
// // //               </Button>
// // //               <Button
// // //                 variant="outline"
// // //                 className="w-1/3 h-12 font-bold"
// // //                 onClick={() => router.push("/")}
// // //               >
// // //                 {t("common.back")}
// // //               </Button>
// // //             </div>

// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // "use client";

// // import { useEffect, useState } from "react";
// // import { useSearchParams } from "next/navigation";
// // import { useRouter } from "@/i18n/routing";
// // import { useTranslations, useLocale } from "next-intl";

// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { Car, Eye, EyeOff, Loader2, Ship, User, ShieldCheck } from "lucide-react";

// // import { useLogin } from "@/hooks/use-login";
// // import { Logo } from "@/components/logo";
// // import { getCountries, getCountryCallingCode, isValidPhoneNumber } from "react-phone-number-input";
// // import arNames from "react-phone-number-input/locale/ar";
// // import enNames from "react-phone-number-input/locale/en";

// // import Select from "react-select";
// // import { useToast } from "@/hooks/use-toast";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import { triggerHaptic } from "@/lib/utils";

// // /**
// //  * @page LoginPhone
// //  * @description THE REINFORCED SOVEREIGN PORTAL (STERILIZED - V10.0 - SCR-960)
// //  * [SCR-960]: Conflict Resolution - Enforced 8-char password shield and terms sync.
// //  * Protocol 30: Dictatorship of the Token. Protocol 16: Sterilized.
// //  */
// // export default function LoginPhone() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const t = useTranslations();
// //   const locale = useLocale();
// //   const { toast } = useToast();

// //   const [roleFromUrl, setRoleFromUrl] = useState<string | null>(null);
// //   const [submitting, setSubmitting] = useState(false);
// //   const [selectedCountry, setSelectedCountry] = useState("JO");
// //   const [callingCode, setCallingCode] = useState("962");
// //   const [redirectingToTerms, setRedirectingToTerms] = useState(false);
// //   const [showPassword, setShowPassword] = useState(false);
// //   const {
// //     loading,
// //     formData,
// //     setFormData,
// //     handleCheckPhone,
// //     returningUser,
// //     handleReturningUserLogin,
// //   } = useLogin();

// //   const countries = getCountries().map((country) => ({
// //     value: country,
// //     label: `${locale === "ar" ? arNames[country] : enNames[country]} (+${getCountryCallingCode(country)})`,
// //     code: getCountryCallingCode(country)
// //   }));

// //   useEffect(() => {
// //     // [SCR-952] NEURAL SYNC: Capturing the legal seal from local storage
// //     const agreed = localStorage.getItem("termsAgreed");
// //     if (agreed === "true") {
// //       setFormData((prev) => ({ ...prev, agreed: true }));
// //     }
// //   }, [setFormData]);

// //   useEffect(() => {
// //     const role = searchParams.get("role");
// //     // if (role === "carrier" || role === "traveler" || role === "agent") {
// //     //   setRoleFromUrl(role);
// //     //   setFormData((prev) => ({ ...prev, role }));
// //     // } else {
// //     //   router.replace("/");
// //     // }
// //     if (role === "carrier" || role === "traveler" || role === "agent") {
// //       setRoleFromUrl(role);
// //       setFormData((prev) => ({ ...prev, role }));
// //     } else {
// //       router.replace("/");
// //     }
// //   }, [searchParams, setFormData, router]);

// //   if (!roleFromUrl) return null;

// //   // const handleNext = async () => {
// //   //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// //   //   const phoneRegex = /^\d{7,15}$/;
// //   //   const passwordRegex = /^.{8,}$/;
// //   //   const nameRegex = /^[\u0600-\u06FF a-zA-Z]{2,50}$/;

// //   //   if (!nameRegex.test(formData.firstName.trim())) {
// //   //     toast({ variant: "destructive", title: "اسم غير صحيح", description: "أدخل اسمك بالعربي أو الإنجليزي (2-50 حرف)" });
// //   //     return;
// //   //   }
// //   //   if (!phoneRegex.test(formData.phone.trim())) {
// //   //     toast({ variant: "destructive", title: "رقم هاتف غير صحيح", description: "أدخل أرقام فقط من 7 إلى 15 خانة" });
// //   //     return;
// //   //   }
// //   //   if (!emailRegex.test(formData.email.trim())) {
// //   //     toast({ variant: "destructive", title: "بريد إلكتروني غير صحيح", description: "مثال: example@gmail.com" });
// //   //     return;
// //   //   }
// //   //   if (!passwordRegex.test(formData.password)) {
// //   //     toast({ variant: "destructive", title: "كلمة مرور ضعيفة", description: "8 خانات على الأقل" });
// //   //     return;
// //   //   }
// //   //   // [SCR-960] ATOMIC VALIDATION: 8-char password is non-negotiable
// //   //   if (
// //   //     !formData.email.trim() ||
// //   //     (formData.password?.length || 0) < 8 ||
// //   //     !formData.firstName
// //   //   ) {
// //   //     toast({
// //   //       variant: "destructive",
// //   //       title: "بيانات ناقصة أو ضعيفة",
// //   //       description: "يجب إدخال الاسم والبريد وكلمة مرور من 8 خانات على الأقل.",
// //   //     });
// //   //     return;
// //   //   }

// //   //   setSubmitting(true);
// //   //   const result = await handleCheckPhone();

// //   //   if (result.success && !result.isReturningUser) {
// //   //     localStorage.setItem("tempEmail", formData.email);
// //   //     localStorage.setItem("tempPassword", formData.password);
// //   //     localStorage.setItem("tempPhone", formData.phone);
// //   //     localStorage.setItem("tempName", formData.firstName);
// //   //     localStorage.setItem("tempCallingCode", callingCode);
// //   //     localStorage.setItem("tempCountryCode", selectedCountry);
// //   //     const returnPath = searchParams.get("returnTo");
// //   //     const nextUrl = `/login-client?role=${formData.role}${returnPath ? `&returnTo=${encodeURIComponent(returnPath)}` : ""}`;
// //   //     router.push(nextUrl);
// //   //   }
// //   //   setSubmitting(false);
// //   // };

// //   // const handleNext = async () => {
// //   //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// //   //   // يقبل الأرقام الإنجليزية (0-9) والأرقام العربية (٠-٩) ويشترط أن يكون طولها 9 بالضبط
// //   //   const phoneRegex = /^[0-9\u0660-\u0669]{9}$/;
// //   //   const passwordRegex = /^.{8,}$/;
// //   //   // يقبل الحروف العربية والإنجليزية والمسافات والنقطة والشرطة السفلية
// //   //   const nameRegex = /^[\u0600-\u06FF a-zA-Z._]{2,50}$/;

// //   //   if (!nameRegex.test(formData.firstName.trim())) {
// //   //     toast({ variant: "destructive", title: t("errors.invalidNameTitle"), description: t("errors.invalidNameDesc") });
// //   //     return;
// //   //   }
// //   //   if (!phoneRegex.test(formData.phone.trim())) {
// //   //     toast({ variant: "destructive", title: t("errors.invalidPhoneTitle"), description: t("errors.invalidPhoneDesc") });
// //   //     return;
// //   //   }
// //   //   if (!emailRegex.test(formData.email.trim())) {
// //   //     toast({ variant: "destructive", title: t("errors.invalidEmailTitle"), description: t("errors.invalidEmailDesc") });
// //   //     return;
// //   //   }
// //   //   if (!passwordRegex.test(formData.password)) {
// //   //     toast({ variant: "destructive", title: t("errors.weakPasswordTitle"), description: t("errors.weakPasswordDesc") });
// //   //     return;
// //   //   }

// //   //   // [SCR-960] ATOMIC VALIDATION: 8-char password is non-negotiable
// //   //   if (
// //   //     !formData.email.trim() ||
// //   //     (formData.password?.length || 0) < 8 ||
// //   //     !formData.firstName
// //   //   ) {
// //   //     toast({
// //   //       variant: "destructive",
// //   //       title: t("errors.incompleteDataTitle"),
// //   //       description: t("errors.incompleteDataDesc"),
// //   //     });
// //   //     return;
// //   //   }

// //   //   setSubmitting(true);
// //   //   const result = await handleCheckPhone();

// //   //   if (result.success && !result.isReturningUser) {
// //   //     // تحويل الأرقام العربية إلى إنجليزية لتجنب مشاكل الباك اند
// //   //     // const normalizedPhone = formData.phone.trim().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d));
// //   //     const normalizedPhone = formData.phone.trim().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
// //   //     localStorage.setItem("tempEmail", formData.email);
// //   //     localStorage.setItem("tempPassword", formData.password);
// //   //     localStorage.setItem("tempPhone", normalizedPhone); // استخدام الرقم المحول
// //   //     localStorage.setItem("tempName", formData.firstName);
// //   //     localStorage.setItem("tempCallingCode", callingCode);
// //   //     localStorage.setItem("tempCountryCode", selectedCountry);

// //   //     const returnPath = searchParams.get("returnTo");
// //   //     const nextUrl = `/login-client?role=${formData.role}${returnPath ? `&returnTo=${encodeURIComponent(returnPath)}` : ""}`;
// //   //     router.push(nextUrl);
// //   //   }
// //   //   else if (!result.success) {
// //   //     // معالجة الأخطاء القادمة من الباك اند (الاسم موجود أو الايميل موجود)
// //   //     if (result.errorCode === 'EMAIL_EXISTS' || result.message?.toLowerCase().includes('email')) {
// //   //       toast({
// //   //         variant: "destructive",
// //   //         title: t("errors.emailExistsTitle"),
// //   //         description: t("errors.emailExistsDesc")
// //   //       });
// //   //     } else if (result.errorCode === 'NAME_EXISTS' || result.message?.toLowerCase().includes('name')) {
// //   //       toast({
// //   //         variant: "destructive",
// //   //         title: t("errors.nameExistsTitle"),
// //   //         description: t("errors.nameExistsDesc")
// //   //       });
// //   //     } else {
// //   //       toast({
// //   //         variant: "destructive",
// //   //         title: t("errors.generalErrorTitle"),
// //   //         description: result.message || t("errors.generalErrorDesc")
// //   //       });
// //   //     }
// //   //   }

// //   //   setSubmitting(false);
// //   // };

// //   const goToTerms = () => {
// //     triggerHaptic('light');
// //     setRedirectingToTerms(true);
// //     localStorage.setItem("tempFirstName", formData.firstName);
// //     router.push("/terms?from=login");
// //   };

// //   if (returningUser) {
// //     return (
// //       <div
// //         className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
// //         dir={locale === "ar" ? "rtl" : "ltr"}
// //       >
// //         <div className="w-full max-w-md space-y-8">
// //           <div className="text-center">
// //             <Logo />
// //             <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
// //             <p className="text-muted-foreground">{t("auth.login")}</p>
// //           </div>

// //           <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm text-center">
// //             <User className="mx-auto h-10 w-10 text-primary" />
// //             <h3 className="text-xl font-bold">
// //               {locale === "ar"
// //                 ? `مرحباً بعودتك، ${returningUser.firstName}`
// //                 : `Welcome back, ${returningUser.firstName}`}
// //             </h3>
// //             <Button
// //               className="w-full"
// //               onClick={handleReturningUserLogin}
// //               disabled={loading}
// //             >
// //               {loading ? <Loader2 className="animate-spin" /> : (locale === "ar" ? "دخول إلى حسابي" : "Login")}
// //             </Button>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div
// //       className="flex min-h-screen flex-col items-center justify-center p-4 bg-background"
// //       dir={locale === "ar" ? "rtl" : "ltr"}
// //     >
// //       <div className="w-full max-w-md space-y-3 ">
// //         <div className="flex flex-col items-center text-center">
// //           <Logo />
// //           <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
// //           <p className="text-muted-foreground">{t("auth.signup")}</p>
// //         </div>
// //         <div className="text-center pt-3">
// //           <p className="text-xs text-muted-foreground">
// //             {locale === 'ar' ? 'هل تمتلك حساب بالفعل؟ ' : 'Do you already have an account?'}
// //             <button
// //               type="button"
// //               onClick={() => router.push(`/email-login?role=${formData.role}`)}
// //               // onClick={() => router.push('/{locale}/email-login')}
// //               className="text-primary underline font-bold hover:opacity-80"
// //             >
// //               {locale === 'ar' ? 'سجّل دخول من هنا' : 'Log in here'}
// //             </button>
// //           </p>
// //         </div>
// //         <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
// //           <div className="space-y-4">
// //             <div className="border rounded-lg p-4 text-center flex flex-col items-center gap-2 bg-primary/10 border-primary">
// //               {formData.role === "carrier" ? (
// //                 <>
// //                   <Car className="h-8 w-8 text-primary" />
// //                   <span className="font-bold">{t("carrier.title")}</span>
// //                 </>
// //               ) : formData.role === "agent" ? (
// //                 <>
// //                   <ShieldCheck className="h-8 w-8 text-primary" />
// //                   <span className="font-bold">{t('agent.title')}</span>
// //                 </>
// //               ) : (
// //                 <>
// //                   <User className="h-8 w-8 text-primary" />
// //                   <span className="font-bold">{t("traveler.title")}</span>
// //                 </>
// //               )}
// //             </div>
// //             {/* phone */}
// //             <div className="space-y-2">
// //               <Label>{t("auth.phone")}</Label>
// //               <div className="flex rounded-md h-10 focus-within:ring-2 focus-within:ring-primary overflow-hidden border border-input" dir="rtl">
// //                 <Input
// //                   type="tel"
// //                   inputMode="numeric"
// //                   className="border-0 rounded-none focus-visible:ring-0 text-left h-full"
// //                   placeholder="998xxxxx"
// //                   value={formData.phone}
// //                   onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
// //                   disabled={loading}
// //                 />
// //                 <div className="flex items-center px-2 bg-muted text-sm border-l border-r">+{callingCode}</div>
// //                 <div className="min-w-[155px] bg-muted">
// //                   <Select
// //                     options={countries}
// //                     isSearchable
// //                     menuPortalTarget={document.body}
// //                     menuPosition="fixed"
// //                     className="react-select-container"
// //                     classNamePrefix="react-select"
// //                     placeholder={locale === "ar" ? "الدولة" : "Country"}
// //                     value={countries.find((c) => c.value === selectedCountry)}
// //                     onChange={(selected: any) => {
// //                       setSelectedCountry(selected.value);
// //                       setCallingCode(selected.code);
// //                       setFormData((prev: any) => ({ ...prev, phoneCountryCode: selected.code }));
// //                     }}
// //                     styles={{
// //                       control: (base) => ({
// //                         ...base,
// //                         border: "none",
// //                         boxShadow: "none",
// //                         minHeight: "40px",
// //                         background: "transparent"
// //                       }),
// //                       menuPortal: (base) => ({ ...base, zIndex: 9999 }),
// //                       menu: (base) => ({ ...base, backgroundColor: "hsl(var(--card))" }),
// //                       option: (base, state) => ({
// //                         ...base,
// //                         backgroundColor: state.isFocused ? "hsl(var(--primary) / 0.1)" : "transparent",
// //                         color: "inherit",
// //                         cursor: "pointer"
// //                       }),
// //                       singleValue: (base) => ({ ...base, color: "inherit" }),
// //                       input: (base) => ({ ...base, color: "inherit" })
// //                     }}
// //                   />
// //                 </div>
// //               </div>
// //             </div>
// //             {/* name */}
// //             <div className="space-y-2">
// //               <Label>{t("auth.name")}</Label>
// //               <Input
// //                 type="text"
// //                 placeholder="Your Name"
// //                 value={formData.firstName}
// //                 onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
// //                 disabled={loading}
// //               />
// //             </div>
// //             {/* email */}
// //             <div className="space-y-2">
// //               <Label>{t("auth.email")}</Label>
// //               <Input
// //                 type="email"
// //                 placeholder="example@gmail.com"
// //                 value={formData.email}
// //                 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
// //                 disabled={loading}
// //               />
// //             </div>
// //             {/* password */}
// //             <div className="space-y-2">
// //               <Label>{t("auth.password")}</Label>
// //               <div className="relative">
// //                 <Input
// //                   type={showPassword ? 'text' : 'password'}
// //                   placeholder="8 characters min"
// //                   value={formData.password}
// //                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
// //                   disabled={loading}
// //                   className="pr-10"
// //                 />
// //                 <button
// //                   type="button"
// //                   onClick={() => setShowPassword(p => !p)}
// //                   className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
// //                 >
// //                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
// //                 </button>
// //               </div>
// //             </div>
// //             {/* checkbox */}
// //             <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg border border-dashed border-primary/20">
// //               <Checkbox
// //                 id="terms-check"
// //                 checked={formData.agreed}
// //                 onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, agreed: Boolean(checked) }))}
// //               />
// //               <label htmlFor="terms-check" className="text-xs font-bold cursor-pointer">
// //                 {locale === "ar" ? (
// //                   <>
// //                     أوافق على{" "}
// //                     <button
// //                       type="button"
// //                       disabled={redirectingToTerms}
// //                       onClick={goToTerms}
// //                       className="inline-flex items-center text-primary underline hover:opacity-80"
// //                     >
// //                       الميثاق السيادي (الشروط)
// //                       {redirectingToTerms && (
// //                         <Loader2 className="ml-1 h-3 w-3 animate-spin" />
// //                       )}
// //                     </button>
// //                   </>
// //                 ) : (
// //                   <>
// //                     I agree to the{" "}
// //                     <button
// //                       type="button"
// //                       disabled={redirectingToTerms}
// //                       onClick={goToTerms}
// //                       className="inline-flex items-center text-primary underline hover:opacity-80"
// //                     >
// //                       Sovereign Constitution
// //                       {redirectingToTerms && (
// //                         <Loader2 className="ml-1 h-3 w-3 animate-spin" />
// //                       )}
// //                     </button>
// //                   </>
// //                 )}
// //               </label>
// //             </div>
// //             {/* buttons */}
// //             <div className="flex gap-2 pt-2">
// //               <Button
// //                 className="w-2/3 h-12 text-lg font-black"
// //                 onClick={handleNext}
// //                 disabled={submitting || !formData.phone || !formData.email || (formData.password?.length || 0) < 8 || !formData.firstName || !formData.agreed}
// //               >
// //                 {submitting ? <Loader2 className="animate-spin" /> : t("common.next")}
// //               </Button>
// //               <Button
// //                 variant="outline"
// //                 className="w-1/3 h-12 font-bold"
// //                 onClick={() => router.push("/")}
// //               >
// //                 {t("common.back")}
// //               </Button>
// //             </div>

// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
// import { useRouter } from "@/i18n/routing";
// import { useTranslations, useLocale } from "next-intl";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Car, Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react";

// import { useLogin } from "@/hooks/use-login";
// import { Logo } from "@/components/logo";
// import { getCountries, getCountryCallingCode, isValidPhoneNumber } from "react-phone-number-input";
// import arNames from "react-phone-number-input/locale/ar";
// import enNames from "react-phone-number-input/locale/en";

// import Select from "react-select";

// import { useToast } from "@/hooks/use-toast";
// import { Checkbox } from "@/components/ui/checkbox";
// import { triggerHaptic } from "@/lib/utils";

// /**
//  * @page LoginPhone
//  * @description THE REINFORCED SOVEREIGN PORTAL (STERILIZED - V10.0 - SCR-960)
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

//   // حالة لحفظ الأخطاء اللحظية للحقول
//   const [fieldErrors, setFieldErrors] = useState({
//     firstName: "",
//     phone: "",
//     email: "",
//     password: ""
//   });

//   const countries = getCountries().map((country) => ({
//     value: country,
//     label: `${locale === "ar" ? arNames[country] : enNames[country]} (+${getCountryCallingCode(country)})`,
//     code: getCountryCallingCode(country)
//   }));

//   // دوال التحقق اللحظي
//   // const validateName = (val: string) => {
//   //   const nameRegex = /^[\u0600-\u06FF a-zA-Z._]{2,50}$/;
//   //   if (!val.trim()) return "";
//   //   return !nameRegex.test(val.trim()) ? t("errors.invalidNameDesc") : "";
//   // };

//   const validateName = (val: string) => {
//     // تمت إضافة 0-9 للأرقام الإنجليزية و \u0660-\u0669 للأرقام العربية
//     const nameRegex = /^[\u0600-\u06FF a-zA-Z0-9\u0660-\u0669._]{2,50}$/;
//     if (!val.trim()) return "";
//     return !nameRegex.test(val.trim()) ? t("errors.invalidNameDesc") : "";
//   };
//   const validatePhone = (val: string, code: string) => {
//     if (!val.trim()) return "";
//     const normalizedPhone = val.trim().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
//     const fullPhone = `+${code}${normalizedPhone}`;
//     return !isValidPhoneNumber(fullPhone) ? t("errors.invalidPhoneCountryDesc") : "";
//   };

//   const validateEmail = (val: string) => {
//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!val.trim()) return "";
//     return !emailRegex.test(val.trim()) ? t("errors.invalidEmailDesc") : "";
//   };

//   const validatePassword = (val: string) => {
//     if (!val) return "";
//     return val.length < 8 ? t("errors.weakPasswordDesc") : "";
//   };

//   useEffect(() => {
//     const agreed = localStorage.getItem("termsAgreed");
//     if (agreed === "true") {
//       setFormData((prev) => ({ ...prev, agreed: true }));
//     }
//   }, [setFormData]);

//   useEffect(() => {
//     const role = searchParams.get("role");
//     if (role === "carrier" || role === "traveler" || role === "agent") {
//       setRoleFromUrl(role);
//       setFormData((prev) => ({ ...prev, role }));
//     } else {
//       router.replace("/");
//     }
//   }, [searchParams, setFormData, router]);

//   if (!roleFromUrl) return null;

//   const handleNext = async () => {
//     // 1. إعادة فحص جميع الحقول
//     const nameErr = validateName(formData.firstName);
//     const phoneErr = validatePhone(formData.phone, callingCode);
//     const emailErr = validateEmail(formData.email);
//     const passErr = validatePassword(formData.password);

//     if (nameErr || phoneErr || emailErr || passErr) {
//       setFieldErrors({
//         firstName: nameErr,
//         phone: phoneErr,
//         email: emailErr,
//         password: passErr
//       });

//       toast({
//         variant: "destructive",
//         title: t("errors.incompleteDataTitle"),
//         description: t("errors.incompleteDataDesc"),
//       });
//       return;
//     }

//     if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
//       toast({ variant: "destructive", title: t("errors.incompleteDataTitle"), description: t("errors.incompleteDataDesc") });
//       return;
//     }

//     setSubmitting(true);

//     // تحويل الأرقام العربية
//     const normalizedPhone = formData.phone.trim().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());

//     // استدعاء الباك اند مع إخبار TypeScript بالخصائص الإضافية
//     const result = await handleCheckPhone() as {
//       success: boolean;
//       isReturningUser: boolean;
//       errorCode?: string;
//       message?: string;
//     };

//     if (result.success && !result.isReturningUser) {
//       localStorage.setItem("tempEmail", formData.email);
//       localStorage.setItem("tempPassword", formData.password);
//       localStorage.setItem("tempPhone", normalizedPhone);
//       localStorage.setItem("tempName", formData.firstName);
//       localStorage.setItem("tempCallingCode", callingCode);
//       localStorage.setItem("tempCountryCode", selectedCountry);

//       const returnPath = searchParams.get("returnTo");
//       const nextUrl = `/login-client?role=${formData.role}${returnPath ? `&returnTo=${encodeURIComponent(returnPath)}` : ""}`;
//       router.push(nextUrl);
//     }
//     else if (!result.success) {
//       if (result.errorCode === 'EMAIL_EXISTS' || result.message?.toLowerCase().includes('email')) {
//         setFieldErrors(prev => ({ ...prev, email: t("errors.emailExistsDesc") }));
//       } else if (result.errorCode === 'NAME_EXISTS' || result.message?.toLowerCase().includes('name')) {
//         setFieldErrors(prev => ({ ...prev, firstName: t("errors.nameExistsDesc") }));
//       } else {
//         toast({ variant: "destructive", title: t("errors.generalErrorTitle"), description: result.message || t("errors.generalErrorDesc") });
//       }
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
//       className="flex min-h-screen flex-col items-center justify-center p-4 bg-background "
//       dir={locale === "ar" ? "rtl" : "ltr"}
//     >
//       <div className="w-full max-w-md space-y-3  ">
//         <div className="flex flex-col items-center text-center">
//           <Logo />
//           <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
//           <p className="text-muted-foreground">{t("auth.signup")}</p>
//         </div>
//         <div className="text-center pt-3 ">
//           <p className="text-xs text-muted-foreground">
//             {locale === 'ar' ? 'هل تمتلك حساب بالفعل؟ ' : 'Do you already have an account? '}
//             <button
//               type="button"
//               onClick={() => router.push(`/email-login?role=${formData.role}`)}
//               className="text-primary underline font-bold hover:opacity-80"
//             >
//               {locale === 'ar' ? 'سجّل دخول من هنا' : 'Log in here'}
//             </button>
//           </p>
//         </div>
//         <div className="space-y-6 bg-card p-6 rounded-xl border border-[#BFAF78] shadow-sm">
//           <div className="space-y-4">
//             <div className="border rounded-lg p-4 text-center flex flex-col items-center gap-2 bg-primary/10 border-primary">
//               {formData.role === "carrier" ? (
//                 <>
//                   <Car className="h-8 w-8 text-primary" />
//                   <span className="font-bold">{t("carrier.title")}</span>
//                 </>
//               ) : formData.role === "agent" ? (
//                 <>
//                   <ShieldCheck className="h-8 w-8 text-primary" />
//                   <span className="font-bold">{t('agent.title')}</span>
//                 </>
//               ) : (
//                 <>
//                   <User className="h-8 w-8 text-primary" />
//                   <span className="font-bold">{t("traveler.title")}</span>
//                 </>
//               )}
//             </div>

//             {/* phone */}
//             <div className="space-y-2">
//               <Label>{t("auth.phone")}</Label>
//               <div className={`flex rounded-md h-10 focus-within:ring-2 focus-within:ring-primary overflow-hidden border ${fieldErrors.phone ? 'border-destructive' : 'border-input'}`} dir="rtl">
//                 <Input
//                   type="tel"
//                   inputMode="numeric"
//                   className="border-0 rounded-none focus-visible:ring-0 text-left h-full"
//                   placeholder="998xxxxx"
//                   value={formData.phone}
//                   onChange={(e) => {
//                     setFormData({ ...formData, phone: e.target.value });
//                     if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
//                   }}
//                   onBlur={() => setFieldErrors({ ...fieldErrors, phone: validatePhone(formData.phone, callingCode) })}
//                   disabled={loading}
//                 />
//                 <div className="flex items-center px-2 bg-muted text-sm border-l border-r">+{callingCode}</div>
//                 <div className="min-w-[155px] bg-muted">
//                   <Select
//                     options={countries}
//                     isSearchable
//                     menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
//                     menuPosition="fixed"
//                     className="react-select-container"
//                     classNamePrefix="react-select"
//                     placeholder={locale === "ar" ? "الدولة" : "Country"}
//                     value={countries.find((c) => c.value === selectedCountry)}
//                     onChange={(selected: any) => {
//                       setSelectedCountry(selected.value);
//                       setCallingCode(selected.code);
//                       setFormData((prev: any) => ({ ...prev, phoneCountryCode: selected.code }));
//                       if (formData.phone) setFieldErrors({ ...fieldErrors, phone: validatePhone(formData.phone, selected.code) });
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
//               {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
//             </div>

//             {/* name */}
//             <div className="space-y-2">
//               <Label>{t("auth.name")}</Label>
//               <Input
//                 type="text"
//                 placeholder="Your Name"
//                 value={formData.firstName}
//                 className={fieldErrors.firstName ? 'border-destructive' : ''}
//                 onChange={(e) => {
//                   setFormData({ ...formData, firstName: e.target.value });
//                   if (fieldErrors.firstName) setFieldErrors({ ...fieldErrors, firstName: "" });
//                 }}
//                 onBlur={() => setFieldErrors({ ...fieldErrors, firstName: validateName(formData.firstName) })}
//                 disabled={loading}
//               />
//               {fieldErrors.firstName && <p className="text-xs text-destructive">{fieldErrors.firstName}</p>}
//             </div>

//             {/* email */}
//             <div className="space-y-2">
//               <Label>{t("auth.email")}</Label>
//               <Input
//                 type="email"
//                 placeholder="example@gmail.com"
//                 value={formData.email}
//                 className={fieldErrors.email ? 'border-destructive' : ''}
//                 onChange={(e) => {
//                   setFormData({ ...formData, email: e.target.value });
//                   if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
//                 }}
//                 onBlur={() => setFieldErrors({ ...fieldErrors, email: validateEmail(formData.email) })}
//                 disabled={loading}
//               />
//               {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
//             </div>

//             {/* password */}
//             <div className="space-y-2">
//               <Label>{t("auth.password")}</Label>
//               <div className="relative">
//                 <Input
//                   type={showPassword ? 'text' : 'password'}
//                   placeholder="8 characters min"
//                   value={formData.password}
//                   className={`pr-10 ${fieldErrors.password ? 'border-destructive' : ''}`}
//                   onChange={(e) => {
//                     setFormData({ ...formData, password: e.target.value });
//                     if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
//                   }}
//                   onBlur={() => setFieldErrors({ ...fieldErrors, password: validatePassword(formData.password) })}
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(p => !p)}
//                   className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
//                 >
//                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
//                 </button>
//               </div>
//               {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
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
import { Car, Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react";

import { useLogin } from "@/hooks/use-login";
import { Logo } from "@/components/logo";
import { getCountries, getCountryCallingCode, isValidPhoneNumber } from "react-phone-number-input";
import arNames from "react-phone-number-input/locale/ar";
import enNames from "react-phone-number-input/locale/en";

import Select from "react-select";

import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { triggerHaptic } from "@/lib/utils";

/**
 * @page LoginPhone
 * @description THE REINFORCED SOVEREIGN PORTAL (STERILIZED - V10.0 - SCR-960)
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
    handleRegister,
    returningUser,
    handleReturningUserLogin,
  } = useLogin();

  // حالة لحفظ الأخطاء اللحظية للحقول
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    phone: "",
    email: "",
    password: ""
  });

  const countries = getCountries().map((country) => ({
    value: country,
    label: `${locale === "ar" ? arNames[country] : enNames[country]} (+${getCountryCallingCode(country)})`,
    code: getCountryCallingCode(country)
  }));

  // دوال التحقق اللحظي
  // const validateName = (val: string) => {
  //   const nameRegex = /^[\u0600-\u06FF a-zA-Z._]{2,50}$/;
  //   if (!val.trim()) return "";
  //   return !nameRegex.test(val.trim()) ? t("errors.invalidNameDesc") : "";
  // };

  const validateName = (val: string) => {
    // تمت إضافة 0-9 للأرقام الإنجليزية و \u0660-\u0669 للأرقام العربية
    const nameRegex = /^[\u0600-\u06FF a-zA-Z0-9\u0660-\u0669._]{2,50}$/;
    if (!val.trim()) return "";
    return !nameRegex.test(val.trim()) ? t("errors.invalidNameDesc") : "";
  };
  const validatePhone = (val: string, code: string) => {
    if (!val.trim()) return "";
    const normalizedPhone = val.trim().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());
    const fullPhone = `+${code}${normalizedPhone}`;
    return !isValidPhoneNumber(fullPhone) ? t("errors.invalidPhoneCountryDesc") : "";
  };

  const validateEmail = (val: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!val.trim()) return "";
    return !emailRegex.test(val.trim()) ? t("errors.invalidEmailDesc") : "";
  };

  const validatePassword = (val: string) => {
    if (!val) return "";
    return val.length < 8 ? t("errors.weakPasswordDesc") : "";
  };

  useEffect(() => {
    const agreed = localStorage.getItem("termsAgreed");
    if (agreed === "true") {
      setFormData((prev) => ({ ...prev, agreed: true }));
    }
  }, [setFormData]);

  useEffect(() => {
    const role = searchParams.get("role");
    if (role === "carrier" || role === "traveler" || role === "agent") {
      setRoleFromUrl(role);
      setFormData((prev) => ({ ...prev, role }));
    } else {
      router.replace("/");
    }
  }, [searchParams, setFormData, router]);

  if (!roleFromUrl) return null;

  const handleNext = async () => {
    // 1. إعادة فحص جميع الحقول
    const nameErr = validateName(formData.firstName);
    const phoneErr = validatePhone(formData.phone, callingCode);
    const emailErr = validateEmail(formData.email);
    const passErr = validatePassword(formData.password);

    if (nameErr || phoneErr || emailErr || passErr) {
      setFieldErrors({
        firstName: nameErr,
        phone: phoneErr,
        email: emailErr,
        password: passErr
      });

      toast({
        variant: "destructive",
        title: t("errors.incompleteDataTitle"),
        description: t("errors.incompleteDataDesc"),
      });
      return;
    }

    if (!formData.firstName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      toast({ variant: "destructive", title: t("errors.incompleteDataTitle"), description: t("errors.incompleteDataDesc") });
      return;
    }

    setSubmitting(true);

    // تحويل الأرقام العربية
    const normalizedPhone = formData.phone.trim().replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d).toString());

    // استدعاء الباك اند مع إخبار TypeScript بالخصائص الإضافية
    const result = await handleCheckPhone() as {
      success: boolean;
      isReturningUser: boolean;
      errorCode?: string;
      message?: string;
    };

    if (result.success && !result.isReturningUser) {
      // ✅ سجل مباشرةً بدون توجيه لصفحة login-client
      await handleRegister();
      localStorage.removeItem("tempEmail");
      localStorage.removeItem("tempPassword");
      localStorage.removeItem("tempPhone");
      localStorage.removeItem("tempName");
      localStorage.removeItem("tempFirstName");
      localStorage.removeItem("termsAgreed");
    }
    else if (!result.success) {
      if (result.errorCode === 'EMAIL_EXISTS' || result.message?.toLowerCase().includes('email')) {
        setFieldErrors(prev => ({ ...prev, email: t("errors.emailExistsDesc") }));
      } else if (result.errorCode === 'NAME_EXISTS' || result.message?.toLowerCase().includes('name')) {
        setFieldErrors(prev => ({ ...prev, firstName: t("errors.nameExistsDesc") }));
      } else {
        toast({ variant: "destructive", title: t("errors.generalErrorTitle"), description: result.message || t("errors.generalErrorDesc") });
      }
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
      className="flex min-h-screen flex-col items-center justify-center p-4 bg-background "
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="w-full max-w-md space-y-3  ">
        <div className="flex flex-col items-center text-center">
          <Logo />
          <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
          <p className="text-muted-foreground">{t("auth.signup")}</p>
        </div>
        <div className="text-center pt-3 ">
          <p className="text-xs text-muted-foreground">
            {locale === 'ar' ? 'هل تمتلك حساب بالفعل؟ ' : 'Do you already have an account? '}
            <button
              type="button"
              onClick={() => router.push(`/email-login?role=${formData.role}`)}
              className="text-primary underline font-bold hover:opacity-80"
            >
              {locale === 'ar' ? 'سجّل دخول من هنا' : 'Log in here'}
            </button>
          </p>
        </div>
        <div className="space-y-6 bg-card p-6 rounded-xl border border-[#BFAF78] shadow-sm">
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
                  <span className="font-bold">{t('agent.title')}</span>
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
              <div className={`flex rounded-md h-10 focus-within:ring-2 focus-within:ring-primary overflow-hidden border ${fieldErrors.phone ? 'border-destructive' : 'border-input'}`} dir="rtl">
                <Input
                  type="tel"
                  inputMode="numeric"
                  className="border-0 rounded-none focus-visible:ring-0 text-left h-full"
                  placeholder="998xxxxx"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                  }}
                  onBlur={() => setFieldErrors({ ...fieldErrors, phone: validatePhone(formData.phone, callingCode) })}
                  disabled={loading}
                />
                <div className="flex items-center px-2 bg-muted text-sm border-l border-r">+{callingCode}</div>
                <div className="min-w-[155px] bg-muted">
                  <Select
                    options={countries}
                    isSearchable
                    menuPortalTarget={typeof document !== 'undefined' ? document.body : undefined}
                    menuPosition="fixed"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    placeholder={locale === "ar" ? "الدولة" : "Country"}
                    value={countries.find((c) => c.value === selectedCountry)}
                    onChange={(selected: any) => {
                      setSelectedCountry(selected.value);
                      setCallingCode(selected.code);
                      setFormData((prev: any) => ({ ...prev, phoneCountryCode: selected.code }));
                      if (formData.phone) setFieldErrors({ ...fieldErrors, phone: validatePhone(formData.phone, selected.code) });
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
              {fieldErrors.phone && <p className="text-xs text-destructive">{fieldErrors.phone}</p>}
            </div>

            {/* name */}
            <div className="space-y-2">
              <Label>{t("auth.name")}</Label>
              <Input
                type="text"
                placeholder="Your Name"
                value={formData.firstName}
                className={fieldErrors.firstName ? 'border-destructive' : ''}
                onChange={(e) => {
                  setFormData({ ...formData, firstName: e.target.value });
                  if (fieldErrors.firstName) setFieldErrors({ ...fieldErrors, firstName: "" });
                }}
                onBlur={() => setFieldErrors({ ...fieldErrors, firstName: validateName(formData.firstName) })}
                disabled={loading}
              />
              {fieldErrors.firstName && <p className="text-xs text-destructive">{fieldErrors.firstName}</p>}
            </div>

            {/* email */}
            <div className="space-y-2">
              <Label>{t("auth.email")}</Label>
              <Input
                type="email"
                placeholder="example@gmail.com"
                value={formData.email}
                className={fieldErrors.email ? 'border-destructive' : ''}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                }}
                onBlur={() => setFieldErrors({ ...fieldErrors, email: validateEmail(formData.email) })}
                disabled={loading}
              />
              {fieldErrors.email && <p className="text-xs text-destructive">{fieldErrors.email}</p>}
            </div>

            {/* password */}
            <div className="space-y-2">
              <Label>{t("auth.password")}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8 characters min"
                  value={formData.password}
                  className={`pr-10 ${fieldErrors.password ? 'border-destructive' : ''}`}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                  }}
                  onBlur={() => setFieldErrors({ ...fieldErrors, password: validatePassword(formData.password) })}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && <p className="text-xs text-destructive">{fieldErrors.password}</p>}
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