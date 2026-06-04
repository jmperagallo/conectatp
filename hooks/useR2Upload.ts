import { useState } from "react";

interface UseR2UploadProps {
  folder?: "logos" | "videos" | "documentos" | "perfiles" | "general";
  maxSizeMB?: number;
  onSuccess?: (publicUrl: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export function useR2Upload({ 
  folder = "general", 
  maxSizeMB = 10,
  onSuccess, 
  onError,
  onProgress 
}: UseR2UploadProps = {}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      // Validar tamaño
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        throw new Error(`El archivo no puede superar ${maxSizeMB}MB`);
      }

      // 1. Solicitar URL firmada
      const response = await fetch("/api/r2-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: file.name,
          fileType: file.type,
          folder,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Error al obtener URL de subida");
      }

      const { signedUrl, publicUrl } = data;

      // 2. Subir archivo con seguimiento de progreso
      const uploadResponse = await new Promise<Response>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setProgress(percentComplete);
            onProgress?.(percentComplete);
          }
        });

        xhr.addEventListener("load", () => resolve(xhr.response));
        xhr.addEventListener("error", () => reject(new Error("Error de red")));
        
        xhr.open("PUT", signedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      setProgress(100);
      onSuccess?.(publicUrl);
      
      return publicUrl;
    } catch (err: any) {
      const errorMsg = err.message || "Error desconocido";
      setError(errorMsg);
      onError?.(errorMsg);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, progress, error };
}