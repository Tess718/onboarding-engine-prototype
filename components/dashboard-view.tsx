"use client";

import { useState } from "react";
import Link from "next/link";
import { useOnboarding } from "../context/OnboardingContext";

export function DashboardView() {
  const { allStages, completeStepById, empDept } = useOnboarding();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const ambientStages = allStages.filter((s) => !s.isSystemGate);
  const ambientSteps = ambientStages.flatMap((s) => s.steps);
  const incompleteAmbientSteps = ambientSteps.filter((step) => !step.isCompleted);
  const completedAmbientSteps = ambientSteps.filter((step) => step.isCompleted);

  const totalAmbientSteps = ambientSteps.length;
  const completedAmbientStepsCount = completedAmbientSteps.length;
  const pct = totalAmbientSteps > 0 ? Math.round((completedAmbientStepsCount / totalAmbientSteps) * 100) : 100;

  const nextAmbientStep = incompleteAmbientSteps[0];

  const currentHour = new Date().getHours();
  let greeting = "Good morning";
  if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good afternoon";
  } else if (currentHour >= 17) {
    greeting = "Good evening";
  }

  const pendingCount = incompleteAmbientSteps.length;
  const motivationalMessage = pendingCount > 0
    ? `${greeting}! You have ${pendingCount} pending onboarding task${pendingCount > 1 ? "s" : ""} remaining. Let's make some progress today!`
    : `${greeting}! You have completed all onboarding tasks. Welcome fully to the workspace!`;

  function formatDueDate(dueOffsetDays: number) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + dueOffsetDays);
    return targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  return (
    <div className="min-h-screen bg-[var(--color-background)] p-6 relative">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
              Welcome back to your corporate dashboard workspace.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-5 dark:border-violet-900/30 dark:bg-violet-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-violet-900 dark:text-violet-300 flex items-center gap-1.5">
              <span>👋</span>
              <span>{greeting}</span>
            </h2>
            <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
              {motivationalMessage}
            </p>
          </div>
          {nextAmbientStep && (
            <Link
              href={`/task/${nextAmbientStep.id}`}
              className="rounded-lg bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-750 transition-colors shadow-sm text-center shrink-0"
            >
              Start Next Task →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-4 items-start">
          <div className="md:col-span-3 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm flex flex-col justify-between h-40">
                <div>
                  <h3 className="mb-1 text-sm font-bold">Team Overview</h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Access active headcount, departments, and onboarding metrics.
                  </p>
                </div>
                <div className="text-xs font-semibold text-[var(--color-primary)]">
                  3 Active Members
                </div>
              </div>

              {empDept === "engineering" && (
                <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm flex flex-col justify-between h-40">
                  <div>
                    <h3 className="mb-1 text-sm font-bold">Engineering Console</h3>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Access repositories, 2FA setup, and cloud credential configurations.
                    </p>
                  </div>
                  <Link
                    href="/engineering"
                    className="text-xs font-semibold text-[var(--color-primary)] hover:underline flex items-center gap-1"
                  >
                    Open Console →
                  </Link>
                </div>
              )}

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm flex flex-col justify-between h-40">
                <div>
                  <h3 className="mb-1 text-sm font-bold">Vision &amp; Mission</h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Review our company culture, vision guidelines, and core values.
                  </p>
                </div>
                <Link
                  href="/documents/vision"
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Read Playbook →
                </Link>
              </div>

              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm flex flex-col justify-between h-40">
                <div>
                  <h3 className="mb-1 text-sm font-bold">Profile Settings</h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    Update corporate profile photos, user credentials, and display titles.
                  </p>
                </div>
                <Link
                  href="/settings/profile"
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Edit Profile →
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full text-left rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 space-y-5 transition-all hover:scale-[1.02] hover:shadow-md hover:border-violet-300 dark:hover:border-violet-850 group cursor-pointer"
            >
              <div className="text-center">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] group-hover:text-violet-600 transition-colors">
                  Onboarding Progress
                </h3>
              </div>

              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="relative flex items-center justify-center h-28 w-28">
                  <svg className="transform -rotate-90 w-full h-full">
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="stroke-[var(--color-border)] fill-transparent"
                      strokeWidth="8"
                    />
                    <circle
                      cx="56"
                      cy="56"
                      r={radius}
                      className="stroke-violet-600 fill-transparent transition-all duration-500 ease-out"
                      strokeWidth="8"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-lg font-bold">{pct}%</span>
                    <span className="text-[9px] text-[var(--color-muted-foreground)] font-medium">DONE</span>
                  </div>
                </div>
                <p className="text-[10px] text-[var(--color-muted-foreground)] text-center font-medium">
                  {completedAmbientStepsCount} of {totalAmbientSteps} steps completed
                </p>
                <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 group-hover:underline pt-1 inline-block">
                  View Checklist →
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {isDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-md border-l border-[var(--color-border)] bg-[var(--color-card)] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isDrawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-[var(--color-border)] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[var(--color-foreground)]">Onboarding Tasks</h2>
            <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
              Progress: <strong className="font-semibold text-violet-600">{pct}%</strong> ({completedAmbientStepsCount} of {totalAmbientSteps} completed)
            </p>
          </div>
          <button
            onClick={() => setIsDrawerOpen(false)}
            className="h-8 w-8 rounded-lg flex items-center justify-center border border-[var(--color-border)] hover:bg-[var(--color-muted)] text-lg cursor-pointer font-bold text-[var(--color-muted-foreground)]"
            title="Close"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Pending Tasks ({incompleteAmbientSteps.length})
            </h3>
            {incompleteAmbientSteps.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-foreground)] italic">No pending tasks remaining!</p>
            ) : (
              <div className="space-y-3">
                {incompleteAmbientSteps.map((step) => {
                  const parentStage = ambientStages.find((s) => s.steps.some((st) => st.id === step.id));
                  
                  let cardStyle = "border-[var(--color-border)] bg-[var(--color-card)]";
                  let badgeStyle = "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]";
                  let badgeText = `Due: ${formatDueDate(step.dueOffsetDays)}`;

                  if (step.dueStatus === "overdue") {
                    cardStyle = "border-red-250 bg-red-50/10 dark:border-red-900/30 dark:bg-red-950/5";
                    badgeStyle = "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 font-bold";
                    badgeText = `⚠️ Overdue (Due: ${formatDueDate(step.dueOffsetDays)})`;
                  } else if (step.dueStatus === "due-soon") {
                    cardStyle = "border-amber-250 bg-amber-50/10 dark:border-amber-900/30 dark:bg-amber-950/5";
                    badgeStyle = "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 font-bold";
                    badgeText = `⏳ Due Soon (Due: ${formatDueDate(step.dueOffsetDays)})`;
                  }

                  return (
                    <div
                      key={step.id}
                      className={`rounded-xl border p-4 shadow-sm flex flex-col justify-between gap-3 ${cardStyle}`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5">
                            {step.isManualAcknowledgement && (
                              <input
                                type="checkbox"
                                checked={false}
                                onChange={() => {
                                  if (parentStage) {
                                    completeStepById(parentStage.id, step.id);
                                  }
                                }}
                                className="mt-1 h-3.5 w-3.5 cursor-pointer rounded border-[var(--color-border)] accent-violet-600"
                                title="Mark Complete"
                              />
                            )}
                            <div>
                              <h4 className="text-xs font-bold text-[var(--color-foreground)] leading-snug">
                                {step.title}
                              </h4>
                              {parentStage && (
                                <span className="text-[9px] text-[var(--color-muted-foreground)] font-medium block">
                                  {parentStage.name}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-[11px] text-[var(--color-muted-foreground)] leading-normal pt-1 pl-6">
                          {step.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1 pl-6">
                        <span className={`inline-block rounded px-1.5 py-0.5 text-[9px] ${badgeStyle}`}>
                          {badgeText}
                        </span>
                        {!step.isManualAcknowledgement && (
                          <Link
                            href={`/task/${step.id}`}
                            onClick={() => setIsDrawerOpen(false)}
                            className="rounded bg-violet-600 hover:bg-violet-750 text-white text-[10px] font-bold px-2.5 py-1 text-center shrink-0 shadow-sm"
                          >
                            Start Task →
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="space-y-3 pt-4 border-t border-[var(--color-border)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
              Completed Tasks ({completedAmbientSteps.length})
            </h3>
            {completedAmbientSteps.length === 0 ? (
              <p className="text-xs text-[var(--color-muted-foreground)] italic">No completed tasks yet.</p>
            ) : (
              <div className="space-y-2">
                {completedAmbientSteps.map((step) => {
                  const parentStage = ambientStages.find((s) => s.steps.some((st) => st.id === step.id));
                  return (
                    <div
                      key={step.id}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/20 px-3.5 py-2.5 flex items-center justify-between gap-4 opacity-75"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-emerald-600 text-xs font-bold">✓</span>
                        <div className="truncate">
                          <span className="block text-xs font-semibold text-[var(--color-muted-foreground)] line-through truncate leading-normal">
                            {step.title}
                          </span>
                          {parentStage && (
                            <span className="text-[8px] text-[var(--color-muted-foreground)] block">
                              {parentStage.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 text-[8px] font-bold uppercase shrink-0">
                        Done
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
