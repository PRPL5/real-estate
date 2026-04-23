# Northpoint Estates

Single-agent real estate platform built with Next.js 16, Prisma, SQLite, and a secure one-admin dashboard.

## Features

- Public website with Home, Listings, Listing Details, About Agent, and Contact pages
- Secure admin login for one real estate agent only
- Full CRUD workflow for listings
- Draft and published states
- Listing statuses: Available, Pending, Sold
- Multiple images per listing with cover image selection and manual ordering
- Seeded demo data for the agent and listings

## Stack

- Next.js 16 App Router
- React 19
- Prisma 7 with SQLite and `better-sqlite3`
- Tailwind CSS 4
- Server Actions for admin mutations

## Environment

Set your Supabase and Postgres values in `.env`.

- `POSTGRES_URL`: pooled runtime connection string
- `POSTGRES_URL_NON_POOLING`: direct connection string for admin tasks and seeding
- `POSTGRES_PRISMA_URL`: Prisma CLI connection string
- `SUPABASE_*`: optional frontend/backend Supabase keys if you add Supabase client features later

## Local Setup

```bash
npm install
npm run db:push
npm run db:seed
npm run dev
```

Open `http://localhost:3000`.

## Admin Login

- Email: `agent@northpoint.com`
- Password: `ChangeMe123!`

Change these in `.env` before using the project beyond local demo work.

## Database Commands

```bash
npm run db:push
npm run db:seed
```
