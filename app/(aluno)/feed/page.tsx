import prisma from '@/lib/prisma'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const card: React.CSSProperties = {
  background: 'rgba(30,32,32,0.6)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '12px',
  overflow: 'hidden',
}

type FeedCard = {
  id: string
  autor: string
  tempo: string
  avatarSeed: string
  avatarBorder: string
  imagemUrl: string
  badge: string | null
  likes: number
  comentarios: number
  legenda: string
  tags: string
  isVideo: boolean
}

const mockPosts: FeedCard[] = [
  {
    id: '1',
    autor: 'Prof. Marcus',
    tempo: 'há 2 horas • Equipe técnica',
    avatarSeed: 'prof-marcus',
    avatarBorder: '#00E5FF',
    imagemUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
    badge: 'AVISO',
    likes: 0,
    comentarios: 0,
    legenda: 'A aula de funcional das 19h foi movida para o studio 2. Cheguem com 10 minutos de antecedência.',
    tags: '',
    isVideo: false,
  },
  {
    id: '2',
    autor: 'Equipe ALL Performance',
    tempo: 'há 5 horas • Operação',
    avatarSeed: 'equipe-all-performance',
    avatarBorder: '#00E5FF',
    imagemUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
    badge: 'NOVIDADE',
    likes: 0,
    comentarios: 0,
    legenda: 'Os armários do vestiário foram reorganizados. Procure a recepção caso precise de novo cadeado.',
    tags: '',
    isVideo: false,
  },
]

function getBadgeForType(tipo: string) {
  switch (tipo) {
    case 'NOVIDADE':
      return 'NOVIDADE'
    case 'AVISO':
      return 'AVISO'
    case 'PROMOCAO':
      return 'PROMO'
    default:
      return null
  }
}

export default async function FeedPage() {
  let displayPosts = mockPosts

  try {
    const posts = await prisma.post.findMany({
      where: {
        status: 'APROVADO',
        autorUsuarioId: { not: null },
      },
      include: { autorUsuario: true, _count: { select: { likes: true, comentarios: true } } },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    const mappedPosts: FeedCard[] = posts.map((post) => {
      const authorName = post.autorUsuario?.nome ?? 'ALL Performance'

      return {
        id: post.id,
        autor: authorName,
        tempo: `${formatDistanceToNow(post.createdAt, { addSuffix: true, locale: ptBR })} • Equipe interna`,
        avatarSeed: authorName.toLowerCase().replace(/\s+/g, '-'),
        avatarBorder: '#00E5FF',
        imagemUrl: post.imagemUrl,
        badge: getBadgeForType(post.tipo),
        likes: post._count.likes,
        comentarios: post._count.comentarios,
        legenda: post.legenda ?? 'Sem legenda.',
        tags: '',
        isVideo: false,
      }
    })

    if (mappedPosts.length > 0) {
      displayPosts = mappedPosts
    }
  } catch (e) {}

  return (
    <div>
      <section style={{ marginBottom: '24px' }}>
        <div style={{ ...card, padding: '18px 16px' }}>
          <p style={{ margin: 0, color: '#E4002B', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Comunicados internos
          </p>
          <h2 style={{ margin: '10px 0 6px', color: '#fff', fontSize: '20px', fontFamily: "'Montserrat', sans-serif", lineHeight: 1.15 }}>
            Atualizações da equipe e dos professores
          </h2>
          <p style={{ margin: 0, color: 'rgba(232,188,185,0.72)', fontSize: '13px', lineHeight: '1.6' }}>
            Por enquanto, o feed funciona como mural interno da academia. Apenas equipe e professores publicam avisos, mudanças de aula e orientações importantes.
          </p>
        </div>
      </section>

      <section style={{ marginBottom: '24px', overflowX: 'auto', display: 'flex', gap: '14px', paddingBottom: '8px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {[
          { name: 'Prof. Marcus', seed: 'prof-marcus', active: true },
          { name: 'Coach Jax', seed: 'coach-jax', active: true },
          { name: 'Recepção', seed: 'recepcao', active: false },
          { name: 'Coordenação', seed: 'coordenacao', active: false },
        ].map((s) => (
          <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', flexShrink: 0, opacity: s.active ? 1 : 0.7, width: '64px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', padding: '2px', background: s.active ? 'linear-gradient(135deg, #E4002B, #ffb3af)' : '#282a2b', boxShadow: s.active ? '0 0 0 2px #0A0A0A' : 'none' }}>
              <img alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', border: '2px solid #0A0A0A' }} src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${s.seed}`} />
            </div>
            <span style={{ fontSize: '10px', color: s.active ? '#E4002B' : 'rgba(232,188,185,0.7)', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.03em', textAlign: 'center', lineHeight: 1.3 }}>{s.name}</span>
          </div>
        ))}
      </section>

      {/* Feed Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {displayPosts.map((post) => (
          <article key={post.id} style={card}>
            {/* Header */}
            <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', border: `1px solid ${post.avatarBorder}` }}>
                  <img alt={post.autor} style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${post.avatarSeed}`} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: '#fff', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{post.autor}</p>
                  <p style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", color: 'rgba(232,188,185,0.7)', lineHeight: 1.4 }}>{post.tempo}</p>
                </div>
              </div>
              <button style={{ background: 'none', border: 'none', color: 'rgba(232,188,185,0.7)', cursor: 'pointer', padding: '4px' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
              </button>
            </div>
            {/* Image */}
            <div style={{ position: 'relative', aspectRatio: post.isVideo ? '16/9' : '1/1' }}>
              <img alt="Post" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} src={post.imagemUrl} />
              {post.badge && (
                <div style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(8px)', padding: '4px 12px', borderRadius: '999px', border: '1px solid rgba(228,0,43,0.3)' }}>
                  <p style={{ color: '#E4002B', fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>{post.badge}</p>
                </div>
              )}
              {post.isVideo && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(228,0,43,0.2)', border: '1px solid #E4002B', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(228,0,43,0.4)' }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="#E4002B"><polygon points="5,3 19,12 5,21"/></svg>
                  </div>
                </div>
              )}
            </div>
            {/* Actions */}
            <div style={{ padding: '14px 16px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: '#E4002B', cursor: 'pointer' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>{post.likes}</span>
                  </button>
                  <button style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(232,188,185,0.7)', cursor: 'pointer' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    <span style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" }}>{post.comentarios}</span>
                  </button>
                  <button style={{ background: 'none', border: 'none', color: 'rgba(232,188,185,0.7)', cursor: 'pointer' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  </button>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'rgba(232,188,185,0.7)', cursor: 'pointer' }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
              <p style={{ fontSize: '14px', color: '#e2e2e2', lineHeight: '1.5', marginBottom: '4px' }}>
                <span style={{ fontWeight: 700, color: '#fff' }}>{post.autor.split(' ')[0]}</span>{' '}
                {post.legenda}
              </p>
              {post.tags && <p style={{ fontSize: '12px', fontFamily: "'JetBrains Mono', monospace", color: '#ffb3af' }}>{post.tags}</p>}
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
