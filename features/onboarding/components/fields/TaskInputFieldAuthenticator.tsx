"use client";

import React from "react";
import { StepField } from "../../../../constants/mock-data";

interface TaskInputFieldAuthenticatorProps {
  field: StepField;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

export function TaskInputFieldAuthenticator({
  field,
  value,
  onChange,
}: TaskInputFieldAuthenticatorProps) {
  return (
    <div className="space-y-6">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {field.label}
      </span>
      <div className="flex gap-5 items-center rounded-xl bg-[var(--color-background)] p-4 border border-[var(--color-border)]">
        <div className="h-16 w-16 bg-white dark:bg-zinc-800 shadow-sm border border-[var(--color-border)] flex items-center justify-center text-3xl select-none shrink-0 rounded-xl">
          📱
        </div>
        <div className="space-y-1">
          <span className="block text-sm font-bold">
            Scan the security QR code
          </span>
          <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">
            Enter the generated 6-digit confirmation code below to verify.
          </p>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="block text-xs font-bold pl-1 text-[var(--color-foreground)]">
          Verification Code
        </label>
        <input
          type="text"
          placeholder="000000"
          maxLength={6}
          value={value || ""}
          onChange={(e) =>
            onChange(field.id, e.target.value.replace(/\D/g, ""))
          }
          className="w-full sm:w-1/3 text-center rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-lg font-black tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-inner"
        />
      </div>
    </div>
  );
}
