import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
	Card,
	Typography,
	Box,
	IconButton,
	Chip,
	Stack,
	useTheme,
	alpha,
	Link,
	MuiLink,
	KeyboardArrowUp,
	ChatBubbleOutline,
} from "@/components/common/mui";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { Post } from "@/shared/types";
import { userQueryOptions } from "@/lib/api";
import { relativeTime } from "@/lib/utils";

export const PostCard = ({
	post,
	onUpvote,
}: {
	post: Post;
	onUpvote?: (id: number) => void;
}) => {
	const { data: user } = useQuery(userQueryOptions());
	const theme = useTheme();

	const containerRef = useRef<HTMLDivElement>(null);
	const upvoteBtnRef = useRef<HTMLButtonElement>(null);

	const { contextSafe } = useGSAP({ scope: containerRef });

	const handleUpvote = contextSafe((e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!user) return;

		onUpvote?.(post.id);

		if (upvoteBtnRef.current) {
			gsap
				.timeline()
				.to(upvoteBtnRef.current, { scale: 0.8, duration: 0.1 })
				.to(upvoteBtnRef.current, {
					scale: 1,
					duration: 0.4,
					ease: "elastic.out(1.5, 0.5)",
				});
		}
	});

	const getHostname = (url: string) => {
		try {
			return new URL(url).hostname.replace("www.", "");
		} catch {
			return url;
		}
	};

	return (
		<Card
			ref={containerRef}
			variant="outlined"
			sx={{
				display: "flex",
				p: { xs: 1.5, sm: 2 },
				gap: { xs: 1.5, sm: 2.5 },
				borderColor: "divider",
				backgroundColor: "background.paper",
				transition: "all 0.2s ease-in-out",
				"&:hover": {
					borderColor: "primary.main",
					boxShadow: theme.shadows[4],
					transform: "translateY(-1px)",
					backgroundColor: alpha(theme.palette.background.paper, 1),
				},
				borderRadius: 3,
				position: "relative",
			}}
		>
			<Stack
				direction="column"
				alignItems="center"
				justifyContent="flex-start"
				spacing={0.5}
				sx={{ minWidth: { xs: 40, sm: 48 }, pt: 0.5 }}
			>
				<IconButton
					ref={upvoteBtnRef}
					onClick={handleUpvote}
					disabled={!user}
					size="small"
					sx={{
						color: post.isUpvoted ? "primary.main" : "text.secondary",
						bgcolor: post.isUpvoted
							? alpha(theme.palette.primary.main, 0.1)
							: "transparent",
						transition: "all 0.2s",
						"&:hover": {
							bgcolor: alpha(theme.palette.primary.main, 0.15),
							color: "primary.main",
						},
					}}
				>
					<KeyboardArrowUp fontSize="medium" />
				</IconButton>

				<Typography
					variant="body2"
					fontWeight={700}
					color={post.isUpvoted ? "primary.main" : "text.primary"}
				>
					{post.points}
				</Typography>
			</Stack>
			<Box sx={{ flex: 1, minWidth: 0 }}>
				<Box sx={{ mb: 1 }}>
					{post.url ? (
						<MuiLink
							href={post.url}
							target="_blank"
							rel="noopener noreferrer"
							color="text.primary"
							underline="hover"
							sx={{
								fontWeight: 600,
								fontSize: { xs: "1rem", sm: "1.125rem" },
								lineHeight: 1.3,
								display: "inline-block",
								fontFamily: theme.typography.fontFamily,
							}}
						>
							{post.title}
						</MuiLink>
					) : (
						<Link
							to="/post"
							search={{ id: post.id }}
							style={{
								fontWeight: 600,
								fontSize: "1.125rem",
								color: theme.palette.text.primary,
								textDecoration: "none",
								lineHeight: 1.3,
							}}
						>
							{post.title}
						</Link>
					)}

					{post.url && (
						<Box
							component="span"
							sx={{ ml: 1, display: "inline-block", verticalAlign: "middle" }}
						>
							<Link to="/" search={{ site: post.url }}>
								<Chip
									label={getHostname(post.url)}
									size="small"
									variant="outlined"
									onClick={() => {}}
									sx={{
										height: 20,
										fontSize: "0.7rem",
										cursor: "pointer",
										maxWidth: 150,
										"&:hover": {
											color: "primary.main",
											borderColor: "primary.main",
											bgcolor: alpha(theme.palette.primary.main, 0.05),
										},
									}}
								/>
							</Link>
						</Box>
					)}
				</Box>
				{post.content && !post.url && (
					<Typography
						variant="body2"
						color="text.secondary"
						sx={{
							mb: 2,
							display: "-webkit-box",
							WebkitLineClamp: 2,
							WebkitBoxOrient: "vertical",
							overflow: "hidden",
						}}
					>
						{post.content}
					</Typography>
				)}
				<Stack
					direction="row"
					alignItems="center"
					spacing={1}
					flexWrap="wrap"
					sx={{ mt: 1 }}
				>
					<Typography variant="caption" color="text.secondary">
						by&nbsp;
						<Link
							to="/"
							search={{ author: post.author.id }}
							linkVariant="subtle"
						>
							{post.author.username}
						</Link>
					</Typography>

					<Typography variant="caption" color="text.disabled">
						•
					</Typography>

					<Typography variant="caption" color="text.secondary">
						{relativeTime(post.createdAt)}
					</Typography>

					<Typography variant="caption" color="text.disabled">
						•
					</Typography>
					<Link
						to="/post"
						search={{ id: post.id }}
						linkVariant="subtle"
						style={{ display: "flex", alignItems: "center", gap: 4 }}
					>
						<ChatBubbleOutline sx={{ fontSize: 14 }} />
						{post.commentCount} comments
					</Link>
				</Stack>
			</Box>
		</Card>
	);
};
