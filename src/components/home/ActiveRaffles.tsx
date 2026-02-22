import Link from 'next/link';
import { ArrowRight, Newspaper } from 'lucide-react';
import RaffleCard from '@/components/raffles/RaffleCard';
import { createClient } from '@/utils/supabase/server';

export default async function ActiveRaffles() {
  const supabase = await createClient();

  // Trae TODOS (anuncios y sorteos), ordena por tipo (Anuncios primero), luego por fecha
  const { data: publications } = await supabase
    .from('publications')
    .select('*')
    .order('type', { ascending: true }) 
    .order('created_at', { ascending: false })
    .limit(6);

  const hasPubs = publications && publications.length > 0;

  return (
    <section className="py-16 md:py-24 relative bg-white dark:bg-[#111110]" id="novedades">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <span className="text-splash-blue font-bold tracking-wider text-sm uppercase">Lo más nuevo</span>
            <h2 className="text-4xl md:text-5xl font-display font-black text-gray-900 dark:text-white mt-2">
              Novedades y <span className="text-transparent bg-clip-text bg-gradient-to-r from-action-yellow to-yellow-600">Sorteos</span>
            </h2>
          </div>
          <Link href="/publicaciones" className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-action-yellow transition-colors font-semibold group">
            Ver todas las publicaciones <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

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
                date={new Date(pub.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' })}
                image={pub.image_url}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-[#1A1A1A] rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 p-12 text-center flex flex-col items-center justify-center animate-fade-in-up">
            <Newspaper className="text-gray-400 mb-4" size={40} />
            <h3 className="text-2xl font-display font-black text-gray-900 dark:text-white mb-2">Próximamente</h3>
            <p className="text-gray-500">Aún no hay anuncios ni sorteos activos.</p>
          </div>
        )}
      </div>
    </section>
  );
}