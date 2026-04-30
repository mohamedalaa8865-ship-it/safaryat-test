'use server';
/**
 * @fileOverview AI Chat Reply Suggester Flow.
 *
 * - suggestChatReply - A function that suggests replies based on conversation history.
 * - SuggestChatReplyInput - The input type for the suggestChatReply function.
 * - SuggestChatReplyOutput - The return type for the suggestChatReply function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SuggestChatReplyInputSchema = z.object({
  conversationHistory: z.string().describe('The history of the conversation.'),
  userRole: z.enum(['carrier', 'traveler']).describe('The role of the user requesting the suggestion.'),
});
export type SuggestChatReplyInput = z.infer<typeof SuggestChatReplyInputSchema>;

const SuggestChatReplyOutputSchema = z.object({
  suggestedReplies: z.array(z.string()).describe('A list of suggested replies.'),
});
export type SuggestChatReplyOutput = z.infer<typeof SuggestChatReplyOutputSchema>;

export async function suggestChatReply(input: SuggestChatReplyInput): Promise<SuggestChatReplyOutput> {
  return suggestChatReplyFlow(input);
}

const suggestChatReplyFlow = ai.defineFlow(
  {
    name: 'suggestChatReplyFlow',
    inputSchema: SuggestChatReplyInputSchema,
    outputSchema: SuggestChatReplyOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      system: `You are an expert communicator for the "Safar Gate" transport platform. 
      Analyze the conversation history and suggest exactly 3 short, polite, and effective replies.
      Replies MUST be in Arabic. 
      Focus on resolving booking details, pickup coordination, or pricing clarity.`,
      prompt: `CONVERSATION_LOG:\n${input.conversationHistory}\n\nUSER_ROLE: ${input.userRole}`,
      output: {
        schema: SuggestChatReplyOutputSchema
      }
    });

    if (!output) {
        return { suggestedReplies: ["تمام، شكراً لك", "متى موعد الانطلاق؟", "أهلاً بك"] };
    }

    return output;
  }
);
