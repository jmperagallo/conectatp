import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// FORCE UPDATE - 2026-06-04 - Cliente inline para Vercel
export async function POST(request: NextRequest) {
  console.log("=== API R2 UPLOAD called ===");
  try {
    const { filename, fileType, folder = "general" } = await request.json();
    console.log("Payload:", { filename, fileType, folder });

    // Validaciones
    const allowedFolders = ["logos", "videos", "documentos", "perfiles", "general"];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ success: false, error: "Carpeta no permitida" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm", "video/quicktime"];
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json({ success: false, error: "Tipo de archivo no permitido" }, { status: 400 });
    }

    // Verificar variables de entorno
    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKey = process.env.R2_ACCESS_KEY_ID;
    const secretKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;
    const publicUrlBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;

    if (!accessKey || !secretKey || !bucketName || !publicUrlBase) {
      console.error("Missing env vars:", { accessKey: !!accessKey, secretKey: !!secretKey, bucketName: !!bucketName, publicUrlBase: !!publicUrlBase });
      throw new Error("Configuración de R2 incompleta en el servidor");
    }

    // Cliente R2 inline
    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folder}/${timestamp}-${randomId}-${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 600 });
    const publicUrl = `${publicUrlBase}/${key}`;

    return NextResponse.json({ success: true, signedUrl, publicUrl, key });
  } catch (error: any) {
    console.error("Error en API R2 Upload:", error);
    return NextResponse.json({ success: false, error: error.message || "Error interno" }, { status: 500 });
  }
}