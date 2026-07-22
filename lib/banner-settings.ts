import { cache } from 'react'
import prisma from '@/lib/prisma'
import { getDefaultAcademiaId } from '@/lib/academia'

export type BannerSettings = {
  mobileUrl: string | null
  webUrl: string | null
}

function normalizeBannerUrl(value: string) {
  const normalized = value.trim()
  return normalized ? normalized : null
}

export const getBannerSettings = cache(async (): Promise<BannerSettings> => {
  try {
    const academiaId = await getDefaultAcademiaId()
    const config = await prisma.configuracaoAcademia.findUnique({
      where: { academiaId },
      select: {
        bannerMobileUrl: true,
        bannerWebUrl: true,
      },
    })

    return {
      mobileUrl: config?.bannerMobileUrl ?? null,
      webUrl: config?.bannerWebUrl ?? null,
    }
  } catch {
    return {
      mobileUrl: null,
      webUrl: null,
    }
  }
})

export async function saveBannerSettings(mobileUrl: string, webUrl: string) {
  const academiaId = await getDefaultAcademiaId()

  await prisma.configuracaoAcademia.upsert({
    where: { academiaId },
    update: {
      bannerMobileUrl: normalizeBannerUrl(mobileUrl),
      bannerWebUrl: normalizeBannerUrl(webUrl),
    },
    create: {
      academiaId,
      feedModeracaoAtiva: true,
      permiteComentarios: true,
      bannerMobileUrl: normalizeBannerUrl(mobileUrl),
      bannerWebUrl: normalizeBannerUrl(webUrl),
    },
  })
}
