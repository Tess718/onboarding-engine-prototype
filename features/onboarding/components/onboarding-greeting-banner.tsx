import Link from "next/link";
import { OnboardingPipeline } from "../../../constants/mock-data";

interface OnboardingGreetingBannerProps {
  pipelines: OnboardingPipeline[];
}

export function OnboardingGreetingBanner({ pipelines }: OnboardingGreetingBannerProps) {
  const ambientStages = pipelines.flatMap((p) => p.stages).filter((s) => !s.isSystemGate);
  const ambientSteps = ambientStages.flatMap((s) => s.steps);
  const incompleteSteps = ambientSteps.filter((step) => !step.isCompleted);
  const isCompleted = incompleteSteps.length === 0;
  const pendingCount = incompleteSteps.length;
  const nextAmbientStep = incompleteSteps[0];

  if (isCompleted) {
    return null;
  }

  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  const motivationalMessage = `You have ${pendingCount} pending onboarding task${
    pendingCount > 1 ? "s" : ""
  } remaining. Let's make some progress today!`;

  return (
    <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-5 dark:border-violet-900/30 dark:bg-violet-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-violet-900 dark:text-violet-300 flex items-center gap-1.5">
          <span className="animate-bounce inline-block">👋</span>
          <span>
            {greeting}!
          </span>
        </h2>
        <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
          {motivationalMessage}
        </p>
      </div>
      {nextAmbientStep && (
        <Link
          href={`/task/${nextAmbientStep.id}`}
          className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-750 transition-colors shadow-sm text-center shrink-0 hover:scale-[1.02] active:scale-[0.98] transition-transform"
        >
          Start Next Task →
        </Link>
      )}
    </div>
  );
}
