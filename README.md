# NoticeHub

A Notice Board built for the Reno Platforms Web Development Internship assignment. Full create, read, update and delete on notices, with Urgent items always sorted above Normal ones directly in the database query.

## Tech Stack

- **Framework:** Next.js 14 (Pages Router)
- **Database access:** Prisma
- **Database:** MySQL (any hosted free tier - TiDB Cloud Serverless recommended; Postgres on Neon/Supabase also works with a one-line `provider` change in `schema.prisma`)
- **Styling:** Tailwind CSS
- **Validation:** Zod, enforced server-side inside the API routes
- **Hosting:** Vercel (Hobby/free tier)

## Features

- Responsive notice board (phone and desktop) showing all notices as cards
- Create / Edit notice via one shared form, pre-filled on edit
- Delete with a required confirmation modal
- Urgent notices always appear above Normal ones, sorted via Prisma's `orderBy`, with a visible red "Urgent" badge
- All writes go through `pages/api/notices`, with correct HTTP verbs and status codes
- Server-side validation (required fields, valid enum values, valid date) independent of the browser
- Optional image upload on a notice (bonus)

## Running Locally

1. Clone the repository and install dependencies:
   ```
   git clone <your-repo-url>
   cd noticehub
   npm install
   ```
2. Copy the environment file and fill in your database connection string:
   ```
   cp .env.example .env
   ```
   Set `DATABASE_URL` to a hosted MySQL instance (see "Database Setup" below).
3. Push the schema and seed demo data:
   ```
   npx prisma migrate dev --name init
   npm run seed
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
   Open http://localhost:3000.

## Database Setup (Free Hosted MySQL)

A local SQLite file will **not** work on Vercel - its filesystem resets on every deploy and all data is lost. Use a free hosted database instead:

1. Create a free cluster on [TiDB Cloud Serverless](https://tidbcloud.com) (MySQL-compatible) - or Neon/Supabase if you prefer Postgres (change `provider = "mysql"` to `"postgresql"` in `prisma/schema.prisma`).
2. Copy the connection string it gives you into `DATABASE_URL` in your `.env`.
3. Run `npx prisma migrate dev --name init` to create the tables.

## Deploying to Vercel

1. Push this repository to a public GitHub repo.
2. Import the repo into [Vercel](https://vercel.com) (Hobby/free tier).
3. Add `DATABASE_URL` as an environment variable in the Vercel project settings (never commit it to git).
4. Vercel will run `npm run build`, which runs `prisma generate` automatically via the `postinstall` script, then builds the app.
5. After the first deploy, run `npx prisma migrate deploy` (locally, pointed at the production `DATABASE_URL`, or via a one-off Vercel CLI command) so the production database has the schema.
6. Optionally run `npm run seed` against production once, to populate demo notices for reviewers.

## What I Would Improve With More Time

Add authentication and role-based access (Staff vs read-only Viewer) so Edit/Delete is restricted server-side per user, rather than open to anyone with the URL; add search/filter controls above the board; and move image storage to a proper object store (e.g. Vercel Blob) instead of inline data URLs, which don't scale well for larger images.

## Where and How AI Was Used

AI assistance was used to scaffold the Next.js project structure, generate the Prisma schema, write the API route boilerplate (validation wiring, status codes), and draft the Tailwind component styling. The Urgent-first ordering logic, the validation rules, and the overall architecture were reviewed and adjusted by hand to match the assignment's exact requirements. The schema, ordering query, and validation logic were each tested directly against a real MySQL instance before submission.
