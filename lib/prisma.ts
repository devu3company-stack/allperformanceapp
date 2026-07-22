import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

function getPoolConnectionString(connectionString?: string) {
  if (!connectionString) {
    return undefined
  }

  try {
    const parsedUrl = new URL(connectionString)
    parsedUrl.searchParams.delete('sslmode')
    return parsedUrl.toString()
  } catch {
    return connectionString
  }
}

const prismaClientSingleton = () => {
  const connectionString = getPoolConnectionString(process.env.DATABASE_URL)

  const pool = new Pool({
    connectionString,
    // Supabase pooler can present a certificate chain that Node's default
    // verification rejects in some serverless/build environments.
    ssl: connectionString?.includes('supabase.com')
      ? { rejectUnauthorized: false }
      : undefined,
  })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;
