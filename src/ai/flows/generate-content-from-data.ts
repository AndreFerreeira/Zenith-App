'use server';
/**
 * @fileOverview This file defines a Genkit flow that generates social media content
 * based on user's tracked habits, goals, and a given theme.
 *
 * @interface GenerateContentFromDataInput - Input for the generateContentFromData function.
 * @interface GenerateContentFromDataOutput - Output for the generateContentFromData function.
 * @function generateContentFromData - The main function to generate social media content.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Define the input schema
const GenerateContentFromDataInputSchema = z.object({
  habits: z.array(z.string()).describe('A list of tracked habits.'),
  goals: z.array(z.string()).describe('A list of user goals.'),
  theme: z.string().describe('The main theme or topic for the content.'),
  platform: z
    .enum(['linkedin', 'instagram', 'email'])
    .describe('The target social media platform.'),
});

export type GenerateContentFromDataInput = z.infer<
  typeof GenerateContentFromDataInputSchema
>;

// Define the output schema
const GenerateContentFromDataOutputSchema = z.object({
  post: z.string().describe('The generated social media post content.'),
});

export type GenerateContentFromDataOutput = z.infer<
  typeof GenerateContentFromDataOutputSchema
>;

// Define the prompt
const generateContentPrompt = ai.definePrompt({
  name: 'generateContentFromDataPrompt',
  input: {schema: GenerateContentFromDataInputSchema},
  output: {schema: GenerateContentFromDataOutputSchema},
  prompt: `You are a social media content creation expert.
Your task is to generate a post for the {{platform}} platform.
The post should be about the theme: "{{theme}}".

Use the user's current habits and goals as inspiration and context to make the post more personal and relatable.

User's Habits:
{{#each habits}}
- {{this}}
{{/each}}

User's Goals:
{{#each goals}}
- {{this}}
{{/each}}

Based on this, generate an engaging and platform-appropriate post.
- For Instagram, include relevant hashtags and emojis.
- For LinkedIn, be more professional and structured.
- For Email, write it as a short, encouraging newsletter-style message.
`,
});

// Define the flow
const generateContentFromDataFlow = ai.defineFlow(
  {
    name: 'generateContentFromDataFlow',
    inputSchema: GenerateContentFromDataInputSchema,
    outputSchema: GenerateContentFromDataOutputSchema,
  },
  async input => {
    const {output} = await generateContentPrompt(input);
    return output!;
  }
);

/**
 * Asynchronously generates social media content based on the provided input.
 *
 * @param input - The input containing user habits, goals, theme, and platform.
 * @returns A promise that resolves to an object containing the generated post.
 */
export async function generateContentFromData(
  input: GenerateContentFromDataInput
): Promise<GenerateContentFromDataOutput> {
  return generateContentFromDataFlow(input);
}
