import { NAV_LINKS } from "@/lib/utils";
import { alpha, useTheme, ButtonLink } from "@/components/common/mui";

const NavLinks = () => {
  const theme = useTheme();

  return (
    <>
      {NAV_LINKS.map((link) => (
        <ButtonLink
            key={link.label}
            to={link.to}
            search={link.search}
            variant="text"
            color="inherit"
            // Active State Styling via TanStack Router
            activeProps={{
                style: {
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    fontWeight: 600
                }
            }}
            sx={{
                borderRadius: '99px', // Pill shape
                color: 'text.secondary',
                fontSize: '0.875rem',
                fontWeight: 500,
                minWidth: 'auto',
                px: 2,
                '&:hover': {
                    backgroundColor: alpha(theme.palette.text.primary, 0.05)
                }
            }}
        >
            {link.label}
        </ButtonLink>
      ))}
    </>
  );
};

export default NavLinks;