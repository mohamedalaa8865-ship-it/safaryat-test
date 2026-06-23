// // // 'use client';

// // // import Link from 'next/link';
// // // import { usePathname } from 'next/navigation';
// // // import { PlusCircle, type LucideIcon } from 'lucide-react';
// // // import { cn } from '@/lib/utils';
// // // import { Button } from '@/components/ui/button';
// // // import { Badge } from '@/components/ui/badge';

// // // interface NavLink {
// // //   href: string;
// // //   label: string;
// // //   icon: LucideIcon;
// // //   exact?: boolean;
// // //   count: number;
// // //   mobile?: boolean;
// // // }

// // // interface CarrierBottomNavProps {
// // //   onAddTripClick: () => void;
// // //   navLinks: NavLink[];
// // //   hasActiveTrip?: boolean;
// // // }

// // // export function CarrierBottomNav({ onAddTripClick, navLinks, hasActiveTrip = false }: CarrierBottomNavProps) {
// // //   const pathname = usePathname();
// // //   const navItems = navLinks.filter(link => link.mobile);

// // //   return (
// // //     <div className="carrier-bottom-nav">
// // //       <div className="relative h-full max-w-2xl mx-auto md:max-w-3xl">
// // //         <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-xl">
// // //           <Button size="icon" id="new-trip-button" disabled={hasActiveTrip} className="h-16 w-16 rounded-full bg-turquoise text-black border-4 border-background hover:bg-turquoise/90 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100" onClick={onAddTripClick}>
// // //             <PlusCircle className="h-8 w-8" />
// // //           </Button>
// // //         </div>

// // //         <nav className="grid grid-cols-2 h-full items-center justify-between  px-2">
// // //           {navItems.slice(0, 2).map((item) => {
// // //             const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
// // //             const Icon = item.icon;
// // //             return (
// // //               <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center gap-1 w-full py-2 h-full">
// // //                 {item.count > 0 && <Badge variant="destructive" className="absolute top-1 right-2 bg-orange-500 text-white px-1.5 py-0.5 text-[10px] rounded-full flex items-center justify-center w-4 h-4">{item.count}</Badge>}
// // //                 <Icon className={cn('h-6 w-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
// // //                 <span className={cn('text-[10px] font-bold transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>{item.label}</span>
// // //               </Link>
// // //             );
// // //           })}

// // //           <div className="flex justify-center items-center h-full"></div>

// // //           {navItems.slice(2).map((item) => {
// // //             const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
// // //             const Icon = item.icon;
// // //             return (
// // //               <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center gap-1 w-full py-2 h-full">
// // //                 {item.count > 0 && <Badge variant="destructive" className="absolute top-1 right-2 bg-orange-500 text-white px-1.5 py-0.5 text-[10px] rounded-full flex items-center justify-center w-4 h-4">{item.count}</Badge>}
// // //                 <Icon className={cn('h-6 w-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
// // //                 <span className={cn('text-[10px] font-bold transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>{item.label}</span>
// // //               </Link>
// // //             );
// // //           })}
// // //         </nav>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // 'use client';

// // import Link from 'next/link';
// // import { usePathname } from 'next/navigation';
// // import { PlusCircle, type LucideIcon } from 'lucide-react';
// // import { cn } from '@/lib/utils';
// // import { Button } from '@/components/ui/button';

// // interface NavLink {
// //   href: string;
// //   label: string;
// //   icon: LucideIcon;
// //   exact?: boolean;
// //   count: number;
// //   mobile?: boolean;
// // }

// // interface CarrierBottomNavProps {
// //   onAddTripClick: () => void;
// //   navLinks: NavLink[];
// //   hasActiveTrip?: boolean;
// // }

// // function NavItem({ item, pathname }: { item: NavLink; pathname: string }) {
// //   const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
// //   const Icon = item.icon;

// //   return (
// //     <Link
// //       href={item.href}
// //       className="relative flex flex-col items-center justify-center gap-1 w-full py-2 h-full"
// //     >
// //       {/* الأيقونة مع البادج فوقها مباشرة */}
// //       <span className="relative">
// //         <Icon className={cn('h-6 w-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
// //         {item.count > 0 && (
// //           <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center leading-none">
// //             {item.count > 9 ? '9+' : item.count}
// //           </span>
// //         )}
// //       </span>
// //       <span className={cn('text-[10px] font-bold transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>
// //         {item.label}
// //       </span>
// //     </Link>
// //   );
// // }

// // export function CarrierBottomNav({ onAddTripClick, navLinks, hasActiveTrip = false }: CarrierBottomNavProps) {
// //   const pathname = usePathname();
// //   const navItems = navLinks.filter(link => link.mobile);

