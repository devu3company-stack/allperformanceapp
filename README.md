# ALL Performance

Sistema de gestão de academia — app do aluno (feed social, agenda, check-in) +
painel do gestor (alunos, planos, financeiro). Financeiro sincronizado via
API do Next Fit (não processa pagamento diretamente).

## Stack
- Next.js 14 (App Router)
- Prisma 7 + PostgreSQL (Supabase)
- Supabase Auth + Storage
- Tailwind CSS

## Estrutura
```
app/
  (aluno)/feed/        -> tela inicial do app do aluno (feed social)
  (gestor)/dashboard/   -> painel administrativo
prisma/
  schema.prisma         -> modelo de dados completo
scripts/
  sync-nextfit.ts        -> job de sincronização financeira com o Next Fit
lib/
  prisma.ts              -> client Prisma singleton
```

## Setup
```bash
npm install
cp .env.example .env      # preencher DATABASE_URL e credenciais Supabase
npx prisma db push
npm run dev
```

## Deploy — Vercel + Supabase

### 1. Supabase
- Criar projeto no Supabase
- Copiar as variáveis reais:
  - `DATABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
- Aplicar schema no banco:

```bash
npm run prisma:push
npm run prisma:generate
```

### 2. Primeiro acesso e banners
- O primeiro acesso do aluno depende de `SUPABASE_SERVICE_ROLE_KEY`
- Os banners e a conexão com o Next Fit são configurados no painel em `/settings`

### 3. Vercel
- Subir o projeto para um repositório Git
- Importar o repositório na Vercel
- Configurar as variáveis de ambiente acima
- Fazer o deploy

O script de build já está pronto para a Vercel:

```bash
npm run build
```

## Sincronização com o Next Fit

O financeiro é gerido pelo Next Fit. Este app apenas espelha os dados via API.

Passos para ativar:
1. No painel do Next Fit, ir em **Loja > API Next Fit > Conhecer > Ativar**
2. Gerar a **API Key**
3. Salvar `nextFitApiKey` e `nextFitAcademiaId` na tabela `academias` (via
   painel admin ou diretamente no banco)
4. Rodar manualmente: `npm run sync:nextfit`
5. Em produção, agendar como Vercel Cron Job (`vercel.json`) rodando a cada
   15–30 min, ou como Supabase Edge Function com `pg_cron`

⚠️ **Importante**: os endpoints em `scripts/sync-nextfit.ts` são placeholders
baseados na descrição pública da API do Next Fit. A documentação completa
fica atrás de login no painel deles (Loja > API Next Fit > Acessar
Documentação). Assim que tiver acesso, os endpoints e payloads reais
precisam ser conferidos e ajustados no script.

## Módulos — roadmap

- [x] Schema de dados (alunos, planos, matrículas, turmas, aulas, feed)
- [x] Feed social (tela inicial)
- [x] Painel do gestor (visão geral)
- [x] Job de sincronização financeira (Next Fit)
- [ ] Autenticação (Supabase Auth) — admin e aluno
- [ ] CRUD completo de alunos/planos/turmas no painel
- [ ] Agendamento de aulas + check-in (app do aluno)
- [ ] Upload de posts (Supabase Storage)
- [ ] Moderação de posts (aprovação pelo admin)
- [ ] Notificações via WhatsApp (Evolution API)
- [ ] Contrato digital
- [ ] Relatórios e gráficos
