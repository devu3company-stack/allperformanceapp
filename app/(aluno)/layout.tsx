import Link from 'next/link'
import { Bell, Rss, Calendar, QrCode, User, BarChart, LogOut } from 'lucide-react'
import { logout } from '@/app/auth/actions'
import { AppBanner } from '@/components/app-banner'
import { getBannerSettings } from '@/lib/banner-settings'

export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  const banners = await getBannerSettings()

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#e2e2e2', fontFamily: "'Archivo Narrow', 'Inter', sans-serif", paddingBottom: '96px', overflowX: 'hidden' }}>
      {/* TopAppBar */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, height: '64px', background: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #E4002B', padding: '2px', overflow: 'hidden', flexShrink: 0 }}>
            <img alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '36px', height: '36px', background: '#fff', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 900, fontSize: '10px', color: '#0A0A0A', textAlign: 'center', lineHeight: '1.1' }}>ALL<br/>PERF</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', display: 'flex', padding: '8px' }}>
            <Bell size={24} />
          </button>
          <form action={logout}>
            <button
              type="submit"
              style={{
                background: 'none',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#9ca3af',
                cursor: 'pointer',
                display: 'flex',
                padding: '8px',
                borderRadius: '10px',
              }}
              aria-label="Sair"
            >
              <LogOut size={18} />
            </button>
          </form>
        </div>
      </header>

      <main style={{ paddingTop: '80px', paddingLeft: '16px', paddingRight: '16px', maxWidth: '520px', margin: '0 auto' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <AppBanner variant="aluno" src={banners.mobileUrl} />
          {children}
        </div>
      </main>

      {/* BottomNavBar */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50, height: '80px', background: 'rgba(12,15,15,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,0.07)', borderRadius: '28px 28px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px', boxShadow: '0 -8px 32px rgba(0,0,0,0.6)' }}>
        <Link href="/feed" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#E4002B', textDecoration: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', filter: 'drop-shadow(0 0 8px rgba(228,0,43,0.4))' }}>
          <Rss size={26} />
          <span>Feed</span>
        </Link>
        <Link href="/agenda" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#9ca3af', textDecoration: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65 }}>
          <Calendar size={26} />
          <span>Agenda</span>
        </Link>
        {/* Check-in center FAB */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', marginBottom: '28px' }}>
          <Link href="/checkin" style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#E4002B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', boxShadow: '0 0 28px rgba(228,0,43,0.55)', flexShrink: 0 }}>
            <QrCode size={30} />
          </Link>
          <span style={{ marginTop: '6px', fontSize: '10px', color: '#E4002B', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>Check-in</span>
        </div>
        <Link href="/perfil" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#9ca3af', textDecoration: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65 }}>
          <User size={26} />
          <span>Perfil</span>
        </Link>
        <Link href="/stats" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#9ca3af', textDecoration: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.65 }}>
          <BarChart size={26} />
          <span>Stats</span>
        </Link>
      </nav>
    </div>
  )
}
