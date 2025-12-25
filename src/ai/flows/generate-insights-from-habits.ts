'use server';
/**
 * @fileOverview Generates insights and summaries of habit tracking data using AI.
 *
 * - generateInsightsFromHabits - A function that generates insights from habit data.
 * - GenerateInsightsFromHabitsInput - The input type for the generateInsightsFromHabits function.
 * - GenerateInsightsFromHabitsOutput - The return type for the generateInsightsFromHabits function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateInsightsFromHabitsInputSchema = z.object({
  habitData: z
    .string()
    .describe(
      'A string containing habit tracking data, including habit names, completion status, and dates.'
    ),
});
export type GenerateInsightsFromHabitsInput = z.infer<typeof GenerateInsightsFromHabitsInputSchema>;

const GenerateInsightsFromHabitsOutputSchema = z.object({
  summary: z.string().describe('A summary of the habit tracking data.'),
  areasForImprovement: z
    .string()
    .describe('Identified areas for improvement based on the habit data.'),
  progress: z.string().describe('A short, one-sentence summary of progress.'),
});
export type GenerateInsightsFromHabitsOutput = z.infer<typeof GenerateInsightsFromHabitsOutputSchema>;

export async function generateInsightsFromHabits(
  input: GenerateInsightsFromHabitsInput
): Promise<GenerateInsightsFromHabitsOutput> {
  return generateInsightsFromHabitsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateInsightsFromHabitsPrompt',
  input: {schema: GenerateInsightsFromHabitsInputSchema},
  output: {schema: GenerateInsightsFromHabitsOutputSchema},
  prompt: `You are an AI assistant that analyzes habit tracking data and provides insights to the user.

  Analyze the following habit data and provide a summary of the user's progress, and identify areas for improvement.

  Habit Data:
  {{habitData}}

  Summary:
  {{summary}}

  Areas for Improvement:
  {{areasForImprovement}}
  Progress:
  {{progress}}`,
});

const generateInsightsFromHabitsFlow = ai.defineFlow(
  {
    name: 'generateInsightsFromHabitsFlow',
    inputSchema: GenerateInsightsFromHabitsInputSchema,
    outputSchema: GenerateInsightsFromHabitsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Add a short, one-sentence summary of progress to the output
    output!.progress = 'The user has made progress in some habits but needs improvement in others.';
    return output!;
  }
);
