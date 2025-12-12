import {
  createTheme,
  responsiveFontSizes,
  alpha,
  type PaletteMode,
  type Theme,
} from "@mui/material/styles";
import "@fontsource/lexend/300.css";
import "@fontsource/lexend/400.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";


const themeCache = new Map<PaletteMode, Theme>();


export interface CustomBorderRadius {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  full: number;
}

export interface CustomDuration {
  short: number;
  medium: number;
  long: number;
}

export interface CustomZIndex {
  header: number;
  bottomNav: number;
  overlay: number;
  toast: number;
}

declare module "@mui/material/styles" {
  interface Palette {
    hackerNews: {
      upvote: string;
      comment: string;
      link: string;
      visited: string;
      headerBg: string;
      upvoteContainer: string;
      commentContainer: string;
    };
    outline: {
      main: string;
      variant: string;
    };
    state: {
      hover: string;
      focus: string;
      pressed: string;
      dragged: string;
    };
  }

  interface PaletteOptions {
    hackerNews?: Palette["hackerNews"];
    outline?: Palette["outline"];
    state?: Palette["state"];
  }

  interface Theme {
    customBorderRadius: CustomBorderRadius;
    customDuration: CustomDuration;
    customZIndex: CustomZIndex;
  }

  interface ThemeOptions {
    customBorderRadius?: CustomBorderRadius;
    customDuration?: CustomDuration;
    customZIndex?: CustomZIndex;
  }

  interface TypographyVariants {
    hnTitle: React.CSSProperties;
    hnMeta: React.CSSProperties;
    hnScore: React.CSSProperties;
    hnDomain: React.CSSProperties;
    hnUser: React.CSSProperties;
    hnTime: React.CSSProperties;
    hnComments: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    hnTitle?: React.CSSProperties;
    hnMeta?: React.CSSProperties;
    hnScore?: React.CSSProperties;
    hnDomain?: React.CSSProperties;
    hnUser?: React.CSSProperties;
    hnTime?: React.CSSProperties;
    hnComments?: React.CSSProperties;
  }
}


const tokens = {
  hnOrange: "#FF6F00",

  primary: {
    main: "#FF6F00",
    light: "#FFA726",
    dark: "#E65100",
    on: "#FFFFFF",
    container: "#FFECB3",
    onContainer: "#261900",
  },

  secondary: {
    main: "#1A73E8",
    on: "#FFFFFF",
    container: "#E8F0FE",
  },

  neutral: {
    surfaceLight: "#FFFFFF",
    surfaceDark: "#202124",
    containerLight: "#F1F3F4",
    containerDark: "#2D2E30",
    textLight: "#202124",
    textDark: "#E8EAED",
    textMutedLight: "#5F6368",
    textMutedDark: "#BDC1C6",
  },

  error: "#EA4335",
};


const motion = {
  easing: "cubic-bezier(0.2, 0, 0, 1)",
  durations: {
    short: 180,
    medium: 300,
    long: 420,
  },
};


const customBorderRadius: CustomBorderRadius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 28,
  full: 9999,
};

const customDuration: CustomDuration = {
  short: motion.durations.short,
  medium: motion.durations.medium,
  long: motion.durations.long,
};

const customZIndex: CustomZIndex = {
  header: 1100,
  bottomNav: 1150,
  overlay: 1300,
  toast: 1400,
};

const createStateLayer = (color: string) => ({
  hover: alpha(color, 0.08),
  focus: alpha(color, 0.12),
  pressed: alpha(color, 0.12),
  dragged: alpha(color, 0.16),
});


