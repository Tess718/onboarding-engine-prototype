"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { OnboardingStep } from "../constants/mock-data";
import { useOnboarding } from "../context/OnboardingContext";

export function OnboardingRunner() {
  const { pipelines, allCompleted, isStageUnlocked, isStepUnlocked, handleToggleStep, isPending, canAccessDashboard } = useOnboarding();
  const router = useRouter();

  useEffect(() => {
    if (allCompleted) {
      router.push("/dashboard");
    }
  }, [allCompleted, router]);

  const [currentPipelineIdx, setCurrentPipelineIdx] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  const activePipeline = pipelines[currentPipelineIdx];
  const activeStage = activePipeline?.stages[currentStageIdx];
  const totalStagesInCurrentPipeline = activePipeline?.stages.length || 0;

  const isCurrentStageComplete = activeStage?.steps.every((step) => step.isCompleted) ?? false;

  const handleNext = () => {
    if (!isCurrentStageComplete) return;
    if (currentStageIdx < totalStagesInCurrentPipeline - 1) {
      setCurrentStageIdx((prev) => prev + 1);
    } else if (currentPipelineIdx < pipelines.length - 1) {
      setCurrentPipelineIdx((prev) => prev + 1);
      setCurrentStageIdx(0);
    }
  };

  const handlePrevious = () => {
    if (currentStageIdx > 0) {
      setCurrentStageIdx((prev) => prev - 1);
    } else if (currentPipelineIdx > 0) {
      setCurrentPipelineIdx((prev) => prev - 1);
      setCurrentStageIdx(pipelines[currentPipelineIdx - 1].stages.length - 1);
    }
  };

  if (allCompleted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <span className="text-3xl">🎉</span>
        <h2 className="text-xl font-bold tracking-tight">Onboarding Complete!</h2>
        <p className="text-xs text-[var(--color-muted-foreground)]">Redirecting you to your dashboard…</p>
      </div>
    );
  }

  if (!activePipeline || !activeStage) return null;

  const stageUnlocked = isStageUnlocked(activeStage.id);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
      <aside className="md:col-span-1 sticky top-6 space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Your Journey Map
          </h3>
          <p className="text-[10px] text-[var(--color-muted-foreground)]">Real-time track monitoring</p>
        </div>

        {!canAccessDashboard && (
          <div className="rounded-lg border border-amber-300 bg-amber-50/60 px-3 py-2 text-[10px] text-amber-700 dark:border-amber-700/40 dark:bg-amber-950/20 dark:text-amber-400">
            ⚠️ Complete mandatory steps to unlock the dashboard.
          </div>
        )}

        <nav className="space-y-2">
          {pipelines.map((pipeline, pIdx) => {
            const isCurrentTrack = pIdx === currentPipelineIdx;
            const isPastTrack = pIdx < currentPipelineIdx;
            const totalSteps = pipeline.stages.reduce((acc, s) => acc + s.steps.length, 0);
            const completedSteps = pipeline.stages.reduce((acc, s) => acc + s.steps.filter((st) => st.isCompleted).length, 0);
            const isTrackFinished = totalSteps > 0 && totalSteps === completedSteps;

            return (
              <div
                key={pipeline.id}
                className={`rounded-lg border p-3 text-left transition-all ${
                  isCurrentTrack
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] font-medium text-[var(--color-primary-foreground)] shadow-sm"
                    : isPastTrack || isTrackFinished
                    ? "border-transparent bg-[var(--color-muted)] text-[var(--color-muted-foreground)] opacity-75"
                    : "border-transparent bg-transparent text-[var(--color-muted-foreground)]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-xs font-semibold">{pipeline.title}</span>
                  {isTrackFinished && <span className="text-xs">✓</span>}
                </div>

                {isCurrentTrack && (
                  <ul className="mt-2 space-y-1 border-l border-[var(--color-primary-foreground)]/30 pl-2 text-[11px]">
                    {pipeline.stages.map((stage, sIdx) => {
                      const isCurrentStage = sIdx === currentStageIdx;
                      const isPastStage = sIdx < currentStageIdx;
                      return (
                        <li
                          key={stage.id}
                          className={`truncate ${
                            isCurrentStage
                              ? "font-bold text-[var(--color-primary-foreground)] opacity-100"
                              : "opacity-50"
                          } ${isPastStage ? "line-through opacity-40" : ""}`}
                        >
                          {stage.name}
                          {stage.isMandatory && (
                            <span className="ml-1 text-[9px] opacity-70">★</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="md:col-span-3 space-y-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-xs text-[var(--color-muted-foreground)]">
            <span className="font-medium uppercase tracking-wider text-[var(--color-foreground)]">
              Active Focus: {activePipeline.title}
            </span>
            <span>
              Stage {currentStageIdx + 1} of {totalStagesInCurrentPipeline}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-muted)]">
            <div
              className="h-full bg-[var(--color-primary)] transition-all duration-300"
              style={{ width: `${((currentStageIdx + 1) / totalStagesInCurrentPipeline) * 100}%` }}
            />
          </div>
        </div>

        <div className={`space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-md ${!stageUnlocked ? "opacity-50" : ""}`}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-tight">{activeStage.name}</h2>
              {activeStage.isMandatory && (
                <span className="rounded bg-amber-100 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  Mandatory
                </span>
              )}
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
              {stageUnlocked
                ? "Complete all tasks in this section to unlock the next stage."
                : "Complete prerequisite stages to unlock this section."}
            </p>
          </div>

          <hr className="border-[var(--color-border)]" />

          <ul className="space-y-3">
            {[...activeStage.steps]
              .sort((a, b) => {
                const orderA = a.dependsOn?.order ?? 0;
                const orderB = b.dependsOn?.order ?? 0;
                return orderA - orderB;
              })
              .map((step: OnboardingStep) => {
                const stepUnlocked = isStepUnlocked(activeStage.id, step.id);
                const fullyLocked = !stageUnlocked || !stepUnlocked;

                const prereqTitles = step.dependsOn?.steps
                  .map((prereqId) => {
                    const prereqStep = activeStage.steps.find((s) => s.id === prereqId);
                    return prereqStep?.title;
                  })
                  .filter(Boolean) ?? [];

                return (
                  <li
                    key={step.id}
                    className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                      step.isCompleted
                        ? "border-[var(--color-border)] bg-[var(--color-muted)] opacity-70 shadow-inner"
                        : !stepUnlocked && stageUnlocked
                        ? "border-[var(--color-border)] bg-[var(--color-muted)]/40 opacity-60"
                        : step.actionUrl
                        ? "border-[var(--color-border)] bg-[var(--color-background)] hover:border-violet-400 hover:shadow-sm cursor-pointer"
                        : "border-[var(--color-border)] bg-[var(--color-background)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id={step.id}
                      checked={step.isCompleted}
                      disabled={fullyLocked}
                      onChange={() => handleToggleStep(currentPipelineIdx, currentStageIdx, step.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 h-4 w-4 flex-shrink-0 cursor-pointer rounded border-[var(--color-border)] accent-[var(--color-primary)] shadow-sm disabled:cursor-not-allowed"
                    />
                    {step.actionUrl && !step.isCompleted && stepUnlocked ? (
                      <Link
                        href={`${step.actionUrl}?origin=onboarding`}
                        className="flex-1 select-none text-sm font-medium leading-tight"
                      >
                        <div className="flex items-center gap-2">
                          <span>{step.title}</span>
                          {step.requiresSpecialView && (
                            <span className="rounded bg-blue-100 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                              Special View
                            </span>
                          )}
                          <span className="rounded bg-violet-100 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-violet-700 dark:bg-violet-950/40 dark:text-violet-400">
                            → Complete here
                          </span>
                        </div>
                        {step.description && (
                          <p className="mt-1 text-xs font-normal text-[var(--color-muted-foreground)]">
                            {step.description}
                          </p>
                        )}
                      </Link>
                    ) : (
                      <label
                        htmlFor={step.id}
                        className={`flex-1 select-none text-sm font-medium leading-tight ${
                          fullyLocked ? "cursor-not-allowed" : "cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={step.isCompleted ? "font-normal text-[var(--color-muted-foreground)] line-through" : ""}>
                            {step.title}
                          </span>
                          {step.requiresSpecialView && (
                            <span className="rounded bg-blue-100 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                              Special View
                            </span>
                          )}
                          {!stepUnlocked && stageUnlocked && (
                            <span className="rounded bg-[var(--color-muted)] px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                              🔒 Locked
                            </span>
                          )}
                        </div>
                        {step.description && (
                          <p className="mt-1 text-xs font-normal text-[var(--color-muted-foreground)]">
                            {step.description}
                          </p>
                        )}
                        {!stepUnlocked && stageUnlocked && prereqTitles.length > 0 && (
                          <p className="mt-1.5 text-[10px] font-normal text-[var(--color-muted-foreground)] italic">
                            Requires: {prereqTitles.join(", ")}
                          </p>
                        )}
                      </label>
                    )}
                  </li>
                );
              })}

          </ul>
        </div>

        <div className="space-y-3">
          {!canAccessDashboard && (
            <p className="text-center text-[10px] text-[var(--color-muted-foreground)]">
              Complete all mandatory steps to unlock dashboard access.
            </p>
          )}

          <div className="flex items-center justify-between gap-3">
            <div className="flex gap-5">
              <button
                onClick={handlePrevious}
                disabled={currentPipelineIdx === 0 && currentStageIdx === 0}
                className="cursor-pointer rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Back
              </button>
              <div className="flex flex-col items-center gap-1">
                <button
                  onClick={() => router.push("/dashboard")}
                  disabled={!canAccessDashboard}
                  title={canAccessDashboard ? "Open your dashboard" : "Complete all mandatory steps first"}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition-all ${
                    canAccessDashboard
                      ? "cursor-pointer border-emerald-500 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50"
                      : "cursor-not-allowed border-[var(--color-border)] bg-[var(--color-muted)]/40 text-[var(--color-muted-foreground)] opacity-50"
                  }`}
                >
                  {canAccessDashboard ? "Go to Dashboard" : "Dashboard Locked"}
                </button>
                {isPending && <span className="animate-pulse text-[10px] text-[var(--color-muted-foreground)]">Syncing…</span>}
              </div>

            </div>

            <button
              onClick={handleNext}
              disabled={!isCurrentStageComplete || !stageUnlocked}
              className="cursor-pointer rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {currentPipelineIdx === pipelines.length - 1 && currentStageIdx === totalStagesInCurrentPipeline - 1
                ? "Finish 🎉"
                : "Next Stage →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
