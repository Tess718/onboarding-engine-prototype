"use client";

import { useState } from "react";
import { useOnboarding } from "../context/scoped-onboarding-context";
import { OnboardingInputField } from "./onboarding-input-field";

export function OnboardingRunner() {
  const { completeStepById, hasIncompleteGate, allStages } = useOnboarding();

  const [formData, setFormData] = useState<Record<string, any>>({});

  const gateStages = allStages.filter((s) => s.isSystemGate);
  const gateSteps = gateStages.flatMap((s) => s.steps);
  const activeGateStep = gateSteps.find((step) => !step.isCompleted);
  const activeGateStage = gateStages.find((s) =>
    s.steps.some((step) => step.id === activeGateStep?.id),
  );

  if (!hasIncompleteGate || !activeGateStep || !activeGateStage) {
    return null;
  }

  const activeIndex = gateSteps.indexOf(activeGateStep);
  const stepNumber = activeIndex + 1;
  const totalSteps = gateSteps.length;

  const isDisabled =
    activeGateStep.fields?.some((field) => {
      if (!field.required) return false;
      const val = formData[field.id];
      if (field.type === "checkbox") return val !== true;
      return typeof val === "string" ? val.trim() === "" : !val;
    }) ?? false;

  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (stepNumber / totalSteps) * circumference;

  return (
    <div className="flex-1 flex flex-col justify-between h-full space-y-12">
      <div className="flex justify-between items-center select-none">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full border border-zinc-100 bg-white shadow-sm font-bold text-xs">
          <svg className="absolute transform -rotate-90 w-full h-full">
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-zinc-100 fill-transparent"
              strokeWidth="3.5"
            />
            <circle
              cx="24"
              cy="24"
              r={radius}
              className="stroke-yellow-400 fill-transparent transition-all duration-300"
              strokeWidth="3.5"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>
          <span className="relative z-10 text-[10px] font-bold text-zinc-700">
            {stepNumber}/{totalSteps}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-8 max-w-md w-full py-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight text-zinc-900 leading-tight">
            {activeGateStep.title}
          </h1>
          {activeGateStep.description && (
            <p className="text-sm font-semibold text-zinc-500 leading-relaxed">
              {activeGateStep.description}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {activeGateStep.fields?.map((field) => (
            <OnboardingInputField
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, [field.id]: val }))
              }
            />
          ))}
        </div>
      </div>

      <div className="max-w-md w-full pt-4">
        <button
          onClick={() => {
            completeStepById(activeGateStage.id, activeGateStep.id);
            setFormData({});
          }}
          disabled={isDisabled}
          className="w-full py-4 px-6 rounded-xl bg-[#FFCD00] hover:bg-[#E6B800] active:scale-[0.99] text-zinc-900 font-extrabold text-sm tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed uppercase"
        >
          {stepNumber === totalSteps
            ? "✓ Finish & Enter Workspace"
            : "Continue"}
        </button>
      </div>
    </div>
  );
}
