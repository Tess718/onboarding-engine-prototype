"use client";

import { useState, useTransition } from "react";
import { OnboardingPipeline, OnboardingStep } from "../constants/mock-data";
import { updateOnboardingProgress } from "../actions/actions";

interface OnboardingRunnerProps {
  initialPipelineData: OnboardingPipeline[];
  storageKey: string;
  initialType: string;
}

export function OnboardingRunner({
  initialPipelineData,
  storageKey,
  initialType,
}: OnboardingRunnerProps) {
  const [pipelines, setPipelines] =
    useState<OnboardingPipeline[]>(initialPipelineData);
  const [isPending, startTransition] = useTransition();

  const [currentPipelineIdx, setCurrentPipelineIdx] = useState(0);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  const activePipeline = pipelines[currentPipelineIdx];
  const activeStage = activePipeline?.stages[currentStageIdx];
  const totalStagesInCurrentPipeline = activePipeline?.stages.length || 0;

  const handleToggleStep = (stepId: string) => {
    const updated = pipelines.map((p, pIdx) => {
      if (pIdx !== currentPipelineIdx) return p;
      return {
        ...p,
        stages: p.stages.map((s, sIdx) => {
          if (sIdx !== currentStageIdx) return s;
          return {
            ...s,
            steps: s.steps.map((step) =>
              step.id === stepId
                ? { ...step, isCompleted: !step.isCompleted }
                : step,
            ),
          };
        }),
      };
    });

    setPipelines(updated);
    startTransition(async () => {
      await updateOnboardingProgress(storageKey, updated);
    });
  };

  const isCurrentStageComplete =
    activeStage?.steps.every((step) => step.isCompleted) ?? false;

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

  const allStagesCompleted = pipelines
    .flatMap((p) => p.stages)
    .flatMap((s) => s.steps)
    .every((step) => step.isCompleted);

  if (allStagesCompleted) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50/40 p-8 text-center shadow-sm dark:border-emerald-700 dark:bg-emerald-950/30">
        <h2 className="mb-2 text-2xl font-bold text-emerald-800 dark:text-emerald-300">
          Onboarding Complete! 🎉
        </h2>
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          All structural steps satisfied. The data tracking state is fully
          complete.
        </p>
      </div>
    );
  }

  if (!activePipeline || !activeStage) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
      <aside className="md:col-span-1 sticky top-6 space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Your Journey Map
          </h3>
          <p className="text-[10px] text-[var(--color-muted-foreground)]">
            Real-time track monitoring
          </p>
        </div>

        <nav className="space-y-2">
          {pipelines.map((pipeline, pIdx) => {
            const isCurrentTrack = pIdx === currentPipelineIdx;
            const isPastTrack = pIdx < currentPipelineIdx;

            const totalSteps = pipeline.stages.reduce(
              (acc, s) => acc + s.steps.length,
              0,
            );
            const completedSteps = pipeline.stages.reduce(
              (acc, s) => acc + s.steps.filter((st) => st.isCompleted).length,
              0,
            );
            const isTrackFinished =
              totalSteps > 0 && totalSteps === completedSteps;

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
                  <span className="truncate text-xs font-semibold">
                    {pipeline.title}
                  </span>
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
              style={{
                width: `${((currentStageIdx + 1) / totalStagesInCurrentPipeline) * 100}%`,
              }}
            />
          </div>
        </div>

        <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-md">
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {activeStage.name}
            </h2>
            <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
              Complete all tasks in this section to unlock the next stage.
            </p>
          </div>

          <hr className="border-[var(--color-border)]" />

          <ul className="space-y-3">
            {activeStage.steps.map((step: OnboardingStep) => (
              <li
                key={step.id}
                className={`flex items-start gap-3 rounded-lg border p-3 transition-all ${
                  step.isCompleted
                    ? "border-[var(--color-border)] bg-[var(--color-muted)] opacity-70 shadow-inner"
                    : "border-[var(--color-border)] bg-[var(--color-background)]"
                }`}
              >
                <input
                  type="checkbox"
                  id={step.id}
                  checked={step.isCompleted}
                  onChange={() => handleToggleStep(step.id)}
                  className="mt-1 h-4 w-4 cursor-pointer rounded border-[var(--color-border)] accent-[var(--color-primary)] shadow-sm"
                />
                <label
                  htmlFor={step.id}
                  className="flex-1 cursor-pointer select-none text-sm font-medium leading-tight"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        step.isCompleted
                          ? "font-normal text-[var(--color-muted-foreground)] line-through"
                          : ""
                      }
                    >
                      {step.title}
                    </span>
                    {step.requiresSpecialView && (
                      <span className="rounded bg-blue-100 px-1.5 py-px text-[9px] font-bold uppercase tracking-wider text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
                        Special View
                      </span>
                    )}
                  </div>
                  {step.description && (
                    <p className="mt-1 text-xs font-normal text-[var(--color-muted-foreground)]">
                      {step.description}
                    </p>
                  )}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentPipelineIdx === 0 && currentStageIdx === 0}
            className="cursor-pointer rounded-md border border-[var(--color-border)] px-4 py-2 text-sm font-medium transition-colors hover:bg-[var(--color-muted)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            ← Back
          </button>

          {isPending && (
            <span className="animate-pulse text-xs text-[var(--color-muted-foreground)]">
              Syncing...
            </span>
          )}

          <button
            onClick={handleNext}
            disabled={!isCurrentStageComplete}
            className="cursor-pointer rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-[var(--color-primary-foreground)] shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {currentPipelineIdx === pipelines.length - 1 &&
            currentStageIdx === totalStagesInCurrentPipeline - 1
              ? "Finish 🎉"
              : "Next Stage →"}
          </button>
        </div>
      </div>
    </div>
  );
}
