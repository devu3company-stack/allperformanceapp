import type { Aluno } from '@prisma/client'
import { StatusAluno } from '@prisma/client'
import prisma from '@/lib/prisma'

export function normalizeCpf(value: string) {
  return value.replace(/\D/g, '')
}

export function normalizeEmail(value: string) {
  const normalized = value.trim().toLowerCase()
  return normalized ? normalized : null
}

export function coerceStatusAluno(value: unknown) {
  const normalized = String(value ?? '').trim().toUpperCase()

  switch (normalized) {
    case 'ATIVO':
      return StatusAluno.ATIVO
    case 'INATIVO':
      return StatusAluno.INATIVO
    case 'SUSPENSO':
      return StatusAluno.SUSPENSO
    case 'INADIMPLENTE':
      return StatusAluno.INADIMPLENTE
    default:
      return StatusAluno.ATIVO
  }
}

export function parseSpreadsheetDate(value: unknown) {
  if (!value) {
    return null
  }

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    const utcDays = Math.floor(value - 25569)
    const utcValue = utcDays * 86400
    const parsedDate = new Date(utcValue * 1000)

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
  }

  if (typeof value !== 'string') {
    return null
  }

  const normalized = value.trim()

  if (!normalized) {
    return null
  }

  const isoDate = new Date(normalized)

  if (!Number.isNaN(isoDate.getTime())) {
    return isoDate
  }

  const match = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)

  if (!match) {
    return null
  }

  const [, day, month, year] = match
  const parsedDate = new Date(`${year}-${month}-${day}T00:00:00`)

  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

export async function findAlunoByEmailAndCpf(email: string, cpf: string) {
  const normalizedEmail = normalizeEmail(email)
  const normalizedCpf = normalizeCpf(cpf)

  if (!normalizedEmail || !normalizedCpf) {
    return null
  }

  const alunos = await prisma.aluno.findMany({
    where: { email: normalizedEmail },
  })

  return alunos.find((aluno) => normalizeCpf(aluno.cpf) === normalizedCpf) ?? null
}

export async function findAlunoByCpf(cpf: string) {
  const normalizedCpf = normalizeCpf(cpf)

  if (!normalizedCpf) {
    return null
  }

  const alunos = await prisma.aluno.findMany()

  return alunos.find((aluno) => normalizeCpf(aluno.cpf) === normalizedCpf) ?? null
}

export function formatBirthdayForMessage(date: Date) {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
}

export function hasBirthdayOnDate(aluno: Pick<Aluno, 'dataNascimento'>, date: Date) {
  if (!aluno.dataNascimento) {
    return false
  }

  return (
    aluno.dataNascimento.getDate() === date.getDate() &&
    aluno.dataNascimento.getMonth() === date.getMonth()
  )
}
