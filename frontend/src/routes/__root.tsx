import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { type QueryClient } from "@tanstack/react-query";
import {
  Box,
  Container,
  useMediaQuery,
  useTheme,
  ThemeSwitch,
  CustomMaterialThemeProvider
} from "@/components/common/mui";

// Components
import { Header, Footer, SnackbarProvider } from "@/components"; 

interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
});

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

function AppShell() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        bgcolor: "background.default",
        color: "text.primary",
        transition: "background-color 0.3s ease",
      }}
    >
        <Header>
           {!isDesktop && <ThemeSwitch floating={false} size="small" />}
        </Header>
        <Container
          component="main"
          maxWidth="xl"
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
        {isDesktop && <ThemeSwitch floating={true} />}
    </Box>
  );
}