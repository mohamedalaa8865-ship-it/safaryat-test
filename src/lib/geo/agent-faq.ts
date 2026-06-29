/**
 * @file src/lib/geo/agent-faq.ts
 * @description Single Source of Truth (SSOT) for field-agent-facing Q&A.
 * Same pattern as traveler-faq.ts / carrier-faq.ts.
 */

export interface AgentFaqEntry {
  id: string;
  question: string;
  answer: string;
  category: "proxy-booking" | "commission" | "rewards" | "security";
}

export const AGENT_FAQ: AgentFaqEntry[] = [
  // ---------- proxy-booking ----------
  {
    id: "how-to-find-trip-for-traveler",
    category: "proxy-booking",
    question: "إزاي أدور على رحلة أو ناقل لمسافر بتاعي؟",
    answer: 'من شاشة "سحاب الوكيل"، استخدم "رادار الاستكشاف" لتلاقي الرحلات المجدولة أو الناقلين المتاحين على المسار اللي يحتاجه مسافرك.',
  },
  {
    id: "how-proxy-booking-link-works",
    category: "proxy-booking",
    question: '"نموذج الحجز بالإنابة" بيعمل إيه؟',
    answer:
      "بعد ما تنسّق مع الناقل على السعر والعمولة، تستخدم نموذج الحجز بالإنابة لتوليد رابط حجز خاص (الرابط السحري) ترسله لمسافرك، وهو من خلاله يكمّل التفاصيل والتأكيد من جهته.",
  },
  {
    id: "agent-cockpit-purpose",
    category: "proxy-booking",
    question: '"قمرة القيادة" بتعمل إيه؟',
    answer: "من قمرة القيادة تقدر تدير هويتك الرقمية، تراجع سجل الأمان الخاص بحسابك، وتطلع على الأرشيف الميداني لكل عملياتك السابقة كوكيل.",
  },
  // ---------- commission ----------
  {
    id: "commission-agreement-where",
    category: "commission",
    question: "العمولة بيني وبين الناقل بتتفق عليها فين؟",
    answer:
      "الاتفاق على العمولة بينك وبين الناقل يتم بينكما مباشرة (خارج تنفيذ المساعد الذكي)، وبعد الاتفاق تستخدم نموذج الحجز بالإنابة لتوليد رابط الحجز بناءً على ما اتفقتما عليه.",
  },
  // ---------- rewards ----------
  {
    id: "achievements-counter-meaning",
    category: "rewards",
    question: '"عداد الإنجازات" بيحسب إيه بالظبط؟',
    answer:
      "عداد الإنجازات بيراقب نشاطك الميداني كوكيل (مثل عدد عمليات الحجز بالإنابة التي أكملتها)، وتقدر تشوف إجماليه في قمرة القيادة كمؤشر على تقدمك نحو أي مكافآت متاحة.",
  },
  // ---------- security ----------
  {
    id: "security-log-purpose",
    category: "security",
    question: "سجل الأمان في قمرة القيادة ده ليه؟",
    answer: "سجل الأمان يوضح لك نشاط حسابك (مثل عمليات تسجيل الدخول والإجراءات المهمة)، وهو موجود لحمايتك من أي استخدام غير معروف لحسابك.",
  },
];

export function getAgentFaqByCategory(categories: AgentFaqEntry["category"][]): AgentFaqEntry[] {
  return AGENT_FAQ.filter((entry) => categories.includes(entry.category));
}

export function formatAgentFaqForPrompt(entries: AgentFaqEntry[] = AGENT_FAQ): string {
  return entries.map((e) => `س: ${e.question}\nج: ${e.answer}`).join("\n\n");
}
