# Project Newzly

<img width="1905" height="902" alt="Light" src="https://github.com/user-attachments/assets/3f6019d0-d800-42fa-90cd-ba2de985b3a4" />
<img width="1906" height="911" alt="Dark" src="https://github.com/user-attachments/assets/e561d6df-1a2a-4477-84cc-db7b7a06db57" />

A Hackernews clone made using Google's Material UI Design System, built with Hono and React.

**Live demo:** _add your Render URL here_ (free tier: the first request after ~15 idle minutes takes about a minute to wake up)

What's new:
- Used latest features of modern React 19.
- Used latest backend framework Hono.
- Used Material UI: Google's standalone design system for consistent design.
- Used GSAP: A modern animation library for stunning smooth animations.
- Used Tanstack ecosystem: Tanstack Router and Tanstack Query for blazingly fast performance.
- Support Light, Dark and System Themes with switching animations.
- Responsive across all devices.
- Authentication with modern Lucia auth.
- Used Docker for PostgreSQL setup. File provided in the repo itself.
- TypeScript to ensure type safety.

## 🚀 Run locally

Requires [Bun](https://bun.sh) and Docker.

```bash
bun install && (cd frontend && bun install)
cp .env.example .env          # DATABASE_URL for the compose database
docker compose up -d db       # Postgres on localhost:5432
bun run db:migrate            # create tables
bun run dev                   # API on http://localhost:3000
cd frontend && bun run dev    # app on http://localhost:3001 (proxies /api)
```

Useful scripts: `bun run typecheck`, `bun run format:check`, `bun run db:generate` (after editing `server/db/schemas`).

## ☁️ Deploy for free (Render + Neon)

In production one Bun process serves both the API (`/api/*`) and the built React app, so auth cookies stay same-origin.

1. **Database: [Neon](https://neon.com) free plan.** Create a project in an **AWS** region. Neon doesn't pause or delete free projects for inactivity; the compute just sleeps after 5 idle minutes and wakes on the next query. Copy the **direct** (not pooled) connection string.
2. **App: [Render](https://render.com) free web service.** New → Blueprint → pick this repo. Render reads `render.yaml`, builds the `Dockerfile`, and asks for `DATABASE_URL`: paste the Neon string.
3. Done. Migrations run automatically on every start (`server/migrate.ts`), and Render health-checks `/api/health`.

Don't use Render's own free Postgres: it expires 30 days after creation.

## :star: Give A Star

You can also give this repository a star to show more people and they can use this repository.

## 🏠 Built With:

[![My Skills](https://skillicons.dev/icons?i=react,bun,materialui,postgres,postman,vscode,vite,docker,vercel)](https://skillicons.dev)

## 🛠 Skills

[![My Skills](https://skillicons.dev/icons?i=html,css,js,ts,git,vite,docker,postgres,vercel,github)](https://skillicons.dev)


## 🙋‍♂️ Connect With Me

[<img src="https://skillicons.dev/icons?i=github" />](https://github.com/omunite215)&nbsp;
[<img src="https://skillicons.dev/icons?i=linkedin" />](https://www.linkedin.com/in/om-patel-401068143/)&nbsp;
[<img src="https://skillicons.dev/icons?i=instagram" />](https://www.instagram.com/_21omp/)&nbsp;
[<img src="https://skillicons.dev/icons?i=devto" />](https://portfolio-jade-gamma-13.vercel.app/)


## 🗒️ Authors
- Om Patel

<p align="left">
  <a href="https://skillicons.dev">
    <a href="https://github.com/omunite215">
      <img src="https://skillicons.dev/icons?i=github" />
    </a>
  </a>
</p>

<p align="center">
  <img width="940" height="788" alt="final profile" src="https://github.com/user-attachments/assets/acfe8310-3cf4-44a1-b3e2-6f585af26643" />
</p>
