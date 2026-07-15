// components/ui/ConsentModal.tsx
"use client";

import { useState } from "react";

interface ConsentModalProps {
  onAccept: () => void;
  onCancel: () => void;
}

export default function ConsentModal({ onAccept, onCancel }: ConsentModalProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl max-w-[32rem] w-full max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-lg font-semibold text-[var(--deep)]">ก่อนอัปโหลดกรมธรรม์</h2>

        <p className="text-sm text-[var(--sub)] mt-3 leading-[1.7]">
          ระบบจะส่งเนื้อหากรมธรรม์ของคุณไปประมวลผลผ่าน Google Gemini API
          เพื่อดึงข้อมูลความคุ้มครองและคำนวณผลวิเคราะห์
        </p>

        <p className="text-sm font-medium text-[var(--deep)] mt-4">สิ่งที่คุณควรทราบ:</p>
        <ul className="text-sm text-[var(--sub)] mt-2 space-y-2 leading-[1.7] list-disc pl-5">
          <li>
            ระบบไม่บันทึกไฟล์หรือข้อมูลกรมธรรม์ของคุณลงฐานข้อมูลใดๆ — ข้อมูลอยู่
            เฉพาะในเบราว์เซอร์ของคุณระหว่างใช้งาน และหายไปทันทีเมื่อปิดหรือรีเฟรชหน้า
          </li>
          <li>
            ข้อมูลจะถูกส่งไปยัง Google Gemini API เพื่อประมวลผล ซึ่งอยู่ภายใต้
            นโยบายของ Google (google.com/policies/privacy)
          </li>
          <li>
            นี่คือระบบต้นแบบเพื่อการศึกษา (Independent Study, NIDA) ยังไม่ใช่
            บริการเชิงพาณิชย์ และยังไม่มีระบบยืนยันตัวตนผู้ใช้ (authentication)
          </li>
          <li>
            กรุณาหลีกเลี่ยงการอัปโหลดเอกสารที่มีข้อมูลอ่อนไหวเกินความจำเป็น
            เช่น สำเนาบัตรประชาชนฉบับเต็ม หากเป็นไปได้
          </li>
        </ul>

        <label className="flex items-start gap-2 mt-5 text-sm text-[var(--ink)]">
          <input
            type="checkbox"
            className="w-auto mt-0.5"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <span>ฉันเข้าใจและยินยอมให้ระบบประมวลผลข้อมูลตามที่ระบุข้างต้น</span>
        </label>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--sub)] text-sm bg-[var(--card)]"
          >
            ยกเลิก
          </button>
          <button
            onClick={onAccept}
            disabled={!checked}
            className="px-5 py-2.5 rounded-xl bg-[var(--teal)] text-white font-medium text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--tealDark)]"
          >
            ยอมรับและดำเนินการต่อ
          </button>
        </div>
      </div>
    </div>
  );
}
