import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2Client } from "@/lib/r2-client";

export async function POST(request: NextRequest) {
  try {
    const { filename, fileType, folder = "general" } = await request.json();

    const allowedFolders = ["logos", "videos", "documentos", "perfiles", "general"];
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json(
        { success: false, error: "Carpeta no permitida" },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif",
      "video/mp4", "video/webm", "video/quicktime",
    ];
    
    if (!allowedTypes.includes(fileType)) {
      return NextResponse.json(
        { success: false, error: "Tipo de archivo no permitido" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(7);
    const cleanFilename = filename
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9.-]/g, "_");
    const key = `${folder}/${timestamp}-${randomId}-${cleanFilename}`;

    const bucketName = process.env.R2_BUCKET_NAME;
    if (!bucketName) {
      throw new Error("R2_BUCKET_NAME no configurado");
    }

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(r2Client, command, {
      expiresIn: 600,
    });

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;

    return NextResponse.json({
      success: true,
      signedUrl,
      publicUrl,
      key,
    });
  } catch (error: any) {
    console.error("Error generando URL firmada:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error interno" },
      { status: 500 }
    );
  }
}