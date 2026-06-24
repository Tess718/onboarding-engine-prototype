"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "../context/OnboardingContext";

export function OnboardingRunner() {
  const {
    completeStepById,
    hasIncompleteGate,
    allStages,
  } = useOnboarding();
  const router = useRouter();

  const [formData, setFormData] = useState<Record<string, any>>({});

  const gateStages = allStages.filter((s) => s.isSystemGate);
  const gateSteps = gateStages.flatMap((s) => s.steps);
  const activeGateStep = gateSteps.find((step) => !step.isCompleted);
  const activeGateStage = gateStages.find((s) => s.steps.some((step) => step.id === activeGateStep?.id));

  useEffect(() => {
    if (!hasIncompleteGate) {
      router.push("/dashboard");
    }
  }, [hasIncompleteGate, router]);

  if (hasIncompleteGate && activeGateStep && activeGateStage) {
    const activeIndex = gateSteps.indexOf(activeGateStep);
    const stepNumber = activeIndex + 1;
    const totalSteps = gateSteps.length;
    const progressPct = Math.round((stepNumber / totalSteps) * 100);

    const isDisabled = activeGateStep.fields?.some((field) => {
      if (!field.required) return false;
      const val = formData[field.id];
      if (field.type === "checkbox") return val !== true;
      return typeof val === "string" ? val.trim() === "" : !val;
    }) ?? false;

    const radius = 20;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (stepNumber / totalSteps) * circumference;

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
              <div key={field.id} className="space-y-4">
                {field.type === "password" && (
                  <input
                    type="password"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
                  />
                )}
                
                {field.type === "text" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
                  />
                )}
                
                {field.type === "tel" && (
                  <input
                    type="tel"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
                  />
                )}
                
                {field.type === "info_block" && (
                  <div className="rounded-xl border border-zinc-100 bg-[#F8F9FA]/50 p-4 max-h-36 overflow-y-auto text-[11px] text-zinc-500 leading-relaxed space-y-2 font-medium">
                    <p className="font-bold text-zinc-800">{field.label}</p>
                    <div className="whitespace-pre-wrap">{field.content}</div>
                  </div>
                )}
                
                {field.type === "signature" && (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.value }))}
                    className="w-full font-serif italic bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 transition-all shadow-sm"
                  />
                )}
                
                {field.type === "checkbox" && (
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={formData[field.id] || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.id]: e.target.checked }))}
                      className="mt-1 h-4 w-4 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-400 accent-yellow-400 cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-zinc-500 leading-snug select-none">
                      {field.label}
                    </span>
                  </label>
                )}
              </div>
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
            {stepNumber === totalSteps ? "✓ Finish & Enter Workspace" : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
