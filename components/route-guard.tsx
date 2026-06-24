"use client";

import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useOnboarding } from "../context/OnboardingContext";
import { alwaysAllowedRoutes } from "../constants/mock-data";
import { isMatch } from "../lib/route-matcher";
import Link from "next/link";

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const pathname = usePathname();
  const { allStages } = useOnboarding();

  const isSafeZone = useMemo(() => {
    return alwaysAllowedRoutes.some((route) => isMatch(route, pathname));
  }, [pathname]);

  const blockingStep = useMemo(() => {
    if (isSafeZone) return undefined;

    for (const stage of allStages) {
      for (const step of stage.steps) {
        if (!step.isCompleted && step.blocksRoutes) {
          const blocksCurrentRoute = step.blocksRoutes.some((route) =>
            isMatch(route, pathname)
          );
          if (blocksCurrentRoute) {
            return step;
          }
        }
      }
    }
    return undefined;
  }, [allStages, pathname, isSafeZone]);

  const isBlocked = !!blockingStep;

  if (isBlocked && blockingStep) {
    return <AccessRestricted step={blockingStep} />;
  }

  return <>{children}</>;
}

interface AccessRestrictedProps {
  step: {
    id: string;
    title: string;
    description: string;
    dueStatus?: string;
  };
}

function AccessRestricted({ step }: AccessRestrictedProps) {
  return (
    <main className="min-h-screen bg-[var(--color-background)] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] rounded-full bg-amber-500/10 blur-[120px] dark:bg-amber-600/5 animate-pulse" />
        <div className="absolute -bottom-[40%] -left-[20%] w-[80%] h-[80%] rounded-full bg-violet-500/10 blur-[120px] dark:bg-violet-600/5 animate-pulse" />
      </div>

      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-200/50 bg-white/70 p-8 text-center shadow-xl backdrop-blur-md dark:border-zinc-800/50 dark:bg-zinc-950/60 space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100/80 dark:bg-amber-900/20 text-2xl select-none">
          🔒
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text">
            Access Restricted
          </h2>
          <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed max-w-sm mx-auto">
            To comply with security and compliance standards, you must complete the prerequisite onboarding task listed below before viewing this page.
          </p>
        </div>

        <hr className="border-zinc-200/60 dark:border-zinc-800/60" />

        <div className="text-left p-5 rounded-xl bg-zinc-50/80 border border-zinc-200/40 dark:bg-zinc-900/40 dark:border-zinc-800/40 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Required Setup Task
            </span>
            {step.dueStatus && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                step.dueStatus === "warning" || step.dueStatus === "overdue"
                  ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                  : "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
              }`}>
                {step.dueStatus}
              </span>
            )}
          </div>
          
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
              {step.title}
            </h3>
            <p className="text-xs text-[var(--color-muted-foreground)] leading-normal">
              {step.description}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href={`/task/${step.id}`}
            className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-xs font-bold text-white shadow-md hover:bg-violet-750 transition-all text-center hover:scale-[1.02] active:scale-[0.98]"
          >
            Complete Required Task
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-xs font-semibold text-zinc-700 shadow-sm hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all text-center hover:scale-[1.02] active:scale-[0.98]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
