import { useRef, useCallback, useState } from "react";
import {
  IconButton,
  Box,
  styled,
  alpha,
  Tooltip,
  useTheme,
  type Theme,
} from "@mui/material";
import { LightMode, DarkMode, AutoMode } from "@mui/icons-material";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// Ensure this path matches where you saved the provider
import { useColorMode } from "./provider";

// ============================================
// Types
// ============================================

interface ThemeSwitchProps {
  /** * If true, renders as a Fixed FAB (Desktop).
   * If false, renders as a standard IconButton (Mobile Header).
   */
  floating?: boolean;
  showAutoMode?: boolean;
  size?: "small" | "medium" | "large";
  className?: string; // Allow StyledWrapper to inject classes
}

interface SwitchContainerProps {
  floating?: boolean;
}

interface RayProps {
  index: number;
  total: number;
}

interface ModeIndicatorProps {
  active?: boolean;
  mode: "light" | "dark" | "auto";
}

// ============================================
// Styled Components
// ============================================

const SwitchContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== "floating",
})<SwitchContainerProps>(({ theme, floating }) => ({
  position: "relative",
  zIndex: theme.customZIndex?.overlay || 1300,

  // Logic: If floating, pin to bottom right. If not, it flows naturally (for Header).
  ...(floating && {
    position: "fixed",
    bottom: 24,
    right: 24,
    [theme.breakpoints.up("sm")]: {
      bottom: 32,
      right: 32,
    },
    [theme.breakpoints.up("md")]: {
      bottom: 40,
      right: 40,
    },
  }),
}));

const SwitchButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "floating",
})<SwitchContainerProps>(({ theme, floating }) => ({
  position: "relative",
  overflow: "hidden",
  transition: theme.transitions.create(["all"], {
    duration: theme.transitions.duration.short,
  }),

  // --- FAB STYLE (Desktop/Floating) ---
  ...(floating && {
    width: 56,
    height: 56,
    borderRadius: theme.shape.borderRadius * 2,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    color: theme.palette.primary.main,
    boxShadow: theme.shadows[4],
    backdropFilter: "blur(20px)",

    "&:hover": {
      backgroundColor: theme.palette.action.hover,
      transform: "translateY(-4px)",
      boxShadow: theme.shadows[8],
    },
  }),

  // --- HEADER STYLE (Mobile/Static) ---
  ...(!floating && {
    width: 40,
    height: 40,
    borderRadius: "50%", // Standard circular button for header
    backgroundColor: "transparent",
    color: theme.palette.text.primary,
    border: `1px solid transparent`,

    "&:hover": {
      backgroundColor: alpha(theme.palette.text.primary, 0.08),
    },
  }),

  // Shared Active State
  "&:active": {
    transform: "scale(0.95)",
  },
}));

const CircleOverlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== "themeColor",
})<{ themeColor: "light" | "dark" | "auto" }>(({ theme, themeColor }) => {
  const getOverlayColor = () => {
    if (themeColor === "auto") {
      // In auto, we guess the OPPOSITE of current to flood the screen,
      // but here we want to flood with the NEW color.
      return theme.palette.mode === "dark" ? "#FFFFFF" : "#202124";
    }
    return themeColor === "dark" ? "#202124" : "#FFFFFF";
  };

  return {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    pointerEvents: "none",
    zIndex: (theme.customZIndex?.overlay || 1300) - 1, // Behind the button
    backgroundColor: getOverlayColor(),
    clipPath: "circle(0% at 50% 50%)",
    willChange: "clip-path",
  };
});

const RayContainer = styled(Box)({
  position: "absolute",
  inset: 0,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  pointerEvents: "none",
  zIndex: -1,
});

