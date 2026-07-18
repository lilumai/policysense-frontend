// components/screens/DashboardScreen.tsx
"use client";

import { useState } from "react";
import type { AnalysisResponse, ExtractedItem, Screen } from "@/types";
import CoverageCard from "@/components/ui/CoverageCard";

const fmtMoney = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : Number(n).toLocaleString();

interface DashboardScreenProps {
  analysis: AnalysisResponse | null;
  extractedItems: ExtractedItem[];
  onDecision: (type: "claim" | "buy_more") => void;
  onNavigate: (screen: Screen) => void;
}

export default function DashboardScreen({ analysis, extractedItems, onDecision, onNavigate }: DashboardScreenProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  if (!analysis) {
    return (
      <div className="max-w-[960px] mx-auto px-4 pt-8">
        <p className="text-[var(--sub)]">ยังไม่มีผลวิเคราะห์</p>
      </div>
    );
  }

  const { results, affordability, total_premium } = analysis;
  const gapsCount = results.filter((r) => r.status === "gap").length;
  const dupsCount = results.filter((r) => r.status === "overlap").length;

  const affordColor =
    affordability.status === "over_budget"
      ? "var(--red)"
      : affordability.status === "watch"
      ? "var(--amber)"
      : "var(--ok)";
  const affordBorder =
    affordability.status === "over_budget"
      ? "var(--redBorder)"
      : affordability.status === "watch"
      ? "var(--amberBorder)"
      : "var(--border)";

  return (
    <div className="max-w-[960px] mx-auto px-4 pt-8 pb-10">
      <h1 className="text-2xl font-semibold text-[var(--deep)]">ภาพรวมความคุ้มครองของคุณ</h1>
      <p className="text-[var(--sub)] text-sm mt-1">
        เบี้ยรวม {fmtMoney(total_premium)} บ./ปี — พบ{" "}
        <span className="font-semibold" style={{ color: "var(--amber)" }}>
          {dupsCount} หมวดซ้ำซ้อน
        </span>{" "}
        ·{" "}
        <span className="font-semibold" style={{ color: "var(--red)" }}>
          {gapsCount} หมวดยังขาด
        </span>
      </p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3 mt-6">
        {results.map((r) => (
          <CoverageCard
            key={r.category}
            result={r}
            isOpen={openCategory === r.category}
            onToggle={() => setOpenCategory(openCategory === r.category ? null : r.category)}
            extractedItems={extractedItems}
          />
        ))}
      </div>

      <div className="bg-[var(--card)] border rounded-2xl p-4 mt-5" style={{ borderColor: affordBorder }}>
        <p className="font-semibold text-sm m-0">💰 ความสามารถในการจ่ายเบี้ยรวม</p>
        <p className="text-[13px] mt-1.5 m-0" style={{ color: affordColor }}>
          {affordability.note}
        </p>
        <p className="text-[var(--faint)] text-[11px] mt-1.5 m-0">{affordability.source}</p>
      </div>

      <p className="text-[var(--faint)] text-xs mt-4 leading-relaxed">
        % คือความพอเพียงเทียบกับเป้าหมายที่คำนวณจาก backend · ดูป้าย 📘/📊/⚙️
        เพื่อรู้ว่าตัวเลขอ้างอิงจากที่ใด · แตะการ์ดเพื่อดูที่มา
      </p>

      <div className="rounded-2xl p-5 mt-6 bg-[var(--ink)] text-[#E9E3F7]">
        <p className="font-semibold m-0">พร้อมตัดสินใจแล้ว?</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => onDecision("claim")}
            className="px-3.5 py-2 rounded-xl text-[13px] font-medium bg-[var(--teal)] text-white"
          >
            🏥 ยื่นเคลม
          </button>
          <button
            onClick={() => onDecision("buy_more")}
            className="px-3.5 py-2 rounded-xl text-[13px] font-medium bg-[var(--teal)] text-white"
          >
            ➕ ซื้อเพิ่มปิดหมวดที่ยังขาด
          </button>
          <button
            onClick={() => onNavigate("chat")}
            className="px-3.5 py-2 rounded-xl text-[13px] font-medium border border-[#55447A] text-[#E9E3F7] bg-transparent"
          >
            💬 ถามผู้ช่วย AI ก่อน
          </button>
        </div>
      </div>
    </div>
  );
}
