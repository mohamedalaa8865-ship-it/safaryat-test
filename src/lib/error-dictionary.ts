// /**
//  * @file src/lib/error-dictionary.ts
//  * @description PROTOCOL 43: The Sovereign Error & Guidance Constitution (SSOT).
//  * Strictly maps error codes to human-centric actionable guidance.
//  * [SCR-943]: Sterilized from dead artifacts. Unified Agent Guidance.
//  */

// export interface ErrorEntry {
//   title: string;
//   description: string;
//   guidance: string;
// }

// export const SOVEREIGN_ERROR_DICTIONARY: Record<string, ErrorEntry> = {
//   // --- 🛡️ Agent Sector Errors ---
//   'MISSING_DATA_OR_PASSENGERS': {
//     title: 'بيانات الركاب ناقصة',
//     description: 'توقف سيادي: لم يتم العثور على مصفوفة الركاب الكاملة.',
//     guidance: 'عذراً أيها الوكيل، يبدو أنك نسيت ملء بيانات أحد الركاب أو لم تحدد المسار في الرادار.'
//   },
//   'UNAUTHORIZED_ACCESS': {
//     title: 'دخول غير مصرح به',
//     description: 'قواعد الأمان تمنع إتمام هذه العملية للرتبة الحالية.',
//     guidance: 'عذراً، لا تمتلك الصلاحية الكافية لهذا الإجراء. يرجى التواصل مع الإدارة المركزية.'
//   },
//   'AGENT_CAPACITY_OVERFLOW': {
//     title: 'تجاوز سعة الحافلة',
//     description: 'محاولة حجز ركاب أكثر من المقاعد المتوفرة.',
//     guidance: 'عذراً كابتن، الرحلة المختارة لا تملك مقاعد كافية لهذا العدد.'
//   },
//   'INCOMPLETE_PASSENGER_PROFILE': {
//     title: 'ملف المسافر ناقص',
//     description: 'بيانات الهوية أو الهاتف مفقودة.',
//     guidance: 'لكي تكتمل العملية السيادية، يجب إدخال اسم المسافر الرباعي ورقم هاتفه بشكل صحيح.'
//   },

//   // --- 🚗 Carrier Specific Guidance ---
//   'CARRIER_BUSY': {
//     title: 'أنت مشغول برحلة أخرى',
//     description: 'تداخل في مواعيد الرحلات النشطة.',
//     guidance: 'لديك رحلة جارية الآن في نفس التوقيت. دستور (سفريات) يمنع تشتت الناقل.'
//   },

//   // --- 🧳 Traveler Specific Guidance ---
//   'ACTIVE_BOOKING_EXISTS': {
//     title: 'لديك حجز نشط بالفعل',
//     description: 'خرق قانون الرحلة الواحدة للمسافر.',
//     guidance: 'أيها المسافر، دستور سفريات يمنع تعدد الحجوزات النشطة في وقت واحد.'
//   },
//   'TOKEN_EXPIRED': {
//     title: 'انتهت صلاحية رابط التحقق',
//     description: 'الختم الرقمي لم يعد صالحاً للاستخدام.',
//     guidance: 'أيها المسافر، لقد مر وقت طويل على طلب الحجز. يرجى العودة لصفحة الرحلة والضغط على (احجز الآن) مرة أخرى.'
//   },

//   // --- 🌐 Global Fallback ---
//   'internal': {
//     title: 'اضطراب في عقل السحابة',
//     description: 'حدث خطأ داخلي غير متوقع.',
//     guidance: 'حدث خلل فني بسيط في أنظمة جوجل. يرجى إغلاق النافذة والمحاولة مرة أخرى.'
//   },
//   'DEFAULT': {
//     title: 'توقف سيادي',
//     description: 'سلوك تقني غير متوقع.',
//     guidance: 'رصدنا حركة غير مفهومة. يرجى تحديث الصفحة، وإذا استمرت المشكلة، أخبرنا فوراً.'
//   }
// };

// export const ERROR_CODES = {
//   ERR_AGENT_ARCHIVE_FETCH: {
//     ar: "تعذر الاتصال بالخزينة التاريخية. يرجى المحاولة لاحقاً.",
//     en: "Could not connect to the historical vault. Please try again later."
//   }
// };

// export function getSovereignError(errorCode: string | undefined | null) {
//   if (!errorCode) return SOVEREIGN_ERROR_DICTIONARY['DEFAULT'];
//   const cleanCode = errorCode.toString().replace('functions/', '').toUpperCase();
//   return SOVEREIGN_ERROR_DICTIONARY[cleanCode] || SOVEREIGN_ERROR_DICTIONARY['DEFAULT'];
// }

// export function getErrorMessage(error: any, fallback: string): string {
//   if (!error) return fallback;
//   const code = typeof error === 'string' ? error : (error.code || error.message);
//   const entry = getSovereignError(code);
//   if (entry === SOVEREIGN_ERROR_DICTIONARY['DEFAULT'] && fallback) return fallback;
//   return entry.title;
// }
/**
 * @file src/lib/error-dictionary.ts
 * @description THE REINFORCED ERROR CONSTITUTION (SSOT) - V4.0 [SCR-2026-064]
 * [SCR-064]: Injected Handshake & Financial Matrix error codes.
 */

