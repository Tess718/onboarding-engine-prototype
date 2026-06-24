"use client";

import React, { useState, useEffect } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { StepField } from "../constants/mock-data";

interface TaskViewProps {
  id: string;
}

export function TaskView({ id }: TaskViewProps) {
  const { allStages, completeStepById } = useOnboarding();
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");

  const stage = allStages.find((s) => s.steps.some((st) => st.id === id));
  const step = stage?.steps.find((st) => st.id === id);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step && step.actionUrl && !step.isCompleted) {
      router.replace(`${step.actionUrl}?origin=${origin || "onboarding"}`);
    }
  }, [step, router, origin]);

  if (!stage || !step) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <h2 className="text-lg font-bold text-red-500">Error</h2>
        <p className="text-xs text-[var(--color-muted-foreground)]">Task not found in your assigned pipelines.</p>
        <Link href="/dashboard" className="text-xs text-[var(--color-primary)] underline mt-4 inline-block">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  if (step.actionUrl && !step.isCompleted) {
    return (
      <div className="mx-auto max-w-xl p-20 text-center space-y-2">
        <p className="text-xs text-[var(--color-muted-foreground)]">Redirecting to task console...</p>
      </div>
    );
  }

  const handleFinishTask = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      completeStepById(stage.id, step.id);
      setIsSubmitting(false);
    }, 600);
  };

  const handleBack = () => {
    if (origin === "onboarding") {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  const updateField = (fieldId: string, value: any) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const isFormValid = step.fields ? step.fields.every((field) => {
    if (!field.required) return true;
    
    const value = formData[field.id];
    if (field.type === "input_group" && field.inputs) {
      return field.inputs.every(input => formData[`${field.id}_${input.id}`]);
    }
    if (field.type === "authenticator") {
      return typeof value === "string" && value.length === 6;
    }
    
    return value !== undefined && value !== "" && value !== false;
  }) : true;

  const renderField = (field: StepField) => {
    const value = formData[field.id];

    switch (field.type) {
      case "info_block":
        return (
          <div key={field.id} className="space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            <div className="rounded-xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 p-5 shadow-sm">
              <div className="flex gap-3">
                <div className="space-y-1">
                  {field.content?.split("\n").map((line, i) => (
                    <p key={i} className="text-xs text-amber-700/80 dark:text-amber-500/80 font-medium leading-relaxed">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "checkbox":
        return (
          <label key={field.id} className="flex items-center gap-3 cursor-pointer pt-2 group">
            <div className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${value ? 'bg-violet-600 border-violet-600' : 'border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-700'}`}>
              {value && <span className="text-white text-[10px] font-bold">✓</span>}
            </div>
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => updateField(field.id, e.target.checked)}
              className="sr-only"
            />
            <span className="text-sm font-semibold select-none group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
              {field.label}
            </span>
          </label>
        );

      case "radio_card_group":
        return (
          <div key={field.id} className="space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {field.options?.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex flex-col cursor-pointer items-start rounded-xl border p-4 transition-all duration-300 ${
                    value === opt.id
                      ? "border-violet-500 bg-violet-50/50 dark:bg-violet-900/20 shadow-[0_0_15px_rgba(139,92,246,0.15)] -translate-y-1 ring-1 ring-violet-500"
                      : "border-[var(--color-border)] bg-[var(--color-background)]/50 hover:bg-[var(--color-muted)] hover:-translate-y-0.5"
                  }`}
                >
                  <input
                    type="radio"
                    name={field.id}
                    checked={value === opt.id}
                    onChange={() => updateField(field.id, opt.id)}
                    className="sr-only"
                  />
                  <div className="flex justify-between w-full items-center mb-2">
                    <span className="block text-sm font-bold text-[var(--color-foreground)]">{opt.title}</span>
                    <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${value === opt.id ? 'border-violet-600' : 'border-[var(--color-muted-foreground)]'}`}>
                      {value === opt.id && <div className="h-2 w-2 rounded-full bg-violet-600" />}
                    </div>
                  </div>
                  {opt.desc && (
                    <span className="text-[11px] text-[var(--color-muted-foreground)] font-medium leading-relaxed">{opt.desc}</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        );

      case "slider":
        const currentVal = value !== undefined ? value : (field.min || 0);
        return (
          <div key={field.id} className="space-y-6">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold">Selected Rate</span>
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">{currentVal}%</span>
              </div>
              <div className="relative pt-2">
                <input
                  type="range"
                  min={field.min}
                  max={field.max}
                  value={currentVal}
                  onChange={(e) => updateField(field.id, Number(e.target.value))}
                  className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
                />
              </div>
              <div className="flex justify-between text-[10px] text-[var(--color-muted-foreground)] font-bold">
                <span>{field.min}% (Min)</span>
                <span>{field.max}% (Max)</span>
              </div>
            </div>
          </div>
        );

      case "input_group":
        return (
          <div key={field.id} className="space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {field.inputs?.map((input) => {
                const subKey = `${field.id}_${input.id}`;
                return (
                  <div key={subKey} className="space-y-1.5">
                    <label className="block text-xs font-bold text-[var(--color-foreground)] pl-1">{input.label}</label>
                    <input
                      type="text"
                      placeholder={input.placeholder}
                      maxLength={input.maxLength}
                      value={formData[subKey] || ""}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        updateField(subKey, val);
                      }}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-inner"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "email":
      case "text":
        return (
          <div key={field.id} className="space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            <div className="space-y-1.5">
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={value || ""}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-inner"
              />
            </div>
          </div>
        );

      case "datetime":
        return (
          <div key={field.id} className="space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            <div className="space-y-1.5">
              <input
                type="datetime-local"
                value={value || ""}
                onChange={(e) => updateField(field.id, e.target.value)}
                className="w-full sm:w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-inner"
              />
            </div>
          </div>
        );

      case "terminal_block":
        return (
          <div key={field.id} className="space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            <div className="rounded-xl overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
              <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-rose-500" />
                <div className="h-3 w-3 rounded-full bg-amber-500" />
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-zinc-500 font-mono font-bold mx-auto -ml-8">{field.label}</span>
              </div>
              <div className="p-4 font-mono text-xs space-y-1.5 select-all">
                {field.commands?.map((cmd, idx) => (
                  <div key={idx} className={`${cmd.color || "text-zinc-300"} ${cmd.bold ? "font-bold" : ""}`}>
                    {cmd.prefix && <span className="text-zinc-500 mr-2 select-none">{cmd.prefix}</span>}
                    {cmd.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "authenticator":
        return (
          <div key={field.id} className="space-y-6">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            <div className="flex gap-5 items-center rounded-xl bg-[var(--color-background)] p-4 border border-[var(--color-border)]">
              <div className="h-16 w-16 bg-white dark:bg-zinc-800 shadow-sm border border-[var(--color-border)] flex items-center justify-center text-3xl select-none shrink-0 rounded-xl">
                📱
              </div>
              <div className="space-y-1">
                <span className="block text-sm font-bold">Scan the security QR code</span>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">Enter the generated 6-digit confirmation code below to verify.</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-xs font-bold pl-1 text-[var(--color-foreground)]">Verification Code</label>
              <input
                type="text"
                placeholder="000000"
                maxLength={6}
                value={value || ""}
                onChange={(e) => updateField(field.id, e.target.value.replace(/\D/g, ""))}
                className="w-full sm:w-1/3 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-lg font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-inner"
              />
            </div>
          </div>
        );

      case "action_button":
        const isLoading = formData[`${field.id}_loading`];
        const isDone = formData[field.id];

        const handleAction = () => {
          if (isDone) return;
          updateField(`${field.id}_loading`, true);
          setTimeout(() => {
            updateField(`${field.id}_loading`, false);
            updateField(field.id, true);
          }, 1200);
        };

        return (
          <div key={field.id} className="space-y-4">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              {field.label}
            </span>
            {isDone ? (
              <div className="rounded-xl border border-emerald-300/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 p-4 shadow-sm animate-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">✓</span>
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Action Completed Successfully</span>
                </div>
              </div>
            ) : (
              <button
                onClick={handleAction}
                disabled={isLoading}
                className={`w-full sm:w-auto px-8 rounded-xl border p-4 text-center transition-all duration-300 font-bold text-sm cursor-pointer shadow-sm border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-muted)] hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50`}
              >
                {isLoading ? "Processing..." : field.actionText || field.label}
              </button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative min-h-screen pt-12 pb-24 px-6 overflow-hidden">
      <div className="fixed inset-0 -z-10 bg-[var(--color-background)]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-400/20 dark:bg-violet-900/20 blur-[120px] mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 dark:bg-indigo-900/20 blur-[120px] mix-blend-multiply dark:mix-blend-lighten pointer-events-none" />
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <button
            onClick={handleBack}
            className="text-xs font-semibold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors cursor-pointer flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Return to Dashboard
          </button>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl shadow-2xl p-8 sm:p-10 relative overflow-hidden transition-all duration-500">
          
          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <span className="inline-block rounded-full bg-violet-100 dark:bg-violet-900/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-400 shadow-sm border border-violet-200/50 dark:border-violet-800/50">
                {stage.name}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600 dark:from-violet-400 dark:to-indigo-400 pb-1">
                {step.title}
              </h1>
            </div>

            {step.isCompleted ? (
              <div className="text-center py-12 space-y-6 animate-in fade-in zoom-in duration-500">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-400 to-emerald-600 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
                  <span className="text-4xl text-white">✓</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                    Task Completed Successfully
                  </h2>
                  <p className="text-sm text-[var(--color-muted-foreground)] max-w-sm mx-auto mt-2 leading-relaxed">
                    This ambient task is complete. Your global onboarding progress has been updated seamlessly.
                  </p>
                </div>
                <button
                  onClick={handleBack}
                  className="rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 dark:from-zinc-100 dark:to-zinc-200 px-6 py-3 text-sm font-bold text-white dark:text-zinc-900 hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  Continue Journey
                </button>
              </div>
            ) : (
              <div className="space-y-8 animate-in fade-in duration-500">
                <p className="text-sm sm:text-base text-[var(--color-muted-foreground)] leading-relaxed font-medium">
                  {step.description}
                </p>

                {step.fields && step.fields.length > 0 && (
                  <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)]/50 p-6 shadow-inner space-y-8">
                    {step.fields.map(renderField)}
                  </div>
                )}

                {(!step.fields || step.fields.length === 0) && (
                  <div className="text-center py-4 text-xs text-[var(--color-muted-foreground)] font-medium bg-[var(--color-background)]/50 rounded-lg">
                    Review the details and confirm completion below.
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={handleFinishTask}
                    disabled={isSubmitting || !isFormValid}
                    className="group relative w-full cursor-pointer rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-4 text-sm font-extrabold text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 transition-all disabled:opacity-50 disabled:pointer-events-none text-center overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? "Syncing..." : "Confirm & Mark Complete"}
                      {!isSubmitting && <span className="group-hover:translate-x-1 transition-transform">→</span>}
                    </span>
                    <div className="absolute inset-0 -z-0 bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
