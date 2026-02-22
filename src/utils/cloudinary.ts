import { v2 as cloudinary } from 'cloudinary';

// Configuramos Cloudinary 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Asegura que las URLs generadas usen HTTPS
});

export default cloudinary;