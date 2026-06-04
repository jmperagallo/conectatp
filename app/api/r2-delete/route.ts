import { NextRequest, NextResponse } from "next/server";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json();
    if (!key) {
      return NextResponse.json({ success: false, error: "Falta el parámetro 'key'" }, { status: 400 });
    }

    const accountId = process.env.R2_ACCOUNT_ID;
    const accessKey = process.env.R2_ACCESS_KEY_ID;
    const secretKey = process.env.R2_SECRET_ACCESS_KEY;
    const bucketName = process.env.R2_BUCKET_NAME;

    if (!accountId || !accessKey || !secretKey || !bucketName) {
      throw new Error("Faltan variables de entorno para R2");
    }

    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId: accessKey, secretAccessKey: secretKey },
      forcePathStyle: true,
    });

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    await r2Client.send(command);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error al eliminar objeto de R2:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}