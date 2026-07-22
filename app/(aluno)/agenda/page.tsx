import { addDays, format, startOfDay, subMinutes } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { toggleBooking } from './actions'

type AgendaCard = {
  id: string
  aulaId?: string
  horario: string
  nome: string
  duracao: string | null
  coach: string
  role: string
  status: 'available' | 'booked' | 'full' | 'closed'
  seed: string
}

const mockAulas: AgendaCard[] = [
  { id: '1', horario: '07:00', nome: 'CrossFit Advanced', duracao: '60 MIN', coach: 'Marcus Thorne', role: 'HEAD COACH', status: 'available', seed: 'marcus' },
  { id: '2', horario: '09:30', nome: 'HIIT Burnout', duracao: '45 MIN', coach: 'Sarah Jenkins', role: 'HIIT SPECIALIST', status: 'available', seed: 'sarah' },
  { id: '3', horario: '12:00', nome: 'Zen Flow Yoga', duracao: null, coach: 'Elena Rodriguez', role: 'YOGA MASTER', status: 'booked', seed: 'elena' },
  { id: '4', horario: '17:00', nome: 'Strength Lab', duracao: '90 MIN', coach: "Dave 'The Tank'", role: 'STRENGTH COACH', status: 'available', seed: 'dave' },
]

const cardStyle: React.CSSProperties = {
  background: '#1A1A1A',
  border: '1px solid rgba(255,255,255,0.04)',
  borderRadius: '12px',
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
}

async function getCurrentAlunoId() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return null
  }

  const aluno = await prisma.aluno.findFirst({
    where: {
      email: user.email,
      ativoNoApp: true,
    },
    select: { id: true },
  })

  return aluno?.id ?? null
}

function getDurationLabel(horaInicio: string, horaFim: string) {
  const [startHour, startMinute] = horaInicio.split(':').map(Number)
  const [endHour, endMinute] = horaFim.split(':').map(Number)
  const durationInMinutes = endHour * 60 + endMinute - (startHour * 60 + startMinute)

  if (!Number.isFinite(durationInMinutes) || durationInMinutes <= 0) {
    return null
  }

  return `${durationInMinutes} MIN`
}

