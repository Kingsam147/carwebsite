import { createSupabaseServerClient } from './supabase'

export async function isAdminAuthenticated(): Promise<boolean> {
  const supabase = await createSupabaseServerClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return false
  return user.email === process.env.ADMIN_EMAIL
}
