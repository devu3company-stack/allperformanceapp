'use server'

import { revalidatePath } from 'next/cache'
import * as XLSX from 'xlsx'
import prisma from '@/lib/prisma'
import { getDefaultAcademiaId } from '@/lib/academia'
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
