import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { grey } from "@mui/material/colors";

const Footer = () => {
	return (
		<Box component="footer" sx={{ p: 16, textAlign: "center" }}>
			<Typography variant="body1" sx={{ color: grey[800] }}>
				Newsly &copy;
			</Typography>
		</Box>
	);
};

export default Footer;
