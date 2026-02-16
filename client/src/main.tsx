import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ErrorBoundary } from "./components/ErrorBoundary";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// SAFETY: Clear potentially malformed auth tokens that cause "atob" errors
try {
  const token = localStorage.getItem("__convex_auth_token");
  if (token && token.includes("\\")) {
    console.warn("Found malformed token, clearing storage...");
    localStorage.clear();
  }
} catch (e) {
  // Ignore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <App />
      </ConvexAuthProvider>
    </ErrorBoundary>
  </StrictMode>,
)
