import { addDays, startOfDay } from 'date-fns'
import prisma from '@/lib/prisma'
import { formatBirthdayForMessage, hasBirthdayOnDate } from '@/lib/alunos'

export type BirthdayNotification = {
  alunoId: string
  nome: string
  email: string | null
  telefone: string | null
  birthdayDate: Date
  notifyDate: Date
  leadDays: number
  message: string
}

export function getBirthdayNotificationDates(referenceDate = new Date()) {
  const baseDate = startOfDay(referenceDate)
  const targets = [
    {
      notifyDate: addDays(baseDate, 1),
      leadDays: 1,
    },
  ]

  if (baseDate.getDay() === 5) {
    targets.push({
      notifyDate: addDays(baseDate, 2),
      leadDays: 2,
    })
  }

  return targets
}

export async function findBirthdayNotifications(referenceDate = new Date()) {
  const targets = getBirthdayNotificationDates(referenceDate)
  const alunos = await prisma.aluno.findMany({
    where: {
      ativoNoApp: true,
      status: 'ATIVO',
      dataNascimento: { not: null },
    },
    select: {
      id: true,
      nome: true,
      email: true,
      telefone: true,
      dataNascimento: true,
    },
    orderBy: { nome: 'asc' },
  })

  return alunos.flatMap((aluno) => {
    const match = targets.find((target) => hasBirthdayOnDate(aluno, target.notifyDate))

    if (!match || !aluno.dataNascimento) {
      return []
    }

    const message = match.leadDays === 2
      ? `${aluno.nome} faz aniversário em ${formatBirthdayForMessage(match.notifyDate)} (domingo). Avisar hoje para a comunidade comemorar na sexta.`
      : `${aluno.nome} faz aniversário em ${formatBirthdayForMessage(match.notifyDate)}. Avisar a comunidade hoje.`

    return [{
      alunoId: aluno.id,
      nome: aluno.nome,
      email: aluno.email,
      telefone: aluno.telefone,
      birthdayDate: aluno.dataNascimento,
      notifyDate: match.notifyDate,
      leadDays: match.leadDays,
      message,
    } satisfies BirthdayNotification]
  })
}
