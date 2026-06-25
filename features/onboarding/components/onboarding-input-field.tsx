"use client";

import { StepField } from "../../../constants/mock-data";

interface OnboardingInputFieldProps {
  field: StepField;
  value: any;
  onChange: (val: any) => void;
}

export function OnboardingInputField({
  field,
  value,
  onChange,
}: OnboardingInputFieldProps) {
  return (
    <div className="space-y-4">
      {field.type === "password" && (
        <input
          type="password"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
        />
      )}

      {field.type === "text" && (
        <input
          type="text"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
        />
      )}

      {field.type === "tel" && (
        <input
          type="tel"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 font-semibold transition-all shadow-sm"
        />
      )}

      {field.type === "info_block" && (
        <div className="rounded-xl border border-zinc-100 bg-[#F8F9FA]/50 p-4 max-h-36 overflow-y-auto text-[11px] text-zinc-500 leading-relaxed space-y-2 font-medium">
          <p className="font-bold text-zinc-800">{field.label}</p>
          <div className="whitespace-pre-wrap">{field.content}</div>
        </div>
      )}

      {field.type === "signature" && (
        <input
          type="text"
          placeholder={field.placeholder}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full font-serif italic bg-[#F8F9FA] rounded-xl px-4 py-3.5 text-sm border-0 focus:outline-none focus:bg-white focus:ring-2 focus:ring-yellow-400 text-zinc-900 placeholder-zinc-400 transition-all shadow-sm"
        />
      )}

      {field.type === "checkbox" && (
        <label className="flex items-start gap-3 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-zinc-300 text-yellow-500 focus:ring-yellow-400 accent-yellow-400 cursor-pointer"
          />
          <span className="text-xs font-semibold text-zinc-500 leading-snug select-none">
            {field.label}
          </span>
        </label>
      )}
    </div>
  );
}
