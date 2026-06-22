"use client";

import React, { createContext, useContext, useState, useMemo, useTransition } from "react";
import { OnboardingPipeline, OnboardingStage } from "../constants/mock-data";
import { updateOnboardingProgress } from "../actions/actions";

interface OnboardingContextProps {
  pipelines: OnboardingPipeline[];
  allStages: OnboardingStage[];
  canAccessDashboard: boolean;
  allCompleted: boolean;
  isPending: boolean;
  isStageUnlocked: (stageId: string) => boolean;
  isStepUnlocked: (stageId: string, stepId: string) => boolean;
  handleToggleStep: (pipelineIdx: number, stageIdx: number, stepId: string) => void;
  completeStepById: (stageId: string, stepId: string) => void;
}

const OnboardingContext = createContext<OnboardingContextProps | undefined>(undefined);

interface OnboardingProviderProps {
  initialPipelineData: OnboardingPipeline[];
  storageKey: string;
  children: React.ReactNode;
}

export function OnboardingProvider({ initialPipelineData, storageKey, children }: OnboardingProviderProps) {
  const [pipelines, setPipelines] = useState<OnboardingPipeline[]>(initialPipelineData);
  const [isPending, startTransition] = useTransition();

  const allStages = useMemo<OnboardingStage[]>(
    () => pipelines.flatMap((p) => p.stages),
    [pipelines]
  );

  const canAccessDashboard = useMemo(
    () =>
      allStages
        .filter((s) => s.isMandatory)
        .every((s) => s.steps.every((step) => step.isCompleted)),
    [allStages]
  );

  const allCompleted = useMemo(
    () => allStages.every((s) => s.steps.every((step) => step.isCompleted)),
    [allStages]
  );

  const isStageUnlocked = (stageId: string): boolean => {
    const target = allStages.find((s) => s.id === stageId);
    if (!target || target.dependsOn.stages.length === 0) return true;
    return target.dependsOn.stages.every((prereqId) => {
      const prereq = allStages.find((s) => s.id === prereqId);
      if (!prereq) return false;
      return prereq.steps.every((step) => step.isCompleted);
    });
  };

  const isStepUnlocked = (stageId: string, stepId: string): boolean => {
    const stage = allStages.find((s) => s.id === stageId);
    if (!stage) return true;
    const step = stage.steps.find((st) => st.id === stepId);
    if (!step || !step.dependsOn || step.dependsOn.steps.length === 0) return true;
    return step.dependsOn.steps.every((prereqStepId) => {
      const prereq = stage.steps.find((st) => st.id === prereqStepId);
      return prereq?.isCompleted ?? false;
    });
  };

  const syncUpdate = (updated: OnboardingPipeline[]) => {
    setPipelines(updated);
    startTransition(async () => {
      await updateOnboardingProgress(storageKey, updated);
    });
  };

  const handleToggleStep = (pipelineIdx: number, stageIdx: number, stepId: string) => {
    const updated = pipelines.map((p, pIdx) => {
      if (pIdx !== pipelineIdx) return p;
      return {
        ...p,
        stages: p.stages.map((s, sIdx) => {
          if (sIdx !== stageIdx) return s;
          return {
            ...s,
            steps: s.steps.map((step) =>
              step.id === stepId ? { ...step, isCompleted: !step.isCompleted } : step
            ),
          };
        }),
      };
    });
    syncUpdate(updated);
  };

  const completeStepById = (stageId: string, stepId: string) => {
    const updated = pipelines.map((p) => ({
      ...p,
      stages: p.stages.map((s) => {
        if (s.id !== stageId) return s;
        return {
          ...s,
          steps: s.steps.map((step) =>
            step.id === stepId ? { ...step, isCompleted: true } : step
          ),
        };
      }),
    }));
    syncUpdate(updated);
  };

  return (
    <OnboardingContext.Provider
      value={{
        pipelines,
        allStages,
        canAccessDashboard,
        allCompleted,
        isPending,
        isStageUnlocked,
        isStepUnlocked,
        handleToggleStep,
        completeStepById,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) throw new Error("useOnboarding must be used inside an OnboardingProvider");
  return context;
}
