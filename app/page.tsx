import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRedirectPathFromRole, resolveAccessByEmail } from '@/lib/access'
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

  const redirectPathFromRole = getRedirectPathFromRole(
    user.app_metadata?.role ?? user.user_metadata?.role
  )

  if (redirectPathFromRole) {
    redirect(redirectPathFromRole)
  }

  let redirectPath = null

  try {
    redirectPath = await resolveAccessByEmail(user.email)
  } catch {
    redirect('/login')
  }

  redirect(redirectPath ?? '/login')
}
