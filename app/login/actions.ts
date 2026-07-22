'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { resolveAccessByEmail } from '@/lib/access'
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

  const redirectPath = await resolveAccessByEmail(email)

  if (redirectPath) {
    revalidatePath('/', 'layout')
    redirect(redirectPath)
  }

  // Se não encontrar usuário, professor ou aluno, faz logout por segurança
  await supabase.auth.signOut()
  return { error: 'Usuário não encontrado no sistema' }
}
