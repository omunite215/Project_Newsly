import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Typography,
  Box,
  IconButton,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { KeyboardArrowUp } from "@mui/icons-material";

import { Post } from "@/shared/types";
import { userQueryOptions } from "@/lib/api";
import { relativeTime } from "@/lib/utils";

export const PostCard = ({
  post,
  onUpvote,
}: {
  post: Post;
  onUpvote?: (id: number) => void;
}) => {
  const { data: user } = useQuery(userQueryOptions());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleUpvote = () => {
    onUpvote?.(post.id);
  };

  const getHostname = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <Card
      sx={{
        display: "flex",
        p: 2,
        gap: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateY(-1px)",
        },
        flexDirection: isMobile ? "column" : "row",
        alignItems: isMobile ? "stretch" : "flex-start",
      }}
      elevation={1}
    >
      {/* Upvote Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          minWidth: 60,
          order: isMobile ? 2 : 1,
        }}
      >
        <IconButton
          onClick={handleUpvote}
          disabled={!user}
          sx={{
            color: post.isUpvoted ? "primary.main" : "text.secondary",
            backgroundColor: post.isUpvoted
              ? alpha(theme.palette.primary.main, 0.1)
              : "transparent",
            "&:hover:not(:disabled)": {
              backgroundColor: post.isUpvoted
                ? alpha(theme.palette.primary.main, 0.2)
                : "action.hover",
              transform: "scale(1.1)",
            },
            transition: "all 0.2s ease-in-out",
          }}
          size="small"
        >
          <KeyboardArrowUp />
        </IconButton>
        <Typography
          variant="h6"
          component="span"
          sx={{
            color: post.isUpvoted ? "primary.main" : "text.primary",
            fontWeight: 600,
            lineHeight: 1,
          }}
        >
          {post.points}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", textTransform: "uppercase" }}
        >
          Points
        </Typography>
      </Box>

      {/* Content Section */}
      <Box sx={{ flex: 1, order: isMobile ? 1 : 2, minWidth: 0 }}>
        {/* Title and URL */}
        <Box sx={{ mb: 1 }}>
          <Typography
            variant="h6"
            component={post.url ? "a" : Link}
            href={post.url}
            to={post.url ? undefined : "/"}
            sx={{
              color: "text.primary",
              textDecoration: "none",
              fontWeight: 600,
              lineHeight: 1.3,
              fontSize: isMobile ? "1.1rem" : "1.25rem",
              display: "block",
              mb: 1,
              "&:hover": {
                color: "primary.main",
                textDecoration: post.url ? "underline" : "none",
              },
              wordBreak: "break-word",
            }}
          >
            {post.title}
          </Typography>

          {post.url && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1,
              }}
            >
              <Link to="/" search={{ site: post.url }}>
                <Chip
                  label={getHostname(post.url)}
                  variant="outlined"
                  size="small"
                  clickable
                  sx={{
                    fontSize: "0.75rem",
                    height: 24,
                    textDecoration: "none",
                    "&:hover": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      textDecoration: "none",
                    },
                  }}
                />
              </Link>
            </Box>
          )}
        </Box>

        {/* Content */}
        {post.content && (
          <Typography
            variant="body2"
            sx={{
              color: "text.primary",
              mb: 2,
              lineHeight: 1.5,
              wordBreak: "break-word",
            }}
          >
            {post.content}
          </Typography>
        )}

        {/* Metadata */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            alignItems: "center",
            color: "text.secondary",
            fontSize: "0.75rem",
          }}
        >
          <Typography variant="caption" component="span">
            by&nbsp;
            <Link
              to="/"
              search={{ author: post.author.id }}
              style={{
                color: "inherit",
                textDecoration: "none",
              }}
              sx={{
                "&:hover": {
                  textDecoration: "underline",
                  color: "primary.main",
                },
              }}
            >
              {post.author.username}
            </Link>
          </Typography>

          <Typography variant="caption" component="span">
            ·
          </Typography>

          <Typography variant="caption" component="span">
            {relativeTime(post.createdAt)}
          </Typography>

          <Typography variant="caption" component="span">
            ·
          </Typography>

          <Link
            to="/post"
            search={{ id: post.id }}
            style={{
              color: "inherit",
              textDecoration: "none",
            }}
            sx={{
              "&:hover": {
                textDecoration: "underline",
                color: "primary.main",
              },
            }}
          >
            {post.commentCount} comments
          </Link>
        </Stack>
      </Box>
    </Card>
  );
};
