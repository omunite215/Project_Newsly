import type { NotFoundRouteProps } from "@tanstack/react-router";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CustomButtonLink } from "./ui/CustomLink";

const NotFound = (props: NotFoundRouteProps) => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				columnGap: 16,
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
                overflowY: "clip",
			}}
		>
			<img
				src="/illustrations/not-found.svg"
				height={250}
				width={250}
				loading="lazy"
				alt="404"
			/>
			<Typography variant="h2">404</Typography>
			<Typography variant="h6">Want to get back on track ?</Typography>
			<CustomButtonLink to="/" sx={{mt: 3}} variant="contained" size="large">
				Back to Home
			</CustomButtonLink>
		</Box>
	);
};

export default NotFound;
