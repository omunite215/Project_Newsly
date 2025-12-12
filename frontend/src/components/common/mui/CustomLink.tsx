import { forwardRef, useRef, useImperativeHandle } from "react";
import {
  Link as MuiLink,
  Button as MuiButton,
  CircularProgress,
  Box,
  alpha,
  styled,
} from "@/components/common/mui";
import { createLink } from "@tanstack/react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CustomButtonLinkProps, CustomLinkOwnProps } from "@/lib/types";

const StyledAnchor = styled(MuiLink, {
  shouldForwardProp: (prop) =>
    !["linkVariant", "loading", "disableAnimation"].includes(prop as string),
})<CustomLinkOwnProps>(({ theme, linkVariant = "default", loading }) => {
  const { customBorderRadius } = theme;

  return {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35em",
    fontFamily: theme.typography.fontFamily,
    fontWeight: 500,
    textDecoration: "none",
    cursor: loading ? "wait" : "pointer",
    borderRadius: customBorderRadius.xs,
    transition: theme.transitions.create(["all"], {
      duration: theme.transitions.duration.short,
    }),

    ...(loading && {
      pointerEvents: "none",
      opacity: 0.6,
    }),

    ...(linkVariant === "default" && {
      color: theme.palette.text.primary,
      "&:hover": {
        color: theme.palette.primary.main,
      },
    }),

    ...(linkVariant === "subtle" && {
      color: theme.palette.text.secondary,
      fontSize: "0.8rem",
      "&:hover": {
        color: theme.palette.text.primary,
        textDecoration: "underline",
        textDecorationColor: alpha(theme.palette.text.primary, 0.4),
      },
    }),

    ...(linkVariant === "highlight" && {
      fontSize: "0.75rem",
      color: theme.palette.primary.dark,
      backgroundColor: alpha(theme.palette.primary.main, 0.1),
      padding: "2px 8px",
      borderRadius: customBorderRadius.full,
      "&:hover": {
        backgroundColor: alpha(theme.palette.primary.main, 0.2),
      },
    }),
  };
});

const BaseCustomLink = forwardRef<HTMLAnchorElement, CustomLinkOwnProps>(
  (props, ref) => {
    const { children, loading, iconStart, iconEnd, disableAnimation, ...rest } =
      props;
    const localRef = useRef<HTMLAnchorElement>(null);
    useImperativeHandle(ref, () => localRef.current as HTMLAnchorElement);
    useGSAP(
      () => {
        if (disableAnimation || loading) return;

        const el = localRef.current;
        if (!el) return;

        const onEnter = () => {
          gsap.to(el, {
            scale: 1.02,
            duration: 0.2,
            ease: "power2.out",
          });
        };

        const onLeave = () => {
          gsap.to(el, {
            scale: 1,
            duration: 0.2,
            ease: "power2.out",
          });
        };

        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);

        return () => {
          el.removeEventListener("mouseenter", onEnter);
          el.removeEventListener("mouseleave", onLeave);
        };
      },
      { scope: localRef }
    );

    return (
      <StyledAnchor
        // @ts-ignore
        ref={localRef}
        aria-busy={loading}
        loading={loading}
        {...rest}
      >
        {loading && <CircularProgress size="0.8em" color="inherit" />}
        {!loading && iconStart}
        <Box component="span" sx={{ display: "inline-block" }}>
          {children}
        </Box>
        {!loading && iconEnd}
      </StyledAnchor>
    );
  }
);

export const Link = createLink(BaseCustomLink);

const BaseButtonLink = forwardRef<HTMLButtonElement, CustomButtonLinkProps>(
  (props, ref) => {
    const { children, loading, iconStart, iconEnd, disableAnimation, ...rest } =
      props;

    const buttonRef = useRef<HTMLButtonElement>(null);

    useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement);

    useGSAP(
      () => {
        if (disableAnimation || loading) return;

        const el = buttonRef.current;
        if (!el) return;

        const onDown = () => gsap.to(el, { scale: 0.96, duration: 0.1 });
        const onUp = () =>
          gsap.to(el, { scale: 1, duration: 0.3, ease: "elastic.out(1, 0.5)" });

        el.addEventListener("mousedown", onDown);
        el.addEventListener("mouseup", onUp);
        el.addEventListener("mouseleave", onUp);

        return () => {
          el.removeEventListener("mousedown", onDown);
          el.removeEventListener("mouseup", onUp);
          el.removeEventListener("mouseleave", onUp);
        };
      },
      { scope: buttonRef }
    );

    return (
      <MuiButton
        ref={buttonRef}
        startIcon={
          loading ? <CircularProgress size={16} color="inherit" /> : iconStart
        }
        endIcon={!loading ? iconEnd : undefined}
        disabled={!!loading || props.disabled}
        {...rest}
      >
        {children}
      </MuiButton>
    );
  }
);

export const ButtonLink = createLink(BaseButtonLink);
