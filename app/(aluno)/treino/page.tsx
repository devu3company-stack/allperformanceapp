import { Dumbbell, NotebookPen } from 'lucide-react'
import { getCurrentAlunoProfile } from '@/lib/current-aluno'

const card: React.CSSProperties = {
  background: 'rgba(30,32,32,0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '12px',
  overflow: 'hidden',
}

export default async function TreinoPage() {
  const aluno = await getCurrentAlunoProfile()

  if (!aluno) {
    return (
      <section style={{ ...card, padding: '18px 16px' }}>
        <p style={{ margin: 0, color: '#ffb3af', fontSize: '14px', lineHeight: 1.6 }}>
          Nao foi possivel carregar o treino do aluno agora.
        </p>
      </section>
    )
  }

  const treino = aluno.treinoPersonalizado?.trim() ?? ''
  const treinoAtualizadoEm = aluno.treinoAtualizadoEm
    ? aluno.treinoAtualizadoEm.toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
      })
    : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <section style={{ ...card, padding: '18px 16px' }}>
        <p
          style={{
            margin: 0,
            color: '#E4002B',
            fontSize: '11px',
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          Treino personalizado
        </p>
        <h1
          style={{
            margin: '10px 0 6px',
            color: '#fff',
            fontSize: '20px',
            fontFamily: "'Montserrat', sans-serif",
            lineHeight: 1.15,
          }}
        >
          Seu treino atual
        </h1>
        <p style={{ margin: 0, color: 'rgba(232,188,185,0.72)', fontSize: '13px', lineHeight: '1.6' }}>
          {treino
            ? 'Siga as orientacoes abaixo e fale com o professor se precisar ajustar carga, volume ou execucao.'
            : 'Seu professor ainda nao publicou um treino personalizado para voce.'}
        </p>
      </section>

      <section style={{ ...card, padding: '18px 16px' }}>
        {treino ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  background: 'rgba(228,0,43,0.14)',
                  color: '#E4002B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Dumbbell size={20} />
              </div>

              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, color: '#fff', fontSize: '15px', fontWeight: 700 }}>
                  Treino liberado para voce
                </p>
                <p style={{ margin: '4px 0 0', color: 'rgba(232,188,185,0.72)', fontSize: '12px', lineHeight: 1.5 }}>
                  {treinoAtualizadoEm
                    ? `Atualizado em ${treinoAtualizadoEm}${aluno.treinoAtualizadoPor ? ` por ${aluno.treinoAtualizadoPor}` : ''}`
                    : 'Ajustado pela equipe tecnica.'}
                </p>
              </div>
            </div>

            <div
              style={{
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(10,10,10,0.42)',
                padding: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#ffb3af' }}>
                <NotebookPen size={16} />
                <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Prescricao do treino
                </span>
              </div>

              <p style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#f5f5f5', fontSize: '14px', lineHeight: 1.8 }}>
                {treino}
              </p>
            </div>
          </>
        ) : (
          <div
            style={{
              borderRadius: '12px',
              border: '1px dashed rgba(255,255,255,0.12)',
              padding: '18px 16px',
              color: 'rgba(232,188,185,0.78)',
            }}
          >
            <p style={{ margin: 0, color: '#fff', fontSize: '15px', fontWeight: 700 }}>
              Nenhum treino cadastrado ainda.
            </p>
            <p style={{ margin: '8px 0 0', fontSize: '13px', lineHeight: 1.6 }}>
              Peca para o professor montar e salvar seu treino no painel interno. Assim que ele publicar, o conteudo vai aparecer aqui para voce.
            </p>
          </div>
        )}
      </section>
    </div>
  )
}
