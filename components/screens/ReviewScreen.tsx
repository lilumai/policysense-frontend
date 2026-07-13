// components/screens/ReviewScreen.tsx
"use client";

import type { ExtractedItem, Category } from "@/types";

const CATEGORY_OPTIONS: Category[] = [
  "life",
  "ipd_room",
  "ipd_lumpsum",
  "ci",
  "pa_medical",
  "pa_death",
  "other",
];
const CATEGORY_LABEL: Record<Category, string> = {
  life: "ทุนประกันชีวิต",
  ipd_room: "ค่าห้อง IPD ต่อคืน",
  ipd_lumpsum: "วงเงิน IPD เหมาจ่ายต่อปี",
  ci: "เงินก้อนโรคร้ายแรง (CI)",
  pa_medical: "ค่ารักษาอุบัติเหตุ (PA)",
  pa_death: "ทุนเสียชีวิตจากอุบัติเหตุ",
  other: "อื่นๆ",
};

interface ReviewScreenProps {
  items: ExtractedItem[];
  onItemsChange: (items: ExtractedItem[]) => void;
  onBack: () => void;
  onConfirm: () => void;
}

export default function ReviewScreen({ items, onItemsChange, onBack, onConfirm }: ReviewScreenProps) {
  const updateItem = (id: string, patch: Partial<ExtractedItem>) => {
    onItemsChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const includedCount = items.filter((i) => i.include).length;

  return (
    <div className="max-w-[960px] mx-auto px-4 pt-8 pb-10">
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--teal)]">
        ขั้นตอนที่ 2
      </p>
      <h1 className="text-[28px] font-semibold text-[var(--deep)] mt-1">
        ตรวจสอบข้อมูลที่ AI สกัดได้
      </h1>
      <p className="text-[var(--sub)] mt-2 leading-[1.7]">
        AI อ่านเอกสารให้แล้ว — กรุณาตรวจสอบและแก้ไขก่อนนำไปวิเคราะห์
        รายการที่ AI &quot;ไม่แน่ใจ&quot; หรือหาตัวเลขไม่เจอ ให้ตรวจสอบเป็นพิเศษ
        ลบรายการที่ไม่ต้องการได้ด้วยการติ๊กออก
      </p>

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl mt-5 overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr>
              {["ใช้", "บริษัท", "หมวด", "ทุนประกัน", "เบี้ย/ปี", "ความมั่นใจ", "จากไฟล์"].map((h) => (
                <th key={h} className="text-left font-semibold text-[var(--sub)] p-2 border-b border-[var(--border)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-[var(--faint)] text-center p-6">
                  ยังไม่มีข้อมูล — กลับไปอัปโหลดไฟล์ก่อน
                </td>
              </tr>
            ) : (
              items.map((it) => (
                <tr key={it.id}>
                  <td className="p-2 border-b border-[var(--border)] align-middle">
                    <input
                      type="checkbox"
                      checked={it.include}
                      onChange={(e) => updateItem(it.id, { include: e.target.checked })}
                    />
                  </td>
                  <td className="p-2 border-b border-[var(--border)] align-middle">
                    <input
                      type="text"
                      value={it.insurer}
                      placeholder="บริษัท"
                      onChange={(e) => updateItem(it.id, { insurer: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg border border-[var(--border)] text-[13px]"
                    />
                  </td>
                  <td className="p-2 border-b border-[var(--border)] align-middle">
                    <select
                      value={it.category}
                      onChange={(e) => updateItem(it.id, { category: e.target.value as Category })}
                      className="px-2 py-1.5 rounded-lg border border-[var(--border)] text-[13px]"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {CATEGORY_LABEL[c]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 border-b border-[var(--border)] align-middle">
                    <input
                      type="number"
                      value={it.sum_insured ?? ""}
                      placeholder="ไม่พบ"
                      onChange={(e) =>
                        updateItem(it.id, { sum_insured: e.target.value === "" ? null : Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-[var(--border)] text-[13px]"
                    />
                  </td>
                  <td className="p-2 border-b border-[var(--border)] align-middle">
                    <input
                      type="number"
                      value={it.annual_premium ?? ""}
                      placeholder="—"
                      onChange={(e) =>
                        updateItem(it.id, { annual_premium: e.target.value === "" ? null : Number(e.target.value) })
                      }
                      className="w-full px-2 py-1.5 rounded-lg border border-[var(--border)] text-[13px]"
                    />
                  </td>
                  <td className="p-2 border-b border-[var(--border)] align-middle">
                    <span
                      className="text-[11px] px-1.5 py-0.5 rounded-full whitespace-nowrap"
                      style={
                        it.confidence === "high"
                          ? { background: "var(--mint)", color: "var(--teal)" }
                          : { background: "var(--amberBg)", color: "var(--amber)" }
                      }
                    >
                      {it.confidence === "high" ? "มั่นใจ" : "ไม่แน่ใจ"}
                    </span>
                  </td>
                  <td className="p-2 border-b border-[var(--border)] align-middle text-[var(--faint)] text-[11px]">
                    {it.sourceFile}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 mt-5">
        <button
          onClick={onBack}
          className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--sub)] text-sm bg-[var(--card)]"
        >
          ← กลับไปหน้าอัปโหลด
        </button>
        <button
          onClick={onConfirm}
          disabled={includedCount === 0}
          className="w-auto px-6 py-3 rounded-xl bg-[var(--teal)] text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--tealDark)]"
        >
          ยืนยัน {includedCount} รายการ และวิเคราะห์ →
        </button>
      </div>
    </div>
  );
}
