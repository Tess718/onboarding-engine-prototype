import { redirect } from "next/navigation";
import { getServerOnboardingState } from "../../features/onboarding/utils/onboarding-server";
import { OnboardingProvider } from "../../features/onboarding/context/scoped-onboarding-context";
import { OnboardingRunner } from "../../features/onboarding/components/onboarding-runner";

export default async function OnboardingPage() {
  const onboardingState = await getServerOnboardingState();

  if (!onboardingState) {
    redirect("/");
  }

  if (!onboardingState.hasIncompleteGate) {
    redirect("/dashboard");
  }

  const { hydratedPipelines, storageKey, empType, empDept } = onboardingState;

  return (
    <OnboardingProvider
      initialPipelineData={hydratedPipelines}
      storageKey={storageKey}
      empType={empType}
      empDept={empDept}
    >
      <main className="min-h-screen bg-white text-zinc-900 flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-24 min-h-screen">
          <OnboardingRunner />
        </div>
        <div className="hidden lg:block lg:w-1/2 relative min-h-screen">
          <div className="absolute inset-0 p-4">
            <img
              src="https://img.magnific.com/premium-photo/successful-confident-group-african-american-corporate-modern-office-with-big-windows_175356-7847.jpg?uid=R133884520&ga=GA1.1.443459616.1782307401&semt=ais_incoming&w=740&q=80"
              alt="Corporate Group Office"
              className="w-full h-full object-cover rounded-[24px] shadow-md"
            />
          </div>
        </div>
      </main>
    </OnboardingProvider>
  );
}
