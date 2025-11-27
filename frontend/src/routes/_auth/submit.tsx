import { postSubmit } from "@/lib/api";
import { createPostSchema } from "@/shared/schemas";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useBlocker,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { enqueueSnackbar } from "notistack";
import {
  Card,
  CardHeader,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

export const Route = createFileRoute("/_auth/submit")({
  component: Submit,
});

function Submit() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      url: "",
    },
    onSubmit: async ({ value }) => {
      const res = await postSubmit(value.title, value.content, value.url);
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        router.invalidate();
        await navigate({ to: "/post", search: { id: res.data.postId } });
        return;
      } else {
        if (!res.isFormError) {
          enqueueSnackbar("Failed to create post", {
            variant: "error",
            autoHideDuration: 3000,
          });
        }
      }
    },
  });

  const shouldBlock = form.state.isDirty && !form.state.isSubmitting;

  useBlocker({
    shouldBlockFn: () => {
      if (!shouldBlock || !window.confirm("Are you sure you want to leave?")) {
        return false;
      }
      return true;
    },
  });

  return (
    <Box 
      sx={{ 
        width: '100%',
        p: { xs: 1, sm: 2 },
        display: 'flex',
        justifyContent: 'center'
      }}
    >
      <Paper 
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '600px',
          mt: { xs: 2, sm: 4, md: 6 },
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Card sx={{ border: 'none', boxShadow: 'none' }}>
          <CardHeader
            title={
              <Typography 
                variant="h5" 
                component="h1" 
                fontWeight="600"
                color="text.primary"
              >
                Create New Post
              </Typography>
            }
            subheader={
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ mt: 1, lineHeight: 1.5 }}
              >
                Leave URL blank to submit a question for discussion. If there is no URL, 
                text will appear at the top of the thread. If there is a URL, text is optional.
              </Typography>
            }
            sx={{ 
              pb: 1,
              '& .MuiCardHeader-content': {
                width: '100%'
              }
            }}
          />
          
          <CardContent sx={{ pt: 0 }}>
            <Box 
              component="form" 
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}
            >
              {/* Title Field */}
              <form.Field
                name="title"
                children={(field) => (
                  <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : ''}
                    disabled={form.state.isSubmitting}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                      }
                    }}
                  />
                )}
              />

              {/* URL Field */}
              <form.Field
                name="url"
                children={(field) => (
                  <TextField
                    fullWidth
                    label="URL"
                    variant="outlined"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : ''}
                    disabled={form.state.isSubmitting}
                    placeholder="https://example.com"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                      }
                    }}
                  />
                )}
              />

              {/* Content Field */}
              <form.Field
                name="content"
                children={(field) => (
                  <TextField
                    fullWidth
                    label="Content"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    error={!!field.state.meta.errors.length}
                    helperText={field.state.meta.errors.length ? field.state.meta.errors.join(', ') : ''}
                    disabled={form.state.isSubmitting}
                    placeholder={
                      field.state.value === "" 
                        ? 'Share your question or discussion topic...' 
                        : 'Add additional context...'
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                      }
                    }}
                  />
                )}
              />

              {/* Submit Error */}
              <form.Subscribe
                selector={(state) => [state.errorMap]}
                children={([errorMap]) =>
                  errorMap.onSubmit ? (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        borderRadius: 1,
                        '& .MuiAlert-message': {
                          width: '100%'
                        }
                      }}
                    >
                    </Alert>
                  ) : null
                }
              />

              {/* Submit Button */}
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={!canSubmit}
                    sx={{
                      py: 1.5,
                      borderRadius: 1,
                      fontSize: '1rem',
                      fontWeight: '600',
                      textTransform: 'none',
                      boxShadow: 2,
                      '&:hover': {
                        boxShadow: 4,
                      },
                      '&:disabled': {
                        opacity: 0.6,
                      }
                    }}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={20} color="inherit" />
                      ) : null
                    }
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                )}
              />
            </Box>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
}