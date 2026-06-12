import { z } from 'zod'

export const bookingCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-(). ]{7,20}$/, 'Invalid phone number')
    .max(20),
  vehicleType: z.string().min(1, 'Vehicle type is required').max(100),
  service: z.string().min(1, 'Service is required').max(100),
  addOns: z.string().max(500).default(''),
  message: z.string().max(500).default(''),
  slotId: z.number().int().positive('Slot ID must be a positive integer'),
})

export const slotCreateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().min(1).max(20),
})

export const adminLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