const Ray = styled(Box)<RayProps>(({ theme, index, total }) => {
  const angle = (index / total) * 360;
  return {
    position: "absolute",
    width: 2,
    height: 16, // Longer rays
    background: `linear-gradient(to top, 
      ${alpha(theme.palette.primary.main, 0)} 0%,
      ${alpha(theme.palette.primary.main, 0.8)} 50%,
      ${alpha(theme.palette.primary.main, 0)} 100%
    )`,
    borderRadius: 1,
    transformOrigin: "center 28px", // Push rays further out
    rotate: `${angle}deg`,
    opacity: 0,
  };
});

const ModeIndicator = styled(Box)<ModeIndicatorProps>(({
  theme,
  active,
  mode,
}) => {
  const colors = {
    light: theme.palette.warning.main,
    dark: theme.palette.primary.main,
    auto: theme.palette.info.main,
  };

  return {
    position: "absolute",
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: "50%",
    backgroundColor: colors[mode],
    opacity: active ? 1 : 0,
    transform: active ? "scale(1)" : "scale(0)",
    transition: theme.transitions.create(["all"]),
  };
});

const Ripple = styled(Box)(({ theme }) => ({
  position: "absolute",
  borderRadius: "50%",
  backgroundColor: alpha(theme.palette.primary.main, 0.15),
  transform: "scale(0)",
  pointerEvents: "none",
}));

// ============================================
// Component
// ============================================

