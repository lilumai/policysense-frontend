// lib/api-client.ts
//
// Isolated data-fetching layer. No component calls fetch() directly —
// everything goes through here so the FastAPI base URL is configured
// in exactly one place. The existing FastAPI backend (main.py) is
// unchanged; CORS is already open (allow_origins=["*"]) there, so this
// works whether the Next.js app is deployed on the same domain or not.

import type {
  Profile,
  PolicyItem,
  AnalyzeApiResponse,
  ExtractApiResponse,
  AnalysisResponse,
  ChatMessage,
  ChatResponse,
} from "@/types";

// Empty string = same-origin (works if reverse-proxied under one domain).
// Set NEXT_PUBLIC_API_BASE_URL for cross-origin deployments.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

async function parseJsonOrThrow<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {
      // response wasn't JSON — keep the generic detail
    }
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

export async function extractPolicy(file: File): Promise<ExtractApiResponse> {
  const form = new FormData();
  form.append("file", file);

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/extract`, { method: "POST", body: form });
  } catch {
    throw new Error(
      `เชื่อมต่อ ${API_BASE_URL || "backend"} ไม่ได้ (network error) — เช็คว่า FastAPI รันอยู่หรือยัง`
    );
  }
  return parseJsonOrThrow<ExtractApiResponse>(res);
}

export async function analyzePortfolio(
  profile: Profile,
  policies: PolicyItem[],
  explain = false
): Promise<AnalyzeApiResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, policies, explain }),
    });
  } catch {
    throw new Error(
      `เชื่อมต่อ ${API_BASE_URL || "backend"} ไม่ได้ (network error) — เช็คว่า FastAPI รันอยู่หรือยัง`
    );
  }
  return parseJsonOrThrow<AnalyzeApiResponse>(res);
}

export async function chatWithAI(
  question: string,
  analysis: AnalysisResponse,
  profile: Profile | null,
  history: ChatMessage[]
): Promise<ChatResponse> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, analysis, profile, history }),
    });
  } catch {
    throw new Error(
      `เชื่อมต่อ ${API_BASE_URL || "backend"} ไม่ได้ (network error) — เช็คว่า FastAPI รันอยู่หรือยัง`
    );
  }
  return parseJsonOrThrow<ChatResponse>(res);
}

export async function checkHealth(): Promise<{ status: string; llm_configured: boolean }> {
  const res = await fetch(`${API_BASE_URL}/health`);
  return parseJsonOrThrow(res);
}
