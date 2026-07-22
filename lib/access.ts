import prisma from '@/lib/prisma'

export type AppRedirectPath = '/dashboard' | '/feed'

export function getRedirectPathFromRole(role: unknown): AppRedirectPath | null {
  const normalizedRole = String(role ?? '').trim().toLowerCase()

  if (!normalizedRole) {
    return null
  }

  if (normalizedRole === 'aluno') {
    return '/feed'
  }

  if (['gestor', 'admin', 'recepcao', 'professor'].includes(normalizedRole)) {
    return '/dashboard'
  }

  return null
}

export async function resolveAccessByEmail(email: string): Promise<AppRedirectPath | null> {
  const normalizedEmail = email.trim().toLowerCase()

  const usuario = await prisma.usuario.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      ativo: true,
    },
  })

  if (usuario?.ativo) {
    return '/dashboard'
  }

  const professor = await prisma.professor.findFirst({
    where: {
      email: normalizedEmail,
      ativo: true,
    },
    select: { id: true },
  })

  if (professor) {
    return '/dashboard'
  }

  const aluno = await prisma.aluno.findFirst({
    where: {
      email: normalizedEmail,
      ativoNoApp: true,
    },
    select: { id: true },
  })

  if (aluno) {
    return '/feed'
  }

  return null
}
