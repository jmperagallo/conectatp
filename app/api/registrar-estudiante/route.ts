// app/api/registrar-estudiante/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    // 1. Leer y validar datos de entrada
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

    // 2. Cliente de Supabase con service_role (para operaciones privilegiadas)
    const supabaseAdmin = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { cookies: { get: () => undefined } }
    );

    // 3. Configurar transporte de correo (si no hay variables, no se enviarán)
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

    // 4. Procesar cada estudiante
    for (const est of estudiantes) {
      const { nombre, apellido_paterno, apellido_materno, rut, correo, telefono = '' } = est;
      
      // Validaciones por estudiante
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
        // 4.1 Crear usuario en Supabase Auth
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: correoNormalizado,
          password: passwordTemporal,
          email_confirm: true,
          user_metadata: { nombre, apellido_paterno, rol: 'estudiante' }
        });
        if (authError) throw new Error(`Auth: ${authError.message}`);
        console.log(`✅ Usuario creado: ${correoNormalizado}`);

        // 4.2 Insertar en tabla estudiantes
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

        // 4.3 Insertar en lista_blanca (rol estudiante)
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

        // 4.4 Enviar correo de invitación (si hay transporter)
        if (transporter) {
          try {
            await transporter.sendMail({
              from: `"Conecta TP" <${process.env.ZOHO_SMTP_USER}>`,
              to: correoNormalizado,
              subject: `🎓 Invitación a ConectaTP - ${institucion || 'Institución'}`,
              html: `
                <div style="font-family: system-ui, sans-serif; max-width: 580px; margin: auto; padding: 30px;">
                  <h2>Conecta<span style="color: #f97316;">TP</span></h2>
                  <p>Hola <strong>${nombre} ${apellido_paterno}</strong>,</p>
                  <p>Has sido registrado como <strong>estudiante</strong> en la especialidad <strong>${especialidad}</strong> de <strong>${institucion || 'tu institución'}</strong>.</p>
                  <p>Accede a la plataforma con tus credenciales:</p>
                  <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center;">
                    <div><strong>Usuario:</strong> ${correoNormalizado}</div>
                    <div><strong>Contraseña temporal:</strong> <code style="background:#fff; padding:2px 6px;">${passwordTemporal}</code></div>
                  </div>
                  <p>🔗 <a href="${process.env.NEXTAUTH_URL || 'https://conectatp.cl'}/login">Iniciar sesión</a></p>
                  <p>⚠️ Al primer ingreso, deberás cambiar tu contraseña.</p>
                  <hr />
                  <small>Correo automático, no responder.</small>
                </div>
              `,
            });
            console.log(`📧 Correo enviado a ${correoNormalizado}`);
          } catch (emailError: any) {
            console.error(`❌ Error enviando correo a ${correoNormalizado}:`, emailError);
            // No fallamos la operación principal, solo registramos el error
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

    // 5. Respuesta final
    return NextResponse.json({ success: true, resultados });
  } catch (error: any) {
    console.error('🔥 Error general en endpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}