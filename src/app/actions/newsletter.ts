'use server'

import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

export async function subscribeToNewsletter(formData: FormData) {
  const email = formData.get('email') as string;

  if (!email) {
    return { error: 'El correo es obligatorio.' };
  }

  const supabase = await createClient();

  // 1. Guardar en Supabase
  const { error } = await supabase
    .from('subscribers')
    .insert([{ email }]);

  if (error) {
    if (error.code === '23505') { 
      return { error: 'Este correo ya está suscrito.' };
    }
    return { error: 'Hubo un error al suscribirte. Intenta de nuevo.' };
  }

  // 2. Configuración del Transporte (Tus credenciales de Gmail)
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true, 
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  // 3. Plantilla HTML (Estilo Premium BassOrilla)
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { background-color: #111110; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; color: #ffffff; }
      .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 12px; overflow: hidden; border: 1px solid #333; margin-top: 20px; }
      .header { background-color: #000; padding: 30px; text-align: center; border-bottom: 2px solid #F9B824; }
      .content { padding: 40px; text-align: center; }
      .button { background-color: #F9B824; color: #000000; padding: 16px 32px; text-decoration: none; font-weight: bold; border-radius: 50px; display: inline-block; margin: 25px 0; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; transition: all 0.3s; }
      .footer { background-color: #111110; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #222; }
      .logo-text { font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -1px; text-decoration: none; }
      .logo-accent { color: #F9B824; }
    </style>
  </head>
  <body>
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #111110;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <div class="container">
            <div class="header">
              <div class="logo-text">
                Bass<span class="logo-accent">Orilla</span>
              </div>
            </div>

            <div class="content">
              <h1 style="font-size: 24px; margin-bottom: 20px; color: #fff;">¡Ya eres parte de la comunidad! 🎣</h1>
              
              <p style="color: #ccc; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                Te has suscrito exitosamente al boletín oficial de <strong>BassOrilla</strong>.
              </p>
              
              <p style="color: #ccc; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                A partir de hoy, serás de los primeros en enterarte cuando subamos nuevos sorteos de equipos gama alta, resultados de ganadores y promociones exclusivas del catálogo.
              </p>

              <a href="https://bass-orilla.vercel.app/catalogo" class="button">
                Ver Catálogo de Tienda
              </a>
            </div>

            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} BassOrilla. Todos los derechos reservados.</p>
              <p>Chihuahua, Chih, México.</p>
            </div>
          </div>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  // 4. Enviar correo usando Nodemailer
  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: '🎣 ¡Bienvenido al Club BassOrilla!',
      html: htmlContent,
    });
    
    return { success: true };
  } catch (err) {
    console.error('Error enviando email:', err);
    // Retornamos success porque el correo se guardó en la BD correctamente,
    // aunque Gmail haya fallado por alguna razón de red.
    return { success: true }; 
  }
}