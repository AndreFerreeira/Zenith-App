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
  dreamRoutine: z.string().describe('The user\'s description of their ideal or "dream" routine.'),
  coreValues: z.string().describe('A list of the user\'s core values (e.g., Integrity, Freedom, Family).')
});

export type SuggestPersonalizedRoutinesInput = z.infer<
  typeof SuggestPersonalizedRoutinesInputSchema
>;

// Define the output schema
const SuggestPersonalizedRoutinesOutputSchema = z.object({
  dailyRoutine: z.string().describe('A suggested daily routine in text format.'),
  weeklyRoutine: z.string().describe('A suggested weekly routine in text format.'),
  suggestedHabits: z.array(z.string()).describe('A list of specific, actionable habits suggested for the user.'),
  suggestedGoals: z.array(z.string()).describe('A list of specific, actionable goals suggested for the user.'),
});

export type SuggestPersonalizedRoutinesOutput = z.infer<
  typeof SuggestPersonalizedRoutinesOutputSchema
>;

// Define the prompt
const suggestPersonalizedRoutinesPrompt = ai.definePrompt({
  name: 'suggestPersonalizedRoutinesPrompt',
  input: {schema: SuggestPersonalizedRoutinesInputSchema},
  output: {schema: SuggestPersonalizedRoutinesOutputSchema},
  prompt: `You are an expert life and productivity coach.
Analyze the following user data to suggest personalized and structured daily and weekly routines, along with specific, actionable habits and goals.

The routines must be aligned with the user's core values, their long-term goals, and their dream routine.
Use their current habits and financial data as a baseline for what is achievable.

User's Core Values: {{coreValues}}
User's Dream Routine: {{dreamRoutine}}
Tracked Habits: {{#each habits}}- {{this}}{{/each}}
Goals: {{#each goals}}- {{this}}{{/each}}
Financial Data: {{financialData}}

Based on all this information, create a realistic but ambitious plan to help the user move towards their dream routine and goals, respecting their core values.

- Suggest a Daily Routine (as a block of text).
- Suggest a Weekly Routine (as a block of text).
- Suggest 3-5 specific habits as a list for the 'suggestedHabits' field.
- Suggest 2-3 specific, larger goals as a list for the 'suggestedGoals' field.
`,
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
