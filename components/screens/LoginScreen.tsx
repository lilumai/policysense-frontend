// components/screens/LoginScreen.tsx
"use client";

import { useState } from "react";
import { fieldInputClass } from "@/components/ui/Field";

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState("demo@policylens.app");
  const [password, setPassword] = useState("demo1234");

  return (
    <div className="min-h-screen grid grid-cols-1 loginlg:grid-cols-2 bg-[var(--ink)]">
      <div className="hidden loginlg:flex flex-col p-14 text-[#E9E3F7]">
        <div className="font-semibold">PolicyLens</div>
        <div className="flex-1 flex flex-col justify-center">
          <div className="text-[34px] font-semibold leading-[1.35]">
            PolicyLens
            <br />
            เห็นความคุ้มครองที่คุณมี ก่อนวันที่ต้องใช้มัน
          </div>
          <p className="mt-5 max-w-[26rem] text-[#B6ACC9] leading-[1.7]">
            อัปโหลดกรมธรรม์ทุกฉบับ (PDF หรือรูปสกรีนช็อตจากแอปก็ได้) — AI สรุปพอร์ต
            บอกว่าอะไรซ้ำ อะไรขาด
          </p>
          <div className="mt-6 flex gap-2 flex-wrap">
            {["Fewer steps", "Owner flips", "Outcome feeds back"].map((p) => (
              <span
                key={p}
                className="text-xs px-2.5 py-1 rounded-full border border-[#55447A] text-[#9084A8] inline-block"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
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
            onClick={() => onLogin(email || "demo@policylens.app")}
            className="w-full py-3 rounded-xl bg-[var(--teal)] text-white font-medium text-[15px] hover:bg-[var(--tealDark)]"
          >
            เข้าสู่ระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
