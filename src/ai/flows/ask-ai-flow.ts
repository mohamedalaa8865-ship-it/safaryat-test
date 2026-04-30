'use server';
/**
 * @fileOverview Sovereign Assistant AI Flow.
 *
 * - askAi - A function that handles general AI assistance queries based on role-based context.
 * - AskAiInput - The input type for the askAi function.
 * - AskAiOutput - The return type for the askAi function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { TRAVELER_SOVEREIGN_PROMPT, CARRIER_SOVEREIGN_PROMPT, OWNER_SOVEREIGN_PROMPT } from '@/lib/role-prompts';
import { AGENT_SOVEREIGN_PROMPT } from '@/lib/agent-sovereign-prompt';
import { getScreenContext } from '@/lib/screen-maps';

const AskAiInputSchema = z.object({
  question: z.string().describe('The user\'s question.'),
  context: z.object({
    path: z.string().describe('The current page path.'),
    role: z.string().describe('The current user role.'),
  }),
});
export type AskAiInput = z.infer<typeof AskAiInputSchema>;

const AskAiOutputSchema = z.object({
  answerText: z.string().describe('The AI generated response.'),
});
export type AskAiOutput = z.infer<typeof AskAiOutputSchema>;

export async function askAi(input: AskAiInput): Promise<AskAiOutput> {
  return askAiFlow(input);
}

const askAiFlow = ai.defineFlow(
  {
    name: 'askAiFlow',
    inputSchema: AskAiInputSchema,
    outputSchema: AskAiOutputSchema,
  },
  async (input) => {
    const screenPurpose = getScreenContext(input.context.path);
    
    let systemPrompt = '';
    const role = input.context.role.toLowerCase();
    
    // ATOMIC ROLE SELECTION (SSOT)
    if (role === 'carrier') systemPrompt = CARRIER_SOVEREIGN_PROMPT;
    else if (role === 'agent') systemPrompt = AGENT_SOVEREIGN_PROMPT;
    else if (role === 'owner' || role === 'admin') systemPrompt = OWNER_SOVEREIGN_PROMPT;
    else systemPrompt = TRAVELER_SOVEREIGN_PROMPT;

    const response = await ai.generate({
      system: `${systemPrompt}\n\n[CONTEXTUAL_AWARENESS]\nYou are currently assisting the user on the screen: ${input.context.path}.\nScreen Purpose: ${screenPurpose}\nEnsure your advice is specific to this context.`,
      prompt: input.question,
    });

    return { answerText: response.text };
  }
);
