import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";
import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from "@tanstack/react-query";
import { getPosts } from "@/lib/api";
import { Box, Button, Stack, Typography } from "@mui/material";
import SortBar from "@/components/SortBar";
import { PostCard } from "@/components/PostCard";
import { useUpvotePost } from "@/lib/api-hooks";

const homeSearchSchema = z.object({
  sortBy: z
    .enum(["points", "recent"])
    .optional()
    .default("recent")
    .catch("points"),
  order: z.enum(["asc", "desc"]).optional().default("desc").catch("desc"),
  author: z.optional(fallback(z.string(), "")),
  site: z.optional(fallback(z.string(), "")),
});

const postsInfiniteQueryOptions = ({
  sortBy,
  order,
  author,
  site,
}: z.infer<typeof homeSearchSchema>) =>
  infiniteQueryOptions({
    queryKey: ["posts", sortBy, order, author, site],
    queryFn: ({ pageParam }) =>
      getPosts({
        pageParam,
        pagination: {
          sortBy,
          order,
          author,
          site,
        },
      }),
    initialPageParam: 1,
    staleTime: Number.POSITIVE_INFINITY,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage <= lastPageParam) {
        return undefined;
      }
      return lastPageParam + 1;
    },
  });

export const Route = createFileRoute("/")({
  component: HomeComponent,
  validateSearch: zodSearchValidator(homeSearchSchema),
  loaderDeps: ({ search }) => ({
    sortBy: search.sortBy,
    order: search.order,
    author: search.author,
    site: search.site,
  }),
  loader: ({ context, deps: { sortBy, order, author, site } }) => {
    context.queryClient.ensureInfiniteQueryData(
      postsInfiniteQueryOptions({ sortBy, order, author, site })
    );
  },
});

function HomeComponent() {
  const { sortBy, order, author, site } = Route.useSearch();
  const { data, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useSuspenseInfiniteQuery(
      postsInfiniteQueryOptions({ sortBy, order, author, site })
    );
  const upvoteMutation = useUpvotePost();
  return (
    <>
      <Typography variant="h2" gutterBottom sx={{ marginTop: 10 }}>
        Submissions
      </Typography>
      <SortBar sortBy={sortBy} order={order} />
      <Stack spacing={2}>
        {data?.pages.map((page) =>
          page.data.map((post) => (
            <PostCard
              post={post}
              key={post.id}
              onUpvote={() => upvoteMutation.mutate(post.id.toString())}
            />
          ))
        )}
      </Stack>
      <Box sx={{ mt: "1.5rem" }}>
        <Button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
              ? "Load more"
              : "Nothing more"}
        </Button>
      </Box>
    </>
  );
}
