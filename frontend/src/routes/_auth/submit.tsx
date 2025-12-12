import { useRef } from "react";
import { postSubmit } from "@/lib/api";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import {
  createFileRoute,
  useBlocker,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// UI Components
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Container,
  Stack,
  CircularProgress,
  useTheme,
  InputAdornment,
  Divider,
} from "@/components/common/mui";

// Icons
import { 
  PostAdd, 
  Link as LinkIcon, 
  Description, 
  Title, 
  InfoOutlined 
} from "@mui/icons-material";

// Custom
import { enqueueSnackbar } from "@/components";

export const Route = createFileRoute("/_auth/submit")({
  component: Submit,
});

function Submit() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();
  const theme = useTheme();
  
  // Animation Ref
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance
  useGSAP(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }, []);

  const form = useForm({
    defaultValues: {
      title: "",
      content: "",
      url: "",
    },
    onSubmit: async ({ value }) => {
      // Basic Validation
      if (!value.title) {
         enqueueSnackbar("Title is required", { variant: "error" });
         return;
      }
      if (!value.url && !value.content) {
         enqueueSnackbar("Please provide either a URL or Text", { variant: "error" });
         return;
      }

      const res = await postSubmit(value.title, value.content, value.url);
      
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["posts"] });
        router.invalidate();
        // Reset form state to prevent blocker
        form.reset();
        await navigate({ to: "/post", search: { id: res.data.postId } });
      } else {
        if (!res.isFormError) {
          enqueueSnackbar("Failed to create post", { variant: "error" });
        }
      }
    },
  });

  const shouldBlock = form.state.isDirty && !form.state.isSubmitting;

  useBlocker({
    shouldBlockFn: () => {
      if (!shouldBlock || !window.confirm("Discard unsaved changes?")) {
        return false;
      }
      return true;
    },
  });

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        bgcolor: "background.default",
        py: { xs: 4, md: 8 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Container maxWidth="md">
        <Card
          ref={containerRef}
          variant="outlined"
          sx={{
            borderRadius: 3,
            boxShadow: theme.shadows[1],
            bgcolor: "background.paper",
            overflow: "visible", // For potential popovers
          }}
        >
          {/* Header Section */}
          <Box sx={{ p: 4, pb: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <Box 
                    sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: 'primary.main', 
                        borderRadius: 1.5,
                        display: 'grid',
                        placeItems: 'center',
                        color: 'white'
                    }}
                >
                    <PostAdd />
                </Box>
                <Typography variant="h5" fontWeight={700}>
                    Create Submission
                </Typography>
            </Stack>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            {/* Guidance Block */}
            <Alert 
                icon={<InfoOutlined fontSize="inherit" />} 
                severity="info" 
                variant="outlined"
                sx={{ mb: 4, borderRadius: 2 }}
            >
                <Typography variant="body2" fontWeight={500}>
                    Share a URL or start a discussion.
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    Leave URL blank to submit a question. If a URL is present, text is optional.
                </Typography>
            </Alert>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <Stack spacing={3}>
                
                {/* 1. TITLE */}
                <form.Field
                  name="title"
                  children={(field) => (
                    <TextField
                      label="Title"
                      variant="outlined"
                      fullWidth
                      required
                      placeholder="Show HN: My new project..."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Title color="action" />
                            </InputAdornment>
                        )
                      }}
                    />
                  )}
                />

                {/* 2. URL */}
                <form.Field
                  name="url"
                  children={(field) => (
                    <TextField
                      label="URL"
                      variant="outlined"
                      fullWidth
                      placeholder="https://example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LinkIcon color="action" />
                            </InputAdornment>
                        )
                      }}
                    />
                  )}
                />

                <Divider>
                    <Typography variant="caption" color="text.secondary">
                        OR / AND
                    </Typography>
                </Divider>

                {/* 3. CONTENT */}
                <form.Field
                  name="content"
                  children={(field) => (
                    <TextField
                      label="Text / Description"
                      variant="outlined"
                      fullWidth
                      multiline
                      rows={6}
                      placeholder="Enter description or question details..."
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      disabled={form.state.isSubmitting}
                      InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                                <Description color="action" />
                            </InputAdornment>
                        )
                      }}
                    />
                  )}
                />

                {/* 4. ACTIONS */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
                    <Button 
                        variant="text" 
                        color="inherit" 
                        onClick={() => navigate({ to: '/' })}
                        disabled={form.state.isSubmitting}
                        sx={{ borderRadius: 99 }}
                    >
                        Cancel
                    </Button>
                    <form.Subscribe
                      selector={(state) => [state.canSubmit, state.isSubmitting]}
                      children={([canSubmit, isSubmitting]) => (
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          disabled={!canSubmit}
                          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <PostAdd />}
                          sx={{
                            borderRadius: 99,
                            px: 4,
                            fontWeight: 600,
                            boxShadow: theme.shadows[2]
                          }}
                        >
                          {isSubmitting ? "Submitting..." : "Submit Post"}
                        </Button>
                      )}
                    />
                </Box>

              </Stack>
            </form>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}