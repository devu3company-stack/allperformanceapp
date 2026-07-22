import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { resolveAccessByEmail } from '@/lib/access'
import { getDevAuthUser, getDevUserRedirectPath } from '@/lib/dev-auth'

export default async function HomePage() {
  const devUser = getDevAuthUser()

  if (devUser) {
    redirect(getDevUserRedirectPath(devUser.role))
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user?.email) {
    redirect('/login')
  }

  const redirectPath = await resolveAccessByEmail(user.email)

  redirect(redirectPath ?? '/login')
}
