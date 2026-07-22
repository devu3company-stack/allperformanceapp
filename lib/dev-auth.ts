import { cookies } from 'next/headers'

export type DevAuthRole = 'aluno' | 'gestor' | 'professor'

type DevAuthUser = {
  email: string
  password: string
  role: DevAuthRole
}

const DEV_AUTH_COOKIE = 'ap_dev_auth'

export const DEV_TEST_USERS: DevAuthUser[] = [
  {
    email: 'aluno.teste@allperformance.local',
    password: '12345678',
    role: 'aluno',
  },
  {
    email: 'gestor.teste@allperformance.local',
    password: '12345678',
    role: 'gestor',
  },
  {
    email: 'professor.teste@allperformance.local',
    password: '12345678',
    role: 'professor',
  },
]

export function isDevAuthEnabled() {
  return process.env.NODE_ENV === 'development'
}

export function getDevUserRedirectPath(role: DevAuthRole) {
  return role === 'aluno' ? '/feed' : '/dashboard'
}

export function findDevUserByCredentials(email: string, password: string) {
  if (!isDevAuthEnabled()) {
    return null
  }

  const normalizedEmail = email.trim().toLowerCase()

  return DEV_TEST_USERS.find(
    (user) => user.email === normalizedEmail && user.password === password
  ) ?? null
}

export function getDevAuthUser() {
  if (!isDevAuthEnabled()) {
    return null
  }

  const email = cookies().get(DEV_AUTH_COOKIE)?.value?.trim().toLowerCase()

  if (!email) {
    return null
  }

  return DEV_TEST_USERS.find((user) => user.email === email) ?? null
}

export function setDevAuthUser(email: string) {
  cookies().set(DEV_AUTH_COOKIE, email.trim().toLowerCase(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  })
}

export function clearDevAuthUser() {
  cookies().delete(DEV_AUTH_COOKIE)
}
