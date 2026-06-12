-- Run this in the Supabase SQL editor after running prisma migrate deploy
-- to enable Row Level Security on all tables.

-- ── _prisma_migrations ────────────────────────────────────────────────────────
-- Prisma's internal migration tracking table. Enable RLS with no policies so
-- it is completely blocked from the Supabase API. Prisma manages it via the
-- direct connection (DIRECT_URL / service role) only.

ALTER TABLE _prisma_migrations ENABLE ROW LEVEL SECURITY;

-- ── TimeSlot ─────────────────────────────────────────────────────────────────

ALTER TABLE "TimeSlot" ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can read time slots
CREATE POLICY "timeslot_public_select"
ON "TimeSlot" FOR SELECT
TO anon, authenticated
USING (true);

-- Only service role (server-side Prisma) can write time slots
CREATE POLICY "timeslot_service_insert"
ON "TimeSlot" FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "timeslot_service_update"
ON "TimeSlot" FOR UPDATE
TO service_role
USING (true);

CREATE POLICY "timeslot_service_delete"
ON "TimeSlot" FOR DELETE
TO service_role
USING (true);

-- ── Booking ───────────────────────────────────────────────────────────────────

ALTER TABLE "Booking" ENABLE ROW LEVEL SECURITY;

-- Authenticated users can create bookings (requires login)
CREATE POLICY "booking_auth_insert"
ON "Booking" FOR INSERT
TO authenticated
WITH CHECK (true);

-- Users can read their own bookings
CREATE POLICY "booking_user_select"
ON "Booking" FOR SELECT
TO authenticated
USING (auth.uid()::text = "userId");

-- Users can update their own bookings
CREATE POLICY "booking_user_update"
ON "Booking" FOR UPDATE
TO authenticated
USING (auth.uid()::text = "userId");

-- Users can cancel (delete) their own bookings
CREATE POLICY "booking_user_delete"
ON "Booking" FOR DELETE
TO authenticated
USING (auth.uid()::text = "userId");

-- Service role (server-side Prisma) can do everything — admin panel reads all
CREATE POLICY "booking_service_all"
ON "Booking" FOR ALL
TO service_role
USING (true);
