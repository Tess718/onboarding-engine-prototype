"use server";

import { OnboardingPipeline } from "../constants/mock-data";

export async function updateOnboardingProgress(
  storageKey: string,
  pipelines: OnboardingPipeline[],
): Promise<{ success: boolean }> {
  return { success: true };
}
