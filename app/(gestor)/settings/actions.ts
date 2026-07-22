'use server'

import { revalidatePath } from 'next/cache'
import { saveBannerSettings, saveLogoSettings, uploadBannerFile } from '@/lib/banner-settings'
import { saveNextFitSettings } from '@/lib/academia'

export type SaveSettingsResult = {
  error?: string
  success?: string
}

export async function updateBannerSettings(formData: FormData): Promise<SaveSettingsResult> {
  let mobileUrl = String(formData.get('bannerMobileUrl') ?? '')
  let webUrl = String(formData.get('bannerWebUrl') ?? '')
  const mobileFile = formData.get('bannerMobileFile')
  const webFile = formData.get('bannerWebFile')

  try {
    if (mobileFile instanceof File && mobileFile.size > 0) {
      mobileUrl = await uploadBannerFile(mobileFile, 'mobile')
    }

    if (webFile instanceof File && webFile.size > 0) {
      webUrl = await uploadBannerFile(webFile, 'web')
    }

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

export async function updateLogoSettings(formData: FormData): Promise<SaveSettingsResult> {
  let unidade01Url = String(formData.get('logoUnidade01Url') ?? '')
  let unidade02Url = String(formData.get('logoUnidade02Url') ?? '')
  const unidade01File = formData.get('logoUnidade01File')
  const unidade02File = formData.get('logoUnidade02File')

  try {
    if (unidade01File instanceof File && unidade01File.size > 0) {
      unidade01Url = await uploadBannerFile(unidade01File, 'logo-unidade-01')
    }

    if (unidade02File instanceof File && unidade02File.size > 0) {
      unidade02Url = await uploadBannerFile(unidade02File, 'logo-unidade-02')
    }

    await saveLogoSettings(unidade01Url, unidade02Url)
    revalidatePath('/feed')
    revalidatePath('/agenda')
    revalidatePath('/perfil')
    revalidatePath('/settings')

    return { success: 'Logos das unidades atualizadas com sucesso.' }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Não foi possível salvar as logos das unidades.',
    }
  }
}
