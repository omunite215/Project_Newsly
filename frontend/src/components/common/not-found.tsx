import type { NotFoundRouteProps } from "@tanstack/react-router";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
	Box,
	Typography,
	Container,
	useTheme,
	ButtonLink,
	Home,
} from "@/components/common/mui";

const NotFound = (props: NotFoundRouteProps) => {
	const theme = useTheme();
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	useGSAP(() => {
		const tl = gsap.timeline();

		// Float animation for the 404 image
		if (imageRef.current) {
			gsap.to(imageRef.current, {
				y: -15,
				duration: 2,
				repeat: -1,
				yoyo: true,
				ease: "sine.inOut",
			});

			tl.from(imageRef.current, {
				scale: 0,
				opacity: 0,
				duration: 0.8,
				ease: "back.out(1.7)",
			});
		}

		if (containerRef.current) {
			tl.from(
				containerRef.current.children,
				{
					y: 30,
					opacity: 0,
					duration: 0.6,
					stagger: 0.1,
					ease: "power2.out",
				},
				"-=0.4",
			);
		}
	}, []);

	return (
		<Container maxWidth="sm">
			<Box
				ref={containerRef}
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					minHeight: "100vh",
					textAlign: "center",
					py: 4,
				}}
			>
				<Box
					component="img"
					ref={imageRef}
					src="/illustrations/not-found.svg"
					height={250}
					width={250}
					loading="eager"
					alt="404 Page Not Found"
					sx={{ mb: 4 }}
				/>

				<Typography
					variant="h2"
					fontWeight={800}
					sx={{
						color: theme.palette.primary.main,
						mb: 1,
					}}
				>
					404
				</Typography>

				<Typography variant="h5" fontWeight={600} gutterBottom>
					Page not found
				</Typography>

				<Typography
					variant="body1"
					color="text.secondary"
					sx={{ mb: 5, maxWidth: 400 }}
				>
					Sorry, the page you are looking for doesn't exist or has been moved.
				</Typography>

				<ButtonLink
					to="/"
					variant="contained"
					size="large"
					iconStart={<Home />}
					sx={{
						borderRadius: 99,
						px: 5,
						py: 1.5,
						boxShadow: theme.shadows[6],
					}}
				>
					Back to Home
				</ButtonLink>
			</Box>
		</Container>
	);
};

export default NotFound;
