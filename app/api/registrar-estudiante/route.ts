// app/api/registrar-estudiante/route.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Esta clave solo debe usarse en el backend (variables de entorno en Vercel)
const supabaseAdmin = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // ¡Clave de servicio!
  { cookies: { get: () => undefined } } // Sin cookies
);

export async function POST(request: Request) {
  try {
    const { estudiantes, idLiceo, especialidad, institucion } = await request.json();
    if (!estudiantes || !idLiceo) {
      return NextResponse.json({ error: 'Faltan datos' }, { status: 400 });
    }

    const resultados = [];
    for (const est of estudiantes) {
      const { nombre, apellido_paterno, apellido_materno, rut, correo, telefono } = est;
      const passwordTemporal = `CNX-${Math.floor(1000 + Math.random() * 9000)}-TP`;

      try {
        // 1. Crear usuario en Supabase Auth
        const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: correo.toLowerCase(),
          password: passwordTemporal,
          email_confirm: true, // Confirma automáticamente (evita email de confirmación)
          user_metadata: { nombre, apellido_paterno, rol: 'estudiante' }
        });
        if (authError) throw new Error(`Auth: ${authError.message}`);

        // 2. Insertar en estudiantes
        const { error: estudianteError } = await supabaseAdmin
          .from('estudiantes')
          .insert({
            id_liceo: idLiceo,
            nombre,
            apellido_paterno,
            apellido_materno,
            rut: rut.replace(/[^0-9kK]/g, '').toUpperCase(),
            correo: correo.toLowerCase(),
            telefono,
            especialidad,
            perfil_completo: false
          });
        if (estudianteError) throw new Error(`Estudiante: ${estudianteError.message}`);

        // 3. Insertar en lista_blanca
        const { error: listaError } = await supabaseAdmin
          .from('lista_blanca')
          .insert({
            correo: correo.toLowerCase(),
            nombre,
            apellido_paterno,
            apellido_materno,
            rol: 'estudiante',
            id_liceo: idLiceo,
            especialidad,
            invitacion_enviada: true, // Se enviará manualmente ahora
          });
        if (listaError) throw new Error(`Lista blanca: ${listaError.message}`);

        // 4. Enviar correo de invitación
        const transporter = nodemailer.createTransport({
          host: process.env.ZOHO_SMTP_HOST,
          port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
          secure: true,
          auth: {
            user: process.env.ZOHO_SMTP_USER,
            pass: process.env.ZOHO_SMTP_PASS,
          },
        });
        await transporter.sendMail({
          from: `"Conecta TP" <${process.env.ZOHO_SMTP_USER}>`,
          to: correo,
          subject: `🎓 Invitación a ConectaTP - ${institucion}`,
          html: `
            <div style="font-family: system-ui, sans-serif; max-width: 580px; margin: auto; padding: 30px;">
              <h2>Conecta<span style="color: #f97316;">TP</span></h2>
              <p>Hola <strong>${nombre} ${apellido_paterno}</strong>,</p>
              <p>Has sido registrado como <strong>estudiante</strong> en la especialidad <strong>${especialidad}</strong> de la institución <strong>${institucion}</strong>.</p>
              <p>Accede a la plataforma con tus credenciales:</p>
              <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center;">
                <div><strong>Usuario:</strong> ${correo}</div>
                <div><strong>Contraseña temporal:</strong> <code>${passwordTemporal}</code></div>
              </div>
              <p>🔗 <a href="${process.env.NEXTAUTH_URL || 'https://conectatp.cl'}/login">Iniciar sesión</a></p>
              <p>⚠️ Al primer ingreso, deberás cambiar tu contraseña.</p>
              <hr />
              <small>Correo automático, no responder.</small>
            </div>
          `,
        });

        resultados.push({ correo, success: true });
      } catch (error: any) {
        console.error(`Error con ${correo}:`, error);
        resultados.push({ correo, success: false, error: error.message });
        // Opcional: seguir con los demás
      }
    }

    return NextResponse.json({ success: true, resultados });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}