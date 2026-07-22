# PROMPT — ALL Performance (Sistema de Gestão de Academia)

Cole este prompt completo no Antigravity para gerar o sistema. Ele já contém
stack, identidade visual, modelo de dados e escopo funcional definidos.

---

## 1. Visão geral do projeto

Crie um sistema web chamado **ALL Performance**, um app de gestão para
academias (SaaS multi-tenant), com duas frentes:

1. **App do aluno** — tela inicial em formato de **feed social** (como
   Instagram): novidades e avisos da academia + fotos postadas pelos
   próprios alunos, com curtidas e comentários. Também inclui agendamento de
   aulas e check-in.
2. **Painel do gestor** — dashboard administrativo com visão geral de
   alunos, financeiro, aulas do dia e moderação de conteúdo do feed.

O módulo **financeiro NÃO processa pagamento diretamente**. O pagamento real
é feito pelo sistema **Next Fit** (ERP de academias já usado pelo cliente).
O ALL Performance deve **sincronizar** (via API do Next Fit) os dados de
contratos, status de pagamento e clientes, e apenas espelhar essas
informações — nunca duplicar cobrança.

## 2. Stack obrigatória

- **Next.js 14** (App Router, TypeScript)
- **Prisma 7** como ORM
- **PostgreSQL** via **Supabase** (usar também Supabase Auth para login e
  Supabase Storage para upload de imagens do feed)
- **Tailwind CSS** para estilização
- **lucide-react** para ícones
- Deploy alvo: **Vercel**

## 3. Identidade visual (obrigatória — seguir à risca)

Paleta oficial da marca: **vermelho, branco e preto**.

```
ap-black    #0A0A0A   (fundo de destaque, headers, texto principal)
ap-charcoal #1A1A1A   (superfícies escuras secundárias)
ap-red      #E4002B   (cor de ação: CTAs, badges, likes, alertas)
ap-redDark  #B5001F   (hover/estado ativo do vermelho)
ap-white    #FFFFFF   (fundo neutro)
ap-gray     #F2F2F2   (fundo neutro do painel)
ap-grayLine #E5E5E5   (bordas e divisores)
```

Tipografia:
- **Display (títulos, headers, números de destaque)**: fonte condensada e
  forte — usar **Anton** (Google Fonts), transmite energia/clima esportivo.
- **Corpo de texto**: **Inter** (Google Fonts), limpa e legível.

Diretrizes de UI:
- Headers em preto sólido, com o nome "ALL PERFORMANCE" onde "PERFORMANCE"
  aparece em vermelho.
- Cards com fundo branco, bordas sutis; cards de alerta (inadimplência,
  moderação pendente) recebem borda vermelha.
- Botões primários: fundo preto ou vermelho, texto branco, hover em
  `ap-redDark`.
- Nada de gradientes genéricos ou emojis decorativos — visual sóbrio,
  esportivo, direto.

## 4. Modelo de dados (Prisma Schema completo)

Use exatamente este schema como base — pode adicionar campos, mas não
remova os existentes nem quebre as relações:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Academia {
  id          String   @id @default(cuid())
  nome        String
  slug        String   @unique
  logoUrl     String?
  corPrimaria String   @default("#E4002B")

  nextFitApiKey     String?
  nextFitAcademiaId String?
  nextFitSyncAt     DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  usuarios    Usuario[]
  alunos      Aluno[]
  planos      Plano[]
  turmas      Turma[]
  aulas       Aula[]
  posts       Post[]
  professores Professor[]

  @@map("academias")
}

enum PapelUsuario {
  ADMIN
  GESTOR
  RECEPCAO
  PROFESSOR
}

model Usuario {
  id         String       @id @default(cuid())
  academiaId String
  academia   Academia     @relation(fields: [academiaId], references: [id])
  nome       String
  email      String       @unique
  senhaHash  String
  papel      PapelUsuario @default(RECEPCAO)
  ativo      Boolean      @default(true)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt
  postsAutor Post[]

  @@index([academiaId])
  @@map("usuarios")
}

