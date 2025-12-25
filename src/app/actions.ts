"use server";

import { suggestPersonalizedRoutines } from "@/ai/flows/suggest-personalized-routines";
import type { SuggestPersonalizedRoutinesInput } from "@/ai/flows/suggest-personalized-routines";
import { generateContentFromData } from "@/ai/flows/generate-content-from-data";
import type { GenerateContentFromDataInput } from "@/ai/flows/generate-content-from-data";


export async function getAiSuggestions(
  input: SuggestPersonalizedRoutinesInput
) {
  try {
    const result = await suggestPersonalizedRoutines(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to get AI suggestions." };
  }
}

export async function generateSocialPost(
  input: GenerateContentFromDataInput
) {
  try {
    const result = await generateContentFromData(input);
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to generate content." };
  }
}
