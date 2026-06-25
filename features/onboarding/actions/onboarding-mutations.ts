"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  EmployeeType,
  DepartmentType,
  OnboardingPipeline,
} from "../../../constants/mock-data";

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
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function setEmployeeSession(
  type: EmployeeType,
  dept: DepartmentType,
) {
  const cookieStore = await cookies();
  cookieStore.set("emp_type", type, { path: "/" });
  cookieStore.set("emp_dept", dept, { path: "/" });

  redirect(`/onboarding`);
}

export async function logoutSession() {
  const cookieStore = await cookies();
  cookieStore.delete("emp_type");
  cookieStore.delete("emp_dept");

  redirect("/");
}

export async function completeStepAction(
  storageKey: string,
  progressMap: Record<string, boolean>,
  stepId: string,
) {
  const updatedProgress = { ...progressMap, [stepId]: true };
  const cookieStore = await cookies();
  cookieStore.set(`progress:${storageKey}`, JSON.stringify(updatedProgress), {
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  revalidatePath("/onboarding");
  revalidatePath("/dashboard");
}
