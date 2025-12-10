import { useState } from "react";
import { useQuery, useSuspenseInfiniteQuery } from "@tanstack/react-query";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
  CircularProgress
} from "@/components/common/mui";
import {
  Add,
  Remove,
  KeyboardArrowUp,
  ChatBubbleOutline,
} from "@mui/icons-material";

import { Comment } from "@/shared/types";
import { getCommentComments, userQueryOptions } from "@/lib/api";
import { useUpvoteComment } from "@/lib/api-hooks";
import { relativeTime } from "@/lib/utils";
import CommentForm from "./CommentForm";

// Helper for fetching nested comments
const nestedCommentsQueryOptions = (commentId: number) => ({
    queryKey: ["comments", "comment", commentId],
    queryFn: ({ pageParam }: { pageParam: number }) => getCommentComments(commentId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any, lastPageParam: number) => {
      if (lastPage.pagination.totalPages <= lastPageParam) return undefined;
      return lastPageParam + 1;
    },
});

type CommentCardProps = {
  comment: Comment;
  depth: number;
  activeReplyId: number | null;
  setActiveReplyId: React.Dispatch<React.SetStateAction<number | null>>;
  isLast: boolean;
  toggleUpvote: ReturnType<typeof useUpvoteComment>["mutate"];
};

export function CommentCard({
  comment,
  depth,
  activeReplyId,
  setActiveReplyId,
  isLast,
  toggleUpvote,
}: CommentCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { data: user } = useQuery(userQueryOptions());

  // Only fetch children if not collapsed and has count
  const {
    data: comments,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    ...nestedCommentsQueryOptions(comment.id),
    // Pre-seed initial data if available from parent
    initialData: {
      pageParams: [1],
      pages: [{
          success: true,
          message: "Pre-loaded",
          data: comment.childComments ?? [],
          pagination: { page: 1, totalPages: Math.ceil(comment.commentCount / 2) }
      }]
    }
  });

  const isUpvoted = comment.commentUpvotes.length > 0;
  const isReplying = activeReplyId === comment.id;
  const isDraft = comment.id === -1;

  // Indentation Logic
  const indentSize = isMobile ? 12 : 24;
  const showGuideLine = depth > 0;

  return (
    <Box
      sx={{
        pl: depth > 0 ? `${indentSize}px` : 0,
        position: 'relative',
        opacity: isDraft ? 0.6 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Thread Guide Line */}
      {showGuideLine && (
          <Box 
            sx={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: '1px',
                bgcolor: theme.palette.divider,
                // On last item, stop line halfway so it looks like an "L"
                ...(isLast && { bottom: 'auto', height: '24px' })
            }}
          />
      )}

      <Box sx={{ py: 1.5 }}>
        {/* Header Row */}
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <IconButton 
                size="small" 
                onClick={() => setIsCollapsed(!isCollapsed)}
                sx={{ 
                    width: 20, 
                    height: 20, 
                    border: `1px solid ${theme.palette.divider}`,
                    p: 0
                }}
            >
                {isCollapsed ? <Add sx={{ fontSize: 14 }} /> : <Remove sx={{ fontSize: 14 }} />}
            </IconButton>

            <Typography variant="subtitle2" fontWeight={600} color="text.primary">
                {comment.author.username}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
                {relativeTime(comment.createdAt)}
            </Typography>
        </Stack>

        {!isCollapsed && (
            <Box sx={{ pl: isMobile ? 0 : 3.5 }}>
                <Typography variant="body2" color="text.primary" sx={{ mb: 1, whiteSpace: 'pre-wrap' }}>
                    {comment.content}
                </Typography>

                {/* Actions */}
                <Stack direction="row" spacing={2} alignItems="center">
                    <Button
                        size="small"
                        color={isUpvoted ? "primary" : "inherit"}
                        startIcon={<KeyboardArrowUp />}
                        onClick={() => toggleUpvote({
                            id: comment.id.toString(),
                            postId: comment.postId,
                            parentCommentId: comment.parentCommentId
                        })}
                        sx={{ 
                            textTransform: 'none', 
                            color: isUpvoted ? 'primary.main' : 'text.secondary',
                            minWidth: 'auto',
                            p: 0.5
                        }}
                    >
                        {comment.points}
                    </Button>

                    {user && (
                        <Button
                            size="small"
                            color="inherit"
                            startIcon={<ChatBubbleOutline sx={{ fontSize: 16 }} />}
                            onClick={() => setActiveReplyId(isReplying ? null : comment.id)}
                            sx={{ textTransform: 'none', color: 'text.secondary' }}
                        >
                            Reply
                        </Button>
                    )}
                </Stack>

                {/* Reply Form */}
                {isReplying && (
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <CommentForm 
                            id={comment.id} 
                            isParent 
                            onSuccess={() => setActiveReplyId(null)} 
                        />
                    </Box>
                )}
            </Box>
        )}
      </Box>

      {/* Nested Comments */}
      {!isCollapsed && (
          <Box>
              {comments.pages.map(page => 
                  page.data.map((child, idx) => (
                      <CommentCard
                          key={child.id}
                          comment={child}
                          depth={depth + 1}
                          activeReplyId={activeReplyId}
                          setActiveReplyId={setActiveReplyId}
                          isLast={idx === page.data.length - 1}
                          toggleUpvote={toggleUpvote}
                      />
                  ))
              )}
              
              {hasNextPage && (
                  <Button 
                    size="small" 
                    onClick={() => fetchNextPage()} 
                    disabled={isFetchingNextPage}
                    sx={{ ml: isMobile ? 2 : 4, mt: 1, textTransform: 'none' }}
                  >
                      {isFetchingNextPage ? "Loading..." : "View more replies"}
                  </Button>
              )}
          </Box>
      )}
    </Box>
  );
}