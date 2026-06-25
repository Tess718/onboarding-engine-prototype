import { redirect } from "next/navigation";
import { getServerOnboardingState } from "../../features/onboarding/utils/onboarding-server";
import { RouteGuard } from "../../components/route-guard";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const onboardingState = await getServerOnboardingState();

  if (!onboardingState) {
    redirect("/");
  }

  const { hydratedPipelines, hasIncompleteGate } = onboardingState;

  if (hasIncompleteGate) {
    redirect("/onboarding");
  }

  return (
    <RouteGuard initialPipelines={hydratedPipelines}>
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">
          {children}
        </div>
      </div>
    </RouteGuard>
  );
}

