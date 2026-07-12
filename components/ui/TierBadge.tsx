// components/ui/TierBadge.tsx
import type { Tier } from "@/types";

const TIER_MAP: Record<Tier, { bg: string; color: string; label: string }> = {
  regulatory_backed: { bg: "var(--mint)", color: "var(--teal)", label: "📘 อ้างอิงทางการ" },
  industry_data: { bg: "#EAF1FB", color: "#2A5C9A", label: "📊 ข้อมูลอุตสาหกรรม" },
  heuristic: { bg: "#EEF0EE", color: "var(--sub)", label: "⚙️ ค่าเริ่มต้น" },
};

export default function TierBadge({ tier }: { tier: Tier }) {
  const m = TIER_MAP[tier] ?? TIER_MAP.heuristic;
  return (
    <span
      className="text-[11px] px-2 py-[2px] rounded-full whitespace-nowrap inline-block"
      style={{ background: m.bg, color: m.color }}
    >
      {m.label}
    </span>
  );
}
