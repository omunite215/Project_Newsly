import { useCreateComment } from "@/lib/api-hooks";
import { useForm } from "@tanstack/react-form";
import { enqueueSnackbar } from "notistack";
import { 
    Box, 
    TextField, 
    Button, 
    Alert, 
    Stack, 
    CircularProgress 
} from "@/components/common/mui";

const CommentForm = ({
  id,
  isParent,
  onSuccess,
}: {
  id: number;
  isParent?: boolean;
  onSuccess: () => void;
}) => {
  const createComment = useCreateComment();
  
  const form = useForm({
    defaultValues: { content: "" },
    onSubmit: async ({ value }) => {
      if (!value.content.trim()) return;

      await createComment.mutateAsync(
        {
          id,
          content: value.content,
          isParent: !!isParent,
        },
        {
          onSuccess: (data) => {
            if (!data.success) {
              if (!data.isFormError) {
                enqueueSnackbar(data.error, { variant: "error" });
              }
              throw new Error(data.error);
            } else {
              form.reset();
              onSuccess?.();
            }
          },
        }
      );
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Stack spacing={2} alignItems="flex-end">
        <form.Field
          name="content"
          children={(field) => (
            <TextField
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.currentTarget.value)}
                placeholder={isParent ? "Write a reply..." : "What are your thoughts?"}
                multiline
                rows={isParent ? 2 : 4} // Smaller if it's a nested reply
                fullWidth
                variant="outlined"
                disabled={form.state.isSubmitting}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        bgcolor: 'background.paper'
                    }
                }}
            />
          )}
        />

        <form.Subscribe
          selector={(state) => [state.errorMap, state.canSubmit, state.isSubmitting]}
          children={([errorMap, canSubmit, isSubmitting]) => (
            <>
                {errorMap.onSubmit && (
                    <Alert severity="error" sx={{ width: '100%', py: 0 }}>
                        {errorMap.onSubmit.toString()}
                    </Alert>
                )}
                
                <Button
                    type="submit"
                    variant="contained"
                    disabled={!canSubmit || isSubmitting}
                    sx={{ 
                        borderRadius: 99, 
                        px: 3,
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    {isSubmitting ? <CircularProgress size={20} color="inherit" /> : "Comment"}
                </Button>
            </>
          )}
        />
      </Stack>
    </form>
  );
};

export default CommentForm;