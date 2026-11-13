# --- Build the React frontend -------------------------------------------
FROM oven/bun:1.3 AS build
WORKDIR /app

# Root deps are needed too: the frontend imports shared/ which uses zod + drizzle.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY frontend/package.json frontend/bun.lock ./frontend/
RUN cd frontend && bun install --frozen-lockfile

COPY . .
RUN cd frontend && bun run build

# --- Runtime: Hono API + static frontend on one port ---------------------
FROM oven/bun:1.3-slim
WORKDIR /app
ENV NODE_ENV=production

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

COPY server ./server
COPY shared ./shared
COPY drizzle ./drizzle
COPY --from=build /app/frontend/dist ./frontend/dist

# Bun listens on $PORT (Render sets it) and falls back to 3000.
EXPOSE 3000
CMD ["sh", "-c", "bun run server/migrate.ts && bun run server/index.ts"]
