# VelocityX

**Live:** https://carwebsite-coral.vercel.app

A full-stack car detailing and service booking platform. Customers browse services, view the vehicle fleet, compare before/after results, and book appointments through a real-time slot availability system. Admins manage bookings and time slots through a protected dashboard.

## Features

- **Service booking** — customers select a service, add-ons, and a time slot; the system checks real-time availability and prevents double-bookings
- **Fleet gallery** — browse available vehicle types with descriptions and imagery
- **Before/after comparison** — interactive slider showing detailing results
- **Admin dashboard** — protected route for viewing and managing all bookings and slot inventory
- **Supabase Auth** — server-side session management with protected routes enforced at the middleware level
- **Rate limiting** — Redis-backed per-IP rate limiting on all API routes
- **Error monitoring** — Sentry instrumented across client, server, and edge runtimes

## Tech Stack

| Layer | Technologies |
|---|---|
| Framework | Next.js 16 (App Router) · TypeScript |
| Auth | Supabase Auth (server-side sessions) |
| Database | PostgreSQL via Supabase · Prisma ORM |
| Infrastructure | Redis (rate limiting) · Cloudflare (WAF, CDN) · Sentry |
| UI | Tailwind CSS · shadcn/ui · Lucide icons |
| Validation | Zod |
| Testing | Jest (unit) · Playwright (E2E) |
| Deployment | Docker · Vercel |

## Architecture

```
carwebsite/
├── app/
│   ├── api/              # Next.js API route handlers
│   │   ├── bookings/     # POST — create booking (auth + rate limit + Zod validation)
│   │   ├── slots/        # GET available slots, POST admin slot creation
│   │   ├── admin/        # Admin-only routes (role-gated)
│   │   └── user/         # User profile endpoints
│   ├── account/          # Customer account pages
│   ├── admin/            # Admin dashboard pages
│   └── login/            # Auth pages
├── services/
│   ├── bookingService.ts # Booking creation with slot conflict detection
│   └── slotService.ts    # Slot availability queries
├── lib/
│   ├── db.ts             # Prisma singleton
│   ├── supabase.ts       # Supabase server client
│   └── rateLimiter.ts    # Redis-backed rate limiter
├── prisma/
│   └── schema.prisma     # TimeSlot + Booking relational schema
└── __tests__/            # Jest API route tests
```

## Data Model

```prisma
model TimeSlot {
  id       Int      @id @default(autoincrement())
  date     String
  time     String
  isBooked Boolean  @default(false)
  booking  Booking?
}

model Booking {
  id          Int      @id @default(autoincrement())
  userId      String?
  name        String
  phone       String
  vehicleType String
  service     String
  addOns      String
  message     String
  slotId      Int      @unique
  slot        TimeSlot @relation(fields: [slotId], references: [id])
  createdAt   DateTime @default(now())
}
```

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase project (PostgreSQL + Auth)
- Redis instance

### Setup

```bash
npm install
```

Create a `.env.local` file:

```env
# Supabase Postgres (use Transaction pooler URL for DATABASE_URL)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Supabase Auth & API
SUPABASE_URL="https://[ref].supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"

# Admin
ADMIN_EMAIL="admin@yourdomain.com"

# Redis
REDIS_URL="redis://localhost:6379"

# Access control (leave empty to disable)
ACCESS_TOKEN="generate-a-random-secret"
PORTFOLIO_ORIGIN="https://your-portfolio.vercel.app"
```

```bash
# Run database migrations
npx prisma migrate dev

# Seed time slots
npm run seed

# Start dev server
npm run dev
```

### Docker

```bash
docker-compose up --build
```

## Running Tests

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e
```
