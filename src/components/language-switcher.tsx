// 'use client';

// import { useLocale, useTranslations } from 'next-intl';
// import { useRouter, usePathname } from '@/i18n/routing';
// import { Button } from '@/components/ui/button';
// import { Languages } from 'lucide-react';

// export function LanguageSwitcher({ fullWidth = false }: { fullWidth?: boolean }) {
//   const locale = useLocale();
//   const router = useRouter();
//   const pathname = usePathname();
//   const t = useTranslations('common');

//   const switchLanguage = () => {
//     const newLocale = locale === 'ar' ? 'en' : 'ar';
//     router.replace(pathname, { locale: newLocale });
//   };

//   return (
//     <div className={`top-4 z-50 ${locale === 'ar' ? 'left-4' : 'right-4'}`}>
//       <Button
//         onClick={switchLanguage}
//         // variant="outline"
//         size="sm"
//         // className=`gap-2 ${fullWidth ? 'w-full' : ''} `
//         className={`gap-2  border border-black ${fullWidth ? 'w-full' : ''}`}
//       >

//         <Languages className="h-4 w-4" />
//         <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
//       </Button>
//     </div>
//   );
// }
'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher({ fullWidth = false }: { fullWidth?: boolean }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations('common');

  const switchLanguage = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    // ✅ الحفاظ على الـ query params عند تغيير اللغة
    const params = searchParams.toString();
    router.replace(`${pathname}${params ? `?${params}` : ''}`, { locale: newLocale });
  };

  return (
    <div className={`top-4 z-50 ${locale === 'ar' ? 'left-4' : 'right-4'}`}>
      <Button
        onClick={switchLanguage}
        size="sm"
        className={`gap-2  border border-black ${fullWidth ? 'w-full' : ''}`}
      >
        <Languages className="h-4 w-4" />
        <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
      </Button>
    </div>
  );
}