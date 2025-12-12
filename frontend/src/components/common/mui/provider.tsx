import {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import {
  ThemeProvider,
  CssBaseline,
  useMediaQuery,
} from "@/components/common/mui";
import createAppTheme from "./themes";
import { ColorModeContextType, Mode } from "@/lib/types";

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: "system",
  setMode: () => {},
});

export const useColorMode = () => {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error(
      "useColorMode must be used within a CustomMaterialThemeProvider"
    );
  }
  return context;
};

const STORAGE_KEY = "hn-theme-mode";

const CustomMaterialThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved as Mode) || "system";
    }
    return "system";
  });
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const resolvedMode = useMemo(() => {
    if (mode === "system") {
      return prefersDarkMode ? "dark" : "light";
    }
    return mode;
  }, [mode, prefersDarkMode]);
  const theme = useMemo(() => {
    return createAppTheme(resolvedMode);
  }, [resolvedMode]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);
  const contextValue = useMemo(() => ({ mode, setMode }), [mode]);
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