export default async function AgendaPage() {
  const today = startOfDay(new Date())
  const periodEnd = addDays(today, 7)
  const upcomingDays = Array.from({ length: 7 }, (_, index) => addDays(today, index))

  let currentAlunoId: string | null = null
  let displayAulas = mockAulas

  try {
    currentAlunoId = await getCurrentAlunoId()

    const aulas = await prisma.aula.findMany({
      where: {
        data: {
          gte: today,
          lt: periodEnd,
        },
        cancelada: false,
      },
      include: {
        turma: {
          include: {
            professor: true,
          },
        },
        agendamentos: {
          select: {
            alunoId: true,
            cancelado: true,
          },
        },
      },
      orderBy: { data: 'asc' },
      take: 12,
    })

    const mappedAulas: AgendaCard[] = aulas.map((aula) => {
      const activeBookings = aula.agendamentos.filter((booking) => !booking.cancelado)
      const isBooked = currentAlunoId
        ? activeBookings.some((booking) => booking.alunoId === currentAlunoId)
        : false
      const remainingSpots = Math.max(aula.turma.capacidade - activeBookings.length, 0)
      const isBookingClosed = new Date() >= subMinutes(aula.data, 30)
      const coachName = aula.turma.professor?.nome ?? 'Professor da turma'

      return {
        id: aula.id,
        aulaId: aula.id,
        horario: format(aula.data, 'HH:mm'),
        nome: aula.turma.nome,
        duracao: getDurationLabel(aula.turma.horaInicio, aula.turma.horaFim),
        coach: coachName,
        role: isBookingClosed
          ? `${aula.turma.modalidade.toUpperCase()} • agendamento encerrado`
          : `${aula.turma.modalidade.toUpperCase()} • ${remainingSpots} ${remainingSpots === 1 ? 'vaga' : 'vagas'}`,
        status: isBooked ? 'booked' : isBookingClosed ? 'closed' : remainingSpots === 0 ? 'full' : 'available',
        seed: coachName.toLowerCase().replace(/\s+/g, '-'),
      }
    })

    if (mappedAulas.length > 0) {
      displayAulas = mappedAulas
    }
  } catch {}

  return (
    <div>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '24px', color: '#e2e2e2' }}>Schedule</h2>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(232,188,185,0.7)', textTransform: 'uppercase' }}>
          {format(today, 'MMMM yyyy', { locale: ptBR }).toUpperCase()}
        </span>
      </div>

      {/* Weekly Calendar Bar */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {upcomingDays.map((date, index) => (
            <div key={date.toISOString()} style={{ flexShrink: 0, width: '56px', height: '80px', borderRadius: '12px', background: index === 0 ? '#E4002B' : '#1A1A1A', border: index === 0 ? 'none' : '1px solid rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: index === 0 ? '0 0 15px rgba(228,0,43,0.2)' : 'none' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.1em', color: index === 0 ? 'rgba(255,246,245,0.8)' : 'rgba(232,188,185,0.7)', marginBottom: '4px', textTransform: 'uppercase' }}>
                {format(date, 'EEE', { locale: ptBR }).slice(0, 3).toUpperCase()}
              </span>
              <span style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '24px', color: index === 0 ? '#fff6f5' : '#e2e2e2' }}>
                {format(date, 'dd')}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Classes List */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {displayAulas.map((aula) => (
          <div key={aula.id} style={{ ...cardStyle, borderColor: aula.status === 'booked' ? 'rgba(228,0,43,0.3)' : 'rgba(255,255,255,0.04)' }}>
            {/* Time & Duration Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', letterSpacing: '0.05em', color: '#E4002B', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  {aula.horario}
                </span>
                <h3 style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 700, fontSize: '24px', color: '#e2e2e2', margin: 0 }}>
                  {aula.nome}
                </h3>
              </div>
              {aula.duracao && (
                <div style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(232,188,185,0.7)' }}>{aula.duracao}</span>
                </div>
              )}
              {aula.status === 'booked' && (
                <div style={{ padding: '4px 8px', background: 'rgba(228,0,43,0.1)', borderRadius: '4px', border: '1px solid rgba(228,0,43,0.2)' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.1em', color: '#E4002B' }}>AGENDADO</span>
                </div>
              )}
              {aula.status === 'full' && (
                <div style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(232,188,185,0.7)' }}>LOTADA</span>
                </div>
              )}
              {aula.status === 'closed' && (
                <div style={{ padding: '4px 8px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.12)' }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.1em', color: 'rgba(232,188,185,0.7)' }}>ENCERRADA</span>
                </div>
              )}
            </div>
            {/* Coach & Button Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', flexShrink: 0 }}>
                  <img alt={aula.coach} style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${aula.seed}`} />
                </div>
                <div>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', letterSpacing: '0.05em', color: '#e2e2e2', margin: 0 }}>{aula.coach}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(232,188,185,0.6)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>{aula.role}</p>
                </div>
              </div>
              {aula.aulaId ? (
                <form action={toggleBooking}>
                  <input type="hidden" name="aulaId" value={aula.aulaId} />
                  <button
                    type="submit"
                    disabled={!currentAlunoId || aula.status === 'full' || aula.status === 'closed'}
                    style={{
                      background: aula.status === 'available' ? '#E4002B' : 'rgba(255,255,255,0.1)',
                      color: aula.status === 'available' ? '#fff6f5' : 'rgba(232,188,185,0.7)',
                      padding: '8px 24px',
                      borderRadius: '999px',
                      border: aula.status === 'available' ? 'none' : '1px solid rgba(255,255,255,0.2)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: '14px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      cursor: !currentAlunoId || aula.status === 'full' || aula.status === 'closed' ? 'not-allowed' : 'pointer',
                      boxShadow: aula.status === 'available' ? '0 0 15px rgba(228,0,43,0.2)' : 'none',
                      opacity: !currentAlunoId ? 0.6 : 1,
                    }}
                  >
                    {!currentAlunoId ? 'LOGIN' : aula.status === 'booked' ? 'CANCELAR' : aula.status === 'full' ? 'LOTADA' : aula.status === 'closed' ? 'ENCERRADA' : 'AGENDAR'}
                  </button>
                </form>
              ) : aula.status === 'available' ? (
                <button style={{ background: '#E4002B', color: '#fff6f5', padding: '8px 24px', borderRadius: '999px', border: 'none', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 0 15px rgba(228,0,43,0.2)' }}>
                  BOOK
                </button>
              ) : (
                <button style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(232,188,185,0.5)', padding: '8px 24px', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', cursor: 'not-allowed' }}>
                  FULL
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* FAB QR Check-in */}
      <a href="/checkin" style={{ position: 'fixed', bottom: '100px', right: '24px', width: '64px', height: '64px', borderRadius: '16px', background: '#E4002B', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(228,0,43,0.5)', textDecoration: 'none', zIndex: 40 }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h7v7H3zm2 2v3h3V5zm3 3H5V5h3zM14 3h7v7h-7zm2 2v3h3V5zm3 3h-3V5h3zM3 14h7v7H3zm2 2v3h3v-3zm3 3H5v-3h3zm6-3h2v2h-2zm2-2h2v2h-2zm-2-2h2v2h-2zm4 4h2v2h-2zm-2 2h2v2h-2zm2-4h2v2h-2z"/></svg>
      </a>
    </div>
  )
}
