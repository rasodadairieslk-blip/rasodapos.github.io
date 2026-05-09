# Multi-Tenant Business Management

A full-stack multi-tenant business management web application built with Next.js 15, TypeScript, Tailwind CSS, and Supabase.

## Features

- Supabase Authentication with Admin/User roles
- Multi-tenant outlet isolation using `outlet_id`
- Row Level Security (RLS) policies
- Admin dashboard with user management and transaction controls
- User dashboard with transactions, profile page, and search
- Dark/light mode, responsive UI, and toast notifications
- CSV export and form validation with Zod + React Hook Form

## Setup

1. Copy `.env.local.example` to `.env.local`
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Install dependencies: `npm install`
4. Run locally: `npm run dev`

## Supabase

Apply the SQL schema from `supabase/schema.sql` in your Supabase project.

### How outlets and users work

- Each `outlet` is a tenant.
- Each `profile` belongs to one `outlet` via `outlet_id`.
- The `role` field in `profiles` should be `admin` or `user`.
- Transactions are stored in `transactions` and include `outlet_id`.
- Row Level Security (RLS) ensures users only see transactions for their own `outlet`.

### How to assign a user to an outlet

1. Create an `outlet` in Supabase:
   - `name`: outlet name,
   - `timezone`: e.g. `Asia/Colombo`.
2. Create the user in Supabase Auth.
3. Insert a row into `profiles` using the Auth user `id` and set `outlet_id` to the outlet created in step 1.
4. Set `role` to `admin` for outlet administrators or `user` for regular staff.

This means a single database can support many outlets. Each admin or user sees only the data for their outlet.

### Publishing and GitHub / Vercel setup

1. Push this repository to GitHub.
2. Create a Supabase project for production.
3. In GitHub or Vercel, set the environment variables from `.env.local.example`.
4. Deploy the app with `npm run build` and `npm start` or use Vercel auto-deploy.

### Important note

A shared database with RLS is the correct approach for multi-tenant apps. It is better than creating separate physical databases for each outlet because it:

- keeps schema updates simple,
- makes maintenance easier,
- still isolates data securely using RLS.

If you want separate admin dashboards for each outlet, use the same database but assign each admin user to the correct `outlet_id`.

### Super Admin panel

This app now has two separate login flows:

- POS login for regular admin and staff users: `/login`
- Superadmin login for global configuration: `/superadmin-login`

Superadmin credentials:

- username: `superadmin`
- password: `superadmin`

Use the superadmin login page to access the Super Admin panel at `/superadmin`.

The Super Admin panel is designed to help you:

- configure outlets
- manage users
- run schema and seed setup steps

This is a single-management entry point for all outlet and database configuration.
