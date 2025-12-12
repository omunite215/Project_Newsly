import { createFileRoute, redirect } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// Components
import { LoginForm, LoginContent } from "@/components";
import {
  Box,
  Stack,
  Container,
  useTheme,
  alpha
} from "@/components/common/mui";

// Logic
import { userQueryOptions } from "@/lib/api";

const loginSearchSchema = z.object({
  redirect: fallback(z.string(), "/").default("/"),
});

export const Route = createFileRoute("/login")({
  component: RouteComponent,
  beforeLoad: async ({ context, search }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());
    if (user) {
      throw redirect({ to: search.redirect });
    }
  },
  validateSearch: zodSearchValidator(loginSearchSchema),
});

function RouteComponent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useGSAP(() => {
    if (containerRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 }
      );
    }
  }, []);

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        position: "relative",
      }}
    >
      <Container maxWidth="lg" ref={containerRef}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="center"
          spacing={{ xs: 4, md: 8, lg: 12 }}
          sx={{ py: 4 }}
        >
          <Box sx={{ display: { xs: "none", md: "block" }, flex: 1 }}>
            <LoginContent />
          </Box>
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              height: "400px",
              width: "1px",
              bgcolor: theme.palette.divider,
              opacity: 0.5
            }}
          />
          <Box sx={{ flex: 1, width: "100%", maxWidth: "420px" }}>
            <LoginForm />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}