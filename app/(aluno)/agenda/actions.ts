'use server'

import { subMinutes } from 'date-fns'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

async function getCurrentAlunoId() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  const aluno = await prisma.aluno.findFirst({
    where: {
      email: user.email,
      ativoNoApp: true,
    },
    select: { id: true },
  })

  return aluno?.id ?? null
}

export async function toggleBooking(formData: FormData) {
  const aulaId = String(formData.get('aulaId') ?? '')

  if (!aulaId) {
    return
  }

  const alunoId = await getCurrentAlunoId()

  if (!alunoId) {
    return
  }

  const existingBooking = await prisma.agendamento.findUnique({
    where: {
      alunoId_aulaId: {
        alunoId,
        aulaId,
      },
    },
    select: {
      cancelado: true,
    },
  })

  if (existingBooking && !existingBooking.cancelado) {
    await prisma.agendamento.update({
      where: {
        alunoId_aulaId: {
          alunoId,
          aulaId,
        },
      },
      data: {
        cancelado: true,
      },
    })

    revalidatePath('/agenda')
    return
  }

  const [aula, activeBookings] = await Promise.all([
    prisma.aula.findUnique({
      where: { id: aulaId },
      include: {
        turma: {
          select: {
            capacidade: true,
          },
        },
      },
    }),
    prisma.agendamento.count({
      where: {
        aulaId,
        cancelado: false,
      },
    }),
  ])

  if (!aula || aula.cancelada || activeBookings >= aula.turma.capacidade) {
    return
  }

  if (new Date() >= subMinutes(aula.data, 30)) {
    return
  }

  if (existingBooking?.cancelado) {
    await prisma.agendamento.update({
      where: {
        alunoId_aulaId: {
          alunoId,
          aulaId,
        },
      },
      data: {
        cancelado: false,
      },
    })
  } else {
    await prisma.agendamento.create({
      data: {
        alunoId,
        aulaId,
      },
    })
  }

  revalidatePath('/agenda')
}
