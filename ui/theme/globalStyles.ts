import { palette, motion } from "./tokens.js";

/**
 * CSS injected once at app boot. Covers reset, focus rings, scrollbar tuning,
 * keyframes used by motion components, and the `prefers-reduced-motion` rule
 * that disables non-essential animation.
 */
export const globalStylesCss = `
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    min-height: 100%;
    background: ${palette.canvas};
    color: ${palette.textPrimary};
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Segoe UI",
      Roboto, "Helvetica Neue", Arial, sans-serif;
    font-feature-settings: "ss01", "cv11";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    overscroll-behavior: none;
    color-scheme: dark;
  }

  body {
    background:
      radial-gradient(60% 40% at 50% 0%, rgba(124, 255, 183, 0.08), transparent 70%),
      radial-gradient(80% 60% at 100% 100%, rgba(122, 182, 255, 0.06), transparent 70%),
      ${palette.canvas};
    background-attachment: fixed;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    margin: 0;
    padding: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }

  button:disabled {
    cursor: not-allowed;
  }

  input, select, textarea {
    font: inherit;
    color: inherit;
  }

  :focus {
    outline: none;
  }

  :focus-visible {
    outline: 2px solid ${palette.accent};
    outline-offset: 2px;
    border-radius: 6px;
  }

  ::selection {
    background: ${palette.accentSoft};
    color: ${palette.textPrimary};
  }

  /* Scrollbar styling for the few scroll containers in the app. */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background: ${palette.surfaceHover};
    border-radius: 999px;
  }

  @keyframes mfa-fade-in {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes mfa-pop-in {
    from { opacity: 0; transform: scale(0.92); }
    60%  { opacity: 1; transform: scale(1.02); }
    to { opacity: 1; transform: scale(1); }
  }

  @keyframes mfa-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.85; }
  }

  @keyframes mfa-spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  .mfa-fade-in { animation: mfa-fade-in ${motion.durationSlow}ms ${motion.easeEnter} both; }
  .mfa-pop-in  { animation: mfa-pop-in ${motion.durationSlow}ms ${motion.spring} both; }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

export function injectGlobalStyles(): void {
  if (typeof document === "undefined") {
    return;
  }
  const id = "mfa-global-styles";
  if (document.getElementById(id)) {
    return;
  }
  const styleEl = document.createElement("style");
  styleEl.id = id;
  styleEl.textContent = globalStylesCss;
  document.head.appendChild(styleEl);
}
