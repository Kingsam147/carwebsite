# VelocityX Auto Detailing — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fullstack Next.js auto detailing booking website with 9 marketing sections, a booking form with live slot availability, and a password-protected admin panel for managing time slots.

**Architecture:** Single Next.js 14 App Router project — all sections on one scrolling homepage (`/`), API routes for slots and bookings, and a server-rendered `/admin` page that reads an HttpOnly cookie to gate access. SQLite via Prisma stores time slots and bookings.

**Tech Stack:** Next.js 14 · TypeScript · Tailwind CSS · Prisma + SQLite · Lucide React · react-compare-slider · Jest + React Testing Library

---

## File Map

```
/
├── app/
│   ├── globals.css                       # CSS variables + Tailwind base + reduced-motion
│   ├── layout.tsx                        # Root layout, next/font, metadata
│   ├── page.tsx                          # Homepage — renders all section components
│   ├── admin/
│   │   ├── page.tsx                      # Server component: reads cookie → login or panel
│   │   └── actions.ts                    # Server actions: login, logout, addSlot, deleteSlot
│   └── api/
│       ├── slots/route.ts                # GET ?date=YYYY-MM-DD → available slots
│       ├── bookings/route.ts             # POST → create booking + claim slot
│       └── admin/
│           ├── slots/route.ts            # GET all slots; POST add slot
│           └── slots/[id]/route.ts       # DELETE slot by id
├── components/
│   ├── Nav.tsx                           # Sticky glass navbar, mobile hamburger
│   ├── Hero.tsx                          # Hero section with CTA + promo banner
│   ├── About.tsx                         # Why VelocityX — 5 benefit items
│   ├── BeforeAfter.tsx                   # react-compare-slider, 3 pairs (client)
│   ├── Services.tsx                      # 3 pricing cards + add-ons
│   ├── Fleet.tsx                         # Two pricing tables
│   ├── WhatYouGet.tsx                    # 4 icon cards
│   ├── Reviews.tsx                       # 3 review cards + carousel dots
│   ├── Booking.tsx                       # Booking form + slot picker (client)
│   └── Footer.tsx                        # Logo, links, 4 social icons
├── lib/
│   └── db.ts                             # Prisma client singleton
├── prisma/
│   ├── schema.prisma                     # TimeSlot + Booking models
│   └── seed.ts                           # Seed 10 sample slots
├── __tests__/
│   ├── slots.test.ts                     # GET /api/slots logic
│   ├── bookings.test.ts                  # POST /api/bookings logic
│   └── admin-slots.test.ts              # Admin CRUD logic
├── .env                                  # DATABASE_URL, ADMIN_PASSWORD
├── jest.config.ts
├── jest.setup.ts
└── tailwind.config.ts
```

---

## Task 1: Initialize Project + Install Dependencies

**Files:**
- Create: all root config files via `create-next-app`
- Modify: `package.json`, `tailwind.config.ts`

- [ ] **Step 1: Scaffold Next.js app**

