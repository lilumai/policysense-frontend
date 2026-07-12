// components/screens/LoginScreen.tsx
"use client";

import { useState } from "react";
import { fieldInputClass } from "@/components/ui/Field";

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("demo@policysense.app");
  const [password, setPassword] = useState("demo1234");

  return (
    <div className="min-h-screen grid grid-cols-1 loginlg:grid-cols-2 bg-[var(--ink)]">
      <div className="hidden loginlg:flex flex-col justify-between p-14 text-[#E9F2EF]">
        <div className="font-semibold">PolicySense</div>
        <div>
          <div className="text-[34px] font-semibold leading-[1.35]">
            หยุดรื้อเอกสาร
            <br />
            แล้วมา<span className="text-[var(--tealSoft)]">ตัดสินใจ</span>แทน
          </div>
          <p className="mt-5 max-w-[26rem] text-[#9FBDB4] leading-[1.7]">
            อัปโหลดกรมธรรม์ทุกฉบับ (PDF หรือรูปสกรีนช็อตจากแอปก็ได้) — AI สรุปพอร์ต
            บอกว่าอะไรซ้ำ อะไรขาด
          </p>
          <div className="mt-6 flex gap-2 flex-wrap">
            {["Fewer steps", "Owner flips", "Outcome feeds back"].map((p) => (
              <span
                key={p}
                className="text-xs px-2.5 py-1 rounded-full border border-[#2E4A46] text-[#6E8B84] inline-block"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <p className="text-xs text-[#6E8B84]">เป็นกลาง ไม่ขายประกัน ไม่มีค่าคอมมิชชั่น</p>
      </div>

      <div className="flex items-center justify-center bg-[var(--bg)] p-6 loginlg:rounded-l-[40px]">
        <div className="w-full max-w-[22rem]">
          <h1 className="text-2xl font-semibold text-[var(--deep)]">เข้าสู่ระบบ</h1>
          <p className="text-[var(--sub)] text-sm mt-1 mb-6">
            โหมดสาธิต — กดเข้าสู่ระบบได้เลย
          </p>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">อีเมล</span>
            <input
              className={fieldInputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-[var(--sub)] mb-1.5">รหัสผ่าน</span>
            <input
              type="password"
              className={fieldInputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <button
            onClick={() => onLogin(email || "demo@policysense.app")}
            className="w-full py-3 rounded-xl bg-[var(--teal)] text-white font-medium text-[15px] hover:bg-[var(--tealDark)]"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
