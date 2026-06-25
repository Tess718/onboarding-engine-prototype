"use client";

import React from "react";
import { StepField } from "../../../constants/mock-data";
import { TaskInputFieldTerminal } from "./fields/TaskInputFieldTerminal";
import { TaskInputFieldAuthenticator } from "./fields/TaskInputFieldAuthenticator";
import { TaskInputFieldActionButton } from "./fields/TaskInputFieldActionButton";

interface TaskInputFieldProps {
  field: StepField;
  formData: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
}

export function TaskInputField({ field, formData, onChange }: TaskInputFieldProps) {
  const value = formData[field.id];

  switch (field.type) {
    case "info_block":
      return (
        <div className="space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {field.label}
          </span>
          <div className="rounded-xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 p-5 shadow-sm">
            <div className="flex gap-3">
              <div className="space-y-1">
                {field.content?.split("\n").map((line, i) => (
                  <p
                    key={i}
                    className="text-xs text-amber-700/80 dark:text-amber-500/80 font-medium leading-relaxed"
                  >
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      );

    case "checkbox":
      return (
        <label
          className="flex items-center gap-3 cursor-pointer pt-2 group"
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded border transition-colors ${value ? "bg-violet-600 border-violet-600" : "border-zinc-300 bg-white dark:bg-zinc-900 dark:border-zinc-700"}`}
          >
            {value && (
              <span className="text-white text-[10px] font-bold">✓</span>
            )}
          </div>
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(field.id, e.target.checked)}
            className="sr-only"
          />
          <span className="text-sm font-semibold select-none group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            {field.label}
          </span>
        </label>
      );

    case "radio_card_group":
      return (
        <div className="space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {field.label}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {field.options?.map((opt) => (
              <label
                key={opt.id}
                className={`flex flex-col cursor-pointer items-start rounded-xl border p-4 transition-all duration-300 ${
                  value === opt.id
                    ? "border-violet-500 bg-violet-50/50 dark:bg-violet-900/20 shadow-[0_0_15px_rgba(139,92,246,0.15)] -translate-y-1 ring-1 ring-violet-500"
                    : "border-[var(--color-border)] bg-[var(--color-background)]/50 hover:bg-[var(--color-muted)] hover:-translate-y-0.5"
                }`}
              >
                <input
                  type="radio"
                  name={field.id}
                  checked={value === opt.id}
                  onChange={() => onChange(field.id, opt.id)}
                  className="sr-only"
                />
                <div className="flex justify-between w-full items-center mb-2">
                  <span className="block text-sm font-bold text-[var(--color-foreground)]">
                    {opt.title}
                  </span>
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors ${value === opt.id ? "border-violet-600" : "border-[var(--color-muted-foreground)]"}`}
                  >
                    {value === opt.id && (
                      <div className="h-2 w-2 rounded-full bg-violet-600" />
                    )}
                  </div>
                </div>
                {opt.desc && (
                  <span className="text-[11px] text-[var(--color-muted-foreground)] font-medium leading-relaxed">
                    {opt.desc}
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      );

    case "slider":
      const currentVal = value !== undefined ? value : field.min || 0;
      return (
        <div className="space-y-6">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {field.label}
          </span>
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold">Selected Rate</span>
              <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
                {currentVal}%
              </span>
            </div>
            <div className="relative pt-2">
              <input
                type="range"
                min={field.min}
                max={field.max}
                value={currentVal}
                onChange={(e) =>
                  onChange(field.id, Number(e.target.value))
                }
                className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-violet-600"
              />
            </div>
            <div className="flex justify-between text-[10px] text-[var(--color-muted-foreground)] font-bold">
              <span>{field.min}% (Min)</span>
              <span>{field.max}% (Max)</span>
            </div>
          </div>
        </div>
      );

    case "input_group":
      return (
        <div className="space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {field.label}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field.inputs?.map((input) => {
              const subKey = `${field.id}_${input.id}`;
              return (
                <div key={subKey} className="space-y-1.5">
                  <label className="block text-xs font-bold text-[var(--color-foreground)] pl-1">
                    {input.label}
                  </label>
                  <input
                    type="text"
                    placeholder={input.placeholder}
                    maxLength={input.maxLength}
                    value={formData[subKey] || ""}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      onChange(subKey, val);
                    }}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-inner"
                  />
                </div>
              );
            })}
          </div>
        </div>
      );

    case "email":
    case "text":
      return (
        <div className="space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {field.label}
          </span>
          <div className="space-y-1.5">
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-inner"
            />
          </div>
        </div>
      );

    case "datetime":
      return (
        <div className="space-y-4">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            {field.label}
          </span>
          <div className="space-y-1.5">
            <input
              type="datetime-local"
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
              className="w-full sm:w-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-background)]/50 px-4 py-3 text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 shadow-inner"
            />
          </div>
        </div>
      );

    case "terminal_block":
      return <TaskInputFieldTerminal field={field} />;

    case "authenticator":
      return (
        <TaskInputFieldAuthenticator
          field={field}
          value={value}
          onChange={onChange}
        />
      );

    case "action_button":
      return (
        <TaskInputFieldActionButton
          field={field}
          formData={formData}
          onChange={onChange}
        />
      );

    default:
      return null;
  }
}
