import { useState, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// UI Components
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
  alpha,
  Divider,
  ButtonLink,
} from "@/components/common/mui";

// Icons
import {
  Visibility,
  VisibilityOff,
  CheckCircle,
  Login,
} from "@mui/icons-material";

// Custom Components
import { enqueueSnackbar } from "@/components";

// Logic
import { loginSchema } from "@/shared/schemas";
import { postLogin } from "@/lib/api";
import { Route } from "@/routes/login";

const LoginForm = () => {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();
  const theme = useTheme();

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for Animation
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // GSAP: Subtle Entry
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power2.out" }
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
          enqueueSnackbar("Invalid format.", { variant: "error" });
          return;
        }

        const res = await postLogin(value.username, value.password);

        if (res.success) {
          enqueueSnackbar("Welcome back!", { variant: "success" });
          await queryClient.invalidateQueries({ queryKey: ["user"] });
          router.invalidate();
          await navigate({ to: search.redirect });
        } else {
          // Shake Animation on Error
          if (formRef.current) {
            gsap.to(formRef.current, {
              keyframes: { x: [-5, 5, -5, 5, 0] },
              duration: 0.4,
              ease: "power2.inOut",
            });
          }
          enqueueSnackbar(res.error || "Login failed.", { variant: "error" });
        }
      } catch (error) {
        enqueueSnackbar("Unexpected error.", { variant: "error" });
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
        boxShadow: theme.shadows[1], // Very subtle shadow
      }}
    >
      <Typography variant="h5" fontWeight={700} gutterBottom align="center">
        Sign in
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mb: 4 }}
      >
        Continue to Newsly
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
                  InputProps={{
                    endAdornment: isValid && (
                      <InputAdornment position="end">
                        <CheckCircle color="success" fontSize="small" />
                      </InputAdornment>
                    ),
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
                  InputProps={{
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
            startIcon={!isSubmitting && <Login />}
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
              "Sign In"
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
          Don't have an account?
        </Typography>
        <ButtonLink
          to="/signup"
          variant="text"
          color="primary"
          sx={{ fontWeight: 600 }}
        >
          Create account
        </ButtonLink>
      </Stack>
    </Card>
  );
};

export default LoginForm;
