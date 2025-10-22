import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import ForumRoundedIcon from "@mui/icons-material/ForumRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";

const items = [
  {
    icon: <TrendingUpRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Stay on Top of Tech",
    description:
      "Get the latest stories in technology, startups, and coding communities — updated in real time.",
  },
  {
    icon: <ForumRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Join the Conversation",
    description:
      "Discuss news, share insights, and connect with developers and tech enthusiasts around the world.",
  },
  {
    icon: <FlashOnRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Fast & Simple",
    description:
      "Newzly keeps things clean and fast — no clutter, just the stories that matter most to you.",
  },
  {
    icon: <StarRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Powered by the Community",
    description:
      "Upvote, comment, and curate the front page together — Newzly grows with your contributions.",
  },
];

export default function SignupContent() {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignSelf: "center",
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
        <NewspaperIcon color="primary" />
        <Typography variant="h6" fontWeight="medium">
          Newsly
        </Typography>
      </Box>
      {items.map((item) => (
        <Stack key={item.title} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: "medium" }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
