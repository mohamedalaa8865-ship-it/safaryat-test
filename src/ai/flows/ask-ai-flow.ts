// // // 'use server';
// // // /**
// // //  * @fileOverview Sovereign Assistant AI Flow.
// // //  *
// // //  * - askAi - A function that handles general AI assistance queries based on role-based context.
// // //  * - AskAiInput - The input type for the askAi function.
// // //  * - AskAiOutput - The return type for the askAi function.
// // //  */

// // // import { ai } from '@/ai/genkit';
// // // import { z } from 'genkit';
// // // import { TRAVELER_SOVEREIGN_PROMPT, CARRIER_SOVEREIGN_PROMPT, OWNER_SOVEREIGN_PROMPT } from '@/lib/role-prompts';
// // // import { AGENT_SOVEREIGN_PROMPT } from '@/lib/agent-sovereign-prompt';
// // // import { getScreenContext } from '@/lib/screen-maps';

// // // const AskAiInputSchema = z.object({
// // //   question: z.string().describe('The user\'s question.'),
// // //   context: z.object({
// // //     path: z.string().describe('The current page path.'),
// // //     role: z.string().describe('The current user role.'),
// // //   }),
// // // });
// // // export type AskAiInput = z.infer<typeof AskAiInputSchema>;

// // // const AskAiOutputSchema = z.object({
// // //   answerText: z.string().describe('The AI generated response.'),
// // // });
// // // export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;

// // // export async function askAi(input: AskAiInput): Promise<AskAiOutput> {
// // //   return askAiFlow(input);
// // // }

// // // const askAiFlow = ai.defineFlow(
// // //   {
// // //     name: 'askAiFlow',
// // //     inputSchema: AskAiInputSchema,
// // //     outputSchema: AskAiOutputSchema,
// // //   },
// // //   async (input) => {
// // //     const screenPurpose = getScreenContext(input.context.path);

// // //     let systemPrompt = '';
// // //     const role = input.context.role.toLowerCase();

// // //     // ATOMIC ROLE SELECTION (SSOT)
// // //     if (role === 'carrier') systemPrompt = CARRIER_SOVEREIGN_PROMPT;
// // //     else if (role === 'agent') systemPrompt = AGENT_SOVEREIGN_PROMPT;
// // //     else if (role === 'owner' || role === 'admin') systemPrompt = OWNER_SOVEREIGN_PROMPT;
// // //     else systemPrompt = TRAVELER_SOVEREIGN_PROMPT;

// // //     const response = await ai.generate({
// // //       system: `${systemPrompt}\n\n[CONTEXTUAL_AWARENESS]\nYou are currently assisting the user on the screen: ${input.context.path}.\nScreen Purpose: ${screenPurpose}\nEnsure your advice is specific to this context.`,
// // //       prompt: input.question,
// // //     });

// // //     return { answerText: response.text };
// // //   }
// // // );

// // "use server";
// // /**
// //  * @fileOverview Sovereign Assistant AI Flow.
// //  *
// //  * - askAi - A function that handles general AI assistance queries based on role-based context.
// //  * - AskAiInput - The input type for the askAi function.
// //  * - AskAiOutput - The return type for the askAi function.
// //  */

// // import { ai } from "@/ai/genkit";
// // import { z } from "genkit";
// // import { TRAVELER_SOVEREIGN_PROMPT, CARRIER_SOVEREIGN_PROMPT, OWNER_SOVEREIGN_PROMPT } from "@/lib/role-prompts";
// // import { AGENT_SOVEREIGN_PROMPT } from "@/lib/agent-sovereign-prompt";
// // import { getScreenContext } from "@/lib/screen-maps";
// // import { TRAVELER_FAQ, formatFaqForPrompt } from "@/lib/geo/traveler-faq";

// // const AskAiInputSchema = z.object({
// //   question: z.string().describe("The user's question."),
// //   context: z.object({
// //     path: z.string().describe("The current page path."),
// //     role: z.string().describe("The current user role."),
// //   }),
// // });
// // export type AskAiInput = z.infer<typeof AskAiInputSchema>;

// // const AskAiOutputSchema = z.object({
// //   answerText: z.string().describe("The AI generated response."),
// // });
// // export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;

