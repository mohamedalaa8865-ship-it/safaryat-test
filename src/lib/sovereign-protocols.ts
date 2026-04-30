/**
 * @file src/lib/sovereign-protocols.ts
 * @description THE GOVERNING LAWS OF THE FORTRESS (RESTORED - SC-999-REV)
 * [SSOT]: Source of Truth for system mandates.
 */

export interface Protocol {
  id: string;
  name: string;
  mandate: string;
  color: string;
}

export const SOVEREIGN_PROTOCOLS: Protocol[] = [
  {
    id: 'P111',
    name: 'حارس الأرشيف',
    mandate: 'الرجوع الإلزامي للأرشيف السيادي قبل كل نبضة تفكير لمنع التضارب الهندسي.',
    color: 'text-primary'
  },
  {
    id: 'P14',
    name: 'الجراح الموضعي',
    mandate: 'الحقن الدقيق في السطور المحددة فقط مع الالتزام الصارم بـ CSS Freeze.',
    color: 'text-amber-500'
  },
  {
    id: 'P20',
    name: 'جهاز المناعة',
    mandate: 'تجريم الصمت البرمجي؛ كل انهيار يجب أن يوثق في الصندوق الأسود فوراً.',
    color: 'text-red-500'
  },
  {
    id: 'P30',
    name: 'دكتاتورية التوكن',
    mandate: 'السيرفر لا يصدق الواجهة؛ الحقيقة تؤخذ حصراً من الختم المشفر (JWT).',
    color: 'text-blue-500'
  },
  {
    id: 'P88',
    name: 'حماية الموارد',
    mandate: 'منع الثرثرة الشبكية؛ كل قراءة من السحابة يجب أن تكون مبررة ومحدودة.',
    color: 'text-emerald-500'
  }
];
