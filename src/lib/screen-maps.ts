/**
 * @file src/lib/screen-maps.ts
 * @description THE SOVEREIGN SCREEN MANIFEST (STERILIZED - V1.0 - SCR-872)
 * Protocol 16: Diamond Sterilization. Centralized UI awareness for AI.
 * Protocol 88: Minimalist descriptions to preserve context tokens.
 */

export const CARRIER_SCREEN_MAP: Record<string, string> = {
  '/carrier': 'لوحة القيادة: زر الحالة (متاح/مشغول) للظهور في السوق، رصيد المحفظة، والوصول السريع لمهام اليوم القادمة.',
  '/carrier/opportunities': 'سوق الفرص (الرادار): زر "تقديم عرض سعر"، فلاتر المسار الجغرافي، والبطاقات الوامضة للطلبات العاجلة.',
  '/carrier/trips': 'إدارة الرحلات: زر "تأكيد الانطلاق"، زر "وثّق الوصول" لإنهاء الرحلة، وزر "نقل الركاب" (🔄) لحالات الطوارئ.',
  '/carrier/bookings': 'صندوق المهام: مراجعة طلبات الحجز المعلقة، العروض المباشرة، وطلبات النقل الواردة من الزملاء لاتخاذ قرار القبول/الرفض.',
  '/carrier/Permanent': 'الشروط الدائمة: تحديث بيانات المركبة (النوع، السعة، اللوحة)، وتفاصيل استلام العربون (كاش/كليك).',
};

/**
 * @function getScreenContext
 * @description Resolves the current URL path to a functional UI description.
 */
export function getScreenContext(path: string): string {
  if (!path) return 'شاشة غير معروفة.';
  
  // Strip locale and query params for mapping
  const cleanPath = path.split('?')[0].replace(/^\/(ar|en)/, '') || '/';
  
  return CARRIER_SCREEN_MAP[cleanPath] || 'شاشة عامة في نظام سفريات.';
}
