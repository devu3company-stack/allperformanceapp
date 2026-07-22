import { Plus, Calendar as CalendarIcon, Users } from 'lucide-react'
import prisma from '@/lib/prisma'

export default async function TurmasPage() {
  let turmas: any[] = []
  try {
    turmas = await prisma.turma.findMany({
      include: {
        professor: true,
        _count: {
          select: { aulas: true }
        }
      },
      orderBy: [
        { diaSemana: 'asc' },
        { horaInicio: 'asc' }
      ]
    })
  } catch(e) {
    turmas = [
      { id: '1', nome: 'Crossfit WOD', modalidade: 'Cross', diaSemana: 1, horaInicio: '07:00', horaFim: '08:00', capacidade: 20, professor: { nome: 'Coach Jax' } },
      { id: '2', nome: 'LPO Avançado', modalidade: 'LPO', diaSemana: 1, horaInicio: '18:00', horaFim: '19:00', capacidade: 15, professor: { nome: 'Coach Marcus' } },
    ]
  }

  const dias = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-display uppercase tracking-wide sm:text-2xl">Turmas e Agenda</h1>
          <p className="text-gray-500 text-sm">Gerencie os horários fixos das aulas.</p>
        </div>
        <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-ap-black px-4 py-2 text-white shadow-sm transition-colors hover:bg-ap-charcoal sm:w-auto">
          <Plus size={18} />
          <span>Nova Turma</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {turmas.map((turma: any) => (
          <div key={turma.id} className="space-y-3 rounded-xl border border-ap-grayLine bg-white p-4 shadow-sm sm:space-y-4 sm:p-5">
            <div className="flex justify-between items-start">
              <div className="pr-3">
                <h3 className="font-bold text-lg text-ap-black">{turma.nome}</h3>
                <p className="text-sm text-gray-500">{turma.modalidade} • {turma.professor?.nome}</p>
              </div>
              <div className="rounded bg-ap-gray px-2 py-1 text-xs font-medium text-gray-600">
                {dias[turma.diaSemana]}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2 text-sm text-gray-600 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex items-center gap-1.5">
                <CalendarIcon size={16} className="text-ap-red" />
                <span>{turma.horaInicio} - {turma.horaFim}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users size={16} className="text-gray-400" />
                <span>{turma.capacidade} vagas</span>
              </div>
            </div>

            <div className="flex justify-end border-t border-ap-grayLine pt-3 sm:pt-4">
              <button className="text-sm font-medium text-ap-red hover:text-ap-redDark">Editar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
