import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { CustomButtonLink } from "./ui/CustomLink";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Button from "@mui/material/Button";
import { useRouter } from "@tanstack/react-router";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { useEffect } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const ErrorPage = ({ error }: { error: Error }) => {
	const router = useRouter();
	const isDev = import.meta.env.NODE_ENV !== "production";
	const queryClientErrorBoundary = useQueryErrorResetBoundary();
	useEffect(() => {
		queryClientErrorBoundary.reset();
	}, [queryClientErrorBoundary]);

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
				src="/illustrations/error.svg"
				height={250}
				width={250}
				loading="lazy"
				alt="404"
			/>
			<Alert severity="error" sx={{ mb: 4 }}>
				<AlertTitle>Error</AlertTitle>
				We&apos;re sorry, but we encountered an unexpected error.
			</Alert>
			<Button
				size="large"
				variant="contained"
				sx={{ width: "50%" }}
				onClick={() => router.invalidate()}
			>
				Try Again
			</Button>
			<CustomButtonLink
				to="/"
				sx={{ mt: 3, width: "50%" }}
				variant="outlined"
				fullWidth
				color="secondary"
				size="large"
			>
				Return to Home
			</CustomButtonLink>
			{isDev && (
				<Accordion sx={{ width: "100%", mt: 12 }}>
					<AccordionSummary
						expandIcon={<ArrowDropDownIcon />}
						aria-controls="panel2-content"
						id="panel2-header"
						sx={{ bgcolor: "#ffcdd2" }}
					>
						<Typography component="span" color="error">
							DEVELOPMENT MODE: {error.name}
						</Typography>
					</AccordionSummary>
					<AccordionDetails>
						<Typography color="error">{error.message}</Typography>
					</AccordionDetails>
				</Accordion>
			)}
		</Box>
	);
};

export default ErrorPage;
