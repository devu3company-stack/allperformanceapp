import { Plus, Search, Check, X } from 'lucide-react'
import prisma from '@/lib/prisma'

export default async function PlanosPage() {
  let planos: any[] = []
  try {
    planos = await prisma.plano.findMany({
      orderBy: { valor: 'asc' }
    })
  } catch(e) {
    planos = [
      { id: '1', nome: 'Mensal', valor: 199.90, duracaoDias: 30, ativo: true },
      { id: '2', nome: 'Semestral', valor: 159.90, duracaoDias: 180, ativo: true },
      { id: '3', nome: 'Anual', valor: 129.90, duracaoDias: 365, ativo: true },
      { id: '4', nome: 'Promocional', valor: 99.90, duracaoDias: 30, ativo: false },
    ]
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-display uppercase tracking-wide">Planos</h1>
          <p className="text-gray-500 text-sm">Visualize os planos sincronizados com o Next Fit.</p>
        </div>
        <button className="flex items-center gap-2 bg-ap-black text-white px-4 py-2 rounded-lg hover:bg-ap-charcoal transition-colors shadow-sm opacity-50 cursor-not-allowed" disabled title="Planos são gerenciados no Next Fit">
          <Plus size={18} />
          <span>Sincronizar Manualmente</span>
        </button>
      </div>

      <div className="bg-white border border-ap-grayLine rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-ap-grayLine flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar plano..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ap-red focus:border-ap-red"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium">
              <tr>
                <th className="px-6 py-3">Nome do Plano</th>
                <th className="px-6 py-3">Valor (R$)</th>
                <th className="px-6 py-3">Duração (Dias)</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-800">
              {planos.map((plano: any) => (
                <tr key={plano.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-bold">{plano.nome}</td>
                  <td className="px-6 py-4 text-gray-600">R$ {Number(plano.valor).toFixed(2).replace('.', ',')}</td>
                  <td className="px-6 py-4 text-gray-600">{plano.duracaoDias} dias</td>
                  <td className="px-6 py-4">
                    {plano.ativo ? (
                      <span className="flex items-center gap-1 text-green-600 font-medium text-xs">
                        <Check size={14} /> Ativo
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-gray-400 font-medium text-xs">
                        <X size={14} /> Inativo
                      </span>
                    )}
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