export const ThemeSwitch = ({
  floating = true,
  showAutoMode = true,
  className,
}: ThemeSwitchProps) => {
  const theme = useTheme();
  const { mode, setMode } = useColorMode();

  const [isAnimating, setIsAnimating] = useState(false);
  const [overlayTheme, setOverlayTheme] = useState<"light" | "dark" | "auto">(
    "auto"
  );

  // Refs with strict types
  const buttonRef = useRef<HTMLButtonElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const raysRef = useRef<(HTMLDivElement | null)[]>([]); // Array of refs
  const rippleRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const isDark = theme.palette.mode === "dark";
  const isSystem = mode === "system";

  // Initial Entry Animation (Only if floating)
  useGSAP(() => {
    if (floating && buttonRef.current) {
      gsap.fromTo(
        buttonRef.current,
        { scale: 0, rotation: -180, opacity: 0 },
        {
          scale: 1,
          rotation: 0,
          opacity: 1,
          duration: 0.6,
          ease: "back.out(1.7)",
          delay: 0.5,
        }
      );
    }
  }, [floating]);

  // Helpers
  const getButtonCenter = useCallback(() => {
    if (!buttonRef.current) return { x: "50%", y: "50%" };
    const rect = buttonRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    return { x: `${x}px`, y: `${y}px` };
  }, []);

  const animateRays = useCallback((show: boolean) => {
    const rays = raysRef.current.filter((r): r is HTMLDivElement => r !== null);
    if (rays.length === 0) return;

    if (!show) {
      gsap.to(rays, { opacity: 0, scaleY: 1, duration: 0.2 });
      return;
    }

    // Staggered burst
    rays.forEach((ray, i) => {
      gsap.to(ray, {
        opacity: 1,
        scaleY: 1.5,
        duration: 0.3,
        delay: i * 0.02,
        yoyo: true,
        repeat: 1,
        ease: "power2.out",
      });
    });
  }, []);

  const handleToggle = useCallback(() => {
    if (isAnimating || !overlayRef.current || !iconRef.current) return;
    setIsAnimating(true);

    // 1. Determine Next Mode
    let newMode: typeof mode;
    if (showAutoMode) {
      if (mode === "light") newMode = "dark";
      else if (mode === "dark") newMode = "system";
      else newMode = "light";
    } else {
      newMode = isDark ? "light" : "dark";
    }

    // 2. Set overlay color to MATCH the destination
    setOverlayTheme(newMode === "system" ? "auto" : newMode);

    // 3. Ripple Effect
    if (rippleRef.current && buttonRef.current) {
      const btn = buttonRef.current.getBoundingClientRect();
      const size = Math.max(btn.width, btn.height);
      gsap.set(rippleRef.current, {
        width: size,
        height: size,
        left: 0,
        top: 0,
        x: 0,
        y: 0,
      });
      gsap.fromTo(
        rippleRef.current,
        { scale: 0, opacity: 0.5 },
        { scale: 2.5, opacity: 0, duration: 0.5, ease: "power1.out" }
      );
    }

    // 4. Calculate Screen Cover Geometry
    const { x, y } = getButtonCenter();
    const diagonal = Math.sqrt(
      window.innerWidth ** 2 + window.innerHeight ** 2
    );
    // Factor 1.5 ensures corners are covered even if button is in corner
    const maxRadius =
      (diagonal / Math.min(window.innerWidth, window.innerHeight)) * 150;

    // 5. Main Timeline
    if (tlRef.current) tlRef.current.kill();

    tlRef.current = gsap.timeline({
      onStart: () => animateRays(true),
      onComplete: () => {
        setIsAnimating(false);
        // Reset clip path to center but invisible
        gsap.set(overlayRef.current, {
          clipPath: "circle(0% at 50% 50%)",
          opacity: 0,
        });
      },
    });

    tlRef.current
      // A. Shrink Icon
      .to(iconRef.current, { scale: 0, rotation: -90, duration: 0.2 })

      // B. Expand Overlay (The Flood)
      .to(
        overlayRef.current,
        {
          opacity: 1,
          clipPath: `circle(${maxRadius}% at ${x} ${y})`,
          duration: 0.8,
          ease: "power3.inOut",
          onStart: () => {
            // C. SWITCH THEME halfway through when screen is covered
            setTimeout(() => setMode(newMode), 350);
          },
        },
        "-=0.1"
      )

      // D. Fade out overlay (revealing new theme underneath)
      .to(overlayRef.current, { opacity: 0, duration: 0.4 })

      // E. Pop Icon Back
      .to(iconRef.current, {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
  }, [
    isAnimating,
    isDark,
    mode,
    showAutoMode,
    setMode,
    getButtonCenter,
    animateRays,
  ]);

  // UI Helpers
  const getTooltip = () => {
    if (isSystem) return "System Theme";
    return isDark ? "Dark Mode" : "Light Mode";
  };

  const getIcon = () => {
    if (isSystem) return <AutoMode fontSize="inherit" />;
    return isDark ? (
      <LightMode fontSize="inherit" />
    ) : (
      <DarkMode fontSize="inherit" />
    );
  };

  return (
    <SwitchContainer floating={floating} className={className}>
      <Tooltip title={getTooltip()} placement={floating ? "left" : "bottom"}>
        <SwitchButton
          ref={buttonRef}
          onClick={handleToggle}
          disabled={isAnimating}
          floating={floating}
          sx={{
            // Ensure Icon is sized relative to button
            fontSize: floating ? 24 : 20,
          }}
        >
          <Ripple ref={rippleRef} />

          {/* Sun Rays (Only visible during animation) */}
          <RayContainer>
            {[...Array(8)].map((_, i) => (
              <Ray
                key={i}
                index={i}
                total={8}
                // ✅ FIX: Explicitly type 'el' as HTMLDivElement | null
                ref={(el: HTMLDivElement | null) => {
                  raysRef.current[i] = el;
                }}
              />
            ))}
          </RayContainer>

          {/* Small dots indicating mode */}
          {showAutoMode && floating && (
            <>
              <ModeIndicator mode="light" active={mode === "light"} />
              <ModeIndicator mode="dark" active={mode === "dark"} />
              <ModeIndicator mode="auto" active={mode === "system"} />
            </>
          )}

          {/* Main Icon */}
          <Box ref={iconRef} display="flex">
            {getIcon()}
          </Box>
        </SwitchButton>
      </Tooltip>

      {/* The Global Overlay */}
      <CircleOverlay ref={overlayRef} themeColor={overlayTheme} />
    </SwitchContainer>
  );
};

export default ThemeSwitch;
