import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const rbd = formData.get("rbd") as string;

    if (!file || !rbd) {
      return NextResponse.json({ error: "Datos del formulario incompletos" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extension = file.name.split(".").pop();
    const fileName = `logos/${rbd}_logo.${extension}`;

    // Envío del archivo binario a Cloudflare R2
    await s3Client.send(
      new PutObjectCommand({
        Bucket: "conecta-archivos",
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      })
    );

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
    return NextResponse.json({ success: true, url: publicUrl });

  } catch (error) {
    console.error("Error en R2 Upload API:", error);
    return NextResponse.json({ error: "Error en el servidor de almacenamiento" }, { status: 500 });
  }
}