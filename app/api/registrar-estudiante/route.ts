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
        // 1. Crear usuario en Auth
        const { error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: correoNormalizado,
          password: passwordTemporal,
          email_confirm: true,
          user_metadata: { nombre, apellido_paterno, rol: 'estudiante' }
        });
        if (authError) throw new Error(`Auth: ${authError.message}`);
        console.log(`✅ Usuario creado: ${correoNormalizado}`);

        // 2. Insertar en estudiantes
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

        // 3. Insertar en lista_blanca
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

        // 4. Enviar correo (solo si hay transporter)
        if (transporter) {
          const htmlContent = `
            <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 580px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #1a365d; letter-spacing: -0.5px;">
                  Conecta<span style="color: #f97316;">TP</span>
                </h2>
                <p style="color: #64748b; margin: 4px 0 0;">Plataforma de Prácticas Profesionales</p>
              </div>
              
              <h1 style="color: #1e293b; font-size: 20px; margin: 0 0 16px;">¡Hola, <strong>${nombre} ${apellido_paterno}</strong>!</h1>
              
              <p style="color: #334155; line-height: 1.6;">Has sido registrado como <strong>estudiante</strong> en la especialidad <strong>${especialidad}</strong> de la institución <strong>${institucion || 'tu establecimiento'}</strong> en <strong>ConectaTP</strong>.</p>
              
              <p style="color: #334155; line-height: 1.6;">Para acceder a la plataforma y completar tu perfil (subir CV, video, etc.), utiliza las siguientes credenciales:</p>
              
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 24px 0; text-align: center;">
                <div style="margin-bottom: 8px;"><strong>📧 Usuario / Correo:</strong> <span style="color: #1a365d;">${correoNormalizado}</span></div>
                <div><strong>🔑 Contraseña temporal:</strong> <code style="background-color: #e2e8f0; padding: 3px 6px; border-radius: 4px; font-weight: 700; color: #f97316;">${passwordTemporal}</code></div>
              </div>
              
              <div style="text-align: center; margin: 32px 0;">
                <a href="${process.env.NEXTAUTH_URL || 'https://conectatp.cl'}/login" style="background-color: #f97316; color: #ffffff; padding: 12px 28px; font-weight: 700; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 15px;">
                  🚀 Iniciar sesión
                </a>
              </div>
              
              <p style="color: #64748b; font-size: 13px; line-height: 1.4;">⚠️ <strong>Importante:</strong> Al primer ingreso, deberás cambiar tu contraseña (o puedes usar "Olvidé mi contraseña" si lo prefieres).</p>
              
              <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
              
              <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0;">
                Este es un correo automático, por favor no responder.<br />
                Si tienes dudas, contacta a tu Jefe de Especialidad.
              </p>
            </div>
          `;

          await transporter.sendMail({
            from: `"Conecta TP" <${process.env.ZOHO_SMTP_USER}>`,
            to: correoNormalizado,
            subject: `🎓 Invitación a ConectaTP - ${institucion || 'Institución'}`,
            html: htmlContent,
          });
          console.log(`📧 Correo enviado a ${correoNormalizado}`);
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