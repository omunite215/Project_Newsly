import * as React from "react";
import { 
  ThemeProvider, 
  CssBaseline, 
  useMediaQuery, 
  createTheme
} from "@mui/material";
import createAppTheme from "./themes"; // Adjust path if needed

/* ------------------------------------------------------------------ */
/* CONTEXT DEFINITIONS                                                */
/* ------------------------------------------------------------------ */

type Mode = "light" | "dark" | "system";

interface ColorModeContextType {
  mode: Mode;
  setMode: (mode: Mode) => void;
}

export const ColorModeContext = React.createContext<ColorModeContextType>({
  mode: "system",
  setMode: () => {},
});

/* ------------------------------------------------------------------ */
/* CUSTOM HOOK (Replacement for useColorScheme)                       */
/* ------------------------------------------------------------------ */

export const useColorMode = () => {
  const context = React.useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within a CustomMaterialThemeProvider");
  }
  return context;
};

/* ------------------------------------------------------------------ */
/* PROVIDER COMPONENT                                                 */
/* ------------------------------------------------------------------ */

const STORAGE_KEY = "hn-theme-mode";

const CustomMaterialThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // 1. Initialize state from localStorage or default to 'system'
  const [mode, setMode] = React.useState<Mode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved as Mode) || "system";
    }
    return "system";
  });

  // 2. Detect System Preference
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // 3. Resolve actual palette mode (light/dark)
  const resolvedMode = React.useMemo(() => {
    if (mode === "system") {
      return prefersDarkMode ? "dark" : "light";
    }
    return mode;
  }, [mode, prefersDarkMode]);

  // 4. Generate Theme (using your factory from themes.ts)
  const theme = React.useMemo(() => {
    return createAppTheme(resolvedMode);
  }, [resolvedMode]);

  // 5. Persist changes
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  const contextValue = React.useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <ColorModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default CustomMaterialThemeProvider;