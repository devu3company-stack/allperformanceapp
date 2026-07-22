'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { completeFirstAccess } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-ap-red px-5 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-ap-redDark disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? 'Finalizando...' : 'Concluir primeiro acesso'}
    </button>
  )
}

export default function PrimeiroAcessoPage() {
  const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null)

  async function handleAction(formData: FormData) {
    const result = await completeFirstAccess(formData)
    setMessage(result)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#111] p-6 shadow-2xl sm:p-8">
        <p className="text-[11px] uppercase tracking-[0.24em] text-ap-red">Aluno</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">Primeiro acesso</h1>
        <p className="mt-3 text-sm leading-6 text-gray-400">
          Use seu CPF para localizar seu cadastro, informar seu e-mail, escolher a unidade onde vai treinar, criar sua senha e confirmar sua data de nascimento.
        </p>

        <form action={handleAction} className="mt-6 space-y-4">
          <input
            name="cpf"
            type="text"
            required
            placeholder="Seu CPF"
            className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-ap-red"
          />
          <input
            name="email"
            type="email"
            required
            placeholder="Seu melhor e-mail"
            className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-ap-red"
          />
          <select
            name="unidadeTreino"
            required
            defaultValue=""
            className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-ap-red"
          >
            <option value="" disabled className="text-black">
              Selecione sua unidade
            </option>
            <option value="ZERAO" className="text-black">
              Unidade 01 (Zerão)
            </option>
            <option value="BOSQUE" className="text-black">
              Unidade 02 (Bosque)
            </option>
          </select>
          <input
            name="dataNascimento"
            type="date"
            required
            className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-ap-red"
          />
          <input
            name="password"
            type="password"
            required
            minLength={8}
            placeholder="Crie sua senha"
            className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-ap-red"
          />
          <input
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            placeholder="Confirme sua senha"
            className="w-full rounded-xl border border-white/10 bg-[#1A1A1A] px-4 py-3 text-sm text-white outline-none focus:border-ap-red"
          />

          {message?.error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {message.error}
            </div>
          )}

          {message?.success && (
            <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {message.success}
            </div>
          )}

          <SubmitButton />
        </form>

        <div className="mt-5 text-center text-sm text-gray-400">
          Já tem acesso?{' '}
          <Link href="/login" className="font-medium text-ap-red hover:text-ap-redDark">
            Voltar para o login
          </Link>
        </div>
      </div>
    </div>
  )
}
