import { getBannerSettings } from '@/lib/banner-settings'
import { getDefaultAcademia } from '@/lib/academia'
import { SettingsBannerForm, SettingsNextFitForm } from './form'

export default async function SettingsPage() {
  const banners = await getBannerSettings()

  let academia = {
    nextFitApiKey: '',
    nextFitAcademiaId: '',
  }

  try {
    const defaultAcademia = await getDefaultAcademia()
    academia = {
      nextFitApiKey: defaultAcademia.nextFitApiKey ?? '',
      nextFitAcademiaId: defaultAcademia.nextFitAcademiaId ?? '',
    }
  } catch {}

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display uppercase tracking-wide sm:text-2xl">Settings</h1>
        <p className="text-sm text-gray-500">
          Configure banners do sistema e a conexão com o Next Fit.
        </p>
      </div>

      <SettingsBannerForm
        initialMobileUrl={banners.mobileUrl ?? ''}
        initialWebUrl={banners.webUrl ?? ''}
      />

      <SettingsNextFitForm
        initialApiKey={academia.nextFitApiKey}
        initialAcademiaId={academia.nextFitAcademiaId}
      />
    </div>
  )
}
