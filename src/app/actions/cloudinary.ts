'use server';

import cloudinary from '@/utils/cloudinary';

// Función para subir
export async function uploadBannerAction(formData: FormData) {
  try {
    const file = formData.get('image') as File;
    if (!file) throw new Error('No se encontró ninguna imagen');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    const response = await cloudinary.uploader.upload(fileUri, {
      folder: 'bassorilla/publicidad',
    });

    return { success: true, url: response.secure_url };
  } catch (error: any) {
    console.error('Error al subir a Cloudinary:', error);
    return { success: false, error: error.message };
  }
}

// 1. FUNCIÓN ACTUALIZADA: Ahora recibe la ruta dinámica de la carpeta
export async function uploadProductImageAction(formData: FormData, customFolder?: string) {
  try {
    const file = formData.get('image') as File;
    if (!file) throw new Error('No se encontró ninguna imagen');

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    // Si nos pasan una ruta (Ej: bassorilla/productos/agua-dulce), la usa. Si no, usa la general.
    const folderPath = customFolder || 'bassorilla/productos';

    const response = await cloudinary.uploader.upload(fileUri, {
      folder: folderPath,
    });

    return { success: true, url: response.secure_url };
  } catch (error: any) {
    console.error('Error al subir a Cloudinary:', error);
    return { success: false, error: error.message };
  }
}

// 2. FUNCIÓN ACTUALIZADA: Borrado inteligente para múltiples subcarpetas
export async function deleteCloudinaryImage(imageUrl: string) {
  try {
    // URL Ej: https://res.cloudinary.com/nube/image/upload/v12345/bassorilla/productos/agua-dulce/imagen.jpg
    const urlParts = imageUrl.split('/upload/');
    if (urlParts.length === 2) {
      const pathStr = urlParts[1];
      
      // 1. Quitamos la versión (v12345/)
      const pathWithoutVersion = pathStr.substring(pathStr.indexOf('/') + 1); 
      // 2. Quitamos la extensión (.jpg, .png)
      const publicId = pathWithoutVersion.substring(0, pathWithoutVersion.lastIndexOf('.')); 
      
      // publicId final = bassorilla/productos/agua-dulce/imagen
      await cloudinary.uploader.destroy(publicId);
    }
    return { success: true };
  } catch (error) {
    console.error('Error al borrar de Cloudinary:', error);
    return { success: false };
  }
}