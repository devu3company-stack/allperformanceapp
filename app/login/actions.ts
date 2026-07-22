'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRedirectPathFromRole, resolveAccessByEmail } from '@/lib/access'
import {
  clearDevAuthUser,
  findDevUserByCredentials,
  getDevUserRedirectPath,
  setDevAuthUser,
} from '@/lib/dev-auth'

export async function login(formData: FormData) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')

  const devUser = findDevUserByCredentials(email, password)

  if (devUser) {
    setDevAuthUser(devUser.email)
    revalidatePath('/', 'layout')
    redirect(getDevUserRedirectPath(devUser.role))
  }

  clearDevAuthUser()

  const supabase = createClient()

  const { error, data: authData } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: 'E-mail ou senha incorretos' }
  }

  const redirectPathFromRole = getRedirectPathFromRole(
    authData.user?.app_metadata?.role ?? authData.user?.user_metadata?.role
  )

  if (redirectPathFromRole) {
    revalidatePath('/', 'layout')
    redirect(redirectPathFromRole)
  }

  let redirectPath = null

  try {
    redirectPath = await resolveAccessByEmail(email)
  } catch {
    await supabase.auth.signOut()
    return { error: 'Não foi possível validar o perfil de acesso no momento.' }
  }

  if (redirectPath) {
    revalidatePath('/', 'layout')
    redirect(redirectPath)
  }

  // Se não encontrar usuário, professor ou aluno, faz logout por segurança
  await supabase.auth.signOut()
  return { error: 'Usuário não encontrado no sistema' }
}
