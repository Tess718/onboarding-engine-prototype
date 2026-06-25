import { cookies } from "next/headers";
import { mock3DMatrixData, EmployeeType, DepartmentType } from "../../../constants/mock-data";

export async function getServerOnboardingState() {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const cookieStore = await cookies();
  const empType = cookieStore.get("emp_type")?.value as EmployeeType | undefined;
  const empDept = cookieStore.get("emp_dept")?.value as DepartmentType | undefined;

  if (!empType || !empDept) {
    return null;
  }

  const storageKey = `onboarding:emp_123:${empType}:${empDept}`;
  const progressRaw = cookieStore.get(`progress:${storageKey}`)?.value;

  let progressMap: Record<string, boolean> = {};
  if (progressRaw) {
    try {
      progressMap = JSON.parse(progressRaw) as Record<string, boolean>;
    } catch {
    }
  }

  const computedPipelines = mock3DMatrixData.filter(
    (pipeline) =>
      pipeline.targetTypes.includes(empType) &&
      (pipeline.targetDepartments
        ? pipeline.targetDepartments.includes(empDept)
        : true)
  );

  const hydratedPipelines = computedPipelines.map((pipeline) => ({
    ...pipeline,
    stages: pipeline.stages.map((stage) => ({
      ...stage,
      steps: stage.steps.map((step) => ({
        ...step,
        isCompleted: progressMap[step.id] === true ? true : step.isCompleted,
      })),
    })),
  }));

  const allStages = hydratedPipelines.flatMap((p) => p.stages);

  const hasIncompleteGate = allStages
    .filter((s) => s.isSystemGate)
    .some((s) => s.steps.some((step) => !step.isCompleted));

  return {
    empType,
    empDept,
    storageKey,
    progressMap,
    hydratedPipelines,
    hasIncompleteGate,
  };
}
