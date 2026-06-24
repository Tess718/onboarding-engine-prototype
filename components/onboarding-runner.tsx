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

  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [signature, setSignature] = useState("");
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [orientationAgreed, setOrientationAgreed] = useState(false);

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

    const isDisabled =
      (activeGateStep.id === "step-2-1" && !password.trim()) ||
      (activeGateStep.id === "step-2-2" && (!fullName.trim() || !phoneNumber.trim())) ||
      (activeGateStep.id === "step-2-3" && (!signature.trim() || !policyAgreed)) ||
      (activeGateStep.id === "step-2-4" && !orientationAgreed);

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
            
            {activeGateStep.id === "step-2-1" && (
              <input
                type="password"
                placeholder="New Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
              />
            )}

            {activeGateStep.id === "step-2-2" && (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Legal Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
                />
                <input
                  type="tel"
                  placeholder="Phone Number (e.g. +234 80 123 4567)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
                />
              </div>
            )}

            {activeGateStep.id === "step-2-3" && (
              <div className="space-y-5">
                <div className="rounded-xl border border-zinc-100 bg-[#F8F9FA]/50 p-4 max-h-36 overflow-y-auto text-[11px] text-zinc-500 leading-relaxed space-y-2 font-medium">
                  <p className="font-bold text-zinc-800">Master Compliance Policy Agreement</p>
                  <p>By signing below, you agree to comply with all information security frameworks, multi-factor authentication protocols, and regular credential lifecycle audits established by the operations division.</p>
                  <p>Any non-compliance may result in immediate suspension of access keys to internal system repositories.</p>
                </div>

                <input
                  type="text"
                  placeholder="Type Full Name to E-Sign"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  className="w-full font-serif italic bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 transition-all shadow-sm"
                />

                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={policyAgreed}
                    onChange={(e) => setPolicyAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-400 accent-yellow-400 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-zinc-500 leading-snug select-none">
                    I acknowledge that I have read and agree to all company compliance policies.
                  </span>
                </label>
              </div>
            )}

            {activeGateStep.id === "step-2-4" && (
              <div className="space-y-5">
                <div className="rounded-xl border border-zinc-100 bg-[#F8F9FA]/50 p-6 text-center space-y-2">
                  <div className="text-3xl select-none mb-1">📖</div>
                  <h3 className="text-sm font-bold text-zinc-800">Welcome Onboard!</h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed font-semibold">
                    Please review our workspace orientation guidelines prior to checking the acknowledgment below.
                  </p>
                  <a 
                    href="/documents/vision"
                    target="_blank"
                    className="inline-block text-xs font-black text-violet-600 hover:underline pt-1"
                  >
                    Open Corporate Vision Playbook ↗
                  </a>
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={orientationAgreed}
                    onChange={(e) => setOrientationAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-400 accent-yellow-400 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-zinc-500 leading-snug select-none">
                    I confirm that I have reviewed the welcome orientation guidelines.
                  </span>
                </label>
              </div>
            )}
            
          </div>
        </div>

        <div className="max-w-md w-full pt-4">
          <button
            onClick={() => {
              completeStepById(activeGateStage.id, activeGateStep.id);
              setPassword("");
              setFullName("");
              setPhoneNumber("");
              setSignature("");
              setPolicyAgreed(false);
              setOrientationAgreed(false);
            }}
            disabled={isDisabled}
            className="w-full py-4 px-6 rounded-xl bg-[#FFCD00] hover:bg-[#E6B800] active:scale-[0.99] text-zinc-900 font-extrabold text-sm tracking-wider shadow-sm transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed uppercase"
          >
            {activeGateStep.id === "step-2-4" ? "✓ Finish & Enter Workspace" : "Continue"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
