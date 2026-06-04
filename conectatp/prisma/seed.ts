// Forzamos la variable directamente en el entorno de ejecución de Node.js
process.env.DATABASE_URL = "postgresql://postgres.nmwubtldkgtkceogluph:MonaSuiza2022@aws-1-sa-east-1.pooler.supabase.com:5432/postgres";

import { PrismaClient } from '@prisma/client';

// Creamos el cliente utilizando la misma conexión del pooler que dejamos en src/lib/prisma
import prisma from '../src/lib/prisma'; // Revisa si tu ruta usa 'src/lib/prisma' o '../lib/prisma'

async function main() {
  console.log('🌱 Iniciando el sembrado de datos (Seed)...');

  try {
    // Agregamos todos los campos obligatorios que pide tu tabla
    const institucionPrueba = await prisma.institucionTP.upsert({
      where: { rbd: 123456 }, 
      update: {}, 
      create: {
        rbd: 123456,
        nombre: 'Liceo Industrial Técnico de Prueba',
        comuna: 'Santiago',
        region: 'Región Metropolitana',
        dependencia: 'Municipal', // <-- ¡Agregamos el campo obligatorio!
      },
    });

    console.log('✅ ¡ÉXITO TOTAL! Institución creada en Supabase:');
    console.log(institucionPrueba);

  } catch (errorInternal) {
    console.error('❌ Error específico de Prisma al insertar:', errorInternal);
    throw errorInternal;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error general ejecutando el seed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });