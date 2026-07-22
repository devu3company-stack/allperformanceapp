import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export async function getCurrentAlunoProfile() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  return prisma.aluno.findFirst({
    where: {
      email: user.email,
      ativoNoApp: true,
    },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
      fotoUrl: true,
      status: true,
      unidadeTreino: true,
    },
  })
}
