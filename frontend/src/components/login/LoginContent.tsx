import { useRef } from "react";
import {
	Box,
	Stack,
	Typography,
	Avatar,
	useTheme,
	alpha,
	LoginRoundedIcon,
	PeopleAltRoundedIcon,
	BookmarkRoundedIcon,
	ChatRoundedIcon,
	NewspaperIcon,
} from "@/components/common/mui";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const items = [
	{
		icon: <LoginRoundedIcon fontSize="small" />,
		title: "Welcome Back",
		description: "Pick up right where you left off.",
	},
	{
		icon: <PeopleAltRoundedIcon fontSize="small" />,
		title: "Community",
		description: "Join a network of tech enthusiasts.",
	},
	{
		icon: <BookmarkRoundedIcon fontSize="small" />,
		title: "Saved Stories",
		description: "Access your bookmarks across devices.",
	},
	{
		icon: <ChatRoundedIcon fontSize="small" />,
		title: "Discussions",
		description: "Vote and share your thoughts on trends.",
	},
];

export default function LoginContent() {
	const containerRef = useRef<HTMLDivElement>(null);
	const theme = useTheme();

	useGSAP(() => {
		if (containerRef.current) {
			gsap.fromTo(
				containerRef.current.children,
				{ y: 10, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power2.out" },
			);
		}
	}, []);

	return (
		<Stack spacing={4} ref={containerRef} sx={{ px: 2 }}>
			<Box>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
					<Box
						sx={{
							width: 40,
							height: 40,
							bgcolor: "primary.main",
							borderRadius: 1.5,
							display: "grid",
							placeItems: "center",
							color: "white",
							fontWeight: 700,
							fontSize: "1.2rem",
							boxShadow: theme.shadows[4],
						}}
					>
						<NewspaperIcon />
					</Box>
					<Typography variant="h4" fontWeight={800} letterSpacing="-0.5px">
						Newsly
					</Typography>
				</Box>
				<Typography variant="h6" color="text.secondary" fontWeight={400}>
					The front page of the future.
				</Typography>
			</Box>
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
