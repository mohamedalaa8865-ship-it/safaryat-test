
// // // 'use client';

// // // import {
// // //   AlertDialog,
// // //   AlertDialogContent,
// // //   AlertDialogDescription,
// // //   AlertDialogFooter,
// // //   AlertDialogHeader,
// // //   AlertDialogTitle,
// // // } from '@/components/ui/alert-dialog';
// // // import { Button } from '@/components/ui/button';
// // // import { useRouter } from 'next/navigation';
// // // import { UserPlus, LogIn } from 'lucide-react';
// // // import { useUser } from '@/firebase';
// // // import { useEffect } from 'react';

// // // interface AuthRedirectDialogProps {
// // //     isOpen: boolean;
// // //     onOpenChange: (isOpen: boolean) => void;
// // //     onLoginSuccess?: () => void;
// // // }

// // // export function AuthRedirectDialog({ isOpen, onOpenChange, onLoginSuccess }: AuthRedirectDialogProps) {
// // //     const router = useRouter();
// // //     const { user, isUserLoading } = useUser();

// // //     useEffect(() => {
// // //         if (isOpen && user && !isUserLoading && onLoginSuccess) {
// // //             onOpenChange(false);
// // //             onLoginSuccess();
// // //         }
// // //     }, [user, isUserLoading, isOpen, onOpenChange, onLoginSuccess]);


// // //     const handleLogin = () => {
// // //         router.push('/login');
// // //     };

// // //     const handleSignup = () => {
// // //         router.push('/signup');
// // //     };

// // //   return (
// // //     <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
// // //       <AlertDialogContent>
// // //         <AlertDialogHeader>
// // //           <AlertDialogTitle>You must log in first</AlertDialogTitle>
// // //           <AlertDialogDescription>
// // //             To continue and send your request, please log in to your account or create a new one if you are not yet registered.
// // //           </AlertDialogDescription>
// // //         </AlertDialogHeader>
// // //         <AlertDialogFooter className="sm:justify-center flex-col sm:flex-col gap-2 pt-4">
// // //           <Button onClick={handleLogin} className="w-full">
// // //             <LogIn className="mr-2 h-4 w-4"/>
// // //             Login (Existing Account)
// // //           </Button>
// // //           <Button variant="secondary" onClick={handleSignup} className="w-full">
// // //             <UserPlus className="mr-2 h-4 w-4"/>
// // //             Create New Account
// // //           </Button>
// // //         </AlertDialogFooter>
// // //       </AlertDialogContent>
// // //     </AlertDialog>
// // //   );
// // // }

// // 'use client';

// // import {
// //   AlertDialog,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from '@/components/ui/alert-dialog';
// // import { Button } from '@/components/ui/button';
// // import { useRouter } from '@/i18n/routing';
// // import { usePathname } from '@/i18n/routing';
// // import { UserPlus, LogIn, X } from 'lucide-react';
// // import { useUser } from '@/firebase';
// // import { useEffect } from 'react';
// // import { useLocale, useTranslations } from "next-intl";
// // interface AuthRedirectDialogProps {
// //   isOpen: boolean;
// //   onOpenChange: (isOpen: boolean) => void;
// //   onLoginSuccess?: () => void;
// // }

// // export function AuthRedirectDialog({
// //   isOpen,
// //   onOpenChange,
// //   onLoginSuccess,
// // }: AuthRedirectDialogProps) {
// //   const router = useRouter();
// //   const pathname = usePathname();
// //   const { user, isUserLoading } = useUser();
// //   const t = useTranslations('dashboard');
// //   const locale = useLocale();
// //   const isRTL = locale === 'ar';
// //   useEffect(() => {
// //     if (isOpen && user && !isUserLoading && onLoginSuccess) {
// //       onOpenChange(false);
// //       onLoginSuccess();
// //     }
// //   }, [user, isUserLoading, isOpen, onOpenChange, onLoginSuccess]);

// //   const returnTo =
// //     typeof window !== 'undefined'
// //       ? `${window.location.pathname}${window.location.search}`
// //       : pathname || '/dashboard';

// //   const handleLogin = () => {
// //     router.push(`/email-login?role=traveler&returnTo=${encodeURIComponent(returnTo)}`);
// //   };

// //   const handleSignup = () => {
// //     router.push(`/login?role=traveler&returnTo=${encodeURIComponent(returnTo)}`);
// //   };

// //   return (
// //     <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
// //       <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'} className="relative">
// //         <button
// //           onClick={() => onOpenChange(false)}
// //           className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground transition-colors`}
// //         >
// //           <X className="w-4 h-4" />
// //         </button>

// //         <AlertDialogHeader className={isRTL ? 'text-right' : 'text-left'}>
// //           <AlertDialogTitle>{t('titleDialog')}</AlertDialogTitle>
// //           <AlertDialogDescription>
// //             {t('decDialog')}
// //           </AlertDialogDescription>
// //         </AlertDialogHeader>

