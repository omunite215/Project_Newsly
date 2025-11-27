import { PostCard } from "@/components/PostCard";
import { getPost } from "@/lib/api";
import { useUpvoteComment, useUpvotePost } from "@/lib/api-hooks";
import { orderSchema, sortBySchema } from "@/shared/schemas";
import { Container } from "@mui/material";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import { z } from "zod";

const postSearchSchema = z.object({
  id: fallback(z.number(), 0).default(0),
  sortBy: fallback(sortBySchema, "points").default("points"),
  order: fallback(orderSchema, "desc").default("desc"),
});

const postQueryOptions = (id: number) =>
  queryOptions({
    queryKey: ["post", id],
    queryFn: () => getPost(id),
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
    throwOnError: true,
  });

export const Route = createFileRoute("/post")({
  component: Post,
  validateSearch: zodSearchValidator(postSearchSchema),
});

function Post() {
  const { id, sortBy, order } = Route.useSearch();
  const { data } = useSuspenseQuery(postQueryOptions(id));
  const upvotePost = useUpvotePost();
  const upvoteComment = useUpvoteComment();
  return (
    <Container sx={{ marginTop: 10 }}>
      {data && (
        <PostCard
          post={data.data}
          onUpvote={() => upvotePost.mutate(id.toString())}
        />
      )}
    </Container>
  );
}
