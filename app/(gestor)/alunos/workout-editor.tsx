'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { saveStudentWorkout, type SaveStudentWorkoutResult } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-ap-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-ap-redDark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Salvando...' : 'Salvar treino'}
    </button>
  )
}

type WorkoutEditorProps = {
  alunoId: string
  alunoNome: string
  initialWorkout: string | null
  lastUpdatedLabel: string | null
}

export function WorkoutEditor({
  alunoId,
  alunoNome,
  initialWorkout,
  lastUpdatedLabel,
}: WorkoutEditorProps) {
  const [result, setResult] = useState<SaveStudentWorkoutResult | null>(null)
  const [currentUpdatedLabel, setCurrentUpdatedLabel] = useState(lastUpdatedLabel)

  async function handleSave(formData: FormData) {
    const response = await saveStudentWorkout(formData)
    setResult(response)

    if (response.success) {
      setCurrentUpdatedLabel(response.updatedLabel ?? null)
    }
  }

  return (
    <div className="space-y-2">
      <form action={handleSave} className="space-y-2">
        <input type="hidden" name="alunoId" value={alunoId} />
        <textarea
          name="treinoPersonalizado"
          defaultValue={initialWorkout ?? ''}
          rows={6}
          placeholder={`Ex.: aquecimento, series, cargas e observacoes para ${alunoNome}.`}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 focus:border-ap-red focus:outline-none focus:ring-2 focus:ring-ap-red"
        />

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-gray-500">
            {currentUpdatedLabel ?? 'Nenhum treino salvo para este aluno ainda.'}
          </p>
          <SubmitButton />
        </div>
      </form>

      {result?.error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          {result.error}
        </p>
      )}

      {result?.success && (
        <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-800">
          {result.success}
        </p>
      )}
    </div>
  )
}