// // export async function askAi(input: AskAiInput): Promise<AskAiOutput> {
// //   return askAiFlow(input);
// // }

// // const askAiFlow = ai.defineFlow(
// //   {
// //     name: "askAiFlow",
// //     inputSchema: AskAiInputSchema,
// //     outputSchema: AskAiOutputSchema,
// //   },
// //   async (input) => {
// //     const screenPurpose = getScreenContext(input.context.path);

// //     let systemPrompt = "";
// //     const role = input.context.role.toLowerCase();

// //     // ATOMIC ROLE SELECTION (SSOT)
// //     if (role === "carrier") systemPrompt = CARRIER_SOVEREIGN_PROMPT;
// //     else if (role === "agent") systemPrompt = AGENT_SOVEREIGN_PROMPT;
// //     else if (role === "owner" || role === "admin") systemPrompt = OWNER_SOVEREIGN_PROMPT;
// //     else systemPrompt = TRAVELER_SOVEREIGN_PROMPT;

// //     // Ground the traveler assistant in the approved FAQ bank (same content
// //     // published on /faq with FAQPage schema) so it answers from verified
// //     // facts instead of improvising on sensitive topics like payment or
// //     // cancellation policy.
// //     const groundingContext =
// //       role === "carrier" || role === "agent" || role === "owner" || role === "admin"
// //         ? ""
// //         : `\n\n[KNOWLEDGE_BASE]\nاستخدم هذه الأسئلة والأجوبة المعتمدة كمرجع أساسي لإجاباتك. إذا كان سؤال المستخدم مطابقاً أو قريباً من أحدها، اعتمد على هذه الإجابة بدلاً من توليد إجابة جديدة:\n\n${formatFaqForPrompt(TRAVELER_FAQ)}`;

// //     const response = await ai.generate({
// //       system: `${systemPrompt}\n\n[CONTEXTUAL_AWARENESS]\nYou are currently assisting the user on the screen: ${input.context.path}.\nScreen Purpose: ${screenPurpose}\nEnsure your advice is specific to this context.${groundingContext}`,
// //       prompt: input.question,
// //     });

// //     return { answerText: response.text };
// //   },
// // );

// "use server";
// /**
//  * @fileOverview Sovereign Assistant AI Flow.
//  *
//  * - askAi - A function that handles general AI assistance queries based on role-based context.
//  * - AskAiInput - The input type for the askAi function.
//  * - AskAiOutput - The return type for the askAi function.
//  */

// import { ai } from "@/ai/genkit";
// import { z } from "genkit";
// import { TRAVELER_SOVEREIGN_PROMPT, CARRIER_SOVEREIGN_PROMPT, OWNER_SOVEREIGN_PROMPT } from "@/lib/role-prompts";
// import { AGENT_SOVEREIGN_PROMPT } from "@/lib/agent-sovereign-prompt";
// import { getScreenContext } from "@/lib/screen-maps";
// import { TRAVELER_FAQ, formatFaqForPrompt } from "@/lib/geo/traveler-faq";

// const AskAiInputSchema = z.object({
//   question: z.string().describe("The user's question."),
//   context: z.object({
//     path: z.string().describe("The current page path."),
//     role: z.string().describe("The current user role."),
//   }),
// });
// export type AskAiInput = z.infer<typeof AskAiInputSchema>;

// const AskAiOutputSchema = z.object({
//   answerText: z.string().describe("The AI generated response."),
// });
// export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;

// export async function askAi(input: AskAiInput): Promise<AskAiOutput> {
//   return askAiFlow(input);
// }

// const askAiFlow = ai.defineFlow(
//   {
//     name: "askAiFlow",
//     inputSchema: AskAiInputSchema,
//     outputSchema: AskAiOutputSchema,
//   },
//   async (input) => {
//     const screenPurpose = getScreenContext(input.context.path);

//     let systemPrompt = "";
//     const role = input.context.role.toLowerCase();

