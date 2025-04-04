import {
	createTheme,
	type Theme,
	responsiveFontSizes,
} from "@mui/material/styles";
import { indigo, teal, grey, red } from "@mui/material/colors";
import "@fontsource/lexend/100.css";
import "@fontsource/lexend/200.css";
import "@fontsource/lexend/300.css";
import "@fontsource/lexend/500.css";
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import "@fontsource/lexend/800.css";
import "@fontsource/lexend/900.css";

let theme: Theme = createTheme({
	colorSchemes: {
		light: {
			palette: {
				primary: {
					main: indigo[500],
					contrastText: "#FFFFFF",
				},
				secondary: {
					main: teal[500],
					contrastText: "#FFFFFF",
				},
				background: {
					default: grey[50],
					paper: "#FFFFFF",
				},
				error: {
					main: red[500],
				},
			},
		},
		dark: {
			palette: {
				primary: {
					main: indigo[500],
					contrastText: "#FFFFFF",
				},
				secondary: {
					main: teal[500],
					contrastText: "#FFFFFF",
				},
				background: {
					default: grey[900],
					paper: grey[800],
				},
				error: {
					main: red[500],
				},
			},
		},
	},
	typography: {
		fontFamily: "Lexend, san-serif",
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
				},
				disableElevation: true
			}
		}
	}
});

theme = responsiveFontSizes(theme);

export default theme;