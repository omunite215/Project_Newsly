import { Box, Typography } from "@/components/common/mui";

const Footer = () => {
	return (
		<Box
			component="footer"
			sx={{
				py: 3,
				px: 2,
				textAlign: "center",
				bgcolor: "background.main",
				borderTop: 1,
				borderColor: "divider",
				mt: "auto",
			}}
		>
			<Typography
				variant="body2"
				sx={{
					color: "text.secondary",
					fontSize: "0.875rem",
				}}
			>
				Newsly &copy; {new Date().getFullYear()}
			</Typography>
		</Box>
	);
};

export default Footer;
