/**
 * @file src/app/[locale]/loading.tsx
 * @description THE ACTIVE CAMOUFLAGE (PROTOCOL 20 - LOADING)
 * Prevents UI flickering during arterial data transitions.
 */

import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container max-w-4xl mx-auto space-y-8 p-6 animate-pulse" dir="rtl">
      <header className="flex justify-between items-center">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </header>
      
      <Skeleton className="h-64 w-full rounded-[2.5rem]" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}
