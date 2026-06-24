import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerOnboardingState } from "../../../actions/onboarding-server";

export default async function EngineeringConsolePage() {
  const onboardingState = await getServerOnboardingState();

  if (!onboardingState) {
    redirect("/");
  }

  if (onboardingState.empDept !== "engineering") {
    redirect("/dashboard");
  }

  const allStages = onboardingState.hydratedPipelines.flatMap((p) => p.stages);
  const step43 = allStages.flatMap((s) => s.steps).find((step) => step.id === "step-4-3");

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            System Console
          </span>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Engineering Operations</h1>
        </div>
        <Link href="/dashboard" className="text-xs text-[var(--color-muted-foreground)] hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-4">
            <h3 className="text-sm font-bold">Local Cluster Status</h3>
            <div className="rounded-lg bg-black text-emerald-400 p-4 font-mono text-xs space-y-1.5 shadow-inner">
              <div>$ kubectl get pods -n core-services</div>
              <div>NAME                          READY   STATUS    RESTARTS   AGE</div>
              <div>api-gateway-8f24a1b-cd2   1/1     Running   0          4d</div>
              <div>db-postgres-0             1/1     Running   0          18d</div>
              <div>worker-queue-5a19c-88bf   1/1     Running   2          4d</div>
              <div className="text-zinc-500 mt-2">All system resources checks: OK.</div>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 space-y-2">
            <h3 className="text-sm font-bold">System Credentials</h3>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Local environment SSH authentication keys are loaded. Secure socket tunnel active.
            </p>
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          {step43 && (
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-4 shadow-sm">
              <div className="space-y-1">
                <span className="rounded bg-violet-100 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
                  Required Task
                </span>
                <h3 className="text-xs font-bold mt-1.5">{step43.title}</h3>
                <p className="text-[10px] text-[var(--color-muted-foreground)] leading-normal">
                  {step43.description}
                </p>
              </div>

              <hr className="border-[var(--color-border)]" />

              {step43.isCompleted ? (
                <div className="text-center py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ AWS Credentials Requested
                </div>
              ) : (
                <Link
                  href={`/task/${step43.id}`}
                  className="block rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-4 py-2 text-xs font-semibold hover:opacity-90 shadow-sm text-center"
                >
                  Request AWS Credentials
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
