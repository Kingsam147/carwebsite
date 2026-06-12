-- Run this in the Supabase SQL editor after running prisma migrate deploy
-- to enable Row Level Security on both tables.

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

-- Anon users can create bookings (public booking form)
CREATE POLICY "booking_anon_insert"
ON "Booking" FOR INSERT
TO anon
WITH CHECK (true);

-- Only service role (server-side Prisma) can read or modify bookings
CREATE POLICY "booking_service_all"
ON "Booking" FOR ALL
TO service_role
USING (true);
