"use client";

import React, { useState, useEffect } from "react";
import { useOnboarding } from "../context/OnboardingContext";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";


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

  const [medicalPlan, setMedicalPlan] = useState("ppo");
  const [contributionRate, setContributionRate] = useState(6);
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [gitHubEmail, setGitHubEmail] = useState("");
  const [sshKeyGenerated, setSshKeyGenerated] = useState(false);
  const [sshConsoleLog, setSshConsoleLog] = useState<string[]>([]);
  const [otpCode, setOtpCode] = useState("");
  const [hoursAgreed, setHoursAgreed] = useState(false);
  const [slackJoined, setSlackJoined] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (step && step.actionUrl && !step.isCompleted) {
      router.replace(`${step.actionUrl}?origin=${origin || "onboarding"}`);
    }
  }, [step, router, origin]);

  if (!stage || !step) {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <h2 className="text-lg font-bold text-red-650">Error</h2>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
            {stage.name} Task Setup
          </span>
          <h1 className="text-xl font-bold tracking-tight mt-0.5">{step.title}</h1>
        </div>
        <button
          onClick={handleBack}
          className="text-xs font-semibold text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] cursor-pointer"
        >
          ← Cancel &amp; Return
        </button>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-md space-y-6">
        {step.isCompleted ? (
          <div className="text-center py-6 space-y-4">
            <span className="text-3xl">🎉</span>
            <h2 className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              Task Completed Successfully
            </h2>
            <p className="text-xs text-[var(--color-muted-foreground)] max-w-sm mx-auto">
              This ambient task is complete. Your global onboarding progress has been updated.
            </p>
            <button
              onClick={handleBack}
              className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-semibold text-[var(--color-primary-foreground)] hover:opacity-90 shadow-sm cursor-pointer"
            >
              Continue Journey
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
              {step.description}
            </p>

            <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/20 p-4">

              {step.id === "step-ft-1" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Choose Coverage Option
                  </span>
                  <div className="space-y-2">
                    {[
                      { id: "ppo", title: "Standard PPO Plan", desc: "Low copays, wide provider network." },
                      { id: "hdhp", title: "HDHP HSA Plan", desc: "Tax-free savings account contribution." },
                      { id: "hmo", title: "Premier HMO Plan", desc: "No deductibles, local care coordination." },
                    ].map((plan) => (
                      <label
                        key={plan.id}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${
                          medicalPlan === plan.id
                            ? "border-violet-500 bg-violet-50/20 dark:border-violet-750"
                            : "border-[var(--color-border)] bg-[var(--color-card)]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="medical"
                          checked={medicalPlan === plan.id}
                          onChange={() => setMedicalPlan(plan.id)}
                          className="mt-0.5 accent-violet-600"
                        />
                        <div>
                          <span className="block text-xs font-bold">{plan.title}</span>
                          <span className="text-[10px] text-[var(--color-muted-foreground)]">{plan.desc}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {step.id === "step-ft-2" && (
                <div className="space-y-4">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Retirement Savings Contribution
                  </span>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>Salary Deferral Rate</span>
                      <span className="text-violet-600 dark:text-violet-400">{contributionRate}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={contributionRate}
                      onChange={(e) => setContributionRate(Number(e.target.value))}
                      className="w-full accent-violet-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[9px] text-[var(--color-muted-foreground)] font-medium">
                      <span>0% (No Deferral)</span>
                      <span>Company Match Limit (6%)</span>
                      <span>15% (Max Recommended)</span>
                    </div>
                  </div>
                </div>
              )}

              {step.id === "step-ft-3" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Bank Account Information
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-medium text-[var(--color-muted-foreground)] mb-1">Routing Number</label>
                      <input
                        type="text"
                        placeholder="9 Digits"
                        maxLength={9}
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-medium text-[var(--color-muted-foreground)] mb-1">Account Number</label>
                      <input
                        type="text"
                        placeholder="Up to 12 Digits"
                        maxLength={12}
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step.id === "step-pt-1" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Select Work Windows
                  </span>
                  <p className="text-[10px] text-[var(--color-muted-foreground)]">Choose shifts you are available to work (Part-Time):</p>
                  <div className="grid grid-cols-5 gap-1.5 text-center">
                    {["M", "T", "W", "Th", "F"].map((day) => (
                      <div key={day} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-2">
                        <span className="block text-[10px] font-bold">{day}</span>
                        <div className="mt-1 space-y-1">
                          <button className="block w-full rounded bg-violet-100 hover:bg-violet-200 text-[8px] font-bold p-0.5 text-violet-850 dark:bg-violet-950 dark:text-violet-400 cursor-pointer">AM</button>
                          <button className="block w-full rounded bg-[var(--color-muted)] text-[8px] font-bold p-0.5 opacity-60">PM</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step.id === "step-pt-2" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Part-Time Hourly Compliance
                  </span>
                  <div className="rounded border border-amber-200 bg-amber-50/20 p-3 text-[10px] text-amber-700 dark:border-amber-900/30 dark:text-amber-400 leading-normal space-y-1">
                    <p className="font-bold">⚠️ Maximum Weekly Threshold: 29 Hours</p>
                    <p>Part-time workers are strictly prohibited from logging more than 29 hours in a single pay cycle without pre-authorization from the regional operations director.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={hoursAgreed}
                      onChange={(e) => setHoursAgreed(e.target.checked)}
                      className="rounded accent-violet-600"
                    />
                    <span className="text-[11px] font-medium select-none">I have read and agree to the hours limit.</span>
                  </label>
                </div>
              )}

              {step.id === "step-3-1" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    GitHub Profile Linking
                  </span>
                  <div>
                    <label className="block text-[10px] font-medium text-[var(--color-muted-foreground)] mb-1">GitHub Account Email</label>
                    <input
                      type="email"
                      placeholder="e.g. dev@company.com"
                      value={gitHubEmail}
                      onChange={(e) => setGitHubEmail(e.target.value)}
                      className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                </div>
              )}

              {step.id === "step-3-2" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Terminal Checkout
                  </span>
                  <div className="rounded-lg bg-black text-emerald-400 p-3 font-mono text-[10px] space-y-1 select-all">
                    <div># Clone the repository</div>
                    <div>git clone git@github.com:org/monorepo.git</div>
                  </div>
                  <p className="text-[9px] text-[var(--color-muted-foreground)] italic">Run the git command above in your local development terminal.</p>
                </div>
              )}

              {step.id === "step-3-3" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Package Installer Setup
                  </span>
                  <div className="rounded-lg bg-black text-zinc-300 p-3 font-mono text-[10px] space-y-1">
                    <div>$ cd monorepo</div>
                    <div>$ npm run setup-cli</div>
                    <div className="text-yellow-400">Installing node packages... done.</div>
                    <div className="text-emerald-400">Terraform and AWS CLI verified!</div>
                  </div>
                </div>
              )}

              {step.id === "step-4-1" && (
                <div className="space-y-4">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Google Authenticator Setup
                  </span>
                  <div className="flex gap-4 items-center">
                    <div className="h-16 w-16 bg-white border border-zinc-200 flex items-center justify-center text-3xl select-none shrink-0 rounded-lg">
                      📱
                    </div>
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold">Scan the security QR code</span>
                      <p className="text-[9px] text-[var(--color-muted-foreground)] leading-normal">Enter the generated 6-digit confirmation code below to verify.</p>
                    </div>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="e.g. 123456"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      className="w-24 text-center rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs font-bold tracking-widest focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                </div>
              )}

              {step.id === "step-4-2" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    SSH Keygen Tool
                  </span>
                  {sshKeyGenerated ? (
                    <div className="rounded-lg border border-emerald-300 bg-emerald-50/30 p-3 text-[10px] text-emerald-700 dark:border-emerald-900/30 dark:text-emerald-400 font-mono break-all select-all">
                      ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCyR8aUaPz8Fv...
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <button
                        onClick={() => {
                          setSshConsoleLog(["$ ssh-keygen -t rsa -b 4096", "Generating public/private rsa key pair...", "Your identification has been saved in /id_rsa", "Your public key has been saved in /id_rsa.pub"]);
                          setTimeout(() => setSshKeyGenerated(true), 1200);
                        }}
                        className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-muted)] px-3 py-2 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                      >
                        Generate Key Pair
                      </button>
                      {sshConsoleLog.length > 0 && (
                        <div className="rounded-lg bg-black text-zinc-400 p-2 font-mono text-[9px] space-y-0.5">
                          {sshConsoleLog.map((log, i) => <div key={i}>{log}</div>)}
                          {!sshKeyGenerated && <div className="animate-pulse">Generating...</div>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {step.id === "step-5-1" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Launch Messaging Platform
                  </span>
                  <button
                    onClick={() => setSlackJoined(true)}
                    className={`w-full rounded-lg border p-3 text-center transition-colors font-semibold text-xs cursor-pointer ${
                      slackJoined
                        ? "border-emerald-400 bg-emerald-50/20 text-emerald-700 dark:text-emerald-400"
                        : "border-[var(--color-border)] bg-[var(--color-card)] hover:bg-[var(--color-muted)]"
                    }`}
                  >
                    {slackJoined ? "✓ Joined #engineering slack channel!" : "Join #engineering Slack Channel"}
                  </button>
                </div>
              )}

              {step.id === "step-5-2" && (
                <div className="space-y-3">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                    Sync Booking Calendar
                  </span>
                  <div>
                    <label className="block text-[10px] font-medium text-[var(--color-muted-foreground)] mb-1">Select Sync Time</label>
                    <input
                      type="datetime-local"
                      value={selectedDateTime}
                      onChange={(e) => setSelectedDateTime(e.target.value)}
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-600"
                    />
                  </div>
                </div>
              )}

              {!["step-ft-1", "step-ft-2", "step-ft-3", "step-pt-1", "step-pt-2", "step-3-1", "step-3-2", "step-3-3", "step-4-1", "step-4-2", "step-5-1", "step-5-2"].includes(step.id) && (
                <div className="text-center py-2 text-[10px] text-[var(--color-muted-foreground)] font-medium">
                  Complete this action item by clicking the confirm button below.
                </div>
              )}

            </div>

            <button
              onClick={handleFinishTask}
              disabled={
                isSubmitting ||
                (step.id === "step-ft-3" && (!routingNumber || !accountNumber)) ||
                (step.id === "step-pt-2" && !hoursAgreed) ||
                (step.id === "step-3-1" && !gitHubEmail) ||
                (step.id === "step-4-1" && otpCode.length < 6) ||
                (step.id === "step-4-2" && !sshKeyGenerated) ||
                (step.id === "step-5-1" && !slackJoined) ||
                (step.id === "step-5-2" && !selectedDateTime)
              }
              className="w-full cursor-pointer rounded-lg bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-750 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-center"
            >
              {isSubmitting ? "Submitting Task Details..." : "Confirm & Mark Complete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
