import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { CustomButtonLink, CustomLink } from "./ui/CustomLink";

interface Props {
	window?: () => Window;
}

const drawerWidth = 240;

export default function DrawerAppBar(props: Props) {
	const { window } = props;
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = () => {
		setMobileOpen((prevState) => !prevState);
	};

	const container =
		window !== undefined ? () => window().document.body : undefined;

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar component="nav" sx={{ bgcolor: "primary.main" }}>
				<Toolbar>
					<CustomLink
						to="/"
						underline="none"
						sx={{
							flexGrow: 1,
						}}
					>
						<Typography
							variant="h5"
							sx={{ fontWeight: "bold" }}
							color="primary.contrastText"
						>
							Newsly <sup style={{fontWeight: "initial"}}>&copy;</sup>
						</Typography>
					</CustomLink>
					<IconButton
						color="inherit"
						aria-label="open drawer"
						edge="start"
						onClick={handleDrawerToggle}
						sx={{ display: { sm: "none" } }}
					>
						<MenuIcon />
					</IconButton>
					<Box sx={{ display: { xs: "none", sm: "block" } }}>
						<CustomButtonLink color="inherit" to="/">
							New
						</CustomButtonLink>
						<CustomButtonLink color="inherit" to="/">
							Top
						</CustomButtonLink>
						<CustomButtonLink color="inherit" to="/">
							Submit
						</CustomButtonLink>
					</Box>
				</Toolbar>
			</AppBar>
			<nav>
				<Drawer
					container={container}
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						display: { xs: "block", sm: "none" },
						"& .MuiDrawer-paper": {
							boxSizing: "border-box",
							width: drawerWidth,
						},
					}}
				>
					<Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
						<Typography variant="h6" sx={{ my: 2 }}>
							Newsly
						</Typography>
						<Divider />
						<List>
							<ListItemButton component={CustomButtonLink} to="/about">
								<ListItemText primary="New" />
							</ListItemButton>
							<ListItemButton component={CustomButtonLink} to="/about">
								<ListItemText primary="Top" />
							</ListItemButton>
							<ListItemButton component={CustomButtonLink} to="/about">
								<ListItemText primary="Submit" />
							</ListItemButton>
						</List>
					</Box>
				</Drawer>
			</nav>
		</Box>
	);
}
