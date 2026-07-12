// components/ui/CoverageCard.tsx
"use client";

import type { AnalysisResultItem, ExtractedItem } from "@/types";
import Ring from "./Ring";
import TierBadge from "./TierBadge";

const CATEGORY_META: Record<
  string,
  { icon: string; name: string; sub: string }
> = {
  life: { icon: "☂️", name: "ทุนประกันชีวิต", sub: "เสียชีวิต/ทุพพลภาพถาวร" },
  ipd_room: { icon: "🛏️", name: "ค่าห้อง IPD ต่อคืน", sub: "ผู้ป่วยใน" },
  ipd_lumpsum: { icon: "🏥", name: "วงเงิน IPD เหมาจ่ายต่อปี", sub: "ผู้ป่วยใน" },
  ci: { icon: "🎗️", name: "เงินก้อนโรคร้ายแรง (CI)", sub: "จ่ายทันทีที่ตรวจพบ" },
  pa_medical: { icon: "🩹", name: "ค่ารักษาอุบัติเหตุ (PA)", sub: "ต่อครั้ง" },
  pa_death: { icon: "⚠️", name: "ทุนเสียชีวิตจากอุบัติเหตุ", sub: "PA" },
  other: { icon: "📄", name: "อื่นๆ", sub: "ไม่เข้าหมวดวิเคราะห์หลัก" },
};

const STATUS_META = {
  gap: { bg: "var(--redBg)", color: "var(--red)", label: "ยังขาด" },
  overlap: { bg: "var(--amberBg)", color: "var(--amber)", label: "ซ้ำซ้อน" },
  ok: { bg: "var(--mint)", color: "var(--teal)", label: "ครบแล้ว" },
  goal: { bg: "var(--mint)", color: "var(--teal)", label: "เป้าหมาย" },
} as const;

const fmtMoney = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : Number(n).toLocaleString();

interface CoverageCardProps {
  result: AnalysisResultItem;
  isOpen: boolean;
  onToggle: () => void;
  extractedItems: ExtractedItem[];
}

export default function CoverageCard({ result, isOpen, onToggle, extractedItems }: CoverageCardProps) {
  const meta = CATEGORY_META[result.category] ?? { icon: "📄", name: result.category, sub: "" };
  const b = STATUS_META[result.status] ?? STATUS_META.ok;
  const pct =
    result.current == null || !result.target
      ? 0
      : Math.round(Math.min(result.current / result.target, 1) * 100);

  const contributors = result.policies.map((id) => {
    const it = extractedItems.find((e) => e.id === id);
    return it ? `${it.insurer || "ไม่ระบุ"} · ${fmtMoney(it.sum_insured)} บ.` : id;
  });

  return (
    <button
      onClick={onToggle}
      className="bg-[var(--card)] border rounded-2xl p-4 text-left w-full flex flex-col items-center hover:shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
      style={{ borderColor: isOpen ? "var(--tealSoft)" : "var(--border)" }}
    >
      <div className="w-full flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-[var(--mint)] flex items-center justify-center text-lg">
            {meta.icon}
          </span>
          <div className="min-w-0">
            <div className="font-semibold leading-tight text-sm">{meta.name}</div>
            <div className="text-[var(--faint)] text-[11px]">{meta.sub}</div>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-[2px] rounded-full whitespace-nowrap"
          style={{ background: b.bg, color: b.color }}
        >
          {b.label}
        </span>
      </div>

      {result.status !== "goal" ? (
        <div className="my-3">
          <Ring pct={pct} />
        </div>
      ) : (
        <div className="my-5 text-[28px]">🎯</div>
      )}

      <div className="text-lg font-semibold">{fmtMoney(result.current)}</div>
      <div className="text-[var(--faint)] text-[11px]">
        เป้าหมาย {fmtMoney(result.target)} {result.unit}
      </div>
      <div className="mt-2">
        <TierBadge tier={result.tier} />
      </div>

      {isOpen && (
        <div className="w-full mt-3 pt-3 border-t border-[var(--border)] text-xs text-[var(--sub)] leading-relaxed">
          {contributors.length ? (
            <ul className="m-0 mb-1.5 pl-[18px] list-disc">
              {contributors.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          ) : (
            <p className="m-0 mb-1.5">ยังไม่มีกรมธรรม์ในหมวดนี้</p>
          )}
          <p className="m-0">{result.source}</p>
        </div>
      )}

      <div className="text-[11px] mt-2 font-medium text-[var(--teal)]">
        {isOpen ? "ซ่อนรายละเอียด ▴" : "ที่มา ▾"}
      </div>
    </button>
  );
}
