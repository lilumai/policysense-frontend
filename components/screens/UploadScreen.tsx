// components/screens/UploadScreen.tsx
"use client";

import { useRef, useState } from "react";
import type { Profile, FileEntry, ExtractedItem, Category } from "@/types";
import { extractPolicy } from "@/lib/api-client";
import { fieldInputClass } from "@/components/ui/Field";

const CATEGORY_OPTIONS: Category[] = [
  "life",
  "ipd_room",
  "ipd_lumpsum",
  "ci",
  "pa_medical",
  "pa_death",
  "other",
];

interface UploadScreenProps {
  profile: Profile;
  onProfileChange: (profile: Profile) => void;
  files: FileEntry[];
  onFilesChange: (files: FileEntry[]) => void;
  onExtractedItemsAppend: (items: ExtractedItem[]) => void;
  analysisError: string | null;
  onProceed: () => void;
}

export default function UploadScreen({
  profile,
  onProfileChange,
  files,
  onFilesChange,
  onExtractedItemsAppend,
  analysisError,
  onProceed,
}: UploadScreenProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const setNum = (key: keyof Profile) => (v: string) =>
    onProfileChange({ ...profile, [key]: v === "" ? null : Number(v) } as Profile);

  const addFiles = async (fileList: File[]) => {
    const newEntries: FileEntry[] = fileList.map((f) => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      name: f.name,
      status: "pending",
    }));
    const updated = [...files, ...newEntries];
    onFilesChange(updated);

    for (const entry of newEntries) {
      entry.status = "extracting";
      onFilesChange([...updated]);
      try {
        const data = await extractPolicy(entry.file);
        entry.status = "done";
        const items: ExtractedItem[] = (data.items || []).map((item) => ({
          id: Math.random().toString(36).slice(2),
          insurer: item.insurer || "",
          category: (CATEGORY_OPTIONS as string[]).includes(item.category)
            ? (item.category as Category)
            : "other",
          sum_insured: item.sum_insured,
          annual_premium: item.annual_premium,
          confidence: item.confidence || "low",
          include: item.sum_insured != null,
          sourceFile: entry.name,
        }));
        onExtractedItemsAppend(items);
        if (data.warning) entry.error = data.warning;
      } catch (err) {
        entry.status = "error";
        entry.error = err instanceof Error ? err.message : String(err);
      }
      onFilesChange([...updated]);
    }
  };

  const anyDone = files.some((f) => f.status === "done");
  const anyBusy = files.some((f) => f.status === "extracting");

  const statusLabel: Record<FileEntry["status"], string> = {
    pending: "รอเริ่ม",
    extracting: "⏳ กำลังอ่าน...",
    done: "✓ อ่านแล้ว",
    error: "✗ อ่านไม่ได้",
  };
  const statusColor: Record<FileEntry["status"], string> = {
    pending: "var(--sub)",
    extracting: "var(--amber)",
    done: "var(--teal)",
    error: "var(--red)",
  };

  return (
    <div className="max-w-[680px] mx-auto px-4 pt-8 pb-10">
      <p className="text-xs font-semibold tracking-[0.08em] uppercase text-[var(--teal)]">
        ขั้นตอนที่ 1
      </p>
      <h1 className="text-[28px] font-semibold text-[var(--deep)] mt-1">
        อัปโหลดกรมธรรม์ทุกฉบับที่มี
      </h1>
      <p className="text-[var(--sub)] mt-2 leading-[1.7]">
        รองรับ PDF (ที่ copy ข้อความได้) หรือรูปสกรีนช็อตจากแอปประกัน (PNG/JPG) — AI
        จะอ่านและสกัดตัวเลขความคุ้มครองให้ คุณตรวจสอบ/แก้ไขได้ก่อนนำไปวิเคราะห์
      </p>

      {analysisError && (
        <div className="mt-4 p-4 rounded-2xl border" style={{ borderColor: "var(--redBorder)", background: "var(--redBg)" }}>
          <p className="font-medium m-0" style={{ color: "var(--red)" }}>
            เกิดข้อผิดพลาด
          </p>
          <p className="text-sm mt-1 m-0" style={{ color: "var(--red)" }}>
            {analysisError}
          </p>
        </div>
      )}

      <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 mt-4">
        <p className="font-medium text-sm mb-3">ข้อมูลเบื้องต้น (ใช้คำนวณเป้าหมายความคุ้มครอง)</p>
        <div className="grid grid-cols-3 gap-3">
          <label className="block">
            <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">รายได้ต่อปี (บาท)</span>
            <input type="number" className={fieldInputClass} value={profile.annual_income}
              onChange={(e) => setNum("annual_income")(e.target.value)} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">ผู้อยู่ในอุปการะ (คน)</span>
            <input type="number" className={fieldInputClass} value={profile.dependents}
              onChange={(e) => setNum("dependents")(e.target.value)} />
          </label>
          <label className="block">
            <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">อายุ</span>
            <input type="number" className={fieldInputClass} value={profile.age}
              onChange={(e) => setNum("age")(e.target.value)} />
          </label>
        </div>

        <label className="block mt-3">
          <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">
            ระดับโรงพยาบาลที่ต้องการ (สำหรับคำนวณเป้าค่าห้อง)
          </span>
          <select
            className={fieldInputClass}
            value={profile.hospital_tier}
            onChange={(e) => onProfileChange({ ...profile, hospital_tier: e.target.value as Profile["hospital_tier"] })}
          >
            <option value="premium">Premium (บำรุงราษฎร์/เมดพาร์ค/กรุงเทพ)</option>
            <option value="general">General (พญาไท/สมิติเวช)</option>
            <option value="economy">Economy (วิภาวดี/ศิครินทร์)</option>
          </select>
        </label>

        <button
          onClick={() => setShowAdvanced((s) => !s)}
          className="mt-3 text-[13px] text-[var(--teal)] underline"
        >
          {showAdvanced ? "ซ่อนข้อมูลเพิ่มเติม ▴" : "เพิ่มข้อมูลเพื่อความแม่นยำขึ้น (ไม่บังคับ) ▾"}
        </button>

        {showAdvanced && (
          <div className="grid grid-cols-2 gap-3 mt-3">
            <label className="block">
              <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">หนี้สินคงค้าง (บาท)</span>
              <input type="number" className={fieldInputClass} value={profile.debt_outstanding ?? ""} placeholder="ไม่บังคับ"
                onChange={(e) => setNum("debt_outstanding")(e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">ค่าใช้จ่ายครอบครัว/เดือน (บาท)</span>
              <input type="number" className={fieldInputClass} value={profile.family_monthly_expense ?? ""} placeholder="ไม่บังคับ"
                onChange={(e) => setNum("family_monthly_expense")(e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">ทุนการศึกษาบุตร (บาท)</span>
              <input type="number" className={fieldInputClass} value={profile.children_education_cost ?? ""} placeholder="ไม่บังคับ"
                onChange={(e) => setNum("children_education_cost")(e.target.value)} />
            </label>
            <label className="block">
              <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">สินทรัพย์สะสมที่มีอยู่ (บาท)</span>
              <input type="number" className={fieldInputClass} value={profile.existing_assets ?? ""} placeholder="ไม่บังคับ"
                onChange={(e) => setNum("existing_assets")(e.target.value)} />
            </label>
            <label className="block col-span-2">
              <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">ค่าใช้จ่ายต่อปีปัจจุบัน (สำหรับคำนวณเป้าเกษียณ)</span>
              <input type="number" className={fieldInputClass} value={profile.current_annual_expense ?? ""} placeholder="ไม่บังคับ"
                onChange={(e) => setNum("current_annual_expense")(e.target.value)} />
            </label>
            <label className="flex items-center gap-2 col-span-2 pt-2">
              <input
                type="checkbox"
                className="w-auto"
                checked={profile.has_copayment_status}
                onChange={(e) => onProfileChange({ ...profile, has_copayment_status: e.target.checked })}
              />
              <span>มีสถานะร่วมจ่าย (Copay) ตาม New Health Standard</span>
            </label>
          </div>
        )}
      </div>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(Array.from(e.dataTransfer.files));
        }}
        className={
          "mt-5 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer bg-[var(--card)] " +
          (dragOver ? "border-[var(--teal)] bg-[var(--mint)]" : "border-[var(--border)] hover:border-[var(--teal)]")
        }
      >
        <p className="font-medium">ลากไฟล์มาวาง หรือคลิกเพื่อเลือก</p>
        <p className="text-[var(--sub)] text-sm mt-1">PDF, JPG, PNG · หลายไฟล์พร้อมกัน</p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="application/pdf,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(Array.from(e.target.files))}
        />
      </div>

      <div>
        {files.map((f) => (
          <div key={f.id} className="flex items-center justify-between bg-[var(--card)] border border-[var(--border)] rounded-xl px-3.5 py-2.5 mt-2 text-sm">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1">{f.name}</span>
            <span className="text-xs mr-2" style={{ color: statusColor[f.status] }}>{statusLabel[f.status]}</span>
            <button
              onClick={() => onFilesChange(files.filter((x) => x.id !== f.id))}
              className="text-xs text-[var(--sub)]"
            >
              ลบ
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onProceed}
        disabled={!anyDone || anyBusy}
        className="w-full mt-6 py-4 rounded-xl bg-[var(--teal)] text-white font-medium text-[17px] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--tealDark)]"
      >
        {anyBusy ? "กำลังอ่านเอกสาร..." : "ไปตรวจสอบข้อมูลที่สกัดได้ →"}
      </button>
    </div>
  );
}
