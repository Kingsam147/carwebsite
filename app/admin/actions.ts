'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/db'

export async function login(formData: FormData) {
  const password = formData.get('password') as string
  if (password === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('vx_admin', '1', { httpOnly: true, path: '/', sameSite: 'strict', maxAge: 60 * 60 * 8 })
    redirect('/admin')
  }
  redirect('/admin?error=1')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('vx_admin')
  redirect('/admin')
}

export async function addSlot(formData: FormData) {
  const date = formData.get('date') as string
  const timeRaw = formData.get('time') as string

  if (!date || !timeRaw) return

  const [hours, minutes] = timeRaw.split(':').map(Number)
  const hour = hours % 12 || 12
  const period = hours >= 12 ? 'PM' : 'AM'
  const time = `${hour}:${String(minutes).padStart(2, '0')} ${period}`

  await prisma.timeSlot.create({ data: { date, time } })
  redirect('/admin')
}

export async function deleteSlot(slotId: number) {
  const slot = await prisma.timeSlot.findUnique({ where: { id: slotId } })
  if (!slot) return
  if (slot.isBooked) {
    await prisma.booking.delete({ where: { slotId } })
  }
  await prisma.timeSlot.delete({ where: { id: slotId } })
  redirect('/admin')
}
