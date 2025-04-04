import { ThemeProvider } from "@mui/material";
import type { ReactNode } from "@tanstack/react-router";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./themes";

const CustomMaterialThemeProvider = ({ children }: { children: ReactNode }) => {
	return (
		<ThemeProvider defaultMode="system" theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
};

export default CustomMaterialThemeProvider;