//     // ATOMIC ROLE SELECTION (SSOT)
//     if (role === "carrier") systemPrompt = CARRIER_SOVEREIGN_PROMPT;
//     else if (role === "agent") systemPrompt = AGENT_SOVEREIGN_PROMPT;
//     else if (role === "owner" || role === "admin") systemPrompt = OWNER_SOVEREIGN_PROMPT;
//     else systemPrompt = TRAVELER_SOVEREIGN_PROMPT;

//     // Ground the traveler assistant in the approved FAQ bank (same content
//     // published on /faq with FAQPage schema) so it answers from verified
//     // facts instead of improvising on sensitive topics like payment or
//     // cancellation policy.
//     const groundingContext =
//       role === "carrier" || role === "agent" || role === "owner" || role === "admin"
//         ? ""
//         : `\n\n[KNOWLEDGE_BASE]\nاستخدم هذه الأسئلة والأجوبة المعتمدة كمرجع أساسي لإجاباتك. إذا كان سؤال المستخدم مطابقاً أو قريباً من أحدها، اعتمد على هذه الإجابة بدلاً من توليد إجابة جديدة:\n\n${formatFaqForPrompt(TRAVELER_FAQ)}`;

//     const response = await ai.generate({
//       system: `${systemPrompt}\n\n[CONTEXTUAL_AWARENESS]\nYou are currently assisting the user on the screen: ${input.context.path}.\nScreen Purpose: ${screenPurpose}\nEnsure your advice is specific to this context.${groundingContext}\n\n[FORMATTING_RULES — applies in every language, Arabic or English]\nReply in the same language the user wrote in. Never use Markdown formatting symbols such as **, *, #, or - (the UI renders plain text only, so these symbols would appear literally to the user). When listing sequential steps, number them as "1.", "2.", "3." with each step on its own line (a real line break between steps), and do not add any sub-bullets, asterisks, or nested formatting inside a step — write each step as one plain sentence. Do not introduce names, screens, or details that are not already part of the knowledge base provided above; if translating to English, translate the meaning only and keep the same level of detail as the Arabic source, without adding extra explanations.`,
//       prompt: input.question,
//     });

//     return { answerText: response.text };
//   },
// );

