import { ThemeProvider, useColorScheme } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import type { ReactNode } from "@tanstack/react-router";
import { DarkTheme, LightTheme } from "./themes";

const CustomMaterialThemeProvider = ({ children }: { children: ReactNode }) => {
	const { mode } = useColorScheme();
	let currentMode: null | Theme = null;
	switch (mode) {
		case "light":
			currentMode = LightTheme;
			break;
		case "dark":
			currentMode = DarkTheme;
			break;
		case "system":
			
	}
	return <ThemeProvider theme={DarkTheme}>{children}</ThemeProvider>;
};

export default CustomMaterialThemeProvider;