// //         <AlertDialogFooter className="sm:justify-center flex-col sm:flex-col gap-2 pt-4">
// //           <Button onClick={handleLogin} className="w-full">
// //             <LogIn className="mr-2 h-4 w-4" />
// //             {t('login')}
// //           </Button>

// //           <Button variant="secondary" onClick={handleSignup} className="w-full">
// //             <UserPlus className="mr-2 h-4 w-4" />
// //             {t('createNew')}
// //           </Button>
// //         </AlertDialogFooter>
// //       </AlertDialogContent>
// //     </AlertDialog>
// //   );
// // }
// 'use client';

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { useRouter } from '@/i18n/routing';
// import { usePathname } from '@/i18n/routing';
// import { UserPlus, LogIn } from 'lucide-react';
// import { useUser } from '@/firebase';
// import { useEffect } from 'react';
// import { useLocale, useTranslations } from "next-intl";

// interface AuthRedirectDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   onLoginSuccess?: () => void;
// }

// export function AuthRedirectDialog({
//   isOpen,
//   onOpenChange,
//   onLoginSuccess,
// }: AuthRedirectDialogProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, isUserLoading } = useUser();
//   const t = useTranslations('dashboard');
//   const locale = useLocale();
//   const isRTL = locale === 'ar';

//   useEffect(() => {
//     if (isOpen && user && !isUserLoading && onLoginSuccess) {
//       onOpenChange(false);
//       onLoginSuccess();
//     }
//   }, [user, isUserLoading, isOpen, onOpenChange, onLoginSuccess]);

//   const returnTo =
//     typeof window !== 'undefined'
//       ? `${window.location.pathname}${window.location.search}`
//       : pathname || '/dashboard';

//   const handleLogin = () => {
//     router.push(`/email-login?role=traveler&returnTo=${encodeURIComponent(returnTo)}`);
//   };

//   const handleSignup = () => {
//     router.push(`/login?role=traveler&returnTo=${encodeURIComponent(returnTo)}`);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onOpenChange}>
//       <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className='border border-[#BFAF78]'>
//         <DialogHeader className='pt-5'>
//           <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
//             {t('titleDialog')}
//           </DialogTitle>
//           <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
//             {t('decDialog')}
//           </DialogDescription>
//         </DialogHeader>

//         <div className="flex  gap-3 pt-2">
//           <Button onClick={handleLogin} className="w-full">
//             <LogIn className="mr-2 h-4 w-4" />
//             {t('login')}
//           </Button>
//           <Button onClick={handleSignup} className="w-full bg-[#BFAF78] text-black">
//             <UserPlus className="mr-2 h-4 w-4" />
//             {t('createNew')}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog >
//   );
// }
// // 'use client';

// // import {
// //   AlertDialog,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// // } from '@/components/ui/alert-dialog';
// // import { Button } from '@/components/ui/button';
// // import { useRouter } from 'next/navigation';
// // import { UserPlus, LogIn } from 'lucide-react';
// // import { useUser } from '@/firebase';
// // import { useEffect } from 'react';

// // interface AuthRedirectDialogProps {
// //     isOpen: boolean;
// //     onOpenChange: (isOpen: boolean) => void;
// //     onLoginSuccess?: () => void;
// // }

// // export function AuthRedirectDialog({ isOpen, onOpenChange, onLoginSuccess }: AuthRedirectDialogProps) {
// //     const router = useRouter();
// //     const { user, isUserLoading } = useUser();

// //     useEffect(() => {
// //         if (isOpen && user && !isUserLoading && onLoginSuccess) {
// //             onOpenChange(false);
// //             onLoginSuccess();
// //         }
// //     }, [user, isUserLoading, isOpen, onOpenChange, onLoginSuccess]);


// //     const handleLogin = () => {
// //         router.push('/login');
// //     };

// //     const handleSignup = () => {
// //         router.push('/signup');
// //     };

// //   return (
// //     <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
// //       <AlertDialogContent>
// //         <AlertDialogHeader>
// //           <AlertDialogTitle>You must log in first</AlertDialogTitle>
// //           <AlertDialogDescription>
// //             To continue and send your request, please log in to your account or create a new one if you are not yet registered.
// //           </AlertDialogDescription>
// //         </AlertDialogHeader>
// //         <AlertDialogFooter className="sm:justify-center flex-col sm:flex-col gap-2 pt-4">
// //           <Button onClick={handleLogin} className="w-full">
// //             <LogIn className="mr-2 h-4 w-4"/>
// //             Login (Existing Account)
// //           </Button>
// //           <Button variant="secondary" onClick={handleSignup} className="w-full">
// //             <UserPlus className="mr-2 h-4 w-4"/>
// //             Create New Account
// //           </Button>
// //         </AlertDialogFooter>
// //       </AlertDialogContent>
// //     </AlertDialog>
// //   );
// // }

// 'use client';

