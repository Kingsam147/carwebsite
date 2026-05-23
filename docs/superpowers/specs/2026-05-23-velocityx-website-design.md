# VelocityX Auto Detailing — Website Design Spec

**Date:** 2026-05-23  
**Project:** VelocityX Auto Detailing  
**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · SQLite (Prisma) · Lucide React icons

---

## 1. Project Overview

A fullstack marketing and booking website for VelocityX Auto Detailing — a premium mobile auto detailing service serving Massachusetts. The site lets customers browse services, view pricing, and book appointments. An admin panel at `/admin` lets the owner manage available time slots and view incoming bookings.

---

## 2. Design System

### Colors (CSS Variables)
| Variable | Value | Usage |
|---|---|---|
| `--bg-base` | `#04060f` | Page background (OLED dark) |
| `--bg-surface` | `#080d1a` | Alternating section background |
| `--bg-card` | `rgba(8,16,35,0.75)` | Glass cards |
| `--accent-blue` | `#1a6fff` | Buttons, active states |
| `--accent-glow` | `#3b9eff` | Eyebrow labels, icons, borders |
| `--accent-dim` | `rgba(26,111,255,0.15)` | Icon backgrounds, badge fills |
| `--text-primary` | `#ffffff` | All body text |
| `--border-subtle` | `rgba(26,111,255,0.18)` | Card and section borders |
| `--glow-sm` | `0 0 16px rgba(26,111,255,0.25)` | Button and icon glow |
| `--glow-md` | `0 0 32px rgba(26,111,255,0.35)` | Slider handle, featured glow |

### Typography
| Role | Font | Weight |
|---|---|---|
| Display / headings | Bebas Neue | 400 |
| Body / UI | Jost | 300, 400, 500, 600, 700 |

Google Fonts import:
```
https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Jost:wght@300;400;500;600;700&display=swap
```

### Style
- **Dark OLED** base — deep `#04060f` background, no white
- **Liquid Glass** cards — `backdrop-filter: blur(12px)` on all cards, modals, and nav
- **Electric blue glow** — `box-shadow` glow on all interactive elements
- **Bebas Neue** uppercase condensed headers — automotive bold feel
- Icons: **Lucide React** SVGs only — no emojis as icons anywhere

### UX Rules (from UI/UX Pro Max)
- `cursor-pointer` on all clickable elements
- Hover transitions: `all 200ms ease`
- Respect `prefers-reduced-motion` — wrap all animations
- `scroll-behavior: smooth` on `html`
- Responsive breakpoints: 375px, 768px, 1024px, 1440px
- Minimum 44×44px touch targets on mobile
- All images have `alt` text
- All form inputs have `<label>` elements

---

## 3. Architecture

### Tech Stack
- **Framework:** Next.js 14, App Router, TypeScript
- **Styling:** Tailwind CSS with CSS custom properties for the design system
- **Database:** SQLite via Prisma ORM
- **Icons:** Lucide React
- **Before/After slider:** `react-compare-slider` (lightweight, no extra deps)
- **Reviews carousel:** CSS scroll-snap (no extra dep)

### Project Structure
```
/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Homepage (all 9 sections)
│   ├── admin/
│   │   ├── page.tsx        # Admin login gate + panel
│   │   └── actions.ts      # Server actions: add/delete slots, view bookings
│   └── api/
│       ├── bookings/
│       │   └── route.ts    # POST: submit booking, claim slot
│       ├── slots/
│       │   └── route.ts    # GET: available slots for a given date
│       └── admin/
│           ├── slots/
│           │   └── route.ts      # GET all slots; POST add slot
│           └── slots/[id]/
│               └── route.ts      # DELETE slot by id
├── components/
│   ├── Nav.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── BeforeAfter.tsx
│   ├── Services.tsx
│   ├── Fleet.tsx
│   ├── WhatYouGet.tsx
│   ├── Reviews.tsx
│   ├── Booking.tsx
│   └── Footer.tsx
├── lib/
│   └── db.ts               # Prisma client singleton
├── prisma/
│   ├── schema.prisma
│   └── seed.ts             # Seeds initial time slots
└── .env                    # DATABASE_URL, ADMIN_PASSWORD
```

