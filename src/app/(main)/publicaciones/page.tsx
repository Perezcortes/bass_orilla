import { createClient } from '@/utils/supabase/server';
import RaffleCard from '@/components/raffles/RaffleCard';
import { Newspaper, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function PublicacionesPage() {
  const supabase = await createClient();

  // Traemos TODAS las publicaciones ordenadas de la más nueva a la más vieja
  const { data: publications } = await supabase
    .from('publications')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  const hasPubs = publications && publications.length > 0;

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* ENCABEZADO */}
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-action-yellow transition-colors mb-6 font-bold text-sm">
            <ArrowLeft size={18} /> Volver al inicio
          </Link>
          <h1 className="text-4xl md:text-5xl font-display font-black text-gray-900 dark:text-white">
            Tablero de <span className="text-action-yellow">Novedades</span>
          </h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg max-w-2xl">
            Entérate de todos nuestros sorteos, rifas de equipo profesional y anuncios oficiales de BassOrilla.
          </p>
        </div>

        {/* LISTADO DE PUBLICACIONES */}
        {hasPubs ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publications.map((pub) => (
              <RaffleCard 
                key={pub.id} 
                id={pub.id}
                title={pub.title}
                subtitle={pub.description}
                type={pub.type as 'anuncio' | 'sorteo'}
                slug={pub.slug || pub.id}
                date={new Date(pub.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                image={pub.image_url}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-100 dark:border-gray-800 p-16 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
              <Newspaper className="text-gray-400 dark:text-gray-500" size={40} />
            </div>
            <h3 className="text-2xl font-display font-black text-gray-900 dark:text-white mb-3">
              Aún no hay publicaciones
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
              Pronto subiremos nuevos sorteos y noticias. ¡Vuelve más tarde!
            </p>
          </div>
        )}

      </div>
    </div>
  );
}