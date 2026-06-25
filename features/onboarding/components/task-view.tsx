"use client";

import React, { useState } from "react";
import { useOnboarding } from "../context/scoped-onboarding-context";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TaskInputField } from "./task-input-field";

interface TaskViewProps {
  id: string;
  origin?: string;
}

export function TaskView({ id, origin }: TaskViewProps) {
  const { allStages, completeStepById } = useOnboarding();
  const router = useRouter();

  const stage = allStages.find((s) => s.steps.some((st) => st.id === id));
  const step = stage?.steps.find((st) => st.id === id);

  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!stage || !step) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <h2 className="text-lg font-bold text-red-500">Error</h2>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Task not found in your assigned pipelines.
        </p>
        <Link
          href="/dashboard"
          className="text-xs text-[var(--color-primary)] underline mt-4 inline-block"
        >
          Go to Dashboard
        </Link>
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

  const isFormValid = step.fields
    ? step.fields.every((field) => {
        if (!field.required) return true;

        const value = formData[field.id];
        if (field.type === "input_group" && field.inputs) {
          return field.inputs.every(
            (input) => formData[`${field.id}_${input.id}`],
          );
        }
        if (field.type === "authenticator") {
          return typeof value === "string" && value.length === 6;
        }

        return value !== undefined && value !== "" && value !== false;
      })
    : true;

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
            <span className="group-hover:-translate-x-1 transition-transform">
              ←
            </span>
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
                    This ambient task is complete. Your global onboarding
                    progress has been updated seamlessly.
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
                    {step.fields.map((field) => (
                      <TaskInputField
                        key={field.id}
                        field={field}
                        formData={formData}
                        onChange={updateField}
                      />
                    ))}
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
                      {!isSubmitting && (
                        <span className="group-hover:translate-x-1 transition-transform">
                          →
                        </span>
                      )}
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
