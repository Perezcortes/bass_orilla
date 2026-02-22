import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next'; // Importamos el tipo Metadata
import { MessageCircle, Calendar, Ticket, Megaphone, ArrowLeft } from 'lucide-react';

// 1. GENERADOR DE METADATOS (¡La magia para WhatsApp y Facebook!)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const supabase = await createClient();
  const { data: pub } = await supabase.from('publications').select('*').eq('slug', resolvedParams.slug).single();

  if (!pub) return { title: 'Publicación no encontrada' };

  return {
    title: `${pub.title} | BassOrilla`,
    description: pub.description,
    openGraph: {
      title: pub.title,
      description: pub.description,
      images: [pub.image_url], // Aquí le pasamos la foto de Cloudinary a WhatsApp
    },
  };
}

// 2. COMPONENTE PRINCIPAL DE LA PÁGINA
export default async function PublicationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: pub } = await supabase.from('publications').select('*').eq('slug', slug).single();

  if (!pub) notFound();

  const isSorteo = pub.type === 'sorteo';
  const WHATSAPP_NUMBER = "529531447499";
  
  // URL de tu página web (Cámbiala cuando compres tu dominio oficial)
  const DOMINIO = "https://bassorilla.com"; 
  const linkPublicacion = `${DOMINIO}/publicaciones/${slug}`;

  // Actualizamos el mensaje para que incluya el Link y WhatsApp genere la miniatura
  const wppText = encodeURIComponent(
    isSorteo 
    ? `Hola, me interesa participar en este sorteo:\n\n${linkPublicacion}\n\n¿Me das más información?`
    : `Hola, vi esta publicación y tengo una duda:\n\n${linkPublicacion}`
  );

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-action-yellow transition-colors mb-8 font-bold text-sm">
          <ArrowLeft size={18} /> Volver al inicio
        </Link>

        <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
          
          <div className="relative h-64 md:h-96 w-full bg-black">
            <Image src={pub.image_url} alt={pub.title} fill className="object-cover opacity-90" priority />
            <div className="absolute top-6 left-6 flex gap-2">
              {isSorteo ? (
                <div className="bg-black/80 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg border border-white/10">
                  <Ticket className="text-action-yellow" size={16} /> Sorteo Oficial
                </div>
              ) : (
                <div className="bg-purple-600/90 backdrop-blur-md text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                  <Megaphone size={16} /> Anuncio
                </div>
              )}
            </div>
          </div>

          <div className="p-8 md:p-12">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-400 mb-4">
              <Calendar size={16} /> Publicado el {new Date(pub.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-display font-black text-gray-900 dark:text-white mb-6 leading-tight">
              {pub.title}
            </h1>
            
            <div className="prose dark:prose-invert max-w-none mb-12 text-gray-600 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {pub.description}
            </div>

            <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100 dark:border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {isSorteo ? '¿Quieres ganar este premio?' : '¿Tienes dudas sobre esto?'}
                </h3>
                <p className="text-gray-500 text-sm">Contáctanos directamente por WhatsApp para atención personalizada.</p>
              </div>
              <a 
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${wppText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto bg-[#25D366] hover:bg-[#1EBE57] text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 shrink-0 hover:scale-105"
              >
                <MessageCircle size={22} /> Contáctanos
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}