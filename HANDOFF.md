# VelocityX Project Handoff

## Project Overview

**VelocityX** is a fullstack Next.js 16 booking website for a premium mobile auto detailing business. Users must log in to access the site and book appointments. Admins manage time slots via a separate admin panel.

Live URL: `https://carwebsite-coral.vercel.app`
Repo: `C:\Users\user\Documents\GitHub\CarWebsite`
Branch: `main`

---

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Database | Supabase Postgres via Prisma 7.8 + `@prisma/adapter-pg` |
| Auth | Supabase Auth (`@supabase/ssr`) |
| ORM | Prisma 7.8 with `prisma.config.ts` for migration URL |
| Styling | Plain CSS with CSS variables (no Tailwind) |
| Caching / Rate Limiting | Redis via `ioredis` + `express-rate-limit` |
| Deployment | Vercel (auto-deploy on push to `main`) |
| Icons | Lucide React |
| Fonts | Bebas Neue (display), Jost (body) via Google Fonts |

---

## Architecture

```
app/
  page.tsx              — Home page (server component, passes user to Nav)
  login/page.tsx        — Login/signup gate (client, force-dynamic)
  account/page.tsx      — User account dashboard (client, force-dynamic)
  admin/page.tsx        — Admin panel (Supabase Auth, ADMIN_EMAIL env var gates access)
  api/
    bookings/route.ts   — POST new booking (auth required, pulls name/phone from user_metadata)
    slots/route.ts      — GET available slots for a date
    user/
      bookings/route.ts         — GET user's bookings
      bookings/[id]/route.ts    — PATCH edit / DELETE cancel booking
    admin/
      login/route.ts    — Admin sign in
      logout/route.ts   — Admin sign out
      slots/route.ts    — Admin CRUD time slots
      slots/[id]/route.ts

components/
  Nav.tsx       — Accepts user prop; shows first name → /account link when logged in
  Booking.tsx   — Booking form; lazy slot loading on focus; no name/phone fields
  Hero.tsx, About.tsx, Services.tsx, Fleet.tsx, WhatYouGet.tsx, Reviews.tsx, BeforeAfter.tsx, Footer.tsx

lib/
  supabase.ts   — createSupabaseServerClient() and getSupabaseAdmin() (lazy singleton)
  redis.ts      — ioredis singleton (silent on connection failure)
  validations.ts — Zod schemas: bookingCreateSchema, bookingUpdateSchema, userSignupSchema, userLoginSchema
  generated/prisma/ — Prisma client output directory

services/
  bookingService.ts — createBooking(), domain service

prisma/
  schema.prisma   — Booking + TimeSlot models
  config.ts       — prisma.config.ts (migration directUrl)
  migrations/     — tracked in git

proxy.ts          — Next.js middleware (renamed from middleware.ts); enforces session + access token
supabase/
  setup.sql       — RLS policies (must be run in Supabase SQL Editor)
```

---

## Key Technical Decisions

### Prisma 7.8 + Supabase Postgres
- `schema.prisma` has NO `url`/`directUrl` fields — connection is configured via `prisma.config.ts`
- Requires `@prisma/adapter-pg` and a `pg.Pool` instance
- Build script: `"build": "prisma generate && next build"` (Prisma client not committed to git)

### Auth Pattern
- **Users**: Supabase Auth email/password. `full_name` and `phone` stored in `user.user_metadata` at signup.
- **Admins**: Same Supabase Auth but gated by `ADMIN_EMAIL` env var check.
- **Never both Auth0 and Supabase** — Supabase Auth is the sole provider.

### Middleware (`proxy.ts`)
- Exported as `export async function proxy` with `export const config` (Next.js 16 naming)
- Localhost always bypasses all checks (safe for local dev without env vars)
- Non-localhost: checks `ACCESS_TOKEN` cookie, then enforces Supabase session
- Exempt paths: `/login`, `/admin`, `/api/admin/*`
- If `SUPABASE_URL`/`SUPABASE_ANON_KEY` not set → allows all traffic (graceful local dev)

### Supabase Client Initialization
- **Server**: `createSupabaseServerClient()` in `lib/supabase.ts` — uses `cookies()` from `next/headers`
- **Middleware**: inlines `createServerClient` directly (cannot import from `lib/supabase.ts` — `next/headers` is not Edge-compatible)
- **Client (browser)**: `getSupabase()` lazy factory in `app/login/page.tsx` and `app/account/page.tsx` — NOT module-level; avoids SSR prerender failure
- Both client pages have `export const dynamic = 'force-dynamic'`