Run in `c:\Users\user\Documents\GitHub\CarWebsite`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --no-src-dir --no-import-alias
```
When prompted "The directory contains files that could conflict" → select **Yes** to continue.
When asked about each option, accept defaults (TypeScript: Yes, ESLint: Yes, Tailwind: Yes, App Router: Yes).

- [ ] **Step 2: Install additional dependencies**

```bash
npm install prisma @prisma/client lucide-react react-compare-slider
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @types/jest ts-jest
```

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```
Expected: server starts at `http://localhost:3000` with no errors. Stop with Ctrl+C.

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json next.config.ts tailwind.config.ts tsconfig.json .eslintrc.json postcss.config.mjs
git commit -m "feat: initialize Next.js 14 project with dependencies"
```

---

## Task 2: Global Styles + Design System

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Write `app/globals.css`**

Replace the entire file:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-base: #04060f;
  --bg-surface: #080d1a;
  --bg-card: rgba(8, 16, 35, 0.75);
  --accent-blue: #1a6fff;
  --accent-glow: #3b9eff;
  --accent-dim: rgba(26, 111, 255, 0.15);
  --text-primary: #ffffff;
  --border-subtle: rgba(26, 111, 255, 0.18);
  --border-card: rgba(26, 111, 255, 0.1);
  --glow-sm: 0 0 16px rgba(26, 111, 255, 0.25);
  --glow-md: 0 0 32px rgba(26, 111, 255, 0.35);
}

html {
  scroll-behavior: smooth;
  color-scheme: dark;
}

body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-body), sans-serif;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Write `app/layout.tsx`**

```tsx
import type { Metadata } from 'next'
import { Bebas_Neue, Jost } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const jost = Jost({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'VelocityX Auto Detailing',
  description: 'Premium Mobile Auto Detailing Services Across Massachusetts',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bebasNeue.variable} ${jost.variable}`}>
      <body>{children}</body>
    </html>
  )
}
```

- [ ] **Step 3: Write `tailwind.config.ts`**

Replace the entire file:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        base: '#04060f',
        surface: '#080d1a',
        accent: '#1a6fff',
        glow: '#3b9eff',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 4: Verify styles load**

```bash
npm run dev
```
Visit `http://localhost:3000`. Background should be near-black. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx tailwind.config.ts
git commit -m "feat: add design system CSS variables and fonts"
```

---

## Task 3: Prisma + SQLite Setup

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `lib/db.ts`
- Create: `.env`

- [ ] **Step 1: Initialize Prisma**

```bash
npx prisma init --datasource-provider sqlite
```
Expected: creates `prisma/schema.prisma` and `.env` with `DATABASE_URL="file:./dev.db"`.

- [ ] **Step 2: Write `prisma/schema.prisma`**

Replace the entire file:
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model TimeSlot {
  id       Int      @id @default(autoincrement())
  date     String
  time     String
  isBooked Boolean  @default(false)
  booking  Booking?
}

model Booking {
  id          Int      @id @default(autoincrement())
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

- [ ] **Step 3: Add ADMIN_PASSWORD to `.env`**

Append to `.env` (keep the DATABASE_URL line, add below it):
```
ADMIN_PASSWORD=velocityx2026
```

- [ ] **Step 4: Run migration**

```bash
npx prisma migrate dev --name init
```
Expected: `dev.db` created, migration applied, Prisma client generated.

- [ ] **Step 5: Write `prisma/seed.ts`**

```ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const slots = [
    { date: '2026-06-07', time: '9:00 AM' },
    { date: '2026-06-07', time: '11:00 AM' },
    { date: '2026-06-07', time: '1:00 PM' },
    { date: '2026-06-07', time: '3:00 PM' },
    { date: '2026-06-08', time: '10:00 AM' },
    { date: '2026-06-08', time: '12:00 PM' },
    { date: '2026-06-08', time: '2:00 PM' },
    { date: '2026-06-14', time: '9:00 AM' },
    { date: '2026-06-14', time: '1:00 PM' },
    { date: '2026-06-15', time: '11:00 AM' },
  ]

  for (const slot of slots) {
    await prisma.timeSlot.upsert({
      where: { id: -1 },
      update: {},
      create: slot,
    })
  }
  console.log('Seeded', slots.length, 'time slots')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 6: Add seed script to `package.json`**

In `package.json`, add inside `"scripts"`:
```json
"seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
```
Also add at root level of `package.json`:
```json
"prisma": {
  "seed": "npm run seed"
}
```

- [ ] **Step 7: Write `lib/db.ts`**

```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
```

- [ ] **Step 8: Run seed**

```bash
npx prisma db seed
```
Expected: "Seeded 10 time slots"

- [ ] **Step 9: Commit**

```bash
git add prisma/ lib/db.ts
git commit -m "feat: add Prisma SQLite schema and seed data"
```

---

## Task 4: Jest Setup

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`
- Create: `__tests__/slots.test.ts` (placeholder — filled in Task 5)

- [ ] **Step 1: Write `jest.config.ts`**

```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
```

- [ ] **Step 2: Write `jest.setup.ts`**

```ts
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Add test script to `package.json`**

Ensure `"scripts"` in `package.json` contains:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 4: Commit**

```bash
git add jest.config.ts jest.setup.ts
git commit -m "feat: configure Jest with next/jest"
```

---

## Task 5: API — GET /api/slots

**Files:**
- Create: `app/api/slots/route.ts`
- Create: `__tests__/slots.test.ts`

- [ ] **Step 1: Write failing test `__tests__/slots.test.ts`**

```ts
import { GET } from '@/app/api/slots/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db', () => ({
  default: {
    timeSlot: {
      findMany: jest.fn(),
    },
  },
}))

import prisma from '@/lib/db'

describe('GET /api/slots', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns 400 when date param is missing', async () => {
    const request = new NextRequest('http://localhost/api/slots')
    const response = await GET(request)
    expect(response.status).toBe(400)
  })

  it('returns available slots for a given date', async () => {
    const mockSlots = [
      { id: 1, date: '2026-06-07', time: '9:00 AM', isBooked: false },
      { id: 2, date: '2026-06-07', time: '11:00 AM', isBooked: false },
    ]
    ;(prisma.timeSlot.findMany as jest.Mock).mockResolvedValue(mockSlots)

    const request = new NextRequest('http://localhost/api/slots?date=2026-06-07')
    const response = await GET(request)
    const body = await response.json()

    expect(response.status).toBe(200)
    expect(body).toHaveLength(2)
    expect(body[0]).toEqual({ id: 1, time: '9:00 AM' })
    expect(prisma.timeSlot.findMany).toHaveBeenCalledWith({
      where: { date: '2026-06-07', isBooked: false },
      select: { id: true, time: true },
      orderBy: { time: 'asc' },
    })
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- --testPathPattern=slots
```
Expected: FAIL — "Cannot find module '@/app/api/slots/route'"

- [ ] **Step 3: Write `app/api/slots/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  const date = request.nextUrl.searchParams.get('date')
  if (!date) {
    return NextResponse.json({ error: 'date param required' }, { status: 400 })
  }

  const slots = await prisma.timeSlot.findMany({
    where: { date, isBooked: false },
    select: { id: true, time: true },
    orderBy: { time: 'asc' },
  })

  return NextResponse.json(slots)
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- --testPathPattern=slots
```
Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add app/api/slots/route.ts __tests__/slots.test.ts
git commit -m "feat: add GET /api/slots route with tests"
```

---

## Task 6: API — POST /api/bookings

**Files:**
- Create: `app/api/bookings/route.ts`
- Create: `__tests__/bookings.test.ts`

- [ ] **Step 1: Write failing test `__tests__/bookings.test.ts`**

```ts
import { POST } from '@/app/api/bookings/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db', () => ({
  default: {
    timeSlot: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    booking: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

import prisma from '@/lib/db'

const makeRequest = (body: object) =>
  new NextRequest('http://localhost/api/bookings', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })

describe('POST /api/bookings', () => {
  afterEach(() => jest.clearAllMocks())

  it('returns 400 when required fields are missing', async () => {
    const response = await POST(makeRequest({ name: 'Test' }))
    expect(response.status).toBe(400)
  })

  it('returns 409 when slot is already booked', async () => {
    ;(prisma.timeSlot.findUnique as jest.Mock).mockResolvedValue({
      id: 1, isBooked: true,
    })

    const response = await POST(makeRequest({
      name: 'Mike', phone: '555-1234', vehicleType: 'Honda Accord',
      service: 'Full Detail Light', slotId: 1,
    }))
    expect(response.status).toBe(409)
  })

  it('creates booking and marks slot booked on success', async () => {
    ;(prisma.timeSlot.findUnique as jest.Mock).mockResolvedValue({
      id: 1, isBooked: false,
    })
    ;(prisma.$transaction as jest.Mock).mockResolvedValue(undefined)

    const response = await POST(makeRequest({
      name: 'Mike', phone: '555-1234', vehicleType: 'Honda Accord',
      service: 'Full Detail Light', slotId: 1,
    }))
    expect(response.status).toBe(201)
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- --testPathPattern=bookings
```
Expected: FAIL — "Cannot find module '@/app/api/bookings/route'"

- [ ] **Step 3: Write `app/api/bookings/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, phone, vehicleType, service, slotId, addOns = '', message = '' } = body

  if (!name || !phone || !vehicleType || !service || !slotId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const slot = await prisma.timeSlot.findUnique({ where: { id: Number(slotId) } })
  if (!slot || slot.isBooked) {
    return NextResponse.json({ error: 'Slot unavailable' }, { status: 409 })
  }

  await prisma.$transaction([
    prisma.timeSlot.update({
      where: { id: Number(slotId) },
      data: { isBooked: true },
    }),
    prisma.booking.create({
      data: { name, phone, vehicleType, service, addOns, message, slotId: Number(slotId) },
    }),
  ])

  return NextResponse.json({ success: true }, { status: 201 })
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npm test -- --testPathPattern=bookings
```
Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add app/api/bookings/route.ts __tests__/bookings.test.ts
git commit -m "feat: add POST /api/bookings route with tests"
```

---

## Task 7: API — Admin Slots CRUD

**Files:**
- Create: `app/api/admin/slots/route.ts`
- Create: `app/api/admin/slots/[id]/route.ts`
- Create: `__tests__/admin-slots.test.ts`

- [ ] **Step 1: Write failing test `__tests__/admin-slots.test.ts`**

```ts
import { GET, POST } from '@/app/api/admin/slots/route'
import { DELETE } from '@/app/api/admin/slots/[id]/route'
import { NextRequest } from 'next/server'

jest.mock('@/lib/db', () => ({
  default: {
    timeSlot: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

import prisma from '@/lib/db'

describe('Admin Slots API', () => {
  afterEach(() => jest.clearAllMocks())

  it('GET returns all slots with booking info', async () => {
    const mockSlots = [
      { id: 1, date: '2026-06-07', time: '9:00 AM', isBooked: false, booking: null },
    ]
    ;(prisma.timeSlot.findMany as jest.Mock).mockResolvedValue(mockSlots)

    const response = await GET()
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body).toHaveLength(1)
  })

  it('POST creates a new slot', async () => {
    ;(prisma.timeSlot.create as jest.Mock).mockResolvedValue({
      id: 5, date: '2026-06-10', time: '10:00 AM', isBooked: false,
    })

    const request = new NextRequest('http://localhost/api/admin/slots', {
      method: 'POST',
      body: JSON.stringify({ date: '2026-06-10', time: '10:00 AM' }),
      headers: { 'Content-Type': 'application/json' },
    })
    const response = await POST(request)
    expect(response.status).toBe(201)
  })

  it('DELETE removes a slot by id', async () => {
    ;(prisma.timeSlot.delete as jest.Mock).mockResolvedValue({ id: 1 })

    const request = new NextRequest('http://localhost/api/admin/slots/1', {
      method: 'DELETE',
    })
    const response = await DELETE(request, { params: { id: '1' } })
    expect(response.status).toBe(200)
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npm test -- --testPathPattern=admin-slots
```
Expected: FAIL — "Cannot find module"

- [ ] **Step 3: Write `app/api/admin/slots/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const slots = await prisma.timeSlot.findMany({
    include: { booking: true },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })
  return NextResponse.json(slots)
}

export async function POST(request: NextRequest) {
  const { date, time } = await request.json()
  if (!date || !time) {
    return NextResponse.json({ error: 'date and time required' }, { status: 400 })
  }
  const slot = await prisma.timeSlot.create({ data: { date, time } })
  return NextResponse.json(slot, { status: 201 })
}
```

- [ ] **Step 4: Write `app/api/admin/slots/[id]/route.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.timeSlot.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ success: true })
}
```

- [ ] **Step 5: Run test — verify it passes**

```bash
npm test -- --testPathPattern=admin-slots
```
Expected: PASS (3 tests)

- [ ] **Step 6: Run all tests**

```bash
npm test
```
Expected: PASS (8 tests across 3 suites)

- [ ] **Step 7: Commit**

```bash
git add app/api/admin/ __tests__/admin-slots.test.ts
git commit -m "feat: add admin slots CRUD API routes with tests"
```

---

## Task 8: Admin Auth

**Files:**
- Create: `app/admin/actions.ts`
- Create: `app/admin/page.tsx` (stub — expanded in Task 19)

- [ ] **Step 1: Write `app/admin/actions.ts`**

```ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('vx_admin', '1', { httpOnly: true, path: '/', sameSite: 'strict' })
    redirect('/admin')
  }
  redirect('/admin?error=1')
}

export async function logout() {
  cookies().delete('vx_admin')
  redirect('/admin')
}
```

- [ ] **Step 2: Write stub `app/admin/page.tsx`**

```tsx
import { cookies } from 'next/headers'
import { login, logout } from './actions'

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const isAuthenticated = cookies().get('vx_admin')?.value === '1'

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh', background: '#04060f', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '280px' }}>
          <h1 style={{ fontFamily: 'sans-serif', color: '#fff', fontSize: '1.4rem', letterSpacing: '0.2em' }}>
            VELOCITYX ADMIN
          </h1>
          {searchParams.error && (
            <p style={{ color: '#f87171', fontSize: '0.8rem' }}>Incorrect password.</p>
          )}
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            style={{ padding: '10px', background: '#080d1a', border: '1px solid rgba(26,111,255,0.2)', color: '#fff', borderRadius: '6px' }}
          />
          <button
            type="submit"
            style={{ padding: '10px', background: '#1a6fff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            Login
          </button>
        </form>
      </div>
    )
  }

  return <div style={{ color: '#fff', padding: '40px' }}>Admin panel coming soon. <form action={logout}><button type="submit">Logout</button></form></div>
}
```

- [ ] **Step 3: Verify admin auth works**

```bash
npm run dev
```
Visit `http://localhost:3000/admin`. Should show password form.
Enter `velocityx2026` (the value from `.env`). Should redirect to `/admin` and show "Admin panel coming soon."

- [ ] **Step 4: Commit**

```bash
git add app/admin/
git commit -m "feat: add admin auth with HttpOnly cookie server action"
```

---

## Task 9: Nav Component

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Write `components/Nav.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

const links = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Fleet', href: '#fleet' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#booking' },
]

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? 'rgba(4,6,15,0.95)' : 'rgba(4,6,15,0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(26,111,255,0.18)',
        transition: 'background 200ms ease',
      }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#hero" style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', letterSpacing: '0.2em', color: '#fff', textDecoration: 'none' }}>
          VELOCITY<span style={{ color: '#1a6fff' }}>X</span>
        </a>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: '24px' }} className="hidden-mobile">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{ fontSize: '0.68rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer', transition: 'color 200ms ease' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#3b9eff')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            >
              {link.label.toUpperCase()}
            </a>
          ))}
        </div>

        {/* Book Now CTA */}
        <a
          href="#booking"
          className="hidden-mobile"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            background: '#1a6fff', color: '#fff', padding: '8px 18px',
            borderRadius: '6px', fontSize: '0.68rem', fontWeight: 600,
            letterSpacing: '0.12em', textDecoration: 'none', cursor: 'pointer',
            boxShadow: '0 0 16px rgba(26,111,255,0.25)', transition: 'all 200ms ease',
            fontFamily: 'var(--font-body)',
          }}
        >
          BOOK NOW
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="show-mobile"
          style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '8px' }}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{ background: 'rgba(4,6,15,0.98)', borderTop: '1px solid rgba(26,111,255,0.1)', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '0.8rem', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', fontFamily: 'var(--font-body)', fontWeight: 500 }}
            >
              {link.label.toUpperCase()}
            </a>
          ))}
          <a
            href="#booking"
            onClick={() => setMenuOpen(false)}
            style={{ background: '#1a6fff', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.12em', textDecoration: 'none', textAlign: 'center', fontFamily: 'var(--font-body)' }}
          >
            BOOK NOW
          </a>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 2: Add mobile responsive CSS to `app/globals.css`**

Append to `app/globals.css`:
```css
.hidden-mobile { display: flex; }
.show-mobile { display: none; }

@media (max-width: 768px) {
  .hidden-mobile { display: none !important; }
  .show-mobile { display: flex !important; }
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Nav.tsx app/globals.css
git commit -m "feat: add sticky glass Nav component with mobile menu"
```

---

## Task 10: Hero Component

**Files:**
- Create: `components/Hero.tsx`

- [ ] **Step 1: Write `components/Hero.tsx`**

```tsx
import { ArrowRight, Phone } from 'lucide-react'

export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse 70% 60% at 70% 50%, rgba(10,40,100,0.5) 0%, transparent 70%), radial-gradient(ellipse 40% 80% at 100% 50%, rgba(26,111,255,0.12) 0%, transparent 60%), linear-gradient(135deg, #04060f 0%, #060d1f 50%, #04060f 100%)',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Right side glow panel */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%',
        background: 'linear-gradient(135deg, transparent 0%, rgba(8,20,50,0.6) 40%, rgba(26,111,255,0.08) 100%)',
        borderLeft: '1px solid rgba(26,111,255,0.1)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: '1152px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '540px' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)',
            color: '#3b9eff', fontSize: '0.62rem', letterSpacing: '0.2em',
            padding: '5px 14px', borderRadius: '20px', marginBottom: '16px', fontWeight: 600,
            fontFamily: 'var(--font-body)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#1a6fff', boxShadow: '0 0 16px rgba(26,111,255,0.25)', display: 'inline-block' }} />
            PREMIUM MOBILE SERVICE
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 5.5rem)',
            lineHeight: 0.95, letterSpacing: '0.04em', color: '#fff',
            marginBottom: '12px', textTransform: 'uppercase',
          }}>
            AUTO<br />
            <span style={{ color: '#3b9eff' }}>DETAILING</span>
          </h1>

          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', marginBottom: '20px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
            Professional Interior &amp; Exterior Cleaning<br />Across Massachusetts
          </p>

          {/* Checkmarks */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '28px', flexWrap: 'wrap' }}>
            {['Clean', 'Restored', 'Protected'].map(item => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#3b9eff', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(26,111,255,0.15)', border: '1.5px solid #1a6fff', display: 'inline-block' }} />
                {item.toUpperCase()}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
            <a
              href="#booking"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#1a6fff', color: '#fff', padding: '12px 24px',
                borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                letterSpacing: '0.12em', textDecoration: 'none', cursor: 'pointer',
                boxShadow: '0 0 16px rgba(26,111,255,0.25)', transition: 'all 200ms ease',
                fontFamily: 'var(--font-body)',
              }}
            >
              <ArrowRight size={14} /> BOOK NOW
            </a>
            <a
              href="tel:7746990103"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                border: '1.5px solid rgba(59,158,255,0.4)', color: '#3b9eff',
                padding: '11px 22px', borderRadius: '6px', fontSize: '0.75rem',
                fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
                background: 'rgba(26,111,255,0.05)', transition: 'all 200ms ease',
                fontFamily: 'var(--font-body)',
              }}
            >
              <Phone size={14} /> CALL / TEXT
            </a>
          </div>

          {/* Promo Banner */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '16px',
            background: 'rgba(8,20,50,0.8)', border: '1px solid rgba(26,111,255,0.18)',
            borderRadius: '12px', padding: '12px 20px',
            backdropFilter: 'blur(10px)', boxShadow: '0 0 16px rgba(26,111,255,0.25)',
          }}>
            <div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>FIRST CLEAN</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: '#3b9eff', letterSpacing: '0.1em' }}>10% OFF</div>
            </div>
            <div style={{ width: 1, height: 32, background: 'rgba(26,111,255,0.18)' }} />
            <div style={{ fontSize: '0.68rem', color: '#fff', lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>
              LIMITED TIME OFFER<br /><strong>UNTIL JUNE 7TH</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "feat: add Hero section component"
```

---

## Task 11: About Component

**Files:**
- Create: `components/About.tsx`

- [ ] **Step 1: Write `components/About.tsx`**

```tsx
import { Shield, Phone, Heart, Clock, CheckCircle } from 'lucide-react'

const benefits = [
  { icon: Shield, label: 'Attention to Detail' },
  { icon: Phone, label: 'Reliable Communication' },
  { icon: Heart, label: 'Passion for Cars' },
  { icon: Clock, label: 'Convenient Mobile Service' },
  { icon: CheckCircle, label: 'Satisfaction-Focused Results' },
]

export default function About() {
  return (
    <section
      id="about"
      style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}
    >
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>WHY VELOCITYX?</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '12px' }}>
          PRECISION. CARE.<br />RESULTS.
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', maxWidth: '520px', lineHeight: 1.7, marginBottom: '40px', fontFamily: 'var(--font-body)' }}>
          At VelocityX Auto Detailing, we restore vehicles with meticulous attention to detail — whether it&apos;s a daily driver, work truck, SUV, or commercial vehicle.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
          {benefits.map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '14px 16px', borderRadius: '8px',
                border: '1px solid rgba(26,111,255,0.1)',
                background: 'rgba(8,16,35,0.75)',
                backdropFilter: 'blur(12px)',
                transition: 'all 200ms ease', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(26,111,255,0.35)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(26,111,255,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(26,111,255,0.1)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: '8px',
                background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon size={16} color="#3b9eff" />
              </div>
              <span style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/About.tsx
git commit -m "feat: add About section with benefit cards"
```

---

## Task 12: BeforeAfter Component

**Files:**
- Create: `components/BeforeAfter.tsx`

- [ ] **Step 1: Write `components/BeforeAfter.tsx`**

```tsx
'use client'

import { ReactCompareSlider } from 'react-compare-slider'

const pairs = [
  { caption: 'Heavy interior reset' },
  { caption: 'Work truck transformation' },
  { caption: 'Full interior extraction' },
]

function PlaceholderBefore() {
  return (
    <div style={{ width: '100%', height: '280px', background: 'linear-gradient(135deg, #050d1a 0%, #0a1a35 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', fontFamily: 'var(--font-body)' }}>BEFORE</span>
    </div>
  )
}

function PlaceholderAfter() {
  return (
    <div style={{ width: '100%', height: '280px', background: 'linear-gradient(135deg, #0a1f40 0%, #1a3060 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontSize: '0.65rem', color: '#3b9eff', letterSpacing: '0.15em', fontFamily: 'var(--font-body)' }}>AFTER</span>
    </div>
  )
}

export default function BeforeAfter() {
  return (
    <section id="results" style={{ background: 'var(--bg-base)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>REAL RESULTS</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '8px' }}>
          SEE THE<br />TRANSFORMATION
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '40px', fontFamily: 'var(--font-body)' }}>
          Drag the slider to compare before and after.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {pairs.map(({ caption }) => (
            <div key={caption} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(26,111,255,0.1)' }}>
              <ReactCompareSlider
                itemOne={<PlaceholderBefore />}
                itemTwo={<PlaceholderAfter />}
                style={{ width: '100%' }}
              />
              <div style={{ padding: '12px 14px', background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', fontFamily: 'var(--font-body)' }}>{caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/BeforeAfter.tsx
git commit -m "feat: add BeforeAfter slider section with react-compare-slider"
```

---

## Task 13: Services Component

**Files:**
- Create: `components/Services.tsx`

- [ ] **Step 1: Write `components/Services.tsx`**

```tsx
import { ArrowRight } from 'lucide-react'

const tiers = [
  { label: 'Light Condition', price: '$110', featured: false },
  { label: 'Medium Condition', price: '$130', featured: true },
  { label: 'Heavy Condition', price: '$150', featured: false },
]

const features = [
  'Exterior Wash',
  'Wheels & Tires Cleaned',
  'Windows (Inside & Out)',
  'Full Interior Vacuum',
  'Dashboard, Panels & Surfaces',
  'Stain Removal',
  'Odor Cleaning',
  'Full Cleaning Reset',
]

const addOns = [
  { label: 'Engine Bay Cleaning', price: '+$30' },
  { label: 'Headlight Restoration', price: '+$40' },
  { label: 'Odor / Scratch Removal', price: '+$50' },
]

export default function Services() {
  return (
    <section id="services" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>CARS & SUVs</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '8px' }}>
          FULL DETAIL<br />PRICING
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '40px', maxWidth: '480px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
          Simple, transparent pricing based on your vehicle&apos;s condition. Every package includes full interior + exterior service.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {tiers.map(({ label, price, featured }) => (
            <div
              key={label}
              style={{
                borderRadius: '12px', padding: '24px 20px',
                border: featured ? '1px solid rgba(26,111,255,0.45)' : '1px solid rgba(26,111,255,0.1)',
                background: featured ? 'rgba(10,26,60,0.85)' : 'rgba(8,16,35,0.75)',
                backdropFilter: 'blur(12px)',
                boxShadow: featured ? '0 0 16px rgba(26,111,255,0.25)' : 'none',
                position: 'relative', overflow: 'hidden',
                transition: 'all 200ms ease', cursor: 'default',
              }}
            >
              {featured && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0,
                  background: '#1a6fff', fontSize: '0.55rem', letterSpacing: '0.2em',
                  padding: '5px', color: '#fff', fontWeight: 700, textAlign: 'center',
                  fontFamily: 'var(--font-body)',
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ marginTop: featured ? '18px' : 0 }}>
                <div style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.2em', fontWeight: 600, marginBottom: '8px', fontFamily: 'var(--font-body)' }}>{label.toUpperCase()}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: '#fff', letterSpacing: '0.06em', lineHeight: 1 }}>{price}</div>
                <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '16px', fontFamily: 'var(--font-body)' }}>Full Interior + Exterior</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {features.slice(0, 5).map(feature => (
                    <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.68rem', color: '#fff', fontFamily: 'var(--font-body)' }}>
                      <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#1a6fff', flexShrink: 0 }} />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(26,111,255,0.1)', background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)', marginBottom: '28px' }}>
          <div style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.15em', fontWeight: 600, marginBottom: '10px', fontFamily: 'var(--font-body)' }}>OPTIONAL ADD-ONS</div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {addOns.map(({ label, price }) => (
              <span key={label} style={{ fontSize: '0.68rem', color: '#fff', background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)', borderRadius: '20px', padding: '4px 12px', fontFamily: 'var(--font-body)' }}>
                {label} — <strong>{price}</strong>
              </span>
            ))}
          </div>
        </div>

        <a
          href="#booking"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: '#1a6fff', color: '#fff', padding: '12px 24px',
            borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
            letterSpacing: '0.12em', textDecoration: 'none', cursor: 'pointer',
            boxShadow: '0 0 16px rgba(26,111,255,0.25)', transition: 'all 200ms ease',
            fontFamily: 'var(--font-body)',
          }}
        >
          <ArrowRight size={14} /> BOOK SERVICE
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Services.tsx
git commit -m "feat: add Services pricing section"
```

---

## Task 14: Fleet Component

**Files:**
- Create: `components/Fleet.tsx`

- [ ] **Step 1: Write `components/Fleet.tsx`**

```tsx
import { MessageSquare } from 'lucide-react'

const standardPricing = [
  { vehicle: 'Small (Compact Trucks)', light: '$150', heavy: '$190' },
  { vehicle: 'Standard (Pickup Trucks / Vans)', light: '$180', heavy: '$230' },
  { vehicle: 'Large (Box Trucks)', light: '$220', heavy: '$270' },
]

const flatRatePricing = [
  { size: 'Small', rate: '$250' },
  { size: 'Medium', rate: '$300' },
  { size: 'Large', rate: '$350' },
]

const tableHeaderStyle: React.CSSProperties = {
  color: '#3b9eff', textAlign: 'left', padding: '10px 14px',
  borderBottom: '1px solid rgba(26,111,255,0.18)', fontSize: '0.62rem',
  letterSpacing: '0.15em', fontWeight: 600, fontFamily: 'var(--font-body)',
}

const tableCellStyle: React.CSSProperties = {
  padding: '10px 14px', color: '#fff', fontSize: '0.75rem', fontFamily: 'var(--font-body)',
}

export default function Fleet() {
  return (
    <section id="fleet" style={{ background: 'var(--bg-base)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>FLEET & COMMERCIAL</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '8px' }}>
          WORK-READY<br />DETAILING
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '40px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
          Pickup Trucks · Company Vehicles · Work Vans · Specialty Vehicles · Box Trucks
        </p>

        {/* Standard pricing table */}
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(26,111,255,0.1)', marginBottom: '20px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(8,16,35,0.9)' }}>
                <th style={tableHeaderStyle}>Vehicle Type</th>
                <th style={tableHeaderStyle}>Light</th>
                <th style={tableHeaderStyle}>Heavy</th>
              </tr>
            </thead>
            <tbody>
              {standardPricing.map((row, i) => (
                <tr key={row.vehicle} style={{ background: i % 2 === 0 ? 'rgba(8,16,35,0.75)' : 'rgba(4,6,15,0.75)', borderBottom: '1px solid rgba(26,111,255,0.05)' }}>
                  <td style={{ ...tableCellStyle, color: 'rgba(255,255,255,0.8)' }}>{row.vehicle}</td>
                  <td style={tableCellStyle}>{row.light}</td>
                  <td style={tableCellStyle}>{row.heavy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Flat rate table */}
        <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: '12px', fontFamily: 'var(--font-body)' }}>
          Tow Trucks &amp; School Buses — Flat Rate (Size Only) · No condition upcharge
        </p>
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(26,111,255,0.1)', marginBottom: '32px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(8,16,35,0.9)' }}>
                <th style={tableHeaderStyle}>Size</th>
                <th style={tableHeaderStyle}>Flat Rate</th>
              </tr>
            </thead>
            <tbody>
              {flatRatePricing.map((row, i) => (
                <tr key={row.size} style={{ background: i % 2 === 0 ? 'rgba(8,16,35,0.75)' : 'rgba(4,6,15,0.75)', borderBottom: '1px solid rgba(26,111,255,0.05)' }}>
                  <td style={{ ...tableCellStyle, color: 'rgba(255,255,255,0.8)' }}>{row.size}</td>
                  <td style={{ ...tableCellStyle, color: '#3b9eff', fontWeight: 600 }}>{row.rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <a
          href="#booking"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1.5px solid rgba(59,158,255,0.4)', color: '#3b9eff',
            padding: '11px 22px', borderRadius: '6px', fontSize: '0.75rem',
            fontWeight: 500, textDecoration: 'none', cursor: 'pointer',
            background: 'rgba(26,111,255,0.05)', transition: 'all 200ms ease',
            fontFamily: 'var(--font-body)',
          }}
        >
          <MessageSquare size={14} /> GET QUOTE
        </a>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Fleet.tsx
git commit -m "feat: add Fleet & Commercial pricing section"
```

---

## Task 15: WhatYouGet Component

**Files:**
- Create: `components/WhatYouGet.tsx`

- [ ] **Step 1: Write `components/WhatYouGet.tsx`**

```tsx
import { Shield, RefreshCw, Truck, Star } from 'lucide-react'

const items = [
  { icon: Shield, label: 'Clean, Fresh Interior' },
  { icon: RefreshCw, label: 'Restored Look & Feel' },
  { icon: Truck, label: 'Convenient Mobile Service' },
  { icon: Star, label: 'Professional Results' },
]

export default function WhatYouGet() {
  return (
    <section style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>BENEFITS</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '40px' }}>
          WHAT YOU GET
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          {items.map(({ icon: Icon, label }) => (
            <div
              key={label}
              style={{
                borderRadius: '12px', padding: '28px 20px 22px',
                border: '1px solid rgba(26,111,255,0.1)',
                background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)',
                textAlign: 'center', transition: 'all 200ms ease', cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(26,111,255,0.35)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 0 16px rgba(26,111,255,0.25)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(26,111,255,0.1)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              <div style={{
                width: 48, height: 48, borderRadius: '12px',
                background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)',
                margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 0 16px rgba(26,111,255,0.25)',
              }}>
                <Icon size={22} color="#3b9eff" />
              </div>
              <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500, lineHeight: 1.4, fontFamily: 'var(--font-body)' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/WhatYouGet.tsx
git commit -m "feat: add What You Get icon grid section"
```

---

## Task 16: Reviews Component

**Files:**
- Create: `components/Reviews.tsx`

- [ ] **Step 1: Write `components/Reviews.tsx`**

```tsx
'use client'

import { useState } from 'react'

const reviews = [
  { name: 'Mike R.', initial: 'M', text: 'Car looked brand new again. Super professional and easy to work with. Will be a repeat customer.' },
  { name: 'James T.', initial: 'J', text: 'Best detail my truck has ever had. Incredibly thorough — looked showroom fresh when they were done.' },
  { name: 'Sarah M.', initial: 'S', text: 'Showed up on time, communication was excellent. The interior was completely transformed.' },
]

function StarRating() {
  return (
    <div style={{ display: 'flex', gap: '3px', marginBottom: '12px' }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#1a6fff">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [active, setActive] = useState(0)

  return (
    <section id="reviews" style={{ background: 'var(--bg-base)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>CUSTOMER REVIEWS</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '40px' }}>
          WHAT CLIENTS<br />ARE SAYING
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          {reviews.map(({ name, initial, text }) => (
            <div
              key={name}
              style={{
                borderRadius: '12px', padding: '20px',
                border: '1px solid rgba(26,111,255,0.1)',
                background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)',
                transition: 'border-color 200ms ease',
              }}
            >
              <StarRating />
              <p style={{ fontSize: '0.8rem', color: '#fff', lineHeight: 1.65, marginBottom: '14px', fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>
                &ldquo;{text}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1a6fff, #0a2a60)',
                  border: '1.5px solid rgba(26,111,255,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.72rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-body)',
                }}>
                  {initial}
                </div>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontFamily: 'var(--font-body)' }}>{name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel dots */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Review ${i + 1}`}
              style={{
                width: active === i ? 20 : 8, height: 8, borderRadius: '4px',
                background: active === i ? '#1a6fff' : 'rgba(26,111,255,0.25)',
                border: 'none', cursor: 'pointer', transition: 'all 200ms ease',
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Reviews.tsx
git commit -m "feat: add Reviews carousel section"
```

---

## Task 17: Booking Component

**Files:**
- Create: `components/Booking.tsx`

- [ ] **Step 1: Write `components/Booking.tsx`**

```tsx
'use client'

import { useState, useEffect } from 'react'
import { ArrowRight, Phone, Mail, Instagram, Loader2 } from 'lucide-react'

type TimeSlot = { id: number; time: string }

const serviceOptions = [
  'Full Detail — Light ($110)',
  'Full Detail — Medium ($130)',
  'Full Detail — Heavy ($150)',
  'Fleet Small — Light ($150)',
  'Fleet Small — Heavy ($190)',
  'Fleet Standard — Light ($180)',
  'Fleet Standard — Heavy ($230)',
  'Fleet Large — Light ($220)',
  'Fleet Large — Heavy ($270)',
  'Tow Truck/Bus — Small ($250)',
  'Tow Truck/Bus — Medium ($300)',
  'Tow Truck/Bus — Large ($350)',
]

const addOnOptions = [
  { label: 'Engine Bay Cleaning', value: 'engine-bay', price: '+$30' },
  { label: 'Headlight Restoration', value: 'headlight', price: '+$40' },
  { label: 'Odor / Scratch Removal', value: 'odor-scratch', price: '+$50' },
]

const inputStyle: React.CSSProperties = {
  width: '100%', background: 'rgba(8,16,35,0.8)',
  border: '1px solid rgba(26,111,255,0.1)', borderRadius: '6px',
  padding: '10px 12px', fontSize: '0.8rem', color: '#fff',
  fontFamily: 'var(--font-body)', outline: 'none',
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.62rem', color: '#3b9eff',
  letterSpacing: '0.1em', fontWeight: 600, marginBottom: '6px',
  fontFamily: 'var(--font-body)',
}

export default function Booking() {
  const [date, setDate] = useState('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!date) { setSlots([]); return }
    setLoadingSlots(true)
    fetch(`/api/slots?date=${date}`)
      .then(r => r.json())
      .then(data => { setSlots(Array.isArray(data) ? data : []); setLoadingSlots(false) })
      .catch(() => setLoadingSlots(false))
  }, [date])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    const formData = new FormData(event.currentTarget)
    const selectedAddOns = addOnOptions
      .filter(opt => formData.get(opt.value))
      .map(opt => opt.label)
      .join(', ')

    const payload = {
      name: formData.get('name'),
      phone: formData.get('phone'),
      vehicleType: formData.get('vehicleType'),
      service: formData.get('service'),
      slotId: formData.get('slotId'),
      addOns: selectedAddOns,
      message: formData.get('message') ?? '',
    }

    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      setSubmitted(true)
    } else {
      const body = await response.json()
      setError(body.error === 'Slot unavailable' ? 'That time slot was just booked. Please pick another.' : 'Something went wrong. Please try again.')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <section id="booking" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1152px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>BOOKING CONFIRMED</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: '#fff', marginBottom: '12px' }}>YOU&apos;RE ALL SET!</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-body)' }}>We&apos;ll reach out to confirm your appointment. Questions? Call/text 774-699-0103.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="booking" style={{ background: 'var(--bg-surface)', padding: '96px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{ width: 24, height: 1.5, background: '#1a6fff' }} />
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3b9eff', fontWeight: 600, fontFamily: 'var(--font-body)' }}>BOOK YOUR DETAIL</span>
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.06em', color: '#fff', marginBottom: '8px' }}>
          LET&apos;S GET<br />STARTED
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', marginBottom: '40px', fontFamily: 'var(--font-body)' }}>
          Pick a date, choose an available slot, and we&apos;ll handle the rest.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px' }}>
          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label htmlFor="name" style={labelStyle}>FULL NAME *</label>
              <input id="name" name="name" type="text" required placeholder="Your name" style={inputStyle} />
            </div>
            <div>
              <label htmlFor="phone" style={labelStyle}>PHONE *</label>
              <input id="phone" name="phone" type="tel" required placeholder="774-000-0000" style={inputStyle} />
            </div>
            <div>
              <label htmlFor="vehicleType" style={labelStyle}>VEHICLE TYPE *</label>
              <input id="vehicleType" name="vehicleType" type="text" required placeholder="e.g. 2021 Honda Accord" style={inputStyle} />
            </div>
            <div>
              <label htmlFor="service" style={labelStyle}>SERVICE NEEDED *</label>
              <select id="service" name="service" required style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="">Select a service</option>
                {serviceOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>ADD-ONS (OPTIONAL)</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {addOnOptions.map(opt => (
                  <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#fff', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                    <input type="checkbox" name={opt.value} style={{ accentColor: '#1a6fff' }} />
                    {opt.label} <span style={{ color: '#3b9eff' }}>{opt.price}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label htmlFor="date" style={labelStyle}>PREFERRED DATE *</label>
              <input
                id="date" name="date" type="date" required
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={e => setDate(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label htmlFor="slotId" style={labelStyle}>
                AVAILABLE TIME SLOT *
                {loadingSlots && <Loader2 size={12} style={{ marginLeft: 6, display: 'inline', animation: 'spin 1s linear infinite' }} />}
              </label>
              <select id="slotId" name="slotId" required disabled={!date || loadingSlots} style={{ ...inputStyle, cursor: date ? 'pointer' : 'not-allowed', opacity: date ? 1 : 0.5 }}>
                <option value="">{date ? (slots.length ? 'Select a time' : 'No slots available') : 'Pick a date first'}</option>
                {slots.map(slot => <option key={slot.id} value={slot.id}>{slot.time}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="message" style={labelStyle}>MESSAGE (OPTIONAL)</label>
              <textarea id="message" name="message" rows={3} placeholder="Any notes about your vehicle..." style={{ ...inputStyle, resize: 'vertical' }} />
            </div>

            {error && <p style={{ fontSize: '0.75rem', color: '#f87171', fontFamily: 'var(--font-body)' }}>{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                background: submitting ? 'rgba(26,111,255,0.6)' : '#1a6fff', color: '#fff',
                padding: '12px 24px', borderRadius: '6px', fontSize: '0.75rem',
                fontWeight: 600, letterSpacing: '0.12em', border: 'none',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 0 16px rgba(26,111,255,0.25)', transition: 'all 200ms ease',
                fontFamily: 'var(--font-body)',
              }}
            >
              {submitting ? <Loader2 size={14} /> : <ArrowRight size={14} />}
              {submitting ? 'SUBMITTING...' : 'SUBMIT BOOKING'}
            </button>
          </form>

          {/* Contact info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {[
              { icon: Phone, label: 'CALL / TEXT', value: '774-699-0103', href: 'tel:7746990103' },
              { icon: Mail, label: 'EMAIL', value: 'autodetailingvelocity@gmail.com', href: 'mailto:autodetailingvelocity@gmail.com' },
              { icon: Instagram, label: 'INSTAGRAM', value: '@VelocityX.Auto', href: 'https://instagram.com/velocityx.auto' },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '14px 16px', borderRadius: '8px',
                  border: '1px solid rgba(26,111,255,0.1)',
                  background: 'rgba(8,16,35,0.75)', backdropFilter: 'blur(12px)',
                  textDecoration: 'none', transition: 'all 200ms ease', cursor: 'pointer',
                }}
              >
                <div style={{ width: 36, height: 36, borderRadius: '8px', background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={16} color="#3b9eff" />
                </div>
                <div>
                  <div style={{ fontSize: '0.6rem', color: '#3b9eff', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>{label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500, fontFamily: 'var(--font-body)' }}>{value}</div>
                </div>
              </a>
            ))}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
              {[
                { label: 'CALL NOW', href: 'tel:7746990103', primary: true },
                { label: 'TEXT NOW', href: 'sms:7746990103', primary: false },
                { label: 'FOLLOW ON INSTAGRAM', href: 'https://instagram.com/velocityx.auto', primary: false },
              ].map(({ label, href, primary }) => (
                <a
                  key={label}
                  href={href}
                  style={{
                    display: 'block', textAlign: 'center', padding: '11px',
                    borderRadius: '6px', fontSize: '0.72rem', fontWeight: 600,
                    letterSpacing: '0.1em', textDecoration: 'none', cursor: 'pointer',
                    transition: 'all 200ms ease', fontFamily: 'var(--font-body)',
                    background: primary ? '#1a6fff' : 'rgba(26,111,255,0.05)',
                    color: primary ? '#fff' : '#3b9eff',
                    border: primary ? 'none' : '1.5px solid rgba(59,158,255,0.35)',
                    boxShadow: primary ? '0 0 16px rgba(26,111,255,0.25)' : 'none',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Booking.tsx
git commit -m "feat: add Booking form with live slot picker and API integration"
```

---

## Task 18: Footer Component

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Write `components/Footer.tsx`**

```tsx
const quickLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'Services', href: '#services' },
  { label: 'Fleet & Commercial', href: '#fleet' },
  { label: 'About', href: '#about' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Contact', href: '#booking' },
]

const socials = [
  { label: 'Instagram', handle: '@velocityx.auto', href: 'https://instagram.com/velocityx.auto', abbr: 'IG' },
  { label: 'Snapchat', handle: 'velocityxauto', href: 'https://snapchat.com/add/velocityxauto', abbr: 'SC' },
  { label: 'TikTok', handle: '@velocityxauto', href: 'https://tiktok.com/@velocityxauto', abbr: 'TK' },
  { label: 'YouTube', handle: 'VelocityX_Auto', href: 'https://youtube.com/@VelocityX_Auto', abbr: 'YT' },
]

function SocialIcon({ label, href, abbr }: { label: string; href: string; abbr: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{
        width: 32, height: 32, borderRadius: '7px',
        background: 'rgba(26,111,255,0.15)', border: '1px solid rgba(26,111,255,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textDecoration: 'none', fontSize: '0.62rem', fontWeight: 700,
        color: '#3b9eff', cursor: 'pointer', transition: 'all 200ms ease',
        fontFamily: 'var(--font-body)',
      }}
    >
      {abbr}
    </a>
  )
}

export default function Footer() {
  return (
    <footer style={{ background: '#030510', borderTop: '1px solid rgba(26,111,255,0.08)', padding: '48px 24px 24px' }}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '32px' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.2em', color: '#fff', marginBottom: '8px' }}>
              VELOCITY<span style={{ color: '#1a6fff' }}>X</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: '16px', fontFamily: 'var(--font-body)' }}>
              Premium Mobile Auto Detailing<br />Serving Massachusetts Area
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              {socials.map(s => <SocialIcon key={s.label} {...s} />)}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#3b9eff', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-body)' }}>QUICK LINKS</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {quickLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'color 200ms ease', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#3b9eff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#3b9eff', fontWeight: 700, marginBottom: '12px', fontFamily: 'var(--font-body)' }}>CONTACT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {[
                { label: '774-699-0103', href: 'tel:7746990103' },
                { label: 'autodetailingvelocity@gmail.com', href: 'mailto:autodetailingvelocity@gmail.com' },
                { label: '@VelocityX.Auto', href: 'https://instagram.com/velocityx.auto' },
                { label: 'Massachusetts Area', href: undefined },
              ].map(({ label, href }) =>
                href ? (
                  <a key={label} href={href} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontFamily: 'var(--font-body)', cursor: 'pointer' }}>{label}</a>
                ) : (
                  <span key={label} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)' }}>{label}</span>
                )
              )}
            </div>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(26,111,255,0.06)', paddingTop: '20px', textAlign: 'center', fontSize: '0.65rem', color: 'rgba(122,143,168,0.5)', fontFamily: 'var(--font-body)' }}>
          VelocityX Auto Detailing © 2026 · Serving Massachusetts Area · All Rights Reserved
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add Footer with quick links and social icons"
```

---

## Task 19: Homepage Assembly

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Write `app/page.tsx`**

```tsx
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import About from '@/components/About'
import BeforeAfter from '@/components/BeforeAfter'
import Services from '@/components/Services'
import Fleet from '@/components/Fleet'
import WhatYouGet from '@/components/WhatYouGet'
import Reviews from '@/components/Reviews'
import Booking from '@/components/Booking'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <BeforeAfter />
        <Services />
        <Fleet />
        <WhatYouGet />
        <Reviews />
        <Booking />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Start dev server and verify all sections render**

```bash
npm run dev
```
Visit `http://localhost:3000`. Scroll through all sections. Check:
- Nav is sticky and glass
- Hero: "AUTO / DETAILING" heading, buttons, promo banner
- About: 5 benefit cards with icons
- Before/After: 3 sliders with drag handle
- Services: 3 price cards, "Medium" has "Most Popular" badge
- Fleet: both pricing tables
- What You Get: 4 icon cards
- Reviews: 3 review cards with stars
- Booking: form with date picker and slot dropdown
- Footer: social links, quick links, copyright

- [ ] **Step 3: Test booking flow end-to-end**

With dev server running:
1. Navigate to `http://localhost:3000`
2. Pick a date that has seeded slots (e.g. `2026-06-07`)
3. Verify slots appear in the dropdown
4. Fill in all required fields and submit
5. Verify success screen appears
6. Check the database: `npx prisma studio` → open in browser → verify Booking and TimeSlot records

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat: assemble homepage with all 9 sections"
```

---

## Task 20: Full Admin Panel

**Files:**
- Modify: `app/admin/page.tsx`

- [ ] **Step 1: Write the complete `app/admin/page.tsx`**

Replace the stub with the full implementation:

```tsx
import { cookies } from 'next/headers'
import { login, logout, addSlot, deleteSlot } from './actions'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type SlotWithBooking = {
  id: number
  date: string
  time: string
  isBooked: boolean
  booking: {
    name: string
    phone: string
    vehicleType: string
    service: string
    addOns: string
    message: string
  } | null
}

async function getSlots(): Promise<SlotWithBooking[]> {
  return prisma.timeSlot.findMany({
    include: { booking: true },
    orderBy: [{ date: 'asc' }, { time: 'asc' }],
  })
}

const cardStyle: React.CSSProperties = {
  background: 'rgba(8,16,35,0.75)', border: '1px solid rgba(26,111,255,0.15)',
  borderRadius: '12px', padding: '20px',
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { error?: string }
}) {
  const isAuthenticated = cookies().get('vx_admin')?.value === '1'

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: '#04060f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)' }}>
        <div style={{ ...cardStyle, width: '320px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '1.6rem', letterSpacing: '0.2em', marginBottom: '4px' }}>
            VELOCITY<span style={{ color: '#1a6fff' }}>X</span>
          </h1>
          <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '20px', letterSpacing: '0.1em' }}>ADMIN PANEL</p>
          {searchParams.error && (
            <p style={{ color: '#f87171', fontSize: '0.75rem', marginBottom: '12px' }}>Incorrect password.</p>
          )}
          <form action={login} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="password" name="password" placeholder="Password" required
              style={{ padding: '10px 12px', background: '#04060f', border: '1px solid rgba(26,111,255,0.2)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-body)' }}
            />
            <button type="submit" style={{ padding: '10px', background: '#1a6fff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>
              LOGIN
            </button>
          </form>
        </div>
      </div>
    )
  }

  const slots = await getSlots()

  return (
    <div style={{ minHeight: '100vh', background: '#04060f', padding: '40px 24px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: '2rem', letterSpacing: '0.2em' }}>
              VELOCITY<span style={{ color: '#1a6fff' }}>X</span> ADMIN
            </h1>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>SLOT MANAGEMENT</p>
          </div>
          <form action={logout}>
            <button type="submit" style={{ padding: '8px 16px', background: 'none', border: '1px solid rgba(26,111,255,0.25)', color: 'rgba(255,255,255,0.6)', borderRadius: '6px', cursor: 'pointer', fontSize: '0.7rem', letterSpacing: '0.1em', fontFamily: 'var(--font-body)' }}>
              LOGOUT
            </button>
          </form>
        </div>

        {/* Add Slot */}
        <div style={{ ...cardStyle, marginBottom: '24px' }}>
          <p style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.2em', fontWeight: 600, marginBottom: '14px' }}>ADD TIME SLOT</p>
          <form action={addSlot} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>DATE</label>
              <input
                type="date" name="date" required
                min={new Date().toISOString().split('T')[0]}
                style={{ padding: '8px 10px', background: '#04060f', border: '1px solid rgba(26,111,255,0.2)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-body)', colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.6rem', color: 'rgba(255,255,255,0.5)', marginBottom: '5px' }}>TIME</label>
              <input
                type="time" name="time" required
                style={{ padding: '8px 10px', background: '#04060f', border: '1px solid rgba(26,111,255,0.2)', color: '#fff', borderRadius: '6px', fontSize: '0.8rem', fontFamily: 'var(--font-body)', colorScheme: 'dark' }}
              />
            </div>
            <button type="submit" style={{ padding: '8px 18px', background: '#1a6fff', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.1em', fontFamily: 'var(--font-body)', boxShadow: '0 0 16px rgba(26,111,255,0.25)' }}>
              + ADD SLOT
            </button>
          </form>
        </div>

        {/* Slots Table */}
        <div style={cardStyle}>
          <p style={{ fontSize: '0.62rem', color: '#3b9eff', letterSpacing: '0.2em', fontWeight: 600, marginBottom: '16px' }}>
            ALL SLOTS ({slots.length})
          </p>
          {slots.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>No slots yet. Add one above.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {slots.map(slot => (
                <div
                  key={slot.id}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid rgba(26,111,255,0.06)',
                    gap: '12px', flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 500 }}>
                      {slot.date} · {slot.time}
                    </div>
                    {slot.booking && (
                      <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>
                        {slot.booking.name} · {slot.booking.phone} · {slot.booking.service}
                        {slot.booking.addOns && ` · ${slot.booking.addOns}`}
                        {slot.booking.message && ` · "${slot.booking.message}"`}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                      fontSize: '0.6rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 600,
                      background: slot.isBooked ? 'rgba(42,16,16,0.8)' : 'rgba(13,50,26,0.8)',
                      color: slot.isBooked ? '#f87171' : '#4ade80',
                      border: `1px solid ${slot.isBooked ? 'rgba(248,113,113,0.25)' : 'rgba(74,222,128,0.25)'}`,
                    }}>
                      {slot.isBooked ? 'BOOKED' : 'AVAILABLE'}
                    </span>
                    {!slot.isBooked && (
                      <form action={deleteSlot.bind(null, slot.id)}>
                        <button type="submit" style={{ padding: '4px 10px', background: 'none', border: '1px solid rgba(248,113,113,0.3)', color: '#f87171', borderRadius: '4px', cursor: 'pointer', fontSize: '0.62rem', fontFamily: 'var(--font-body)' }}>
                          DELETE
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update `app/admin/actions.ts` to add `addSlot` and `deleteSlot`**

Replace the entire file:
```ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  if (password === process.env.ADMIN_PASSWORD) {
    cookies().set('vx_admin', '1', { httpOnly: true, path: '/', sameSite: 'strict' })
    redirect('/admin')
  }
  redirect('/admin?error=1')
}

export async function logout() {
  cookies().delete('vx_admin')
  redirect('/admin')
}

export async function addSlot(formData: FormData) {
  const date = formData.get('date') as string
  const timeRaw = formData.get('time') as string

  const [hours, minutes] = timeRaw.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  const time = `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`

  await prisma.timeSlot.create({ data: { date, time } })
  redirect('/admin')
}

export async function deleteSlot(id: number) {
  await prisma.timeSlot.delete({ where: { id } })
  redirect('/admin')
}
```

- [ ] **Step 3: Verify admin panel end-to-end**

```bash
npm run dev
```
1. Visit `http://localhost:3000/admin`
2. Enter password `velocityx2026` → should see the slot management panel
3. Add a slot for tomorrow at 10:00 AM → should appear in the list as "Available"
4. Delete the slot → should disappear
5. Click Logout → should return to login form

- [ ] **Step 4: Commit**

```bash
git add app/admin/page.tsx app/admin/actions.ts
git commit -m "feat: complete admin panel with slot management and auth"
```

---

## Task 21: Final Verification + Cleanup

**Files:**
- Modify: `.gitignore`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Verify `.gitignore` has required entries**

Ensure `.gitignore` contains at minimum:
```
.env
.env.local
node_modules/
.next/
dev.db
*.db
CLAUDE.md
.claude/
.superpowers/
```

Add any missing entries.

- [ ] **Step 2: Run full test suite**

```bash
npm test
```
Expected: all tests pass.

- [ ] **Step 3: Run production build**

```bash
npm run build
```
Expected: build succeeds with no TypeScript errors.

- [ ] **Step 4: Update `CLAUDE.md`**

Replace contents of `CLAUDE.md` with:
```markdown
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VelocityX Auto Detailing — a fullstack Next.js 14 website for a premium mobile auto detailing service in Massachusetts. Single-page marketing site with booking form and admin panel.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start dev server at http://localhost:3000 |
| `npm run build` | Production build |
| `npm test` | Run Jest test suite |
| `npx prisma studio` | Open database browser |
| `npx prisma migrate dev` | Apply schema changes |
| `npx prisma db seed` | Seed sample time slots |

## Architecture

- **`app/page.tsx`** — Homepage, imports all section components
- **`app/admin/page.tsx`** — Server component: reads `vx_admin` HttpOnly cookie, shows login or panel
- **`app/admin/actions.ts`** — Server actions: login, logout, addSlot, deleteSlot
- **`app/api/slots/route.ts`** — GET available slots for a date
- **`app/api/bookings/route.ts`** — POST create booking (claims slot atomically)
- **`app/api/admin/slots/`** — Admin CRUD for slots
- **`components/`** — One component per section (Nav, Hero, About, BeforeAfter, Services, Fleet, WhatYouGet, Reviews, Booking, Footer)
- **`lib/db.ts`** — Prisma client singleton
- **`prisma/schema.prisma`** — TimeSlot + Booking models

## Environment

- **`.env`** — `DATABASE_URL=file:./dev.db` and `ADMIN_PASSWORD=velocityx2026`
- Admin password is plain string comparison (local use only)
- SQLite file is `dev.db` in project root (gitignored)

## Design System

See `design-system/velocityx-auto-detailing/MASTER.md` for full token reference.
Key: dark OLED background (`#04060f`), electric blue accent (`#1a6fff`), Bebas Neue display font, Jost body font.

## Before/After Images

Currently uses placeholder gradient divs. Replace `PlaceholderBefore` / `PlaceholderAfter` in `components/BeforeAfter.tsx` with real `<img>` tags when photos are available.
```

- [ ] **Step 5: Final commit**

```bash
git add .gitignore CLAUDE.md
git commit -m "chore: finalize gitignore and update CLAUDE.md with project docs"
```

- [ ] **Step 6: Verify full site at all breakpoints**

With `npm run dev` running, use browser DevTools to check at:
- 375px (mobile)
- 768px (tablet)
- 1024px (laptop)
- 1440px (desktop)

Verify: no horizontal scroll, nav hamburger works on mobile, all sections readable.
