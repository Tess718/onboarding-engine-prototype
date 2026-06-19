import { redirect } from "next/navigation";
import {
  mock3DMatrixData,
  EmployeeType,
  DepartmentType,
} from "../../constants/mock-data";
import { OnboardingRunner } from "../../components/onboarding-runner";

interface EmployeeProfileMock {
  id: string;
  type: EmployeeType;
  department: DepartmentType;
  hasCompletedOnboarding: boolean;
}

function buildMockUser(
  type: EmployeeType,
  department: DepartmentType,
): EmployeeProfileMock {
  const profileKey = `${type}:${department}`;
  return {
    id: "emp_123",
    type,
    department,
    hasCompletedOnboarding: false,
  };
}

interface PageProps {
  searchParams: Promise<{ type?: string; dept?: string }>;
}

export default async function OnboardingPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const activeType = (params.type as EmployeeType) || "contractor-individual";
  const activeDept = (params.dept as DepartmentType) || "none";

  const user = buildMockUser(activeType, activeDept);

  if (user.hasCompletedOnboarding) {
    redirect("/dashboard");
  }

  const computedPipeline = mock3DMatrixData.filter(
    (pipeline) =>
      pipeline.targetTypes.includes(user.type) &&
      (pipeline.targetDepartments
        ? pipeline.targetDepartments.includes(user.department)
        : true),
  );

  const profileKey = `${user.type}:${user.department}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <OnboardingRunner
        key={profileKey}
        initialPipelineData={computedPipeline}
        storageKey={`onboarding:${user.id}:${profileKey}`}
        initialType={user.type}
      />
    </main>
  );
}
