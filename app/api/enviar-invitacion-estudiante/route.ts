import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { correo, nombre, apellido, institucion, especialidad, passwordTemporal } = await request.json();

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
      subject: `🎓 Invitación a la plataforma ConectaTP - ${institucion}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 580px; margin: auto; padding: 30px;">
          <h2>Conecta<span style="color: #f97316;">TP</span></h2>
          <p>Hola <strong>${nombre} ${apellido}</strong>,</p>
          <p>Tu Jefe de Especialidad te ha registrado en la plataforma <strong>ConectaTP</strong> de la institución <strong>${institucion}</strong>.</p>
          <p><strong>Especialidad:</strong> ${especialidad}</p>
          <p>Para acceder al sistema y completar tu perfil (subir CV, video, etc.), utiliza las siguientes credenciales:</p>
          <div style="background: #f3f4f6; padding: 12px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <div><strong>Usuario:</strong> ${correo}</div>
            <div><strong>Contraseña temporal:</strong> <code style="background:#fff; padding:2px 6px;">${passwordTemporal}</code></div>
          </div>
          <p>🔗 <a href="${process.env.NEXTAUTH_URL || 'https://conectatp.cl'}/login">Iniciar sesión en ConectaTP</a></p>
          <p>⚠️ Al primer ingreso, deberás cambiar tu contraseña (o puedes usar "Olvidé mi contraseña" si lo prefieres).</p>
          <hr />
          <small>Este es un correo automático, no responder. Si tienes dudas, contacta a tu Jefe de Especialidad.</small>
        </div>
      `,
    });

    return NextResponse.json({ enviado: true });
  } catch (error: any) {
    console.error('Error enviando correo a estudiante:', error);
    return NextResponse.json({ enviado: false, error: error.message }, { status: 500 });
  }
}