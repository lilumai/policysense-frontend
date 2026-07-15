// components/App.tsx
"use client";

import { useState } from "react";
import type {
  Screen,
  Profile,
  FileEntry,
  ExtractedItem,
  AnalysisResponse,
  ChatMessage,
  PolicyItem,
} from "@/types";
import { analyzePortfolio } from "@/lib/api-client";
import Nav from "@/components/ui/Nav";
import ConsentModal from "@/components/ui/ConsentModal";
import LoginScreen from "@/components/screens/LoginScreen";
import UploadScreen from "@/components/screens/UploadScreen";
import ReviewScreen from "@/components/screens/ReviewScreen";
import DashboardScreen from "@/components/screens/DashboardScreen";
import ChatScreen from "@/components/screens/ChatScreen";

const DEFAULT_PROFILE: Profile = {
  annual_income: 800000,
  dependents: 2,
  age: 35,
  hospital_tier: "general",
  has_copayment_status: false,
  debt_outstanding: null,
  family_monthly_expense: null,
  children_education_cost: null,
  existing_assets: null,
  current_annual_expense: null,
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [userEmail, setUserEmail] = useState("");
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [extractedItems, setExtractedItems] = useState<ExtractedItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [, setDecisions] = useState<{ id: number; type: "claim" | "buy_more" }[]>([]);
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  const analyzed = analysis !== null;

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setScreen("upload");
  };

  // Returning to Upload from a completed (or in-progress) analysis is treated
  // as starting a new analysis — old files/items shouldn't linger into the
  // next round. Upload <-> Review while still mid-flow is left untouched.
  const handleNavigate = (target: Screen) => {
    if (target === "upload" && (screen === "dashboard" || screen === "chat")) {
      setFiles([]);
      setExtractedItems([]);
      setAnalysis(null);
      setAnalysisError(null);
      setChatMessages([]);
    }
    setScreen(target);
  };

  const handleConfirmAndAnalyze = async () => {
    setAnalysisError(null);
    const policies: PolicyItem[] = extractedItems
      .filter((i) => i.include && i.sum_insured != null)
      .map((i) => ({
        id: i.id,
        insurer: i.insurer || "ไม่ระบุ",
        category: i.category,
        sum_insured: i.sum_insured as number,
        annual_premium: i.annual_premium || 0,
        policy_group_id: i.policy_group_id,
      }));

    try {
      const data = await analyzePortfolio(profile, policies, false);
      setAnalysis(data.analysis);
      setScreen("dashboard");
    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : String(err));
      setScreen("upload");
    }
  };

  if (screen === "login") {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div>
      <Nav
        screen={screen}
        userEmail={userEmail}
        canReview={extractedItems.length > 0}
        canDashboard={analyzed}
        onNavigate={handleNavigate}
      />

      {screen === "upload" && (
        <UploadScreen
          profile={profile}
          onProfileChange={setProfile}
          files={files}
          onFilesChange={setFiles}
          onExtractedItemsAppend={(items) => setExtractedItems((prev) => [...prev, ...items])}
          onExtractedItemsReset={() => setExtractedItems([])}
          analysisError={analysisError}
          onProceed={() => setScreen("review")}
          consentGiven={consentGiven}
          onRequestConsent={() => setShowConsentModal(true)}
        />
      )}

      {showConsentModal && (
        <ConsentModal
          onAccept={() => {
            setConsentGiven(true);
            setShowConsentModal(false);
          }}
          onCancel={() => setShowConsentModal(false)}
        />
      )}

      {screen === "review" && (
        <ReviewScreen
          items={extractedItems}
          onItemsChange={setExtractedItems}
          onBack={() => setScreen("upload")}
          onConfirm={handleConfirmAndAnalyze}
        />
      )}

      {screen === "dashboard" && (
        <DashboardScreen
          analysis={analysis}
          extractedItems={extractedItems}
          onDecision={(type) => setDecisions((prev) => [...prev, { id: Date.now(), type }])}
          onNavigate={handleNavigate}
        />
      )}

      {screen === "chat" && (
        <ChatScreen
          messages={chatMessages}
          onMessagesChange={setChatMessages}
          analysis={analysis}
          profile={profile}
        />
      )}
    </div>
  );
}
