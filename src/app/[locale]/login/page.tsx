import { Suspense } from 'react';
import LoginClient from './login-client';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
    </div>}>
      <LoginClient />
    </Suspense>
  );
}

// "use client";

// import { useLogin } from "@/hooks/use-login";
// import { Logo } from "@/components/logo";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Loader2 } from "lucide-react";
// import { useTranslations } from "next-intl";

// /**
//  * @file login/page.tsx
//  * @description STERILIZED UI - Forced Token Refresh Injection
//  */
// export default function LoginPage() {
//   const t = useTranslations();
//   const { loading, handleReturningUserLogin, formData, setFormData } = useLogin();

//   const onLoginClick = async () => {
//     // تمرير البيانات للـ Hook الذي يعالج المنطق
//     await handleReturningUserLogin();
//   };

//   return (
//     <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background text-right">
//       <div className="w-full max-w-md space-y-8">
//         <div className="text-center">
//           <Logo />
//           <h2 className="text-3xl font-bold">{t("common.appName")}</h2>
//           <p className="text-muted-foreground">{t("auth.login")}</p>
//         </div>

//         <div className="space-y-6 bg-card p-6 rounded-xl border shadow-sm">
//           <div className="space-y-2">
//             <Input
//               type="email"
//               placeholder="البريد الإلكتروني"
//               value={formData.email}
//               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
//               disabled={loading}
//             />
//             <Input
//               type="password"
//               placeholder="كلمة المرور"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//               disabled={loading}
//             />
//           </div>

//           <Button
//             className="w-full h-12 text-lg font-bold"
//             onClick={onLoginClick}
//             disabled={loading || !formData.email || !formData.password}
//           >
//             {loading ? <Loader2 className="animate-spin" /> : "دخول النظام"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
