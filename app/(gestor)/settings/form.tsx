'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import {
  updateBannerSettings,
  updateLogoSettings,
  updateNextFitSettings,
  type SaveSettingsResult,
} from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg bg-ap-black px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-ap-charcoal disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Salvando...' : 'Salvar banners'}
    </button>
  )
}

export function SettingsBannerForm({
  initialMobileUrl,
  initialWebUrl,
}: {
  initialMobileUrl: string
  initialWebUrl: string
}) {
  const [result, setResult] = useState<SaveSettingsResult | null>(null)

  async function handleSubmit(formData: FormData) {
    const response = await updateBannerSettings(formData)
    setResult(response)
  }

  return (
    <form action={handleSubmit} className="space-y-5 rounded-xl border border-ap-grayLine bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-ap-black">Banners do sistema</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Cole as URLs das artes finais para trocar o banner diretamente pelo painel.
          Você pode usar arquivos hospedados no Supabase Storage, CDN ou qualquer URL pública.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Banner mobile / app do aluno
          </label>
          <input
            name="bannerMobileFile"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="mb-3 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-ap-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-ap-charcoal"
          />
          <input
            name="bannerMobileUrl"
            defaultValue={initialMobileUrl}
            placeholder="https://.../banner-mobile.webp"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none focus:border-ap-red focus:ring-2 focus:ring-ap-red/20"
          />
          <p className="mt-2 text-xs text-gray-500">
            Recomendado: 1080 x 560 px. Você pode enviar o arquivo acima ou colar a URL manualmente. Deixe em branco para usar o placeholder padrão.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Banner web / painel
          </label>
          <input
            name="bannerWebFile"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="mb-3 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-ap-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-ap-charcoal"
          />
          <input
            name="bannerWebUrl"
            defaultValue={initialWebUrl}
            placeholder="https://.../banner-web.webp"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none focus:border-ap-red focus:ring-2 focus:ring-ap-red/20"
          />
          <p className="mt-2 text-xs text-gray-500">
            Recomendado: 1600 x 420 px. Você pode enviar o arquivo acima ou colar a URL manualmente. Deixe em branco para usar o placeholder padrão.
          </p>
        </div>
      </div>

      {result?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </div>
      )}

      {result?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {result.success}
        </div>
      )}

      <SubmitButton />
    </form>
  )
}

export function SettingsNextFitForm({
  initialApiKey,
  initialAcademiaId,
}: {
  initialApiKey: string
  initialAcademiaId: string
}) {
  const [result, setResult] = useState<SaveSettingsResult | null>(null)

  async function handleSubmit(formData: FormData) {
    const response = await updateNextFitSettings(formData)
    setResult(response)
  }

  return (
    <form action={handleSubmit} className="space-y-5 rounded-xl border border-ap-grayLine bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-ap-black">Conexão com a API Next Fit</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Configure as credenciais da academia para sincronizar financeiro e contratos.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            API Key do Next Fit
          </label>
          <input
            name="nextFitApiKey"
            defaultValue={initialApiKey}
            placeholder="Cole aqui a API Key"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none focus:border-ap-red focus:ring-2 focus:ring-ap-red/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            ID da academia no Next Fit
          </label>
          <input
            name="nextFitAcademiaId"
            defaultValue={initialAcademiaId}
            placeholder="Ex.: 123456"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none focus:border-ap-red focus:ring-2 focus:ring-ap-red/20"
          />
        </div>
      </div>

      {result?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </div>
      )}

      {result?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {result.success}
        </div>
      )}

      <SubmitButton />
    </form>
  )
}

export function SettingsLogoForm({
  initialLogoUnidade01Url,
  initialLogoUnidade02Url,
}: {
  initialLogoUnidade01Url: string
  initialLogoUnidade02Url: string
}) {
  const [result, setResult] = useState<SaveSettingsResult | null>(null)

  async function handleSubmit(formData: FormData) {
    const response = await updateLogoSettings(formData)
    setResult(response)
  }

  return (
    <form action={handleSubmit} className="space-y-5 rounded-xl border border-ap-grayLine bg-white p-5 shadow-sm sm:p-6">
      <div>
        <h2 className="text-lg font-semibold text-ap-black">Logos por unidade</h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Configure as logos usadas no app do aluno conforme a unidade escolhida no primeiro acesso.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Logo da Unidade 01 (Zerão)
          </label>
          <input
            name="logoUnidade01File"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="mb-3 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-ap-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-ap-charcoal"
          />
          <input
            name="logoUnidade01Url"
            defaultValue={initialLogoUnidade01Url}
            placeholder="https://.../logo-unidade-01.webp"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none focus:border-ap-red focus:ring-2 focus:ring-ap-red/20"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Logo da Unidade 02 (Bosque)
          </label>
          <input
            name="logoUnidade02File"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="mb-3 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-ap-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-ap-charcoal"
          />
          <input
            name="logoUnidade02Url"
            defaultValue={initialLogoUnidade02Url}
            placeholder="https://.../logo-unidade-02.webp"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-800 outline-none focus:border-ap-red focus:ring-2 focus:ring-ap-red/20"
          />
        </div>
      </div>

      {result?.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </div>
      )}

      {result?.success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {result.success}
        </div>
      )}

      <SubmitButton />
    </form>
  )
}
