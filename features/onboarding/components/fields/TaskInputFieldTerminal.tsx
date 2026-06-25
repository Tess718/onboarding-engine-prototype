"use client";

import React from "react";
import { StepField } from "../../../../constants/mock-data";

export function TaskInputFieldTerminal({ field }: { field: StepField }) {
  return (
    <div className="space-y-4">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
        {field.label}
      </span>
      <div className="rounded-xl overflow-hidden shadow-lg border border-zinc-800 bg-zinc-950">
        <div className="bg-zinc-900 px-4 py-2 border-b border-zinc-800 flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-rose-500" />
          <div className="h-3 w-3 rounded-full bg-amber-500" />
          <div className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-zinc-500 font-mono font-bold mx-auto -ml-8">
            {field.label}
          </span>
        </div>
        <div className="p-4 font-mono text-xs space-y-1.5 select-all">
          {field.commands?.map((cmd, idx) => (
            <div
              key={idx}
              className={`${cmd.color || "text-zinc-300"} ${cmd.bold ? "font-bold" : ""}`}
            >
              {cmd.prefix && (
                <span className="text-zinc-500 mr-2 select-none">
                  {cmd.prefix}
                </span>
              )}
              {cmd.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
