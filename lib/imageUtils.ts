/**
 * Comprime un archivo de imagen antes de subirlo, redimensionándolo y ajustando la calidad.
 * Usa URL.createObjectURL para manejar archivos grandes de manera eficiente en memoria,
 * especialmente los provenientes de la cámara del dispositivo.
 * @param file El archivo de imagen a comprimir.
 * @param maxWidth La dimensión máxima (ancho o alto) de la imagen resultante.
 * @param quality Un número entre 0 y 1 que representa la calidad del JPEG.
 * @returns Una promesa que se resuelve con la cadena base64 (sin prefijo) de la imagen comprimida.
 */
export function compressImage(file: File, maxWidth: number = 1024, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    // 1. Usar URL.createObjectURL para una referencia eficiente en memoria, evitando cargar todo el archivo.
    const objectUrl = URL.createObjectURL(file);
    
    const img = new Image();
    img.src = objectUrl;

    const cleanup = () => {
      // 3. CRÍTICO: Revocar la URL del objeto para liberar la memoria del archivo original.
      URL.revokeObjectURL(objectUrl);
    };

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        
        let { width, height } = img;

        // Ajustar dimensiones manteniendo la proporción
        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxWidth) {
            width *= maxWidth / height;
            height = maxWidth;
          }
        }

        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('No se pudo obtener el contexto del canvas.');
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Exportar como JPEG con la calidad especificada
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // La API espera solo la cadena base64, sin el prefijo MIME
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      } catch (error) {
        reject(error);
      } finally {
        cleanup(); // Asegurar la limpieza incluso si hay errores
      }
    };

    img.onerror = (error) => {
      cleanup(); // Limpiar también en caso de error de carga de imagen
      reject(new Error("No se pudo cargar la imagen desde el archivo."));
    };
  });
}
