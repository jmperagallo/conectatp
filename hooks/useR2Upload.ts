import { useState } from "react";

export function useR2Upload({ folder = "general", maxSizeMB = 2, onSuccess, onError, onProgress }: any) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Función para extraer la key de la URL pública
  const extractKeyFromPublicUrl = (publicUrl: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
    if (!publicUrl.startsWith(baseUrl!)) return null;
    return publicUrl.substring(baseUrl!.length + 1); // eliminar la base y la barra inicial
  };

  const uploadFile = async (file: File, oldPublicUrl?: string): Promise<string | null> => {
    setUploading(true);
    setProgress(0);
    try {
      // 1. Eliminar el archivo anterior si existe
      if (oldPublicUrl) {
        const oldKey = extractKeyFromPublicUrl(oldPublicUrl);
        if (oldKey) {
          console.log(`🗑️ Eliminando archivo anterior: ${oldKey}`);
          await fetch("/api/r2-delete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ key: oldKey }),
          });
        }
      }

      // 2. Solicitar URL firmada
      const response = await fetch("/api/r2-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, fileType: file.type, folder }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Error al obtener URL de subida");

      const { signedUrl, publicUrl } = data;

      // 3. Subir el archivo
      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadResponse.ok) throw new Error(`Error HTTP: ${uploadResponse.status}`);

      setProgress(100);
      onSuccess?.(publicUrl);
      return publicUrl;
    } catch (err: any) {
      onError?.(err.message);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress };
}