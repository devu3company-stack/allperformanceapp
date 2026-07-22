'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { clearDevAuthUser } from '@/lib/dev-auth'
import { createClient } from '@/lib/supabase/server'

export async function logout() {
  clearDevAuthUser()

  try {
    const supabase = createClient()
    await supabase.auth.signOut()
  } catch {}

  revalidatePath('/', 'layout')
  redirect('/login')
}
