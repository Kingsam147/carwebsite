import { z } from 'zod'

export const bookingCreateSchema = z.object({
  vehicleType: z.string().trim().min(1, 'Vehicle type is required').max(100),
  service: z.string().trim().min(1, 'Service is required').max(100),
  addOns: z.string().trim().max(500).default(''),
  message: z.string().trim().max(500).default(''),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time: z.string().trim().min(1, 'Time is required').max(20),
})

export const bookingUpdateSchema = z.object({
  vehicleType: z.string().trim().min(1).max(100).optional(),
  service: z.string().trim().min(1).max(100).optional(),
  addOns: z.string().trim().max(500).optional(),
  message: z.string().trim().max(500).optional(),
})

export const slotCreateSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z.string().trim().min(1).max(20),
})

export const adminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const userSignupSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-(). ]{7,20}$/, 'Invalid phone number')
    .max(20),
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const userLoginSchema = z.object({
  email: z.string().trim().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

export const userProfileUpdateSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d\s\-(). ]{7,20}$/, 'Invalid phone number')
    .max(20),
})
