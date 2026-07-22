import { cache } from 'react'
import prisma from '@/lib/prisma'
import { getDefaultAcademiaId } from '@/lib/academia'
import { createAdminClient } from '@/lib/supabase/admin'

export type BannerSettings = {
  mobileUrl: string | null
  webUrl: string | null
}

const BANNER_BUCKET = 'system-banners'

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

function getFileExtension(file: File) {
  const fileNameExtension = file.name.split('.').pop()?.trim().toLowerCase()

  if (fileNameExtension) {
    return fileNameExtension
  }

  if (file.type === 'image/png') {
    return 'png'
  }

  if (file.type === 'image/webp') {
    return 'webp'
  }

  if (file.type === 'image/jpeg') {
    return 'jpg'
  }

  return 'bin'
}

async function ensureBannerBucket() {
  const supabaseAdmin = createAdminClient()
  const { error } = await supabaseAdmin.storage.createBucket(BANNER_BUCKET, {
    public: true,
    fileSizeLimit: 5 * 1024 * 1024,
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
  })

  if (error && !error.message.toLowerCase().includes('already exists')) {
    throw error
  }

  return supabaseAdmin
}

export async function uploadBannerFile(file: File, variant: 'mobile' | 'web') {
  const supabaseAdmin = await ensureBannerBucket()
  const extension = getFileExtension(file)
  const filePath = `${variant}/banner-${Date.now()}.${extension}`
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  const { error } = await supabaseAdmin.storage
    .from(BANNER_BUCKET)
    .upload(filePath, fileBuffer, {
      contentType: file.type || 'application/octet-stream',
      upsert: true,
    })

  if (error) {
    throw error
  }

  const { data } = supabaseAdmin.storage.from(BANNER_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}
