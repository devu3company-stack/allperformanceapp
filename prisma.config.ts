import 'dotenv/config'
import { defineConfig } from '@prisma/config'

const datasourceUrl = process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? ''

export default defineConfig({
  datasource: {
    url: datasourceUrl,
  },
})
