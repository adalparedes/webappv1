/**
 * Comprime un archivo de imagen antes de subirlo, redimensionándolo y ajustando la calidad.
 * @param file El archivo de imagen a comprimir.
 * @param maxWidth La dimensión máxima (ancho o alto) de la imagen resultante.
 * @param quality Un número entre 0 y 1 que representa la calidad del JPEG.
 * @returns Una promesa que se resuelve con la cadena base64 (sin prefijo) de la imagen comprimida.
 */
export function compressImage(file: File, maxWidth: number = 1024, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      if (!event.target?.result) {
        return reject(new Error("No se pudo leer el archivo."));
      }
      
      const img = new Image();
      img.src = event.target.result as string;
      img.onload = () => {
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
          return reject(new Error('No se pudo obtener el contexto del canvas.'));
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Exportar como JPEG con la calidad especificada
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // La API espera solo la cadena base64, sin el prefijo MIME
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
}
