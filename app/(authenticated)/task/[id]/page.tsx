import { redirect } from "next/navigation";
import { getServerOnboardingState } from "../../../../features/onboarding/utils/onboarding-server";
import { OnboardingProvider } from "../../../../features/onboarding/context/scoped-onboarding-context";
import { TaskView } from "../../../../features/onboarding/components/task-view";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ origin?: string }>;
}

export default async function TaskPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { origin } = await searchParams;
  const onboardingState = await getServerOnboardingState();

  if (!onboardingState) {
    redirect("/");
  }

  if (onboardingState.hasIncompleteGate) {
    redirect("/onboarding");
  }

  const { hydratedPipelines, storageKey, empType, empDept } = onboardingState;

  const allStages = hydratedPipelines.flatMap((p) => p.stages);
  const step = allStages.flatMap((s) => s.steps).find((st) => st.id === id);

  if (step && step.actionUrl && !step.isCompleted) {
    redirect(`${step.actionUrl}?origin=${origin || "onboarding"}`);
  }

  return (
    <OnboardingProvider
      initialPipelineData={hydratedPipelines}
      storageKey={storageKey}
      empType={empType}
      empDept={empDept}
    >
      <TaskView id={id} origin={origin} />
    </OnboardingProvider>
  );
}
