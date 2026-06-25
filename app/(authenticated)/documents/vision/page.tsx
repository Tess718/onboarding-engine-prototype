import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerOnboardingState } from "../../../../features/onboarding/utils/onboarding-server";
import { OnboardingTaskWidgetServer } from "../../../../features/onboarding/components/onboarding-task-widget-server";

export default async function VisionDocumentPage() {
  const onboardingState = await getServerOnboardingState();
  if (!onboardingState) {
    redirect("/");
  }

  const { hydratedPipelines, storageKey, progressMap } = onboardingState;

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Vision &amp; Mission
          </h1>
          <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
            Our organizational direction and core principles.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="text-xs text-[var(--color-muted-foreground)] hover:underline"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="space-y-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-sm leading-relaxed text-[var(--color-foreground)]">
        <section className="space-y-2">
          <h2 className="text-base font-bold">Our Vision</h2>
          <p className="text-[var(--color-muted-foreground)]">
            To build the most trusted platform for workforce operations — where
            every person, from first-day hire to tenured leader, has the clarity
            and tools to do meaningful work.
          </p>
        </section>

        <hr className="border-[var(--color-border)]" />

        <section className="space-y-2">
          <h2 className="text-base font-bold">Our Mission</h2>
          <p className="text-[var(--color-muted-foreground)]">
            We exist to eliminate operational friction in growing teams. We do
            this by automating structured workflows, surfacing the right context
            at the right time, and giving managers real-time visibility into
            their team&apos;s progress.
          </p>
        </section>

        <hr className="border-[var(--color-border)]" />

        <section className="space-y-2">
          <h2 className="text-base font-bold">Core Principles</h2>
          <ul className="list-disc space-y-1 pl-5 text-[var(--color-muted-foreground)]">
            <li>
              People first — every decision starts with its impact on the team.
            </li>
            <li>Default to transparency — share context, not just outcomes.</li>
            <li>Move with intention — speed matters, but so does direction.</li>
            <li>Own the outcome — accountability is a team sport.</li>
          </ul>
        </section>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Once you&apos;ve read the document above, mark the onboarding task as
          complete.
        </p>
        <OnboardingTaskWidgetServer
          pipelines={hydratedPipelines}
          storageKey={storageKey}
          progressMap={progressMap}
          stageId="stage-org-profile"
          stepId="step-1-2"
          actionLabel="I've read this — Mark Complete"
        />
      </div>
    </main>
  );
}
