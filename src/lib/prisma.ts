import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const prismaClientSingleton = () => {
  // 1. Configuramos el pool de conexión nativo de PG usando tu URL
  const pool = new pg.Pool({
    connectionString: "postgresql://postgres.nmwubtldkgtkceogluph:MonaSuiza2022@aws-1-sa-east-1.pooler.supabase.com:5432/postgres",
  });
  
  // 2. Creamos el adaptador oficial exigido por Prisma 7
  const adapter = new PrismaPg(pool);

  // 3. Inicializamos el cliente pasándole el adaptador
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma;