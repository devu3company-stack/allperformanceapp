'use server'

import { revalidatePath } from 'next/cache'
import * as XLSX from 'xlsx'
import prisma from '@/lib/prisma'
import { getDefaultAcademiaId } from '@/lib/academia'
import { getDevAuthUser } from '@/lib/dev-auth'
import { createClient } from '@/lib/supabase/server'
import {
  coerceStatusAluno,
  normalizeCpf,
  normalizeEmail,
  parseSpreadsheetDate,
} from '@/lib/alunos'

export type ImportStudentsResult = {
  error?: string
  success?: string
  created?: number
  updated?: number
  ignored?: number
  errors?: string[]
}

export type SaveStudentWorkoutResult = {
  error?: string
  success?: string
  updatedLabel?: string | null
}

function normalizeHeader(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

function getValue(row: Record<string, unknown>, candidates: string[]) {
  const candidateSet = new Set(candidates.map(normalizeHeader))
  const entry = Object.entries(row).find(([key]) => candidateSet.has(normalizeHeader(key)))

  return entry?.[1]
}

async function getCurrentStaffContext() {
  const devUser = getDevAuthUser()
  let email = devUser && devUser.role !== 'aluno' ? devUser.email : null

  if (!email) {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    email = user?.email?.trim().toLowerCase() ?? null
  }

  if (!email) {
    return null
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email },
    select: {
      academiaId: true,
      nome: true,
      ativo: true,
    },
  })

  if (usuario?.ativo) {
    return {
      academiaId: usuario.academiaId,
      nome: usuario.nome,
    }
  }

  const professor = await prisma.professor.findFirst({
    where: {
      email,
      ativo: true,
    },
    select: {
      academiaId: true,
      nome: true,
    },
  })

  if (!professor) {
    return null
  }

  return {
    academiaId: professor.academiaId,
    nome: professor.nome,
  }
}

export async function importStudentsSpreadsheet(formData: FormData): Promise<ImportStudentsResult> {
  const file = formData.get('file')

  if (!(file instanceof File)) {
    return { error: 'Selecione um arquivo .csv, .xls ou .xlsx para importar.' }
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  const workbook = XLSX.read(buffer, { type: 'buffer', cellDates: true })
  const sheetName = workbook.SheetNames[0]

  if (!sheetName) {
    return { error: 'A planilha não possui abas válidas.' }
  }

  const sheet = workbook.Sheets[sheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' })

  if (rows.length === 0) {
    return { error: 'A planilha está vazia.' }
  }

  const academiaId = await getDefaultAcademiaId()
  let created = 0
  let updated = 0
  let ignored = 0
  const errors: string[] = []

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index]
    const nome = String(getValue(row, ['nome', 'aluno']) ?? '').trim()
    const cpf = normalizeCpf(String(getValue(row, ['cpf']) ?? ''))
    const email = normalizeEmail(String(getValue(row, ['email', 'e-mail']) ?? ''))
    const telefone = String(getValue(row, ['telefone', 'celular']) ?? '').trim() || null
    const dataNascimento = parseSpreadsheetDate(
      getValue(row, ['data nascimento', 'data de nascimento', 'aniversario', 'data aniversario', 'nascimento'])
    )
    const status = coerceStatusAluno(getValue(row, ['status']))

    if (!nome && !cpf) {
      ignored += 1
      continue
    }

    if (!nome || !cpf) {
      ignored += 1
      errors.push(`Linha ${index + 2}: nome e CPF são obrigatórios.`)
      continue
    }

    const existingAluno = await prisma.aluno.findUnique({
      where: {
        academiaId_cpf: {
          academiaId,
          cpf,
        },
      },
      select: {
        id: true,
        dataNascimento: true,
      },
    })

    await prisma.aluno.upsert({
      where: {
        academiaId_cpf: {
          academiaId,
          cpf,
        },
      },
      update: {
        nome,
        email,
        telefone,
        status,
        ativoNoApp: true,
        dataNascimento: dataNascimento ?? existingAluno?.dataNascimento ?? null,
      },
      create: {
        academiaId,
        nome,
        cpf,
        email,
        telefone,
        status,
        ativoNoApp: true,
        dataNascimento,
      },
    })

    if (existingAluno) {
      updated += 1
    } else {
      created += 1
    }
  }

  revalidatePath('/alunos')

  return {
    success: 'Importação concluída com sucesso.',
    created,
    updated,
    ignored,
    errors,
  }
}

export async function saveStudentWorkout(formData: FormData): Promise<SaveStudentWorkoutResult> {
  const actor = await getCurrentStaffContext()

  if (!actor) {
    return { error: 'Apenas professores e equipe interna podem editar treinos.' }
  }

  const alunoId = String(formData.get('alunoId') ?? '').trim()
  const treinoPersonalizado = String(formData.get('treinoPersonalizado') ?? '').trim()

  if (!alunoId) {
    return { error: 'Aluno inválido.' }
  }

  const treinoAtualizadoEm = treinoPersonalizado ? new Date() : null

  try {
    const result = await prisma.aluno.updateMany({
      where: {
        id: alunoId,
        academiaId: actor.academiaId,
      },
      data: {
        treinoPersonalizado: treinoPersonalizado || null,
        treinoAtualizadoEm,
        treinoAtualizadoPor: treinoPersonalizado ? actor.nome : null,
      },
    })

    if (result.count === 0) {
      return { error: 'Não foi possível localizar esse aluno para salvar o treino.' }
    }

    revalidatePath('/alunos')
    revalidatePath('/treino')

    return {
      success: treinoPersonalizado ? 'Treino salvo com sucesso.' : 'Treino removido com sucesso.',
      updatedLabel: treinoAtualizadoEm
        ? `Atualizado em ${treinoAtualizadoEm.toLocaleString('pt-BR', {
            dateStyle: 'short',
            timeStyle: 'short',
          })} por ${actor.nome}`
        : null,
    }
  } catch {
    return { error: 'Não foi possível salvar o treino agora.' }
  }
}
