import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  SnackbarCloseReason,
} from "@mui/material";
import { Visibility, VisibilityOff, CheckCircle } from "@mui/icons-material";
import { loginSchema } from "@/shared/schemas";
import { postLogin, postSignUp } from "@/lib/api";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Route } from "@/routes/login"; // Adjust import path as needed
import { CustomButtonLink } from "../ui/CustomLink";

const LoginForm = () => {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showPassword, setShowPassword] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // ✅ store backend error
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setIsError(false);
      setErrorMessage("");

      try {
        console.log("Form submitted with values:", value);

        // Validate with loginSchema
        const validationResult = loginSchema.safeParse(value);
        if (!validationResult.success) {
          setIsError(true);
          setErrorMessage("Invalid username or password format.");
          return;
        }

        // Simulate API call - replace with your actual API call
        const res = await postLogin(value.username, value.password);
        console.log("API response:", res);

        if (res.success) {
          setShowSuccess(true);
          await queryClient.invalidateQueries({ queryKey: ["user"] });
          router.invalidate();
          await navigate({ to: search.redirect });
        } else {
          // ✅ Display backend-provided message if available
          setErrorMessage(res.error || "Login failed. Please try again.");
          setIsError(true);
        }
      } catch (error) {
        console.error("Submission error:", error);

        // ✅ Extract message from backend or fallback
        const backendMessage =
          (error as Error).message ||
          "Unexpected error occurred. Please try again.";
        setErrorMessage(backendMessage);
        setIsError(true);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") return;
    setIsError(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  const getValidationError = (
    fieldName: "username" | "password",
    value: string
  ) => {
    const result = loginSchema.shape[fieldName].safeParse(value);
    if (!result.success) {
      const errors = result.error.issues;
      return errors[0]?.message || `Invalid ${fieldName}`;
    }
    return undefined;
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 3, sm: 4 },
        maxWidth: 400,
        width: "100%",
        borderRadius: 2,
        alignSelf: "center",
      }}
    >
      <Typography
        variant="h5"
        component="h1"
        gutterBottom
        fontWeight="500"
        align="center"
      >
        Login
      </Typography>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        noValidate
      >
        {/* Username Field */}
        <Box mb={2}>
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => getValidationError("username", value),
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              const isTouched = field.state.meta.isTouched;
              const isValid =
                isTouched && !hasError && field.state.value.length > 0;

              return (
                <TextField
                  fullWidth
                  margin="normal"
                  label="Username"
                  variant="outlined"
                  color={isValid ? "success" : "primary"}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={hasError && isTouched}
                  helperText={
                    isTouched ? field.state.meta.errors[0] || " " : " "
                  }
                  placeholder="Enter your username"
                  disabled={isSubmitting}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        {isValid && (
                          <CheckCircle color="success" sx={{ mr: 1 }} />
                        )}
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: isValid ? "success.main" : undefined,
                      },
                    },
                  }}
                />
              );
            }}
          </form.Field>
        </Box>

        {/* Password Field */}
        <Box mb={3}>
          <form.Field
            name="password"
            validators={{
              onChange: ({ value }) => getValidationError("password", value),
            }}
          >
            {(field) => {
              const hasError = field.state.meta.errors.length > 0;
              const isTouched = field.state.meta.isTouched;
              const isValid =
                isTouched && !hasError && field.state.value.length > 0;

              return (
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  color={isValid ? "success" : "primary"}
                  type={showPassword ? "text" : "password"}
                  margin="normal"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  error={hasError && isTouched}
                  helperText={
                    isTouched ? field.state.meta.errors[0] || " " : " "
                  }
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          {isValid && (
                            <CheckCircle color="success" sx={{ mr: 1 }} />
                          )}
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            disabled={isSubmitting}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: isValid ? "success.main" : undefined,
                      },
                    },
                  }}
                />
              );
            }}
          </form.Field>
        </Box>

        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={isSubmitting}
          sx={{
            mt: 2,
            py: 1.5,
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: "1rem",
          }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : "Login"}
        </Button>
      </form>
      <Box
        sx={{
          mt: 6,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        <Typography>Don&apos;t have an account ? </Typography>
        <CustomButtonLink
          color="secondary"
          varaint="text"
          size="large"
          to="/signup"
        >
          Click Here
        </CustomButtonLink>
      </Box>

      <Snackbar
        open={isError}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage || "An unexpected error occurred."}
        </Alert>
      </Snackbar>

      <Snackbar
        open={showSuccess}
        autoHideDuration={5000}
        onClose={handleSuccessClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Login successful! Redirecting...
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LoginForm;
