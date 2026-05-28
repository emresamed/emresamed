import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import type { SeedData } from "../src/domain/types.js";
import { App } from "./App.js";

declare global {
  interface Window {
    __MFA_SEED__?: SeedData;
  }
}

/**
 * Browser entrypoint. Expects the seed data to be inlined onto `window` by the
 * host page. Falls back to a small embedded seed for storybook-style previews.
 */
const FALLBACK_SEED: SeedData = {
  schemaVersion: "1.0.0",
  exercises: [],
  weeklySplitTemplates: [],
};

const root = document.getElementById("root");
if (!root) {
  throw new Error("Mount point #root not found.");
}
const seed = window.__MFA_SEED__ ?? FALLBACK_SEED;

createRoot(root).render(
  <StrictMode>
    <App seedData={seed} />
  </StrictMode>,
);
