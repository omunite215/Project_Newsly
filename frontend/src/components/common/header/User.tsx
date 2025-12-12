import { useState, type MouseEvent } from "react";
import {
  Box,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Typography,
  IconButton,
  Tooltip,
  ButtonLink,
  Logout,
  Person,
  Login
} from "@/components/common/mui";

const UserMenu = ({ user }: { user: string | null }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  if (!user) {
    return (
      <ButtonLink
        to="/login"
        variant="text" 
        color="primary"
        size="small"
        iconStart={<Login fontSize="small" />}
        sx={{ fontWeight: 600 }}
      >
        Login
      </ButtonLink>
    );
  }

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar 
            sx={{ 
                width: 36, 
                height: 36, 
                bgcolor: 'secondary.main',
                fontSize: '1rem',
                fontWeight: 600
            }}
          >
            {user[0]?.toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              mt: 1.5,
              minWidth: 200,
              borderRadius: 3,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
            <Typography variant="subtitle2" noWrap fontWeight={600}>
                {user}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                Signed in
            </Typography>
        </Box>
        <Divider />
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem component="a" href="/api/auth/logout">
          <ListItemIcon>
            <Logout fontSize="small" color="error" />
          </ListItemIcon>
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;