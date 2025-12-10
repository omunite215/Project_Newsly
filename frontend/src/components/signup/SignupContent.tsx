import { useRef } from "react";
import {
  Box,
  Stack,
  Typography,
  Avatar,
  useTheme,
  alpha,
} from "@/components/common/mui";
import {
  TrendingUpRounded,
  ForumRounded,
  FlashOnRounded,
  StarRounded,
} from "@mui/icons-material";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const items = [
  {
    icon: <TrendingUpRounded fontSize="small" />,
    title: "Stay Updated",
    description: "Real-time stories from tech, startups, and dev communities.",
  },
  {
    icon: <ForumRounded fontSize="small" />,
    title: "Join Discussions",
    description: "Connect with developers and enthusiasts worldwide.",
  },
  {
    icon: <FlashOnRounded fontSize="small" />,
    title: "Fast & Clean",
    description: "No clutter. Just the stories that matter most to you.",
  },
  {
    icon: <StarRounded fontSize="small" />,
    title: "Curate",
    description: "Upvote and comment to shape the front page.",
  },
];

export default function SignupContent() {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  useGSAP(() => {
    if (containerRef.current) {
        gsap.fromTo(containerRef.current.children, 
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" }
        );
    }
  }, []);

  return (
    <Stack spacing={4} ref={containerRef} sx={{ px: 2 }}>
      {/* Brand Header */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Box 
                sx={{ 
                    width: 40, 
                    height: 40, 
                    bgcolor: 'primary.main', 
                    borderRadius: 1.5,
                    display: 'grid',
                    placeItems: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    boxShadow: theme.shadows[4]
                }} 
            >
                N
            </Box>
            <Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">
                Join Newsly
            </Typography>
        </Box>
        <Typography variant="h6" color="text.secondary" fontWeight={400}>
            Create an account to start your journey.
        </Typography>
      </Box>

      {/* Feature List */}
      <Stack spacing={3}>
        {items.map((item) => (
          <Stack
            key={item.title}
            direction="row"
            spacing={2}
            alignItems="flex-start"
          >
            <Avatar
                sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 40,
                    height: 40,
                }}
            >
                {item.icon}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.description}
              </Typography>
            </Box>
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
}