// import {
//   AlertDialog,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { Button } from '@/components/ui/button';
// import { useRouter } from '@/i18n/routing';
// import { usePathname } from '@/i18n/routing';
// import { UserPlus, LogIn, X } from 'lucide-react';
// import { useUser } from '@/firebase';
// import { useEffect } from 'react';
// import { useLocale, useTranslations } from "next-intl";
// interface AuthRedirectDialogProps {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   onLoginSuccess?: () => void;
// }

// export function AuthRedirectDialog({
//   isOpen,
//   onOpenChange,
//   onLoginSuccess,
// }: AuthRedirectDialogProps) {
//   const router = useRouter();
//   const pathname = usePathname();
//   const { user, isUserLoading } = useUser();
//   const t = useTranslations('dashboard');
//   const locale = useLocale();
//   const isRTL = locale === 'ar';
//   useEffect(() => {
//     if (isOpen && user && !isUserLoading && onLoginSuccess) {
//       onOpenChange(false);
//       onLoginSuccess();
//     }
//   }, [user, isUserLoading, isOpen, onOpenChange, onLoginSuccess]);

//   const returnTo =
//     typeof window !== 'undefined'
//       ? `${window.location.pathname}${window.location.search}`
//       : pathname || '/dashboard';

//   const handleLogin = () => {
//     router.push(`/email-login?role=traveler&returnTo=${encodeURIComponent(returnTo)}`);
//   };

//   const handleSignup = () => {
//     router.push(`/login?role=traveler&returnTo=${encodeURIComponent(returnTo)}`);
//   };

//   return (
//     <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
//       <AlertDialogContent dir={isRTL ? 'rtl' : 'ltr'} className="relative">
//         <button
//           onClick={() => onOpenChange(false)}
//           className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground transition-colors`}
//         >
//           <X className="w-4 h-4" />
//         </button>

//         <AlertDialogHeader className={isRTL ? 'text-right' : 'text-left'}>
//           <AlertDialogTitle>{t('titleDialog')}</AlertDialogTitle>
//           <AlertDialogDescription>
//             {t('decDialog')}
//           </AlertDialogDescription>
//         </AlertDialogHeader>

//         <AlertDialogFooter className="sm:justify-center flex-col sm:flex-col gap-2 pt-4">
//           <Button onClick={handleLogin} className="w-full">
//             <LogIn className="mr-2 h-4 w-4" />
//             {t('login')}
//           </Button>

//           <Button variant="secondary" onClick={handleSignup} className="w-full">
//             <UserPlus className="mr-2 h-4 w-4" />
//             {t('createNew')}
//           </Button>
//         </AlertDialogFooter>
//       </AlertDialogContent>
//     </AlertDialog>
//   );
// }
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useRouter } from '@/i18n/routing';
import { usePathname } from '@/i18n/routing';
import { UserPlus, LogIn } from 'lucide-react';
import { useUser } from '@/firebase';
import { useEffect } from 'react';
import { useLocale, useTranslations } from "next-intl";

interface AuthRedirectDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onLoginSuccess?: () => void;
  /** نوع العملية المعلقة: 'booking' لحجز رحلة، 'trip_request' لإنشاء طلب رحلة */
  pendingAction?: 'booking' | 'trip_request';
}

export function AuthRedirectDialog({
  isOpen,
  onOpenChange,
  onLoginSuccess,
  pendingAction,
}: AuthRedirectDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isUserLoading } = useUser();
  const t = useTranslations('dashboard');
  const locale = useLocale();
  const isRTL = locale === 'ar';

  useEffect(() => {
    if (isOpen && user && !isUserLoading && onLoginSuccess) {
      onOpenChange(false);
      onLoginSuccess();
    }
  }, [user, isUserLoading, isOpen, onOpenChange, onLoginSuccess]);

  const returnTo =
    typeof window !== 'undefined'
      ? `${window.location.pathname}${window.location.search}`
      : pathname || '/dashboard';

  const savePendingActionAndRedirect = (destination: string) => {
    if (pendingAction && typeof window !== 'undefined') {
      localStorage.setItem('pendingAction', pendingAction);
    }
    router.push(destination);
  };

  const handleLogin = () => {
    savePendingActionAndRedirect(`/email-login?role=traveler&returnTo=${encodeURIComponent(returnTo)}`);
  };

  const handleSignup = () => {
    savePendingActionAndRedirect(`/login?role=traveler&returnTo=${encodeURIComponent(returnTo)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent dir={isRTL ? 'rtl' : 'ltr'} className='border border-[#BFAF78]'>
        <DialogHeader className='pt-5'>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {t('titleDialog')}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('decDialog')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex  gap-3 pt-2">
          <Button onClick={handleLogin} className="w-full">
            <LogIn className="mr-2 h-4 w-4" />
            {t('login')}
          </Button>
          <Button onClick={handleSignup} className="w-full bg-[#BFAF78] text-black">
            <UserPlus className="mr-2 h-4 w-4" />
            {t('createNew')}
          </Button>
        </div>
      </DialogContent>
    </Dialog >
  );
}