export interface ErrorEntry {
  title: string;
  description: string;
  guidance: string;
}

export const SOVEREIGN_ERROR_DICTIONARY: Record<string, ErrorEntry> = {
  // --- 🛡️ Financial & Handshake Errors (SCR-060/062/063) ---
  VOUCHER_ID_REQUIRED: {
    title: "السند الرقمي مفقود",
    description: "لا يمكن إرسال إقرار الدفع دون توليد بصمة السند الموحد.",
    guidance: "يرجى إعادة المحاولة من شاشة الدفع لتوليد الكود الموحد.",
  },
  ALREADY_VERIFIED: {
    title: "تم الختم مسبقاً",
    description: "هذا الحجز تمَّ ختمه وتأكيده مسبقاً في السجل الجنائي.",
    guidance: "أيها القائد، الحجز مؤكد بالفعل. لا حاجة لتكرار عملية التحقق.",
  },
  FINANCIAL_CONTRADICTION: {
    title: "تعارض مالي",
    description: "تم رصد محاولة ختم حجز في حالة غير صالحة (مثلاً حجز ملغى).",
    guidance: "يرجى مراجعة حالة الحجز في صندوق المهام قبل الإنفاذ.",
  },
  INSUFFICIENT_DEPOSIT: {
    title: "نقص في العربون",
    description: "القيمة المدخلة في السند لا تطابق الحد الأدنى لسياسة القطاع.",
    guidance: "تأكد من تحويل المبلغ الموضح في الفاتورة المعتمدة.",
  },

  // --- 🛡️ Agent & Staff Recruitment Errors ---
  MISSING_DATA_OR_PASSENGERS: {
    title: "بيانات غير مكتملة",
    description: "توقف سيادي: لم يتم العثور على مصفوفة البيانات الكاملة (الاسم، البريد، أو الرقم الوطني).",
    guidance: "أيها القائد، يرجى التأكد من ملء كافة الحقول، وخاصة الرقم الوطني المكون من 10 خانات.",
  },
  EMAIL_ALREADY_EXISTS: {
    title: "الحساب موجود مسبقاً",
    description: "البريد الإلكتروني المولد أو المدخل مستخدم بالفعل في سجلات القلعة.",
    guidance: "هذا الموظف مسجل مسبقاً، يرجى مراجعة سجل الكوادر للتأكد من هويته.",
  },
  INVALID_NATIONAL_ID: {
    title: "الرقم الوطني غير صالح",
    description: "يجب أن يتكون الرقم الوطني من 10 خانات رقمية دقيقة.",
    guidance: "يرجى مراجعة خانة الرقم الوطني والتأكد من عدم وجود رموز أو نقص في الأرقام.",
  },

  // --- 🛡️ Auth & Security Errors ---
  "PERMISSION-DENIED": {
    title: "وصول غير مصرح به",
    description: "قواعد الأمان تمنع إتمام هذه العملية للرتبة الحالية.",
    guidance: "عذراً، لا تمتلك الصلاحية الكافية لهذا الإجراء السيادي.",
  },
  UNAUTHENTICATED: {
    title: "انقطاع النبض الرقمي",
    description: "يجب تسجيل الدخول مرة أخرى للتحقق من الأختام.",
    guidance: "انتهت صلاحية جلسة العمل، يرجى الخروج والعودة مجدداً.",
  },
  INTERNAL: {
    title: "خلل في النخاع السحابي",
    description: "حدث خطأ داخلي غير متوقع في معالج البيانات السحابي.",
    guidance: "أيها القائد، تم توثيق الخلل في الصندوق الأسود. يرجى المحاولة بعد 30 ثانية.",
  },
  DEFAULT: {
    title: "توقف سيادي غير معروف",
    description: "سلوك تقني غير متوقع تمَّ رصده.",
    guidance: "يرجى تحديث الصفحة، وإذا استمرت المشكلة، أبلغ المبرمجين فوراً.",
  },
};

/**
 * getErrorMessage
 * [SCR-064]: Enhanced Intelligence. Prioritizes Handshake codes.
 */
export function getErrorMessage(error: any, fallback: string): string {
  if (!error) return fallback;

  const message = (error.message || "").toUpperCase();

  // High-Priority Handshake Scan
  if (message.includes("ALREADY_VERIFIED")) return SOVEREIGN_ERROR_DICTIONARY["ALREADY_VERIFIED"].description;
  if (message.includes("VOUCHER")) return SOVEREIGN_ERROR_DICTIONARY["VOUCHER_ID_REQUIRED"].description;

  for (const key of Object.keys(SOVEREIGN_ERROR_DICTIONARY)) {
    if (message.includes(key)) {
      return SOVEREIGN_ERROR_DICTIONARY[key].description;
    }
  }

  const code = typeof error === "string" ? error : error.code || "";
  const cleanCode = code.toString().replace("functions/", "").replace("auth/", "").toUpperCase();

  if (SOVEREIGN_ERROR_DICTIONARY[cleanCode]) {
    return SOVEREIGN_ERROR_DICTIONARY[cleanCode].title;
  }

  return fallback;
}
