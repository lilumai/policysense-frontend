// components/screens/ChatScreen.tsx
"use client";

import { useState } from "react";
import type { ChatMessage, AnalysisResponse, Profile } from "@/types";
import { chatWithAI } from "@/lib/api-client";

const QUICK = [
  "ฉันขาดความคุ้มครองอะไรบ้าง ควรปิดช่องว่างไหนก่อน",
  "ทำไมฉันถึงต้องมีประกันโรคร้ายแรง",
  "เบี้ยประกันที่จ่ายอยู่ตอนนี้เหมาะสมกับรายได้ไหม",
  "ความคุ้มครองที่ซ้ำซ้อนคืออะไร ตัดออกได้ไหม",
];
const DISCLAIMER =
  "⚠️ คำตอบนี้เป็นการประเมินจากข้อมูลกรมธรรม์ที่วิเคราะห์ไว้ ไม่ใช่การยืนยันสิทธิ์อย่างเป็นทางการจากบริษัทประกัน";

interface ChatScreenProps {
  messages: ChatMessage[];
  onMessagesChange: (messages: ChatMessage[]) => void;
  analysis: AnalysisResponse | null;
  profile: Profile | null;
}

export default function ChatScreen({ messages, onMessagesChange, analysis, profile }: ChatScreenProps) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || loading || !analysis) return;

    const history = messages;
    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    onMessagesChange(next);
    setInput("");
    setError(null);
    setLoading(true);
    try {
      const data = await chatWithAI(trimmed, analysis, profile, history);
      onMessagesChange([...next, { role: "assistant", content: data.answer }]);
    } catch {
      setError("ขออภัย ไม่สามารถเชื่อมต่อผู้ช่วย AI ได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  if (!analysis) {
    return (
      <div className="max-w-[760px] mx-auto px-4 pt-6 pb-6 flex flex-col min-h-[calc(100vh-57px)]">
        <h1 className="text-xl font-semibold text-[var(--deep)]">ผู้ช่วยประกัน + วางแผนการเงิน</h1>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5 mt-4">
          <p className="text-sm text-[var(--sub)]">
            ยังไม่มีผลการวิเคราะห์ กรุณาอัปโหลดกรมธรรม์และทำการวิเคราะห์ให้เสร็จก่อน จึงจะสามารถถามผู้ช่วย AI ได้
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[760px] mx-auto px-4 pt-6 pb-6 flex flex-col min-h-[calc(100vh-57px)]">
      <h1 className="text-xl font-semibold text-[var(--deep)]">ผู้ช่วยประกัน + วางแผนการเงิน</h1>

      <div className="flex-1 mt-4">
        {messages.length === 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-5">
            <p className="text-[13px] text-[var(--sub)] mb-3">ลองถามคำถามเหล่านี้ได้เลย</p>
            {QUICK.map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                disabled={loading}
                className="text-left w-full text-sm px-3 py-2.5 rounded-xl border border-[var(--border)] text-[var(--teal)] bg-[var(--card)] mb-2 disabled:opacity-50"
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

        {messages[messages.length - 1]?.role === "assistant" && !loading && (
          <p className="text-xs text-[var(--sub)] mb-3">{DISCLAIMER}</p>
        )}

        {loading && (
          <div className="flex mb-3">
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl px-4 py-3 text-sm text-[var(--sub)] flex items-center gap-2">
              <span
                className="inline-block w-3.5 h-3.5 rounded-full border-2 border-[var(--sub)] border-t-transparent animate-spin"
                aria-hidden="true"
              />
              กำลังคิด… (อาจใช้เวลาสักครู่)
            </div>
          </div>
        )}

        {error && (
          <div className="flex mb-3">
            <div className="bg-[var(--card)] border border-red-300 text-red-600 rounded-2xl px-4 py-3 text-sm">
              {error}
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && send(input)}
          placeholder="พิมพ์คำถาม..."
          disabled={loading}
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--card)] text-sm disabled:opacity-50"
        />
        <button
          onClick={() => send(input)}
          disabled={loading}
          className="w-auto px-5 py-3 rounded-xl bg-[var(--teal)] text-white font-medium hover:bg-[var(--tealDark)] disabled:opacity-50"
        >
          ถาม
        </button>
      </div>
    </div>
  );
}
