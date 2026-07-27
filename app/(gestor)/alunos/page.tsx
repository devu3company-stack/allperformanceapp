import { Plus, Search, Filter } from 'lucide-react'
import prisma from '@/lib/prisma'
import { ImportStudentsForm } from './import-form'
import { WorkoutEditor } from './workout-editor'

type AlunoListItem = {
  id: string
  nome: string
  cpf: string
  status: string
  treinoPersonalizado: string | null
  treinoAtualizadoEm: Date | null
  treinoAtualizadoPor: string | null
}

function formatWorkoutUpdatedLabel(aluno: Pick<AlunoListItem, 'treinoAtualizadoEm' | 'treinoAtualizadoPor'>) {
  if (!aluno.treinoAtualizadoEm) {
    return null
  }

  const updatedAt = aluno.treinoAtualizadoEm.toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  })

  return `Atualizado em ${updatedAt}${aluno.treinoAtualizadoPor ? ` por ${aluno.treinoAtualizadoPor}` : ''}`
}

export default async function AlunosPage() {
  let alunos: AlunoListItem[] = []
  try {
    alunos = await prisma.aluno.findMany({
      select: {
        id: true,
        nome: true,
        cpf: true,
        status: true,
        treinoPersonalizado: true,
        treinoAtualizadoEm: true,
        treinoAtualizadoPor: true,
      },
      take: 20,
      orderBy: { nome: 'asc' },
    })
  } catch (e) {
    alunos = [
      {
        id: '1',
        nome: 'Sarah Jenkins',
        cpf: '123.456.789-00',
        status: 'ATIVO',
        treinoPersonalizado: 'Aquecimento de 10 min na esteira\nAgachamento 4x12\nLeg press 4x10\nPrancha 3x40s',
        treinoAtualizadoEm: new Date(),
        treinoAtualizadoPor: 'Prof. Marcus',
      },
      {
        id: '2',
        nome: 'Marcus Thorne',
        cpf: '098.765.432-11',
        status: 'INADIMPLENTE',
        treinoPersonalizado: null,
        treinoAtualizadoEm: null,
        treinoAtualizadoPor: null,
      },
    ]
  }

  return (
    <div className="space-y-6">
      <ImportStudentsForm />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display uppercase tracking-wide">Alunos</h1>
          <p className="text-gray-500 text-sm">Gerencie os alunos cadastrados.</p>
          <p className="mt-1 text-sm text-gray-500">
            Professores e gestores podem salvar um treino diferente para cada aluno.
            O conteúdo aparece na aba <strong>Treino</strong> do app.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-ap-black text-white px-4 py-2 rounded-lg hover:bg-ap-charcoal transition-colors shadow-sm">
          <Plus size={18} />
          <span>Novo Aluno</span>
        </button>
      </div>

      <div className="bg-white border border-ap-grayLine rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-ap-grayLine flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar por nome ou CPF..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ap-red focus:border-ap-red"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">CPF</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 min-w-[360px]">Treino personalizado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {alunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{aluno.nome}</td>
                  <td className="px-6 py-4 text-gray-500">{aluno.cpf}</td>
                  <td className="px-6 py-4">
                    {aluno.status === 'ATIVO' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Ativo
                      </span>
                    ) : aluno.status === 'INADIMPLENTE' ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                        Inadimplente
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        {aluno.status}
                      </span>
                      )}
                    </td>
                  <td className="px-6 py-4 align-top">
                    <WorkoutEditor
                      alunoId={aluno.id}
                      alunoNome={aluno.nome}
                      initialWorkout={aluno.treinoPersonalizado}
                      lastUpdatedLabel={formatWorkoutUpdatedLabel(aluno)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
