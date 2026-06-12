import 'dotenv/config'
import { PrismaClient } from '../lib/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

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
    await prisma.timeSlot.create({ data: slot })
  }

  console.log('Seeded', slots.length, 'time slots')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
