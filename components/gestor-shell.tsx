"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { logout } from '@/app/auth/actions'
import { AppBanner } from '@/components/app-banner'
import {
  BookOpen,
  Calendar as CalendarIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareWarning,
  Settings,
  Users,
  X,
} from 'lucide-react'

const navLinks = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/alunos', icon: Users, label: 'Alunos' },
  { href: '/planos', icon: BookOpen, label: 'Planos' },
  { href: '/turmas', icon: CalendarIcon, label: 'Turmas' },
  { href: '/moderacao', icon: MessageSquareWarning, label: 'Moderacao' },
]

function LogoBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={compact ? 'h-10 w-10' : 'h-[120px] w-[120px]'}
      style={{
        borderRadius: compact ? '14px' : '999px',
        background: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: compact ? '4px' : '8px',
        boxShadow: '0 0 20px rgba(255,255,255,0.05)',
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: compact ? '10px' : '16px',
            lineHeight: '1.1',
            color: '#0A0A0A',
            letterSpacing: '-0.5px',
          }}
        >
          ALL
        </div>
        <div
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 900,
            fontSize: compact ? '8px' : '11px',
            lineHeight: '1.1',
            color: '#0A0A0A',
            letterSpacing: '-0.5px',
            borderTop: '2px solid #E4002B',
            paddingTop: '3px',
            marginTop: '3px',
          }}
        >
          PERFOR
          <br />
          MANCE
        </div>
      </div>
    </div>
  )
}

function NavItems({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-2">
      {navLinks.map(({ href, icon: Icon, label }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`)

        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all"
            style={{
              background: isActive ? '#E4002B' : 'transparent',
              color: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
              fontWeight: isActive ? 700 : 400,
            }}
          >
            <Icon size={20} />
            <span>{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}

export function GestorShell({
  children,
  bannerSrc,
}: {
  children: React.ReactNode
  bannerSrc?: string | null
}) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div
      className="min-h-screen bg-[#F2F2F2] text-[#121414]"
      style={{ fontFamily: "'Archivo Narrow', 'Inter', sans-serif" }}
    >
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-black/10 bg-[#0A0A0A] px-4 py-3 text-white lg:hidden">
        <Link
          href="/dashboard"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-3"
        >
          <LogoBadge compact />
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">
              ALL Performance
            </p>
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/50">
              Gestao
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen(true)}
          className="rounded-lg border border-white/10 p-2 text-white/80 transition-colors hover:bg-white/5"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        >
          <aside
            className="flex h-full w-[280px] flex-col bg-[#0A0A0A] px-5 py-6 text-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <LogoBadge compact />
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.18em] text-white">
                    ALL Performance
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-white/50">
                    Painel gestor
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg border border-white/10 p-2 text-white/80 transition-colors hover:bg-white/5"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mt-8 flex flex-1 flex-col">
              <NavItems pathname={pathname} onNavigate={() => setIsMenuOpen(false)} />
            </div>

            <div className="mt-6 border-t border-white/10 pt-5">
              <Link
                href="/settings"
                onClick={() => setIsMenuOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5"
              >
                <Settings size={18} />
                <span>Configurações</span>
              </Link>
            </div>

            <form action={logout} className="mt-4">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </form>
          </aside>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col bg-[#0A0A0A] px-6 py-8 text-white lg:flex">
        <div className="mb-8 flex justify-center px-2">
          <LogoBadge />
        </div>

        <NavItems pathname={pathname} />

        <div className="mt-6 border-t border-white/10 pt-5">
          <Link
            href="/settings"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <Settings size={18} />
            <span>Configurações</span>
          </Link>
        </div>

        <form action={logout} className="mt-4">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-white/80 transition-colors hover:bg-white/5"
          >
            <LogOut size={18} />
            <span>Sair</span>
          </button>
        </form>
      </aside>

      <main className="min-h-[calc(100vh-64px)] px-4 py-4 sm:px-6 sm:py-6 lg:ml-[260px] lg:min-h-screen lg:px-8 lg:py-8">
        <div className="flex flex-col gap-5 sm:gap-6">
          <AppBanner variant="gestor" src={bannerSrc} />
          {children}
        </div>
      </main>
    </div>
  )
}
