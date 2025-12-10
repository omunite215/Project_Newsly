import { useRef } from "react";
import { Order, SortBy } from "@/shared/schemas";
import { KeyboardArrowDown } from "@mui/icons-material";
import {
  FormControl,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Typography,
  IconButton,
  Stack,
  alpha,
  useTheme,
} from "@/components/common/mui";
import { useNavigate } from "@tanstack/react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const SortBar = ({ sortBy, order }: { sortBy: SortBy; order: Order }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const arrowRef = useRef<HTMLButtonElement>(null);

  // Animate arrow rotation when order changes
  useGSAP(() => {
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: order === "desc" ? 180 : 0,
        duration: 0.4,
        ease: "back.out(1.7)",
      });
    }
  }, [order]);

  const handleSortChange = (event: SelectChangeEvent) => {
    navigate({
      to: ".",
      search: (prev: any) => ({ ...prev, sortBy: event.target.value }),
    } as any);
  };

  const toggleOrder = () => {
    navigate({
      to: ".",
      search: (prev: any) => ({
        ...prev,
        order: order === "asc" ? "desc" : "asc",
      }),
    } as any);
  };

  return (
    <Stack 
      direction="row" 
      justifyContent="space-between" 
      alignItems="center" 
      mb={3}
      sx={{
        p: 1,
        bgcolor: alpha(theme.palette.background.paper, 0.5),
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} pl={1}>
        <Typography variant="body2" fontWeight={600} color="text.secondary">
            Sort by:
        </Typography>
        <FormControl variant="standard" size="small">
          <Select
            value={sortBy}
            onChange={handleSortChange}
            disableUnderline
            displayEmpty
            sx={{
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "primary.main",
              "& .MuiSelect-select": {
                py: 0.5,
                pr: 4, 
              },
            }}
          >
            <MenuItem value="points">Top Rated</MenuItem>
            <MenuItem value="recent">Most Recent</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <IconButton
        ref={arrowRef}
        onClick={toggleOrder}
        size="small"
        sx={{
          border: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          "&:hover": {
            bgcolor: "action.hover",
            borderColor: "primary.main",
          },
        }}
      >
        <KeyboardArrowDown fontSize="small" />
      </IconButton>
    </Stack>
  );
};

export default SortBar;