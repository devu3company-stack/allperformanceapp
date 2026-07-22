'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateAlunoProfilePhoto, type UpdateProfilePhotoResult } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-ap-red px-5 py-3 text-sm font-bold uppercase tracking-[0.16em] text-white transition-colors hover:bg-ap-redDark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Enviando...' : 'Trocar foto'}
    </button>
  )
}

export function UploadProfilePhotoForm() {
  const [result, setResult] = useState<UpdateProfilePhotoResult | null>(null)

  async function handleSubmit(formData: FormData) {
    const response = await updateAlunoProfilePhoto(formData)
    setResult(response)
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-white/80">
          Nova foto de perfil
        </label>
        <input
          type="file"
          name="profilePhoto"
          accept="image/png,image/jpeg,image/webp"
          required
          className="block w-full rounded-lg border border-white/10 bg-[#151515] px-3 py-2 text-sm text-white/80 file:mr-3 file:rounded-md file:border-0 file:bg-white file:px-3 file:py-2 file:text-sm file:font-medium file:text-black hover:file:bg-white/90"
        />
        <p className="mt-2 text-xs text-white/45">
          Formatos aceitos: PNG, JPG e WebP. Tamanho máximo: 5 MB.
        </p>
      </div>

      {result?.error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {result.error}
        </div>
      )}

      {result?.success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
          {result.success}
        </div>
      )}

      <SubmitButton />
    </form>
  )
}
