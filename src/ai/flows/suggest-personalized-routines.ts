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
  prompt: `Você é um coach de vida e produtividade especialista e extremamente detalhista. Sua tarefa é responder em português do Brasil.
Analise os dados do usuário a seguir para sugerir rotinas diárias e semanais personalizadas e estruturadas, juntamente com hábitos e metas específicos e acionáveis.

As rotinas devem estar alinhadas com os valores essenciais do usuário, seus objetivos de longo prazo e sua rotina dos sonhos.
Use seus hábitos atuais e dados financeiros como base para o que é alcançável.

Valores Essenciais do Usuário: {{coreValues}}
Rotina dos Sonhos do Usuário: {{dreamRoutine}}
Hábitos Rastreados: {{#each habits}}- {{this}}{{/each}}
Metas: {{#each goals}}- {{this}}{{/each}}
Dados Financeiros: {{financialData}}

Com base em todas essas informações, crie um plano realista, mas ambicioso, para ajudar o usuário a se aproximar de sua rotina dos sonhos e objetivos, respeitando seus valores fundamentais.

Seja muito detalhista em suas explicações, justificando o porquê de cada sugestão e como ela se conecta aos dados fornecidos.

- Sugira uma Rotina Diária (como um bloco de texto bem detalhado).
- Sugira uma Rotina Semanal (como um bloco de texto bem detalhado).
- Sugira de 3 a 5 hábitos específicos e acionáveis como uma lista para o campo 'suggestedHabits'.
- Sugira de 2 a 3 metas maiores e específicas como uma lista para o campo 'suggestedGoals'.
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
