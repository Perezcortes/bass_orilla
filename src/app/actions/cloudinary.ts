'use server';

import cloudinary from '@/utils/cloudinary';

// Esta función recibe el formulario desde la página
export async function uploadBannerAction(formData: FormData) {
  try {
    // 1. Extraemos la imagen del formulario
    const file = formData.get('image') as File;
    if (!file) {
      throw new Error('No se encontró ninguna imagen');
    }

    // 2. Convertimos la imagen a un formato que Cloudinary entienda (Base64)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');
    const fileUri = `data:${file.type};base64,${base64Data}`;

    // 3. Subimos la imagen a la carpeta específica
    const response = await cloudinary.uploader.upload(fileUri, {
      folder: 'bassorilla/publicidad', // ¡Aquí está la magia de las carpetas!
    });

    // 4. Devolvemos la URL segura (HTTPS) de la imagen ya alojada
    return { success: true, url: response.secure_url };
    
  } catch (error: any) {
    console.error('Error al subir a Cloudinary:', error);
    return { success: false, error: error.message };
  }
}