'use server'

import { revalidatePath } from 'next/cache'
import { saveBannerSettings } from '@/lib/banner-settings'
import { saveNextFitSettings } from '@/lib/academia'

export type SaveSettingsResult = {
  error?: string
  success?: string
}

export async function updateBannerSettings(formData: FormData): Promise<SaveSettingsResult> {
  const mobileUrl = String(formData.get('bannerMobileUrl') ?? '')
  const webUrl = String(formData.get('bannerWebUrl') ?? '')

  try {
    await saveBannerSettings(mobileUrl, webUrl)
    revalidatePath('/dashboard')
    revalidatePath('/feed')
    revalidatePath('/settings')

    return { success: 'Banners atualizados com sucesso.' }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Não foi possível salvar os banners.',
    }
  }
}

export async function updateNextFitSettings(formData: FormData): Promise<SaveSettingsResult> {
  const apiKey = String(formData.get('nextFitApiKey') ?? '')
  const academiaId = String(formData.get('nextFitAcademiaId') ?? '')

  try {
    await saveNextFitSettings(apiKey, academiaId)
    revalidatePath('/settings')

    return { success: 'Conexão com o Next Fit atualizada com sucesso.' }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Não foi possível salvar a conexão do Next Fit.',
    }
  }
}
