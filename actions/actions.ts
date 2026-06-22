"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EmployeeType, DepartmentType } from "../constants/mock-data";
import { OnboardingPipeline } from "../constants/mock-data";

export async function updateOnboardingProgress(
  storageKey: string,
  pipelines: OnboardingPipeline[],
): Promise<{ success: boolean }> {
  const progressMap: Record<string, boolean> = {};
  for (const pipeline of pipelines) {
    for (const stage of pipeline.stages) {
      for (const step of stage.steps) {
        if (step.isCompleted) {
          progressMap[step.id] = true;
        }
      }
    }
  }
  const cookieStore = await cookies();
  cookieStore.set(`progress:${storageKey}`, JSON.stringify(progressMap), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return { success: true };
}

export async function setEmployeeSession(type: EmployeeType, dept: DepartmentType) {
  const cookieStore = await cookies();
  cookieStore.set("emp_type", type, { path: "/" });
  cookieStore.set("emp_dept", dept, { path: "/" });
  redirect(`/onboarding`);
}
