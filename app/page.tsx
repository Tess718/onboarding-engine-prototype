"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EmployeeType, DepartmentType } from "../constants/mock-data";

const EMPLOYEE_TYPES: { value: EmployeeType; label: string }[] = [
  { value: "full-time", label: "Full-Time Staff" },
  { value: "part-time", label: "Part-Time Staff" },
  { value: "contractor-individual", label: "Individual Contractor" },
  { value: "contractor-company", label: "Company Contractor" },
];

const DEPARTMENTS: { value: DepartmentType; label: string }[] = [
  { value: "engineering", label: "Engineering" },
  { value: "hr", label: "Human Resources (HR)" },
  { value: "finance", label: "Finance" },
  { value: "none", label: "No Department (Global Only)" },
];

export default function LoginPage() {
  const router = useRouter();
  const [type, setType] = useState<EmployeeType>("full-time");
  const [dept, setDept] = useState<DepartmentType>("engineering");

  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/onboarding?type=${type}&dept=${dept}`);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <form
          onSubmit={handleSimulatedLogin}
          className="space-y-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-lg"
        >
          <div className="space-y-1.5">
            <label
              htmlFor="type-select"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
            >
              Employee Classification
            </label>
            <select
              id="type-select"
              value={type}
              onChange={(e) => setType(e.target.value as EmployeeType)}
              className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1"
            >
              {EMPLOYEE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="dept-select"
              className="block text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]"
            >
              Assigned Department
            </label>
            <select
              id="dept-select"
              value={dept}
              onChange={(e) => setDept(e.target.value as DepartmentType)}
              className="w-full cursor-pointer rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-1"
            >
              {DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          <hr className="border-[var(--color-border)]" />

          <button
            type="submit"
            className="w-full cursor-pointer rounded-lg bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-sm transition-opacity hover:opacity-90"
          >
            Launch Onboarding Flow →
          </button>

          <p className="text-center text-[10px] text-[var(--color-muted-foreground)]">
            This is a simulation gateway. No real authentication is performed.
          </p>
        </form>
      </div>
    </main>
  );
}
