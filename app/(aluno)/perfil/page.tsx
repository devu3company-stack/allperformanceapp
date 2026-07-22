import { User, Mail, Phone, Cake } from 'lucide-react'
import { getCurrentAlunoProfile } from '@/lib/current-aluno'
import { UploadProfilePhotoForm } from './upload-form'

export default async function PerfilPage() {
  const aluno = await getCurrentAlunoProfile()

  if (!aluno) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white/80">
        Não foi possível carregar o perfil do aluno.
      </div>
    )
  }

  const birthday = aluno.dataNascimento
    ? aluno.dataNascimento.toLocaleDateString('pt-BR')
    : 'Não informada'
  const unidade = aluno.unidadeTreino === 'BOSQUE'
    ? 'Unidade 02 (Bosque)'
    : aluno.unidadeTreino === 'ZERAO'
      ? 'Unidade 01 (Zerão)'
      : 'Não informada'

  return (
    <div className="space-y-5 text-white">
      <div>
        <h1 className="text-2xl font-display uppercase tracking-wide">Perfil</h1>
        <p className="mt-1 text-sm text-white/55">
          Atualize sua foto e confira seus dados de cadastro.
        </p>
      </div>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-black/20">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="h-28 w-28 overflow-hidden rounded-full border-2 border-ap-red bg-[#111] p-1 shadow-[0_0_24px_rgba(228,0,43,0.22)]">
            <img
              alt={aluno.nome}
              src={aluno.fotoUrl ?? `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(aluno.nome)}`}
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold">{aluno.nome}</h2>
            <p className="text-sm uppercase tracking-[0.16em] text-ap-red">
              {aluno.status}
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 text-sm text-white/75">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] px-4 py-3">
            <Mail size={16} className="text-ap-red" />
            <span>{aluno.email ?? 'E-mail não informado'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] px-4 py-3">
            <Phone size={16} className="text-ap-red" />
            <span>{aluno.telefone ?? 'Telefone não informado'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] px-4 py-3">
            <Cake size={16} className="text-ap-red" />
            <span>{birthday}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] px-4 py-3">
            <User size={16} className="text-ap-red" />
            <span>{unidade}</span>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#111] px-4 py-3">
            <User size={16} className="text-ap-red" />
            <span>Conta ativa no app</span>
          </div>
        </div>
      </section>

      <UploadProfilePhotoForm />
    </div>
  )
}
