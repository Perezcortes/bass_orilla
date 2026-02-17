import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const { email, name } = await request.json();

    // 1. Configuración del Transporte
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: true, 
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // Esto busca el archivo en tu proyecto real: /public/logo-bass.png
    const logoPath = path.join(process.cwd(), 'public', 'logo-bass.png');
    const logoContent = fs.readFileSync(logoPath);

    // 3. Plantilla HTML
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; background-color: #111110; font-family: Arial, sans-serif; }
  </style>
</head>
<body style="background-color: #111110; margin: 0; padding: 0;">

  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #111110;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #1A1A1A; border-radius: 12px; overflow: hidden; border: 1px solid #333333;">
          
          <tr>
            <td align="center" style="padding: 30px 0; background-color: #000000;">
              <img src="cid:basslogo" alt="BassOrilla" width="150" style="display: block; width: 150px; height: auto;">
            </td>
          </tr>

          <tr>
            <td>
              <img src="https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=600" alt="Pesca" width="600" style="width: 100%; display: block;">
            </td>
          </tr>

          <tr style="padding: 40px;">
            <td style="padding: 40px;">
              <h1 style="color: #ffffff; font-size: 24px; margin: 0 0 20px 0;">¡Bienvenido, ${name}! 🎣</h1>
              <p style="color: #cccccc; font-size: 16px; line-height: 1.6;">Gracias por unirte a BassOrilla.</p>
              
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="https://bassorilla.com/sorteos" style="display: inline-block; padding: 14px 28px; background-color: #F9B824; color: #000000; font-weight: bold; text-decoration: none; border-radius: 50px;">
                      Ver Sorteos
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color: #111110; padding: 20px; text-align: center; color: #555; font-size: 12px;">
              &copy; ${new Date().getFullYear()} BassOrilla.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `;

    // 4. Enviar con ADJUNTOS (Attachments)
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: email,
      subject: "🎣 ¡Bienvenido al Club BassOrilla!",
      html: htmlContent,
      attachments: [
        {
          filename: 'logo-bass.png',
          content: logoContent,
          cid: 'basslogo' // Este ID debe coincidir exactamente con el src="cid:basslogo" del HTML
        }
      ]
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error enviando correo:', error);
    return NextResponse.json({ error: 'Error enviando correo' }, { status: 500 });
  }
}