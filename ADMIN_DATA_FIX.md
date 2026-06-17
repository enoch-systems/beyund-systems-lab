# Admin Dashboard Student Count Fix

## Issue
The admin dashboard was showing a non-zero default student count when the backend had no registration records.

## Fix
- Explicitly initialize `students` to `[]` and `prevTotal` to `0`.
- Ensure dashboard KPIs derive counts strictly from `students.length`.
- Verified `/api/admin/students` returns `[]` when backend has no data.

## Behavior
- When no registrations exist, dashboard shows 0 Students, 0 Enrolled, 0 Pending, etc.
- When registrations exist, counts reflect actual data from NestJS `/registrations`.

## Commands
- Start backend: `cd backend && npm run start:dev`
- Start frontend: `npm run dev`
- Visit: `http://localhost:3000/admin`