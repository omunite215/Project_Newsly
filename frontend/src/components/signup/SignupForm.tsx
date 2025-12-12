import { useState, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import {
	TextField,
	Button,
	Box,
	Typography,
	Card,
	InputAdornment,
	IconButton,
	CircularProgress,
	Stack,
	useTheme,
	Divider,
	ButtonLink,
	Visibility,
	VisibilityOff,
	CheckCircle,
	PersonAdd,
} from "@/components/common/mui";

// Custom Components
import { enqueueSnackbar } from "@/components";

// Logic
import { loginSchema } from "@/shared/schemas";
import { postSignUp } from "@/lib/api";
import { Route } from "@/routes/signup";

const SignupForm = () => {
	const search = Route.useSearch();
	const navigate = useNavigate();
	const router = useRouter();
	const queryClient = useQueryClient();
	const theme = useTheme();

	const [showPassword, setShowPassword] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const formRef = useRef<HTMLFormElement>(null);

	// GSAP Entry
	useGSAP(() => {
		if (containerRef.current) {
			gsap.fromTo(
				containerRef.current,
				{ y: 20, opacity: 0 },
				{ y: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
			);
		}
	}, []);

	const form = useForm({
		defaultValues: { username: "", password: "" },
		onSubmit: async ({ value }) => {
			setIsSubmitting(true);
			try {
				const validation = loginSchema.safeParse(value);
				if (!validation.success) {
					enqueueSnackbar("Invalid username or password format.", {
						variant: "error",
					});
					return;
				}

				const res = await postSignUp(value.username, value.password);

				if (res.success) {
					enqueueSnackbar("Account created! Redirecting...", {
						variant: "success",
					});
					await queryClient.invalidateQueries({ queryKey: ["user"] });
					router.invalidate();
					await navigate({ to: search.redirect });
				} else {
					// Shake on error
					if (formRef.current) {
						gsap.to(formRef.current, {
							keyframes: { x: [-5, 5, -5, 5, 0] },
							duration: 0.4,
							ease: "power2.inOut",
						});
					}
					enqueueSnackbar(res.error || "Signup failed.", { variant: "error" });
				}
			} catch (error) {
				enqueueSnackbar("Unexpected error occurred.", { variant: "error" });
			} finally {
				setIsSubmitting(false);
			}
		},
	});

	const getValidationError = (field: "username" | "password", val: string) => {
		const res = loginSchema.shape[field].safeParse(val);
		return !res.success ? res.error.issues[0]?.message : undefined;
	};

	return (
		<Card
			ref={containerRef}
			variant="outlined"
			sx={{
				p: { xs: 3, sm: 4 },
				width: "100%",
				borderRadius: 3,
				borderColor: "divider",
				backgroundColor: "background.paper",
				boxShadow: theme.shadows[1],
			}}
		>
			<Typography variant="h5" fontWeight={700} gutterBottom align="center">
				Create Account
			</Typography>
			<Typography
				variant="body2"
				color="text.secondary"
				align="center"
				sx={{ mb: 4 }}
			>
				Join the Newsly community today
			</Typography>

			<form
				ref={formRef}
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<Stack spacing={3}>
					{/* USERNAME */}
					<form.Field
						name="username"
						validators={{
							onChange: ({ value }) => getValidationError("username", value),
						}}
					>
						{(field) => {
							const hasError = field.state.meta.errors.length > 0;
							const isValid =
								!hasError &&
								field.state.meta.isTouched &&
								field.state.value.length > 0;

							return (
								<TextField
									label="Username"
									fullWidth
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									error={hasError}
									helperText={hasError ? field.state.meta.errors[0] : ""}
									disabled={isSubmitting}
									slotProps={{
										input: {
											endAdornment: isValid && (
												<InputAdornment position="end">
													<CheckCircle color="success" fontSize="small" />
												</InputAdornment>
											),
										},
									}}
								/>
							);
						}}
					</form.Field>

					{/* PASSWORD */}
					<form.Field
						name="password"
						validators={{
							onChange: ({ value }) => getValidationError("password", value),
						}}
					>
						{(field) => {
							const hasError = field.state.meta.errors.length > 0;

							return (
								<TextField
									label="Password"
									type={showPassword ? "text" : "password"}
									fullWidth
									value={field.state.value}
									onChange={(e) => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
									error={hasError}
									helperText={hasError ? field.state.meta.errors[0] : ""}
									disabled={isSubmitting}
									slotProps={{
										input: {
											endAdornment: (
												<InputAdornment position="end">
													<IconButton
														onClick={() => setShowPassword(!showPassword)}
														edge="end"
														disabled={isSubmitting}
													>
														{showPassword ? <VisibilityOff /> : <Visibility />}
													</IconButton>
												</InputAdornment>
											),
										},
									}}
								/>
							);
						}}
					</form.Field>

					<Button
						type="submit"
						variant="contained"
						size="large"
						fullWidth
						disabled={isSubmitting}
						startIcon={!isSubmitting && <PersonAdd />}
						sx={{
							mt: 1,
							py: 1.5,
							borderRadius: 99,
							fontWeight: 600,
						}}
					>
						{isSubmitting ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							"Sign Up"
						)}
					</Button>
				</Stack>
			</form>

			<Box sx={{ my: 3 }}>
				<Divider>
					<Typography variant="caption" color="text.secondary">
						OR
					</Typography>
				</Divider>
			</Box>

			<Stack
				direction="row"
				alignItems="center"
				justifyContent="center"
				spacing={0.5}
			>
				<Typography variant="body2" color="text.secondary">
					Already have an account?
				</Typography>
				<ButtonLink
					to="/login"
					variant="text"
					color="primary"
					sx={{ fontWeight: 600 }}
				>
					Sign in
				</ButtonLink>
			</Stack>
		</Card>
	);
};

export default SignupForm;