### Booking Form
- Name and phone removed — pulled from `user.user_metadata` server-side when booking is submitted
- Time slots lazy-load on `onFocus` of the slot dropdown (not on date change)
- `slotsFetched` flag prevents re-fetching on subsequent focuses

### Redis
- Singleton client in `lib/redis.ts`; connection errors are silent (no terminal noise)
- Rate limiting: `express-rate-limit` + `rate-limit-redis` on API routes

---

## Database Schema

```prisma
model TimeSlot {
  id        Int      @id @default(autoincrement())
  date      String
  time      String
  isBooked  Boolean  @default(false)
  booking   Booking?
}

model Booking {
  id          Int      @id @default(autoincrement())
  userId      String?
  name        String
  phone       String
  vehicleType String
  service     String
  addOns      String   @default("")
  message     String   @default("")
  slotId      Int      @unique
  slot        TimeSlot @relation(fields: [slotId], references: [id])
  createdAt   DateTime @default(now())
}
```

Migration `20260612062755_add_user_id_to_booking` adds `userId String?` to Booking.

---

## RLS Policies (supabase/setup.sql)

Must be run in Supabase SQL Editor:
- `TimeSlot`: public read, service_role write only
- `Booking`: authenticated insert; user-scoped select/update/delete via `auth.uid()::text = "userId"`; service_role full access

---

## Environment Variables

### Local `.env` (currently only has DATABASE_URL, DIRECT_URL, ACCESS_TOKEN)

**Missing — add these:**
```
SUPABASE_URL=https://vatnnzpnobvelupfpdse.supabase.co
SUPABASE_ANON_KEY=<Supabase dashboard → Settings → API → anon public>
SUPABASE_SERVICE_ROLE_KEY=<Supabase dashboard → Settings → API → service_role secret>
NEXT_PUBLIC_SUPABASE_URL=https://vatnnzpnobvelupfpdse.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same as SUPABASE_ANON_KEY>
ADMIN_EMAIL=<admin user email>
REDIS_URL=redis://localhost:6379
```

### Vercel Environment Variables

Already set: `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_EMAIL`, `ACCESS_TOKEN`

**Missing — add in Vercel → Settings → Environment Variables:**
```
NEXT_PUBLIC_SUPABASE_URL   = (same value as SUPABASE_URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY = (same value as SUPABASE_ANON_KEY)
```

These are baked into the browser bundle at build time. Without them, the login/account pages cannot initialize the Supabase client in the browser.

---

## Pending Work

### Critical (blocks auth working end-to-end)
1. **Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel** → redeploy
2. **Run `supabase/setup.sql`** in Supabase SQL Editor if not already done (new RLS policies for user-scoped booking access)
3. **Add all Supabase vars to local `.env`** for local development

### Commit / Push
All auth feature work is locally modified but **not yet committed or pushed**. Changes include:
- `proxy.ts` — async session enforcement
- `components/Nav.tsx` — user prop + account link
- `components/Booking.tsx` — removed name/phone, lazy slot loading
- `app/page.tsx` — async server component, passes user to Nav
- `app/login/page.tsx` — NEW: full-page auth gate
- `app/account/page.tsx` — NEW: account dashboard
- `app/api/user/bookings/route.ts` — NEW
- `app/api/user/bookings/[id]/route.ts` — NEW
- `lib/validations.ts`, `lib/redis.ts`, `services/bookingService.ts`
- `prisma/schema.prisma` + migration
- `supabase/setup.sql`, `.env.example`

Per project rules: present change summary to user and wait for explicit approval before pushing.

---

## CSS Interaction Classes (app/globals.css)

Custom utility classes applied throughout:
- `.vx-input` — hover border highlight + focus glow ring
- `.vx-btn-primary` — hover lift + blue glow
- `.vx-btn-outline` — hover fill + brighten border
- `.vx-btn-danger` — hover red tint
- `.vx-contact-card` — hover lift + blue glow

---

## Known Issues / Watch-outs

- **Docker Google Fonts SSL**: `npm run build` inside Docker fails fetching fonts from `fonts.googleapis.com`. This is an environment limitation (Docker network). Vercel build works fine. Pre-push Docker verification is currently bypassed for this reason.
- **`userId` is nullable** in the Booking model (`String?`) — bookings created before auth was added have no userId. Admin panel reads all bookings via service_role (bypasses RLS), so existing bookings are still visible to admin.
- **Prisma migrations folder** is now tracked in git (previously gitignored). Do not delete it.
- **`next-env.d.ts`** was modified by Next.js automatically — not a manual change.
- **`lib/generated/prisma/`** is gitignored — Prisma client is regenerated at build time via `prisma generate` in the build script.
