import { useEffect, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Collapse,
  IconButton,
  Stack,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Refresh,
  Home,
  BugReport,
  KeyboardArrowDown,
  KeyboardArrowUp,
  ContentCopy,
} from "@mui/icons-material";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// ✅ Use our consistent ButtonLink
import { ButtonLink } from "@/components/common/mui";

const ErrorPage = ({ error }: { error: Error }) => {
  const router = useRouter();
  const theme = useTheme();
  const isDev = import.meta.env.NODE_ENV !== "production";

  // React Query logic
  const queryClientErrorBoundary = useQueryErrorResetBoundary();
  useEffect(() => {
    queryClientErrorBoundary.reset();
  }, [queryClientErrorBoundary]);

  // Dev mode toggle
  const [showDetails, setShowDetails] = useState(false);

  // Animation refs
  const containerRef = useRef<HTMLDivElement>(null);
  const graphicRef = useRef<HTMLImageElement>(null);

  // GSAP Entrance
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (graphicRef.current) {
      tl.fromTo(
        graphicRef.current,
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6 }
      );
    }

    if (containerRef.current) {
      tl.fromTo(
        containerRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1 },
        "-=0.4"
      );
    }
  }, []);

  const handleCopyError = () => {
    navigator.clipboard.writeText(
      `${error.name}: ${error.message}\n${error.stack}`
    );
  };

  return (
    <Container maxWidth="sm">
      <Box
        ref={containerRef}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
          py: 4,
        }}
      >
        {/* 1. Illustration */}
        <Box
          component="img"
          ref={graphicRef}
          src="/illustrations/error.svg" // Ensure this file exists, or use a fallback Icon
          onError={(e) => {
            // Fallback if image fails to load
            e.currentTarget.style.display = "none";
          }}
          alt="Error Illustration"
          sx={{
            height: 200,
            width: 200,
            mb: 4,
            // If image fails, this box won't take space due to display none above
          }}
        />

        {/* Fallback Icon if image missing (Visual safety) */}
        <BugReport
          sx={{
            fontSize: 80,
            color: "text.secondary",
            mb: 2,
            display: "none", // Remove this line if you don't have the SVG yet
            // display: 'block' // Uncomment this if you don't have the SVG
          }}
        />

        {/* 2. Main Text */}
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Something went wrong
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 4, maxWidth: "80%" }}
        >
          We encountered an unexpected error while loading this page. Please try
          refreshing or return home.
        </Typography>

        {/* 3. Actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          width="100%"
          justifyContent="center"
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<Refresh />}
            onClick={() => router.invalidate()}
            sx={{
              borderRadius: 99,
              px: 4,
              boxShadow: theme.shadows[4],
            }}
          >
            Try Again
          </Button>

          <ButtonLink
            to="/"
            variant="outlined"
            size="large"
            iconStart={<Home />}
            sx={{ borderRadius: 99, px: 4 }}
          >
            Return Home
          </ButtonLink>
        </Stack>

        {/* 4. Developer Details (Google Style Collapsible) */}
        {isDev && (
          <Box sx={{ width: "100%", mt: 6 }}>
            <Button
              onClick={() => setShowDetails(!showDetails)}
              endIcon={
                showDetails ? <KeyboardArrowUp /> : <KeyboardArrowDown />
              }
              color="error"
              size="small"
              sx={{ mb: 1, borderRadius: 99 }}
            >
              {showDetails
                ? "Hide Developer Details"
                : "Show Developer Details"}
            </Button>

            <Collapse in={showDetails}>
              <Paper
                variant="outlined"
                sx={{
                  p: 3,
                  bgcolor: alpha(theme.palette.error.main, 0.04),
                  borderColor: alpha(theme.palette.error.main, 0.2),
                  borderRadius: 4,
                  textAlign: "left",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mb={1}
                >
                  <Typography
                    variant="subtitle2"
                    color="error.main"
                    fontWeight={700}
                  >
                    {error.name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={handleCopyError}
                    title="Copy stack trace"
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Stack>

                <Typography variant="body2" fontWeight={500} gutterBottom>
                  {error.message}
                </Typography>

                <Box
                  component="pre"
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: alpha(theme.palette.common.black, 0.05),
                    borderRadius: 2,
                    overflowX: "auto",
                    fontSize: "0.75rem",
                    fontFamily: "monospace",
                    color: "text.secondary",
                  }}
                >
                  {error.stack}
                </Box>
              </Paper>
            </Collapse>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default ErrorPage;
