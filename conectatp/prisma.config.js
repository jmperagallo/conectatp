// Prisma 7 requiere que carguemos dotenv explícitamente aquí si usamos un archivo .js
require('dotenv').config();

module.exports = {
  schema: './prisma/schema.prisma',
  datasource: {
    url: "postgresql://postgres.nmwubtldkgtkceogluph:MonaSuiza2022@aws-1-sa-east-1.pooler.supabase.com:5432/postgres",
  },
  migrations: {
    seed: 'npx tsx ./prisma/seed.ts',
  },
};