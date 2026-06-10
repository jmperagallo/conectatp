// app/api/r2-upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function POST(request: NextRequest) {
  try {
    const { filename, fileType, folder = "general" } = await request.json();

    // Validar variables de entorno críticas
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKey = process.env.R2_ACCESS_KEY_ID;
    const secretKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    if (!accountId || !accessKey || !secretKey || !bucketName || !publicUrlBase) {
      console.error("❌ Missing R2 env vars:", { accountId: !!accountId, accessKey: !!accessKey, secretKey: !!secretKey, bucketName: !!bucketName, publicUrlBase: !!publicUrlBase });
      return NextResponse.json({ success: false, error: "Configuración de R2 incompleta en el servidor" }, { status: 500 });
    }

    // Validaciones de archivo
    // ✅ AGREGADO 'fotos_perfil' a las carpetas permitidas
    const allowedFolders = ["logos", "videos", "documentos", "perfiles", "general", "fotos_perfil"];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ success: false, error: "Carpeta no permitida" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "video/mp4"];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ success: false, error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    // Cliente R2
    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      forcePathStyle: true,
    });

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folder}/${timestamp}-${randomId}-${cleanFilename}`;

    const command = new PutObjectCommand({ Bucket: bucketName, Key: key, ContentType: fileType });
    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 600 });
    const publicUrl = `${publicUrlBase}/${key}`;

    return NextResponse.json({ success: true, signedUrl, publicUrl, key });
  } catch (error: any) {
    console.error("❌ Error en API R2 Upload:", error);
    return NextResponse.json({ success: false, error: error.message || "Error interno" }, { status: 500 });
  }
}