import { redirect } from "next/navigation";
import { getServerOnboardingState } from "../../../../actions/onboarding-server";
import { TaskView } from "../../../../components/task-view";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TaskPage({ params }: PageProps) {
  const { id } = await params;
  const onboardingState = await getServerOnboardingState();

  if (!onboardingState) {
    redirect("/");
  }

  return <TaskView id={id} />;
}
