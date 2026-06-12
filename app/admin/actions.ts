'use server'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase'
import { checkRateLimitByIp } from '@/lib/rateLimiter'
import { createSlot, deleteSlot } from '@/services/slotService'

export async function login(formData: FormData) {
  const headerStore = await headers()
  const ip =
    headerStore.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'

  const allowed = await checkRateLimitByIp(ip, {
    prefix: 'auth',
    maxRequests: 5,
    windowSeconds: 60,
  })
  if (!allowed) redirect('/admin?error=rate_limit')

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) redirect('/admin?error=1')

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user || data.user.email !== process.env.ADMIN_EMAIL) {
    if (data?.user) await supabase.auth.signOut()
    redirect('/admin?error=1')
  }

  redirect('/admin')
}

export async function logout() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
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

  await createSlot(date, time)
  redirect('/admin')
}

export async function removeSlot(slotId: number) {
  await deleteSlot(slotId)
  redirect('/admin')
}
