import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Función para generar una clave temporal segura (Ej: CNX-4829-TP)
function generarPasswordTemporal(): string {
  const numeroAleatorio = Math.floor(1000 + Math.random() * 9000);
  return `CNX-${numeroAleatorio}-TP`;
}

export async function POST(request: Request) {
  try {
    const { rbd, nombre, comuna, administradores } = await request.json();

    // 1. Crear la conexión segura SMTP con Zoho Mail
    const transporter = nodemailer.createTransport({
      host: process.env.ZOHO_SMTP_HOST,
      port: parseInt(process.env.ZOHO_SMTP_PORT || '465'),
      secure: true, // true para puerto 465 (SSL cifrado)
      auth: {
        user: process.env.ZOHO_SMTP_USER,
        pass: process.env.ZOHO_SMTP_PASS,
      },
    });

    const resultadosEnvios = [];

    // 2. Recorrer la lista de correos y enviar la invitación a cada uno
    for (const correo of administradores) {
      const claveTemporal = generarPasswordTemporal();

      await transporter.sendMail({
        from: `"Conecta TP" <${process.env.ZOHO_SMTP_USER}>`,
        to: correo,
        subject: `🚀 Invitación de Acceso: ${nombre}`,
        html: `
          <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 580px; margin: 20px auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(26, 54, 93, 0.04); text-align: left;">
            <div style="margin-bottom: 24px;">
              <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #1a365d; letter-spacing: -0.5px;">
                Conecta<span style="color: #f97316;">TP</span>
              </h2>
            </div>

            <h1 style="color: #1e293b; font-size: 20px; font-weight: 700; margin: 0 0 16px 0; line-height: 1.3;">
              ¡Hola! Te damos la bienvenida a la plataforma
            </h1>

            <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
              Se ha registrado oficialmente el establecimiento <strong style="color: #1a365d;">${nombre}</strong> (RBD: ${rbd}) de la comuna de ${comuna} en nuestro ecosistema de Gestión de Prácticas Profesionales.
            </p>

            <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 20px 0;">
              Has sido designado como **encargado del establecimiento**. Para ingresar por primera vez y tomar el control de tu panel, utiliza tus credenciales provisorias de acceso seguro:
            </p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin-bottom: 24px; font-size: 14px; color: #334155;">
              <div style="margin-bottom: 8px;"><strong>Usuario / Correo:</strong> <span style="color: #1a365d;">${correo}</span></div>
              <div><strong>Contraseña Temporal:</strong> <code style="background-color: #e2e8f0; padding: 3px 6px; border-radius: 4px; font-weight: 700; color: #f97316; font-size: 15px;">${claveTemporal}</code></div>
            </div>

            <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 0 0 24px 0; font-style: italic;">
              * Al iniciar sesión con tu cuenta de Gmail, el sistema omitirá la clave provisoria asociando tu cuenta de forma automática. Si utilizas un correo tradicional, el sistema te obligará a cambiar esta clave provisoria por una definitiva de forma inmediata en tu primer ingreso.
            </p>

            <div style="text-align: center; margin: 32px 0;">
              <a href="http://localhost:3000/login" style="background-color: #f97316; color: #ffffff; padding: 14px 28px; font-weight: 700; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 15px; box-shadow: 0 4px 6px rgba(249, 115, 22, 0.25);">
                Configurar mi Cuenta y Entrar →
              </a>
            </div>

            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />

            <p style="color: #64748b; font-size: 12px; text-align: center; margin: 0; line-height: 1.5;">
              Este es un correo automático de seguridad generado por el sistema de <strong>Conecta TP</strong>.<br>
              Por favor, no respondas directamente a este mensaje.
            </p>
          </div>
        `,
      });

      resultadosEnvios.push({ correo, claveTemporal });
    }

    return NextResponse.json({ 
      enviado: true, 
      mensaje: 'Invitaciones despachadas con éxito mediante Zoho Mail',
      detalles: resultadosEnvios 
    });

  } catch (error: any) {
    console.error('Error enviando correo por Zoho SMTP:', error);
    return NextResponse.json({ enviado: false, error: error.message }, { status: 500 });
  }
}