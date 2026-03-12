# AI Influencer Creator Platform

SaaS platform for creating and managing AI Influencers.

## Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + DB + Storage)
- React Router v6
- Framer Motion

## Setup
1. Clone the repo
2. `npm install`
3. Copy `.env.example` to `.env` and fill in your Supabase credentials
4. Run the migration in `supabase/migrations/001_initial_schema.sql` on your Supabase project
5. `npm run dev`

## Deploy
Vercel — connect this repo and set the env vars.
