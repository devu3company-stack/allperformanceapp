import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export default async function ModeracaoPage() {
  let posts: any[] = []
  try {
    posts = await prisma.post.findMany({
      where: { status: 'PENDENTE' },
      include: {
        autorAluno: true,
      },
      orderBy: { createdAt: 'desc' }
    })
  } catch(e) {
    posts = [
      { id: '1', legenda: 'Amei o treino de hoje!', imagemUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop', autorAluno: { nome: 'Sarah Jenkins' }, createdAt: new Date() },
      { id: '2', legenda: 'Bora focar no LPO', imagemUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop', autorAluno: { nome: 'Marcus Thorne' }, createdAt: new Date() }
    ]
  }

  async function handleAprovar(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    try {
      await prisma.post.update({ where: { id }, data: { status: 'APROVADO' } })
      revalidatePath('/moderacao')
    } catch(e) {}
  }

  async function handleRejeitar(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    try {
      await prisma.post.update({ where: { id }, data: { status: 'REJEITADO' } })
      revalidatePath('/moderacao')
    } catch(e) {}
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-display uppercase tracking-wide sm:text-2xl">Moderação de Feed</h1>
          <p className="text-gray-500 text-sm">Posts de alunos aguardando sua aprovação para aparecer no Feed Social.</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center space-y-4 rounded-xl border border-ap-grayLine bg-white p-8 text-center text-gray-500 sm:p-12">
          <CheckCircle size={48} className="text-green-500 opacity-50" />
          <p className="text-lg">Tudo limpo! Nenhum post pendente de moderação.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {posts.map((post: any) => (
            <div key={post.id} className="bg-white border border-ap-grayLine rounded-xl shadow-sm overflow-hidden flex flex-col">
              <div className="p-4 border-b border-ap-grayLine flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full overflow-hidden">
                  <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${post.autorAluno?.nome}`} alt="Aluno" />
                </div>
                <div>
                  <p className="text-sm font-bold text-ap-black">{post.autorAluno?.nome}</p>
                  <p className="text-[10px] text-gray-500">{new Date(post.createdAt).toLocaleString('pt-BR')}</p>
                </div>
              </div>
              
              <div className="aspect-square bg-gray-100 relative">
                <img src={post.imagemUrl} alt="Post preview" className="w-full h-full object-cover" />
              </div>

              <div className="p-4 flex-1">
                <p className="text-sm text-gray-700">
                  <span className="font-bold mr-1">{post.autorAluno?.nome}</span>
                  {post.legenda}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 border-t border-ap-grayLine bg-ap-gray p-3 sm:grid-cols-2 sm:gap-3 sm:p-4">
                <form action={handleRejeitar}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors">
                    <XCircle size={18} className="text-red-500" />
                    Rejeitar
                  </button>
                </form>
                <form action={handleAprovar}>
                  <input type="hidden" name="id" value={post.id} />
                  <button type="submit" className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-ap-black text-white rounded-lg hover:bg-ap-charcoal font-medium text-sm transition-colors">
                    <CheckCircle size={18} className="text-green-500" />
                    Aprovar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