// //   return (
// //     <div className="carrier-bottom-nav">
// //       <div className="relative h-full max-w-2xl mx-auto md:max-w-3xl">
// //         <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-xl">
// //           <Button
// //             size="icon"
// //             id="new-trip-button"
// //             disabled={hasActiveTrip}
// //             className="h-16 w-16 rounded-full bg-turquoise text-black border-4 border-background hover:bg-turquoise/90 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
// //             onClick={onAddTripClick}
// //           >
// //             <PlusCircle className="h-8 w-8" />
// //           </Button>
// //         </div>

// //         <nav className="grid grid-cols-2 h-full items-center justify-between px-2">
// //           {navItems.slice(0, 2).map((item) => (
// //             <NavItem key={item.href} item={item} pathname={pathname} />
// //           ))}

// //           <div className="flex justify-center items-center h-full" />

// //           {navItems.slice(2).map((item) => (
// //             <NavItem key={item.href} item={item} pathname={pathname} />
// //           ))}
// //         </nav>
// //       </div>
// //     </div>
// //   );
// // }
// // 'use client';

// // import Link from 'next/link';
// // import { usePathname } from 'next/navigation';
// // import { PlusCircle, type LucideIcon } from 'lucide-react';
// // import { cn } from '@/lib/utils';
// // import { Button } from '@/components/ui/button';
// // import { Badge } from '@/components/ui/badge';

// // interface NavLink {
// //   href: string;
// //   label: string;
// //   icon: LucideIcon;
// //   exact?: boolean;
// //   count: number;
// //   mobile?: boolean;
// // }

// // interface CarrierBottomNavProps {
// //   onAddTripClick: () => void;
// //   navLinks: NavLink[];
// //   hasActiveTrip?: boolean;
// // }

// // export function CarrierBottomNav({ onAddTripClick, navLinks, hasActiveTrip = false }: CarrierBottomNavProps) {
// //   const pathname = usePathname();
// //   const navItems = navLinks.filter(link => link.mobile);

// //   return (
// //     <div className="carrier-bottom-nav">
// //       <div className="relative h-full max-w-2xl mx-auto md:max-w-3xl">
// //         <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-xl">
// //           <Button size="icon" id="new-trip-button" disabled={hasActiveTrip} className="h-16 w-16 rounded-full bg-turquoise text-black border-4 border-background hover:bg-turquoise/90 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100" onClick={onAddTripClick}>
// //             <PlusCircle className="h-8 w-8" />
// //           </Button>
// //         </div>

// //         <nav className="grid grid-cols-2 h-full items-center justify-between  px-2">
// //           {navItems.slice(0, 2).map((item) => {
// //             const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
// //             const Icon = item.icon;
// //             return (
// //               <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center gap-1 w-full py-2 h-full">
// //                 {item.count > 0 && <Badge variant="destructive" className="absolute top-1 right-2 bg-orange-500 text-white px-1.5 py-0.5 text-[10px] rounded-full flex items-center justify-center w-4 h-4">{item.count}</Badge>}
// //                 <Icon className={cn('h-6 w-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
// //                 <span className={cn('text-[10px] font-bold transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>{item.label}</span>
// //               </Link>
// //             );
// //           })}

// //           <div className="flex justify-center items-center h-full"></div>

// //           {navItems.slice(2).map((item) => {
// //             const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
// //             const Icon = item.icon;
// //             return (
// //               <Link key={item.href} href={item.href} className="relative flex flex-col items-center justify-center gap-1 w-full py-2 h-full">
// //                 {item.count > 0 && <Badge variant="destructive" className="absolute top-1 right-2 bg-orange-500 text-white px-1.5 py-0.5 text-[10px] rounded-full flex items-center justify-center w-4 h-4">{item.count}</Badge>}
// //                 <Icon className={cn('h-6 w-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
// //                 <span className={cn('text-[10px] font-bold transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>{item.label}</span>
// //               </Link>
// //             );
// //           })}
// //         </nav>
// //       </div>
// //     </div>
// //   );
// // }
// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { PlusCircle, type LucideIcon } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { Button } from '@/components/ui/button';

// interface NavLink {
//   href: string;
//   label: string;
//   icon: LucideIcon;
//   exact?: boolean;
//   count: number;
//   mobile?: boolean;
// }

// interface CarrierBottomNavProps {
//   onAddTripClick: () => void;
//   navLinks: NavLink[];
//   hasActiveTrip?: boolean;
// }

// function NavItem({ item, pathname }: { item: NavLink; pathname: string }) {
//   const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
//   const Icon = item.icon;

