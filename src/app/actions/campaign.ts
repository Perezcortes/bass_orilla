'use server'

import { createClient } from '@/utils/supabase/server';
import nodemailer from 'nodemailer';

export async function sendCampaign(formData: FormData) {
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;
  const bannerUrl = formData.get('bannerUrl') as string;
  const productIds = formData.getAll('productIds') as string[];

  if (!subject || !message) return { error: 'El asunto y el mensaje son obligatorios.' };

  const supabase = await createClient();

  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('email')
    .eq('status', 'active');

  if (!subscribers || subscribers.length === 0) {
    return { error: 'No hay suscriptores activos para enviar la campaña.' };
  }

  const bccList = subscribers.map(sub => sub.email).join(', ');

  // Extraer productos y sus imágenes
  let productsHtml = '';
  if (productIds.length > 0) {
    const { data: products } = await supabase
      .from('products')
      .select('id, title, price, discount_price, brand, slug, variants')
      .in('id', productIds);

    if (products && products.length > 0) {
      productsHtml = `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333;">
          <h2 style="color: #F9B824; font-size: 20px; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px;">🔥 Equipo Destacado</h2>
      `;

      products.forEach(p => {
        const finalPrice = p.discount_price ? p.discount_price : p.price;
        const oldPriceHtml = p.discount_price ? `<span style="text-decoration: line-through; color: #888; font-size: 13px; margin-right: 8px;">$${p.price}</span>` : '';
        
        // Intentar sacar la URL de la imagen
        let imgUrl = 'https://bass-orilla.vercel.app/logo-bass.png'; // Logo por defecto
        try {
          const parsed = typeof p.variants === 'string' ? JSON.parse(p.variants) : p.variants;
          if (parsed?.[0]?.imageUrl) {
            // Asegurar que la URL sea absoluta
            imgUrl = parsed[0].imageUrl.startsWith('http') 
              ? parsed[0].imageUrl 
              : `https://bass-orilla.vercel.app${parsed[0].imageUrl}`;
          }
        } catch (e) { /* ignorar */ }

        productsHtml += `
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px; background-color: #222; border-radius: 8px; border: 1px solid #333;">
            <tr>
              <td width="100" style="padding: 15px; background-color: #fff; border-radius: 8px 0 0 8px; text-align: center;">
                <img src="${imgUrl}" alt="${p.brand}" style="max-width: 80px; max-height: 80px; display: block;" />
              </td>
              <td style="padding: 15px; text-align: left;">
                <p style="color: #888; font-size: 11px; text-transform: uppercase; margin: 0 0 5px 0; font-weight: bold;">${p.brand}</p>
                <h3 style="color: #fff; font-size: 16px; margin: 0 0 10px 0; line-height: 1.3;">${p.title}</h3>
                <div style="margin-bottom: 12px;">
                  ${oldPriceHtml}
                  <span style="color: #F9B824; font-weight: bold; font-size: 18px;">$${finalPrice} MXN</span>
                </div>
                <a href="https://bass-orilla.vercel.app/catalogo/${p.slug}" style="background-color: #F9B824; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block;">VER PRODUCTO</a>
              </td>
            </tr>
          </table>
        `;
      });
      productsHtml += `</div>`;
    }
  }

  // HTML Banner
  const bannerHtml = bannerUrl 
    ? `<img src="${bannerUrl}" alt="Banner" style="width: 100%; max-width: 600px; height: auto; display: block; border-bottom: 2px solid #F9B824;" />` 
    : `<div style="background-color: #000; padding: 30px; text-align: center; border-bottom: 2px solid #F9B824;"><span style="font-size: 28px; font-weight: 900; color: #fff; letter-spacing: -1px;">Bass<span style="color: #F9B824;">Orilla</span></span></div>`;

  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT),
    secure: true, 
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
  </head>
  <body style="background-color: #111110; margin: 0; padding: 40px 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #1A1A1A; border-radius: 12px; overflow: hidden; border: 1px solid #333;">
      
      ${bannerHtml}

      <div style="padding: 30px 40px; text-align: center;">
        
        <p style="color: #ccc; font-size: 16px; line-height: 1.6; white-space: pre-wrap; text-align: left; margin: 0;">${message}</p>
        
        ${productsHtml}
        
      </div>
      <div style="background-color: #111110; padding: 20px; text-align: center; font-size: 12px; color: #666; border-top: 1px solid #222;">
        <p>&copy; ${new Date().getFullYear()} BassOrilla. Todos los derechos reservados.</p>
        <p>Recibes este correo porque eres parte de nuestra comunidad.</p>
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: process.env.MAIL_FROM_ADDRESS, 
      bcc: bccList, 
      subject: subject,
      html: htmlContent,
    });
    
    return { success: true, count: subscribers.length };
  } catch (err) {
    console.error('Error enviando campaña:', err);
    return { error: 'Ocurrió un error al enviar los correos. Revisa la consola de Vercel.' };
  }
}