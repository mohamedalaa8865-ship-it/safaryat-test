import { z } from 'zod';
import { Shield, MessageSquare, Activity, Share2, Banknote, ShieldCheck, History, Target, Gift, Zap } from 'lucide-react';

/**
 * @file src/types/staff.ts
 * @description SOVEREIGN STAFF IDENTITY (SSOT) - THE GOLDEN RECORD [SC-806 V7.0 - STERILIZED]
 * [SC-806 V7.0]: Diamond Sterilization. Unified financial icons and schemas.
 * [SC-701]: Agent Financial Genome Injection.
 */

// مصفوفة الصلاحيات الموحدة (مصدر الحقيقة الوحيد للواجهات - SSOT)
export const PERMISSION_MATRIX = [
  { id: 'fieldControl', label: 'إدارة الميدان', desc: 'تجميد/تفعيل (ناقل/مسافر)', icon: Shield },
  { id: 'sovereignComm', label: 'التواصل السيادي', desc: 'إرسال إشعارات رسمية', icon: MessageSquare },
  { id: 'liveMonitoring', label: 'محرك النبض', desc: 'مراقبة الدردشات الحية', icon: Activity },
  { id: 'socialMedia', label: 'الإعلام الرقمي', desc: 'إدارة وتفويض الأصول الرقمية', icon: Share2 },
  { id: 'treasury', label: 'الخزينة', desc: 'اعتماد شحن الأرصدة', icon: Banknote },
  { id: 'securityAdmin', label: 'ديوان العدالة', desc: 'إدارة سجل الكوادر والسجل القانوني', icon: History },
  { id: 'financeVault', label: 'الخزنة الماسية', desc: 'صلاحية صرف الأموال واعتماد السلف (PIN)', icon: ShieldCheck },
  { id: 'financeAnalytics', label: 'الرادار المالي', desc: 'مراقبة الموازين ودفتر الأستاذ العام', icon: Activity },
] as const;

export const StaffPermissionsSchema = z.object({
  fieldControl: z.boolean().default(false),
  sovereignComm: z.boolean().default(false),
  liveMonitoring: z.boolean().default(false),
  socialMedia: z.boolean().default(false),
  treasury: z.boolean().default(false),
  securityAdmin: z.boolean().default(false),
  financeVault: z.boolean().default(false),
  financeAnalytics: z.boolean().default(false),
});

export const StaffSchema = z.object({
  fullName: z.string().min(10, "الاسم الرباعي مطلوب (10 أحرف على الأقل)"),
  nationalId: z.string().length(10, "الرقم الوطني يجب أن يتكون من 10 خانات").regex(/^\d+$/, "أرقام فقط"),
  phoneNumber: z.string().optional(),
  email: z.string().email(),
  permissions: StaffPermissionsSchema,
  
  // [SC-806] Sovereign Role Hierarchy
  role: z.enum(['admin', 'owner', 'moderator', 'support', 'operations_manager', 'developer', 'agent']).default('support'),
  
  // [SC-806] Operational & Financial Genome
  workType: z.enum(['office', 'remote', 'hybrid']).default('office'),
  paymentSystem: z.enum(['monthly', 'hourly', 'commission']).default('monthly'),
  baseSalary: z.coerce.number().min(0).optional().default(0),
  hourlyRate: z.coerce.number().min(0).optional().default(0),
  
  // [SC-701] Agent Financial Genome
  agentTarget: z.coerce.number().min(0).optional().default(0),
  agentBonus: z.coerce.number().min(0).optional().default(0),
  commissionRate: z.coerce.number().min(0).optional().default(0),

  currency: z.string().default('JOD'),
  startDate: z.any().optional(),

  // [SC-806 V3.2] Pulse Field
  lastActivePulse: z.any().optional(), 

  createdAt: z.any(),
  isActive: z.boolean().default(true),
  tempPassword: z.string().optional(),
  authUid: z.string().optional(), 
  isFirstLogin: z.boolean().default(true),
  
  // Stats
  currentBalance: z.number().default(0),
  lifetimeEarnings: z.number().default(0),
  advancesBalance: z.number().default(0),
  pendingHours: z.number().default(0),
});

export type Staff = z.infer<typeof StaffSchema> & { id: string };
export type StaffPermissions = z.infer<typeof StaffPermissionsSchema>;
