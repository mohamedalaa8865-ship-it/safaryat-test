/**
 * @file src/lib/system-dna.ts
 * @description THE REINFORCED SYSTEM GENOME (SCR-2026-024 - RESTORED)
 * [SSOT]: Defines the architectural mapping of the Fortress.
 * [SCR-2026-024]: Ensuring 'zone' type-safety for visual components.
 */

export interface FileDNA {
  path: string;
  name: string;
  type: 'component' | 'hook' | 'lib' | 'page' | 'style' | 'asset';
  protocol: string; 
  securityLevel: 'red' | 'yellow' | 'green';
  description?: string;
  isLocked: boolean;
  id?: string;
  zone: 'NUCLEUS' | 'ARTERY' | 'BORDER_GUARD' | 'FIELD' | 'red' | 'yellow' | 'green'; 
  risk?: 'CRITICAL' | 'STABLE';
  protocols?: string[];
  archiveReference?: string;
}

export const SYSTEM_DNA: FileDNA[] = [
  {
    id: 'CORE_DATA',
    path: 'src/lib/data.ts',
    name: 'The Constitution (SSOT)',
    type: 'lib',
    protocol: 'P111',
    securityLevel: 'red',
    isLocked: true,
    zone: 'NUCLEUS',
    risk: 'CRITICAL',
    protocols: ['P111', 'P20'],
    description: 'النخاع الشوكي للبيانات؛ يحتوي على كافة التعريفات والأنماط السيادية للنظام.',
    archiveReference: 'SCR-2026-FUSION-V31'
  },
  {
    id: 'MW_SHIELD',
    path: 'src/middleware.ts',
    name: 'Border Guard',
    type: 'lib',
    protocol: 'P30',
    securityLevel: 'red',
    isLocked: true,
    zone: 'BORDER_GUARD',
    risk: 'CRITICAL',
    protocols: ['P30', 'P15'],
    description: 'حارس الحدود؛ يتولى التحقق من الأختام الرقمية وتوجيه المستخدمين حسب رتبهم.',
    archiveReference: 'SCR-988-FINAL'
  },
  {
    id: 'AI_REACTOR',
    path: 'src/ai/genkit.ts',
    name: 'AI Nucleus',
    type: 'lib',
    protocol: 'P13',
    securityLevel: 'yellow',
    isLocked: false,
    zone: 'NUCLEUS',
    risk: 'STABLE',
    protocols: ['P13', 'P88'],
    description: 'محرك الذكاء الاصطناعي؛ يتولى معالجة النبض الذكي ودعم اتخاذ القرار.',
    archiveReference: 'V1.0-GENKIT'
  },
  {
    id: 'ADMIN_HUD',
    path: 'src/app/[locale]/admin/owner-cockpit/page.tsx',
    name: 'Sovereign HUD',
    type: 'page',
    protocol: 'P16',
    securityLevel: 'green',
    isLocked: false,
    zone: 'ARTERY',
    risk: 'STABLE',
    protocols: ['P16', 'P13'],
    description: 'قمرة القيادة العليا للمالك؛ توفر رؤية استخباراتية شاملة لكافة العمليات.',
    archiveReference: 'SCR-942-PURIFIED'
  }
];