const createAppTheme = (mode: PaletteMode): Theme => {
  const cached = themeCache.get(mode);
  if (cached) return cached;

  const isDark = mode === "dark";

  const stateLayer = createStateLayer(
    isDark ? tokens.neutral.textDark : tokens.neutral.textLight
  );

  const baseTheme = createTheme({
    customBorderRadius,
    customDuration,
    customZIndex,

    palette: {
      mode,

      primary: {
        main: tokens.primary.main,
        contrastText: tokens.primary.on,
      },

      secondary: {
        main: tokens.secondary.main,
        contrastText: tokens.secondary.on,
      },

      background: {
        default: isDark
          ? tokens.neutral.surfaceDark
          : tokens.neutral.surfaceLight,
        paper: isDark
          ? tokens.neutral.containerDark
          : tokens.neutral.containerLight,
      },

      text: {
        primary: isDark
          ? tokens.neutral.textDark
          : tokens.neutral.textLight,
        secondary: isDark
          ? tokens.neutral.textMutedDark
          : tokens.neutral.textMutedLight,
      },

      divider: alpha(
        isDark ? tokens.neutral.textDark : tokens.neutral.textLight,
        0.12
      ),

      state: stateLayer,

      outline: {
        main: alpha(
          isDark ? tokens.neutral.textDark : tokens.neutral.textLight,
          0.12
        ),
        variant: alpha(
          isDark ? tokens.neutral.textDark : tokens.neutral.textLight,
          0.24
        ),
      },

      hackerNews: {
        upvote: tokens.hnOrange,
        comment: tokens.secondary.main,
        link: tokens.secondary.main,
        visited: tokens.neutral.textMutedLight,
        headerBg: isDark
          ? "linear-gradient(135deg, #202124 0%, #3C4043 100%)"
          : "linear-gradient(135deg, #FF6F00 0%, #FF9800 100%)",
        upvoteContainer: tokens.primary.container,
        commentContainer: tokens.secondary.container,
      },
    },

    typography: {
      fontFamily: `"Lexend","Google Sans","Roboto","Arial",sans-serif`,

      hnTitle: {
        fontSize: "1.05rem",
        fontWeight: 500,
        lineHeight: 1.45,
      },
      hnMeta: {
        fontSize: "0.8rem",
        color: isDark
          ? tokens.neutral.textMutedDark
          : tokens.neutral.textMutedLight,
      },
      hnScore: {
        fontSize: "0.85rem",
        fontWeight: 600,
        color: tokens.hnOrange,
        fontVariantNumeric: "tabular-nums",
      },
      hnDomain: {
        fontSize: "0.75rem",
        opacity: 0.7,
      },
      hnUser: {
        fontSize: "0.8rem",
        fontWeight: 500,
        color: tokens.primary.main,
      },
      hnTime: {
        fontSize: "0.75rem",
        opacity: 0.6,
      },
      hnComments: {
        fontSize: "0.8rem",
        fontWeight: 500,
        color: tokens.secondary.main,
      },
    },

    shape: {
      borderRadius: customBorderRadius.md,
    },

    transitions: {
      duration: {
        short: customDuration.short,
        standard: customDuration.medium,
        complex: customDuration.long,
      },
      easing: {
        easeInOut: motion.easing,
      },
    },

    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark
              ? tokens.neutral.surfaceDark
              : tokens.neutral.surfaceLight,
          },
          "*:focus-visible": {
            outline: `2px solid ${tokens.primary.main}`,
            outlineOffset: 2,
            borderRadius: 4,
          },
        },
      },

      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: customBorderRadius.lg,
            border: `1px solid ${alpha(
              isDark ? tokens.neutral.textDark : tokens.neutral.textLight,
              0.08
            )}`,
            transition: `border-color ${customDuration.medium}ms ${motion.easing}, box-shadow ${customDuration.medium}ms ${motion.easing}`,
            willChange: "transform",
          },
        },
      },

      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: customBorderRadius.full,
          },
        },
      },
    },
  });

  const theme = responsiveFontSizes(baseTheme);

  themeCache.set(mode, theme);
  return theme;
};


export const lightTheme = createAppTheme("light");
export const darkTheme = createAppTheme("dark");
export default createAppTheme;
