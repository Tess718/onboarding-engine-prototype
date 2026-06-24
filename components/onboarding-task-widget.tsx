"use client";

import { useOnboarding } from "../context/OnboardingContext";

interface OnboardingTaskWidgetProps {
  stageId: string;
  stepId: string;
  actionLabel?: string;
}

export function OnboardingTaskWidget({
  stageId,
  stepId,
  actionLabel = "Mark as Complete",
}: OnboardingTaskWidgetProps) {
  const { allStages, completeStepById, isStageUnlocked, isStepUnlocked } = useOnboarding();

  const stage = allStages.find((s) => s.id === stageId);
  const step = stage?.steps.find((st) => st.id === stepId);

  if (!stage || !step) return null;

  const isLocked = !isStageUnlocked(stageId) || !isStepUnlocked(stageId, stepId);

  const handleComplete = () => {
    if (step.isCompleted || isLocked) return;

    completeStepById(stageId, stepId);
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        step.isCompleted
          ? "border-emerald-300 bg-emerald-50/40 dark:border-emerald-700 dark:bg-emerald-950/20"
          : isLocked
          ? "border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/20 opacity-70"
          : "border-[var(--color-border)] bg-[var(--color-card)]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <span className="inline-block rounded bg-[var(--color-muted)] px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Onboarding Task · {stage.name}
          </span>
          <h3
            className={`text-sm font-semibold leading-snug ${
              step.isCompleted
                ? "text-emerald-700 line-through dark:text-emerald-400"
                : isLocked
                ? "text-[var(--color-muted-foreground)]"
                : "text-[var(--color-foreground)]"
            }`}
          >
            {step.title}
          </h3>
          {step.description && (
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {step.description}
            </p>
          )}

          {isLocked && (
            <p className="pt-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
              🔒 Locked until prerequisite tasks are completed.
            </p>
          )}
        </div>

        {step.isCompleted ? (
          <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
            ✓ Done
          </span>
        ) : isLocked ? (
          <button
            disabled
            className="shrink-0 cursor-not-allowed rounded-lg bg-[var(--color-muted)] px-3 py-1.5 text-xs font-semibold text-[var(--color-muted-foreground)] opacity-50"
          >
            Locked
          </button>
        ) : (
          <button
            onClick={handleComplete}
            className="shrink-0 cursor-pointer rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-primary-foreground)] shadow-sm transition-opacity hover:opacity-90"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