"use server";
/**
 * @fileOverview Sovereign Assistant AI Flow.
 *
 * - askAi - A function that handles general AI assistance queries based on role-based context.
 * - AskAiInput - The input type for the askAi function.
 * - AskAiOutput - The return type for the askAi function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { TRAVELER_SOVEREIGN_PROMPT, CARRIER_SOVEREIGN_PROMPT, OWNER_SOVEREIGN_PROMPT } from "@/lib/role-prompts";
import { AGENT_SOVEREIGN_PROMPT } from "@/lib/agent-sovereign-prompt";
import { getScreenContext } from "@/lib/screen-maps";
import { TRAVELER_FAQ, formatFaqForPrompt } from "@/lib/geo/traveler-faq";
import { CARRIER_FAQ, formatCarrierFaqForPrompt } from "@/lib/geo/carrier-faq";
import { AGENT_FAQ, formatAgentFaqForPrompt } from "@/lib/geo/agent-faq";
// import { CARRIER_FAQ, formatCarrierFaqForPrompt } from "@/lib/geo/carrier-faq";
// import { AGENT_FAQ, formatAgentFaqForPrompt } from "@/lib/geo/agent-faq";

const AskAiInputSchema = z.object({
  question: z.string().describe("The user's question."),
  context: z.object({
    path: z.string().describe("The current page path."),
    role: z.string().describe("The current user role."),
  }),
});
export type AskAiInput = z.infer<typeof AskAiInputSchema>;

const AskAiOutputSchema = z.object({
  answerText: z.string().describe("The AI generated response."),
});
export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;

export async function askAi(input: AskAiInput): Promise<AskAiOutput> {
  return askAiFlow(input);
}

const askAiFlow = ai.defineFlow(
  {
    name: "askAiFlow",
    inputSchema: AskAiInputSchema,
    outputSchema: AskAiOutputSchema,
  },
  async (input) => {
    const screenPurpose = getScreenContext(input.context.path);

    let systemPrompt = "";
    const role = input.context.role.toLowerCase();

    // ATOMIC ROLE SELECTION (SSOT)
    let roleLabel = "";
    if (role === "carrier") {
      systemPrompt = CARRIER_SOVEREIGN_PROMPT;
      roleLabel = "الناقل (Carrier)";
    } else if (role === "agent") {
      systemPrompt = AGENT_SOVEREIGN_PROMPT;
      roleLabel = "الوكيل الميداني (Agent)";
    } else if (role === "owner" || role === "admin") {
      systemPrompt = OWNER_SOVEREIGN_PROMPT;
      roleLabel = "المسؤول/الإدارة (Owner/Admin)";
    } else {
      systemPrompt = TRAVELER_SOVEREIGN_PROMPT;
      roleLabel = "المسافر (Traveler)";
    }

    // Ground the assistant in the approved FAQ bank for its specific role
    // (same content that can be published on a public FAQ page with
    // FAQPage schema) so it answers from verified facts instead of
    // improvising on sensitive topics like payment or cancellation policy.
    let groundingContext = "";
    if (role === "carrier") {
      groundingContext = `\n\n[KNOWLEDGE_BASE]\nاستخدم هذه الأسئلة والأجوبة المعتمدة كمرجع أساسي لإجاباتك. إذا كان سؤال المستخدم مطابقاً أو قريباً من أحدها، اعتمد على هذه الإجابة بدلاً من توليد إجابة جديدة:\n\n${formatCarrierFaqForPrompt(CARRIER_FAQ)}`;
    } else if (role === "agent") {
      groundingContext = `\n\n[KNOWLEDGE_BASE]\nاستخدم هذه الأسئلة والأجوبة المعتمدة كمرجع أساسي لإجاباتك. إذا كان سؤال المستخدم مطابقاً أو قريباً من أحدها، اعتمد على هذه الإجابة بدلاً من توليد إجابة جديدة:\n\n${formatAgentFaqForPrompt(AGENT_FAQ)}`;
    } else if (role !== "owner" && role !== "admin") {
      // traveler (default)
      groundingContext = `\n\n[KNOWLEDGE_BASE]\nاستخدم هذه الأسئلة والأجوبة المعتمدة كمرجع أساسي لإجاباتك. إذا كان سؤال المستخدم مطابقاً أو قريباً من أحدها، اعتمد على هذه الإجابة بدلاً من توليد إجابة جديدة:\n\n${formatFaqForPrompt(TRAVELER_FAQ)}`;
    }

    // Scope guard: if the user's question clearly belongs to a different
    // role's domain, the assistant should say so instead of answering from
    // general knowledge — it only has a verified knowledge base for its own role.
    const scopeGuard = `\n\n[SCOPE_GUARD]\nأنت مخصص لمساعدة ${roleLabel} فقط، وقاعدة معرفتك المعتمدة أعلاه (لو وجدت) خاصة بهذا الدور فقط. لو سأل المستخدم سؤالاً يخص دوراً آخر بوضوح (مثلاً سؤال عن شاشات أو عمليات خاصة بمسافر بينما أنت تخدم ناقلاً، أو العكس)، وضّح له بأدب أنك مساعد ${roleLabel} وأن هذا السؤال خارج نطاقك، واقترح عليه التواصل مع الدعم أو استخدام الحساب المناسب لذلك الدور، بدلاً من الإجابة من معرفتك العامة.`;

    const response = await ai.generate({
      system: `${systemPrompt}\n\n[CONTEXTUAL_AWARENESS]\nYou are currently assisting the user on the screen: ${input.context.path}.\nScreen Purpose: ${screenPurpose}\nEnsure your advice is specific to this context.${groundingContext}${scopeGuard}\n\n[FORMATTING_RULES — applies in every language, Arabic or English]\nReply in the same language the user wrote in. Never use Markdown formatting symbols such as **, *, #, or - (the UI renders plain text only, so these symbols would appear literally to the user). When listing sequential steps, number them as "1.", "2.", "3." with each step on its own line (a real line break between steps), and do not add any sub-bullets, asterisks, or nested formatting inside a step — write each step as one plain sentence. Do not introduce names, screens, or details that are not already part of the knowledge base provided above; if translating to English, translate the meaning only and keep the same level of detail as the Arabic source, without adding extra explanations.`,
      prompt: input.question,
    });

    return { answerText: response.text };
  },
);
