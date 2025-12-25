"use server";

import { suggestPersonalizedRoutines } from "@/ai/flows/suggest-personalized-routines";
import type { SuggestPersonalizedRoutinesInput } from "@/ai/flows/suggest-personalized-routines";

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
