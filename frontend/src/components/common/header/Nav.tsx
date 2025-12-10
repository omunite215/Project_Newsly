import { NAV_LINKS } from "@/lib/utils";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Divider,
  alpha,
  ThemeSwitch,
  Link,
} from "@/components/common/mui";

const MobileNav = ({
  user,
  onClose,
}: {
  user: string | null;
  onClose: () => void;
}) => {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: 32,
            height: 32,
            bgcolor: "primary.main",
            borderRadius: 1,
          }}
        />
        <Typography variant="h6" fontWeight={700}>
          Newsly
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <List sx={{ px: 2, flexGrow: 1 }}>
        {NAV_LINKS.map((link) => (
          // ✅ Wrap ListItem with Custom Link
          <Link
            key={link.label}
            to={link.to}
            search={link.search}
            onClick={onClose}
            activeProps={{
              style: {
                backgroundColor: alpha("#FF6F00", 0.12),
                color: "#FF6F00",
                fontWeight: 600,
                borderRadius: 8,
              },
            }}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
              marginBottom: 4,
            }}
          >
            <ListItemButton sx={{ borderRadius: 2 }}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </Link>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={2}
          align="center"
        >
          Preferences
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <ThemeSwitch floating={false} />
        </Box>
      </Box>
    </Box>
  );
};

export default MobileNav;
