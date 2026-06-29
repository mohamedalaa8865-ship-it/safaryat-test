/**
 * @file src/lib/geo/traveler-faq.ts
 * @description Single Source of Truth (SSOT) for traveler-facing Q&A.
 * Used in two places:
 *  1. The in-app assistant (ask-ai-flow) — injected as grounding context so it
 *     answers from real, approved facts instead of improvising.
 *  2. The public FAQ page (/faq) — rendered as visible content AND wrapped in
 *     FAQPage JSON-LD schema, so AI search engines (ChatGPT, Perplexity,
 *     Google AI Overviews) can extract and cite it directly.
 *
 * Rules for adding entries:
 *  - answer must be true today, in the live app. Don't describe a feature
 *    that doesn't exist yet, even if it's planned.
 *  - keep answers self-contained: a reader (human or AI) should understand
 *    the answer without needing the question's exact wording.
 *  - phrase questions the way a real user would type/ask them, not as
 *    marketing headlines.
 */

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  /** Used to group related questions on the FAQ page and to scope what the
   *  assistant retrieves for a given screen. */
  category: "booking" | "payment" | "ticket" | "cancellation" | "communication" | "account" | "cross-border";
}

export const TRAVELER_FAQ: FaqEntry[] = [
  // ---------- booking ----------
  {
    id: "how-to-book",
    category: "booking",
    question: "إزاي أحجز رحلة على سفريات؟",
    answer:
      'من شاشة البحث، اختر دولة ومدينة الانطلاق، ثم الوجهة، وعدد المقاعد المطلوبة، واضغط بحث. هتظهر لك الرحلات المجدولة المتاحة على نفس المسار. لو مفيش رحلة مناسبة لتوقيتك، تقدر تضغط على "إنشاء طلب خاص" عشان طلبك يظهر للناقلين المتاحين ويقدّموا عروضهم.',
  },
  {
    id: "no-matching-trip",
    category: "booking",
    question: "مفيش رحلة مطابقة لمواعيدي، أعمل إيه؟",
    answer:
      'استخدم زر "إنشاء طلب خاص" في شاشة البحث. طلبك هيظهر للناقلين في سوق الفرص، وأي ناقل متاح في نفس المسار يقدر يقدّم لك عرض سعر مباشرة. هتلاقي العروض اللي توصلك في شاشة "غرفة عمليات الحجز".',
  },
  {
    id: "booking-status-meaning",
    category: "booking",
    question: "حالات الحجز يعني إيه (بانتظار العروض، بانتظار الدفع، تذكرة مؤكدة)؟",
    answer:
      '"بانتظار العروض" يعني طلبك منشور والناقلين بيشوفوه ولسه مفيش رد. "بانتظار الدفع" يعني ناقل وافق على طلبك وعليك تحويل العربون لتأكيد الحجز. "تذكرة مؤكدة" يعني الحجز تم بالكامل والتذكرة بقت جاهزة وده ضمانك الرسمي للركوب.',
  },
  // ---------- payment ----------
  {
    id: "what-is-deposit",
    category: "payment",
    question: "العربون ده إيه، وهو إجباري؟",
    answer:
      'العربون هو جزء من سعر الرحلة بيتحول للناقل عند تأكيد العرض، ضماناً لحجز المقعد لطرفين (المسافر والناقل). المبلغ ونسبته من إجمالي السعر يظهرلك بوضوح في تفاصيل الحجز قبل ما توافق، ولازم تحوله عشان تتحول حالة حجزك من "بانتظار الدفع" إلى "تذكرة مؤكدة".',
  },
  {
    id: "how-to-pay-deposit",
    category: "payment",
    question: "أحوّل العربون إزاي؟",
    answer:
      "بعد ما الناقل يوافق على طلبك، هتظهر لك في شاشة الحجز بيانات استلام الدفع الخاصة بالناقل (كاش أو محفظة رقمية حسب ما حدده). تحوّل المبلغ المطلوب مباشرة للناقل بنفس البيانات الظاهرة، وبعد التأكيد بتتحول حالة حجزك لتذكرة مؤكدة.",
  },
  {
    id: "payment-goes-to-platform-or-carrier",
    category: "payment",
    question: "العربون بيروح لمنصة سفريات ولا للناقل مباشرة؟",
    answer: "العربون بيتحول مباشرة للناقل على بيانات الاستلام اللي هو حددها (كاش أو محفظة)، وده موضح لك بوضوح في شاشة الحجز قبل التحويل.",
  },
  // ---------- ticket ----------
  {
    id: "what-is-digital-ticket",
    category: "ticket",
    question: "التذكرة الذكية ده إيه بالظبط؟",
    answer:
      "هي المستند الرسمي لحجزك بعد تأكيده. تحتوي على رمز QR تعرضه للناقل عند الركوب، وتفاصيل نقطة الالتقاء، وبيانات المركبة. تقدر تفتحها من شاشة التذكرة في أي وقت قبل رحلتك.",
  },
  {
    id: "confirm-arrival-meaning",
    category: "ticket",
    question: 'زر "وثّق الوصول" في شاشة التذكرة بيعمل إيه؟',
    answer:
      "تستخدمه وقت ما تركب الحافلة فعلياً، وهو بيأكد رسمياً إنك بدأت رحلتك على هذا المسار. ده بيوثق حقك في حالة أي خلاف لاحق، وبيساعد الناقل في تحديث حالة الرحلة.",
  },
  // ---------- cancellation ----------
  {
    id: "can-i-cancel",
    category: "cancellation",
    question: "أقدر ألغي حجزي بعد ما يتأكد؟",
    answer:
      'الإلغاء بعد تأكيد الحجز له شروط متعلقة بالعربون المدفوع وتوقيت الإلغاء بالنسبة لوقت الرحلة. للحالات المحددة وسياسة الاسترداد، تواصل مع خدمة العملاء أو راجع تفاصيل حجزك في شاشة "غرفة عمليات الحجز" لمعرفة الخيارات المتاحة لحالتك بالتحديد.',
  },
  {
    id: "carrier-cancels-on-me",
    category: "cancellation",
    question: "الناقل لغى أو مقدر يوصل، يحصل إيه؟",
    answer:
      'لو الناقل مش قادر يكمل الرحلة، فيه آلية "نقل الركاب" تتيح له تحويلك لناقل زميل بنفس مستوى الخدمة. لو حصلت مشكلة ومفيش بديل مناسب، تواصل فوراً مع خدمة العملاء عبر التطبيق لمتابعة حالتك.',
  },
  // ---------- communication ----------
  {
    id: "how-to-contact-carrier",
    category: "communication",
    question: "أتواصل مع الناقل إزاي قبل الرحلة؟",
    answer:
      'من شاشة "مركز المحادثات" تقدر تتواصل مباشرة مع الناقل المسؤول عن حجزك، لتنسيق تفاصيل زي نقطة اللقاء بالضبط أو الأمتعة. المحادثات موثقة في النظام لحماية حقك في حالة أي خلاف.',
  },
  // ---------- account ----------
  {
    id: "why-accurate-name",
    category: "account",
    question: "ليه لازم اسمي يكون مطابق للهوية في الملف الشخصي؟",
    answer:
      "اسمك الرباعي في الملف الشخصي بيُستخدم في تفاصيل التذكرة، وخصوصاً في الرحلات بين الدول لازم يكون مطابقاً تماماً لاسمك في وثيقة الهوية أو جواز السفر لتسهيل إجراءات العبور على الحدود.",
  },
  // ---------- cross-border ----------
  {
    id: "which-countries-supported",
    category: "cross-border",
    question: "سفريات بتغطي سفر بين أي دول؟",
    answer:
      "المنصة تغطي حالياً رحلات داخل وبين: الأردن، السعودية، الإمارات، العراق، سوريا، لبنان، مصر، وفلسطين. المدن المتاحة لكل دولة تظهر لك مباشرة عند اختيار دولة الانطلاق والوجهة في شاشة البحث.",
  },
  {
    id: "currency-per-country",
    category: "cross-border",
    question: "الأسعار بتظهر بعملة إيه؟",
    answer:
      "السعر يظهر بالعملة المحلية لدولة الرحلة (مثلاً الدينار الأردني للرحلات من الأردن، الريال السعودي للرحلات من السعودية، الجنيه المصري لمصر، وكذلك لباقي الدول المدعومة).",
  },
];

/** Returns FAQ entries for one or more categories — used to scope what the
 *  in-app assistant retrieves based on the screen the user is on. */
export function getFaqByCategory(categories: FaqEntry["category"][]): FaqEntry[] {
  return TRAVELER_FAQ.filter((entry) => categories.includes(entry.category));
}

/** Renders the FAQ bank as a compact text block to inject into the
 *  assistant's system prompt as grounding context. */
export function formatFaqForPrompt(entries: FaqEntry[] = TRAVELER_FAQ): string {
  return entries.map((e) => `س: ${e.question}\nج: ${e.answer}`).join("\n\n");
}
