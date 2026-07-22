/**
 * ALL PERFORMANCE — Sincronização com a API do Next Fit
 * ---------------------------------------------------------
 * Este script roda periodicamente (cron / Supabase Edge Function / Vercel
 * Cron Job) e sincroniza dados FINANCEIROS do Next Fit para o banco do
 * ALL Performance. O ALL Performance NÃO processa pagamento: apenas
 * espelha o status vindo do Next Fit (fonte da verdade).
 *
 * Pré-requisitos:
 *  1. Ativar a API na "Loja" do Next Fit (dentro do painel da academia)
 *  2. Gerar a API Key
 *  3. Preencher Academia.nextFitApiKey e Academia.nextFitAcademiaId no banco
 *
 * IMPORTANTE: os nomes exatos dos endpoints/payloads abaixo são
 * PLACEHOLDERS. A documentação oficial da API do Next Fit fica atrás de
 * login (Loja > API Next Fit > Acessar Documentação). Assim que você tiver
 * acesso, me envie os endpoints reais de:
 *   - Contratos / Matrículas
 *   - Pagamentos / Financeiro
 *   - Clientes (para o vínculo por CPF)
 * e eu ajusto este arquivo para bater exatamente com o schema da API deles.
 */

import { PrismaClient, StatusPagamento } from "@prisma/client";

const prisma = new PrismaClient();

const NEXTFIT_BASE_URL = "https://api.nextfit.com.br"; // PLACEHOLDER — confirmar na doc oficial

interface NextFitCliente {
  id: string;
  cpf: string;
  nome: string;
  email?: string;
  telefone?: string;
}

interface NextFitContrato {
  id: string;
  clienteId: string;
  planoId: string;
  dataInicio: string;
  dataFim: string;
  statusPagamento: "pago" | "pendente" | "atrasado" | "cancelado";
  ultimoPagamentoEm?: string;
  proximoVencimentoEm?: string;
}

function mapStatusPagamento(status: NextFitContrato["statusPagamento"]): StatusPagamento {
  switch (status) {
    case "pago":
      return StatusPagamento.PAGO;
    case "pendente":
      return StatusPagamento.PENDENTE;
    case "atrasado":
      return StatusPagamento.ATRASADO;
    case "cancelado":
      return StatusPagamento.CANCELADO;
    default:
      return StatusPagamento.PENDENTE;
  }
}

async function fetchNextFit<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${NEXTFIT_BASE_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${apiKey}`, // formato exato de auth a confirmar na doc
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Next Fit API error (${res.status}) em ${path}: ${await res.text()}`);
  }

  return res.json() as Promise<T>;
}

async function syncAcademia(academiaId: string, apiKey: string, nextFitAcademiaId: string) {
  console.log(`[sync-nextfit] Iniciando sincronização da academia ${academiaId}...`);

  // 1. Buscar clientes (para vincular por CPF)
  const clientes = await fetchNextFit<NextFitCliente[]>(
    `/v1/academias/${nextFitAcademiaId}/clientes`,
    apiKey
  );

  for (const cliente of clientes) {
    await prisma.aluno.upsert({
      where: { academiaId_cpf: { academiaId, cpf: cliente.cpf } },
      update: {
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        nextFitClienteId: cliente.id,
      },
      create: {
        academiaId,
        cpf: cliente.cpf,
        nome: cliente.nome,
        email: cliente.email,
        telefone: cliente.telefone,
        nextFitClienteId: cliente.id,
      },
    });
  }

  // 2. Buscar contratos/pagamentos e atualizar matrículas
  const contratos = await fetchNextFit<NextFitContrato[]>(
    `/v1/academias/${nextFitAcademiaId}/contratos`,
    apiKey
  );

  for (const contrato of contratos) {
    const aluno = await prisma.aluno.findFirst({
      where: { academiaId, nextFitClienteId: contrato.clienteId },
    });

    if (!aluno) continue; // aluno ainda não sincronizado, próxima rodada resolve

    await prisma.matricula.updateMany({
      where: { alunoId: aluno.id, nextFitContratoId: contrato.id },
      data: {
        statusPagamento: mapStatusPagamento(contrato.statusPagamento),
        ultimoPagamentoEm: contrato.ultimoPagamentoEm ? new Date(contrato.ultimoPagamentoEm) : null,
        proximoVencimentoEm: contrato.proximoVencimentoEm ? new Date(contrato.proximoVencimentoEm) : null,
        syncAt: new Date(),
      },
    });
  }

  await prisma.academia.update({
    where: { id: academiaId },
    data: { nextFitSyncAt: new Date() },
  });

  console.log(`[sync-nextfit] Academia ${academiaId} sincronizada: ${clientes.length} alunos, ${contratos.length} contratos.`);
}

async function main() {
  const academias = await prisma.academia.findMany({
    where: {
      nextFitApiKey: { not: null },
      nextFitAcademiaId: { not: null },
    },
  });

  for (const academia of academias) {
    try {
      await syncAcademia(academia.id, academia.nextFitApiKey!, academia.nextFitAcademiaId!);
    } catch (err) {
      console.error(`[sync-nextfit] Falha ao sincronizar ${academia.nome}:`, err);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
