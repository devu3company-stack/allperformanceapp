'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { Upload } from 'lucide-react'
import {
  importStudentsSpreadsheet,
  type ImportStudentsResult,
} from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-lg bg-ap-red px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-ap-redDark disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
    >
      <Upload size={18} />
      <span>{pending ? 'Importando...' : 'Importar planilha'}</span>
    </button>
  )
}

export function ImportStudentsForm() {
  const [result, setResult] = useState<ImportStudentsResult | null>(null)

  async function handleImport(formData: FormData) {
    const response = await importStudentsSpreadsheet(formData)
    setResult(response)
  }

  return (
    <div className="rounded-xl border border-ap-grayLine bg-white p-4 shadow-sm sm:p-5">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-base font-bold text-ap-black sm:text-lg">
          Importação em massa de alunos
        </h2>
        <p className="text-sm text-gray-600">
          Envie um arquivo <code>.xls</code> ou <code>.xlsx</code> com colunas como
          <code> nome</code>, <code>cpf</code>, <code>telefone</code> e <code>status</code>.
          O aluno preenche e-mail e data de nascimento no primeiro acesso.
        </p>
        <a
          href="/templates/import-alunos-exemplo.csv"
          download
          className="inline-flex items-center gap-2 text-sm font-medium text-ap-red hover:text-ap-redDark"
        >
          Baixar arquivo de exemplo
        </a>
      </div>

      <form action={handleImport} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="file"
          name="file"
          accept=".csv,.xls,.xlsx"
          required
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-ap-black file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-ap-charcoal"
        />
        <SubmitButton />
      </form>

      {result?.error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </div>
      )}

      {result?.success && (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          <p>{result.success}</p>
          <p className="mt-1">
            Criados: {result.created ?? 0} | Atualizados: {result.updated ?? 0} | Ignorados: {result.ignored ?? 0}
          </p>
          {result.errors && result.errors.length > 0 && (
            <div className="mt-2 space-y-1 text-xs text-amber-700">
              {result.errors.slice(0, 5).map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
