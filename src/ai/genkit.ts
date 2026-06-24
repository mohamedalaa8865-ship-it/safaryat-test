// import { genkit } from "genkit";
// import { googleAI } from "@genkit-ai/google-genai";

// /**
//  * @file src/ai/genkit.ts
//  * @description THE REINFORCED AI NUCLEUS (STERILIZED - V1.0)
//  * Protocol 13: Using Genkit 1.x Sovereign Stack.
//  * Protocol 88: Resource Protected via Flash Model.
//  */

// export const ai = genkit({
//   plugins: [googleAI()],
//   // model: 'googleai/gemini-1.5-flash', // Efficient & Fast for Real-time Ops
//   model: "googleai/gemini-2.0-flash",
// });

import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

/**
 * @file src/ai/genkit.ts
 * @description THE REINFORCED AI NUCLEUS (STERILIZED - V1.0)
 * حل مشكلة توثيق مفاتيح AQ عبر تعيين الـ baseUrl والـ apiVersion يدوياً
 */

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY,
      // نحدد هنا الرابط والإصدار بدقة ليتوافق مع صلاحيات مفتاح الـ AQ
      baseUrl: "https://generativelanguage.googleapis.com",
      apiVersion: "v1beta",
    }),
  ],
  model: "googleai/gemini-2.0-flash",
});
