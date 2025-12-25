'use server';

/**
 * @fileOverview This file defines a Genkit flow that suggests personalized daily and weekly routines
 * based on user's tracked habits, goals, and financial data. This helps optimize user's productivity and financial well-being.
 *
 * @interface SuggestPersonalizedRoutinesInput - Input for the suggestPersonalizedRoutines function.
 * @interface SuggestPersonalizedRoutinesOutput - Output for the suggestPersonalizedRoutines function.
 * @function suggestPersonalizedRoutines - The main function to generate personalized routine suggestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const SuggestPersonalizedRoutinesInputSchema = z.object({
  habits: z.array(z.string()).describe('A list of tracked habits.'),
  goals: z.array(z.string()).describe('A list of user goals.'),
  financialData: z.string().describe('A summary of the user financial data.'),
});

export type SuggestPersonalizedRoutinesInput = z.infer<
  typeof SuggestPersonalizedRoutinesInputSchema
>;

// Define the output schema
const SuggestPersonalizedRoutinesOutputSchema = z.object({
  dailyRoutine: z.string().describe('A suggested daily routine.'),
  weeklyRoutine: z.string().describe('A suggested weekly routine.'),
});

export type SuggestPersonalizedRoutinesOutput = z.infer<
  typeof SuggestPersonalizedRoutinesOutputSchema
>;

// Define the prompt
const suggestPersonalizedRoutinesPrompt = ai.definePrompt({
  name: 'suggestPersonalizedRoutinesPrompt',
  input: {schema: SuggestPersonalizedRoutinesInputSchema},
  output: {schema: SuggestPersonalizedRoutinesOutputSchema},
  prompt: `Analyze the following user data to suggest personalized daily and weekly routines.

Tracked Habits: {{habits}}
Goals: {{goals}}
Financial Data: {{financialData}}

Based on this information, suggest a daily and weekly routine that optimizes productivity and financial well-being.

Daily Routine:
Weekly Routine:`,
});

// Define the flow
const suggestPersonalizedRoutinesFlow = ai.defineFlow(
  {
    name: 'suggestPersonalizedRoutinesFlow',
    inputSchema: SuggestPersonalizedRoutinesInputSchema,
    outputSchema: SuggestPersonalizedRoutinesOutputSchema,
  },
  async input => {
    const {output} = await suggestPersonalizedRoutinesPrompt(input);
    return output!;
  }
);

/**
 * Asynchronously suggests personalized daily and weekly routines based on the provided input.
 *
 * @param input - The input containing user habits, goals, and financial data.
 * @returns A promise that resolves to an object containing suggested daily and weekly routines.
 */
export async function suggestPersonalizedRoutines(
  input: SuggestPersonalizedRoutinesInput
): Promise<SuggestPersonalizedRoutinesOutput> {
  return suggestPersonalizedRoutinesFlow(input);
}
