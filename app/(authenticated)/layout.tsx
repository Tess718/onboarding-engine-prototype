import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  mock3DMatrixData,
  EmployeeType,
  DepartmentType,
} from "../../constants/mock-data";
import { OnboardingProvider } from "../../context/OnboardingContext";
import { OnboardingStatusBanner } from "../../components/onboarding-status-banner";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const empType = cookieStore.get("emp_type")?.value as EmployeeType | undefined;
  const empDept = cookieStore.get("emp_dept")?.value as DepartmentType | undefined;

  if (!empType || !empDept) {
    redirect("/");
  }

  const computedPipelines = mock3DMatrixData.filter(
    (pipeline) =>
      pipeline.targetTypes.includes(empType) &&
      (pipeline.targetDepartments
        ? pipeline.targetDepartments.includes(empDept)
        : true),
  );

  const storageKey = `onboarding:emp_123:${empType}:${empDept}`;

  const progressRaw = cookieStore.get(`progress:${storageKey}`)?.value;
  let progressMap: Record<string, boolean> = {};
  if (progressRaw) {
    try {
      progressMap = JSON.parse(progressRaw) as Record<string, boolean>;
    } catch {
    }
  }

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

  return (
    <OnboardingProvider initialPipelineData={hydratedPipelines} storageKey={storageKey}>
      <OnboardingStatusBanner />
      {children}
    </OnboardingProvider>
  );
}
