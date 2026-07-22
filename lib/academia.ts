import prisma from '@/lib/prisma'

export async function getDefaultAcademiaId() {
  const academia = await prisma.academia.findFirst({
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  })

  if (!academia) {
    throw new Error('Nenhuma academia cadastrada para receber a importação.')
  }

  return academia.id
}

export async function getDefaultAcademia() {
  const academia = await prisma.academia.findFirst({
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      nome: true,
      nextFitApiKey: true,
      nextFitAcademiaId: true,
    },
  })

  if (!academia) {
    throw new Error('Nenhuma academia cadastrada para configurar o sistema.')
  }

  return academia
}

export async function saveNextFitSettings(apiKey: string, academiaExternaId: string) {
  const academia = await getDefaultAcademia()

  await prisma.academia.update({
    where: { id: academia.id },
    data: {
      nextFitApiKey: apiKey.trim() || null,
      nextFitAcademiaId: academiaExternaId.trim() || null,
    },
  })
}