### Database Schema
```prisma
model TimeSlot {
  id        Int       @id @default(autoincrement())
  date      String    // "2026-06-07"
  time      String    // "10:00 AM"
  isBooked  Boolean   @default(false)
  booking   Booking?
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

### API Routes
| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/slots?date=YYYY-MM-DD` | Returns available (unbooked) slots for a date |
| `POST` | `/api/bookings` | Creates booking, marks slot as booked |
| `GET` | `/api/admin/slots` | Returns all slots with booking info (admin) |
| `POST` | `/api/admin/slots` | Adds a new time slot (admin) |
| `DELETE` | `/api/admin/slots/[id]` | Deletes a slot (admin) |

### Admin Authentication
- Password stored in `.env` as `ADMIN_PASSWORD` (plain string — local use only)
- Login form POSTs to a server action that compares the submitted password directly against `process.env.ADMIN_PASSWORD`
- On success, server action sets an `HttpOnly` cookie (`vx_admin=1`) — middleware checks this cookie before rendering `/admin`
- No auth library needed — single owner, local deployment

---

## 4. Page Sections

### Homepage (`/`)
All sections render as a single scrolling page. Nav links anchor-scroll to each section.

| # | Section | Key Content |
|---|---|---|
| Nav | Sticky glass navbar | Logo, 6 nav links, BOOK NOW CTA |
| 1 | Hero | Cinematic dark bg, "AUTO / DETAILING" heading, tagline, BOOK NOW + CALL/TEXT buttons, 10% off promo banner |
| 2 | About | "Why VelocityX?" eyebrow, 5 benefit items with Lucide icons |
| 3 | Before & After | "Real Results" heading, 3 drag-slider comparisons with captions |
| 4 | Services | Cars & SUVs pricing — 3 cards (Light $110 / Medium $130 / Heavy $150), add-ons strip, BOOK SERVICE CTA |
| 5 | Fleet & Commercial | Two pricing tables (size/condition + flat rate), GET QUOTE CTA |
| 6 | What You Get | 4 icon cards with Lucide SVGs |
| 7 | Reviews | 3 review cards with star ratings, reviewer avatars, CSS scroll-snap carousel dots |
| 8 | Contact & Booking | 2-col layout: booking form (left) + contact info + action buttons (right) |
| 9 | Footer | Logo, tagline, 4 social icons (Instagram, Snapchat, TikTok, YouTube), quick links, contact, copyright |

### Contact Info (hardcoded)
- **Phone:** 774-699-0103
- **Email:** autodetailingvelocity@gmail.com
- **Instagram:** @VelocityX.Auto
- **Snapchat:** velocityxauto
- **TikTok:** Velocityxauto
- **YouTube:** VelocityX_Auto

### Booking Form Fields
- Full Name (text, required)
- Phone (tel, required)
- Vehicle Type (text, required)
- Service Needed (select: Full Detail Light / Medium / Heavy, Fleet Small / Standard / Large, Tow/Bus)
- Add-Ons (multi-select checkboxes: Engine Bay +$30, Headlight Restoration +$40, Odor/Scratch Removal +$50)
- Preferred Date (date picker — triggers slot fetch)
- Available Time Slot (select, populated from `/api/slots?date=`)
- Message (textarea, optional)

### Admin Panel (`/admin`)
- Password gate renders a centered login card on first visit
- On auth: shows full slot management table
  - Add slot form: date + time inputs + Add button
  - Slots table: date, time, status badge (Available / Booked), booking details if booked, Delete button
  - Export bookings as CSV (client-side, from fetched data)

---

## 5. Placeholder Content

The following sections use placeholder content to be replaced with real assets:

- **Before & After:** 6 placeholder image pairs (before/after for each of 3 sliders). Captions: "Heavy interior reset", "Work truck transformation", "Full interior extraction"
- **Reviews:** 3 hardcoded reviews from the PDF (Mike R., James T., Sarah M.) with initials-based avatars — no photos needed at launch
- **Hero background:** CSS gradient (dark navy → electric blue glow) — can swap for a real photo/video later

---

## 6. Responsive Behavior

| Breakpoint | Key Changes |
|---|---|
| 375px | Single column everywhere; nav collapses to hamburger menu; hero text scales down |
| 768px | 2-col grid for about, booking; service cards stack to 1 col |
| 1024px | 3-col service cards; fleet table full width |
| 1440px | Max content width capped at `max-w-6xl` (1152px) centered |

---

## 7. Out of Scope

- Google review integration (noted in PDF as "add later")
- Real photo uploads for before/after
- Email notifications on booking submission
- Payment processing
