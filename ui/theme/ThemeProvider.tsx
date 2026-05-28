import { createContext, useContext, useEffect, type ReactNode } from "react";
import { tokens, type Tokens } from "./tokens.js";
import { injectGlobalStyles } from "./globalStyles.js";

const ThemeContext = createContext<Tokens>(tokens);

export interface ThemeProviderProps {
  readonly children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  useEffect(() => {
    injectGlobalStyles();
  }, []);

  return <ThemeContext.Provider value={tokens}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Tokens {
  return useContext(ThemeContext);
}
