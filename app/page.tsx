// app/page.tsx
import App from "@/components/App";

// This page has no server-renderable content of its own — the entire
// experience is a stateful, interactive SPA (login → upload → review →
// dashboard → chat), so it delegates immediately to a Client Component.
// See Audit: kept as a single route matching the source's state-machine
// behavior rather than splitting into multiple Next.js routes.
export default function Page() {
  return <App />;
}
