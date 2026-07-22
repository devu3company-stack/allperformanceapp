'use client'

import { useState } from 'react'
import { useFormStatus } from 'react-dom'
import { login } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-4 px-6 rounded-xl text-white font-bold text-sm uppercase tracking-widest transition-all duration-200"
      style={{
        background: pending ? '#B5001F' : '#E4002B',
        boxShadow: pending ? 'none' : '0 0 24px rgba(228, 0, 43, 0.4)',
      }}
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  )
}

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)

  async function handleAction(formData: FormData) {
    const res = await login(formData)
    if (res?.error) {
      setError(res.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] lg:grid lg:grid-cols-[minmax(0,1fr)_480px]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Lado esquerdo — branding */}
      <div
        className="relative hidden overflow-hidden border-r border-[#222] bg-[linear-gradient(135deg,#0A0A0A_0%,#1A1A1A_100%)] px-14 py-20 lg:flex lg:flex-col lg:items-start lg:justify-center xl:px-20"
        style={{
          position: 'relative',
        }}
      >
        {/* Glow decorativo */}
        <div style={{
          position: 'absolute',
          top: '-200px',
          left: '-200px',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(228,0,43,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute',
          bottom: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(228,0,43,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Logo */}
        <div className="mb-12 xl:mb-[60px]">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M2 22 L8 10 L14 18 L18 14 L24 22 L30 10" stroke="#E4002B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ color: '#E4002B', fontSize: '11px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase' }}>
              Performance Analytics
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: 'clamp(56px, 6vw, 72px)',
          lineHeight: '1',
          color: '#FFFFFF',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          marginBottom: '24px',
        }}>
          ALL<br />
          <span style={{ color: '#E4002B' }}>PERFOR-</span><br />
          MANCE
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.7', maxWidth: '380px' }}>
          Plataforma de gestão completa para academias de alta performance. Alunos, turmas, financeiro e feed social — tudo em um só lugar.
        </p>

        <p style={{ color: '#E4002B', fontSize: '20px', fontWeight: 700, marginTop: '24px' }}>
          Um lugar para pertencer
        </p>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '48px', marginTop: '60px' }}>
          {[
            { num: '98%', label: 'Retenção' },
            { num: '24/7', label: 'Suporte' },
          ].map((s) => (
            <div key={s.num}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Anton', sans-serif" }}>{s.num}</div>
              <div style={{ fontSize: '12px', color: '#555', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Lado direito — formulário */}
      <div className="flex min-h-screen w-full items-center justify-center bg-[#0F0F0F] px-4 py-8 sm:px-6 lg:min-h-0 lg:px-12 lg:py-12">
        <div className="w-full max-w-[480px]">
        {/* Logo mobile */}
        <div className="mb-10 lg:hidden">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
            <path d="M2 22 L8 10 L14 18 L18 14 L24 22 L30 10" stroke="#E4002B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 style={{
            fontFamily: "'Anton', sans-serif",
            fontSize: '32px',
            color: '#FFF',
            textTransform: 'uppercase',
            letterSpacing: '2px',
            marginTop: '8px',
          }}>
            ALL <span style={{ color: '#E4002B' }}>PERFORMANCE</span>
          </h1>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <p style={{ color: '#E4002B', fontSize: '12px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '10px' }}>
            Um lugar para pertencer
          </p>
          <h2 style={{ color: '#FFF', fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>
            Bem-vindo de volta
          </h2>
          <p style={{ color: '#555', fontSize: '14px' }}>
            Acesse sua conta para continuar
          </p>
          <div
            style={{
              marginTop: '16px',
              padding: '12px 14px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#9CA3AF',
              fontSize: '12px',
              lineHeight: '1.6',
            }}
          >
            <div style={{ color: '#FFF', fontWeight: 700, marginBottom: '6px' }}>Acessos de teste disponíveis</div>
            <div><strong style={{ color: '#FFF' }}>Aluno:</strong> aluno.teste@allperformance.local / 12345678</div>
            <div><strong style={{ color: '#FFF' }}>Gestor:</strong> gestor.teste@allperformance.local / 12345678</div>
            <div><strong style={{ color: '#FFF' }}>Professor:</strong> professor.teste@allperformance.local / 12345678</div>
          </div>
        </div>

        <form action={handleAction} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="seu@email.com"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                color: '#FFF',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#E4002B'}
              onBlur={(e) => e.target.style.borderColor = '#2A2A2A'}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#888', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '14px 16px',
                background: '#1A1A1A',
                border: '1px solid #2A2A2A',
                borderRadius: '12px',
                color: '#FFF',
                fontSize: '15px',
                outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onFocus={(e) => e.target.style.borderColor = '#E4002B'}
              onBlur={(e) => e.target.style.borderColor = '#2A2A2A'}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(228, 0, 43, 0.1)',
              border: '1px solid rgba(228, 0, 43, 0.3)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#FF4D6D',
              fontSize: '13px',
              textAlign: 'center',
            }}>
              {error}
            </div>
          )}

          <div style={{ marginTop: '4px' }}>
            <SubmitButton />
          </div>
        </form>

        <div style={{ marginTop: '18px', textAlign: 'center' }}>
          <a href="/primeiro-acesso" style={{ color: '#E4002B', fontSize: '13px', textDecoration: 'none', fontWeight: 600 }}>
            Primeiro acesso do aluno
          </a>
        </div>

        <p style={{ marginTop: '32px', textAlign: 'center', color: '#333', fontSize: '12px', lineHeight: '1.5' }}>
          © 2025 ALL Performance. Todos os direitos reservados.
        </p>
        </div>
      </div>
    </div>
  )
}
