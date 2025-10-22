import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import LoginRoundedIcon from "@mui/icons-material/LoginRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import BookmarkRoundedIcon from "@mui/icons-material/BookmarkRounded";
import ChatRoundedIcon from "@mui/icons-material/ChatRounded";

const items = [
  {
    icon: <LoginRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Welcome Back",
    description:
      "Pick up right where you left off — continue reading, posting, or joining discussions on Newzly.",
  },
  {
    icon: <PeopleAltRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Your Community Awaits",
    description:
      "Rejoin a passionate network of developers, tech enthusiasts, and creators shaping the news.",
  },
  {
    icon: <BookmarkRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Access Saved Stories",
    description:
      "Log in to see your bookmarked posts and threads you want to revisit later.",
  },
  {
    icon: <ChatRoundedIcon sx={{ color: "text.secondary" }} />,
    title: "Join the Conversation",
    description:
      "Comment, vote, and share your thoughts on the latest tech and startup trends.",
  },
];

export default function LoginContent() {
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
