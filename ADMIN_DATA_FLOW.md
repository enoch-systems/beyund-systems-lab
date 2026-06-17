
# Admin Dashboard Data Flow

## Overview
The admin dashboard (`src/app/admin/page.tsx`) no longer calls the NestJS backend directly. It now uses internal Next.js API routes as a thin proxy layer.

## API Routes
- `GET /api/admin/students` — proxies to NestJS `/registrations`
- `GET /api/admin/payments/profiles` — derives payment profile status from registrations
- `POST /api/admin/payments` — proxies payment creation to NestJS `/registrations`

## Why
- Avoids missing/unsupported backend endpoints in the admin UI.
- Keeps Next.js and NestJS loosely coupled.
- Prevents build-time module resolution errors for missing Supabase/shared modules.

## Frontend Pages
- `src/app/admin/page.tsx` — main dashboard
- `src/app/admin/students/page.tsx` — students table with local state fallbacks
- `src/app/admin/payments/page.tsx` — payments UI backed by the API routes above


