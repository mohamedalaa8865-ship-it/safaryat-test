import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * @file src/ai/genkit.ts
 * @description THE REINFORCED AI NUCLEUS (STERILIZED - V1.0)
 * Protocol 13: Using Genkit 1.x Sovereign Stack.
 * Protocol 88: Resource Protected via Flash Model.
 */

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash', // Efficient & Fast for Real-time Ops
});
