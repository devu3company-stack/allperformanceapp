'use server'

import prisma from '@/lib/prisma'
import { createAdminClient } from '@/lib/supabase/admin'
import { findAlunoByCpf, normalizeEmail, parseSpreadsheetDate } from '@/lib/alunos'

const allowedUnits = new Set(['ZERAO', 'BOSQUE'])

export type FirstAccessResult = {
  error?: string
  success?: string
}

export async function completeFirstAccess(formData: FormData): Promise<FirstAccessResult> {
  const email = normalizeEmail(String(formData.get('email') ?? ''))
  const cpf = String(formData.get('cpf') ?? '')
  const dataNascimento = parseSpreadsheetDate(String(formData.get('dataNascimento') ?? ''))
  const unidadeTreino = String(formData.get('unidadeTreino') ?? '').trim().toUpperCase()
  const password = String(formData.get('password') ?? '')
  const confirmPassword = String(formData.get('confirmPassword') ?? '')

  if (!email || !cpf || !dataNascimento || !allowedUnits.has(unidadeTreino)) {
    return { error: 'Preencha e-mail, CPF, data de nascimento e selecione sua unidade.' }
  }

  if (password.length < 8) {
    return { error: 'A senha precisa ter pelo menos 8 caracteres.' }
  }

  if (password !== confirmPassword) {
    return { error: 'A confirmação de senha não confere.' }
  }

  const aluno = await findAlunoByCpf(cpf)

  if (!aluno || !aluno.ativoNoApp) {
    return { error: 'Aluno não encontrado para primeiro acesso. Verifique o CPF informado.' }
  }

  if (aluno.email && normalizeEmail(aluno.email) !== email) {
    return { error: 'Este CPF já está vinculado a outro e-mail. Procure a recepção.' }
  }

  await prisma.aluno.update({
    where: { id: aluno.id },
    data: {
      email,
      dataNascimento,
      unidadeTreino: unidadeTreino as 'ZERAO' | 'BOSQUE',
    },
  })

  try {
    const supabaseAdmin = createAdminClient()
    const { error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: {
        role: 'aluno',
      },
      user_metadata: {
        role: 'aluno',
      },
    })

    if (error) {
      const message = error.message.toLowerCase()

      if (message.includes('already') || message.includes('registered')) {
        return { error: 'Primeiro acesso já realizado. Use a tela de login para entrar.' }
      }

      return { error: 'Não foi possível concluir o primeiro acesso agora.' }
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Erro ao configurar o primeiro acesso.',
    }
  }

  return { success: 'Primeiro acesso concluído. Agora você já pode entrar com seu e-mail e senha.' }
}
