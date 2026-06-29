/**
 * @file src/lib/geo/carrier-faq.ts
 * @description Single Source of Truth (SSOT) for carrier-facing Q&A.
 * Same pattern as traveler-faq.ts: grounds the in-app assistant for
 * carriers, and can later back a public /carrier-faq page for GEO.
 *
 * Rules for adding entries: see traveler-faq.ts header comment.
 */

export interface CarrierFaqEntry {
  id: string;
  question: string;
  answer: string;
  category: "opportunities" | "bookings" | "trip-management" | "payment" | "subscription" | "profile";
}

export const CARRIER_FAQ: CarrierFaqEntry[] = [
  // ---------- opportunities (سوق الطلبات) ----------
  {
    id: "how-to-find-passengers",
    category: "opportunities",
    question: "إزاي أدور على ركاب يحتاجوا رحلة؟",
    answer:
      'من شاشة "سوق الطلبات"، تقدر تشوف الركاب اللي عملوا طلب حجز خاص على مسارات قريبة منك. لكل طلب، اضغط "تقديم عرض سعر" لترسل سعرك وشروطك مباشرة للمسافر. لو محتاج مساعدة في تحديد سعر منافس، استخدم زر "AI" اللي بيقترح لك سعراً يضمن لك ربح معقول مع زيادة فرصة قبول الطلب.',
  },
  {
    id: "ai-price-suggestion-binding",
    category: "opportunities",
    question: "السعر اللي بيقترحه الـ AI، هل ده سعر نهائي وملزم؟",
    answer:
      'لا، السعر المقترح من الـ AI هو اقتراح فقط لمساعدتك على المنافسة، وأنت اللي تقرر السعر النهائي اللي ترسله للمسافر. لا يتم إرسال أو تأكيد أي عرض سعر تلقائياً بدون ضغطك على زر "تقديم عرض سعر" بنفسك.',
  },
  // ---------- bookings (صندوق المهام) ----------
  {
    id: "how-to-accept-booking",
    category: "bookings",
    question: "وصلني طلب حجز، أعمل إيه؟",
    answer: 'روح شاشة "صندوق المهام"، هتلاقي الحجوزات المنتظرة موافقتك. اضغط "قبول" لتبدأ الرحلة رسمياً معاه، أو "رفض" لو مش متاح في هذا التوقيت.',
  },
  {
    id: "what-is-passenger-transfer",
    category: "bookings",
    question: '"نقل الركاب" ده يعني إيه؟',
    answer:
      'هي ميزة طوارئ بتسمح لناقل زميل ينقل ركابه لناقل تاني (زيك) في حالة عطل أو مشكلة مفاجئة، عشان الرحلة ما تتأثرش والركاب يوصلوا. لو وصلك طلب نقل ركاب من زميل، هتلاقيه في شاشة "صندوق المهام" كمان.',
  },
  // ---------- trip-management ----------
  {
    id: "passenger-manifest",
    category: "trip-management",
    question: '"كشف الركاب" بيستخدم في إيه؟',
    answer: 'من شاشة "إدارة رحلاتك"، زر "كشف الركاب" بيطبع لك القائمة الرسمية بأسماء ركابك، وده مهم جداً للرحلات اللي بتعبر حدود بين الدول.',
  },
  {
    id: "when-to-use-passenger-transfer",
    category: "trip-management",
    question: 'إمتى أستخدم زر "نقل الركاب" كناقل؟',
    answer:
      "استخدمه فقط في حالة طوارئ حقيقية (مثل عطل في سيارتك) ومش قادر تكمل الرحلة. الزر ده بيرسل ركابك لناقل زميل متاح بدلاً منك، وده بيحمي سمعتك بدل ما تلغي الرحلة وتسيب الركاب بدون حل.",
  },
  // ---------- payment ----------
  {
    id: "how-deposit-received",
    category: "payment",
    question: "العربون بييجي لي إزاي؟",
    answer:
      'المسافر بيحوّل العربون مباشرة على بيانات الاستلام اللي إنت حددتها في شاشة "بيانات مركبتك ودفعك" (كاش أو محفظة رقمية). لازم تتأكد إن البيانات دي دقيقة ومحدثة لأن المسافر بيقرأها مباشرة من شاشته.',
  },
  {
    id: "deposit-percentage",
    category: "payment",
    question: "نسبة العربون قد إيه من السعر الكامل؟",
    answer: "النسبة الافتراضية للعربون هي 20% من السعر الإجمالي المتفق عليه، وتظهر بوضوح في تفاصيل الحجز لكل من المسافر وأنت قبل التأكيد.",
  },
  {
    id: "platform-fee-explained",
    category: "payment",
    question: "رسوم المنصة دي إيه، ومنفصلة عن العربون؟",
    answer:
      "نعم، رسوم المنصة منفصلة عن العربون. العربون يتحول من المسافر لك مباشرة كضمان للحجز، أما رسوم المنصة فهي مستحقة على الناقل لاستخدام خدمات سفريات، وتظهر في حسابك مع أي خصومات معتمدة إن وجدت.",
  },
  // ---------- subscription ----------
  {
    id: "subscription-grace-period",
    category: "subscription",
    question: "فترة السماح المجانية يعني إيه؟",
    answer:
      'هي عدد الأيام المتاحة لك لاستخدام المنصة مجاناً قبل الحاجة لتجديد الاشتراك. تقدر تشوف عدد الأيام المتبقية لك في بطاقة "حالة الاشتراك" في الشاشة الرئيسية لغرفة العمليات.',
  },
  {
    id: "how-to-renew-subscription",
    category: "subscription",
    question: "أجدد اشتراكي إزاي؟",
    answer:
      'من بطاقة "حالة الاشتراك" في غرفة العمليات، اضغط زر "تجديد" وده هيوديك لمتجر الطاقة لشحن رصيدك واستمرار استخدام المنصة بعد انتهاء فترة السماح.',
  },
  // ---------- profile ----------
  {
    id: "why-update-profile-photo",
    category: "profile",
    question: "ليه لازم أحدّث صورتي الشخصية؟",
    answer: "صورتك واسمك هما أول حاجة المسافر بيتعرف بيها عليك في نقطة الالتقاء، فصورة واضحة وحديثة بتسهّل عليه التعرف عليك وتزيد ثقته فيك كناقل.",
  },
];

export function getCarrierFaqByCategory(categories: CarrierFaqEntry["category"][]): CarrierFaqEntry[] {
  return CARRIER_FAQ.filter((entry) => categories.includes(entry.category));
}

export function formatCarrierFaqForPrompt(entries: CarrierFaqEntry[] = CARRIER_FAQ): string {
  return entries.map((e) => `س: ${e.question}\nج: ${e.answer}`).join("\n\n");
}
