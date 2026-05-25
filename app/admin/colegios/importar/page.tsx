'use client';

import React, { useState } from 'react';
import Header from '@/app/components/Header';

export default function ImportarColegiosPage() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState<{ total: number; tp: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0]);
    }
  };

  const procesarCSV = async () => {
    if (!archivo) return;
    setProcesando(true);

    try {
      // 1. Leer el contenido del archivo subido por el usuario
      const texto = await archivo.text();
      
      // 2. Dividir el archivo en filas (líneas)
      const filas = texto.split(/\r?\n/);
      if (filas.length === 0) return;

      // 3. Analizar la primera fila (los títulos) para saber en qué posición está cada columna
      // El archivo original usa punto y coma (;) como separador
      const cabeceras = filas[0].split(';');
      
      const idxRbd = cabeceras.indexOf('RBD');
      const idxNombre = cabeceras.indexOf('NOM_RBD');
      const idxRegion = cabeceras.indexOf('NOM_REG_RBD_A');
      const idxComuna = cabeceras.indexOf('NOM_COM_RBD');
      const idxDepe2 = cabeceras.indexOf('COD_DEPE2');
      const idxEspe1 = cabeceras.indexOf('ESPE_01');

      // Validar que el archivo sea el correcto
      if (idxRbd === -1 || idxEspe1 === -1) {
        alert('Error: El archivo no parece ser el Directorio Oficial del MINEDUC.');
        setProcesando(false);
        return;
      }

      // 4. Preparar las nuevas filas optimizadas para Supabase
      const nuevasFilas = ['rbd,nombre,region,comuna,dependencia'];
      let contadorTotal = 0;
      let contadorTP = 0;

      // 5. Recorrer colegio por colegio (saltándonos el título)
      for (let i = 1; i < filas.length; i++) {
        const filaActual = filas[i].split(';');
        if (filaActual.length < cabeceras.length) continue; // Saltarse líneas vacías

        contadorTotal++;
        const especialidad = filaActual[idxEspe1]?.trim();

        // CONDICIÓN MÁGICA: Si tiene especialidad y no es "0", es un colegio Técnico Profesional (TP)
        if (especialidad && especialidad !== '0' && especialidad !== '') {
          contadorTP++;

          const rbd = filaActual[idxRbd]?.trim();
          // Limpiamos las comillas extras de los textos y los envolvemos de forma segura
          const nombre = filaActual[idxNombre]?.trim().replace(/"/g, '""') || '';
          const region = filaActual[idxRegion]?.trim().replace(/"/g, '""') || '';
          const comuna = filaActual[idxComuna]?.trim().replace(/"/g, '""') || '';
          const dependencia = filaActual[idxDepe2]?.trim() || '0';

          // Guardamos en formato CSV estándar separado por comas
          nuevasFilas.push(`${rbd},"${nombre}","${region}","${comuna}",${dependencia}`);
        }
      }

      // 6. Crear el nuevo archivo limpio y forzar la descarga en el navegador
      const contenidoDescarga = nuevasFilas.join('\n');
      const blob = new Blob([contenidoDescarga], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'colegios_tp_limpio.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setResultado({ total: contadorTotal, tp: contadorTP });
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error al procesar el archivo.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, sans-serif' }}>
      <Header />
      
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1a365d', marginBottom: '0.5rem' }}>🔥 Extractor Automático de Liceos TP</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '2rem' }}>
            Sube el archivo oficial del MINEDUC. El sistema aislará automáticamente los colegios técnico-profesionales y te descargará un archivo optimizado.
          </p>

          <div style={{ border: '2px dashed #cbd5e1', padding: '2rem', borderRadius: '0.5rem', backgroundColor: '#f8fafc', marginBottom: '1.5rem', position: 'relative' }}>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleFileChange} 
              style={{ opacity: 0, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }} 
            />
            <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
              {archivo ? `📁 ${archivo.name}` : 'Arrastra aquí tu archivo CSV o haz clic para buscar'}
            </p>
          </div>

          <button
            onClick={procesarCSV}
            disabled={!archivo || procesando}
            style={{
              width: '100%',
              backgroundColor: archivo && !procesando ? '#f97316' : '#cbd5e1',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '0.375rem',
              fontWeight: 700,
              cursor: archivo && !procesando ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s'
            }}
          >
            {procesando ? 'Procesando miles de colegios...' : '⚡ Filtrar y Descargar CSV Limpio'}
          </button>

          {resultado && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '0.5rem', textAlign: 'left' }}>
              <p style={{ margin: '0 0 0.25rem 0', color: '#166534', fontSize: '0.9rem', fontWeight: 700 }}>¡Procesamiento Completado con Éxito!</p>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>• Total establecimientos revisados: <strong>{resultado.total}</strong></p>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.85rem' }}>• Liceos Técnico-Profesionales aislados: <strong style={{ color: '#1a365d' }}>{resultado.tp}</strong></p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}