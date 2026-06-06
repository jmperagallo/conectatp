// app/api/registrar-estudiante/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { estudiantes, idLiceo, especialidad, institucion } = await request.json();
    
    console.log('🔍 [registrar-estudiante] Datos recibidos:', {
      estudiantesCount: estudiantes?.length,
      idLiceo,
      especialidad,
      institucion,
      primerEstudiante: estudiantes?.[0]
    });

    if (!estudiantes || !Array.isArray(estudiantes) || estudiantes.length === 0) {
      return NextResponse.json({ error: 'No se envió una lista de estudiantes válida' }, { status: 400 });
    }
    if (!idLiceo) {
      return NextResponse.json({ error: 'Falta el id_liceo' }, { status: 400 });
    }
    if (!especialidad) {
      return NextResponse.json({ error: 'Falta la especialidad' }, { status: 400 });
    }

    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { get: () => undefined } }
    );

    let transporter = null;
    if (process.env.ZOHO_SMTP_HOST && process.env.ZOHO_SMTP_USER && process.env.ZOHO_SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.ZOHO_SMTP_HOST,
        port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
        secure: true,
        auth: {
          user: process.env.ZOHO_SMTP_USER,
          pass: process.env.ZOHO_SMTP_PASS,
        },
      });
    } else {
      console.warn('⚠️ Variables de correo no configuradas. No se enviarán emails.');
    }

    const resultados = [];

    for (const est of estudiantes) {
      const { nombre, apellido_paterno, apellido_materno, rut, correo, telefono = '' } = est;
      
      if (!nombre || !apellido_paterno || !rut || !correo) {
        resultados.push({
          correo: correo || 'sin correo',
          success: false,
          error: 'Faltan campos obligatorios (nombre, apellido_paterno, rut, correo)'
        });
        continue;
      }

      const correoNormalizado = correo.trim().toLowerCase();
      const rutLimpio = rut.replace(/[^0-9kK]/g, '').toUpperCase();
      const passwordTemporal = `CNX-${Math.floor(1000 + Math.random() * 9000)}-TP`;

      try {
        // Crear usuario en Auth
        const { error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: correoNormalizado,
          password: passwordTemporal,
          email_confirm: true,
          user_metadata: { nombre, apellido_paterno, rol: 'estudiante' }
        });
        if (authError) throw new Error(`Auth: ${authError.message}`);
        console.log(`✅ Usuario creado: ${correoNormalizado}`);

        // Insertar en estudiantes
        const { error: estudianteError } = await supabaseAdmin
          .from('estudiantes')
          .insert({
            id_liceo: idLiceo,
            nombre,
            apellido_paterno,
            apellido_materno: apellido_materno || '',
            rut: rutLimpio,
            correo: correoNormalizado,
            telefono,
            especialidad,
            perfil_completo: false
          });
        if (estudianteError) throw new Error(`Estudiante: ${estudianteError.message}`);

        // Insertar en lista_blanca
        const { error: listaError } = await supabaseAdmin
          .from('lista_blanca')
          .insert({
            correo: correoNormalizado,
            nombre,
            apellido_paterno,
            apellido_materno: apellido_materno || '',
            rol: 'estudiante',
            id_liceo: idLiceo,
            especialidad,
            invitacion_enviada: true
          });
        if (listaError) throw new Error(`Lista blanca: ${listaError.message}`);

        // Enviar correo (si hay transporter)
        if (transporter) {
          try {
            await transporter.sendMail({
              from: `"Conecta TP" <${process.env.ZOHO_SMTP_USER}>`,
              to: correoNormalizado,
              subject: `🎓 Invitación a ConectaTP - ${institucion || 'Institución'}`,
              html: `...` // (el HTML que ya tenías)
            });
            console.log(`📧 Correo enviado a ${correoNormalizado}`);
          } catch (emailError: any) {
            console.error(`❌ Error enviando correo a ${correoNormalizado}:`, emailError);
            resultados.push({
              correo: correoNormalizado,
              success: true,
              warning: `Estudiante registrado pero no se pudo enviar correo: ${emailError.message}`
            });
            continue;
          }
        }

        resultados.push({ correo: correoNormalizado, success: true });
      } catch (error: any) {
        console.error(`❌ Error procesando a ${correoNormalizado}:`, error);
        resultados.push({
          correo: correoNormalizado,
          success: false,
          error: error.message
        });
      }
    }

    return NextResponse.json({ success: true, resultados });
  } catch (error: any) {
    console.error('🔥 Error general en endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}