//   return (
//     <Link
//       href={item.href}
//       className="relative flex flex-col items-center justify-center gap-1 w-full py-2 h-full"
//     >
//       {/* الأيقونة مع البادج فوقها مباشرة */}
//       <span className="relative">
//         <Icon className={cn('h-6 w-6 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
//         {item.count > 0 && (
//           <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center leading-none">
//             {item.count > 9 ? '9+' : item.count}
//           </span>
//         )}
//       </span>
//       <span className={cn('text-[10px] font-bold transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')}>
//         {item.label}
//       </span>
//     </Link>
//   );
// }

// export function CarrierBottomNav({ onAddTripClick, navLinks, hasActiveTrip = false }: CarrierBottomNavProps) {
//   const pathname = usePathname();
//   const navItems = navLinks.filter(link => link.mobile);

//   // أول اتنين على اليسار، آخر اتنين على اليمين، الزرار في الوسط
//   const leftItems = navItems.slice(0, 2);
//   const rightItems = navItems.slice(2, 4);

//   return (
//     <div className="carrier-bottom-nav">
//       <div className="relative h-full max-w-2xl mx-auto md:max-w-3xl">
//         <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-xl">
//           <Button
//             size="icon"
//             id="new-trip-button"
//             disabled={hasActiveTrip}
//             className="h-16 w-16 rounded-full bg-turquoise text-black border-4 border-background hover:bg-turquoise/90 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
//             onClick={onAddTripClick}
//           >
//             <PlusCircle className="h-8 w-8" />
//           </Button>
//         </div>

//         <nav className="grid grid-cols-5 h-full items-center px-2">
//           {/* اليسار: اتنين */}
//           {leftItems.map((item) => (
//             <NavItem key={item.href} item={item} pathname={pathname} />
//           ))}

//           {/* الوسط: مكان الزرار */}
//           <div className="flex justify-center items-center h-full" />

//           {/* اليمين: اتنين */}
//           {rightItems.map((item) => (
//             <NavItem key={item.href} item={item} pathname={pathname} />
//           ))}
//         </nav>
//       </div>
//     </div>
//   );
// }
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PlusCircle, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  count: number;
  mobile?: boolean;
}

interface CarrierBottomNavProps {
  onAddTripClick: () => void;
  navLinks: NavLink[];
  hasActiveTrip?: boolean;
}

function NavItem({ item, pathname }: { item: NavLink; pathname: string }) {
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className="relative flex flex-col items-center justify-center gap-0.5 w-full py-1.5 h-full"
    >
      <span className="relative">
        <Icon className={cn('h-5 w-5 transition-colors', isActive ? 'text-primary' : 'text-muted-foreground')} />
        {item.count > 0 && (
          <span className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-black flex items-center justify-center leading-none">
            {item.count > 9 ? '9+' : item.count}
          </span>
        )}
      </span>
      <span className={cn(
        'text-[9px] font-bold transition-colors leading-tight text-center',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )}>
        {item.label}
      </span>
    </Link>
  );
}

export function CarrierBottomNav({ onAddTripClick, navLinks, hasActiveTrip = false }: CarrierBottomNavProps) {
  const pathname = usePathname();
  const navItems = navLinks.filter(link => link.mobile);

  // توزيع: أول 2 يسار، الزرار في الوسط، الباقي كله يمين (حتى لو 3)
  const leftItems = navItems.slice(0, 2);
  const rightItems = navItems.slice(2); // كل الباقي يمين بدون حد أقصى

  const totalCols = leftItems.length + 1 + rightItems.length;

  return (
    <div className="carrier-bottom-nav">
      <div className="relative h-full max-w-2xl mx-auto md:max-w-3xl">
        {/* زرار إضافة رحلة */}
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-xl">
          <Button
            size="icon"
            id="new-trip-button"
            disabled={hasActiveTrip}
            className="h-16 w-16 rounded-full bg-turquoise text-black border-4 border-background hover:bg-turquoise/90 transition-transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
            onClick={onAddTripClick}
          >
            <PlusCircle className="h-8 w-8" />
          </Button>
        </div>

        {/* الناف — شبكة ديناميكية */}
        <nav
          className="grid h-full items-center px-1"
          style={{ gridTemplateColumns: `repeat(${totalCols}, 1fr)` }}
        >
          {/* اليسار */}
          {leftItems.map(item => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}

          {/* فراغ الزرار */}
          <div className="flex justify-center items-center h-full" />

          {/* اليمين — كل الباقي */}
          {rightItems.map(item => (
            <NavItem key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      </div>
    </div>
  );
}