// components/ui/Nav.tsx
"use client";

import type { Screen } from "@/types";

interface NavProps {
  screen: Screen;
  userEmail: string;
  canReview: boolean;
  canDashboard: boolean;
  onNavigate: (screen: Screen) => void;
}

const TABS: { key: Exclude<Screen, "login">; label: string }[] = [
  { key: "upload", label: "1 · อัปโหลด" },
  { key: "review", label: "2 · ตรวจสอบ" },
  { key: "dashboard", label: "3 · แดชบอร์ด" },
  { key: "chat", label: "4 · ถามผู้ช่วย AI" },
];

export default function Nav({ screen, userEmail, canReview, canDashboard, onNavigate }: NavProps) {
  const enabledFor = (key: Screen): boolean => {
    if (key === "upload") return true;
    if (key === "review") return canReview;
    return canDashboard; // dashboard + chat gated the same way
  };

  return (
    <header className="sticky top-0 z-10 bg-[var(--card)] border-b border-[var(--border)]">
      <div className="max-w-[960px] mx-auto px-4 py-3 flex items-center justify-between gap-2">
        <span className="font-semibold text-[var(--ink)]">PolicySense</span>
        <nav className="flex gap-1">
          {TABS.map((t) => {
            const enabled = enabledFor(t.key);
            const active = screen === t.key;
            return (
              <button
                key={t.key}
                disabled={!enabled}
                onClick={() => enabled && onNavigate(t.key)}
                className={
                  "px-3 py-1.5 rounded-lg text-sm " +
                  (active
                    ? "bg-[var(--mint)] text-[var(--teal)] font-semibold"
                    : "text-[var(--sub)] bg-transparent") +
                  (!enabled ? " text-[var(--faint)] cursor-not-allowed" : "")
                }
              >
                {t.label}
              </button>
            );
          })}
        </nav>
        <span className="text-xs text-[var(--sub)]">{userEmail}</span>
      </div>
    </header>
  );
}
