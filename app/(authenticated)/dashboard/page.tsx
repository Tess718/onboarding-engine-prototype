import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerOnboardingState } from "../../../features/onboarding/utils/onboarding-server";
import { OnboardingProgressDonut } from "../../../features/onboarding/components/onboarding-progress-donut";
import { OnboardingGreetingBanner } from "../../../features/onboarding/components/onboarding-greeting-banner";
import { logoutSession } from "../../../features/onboarding/actions/onboarding-mutations";


async function getWorkspaceMetrics() {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return {
    activeMembersCount: 3,
  };
}

export default async function DashboardPage() {
  const [onboardingState, metrics] = await Promise.all([
    getServerOnboardingState(),
    getWorkspaceMetrics(),
  ]);

  if (!onboardingState) {
    redirect("/");
  }

  const { hydratedPipelines, storageKey, hasIncompleteGate, empType, empDept } = onboardingState;

  if (hasIncompleteGate) {
    redirect("/onboarding");
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] relative">
      <div className="mx-auto max-w-5xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
              Welcome back to your corporate dashboard workspace.
            </p>
          </div>
          <form action={logoutSession}>
            <button
              type="submit"
              className="rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] px-4 py-2 text-xs font-semibold text-[var(--color-foreground)] hover:bg-[var(--color-muted)] transition-colors shadow-sm cursor-pointer"
            >
              Log Out
            </button>
          </form>
        </div>

        <OnboardingGreetingBanner pipelines={hydratedPipelines} />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 items-start">
          <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm flex flex-col justify-between h-40">
                <div>
                  <h3 className="mb-1 text-sm font-bold">Team Overview</h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Access active headcount, departments, and onboarding metrics.
                  </p>
                </div>
                <div className="text-xs font-semibold text-[var(--color-primary)]">
                  {metrics.activeMembersCount} Active Members
                </div>
              </div>

              {empDept === "engineering" && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm flex flex-col justify-between h-40">
                  <div>
                    <h3 className="mb-1 text-sm font-bold">Engineering Console</h3>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Access repositories, 2FA setup, and cloud credential configurations.
                    </p>
                  </div>
                  <Link
                    href="/engineering"
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                  >
                    Open Console →
                  </Link>
                </div>
              )}

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm flex flex-col justify-between h-40">
                <div>
                  <h3 className="mb-1 text-sm font-bold">Vision &amp; Mission</h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Review our company culture, vision guidelines, and core values.
                  </p>
                </div>
                <Link
                  href="/documents/vision"
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Read Playbook →
                </Link>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm flex flex-col justify-between h-40">
                <div>
                  <h3 className="mb-1 text-sm font-bold">Profile Settings</h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Update corporate profile photos, user credentials, and display titles.
                  </p>
                </div>
                <Link
                  href="/settings/profile"
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Edit Profile →
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <OnboardingProgressDonut
              initialPipelines={hydratedPipelines}
              storageKey={storageKey}
              empType={empType}
              empDept={empDept}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
