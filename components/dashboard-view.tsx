"use client";

import Link from "next/link";
import { useOnboarding } from "../context/OnboardingContext";

export function DashboardView() {
  const { canAccessDashboard, allStages, completeStepById } = useOnboarding();

  const blockingStage = allStages.find(
    (s) => s.isMandatory && s.steps.some((st) => !st.isCompleted)
  );

  return (
    <div className="relative flex min-h-screen flex-col">

      <div className="flex-1 p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <h3 className="mb-2 font-bold">Team Overview</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">Active headcount and schedule metrics.</p>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <h3 className="mb-2 font-bold">Read Our Vision</h3>
              <Link href="/documents/vision">Read the mision statement to get inspired</Link>
            </div>
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <h3 className="mb-2 font-bold">Quick Links</h3>
              <Link href="/settings/profile" className="text-sm text-[var(--color-primary)] underline-offset-4 hover:underline">
                Profile Settings →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {!canAccessDashboard && blockingStage && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--color-background)]/80 p-4 backdrop-blur-md">
          <div className="w-full max-w-md space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 text-center shadow-xl">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xl">
              🔒
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Action Required</h2>
              <p className="mt-1 px-4 text-xs text-[var(--color-muted-foreground)]">
                Complete the following mandatory steps to unlock your dashboard.
              </p>
            </div>

            <div className="space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/40 p-4 text-left">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                {blockingStage.name}
              </span>
              {blockingStage.steps
                .filter((st) => !st.isCompleted)
                .map((step) => (
                  <div key={step.id} className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{step.title}</span>
                    <button
                      onClick={() => completeStepById(blockingStage.id, step.id)}
                      className="rounded-md bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-[var(--color-primary-foreground)] hover:opacity-90"
                    >
                      Mark Complete
                    </button>
                  </div>
                ))}
            </div>

            <Link
              href="/onboarding"
              className="block text-xs text-[var(--color-muted-foreground)] hover:underline"
            >
              View full onboarding flow →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
