import { useState, useRef } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  infiniteQueryOptions,
  queryOptions,
  useQuery,
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Container,
  Skeleton,
  Stack,
  Divider,
} from "@/components/common/mui";

import { orderSchema, sortBySchema } from "@/shared/schemas";
import { getComments, getPost, userQueryOptions } from "@/lib/api";
import { useUpvotePost, useUpvoteComment } from "@/lib/api-hooks";
import { CommentCard, CommentForm, PostCard, SortBar } from "@/components";

// Schema
const postSearchSchema = z.object({
  id: fallback(z.number(), 0).default(0),
  sortBy: fallback(sortBySchema, "points").default("points"),
  order: fallback(orderSchema, "desc").default("desc"),
});

// Query Options
const postQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    staleTime: Number.POSITIVE_INFINITY,
  });

const commentsInfiniteQueryOptions = ({ id, sortBy, order }: z.infer<typeof postSearchSchema>) =>
  infiniteQueryOptions({
    queryKey: ["comments", "post", id, sortBy, order],
    queryFn: ({ pageParam }) => getComments(id, pageParam, 10, { sortBy, order }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.pagination.totalPages <= lastPageParam) return undefined;
      return lastPageParam + 1;
    },
  });

export const Route = createFileRoute("/post")({
  component: Post,
  validateSearch: zodSearchValidator(postSearchSchema),
  loaderDeps: ({ search }) => search,
  loader: async ({ context, deps }) => {
    // Prefetch logic preserved
    await Promise.all([
      context.queryClient.ensureQueryData(postQueryOptions(deps.id)),
      context.queryClient.ensureInfiniteQueryData(commentsInfiniteQueryOptions(deps)),
    ]);
  },
  // Add pending component for route transitions
  pendingComponent: () => <PostSkeleton />, 
});

function PostSkeleton() {
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
        <Card variant="outlined" sx={{ mb: 4, borderRadius: 3 }}>
            <CardContent>
                <Stack spacing={2}>
                    <Skeleton variant="text" width="80%" height={40} />
                    <Skeleton variant="text" width="60%" height={20} />
                    <Skeleton variant="rectangular" width="100%" height={100} sx={{ borderRadius: 1 }} />
                </Stack>
            </CardContent>
        </Card>
        <Stack spacing={3}>
            {[1, 2, 3].map((i) => (
                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="circular" width={32} height={32} />
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width="30%" />
                        <Skeleton variant="text" width="90%" />
                        <Skeleton variant="text" width="80%" />
                    </Box>
                </Box>
            ))}
        </Stack>
    </Container>
  );
}

function Post() {
  const { id, sortBy, order } = Route.useSearch();
  const [activeReplyId, setActiveReplyId] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Using Suspense Hooks
  const { data: postData } = useSuspenseQuery(postQueryOptions(id));
  const { data: user } = useQuery(userQueryOptions());
  
  const {
    data: comments,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(commentsInfiniteQueryOptions({ id, sortBy, order }));

  const upvotePost = useUpvotePost();
  const upvoteComment = useUpvoteComment();

  // GSAP: Smooth Entry
  useGSAP(() => {
    if (containerRef.current) {
        gsap.fromTo(containerRef.current.children, 
            { y: 10, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
        );
    }
  }, [id]); // Re-run on ID change

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box ref={containerRef}>
        
        {/* 1. Main Post */}
        {postData && (
          <Box sx={{ mb: 4 }}>
             <PostCard
                post={postData.data}
                onUpvote={() => upvotePost.mutate(id.toString())}
             />
          </Box>
        )}

        {/* 2. Controls & Form */}
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                <Typography variant="h6" fontWeight={700}>
                    {postData?.data.commentCount || 0} Comments
                </Typography>
                {comments && comments.pages[0].data.length > 0 && (
                    <SortBar sortBy={sortBy} order={order} />
                )}
            </Stack>

            {user && (
                <Card variant="outlined" sx={{ borderRadius: 2, mb: 3 }}>
                    <CardContent sx={{ p: 2, pb: '16px !important' }}>
                        <CommentForm id={id} onSuccess={() => {}} />
                    </CardContent>
                </Card>
            )}
        </Box>

        {/* 3. Comments List */}
        <Box>
            {comments.pages.map((page) => (
                <Box key={page.pagination.page}>
                    {page.data.map((comment, index) => (
                        <CommentCard
                            key={comment.id}
                            comment={comment}
                            depth={0}
                            activeReplyId={activeReplyId}
                            setActiveReplyId={setActiveReplyId}
                            isLast={index === page.data.length - 1}
                            toggleUpvote={upvoteComment.mutate}
                        />
                    ))}
                </Box>
            ))}

            {/* Load More */}
            {hasNextPage && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                    <Button
                        variant="outlined"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        startIcon={isFetchingNextPage ? <CircularProgress size={16} /> : <KeyboardArrowDown />}
                        sx={{ borderRadius: 99, textTransform: 'none' }}
                    >
                        {isFetchingNextPage ? "Loading more..." : "Load more comments"}
                    </Button>
                </Box>
            )}
            
            {!comments.pages[0].data.length && (
                <Typography color="text.secondary" align="center" py={4}>
                    No comments yet. Be the first to share your thoughts!
                </Typography>
            )}
        </Box>
      </Box>
    </Container>
  );
}