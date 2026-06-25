"use client";

import React from "react";
import { StepField } from "../../../../constants/mock-data";

interface TaskInputFieldActionButtonProps {
  field: StepField;
  formData: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

export function TaskInputFieldActionButton({
  field,
  formData,
  onChange,
}: TaskInputFieldActionButtonProps) {
  const isLoading = formData[`${field.id}_loading`];
  const isDone = formData[field.id];

  const handleAction = () => {
    if (isDone) return;
    onChange(`${field.id}_loading`, true);
    setTimeout(() => {
      onChange(`${field.id}_loading`, false);
      onChange(field.id, true);
    }, 1200);
  };

  return (
    <div className="space-y-4">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {field.label}
      </span>
      {isDone ? (
        <div className="rounded-xl border border-emerald-300/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 p-4 shadow-sm animate-in zoom-in-95 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">
              ✓
            </span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
              Action Completed Successfully
            </span>
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
}
