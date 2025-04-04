import { Link, Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CustomMaterialThemeProvider from "@/components/ui/provider";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export const Route = createRootRoute({
	component: RootComponent,
});

function RootComponent() {
	return (
		<>
			<CustomMaterialThemeProvider>
				<Box
					component="section"
					sx={{
						display: "flex",
						minHeight: "100vh",
						flexDirection: "column",
						background: "background.main",
					}}
				>
          <Header/>
					<Container component="main" sx={{ p: 16, flexGrow: 1 }}>
						<Outlet />
					</Container>
          <Footer/>
				</Box>
			</CustomMaterialThemeProvider>
			<ReactQueryDevtools />
			<TanStackRouterDevtools position="bottom-left" />
		</>
	);
}