model Professor {
  id             String   @id @default(cuid())
  academiaId     String
  academia       Academia @relation(fields: [academiaId], references: [id])
  nome           String
  email          String?
  telefone       String?
  fotoUrl        String?
  especialidades String[]
  ativo          Boolean  @default(true)
  turmas         Turma[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  @@index([academiaId])
  @@map("professores")
}

enum StatusAluno {
  ATIVO
  INATIVO
  SUSPENSO
  INADIMPLENTE
}

model Aluno {
  id               String      @id @default(cuid())
  academiaId       String
  academia         Academia    @relation(fields: [academiaId], references: [id])
  nome             String
  cpf              String
  email            String?
  telefone         String?
  fotoUrl          String?
  dataNascimento   DateTime?
  status           StatusAluno @default(ATIVO)
  nextFitClienteId String?
  senhaHash        String?
  ativoNoApp       Boolean     @default(true)

  matriculas    Matricula[]
  checkIns      CheckIn[]
  posts         Post[]
  likes         PostLike[]
  comentarios   PostComment[]
  agendamentos  Agendamento[]

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@unique([academiaId, cpf])
  @@index([academiaId, status])
  @@map("alunos")
}

model Plano {
  id             String      @id @default(cuid())
  academiaId     String
  academia       Academia    @relation(fields: [academiaId], references: [id])
  nome           String
  descricao      String?
  valor          Decimal     @db.Decimal(10, 2)
  duracaoDias    Int
  ativo          Boolean     @default(true)
  nextFitPlanoId String?
  matriculas     Matricula[]
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt

  @@index([academiaId])
  @@map("planos")
}

enum StatusMatricula {
  ATIVA
  VENCIDA
  CANCELADA
  PENDENTE
}

enum StatusPagamento {
  PAGO
  PENDENTE
  ATRASADO
  CANCELADO
}

model Matricula {
  id         String          @id @default(cuid())
  alunoId    String
  aluno      Aluno           @relation(fields: [alunoId], references: [id])
  planoId    String
  plano      Plano           @relation(fields: [planoId], references: [id])
  dataInicio DateTime
  dataFim    DateTime
  status     StatusMatricula @default(ATIVA)

  statusPagamento     StatusPagamento @default(PENDENTE)
  ultimoPagamentoEm   DateTime?
  proximoVencimentoEm DateTime?
  nextFitContratoId   String?
  syncAt              DateTime?

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([alunoId])
  @@index([statusPagamento])
  @@map("matriculas")
}

model Turma {
  id          String     @id @default(cuid())
  academiaId  String
  academia    Academia   @relation(fields: [academiaId], references: [id])
  professorId String?
  professor   Professor? @relation(fields: [professorId], references: [id])
  nome        String
  modalidade  String
  capacidade  Int        @default(20)
  diaSemana   Int
  horaInicio  String
  horaFim     String
  ativa       Boolean    @default(true)
  aulas       Aula[]
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  @@index([academiaId])
  @@map("turmas")
}

model Aula {
  id           String        @id @default(cuid())
  academiaId   String
  academia     Academia      @relation(fields: [academiaId], references: [id])
  turmaId      String
  turma        Turma         @relation(fields: [turmaId], references: [id])
  data         DateTime
  cancelada    Boolean       @default(false)
  agendamentos Agendamento[]
  checkIns     CheckIn[]
  createdAt    DateTime      @default(now())

  @@index([academiaId, data])
  @@map("aulas")
}

model Agendamento {
  id        String   @id @default(cuid())
  alunoId   String
  aluno     Aluno    @relation(fields: [alunoId], references: [id])
  aulaId    String
  aula      Aula     @relation(fields: [aulaId], references: [id])
  presente  Boolean  @default(false)
  cancelado Boolean  @default(false)
  createdAt DateTime @default(now())

  @@unique([alunoId, aulaId])
  @@map("agendamentos")
}

model CheckIn {
  id       String   @id @default(cuid())
  alunoId  String
  aluno    Aluno    @relation(fields: [alunoId], references: [id])
  aulaId   String?
  aula     Aula?    @relation(fields: [aulaId], references: [id])
  metodo   String   @default("qrcode")
  criadoEm DateTime @default(now())

  @@index([alunoId])
  @@map("check_ins")
}

enum TipoPost {
  NOVIDADE
  AVISO
  PROMOCAO
  POST_ALUNO
}

enum StatusPost {
  APROVADO
  PENDENTE
  REJEITADO
}

model Post {
  id             String     @id @default(cuid())
  academiaId     String
  academia       Academia   @relation(fields: [academiaId], references: [id])
  autorUsuarioId String?
  autorUsuario   Usuario?   @relation(fields: [autorUsuarioId], references: [id])
  autorAlunoId   String?
  autorAluno     Aluno?     @relation(fields: [autorAlunoId], references: [id])
  tipo           TipoPost
  legenda        String?
  imagemUrl      String
  status         StatusPost @default(APROVADO)
  denunciado     Boolean    @default(false)
  likes          PostLike[]
  comentarios    PostComment[]
  createdAt      DateTime   @default(now())
  updatedAt      DateTime   @updatedAt

  @@index([academiaId, status, createdAt])
  @@map("posts")
}

model PostLike {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  alunoId   String
  aluno     Aluno    @relation(fields: [alunoId], references: [id])
  createdAt DateTime @default(now())

  @@unique([postId, alunoId])
  @@map("post_likes")
}

model PostComment {
  id        String   @id @default(cuid())
  postId    String
  post      Post     @relation(fields: [postId], references: [id])
  alunoId   String
  aluno     Aluno    @relation(fields: [alunoId], references: [id])
  texto     String
  createdAt DateTime @default(now())

  @@map("post_comments")
}

model ConfiguracaoAcademia {
  academiaId         String  @id
  feedModeracaoAtiva Boolean @default(true)
  permiteComentarios Boolean @default(true)

  @@map("configuracoes_academia")
}
```

## 5. Escopo funcional — construir nesta ordem

### Fase 1 — MVP
1. **Autenticação** via Supabase Auth, com dois perfis: `aluno` e
   `gestor/admin`, cada um com fluxo de login próprio e redirecionamento
   para sua área (`/feed` para aluno, `/dashboard` para gestor).
2. **CRUD de alunos, planos e matrículas** no painel do gestor.
3. **Agenda de turmas e aulas** — o gestor cria turmas (dia, horário,
   professor, capacidade); o sistema gera as ocorrências de aula.
4. **Check-in** — tela simples no app do aluno para check-in via QR code ou
   botão manual (sem integração de catraca nesta fase).
5. **Feed social (tela inicial do app do aluno)**:
   - Lista de posts (institucionais + de alunos), mais recentes primeiro
   - Curtir e comentar
   - Upload de foto (Supabase Storage) com legenda
   - Posts de aluno entram como `PENDENTE` se
     `ConfiguracaoAcademia.feedModeracaoAtiva = true`; senão, `APROVADO`
     direto
   - Tela de moderação no painel do gestor para aprovar/rejeitar posts
     pendentes e ver denúncias
6. **Painel do gestor — dashboard**: cards com alunos ativos, inadimplência
   (pendente/atrasado), aulas do dia, posts pendentes de moderação.

### Fase 2
7. Sincronização financeira com a **API do Next Fit** (ver seção 6)
8. CRM simples: leads, funil, follow-up de renovação de matrícula

### Fase 3
9. Contrato digital (assinatura eletrônica)
10. Relatórios e gráficos (retenção, frequência, faturamento — vindo do Next Fit)
11. Notificações automáticas via WhatsApp (Evolution API)

### Fase 4 (não implementar agora, apenas deixar hooks/preparação)
12. Integração com catraca/controle de acesso físico
13. Nota fiscal automática
14. IA para sugestão de treino

## 6. Sincronização financeira com o Next Fit

O financeiro é gerido no **Next Fit** (ERP externo). O ALL Performance deve
ler dados de lá via API, nunca processar pagamento diretamente.

- A academia ativa a API na "Loja" do painel Next Fit e gera uma
  **API Key** — armazenada em `Academia.nextFitApiKey` /
  `Academia.nextFitAcademiaId`.
- Criar um job (`scripts/sync-nextfit.ts`, rodável via `npm run
  sync:nextfit` e agendável como Vercel Cron Job) que:
  1. Busca clientes na API do Next Fit e faz `upsert` em `Aluno`,
     vinculando por **CPF** (campo único por academia).
  2. Busca contratos/pagamentos e atualiza `Matricula.statusPagamento`,
     `ultimoPagamentoEm`, `proximoVencimentoEm`.
  3. Atualiza `Academia.nextFitSyncAt` ao final.
- **Importante**: os endpoints exatos da API do Next Fit exigem login no
  painel deles para acessar a documentação completa (Loja > API Next Fit >
  Acessar Documentação). Implemente a estrutura do client HTTP com
  endpoints placeholder claramente marcados como `// TODO: confirmar na
  documentação oficial`, para eu ajustar depois com os dados reais.
- O painel do gestor NUNCA deve ter tela de "criar cobrança" ou "receber
  pagamento" — isso é feito no Next Fit. O ALL Performance é somente
  leitura nesse módulo.

## 7. Estrutura de pastas esperada

```
app/
  (aluno)/
    feed/page.tsx
    agenda/page.tsx
    checkin/page.tsx
  (gestor)/
    dashboard/page.tsx
    alunos/page.tsx
    planos/page.tsx
    turmas/page.tsx
    moderacao/page.tsx
  api/
    posts/route.ts
    checkin/route.ts
lib/
  prisma.ts
  supabase/
    client.ts
    server.ts
prisma/
  schema.prisma
scripts/
  sync-nextfit.ts
```

## 8. Regras não-negociáveis

- Multi-tenant: toda query deve ser filtrada por `academiaId` — nunca
  vazar dado de uma academia para outra.
- Não implementar processamento de pagamento (cartão, PIX, boleto) — isso
  é do Next Fit.
- Seguir a paleta de cores e tipografia da seção 3 em toda a interface, sem
  exceção.
- Código em TypeScript, com tipagem estrita (sem `any`).
- Mobile-first no app do aluno (a maioria dos alunos vai acessar pelo
  celular).

---

**Fim do prompt.** Gere o projeto completo seguindo esta especificação.
