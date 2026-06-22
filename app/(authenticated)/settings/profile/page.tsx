"use client";

import Link from "next/link";
import { OnboardingTaskWidget } from "../../../../components/onboarding-task-widget";

export default function ProfileSettingsPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-10 space-y-6">
      <div className="border-b border-[var(--color-border)] pb-4">
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
          Manage your public corporate profile.
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex items-center gap-5">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-[var(--color-border)] bg-[var(--color-muted)] text-2xl">
            👤
          </div>
          <div>
            <h3 className="text-sm font-semibold">Profile Picture</h3>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Upload a crisp corporate headshot.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-muted)]/30 px-4 py-3 text-xs font-medium text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)]/60">
          <span>📁</span>
          <span>Choose a file to upload (simulated)</span>
          <input type="file" className="sr-only" accept="image/*" />
        </label>
      </div>

      <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <h3 className="text-sm font-semibold">Profile Details</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1">Display Name</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1">Job Title</label>
            <input
              type="text"
              placeholder="e.g. Senior Engineer"
              className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Once you&apos;ve uploaded a photo above, mark your onboarding task as complete.
        </p>
        <OnboardingTaskWidget
          stageId="stage-org-profile"
          stepId="step-1-1"
          actionLabel="Profile Picture Uploaded — Mark Complete"
        />
      </div>

      <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
        <Link href="/dashboard" className="text-xs text-[var(--color-muted-foreground)] hover:underline">
          ← Back to Dashboard
        </Link>
        <button className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-[var(--color-primary-foreground)] shadow-sm transition-opacity hover:opacity-90">
          Save Changes
        </button>
      </div>
    </main>
  );
}
