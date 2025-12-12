import { useState, useRef, type ReactElement } from "react";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  MenuIcon,
  Toolbar,
  Typography,
  Container,
  useTheme,
  alpha,
  useScrollTrigger,
  Slide,
  Newspaper,
  Link
} from "@/components/common/mui";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

// Components
import NavLinks from "./NavLinks";
import UserMenu from "./User";
import MobileNav from "./Nav";

// Types
import { HeaderProps } from "@/lib/types";

const DRAWER_WIDTH = 280;

function HideOnScroll(props: { children: ReactElement }) {
  const { children } = props;
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = (props: HeaderProps) => {
  const { children, window } = props;
  const theme = useTheme();
  const { data: user } = useQuery(userQueryOptions());
  const [mobileOpen, setMobileOpen] = useState(false);

  const appBarRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const container =
    window !== undefined ? () => window().document.body : undefined;

  useGSAP(() => {
    if (appBarRef.current) {
      gsap.fromTo(
        appBarRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <HideOnScroll>
      <AppBar
        ref={appBarRef}
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: alpha(theme.palette.background.paper, 0.8),
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          color: "text.primary",
          backgroundImage: "none",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: { xs: 60, sm: 72 }, gap: 2 }}>
            
            {/* HAMBURGER (Mobile Only) */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            {/* LOGO */}
            <Box sx={{ display: "flex",alignItems:"center", gap:1, mr: 4 }}>
              <Link
                ref={logoRef}
                to="/"
                disableAnimation
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    borderRadius: "8px",
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  <Newspaper/>
                </Box>
              </Link>
                <Typography
                  variant="h6"
                  noWrap
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.5px",
                    color: "text.primary",
                    fontSize: "1.35rem",
                    display: { xs: 'none', sm: 'block' } 
                  }}
                >
                  Newsly
                </Typography>
            </Box>
            <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                <NavLinks />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box sx={{ display: { md: "none" } }}>{children}</Box>
              <UserMenu user={user || null} />
            </Box>
          </Toolbar>
        </Container>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              bgcolor: "background.paper",
            },
          }}
        >
          <MobileNav user={user || null} onClose={handleDrawerToggle} />
        </Drawer>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;