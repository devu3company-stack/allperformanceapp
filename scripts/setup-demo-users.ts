import prisma from '../lib/prisma'
import { getDefaultAcademia } from '../lib/academia'
import { createAdminClient } from '../lib/supabase/admin'

const demoUsers = [
  {
    email: 'gestor.teste@allperformance.local',
    password: '12345678',
    role: 'gestor' as const,
    nome: 'Gestor Teste',
  },
  {
    email: 'professor.teste@allperformance.local',
    password: '12345678',
    role: 'professor' as const,
    nome: 'Professor Teste',
  },
  {
    email: 'aluno.teste@allperformance.local',
    password: '12345678',
    role: 'aluno' as const,
    nome: 'Aluno Teste',
    cpf: '12345678901',
  },
] as const

async function ensureAuthUser(
  email: string,
  password: string,
  role: string,
  supabaseAdmin: ReturnType<typeof createAdminClient>
) {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers()

  if (error) {
    throw error
  }

  const existingUser = data.users.find((user) => user.email?.toLowerCase() === email)

  if (existingUser) {
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.id,
      {
        password,
        email_confirm: true,
        app_metadata: { role },
        user_metadata: { role },
      }
    )

    if (updateError) {
      throw updateError
    }

    return existingUser.id
  }

  const { data: createdUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role },
    user_metadata: { role },
  })

  if (createError) {
    throw createError
  }

  return createdUser.user.id
}

async function main() {
  const academia = await getDefaultAcademia()
  const supabaseAdmin = createAdminClient()

  for (const demoUser of demoUsers) {
    await ensureAuthUser(demoUser.email, demoUser.password, demoUser.role, supabaseAdmin)

    if (demoUser.role === 'gestor') {
      await prisma.usuario.upsert({
        where: { email: demoUser.email },
        update: {
          nome: demoUser.nome,
          papel: 'GESTOR',
          ativo: true,
        },
        create: {
          academiaId: academia.id,
          nome: demoUser.nome,
          email: demoUser.email,
          senhaHash: 'supabase-managed',
          papel: 'GESTOR',
          ativo: true,
        },
      })
    }

    if (demoUser.role === 'professor') {
      await prisma.professor.upsert({
        where: { id: `demo-professor-${academia.id}` },
        update: {
          nome: demoUser.nome,
          email: demoUser.email,
          ativo: true,
        },
        create: {
          id: `demo-professor-${academia.id}`,
          academiaId: academia.id,
          nome: demoUser.nome,
          email: demoUser.email,
          especialidades: ['Comunicados internos'],
          ativo: true,
        },
      })

      await prisma.usuario.upsert({
        where: { email: demoUser.email },
        update: {
          nome: demoUser.nome,
          papel: 'PROFESSOR',
          ativo: true,
        },
        create: {
          academiaId: academia.id,
          nome: demoUser.nome,
          email: demoUser.email,
          senhaHash: 'supabase-managed',
          papel: 'PROFESSOR',
          ativo: true,
        },
      })
    }

    if (demoUser.role === 'aluno') {
      await prisma.aluno.upsert({
        where: {
          academiaId_cpf: {
            academiaId: academia.id,
            cpf: demoUser.cpf,
          },
        },
        update: {
          nome: demoUser.nome,
          email: demoUser.email,
          ativoNoApp: true,
          status: 'ATIVO',
          unidadeTreino: 'ZERAO',
        },
        create: {
          academiaId: academia.id,
          nome: demoUser.nome,
          cpf: demoUser.cpf,
          email: demoUser.email,
          ativoNoApp: true,
          status: 'ATIVO',
          unidadeTreino: 'ZERAO',
        },
      })
    }
  }

  console.log('Usuários de teste prontos:')
  demoUsers.forEach((user) => {
    console.log(`- ${user.role}: ${user.email} / ${user.password}`)
  })
}

main()
  .catch((error) => {
    console.error('Erro ao configurar usuários de teste:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
