# Vercel Deployment Instructions

To host QA-Genie on Vercel for your team, follow these simple steps to transition the local SQLite database to a production PostgreSQL database.

## 1. Setup Vercel Postgres
1. Push this code to a GitHub repository.
2. Go to Vercel and create a new project from your repository.
3. In the Vercel Dashboard for your project, go to the **Storage** tab and create a new **Vercel Postgres** database.
4. Follow the prompts to link the database to your project. This will automatically populate the `POSTGRES_PRISMA_URL` environment variable in your Vercel settings.

## 2. Update Database Provider
Before deploying, change the database provider in your Prisma schema.

Open `prisma/schema.prisma` and change line 6:
**From:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**To:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
}
```

## 3. Deployment Configuration
1. In Vercel, go to Settings -> Environment Variables.
2. Add your authentication secrets:
   - `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`)
   - `NEXTAUTH_URL`: Your Vercel deployment URL (e.g., `https://qa-genie.vercel.app`)

Vercel will automatically run `npm run build` which will trigger Prisma to generate the client.

To run your initial database migrations on Vercel, you can add `npx prisma db push` to your build command in Vercel settings:
**Build Command:** `npx prisma db push --accept-data-loss && next build`
