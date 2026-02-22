import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { MessageCircle, Calendar, Ticket, Megaphone, ArrowLeft } from 'lucide-react';
import ZoomableImage from '@/components/ui/ZoomableImage'; 
import ShareButton from '@/components/ui/ShareButton'; // <-- Importamos nuestro botón

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
      images: [pub.image_url], 
    },
  };
}

// 2. COMPONENTE PRINCIPAL DE LA PÁGINA
export default async function PublicationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: pub } = await supabase.from('publications').select('*').eq('is_active', true).eq('slug', slug).single();

  if (!pub) notFound();

  const isSorteo = pub.type === 'sorteo';
  const WHATSAPP_NUMBER = "529531447499";
  
  const DOMINIO = "https://bass-orilla.vercel.app/"; 
  const linkPublicacion = `${DOMINIO}/publicaciones/${slug}`;

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
          
          <div className="relative h-64 md:h-96 w-full bg-black group">
            {/* Aquí usamos nuestro componente mágico interactivo */}
            <ZoomableImage src={pub.image_url} alt={pub.title} />
            
            {/* Etiquetas flotantes */}
            <div className="absolute top-6 left-6 flex gap-2 pointer-events-none">
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
            
            {/* Pequeño tooltip visual para indicar que se puede hacer zoom */}
            <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white/80 text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Pasa el cursor para hacer zoom
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

            {/* CTA DINÁMICO: Sorteo vs Anuncio (Con los botones de compartir) */}
            {isSorteo ? (
              <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-100 dark:border-gray-800">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    ¿Quieres participar en este sorteo?
                  </h3>
                  <p className="text-gray-500 text-sm">Contáctanos por WhatsApp para obtener tus boletos, o ayúdanos compartiendo.</p>
                </div>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 shrink-0">
                  <ShareButton 
                    title={pub.title} text={pub.description} url={linkPublicacion}
                    className="w-full sm:w-auto bg-white dark:bg-[#111110] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 text-gray-900 dark:text-white px-6 py-4 rounded-xl shadow-sm"
                  />
                  <a 
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${wppText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE57] text-white px-8 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 hover:scale-105"
                  >
                    <MessageCircle size={22} /> Pedir Boletos
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-500/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100 dark:border-blue-500/20">
                <div>
                  <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                    ¿Te pareció interesante?
                  </h3>
                  <p className="text-blue-700/80 dark:text-blue-300/80 text-sm">Ayúdanos a llegar a más pescadores compartiendo esta noticia en tus redes.</p>
                </div>
                <ShareButton 
                  title={pub.title} text={pub.description} url={linkPublicacion}
                  className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg shadow-blue-500/20 shrink-0 hover:scale-105"
                />
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}