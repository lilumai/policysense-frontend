// components/ui/Field.tsx
"use client";

import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  children: ReactNode;
  className?: string;
}

export default function Field({ label, children, className }: FieldProps) {
  return (
    <label className={`block mb-4 ${className ?? ""}`}>
      <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">{label}</span>
      {children}
    </label>
  );
}

export const fieldInputClass =
  "w-full px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-[15px] " +
  "focus:outline-none focus:border-[var(--teal)] focus:ring-[3px] focus:ring-[rgba(15,110,86,0.15)]";
