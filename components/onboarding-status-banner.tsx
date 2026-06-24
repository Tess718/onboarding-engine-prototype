"use client";

import Link from "next/link";
import { useOnboarding } from "../context/OnboardingContext";

export function OnboardingStatusBanner() {
  const { allStages, allCompleted } = useOnboarding();

  const totalSteps = allStages.reduce((acc, s) => acc + s.steps.length, 0);
  const completedSteps = allStages.reduce(
    (acc, s) => acc + s.steps.filter((st) => st.isCompleted).length,
    0
  );

  const nextAmbientStep = allStages
    .filter((s) => !s.isSystemGate)
    .flatMap((s) => s.steps)
    .find((step) => !step.isCompleted);

  if (allCompleted || totalSteps === 0 || !nextAmbientStep) return null;

  const pct = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="w-full border-b border-amber-300/40 bg-amber-50/60 px-6 py-3 dark:border-amber-700/30 dark:bg-amber-950/20">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            Onboarding in Progress — {completedSteps}/{totalSteps} steps ({pct}%)
          </span>
          <div className="hidden h-2 w-36 overflow-hidden rounded-full bg-amber-200/60 dark:bg-amber-900/40 sm:block">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
        <Link
          href={`/task/${nextAmbientStep.id}`}
          className="rounded-md bg-amber-500 px-3 py-1.5 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          Continue: {nextAmbientStep.title} →
        </Link>
      </div>
    </div>
  );
}
