import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import {
  Box,
  Container,
  Stack,
  useMediaQuery,
  useTheme,
  ThemeSwitch,
  CustomMaterialThemeProvider
} from "@/components/common/mui";

// Components
import { Header, Footer, SnackbarProvider } from "@/components"; 

// ----------------------------------------------------------------------
// TYPES
// ----------------------------------------------------------------------

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

// ----------------------------------------------------------------------
// 1. ROOT COMPONENT (Providers)
// ----------------------------------------------------------------------

function RootComponent() {
  return (
    <CustomMaterialThemeProvider>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        autoHideDuration={3000}
      >
        <AppShell />
      </SnackbarProvider>
    </CustomMaterialThemeProvider>
  );
}

// ----------------------------------------------------------------------
// 2. APP SHELL (Layout Logic)
// ----------------------------------------------------------------------

function AppShell() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column", // Vertical Stack only
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        transition: "background-color 0.3s ease",
      }}
    >
        {/* HEADER
            - Pass ThemeSwitch as child (rendered only on mobile by Header logic)
        */}
        <Header>
           {!isDesktop && <ThemeSwitch floating={false} size="small" />}
        </Header>

        {/* MAIN CONTENT */}
        <Container
          component="main"
          maxWidth="xl" // 'lg' (1200px) is usually better for reading lists than 'xl'
          sx={{
            flexGrow: 1,
            py: { xs: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Outlet />
        </Container>

        <Footer />

        {/* FLOATING THEME SWITCH (Desktop Only) */}
        {isDesktop && <ThemeSwitch floating={true} />}
    </Box>
  );
}