import { Order, SortBy } from "@/shared/schemas";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const SortBar = ({ sortBy, order }: { sortBy: SortBy; order: Order }) => {
  const navigate = useNavigate();
  const [sortby, setSortBy] = useState("recent");
  const handleChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value);
    navigate({
      to: ".",
      search: (prev: any) => ({
        ...prev,
        sortBy: sortby,
      }),
    });
  };
  return (
    <Box
      sx={{
        mb: 4,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box sx={{ maxWidth: "180px" }}>
        <FormControl fullWidth>
          <InputLabel id="sort-select-label">Sort by</InputLabel>
          <Select
            value={sortBy}
            onChange={handleChange}
            labelId="sort-select-label"
            id="sort-select"
            label="Sort by"
          >
            <MenuItem value="points">Points</MenuItem>
            <MenuItem value="recent">Recent</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <IconButton
        onClick={() => {
          navigate({
            to: ".",
            search: (prev: any) => ({
              ...prev,
              order: order === "asc" ? "desc" : "asc",
            }),
          });
        }}
        sx={{
          transition: "transform 0.3s ease-in-out",
          transform: order === "desc" ? "rotate(180deg)" : "rotate(0deg)",
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
      >
        {order ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
      </IconButton>
    </Box>
  );
};

export default SortBar;
