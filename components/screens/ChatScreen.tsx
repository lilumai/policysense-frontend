// components/screens/ChatScreen.tsx
"use client";

import { useState } from "react";
import type { ChatMessage } from "@/types";

const QUICK = [
  "ขับมอเตอร์ไซค์ล้ม ค่ารักษา 8,000 บาท เบิกฉบับไหนก่อน?",
  "รายได้สุทธิ 800,000 มีประกันชีวิต 40,000 เหลือสิทธิ์ลดหย่อนภาษีอีกเท่าไหร่?",
  "อายุ 35 อยากเกษียณตอน 60 มีเงินออม 500,000 ออมปีละ 60,000 พอไหม?",
];
const DISCLAIMER =
  "⚠️ คำตอบนี้เป็นการประเมินจากข้อมูลกรมธรรม์ที่วิเคราะห์ไว้ ไม่ใช่การยืนยันสิทธิ์อย่างเป็นทางการจากบริษัทประกัน";

interface ChatScreenProps {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
}

export default function ChatScreen({ messages, onMessagesChange }: ChatScreenProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || loading) return;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    onMessagesChange(next);
    setInput("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    onMessagesChange([
      ...next,
      {
        role: "assistant",
        content:
          "(โหมดสาธิต) ยังไม่ได้เชื่อมกับ AI จริง — ดูผลวิเคราะห์ที่แดชบอร์ดแทนได้ครับ\n\n" + DISCLAIMER,
      },
    ]);
    setLoading(false);
  };

  return (
    <div className="max-w-[760px] mx-auto px-4 pt-6 pb-6 flex flex-col min-h-[calc(100vh-57px)]">
      <h1 className="text-xl font-semibold text-[var(--deep)]">ผู้ช่วยประกัน + วางแผนการเงิน</h1>

      <div className="flex-1 mt-4">
        {messages.length === 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-[13px] text-[var(--sub)] mb-3">
              ⚙️ โหมดสาธิต — คำตอบยังไม่ได้เชื่อมกับ AI จริง (LLM layer จะต่อในขั้นถัดไป)
            </p>
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="text-left w-full text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] text-[var(--teal)] bg-[var(--card)] mb-2"
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={"flex mb-3 " + (m.role === "user" ? "justify-end" : "")}>
            <div
              className={
                "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap " +
                (m.role === "user" ? "bg-[var(--teal)] text-white" : "bg-[var(--card)] border border-[var(--border)]")
              }
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex mb-3">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl px-4 py-3 text-sm text-[var(--sub)]">
              กำลังคิด…
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send(input)}
          placeholder="พิมพ์คำถาม..."
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm"
        />
        <button
          onClick={() => send(input)}
          className="w-auto px-5 py-3 rounded-xl bg-[var(--teal)] text-white font-medium hover:bg-[var(--tealDark)]"
        >
          ถาม
        </button>
      </div>
    </div>
  );
}
