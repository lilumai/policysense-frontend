// types/index.ts

export type HospitalTier = "premium" | "general" | "economy";

export type Category =
  | "life"
  | "ipd_room"
  | "ipd_lumpsum"
  | "ci"
  | "pa_medical"
  | "pa_death"
  | "other";

export type ResultStatus = "gap" | "overlap" | "ok" | "goal";

export type Tier = "regulatory_backed" | "industry_data" | "heuristic";

export interface Profile {
  annual_income: number;
  dependents: number;
  age: number;
  hospital_tier: HospitalTier;
  has_copayment_status: boolean;
  debt_outstanding: number | null;
  family_monthly_expense: number | null;
  children_education_cost: number | null;
  existing_assets: number | null;
  current_annual_expense: number | null;
}

export interface PolicyItem {
  id: string;
  insurer: string;
  category: Category;
  sum_insured: number;
  annual_premium: number;
}

export interface ExtractedItem {
  id: string;
  insurer: string;
  category: Category;
  sum_insured: number | null;
  annual_premium: number | null;
  confidence: "high" | "low";
  include: boolean;
  sourceFile: string;
}

export interface FileEntry {
  id: string;
  file: File;
  name: string;
  status: "pending" | "extracting" | "done" | "error";
  error?: string;
}

export interface AnalysisResultItem {
  category: Category;
  label: string;
  unit: string;
  tier: Tier;
  source: string;
  target: number;
  current: number | null;
  gap: number | null;
  status: ResultStatus;
  policy_count: number;
  policies: string[];
}

export interface Affordability {
  ratio: number | null;
  status: "ok" | "watch" | "over_budget" | "unknown";
  note: string;
  source: string;
}

export interface AnalysisResponse {
  results: AnalysisResultItem[];
  affordability: Affordability;
  total_premium: number;
}

export interface AnalyzeApiResponse {
  analysis: AnalysisResponse;
  explanation: string | null;
}

export interface ExtractApiResponseItem {
  insurer: string | null;
  category: string;
  sum_insured: number | null;
  annual_premium: number | null;
  raw_text?: string | null;
  confidence: "high" | "low";
}

export interface ExtractApiResponse {
  filename: string;
  text_extracted: boolean;
  char_count: number;
  items: ExtractApiResponseItem[];
  warning: string | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export type Screen = "login" | "upload" | "review" | "dashboard" | "chat";
