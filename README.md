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
