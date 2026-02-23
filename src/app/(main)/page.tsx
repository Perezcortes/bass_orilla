// src/app/(main)/page.tsx
import Hero from '@/components/home/Hero';
import ActiveRaffles from '@/components/home/ActiveRaffles';
import ProductCard from '@/components/products/ProductCard'; // <-- Importamos ProductCard
import Link from 'next/link';
import { Mail, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/utils/supabase/server'; // <-- Importamos Supabase

export const revalidate = 60; // Revalida la página cada 60 segundos para mostrar nuevos productos

export default async function Home() {
  const supabase = await createClient();

  // Obtenemos los últimos 4 productos activos para la sección "Nuevos Ingresos"
  const { data: latestProducts } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4);

  // Mantenemos las marcas como las tienes
const brands = [
    // --- GIGANTES DE CARRETES Y CAÑAS ---
    { name: 'Shimano', src: '/marcas/shimano.png', url: 'https://fish.shimano.com/' },
    { name: 'Okuma', src: '/marcas/okuma-logo.png', url: 'https://okumafishing.com/' },
    { name: '13 Fishing', src: '/marcas/13-fishing.png', url: 'https://13fishing.com/' },

    // --- LÍDERES EN SEÑUELOS Y PLÁSTICOS ---
    { name: 'Rapala', src: '/marcas/Rapala-logo.png', url: 'https://www.rapala.com/' },
    { name: 'Strike King', src: '/marcas/strike-king.png', url: 'https://www.strikeking.com/' },
    { name: 'Zoom', src: '/marcas/zoom_logo.jpg', url: 'https://zoombaits.com/' },
    { name: 'Yum', src: '/marcas/logo_yum.png', url: 'https://yum3x.com/' },
    { name: 'Z-Man', src: '/marcas/zman-logo.png', url: 'https://zmanfishing.com/' },
    { name: 'Googan Squad', src: '/marcas/googan_logo.jpg', url: 'https://googansquad.com/' },
    { name: 'X-Zone', src: '/marcas/x-zone-logo.png', url: 'https://www.xzonelures.com/' },
    { name: 'Rage Tail', src: '/marcas/rage-tail-logo.png', url: 'https://www.strikeking.com/' },
    { name: 'Jorca', src: '/marcas/jorca-logo.png', url: 'https://www.instagram.com/jorcabaits/' }, // Marca nacional muy conocida

    // --- SEÑUELOS DUROS CLÁSICOS ---
    { name: 'Bomber', src: '/marcas/bomber-logo.png', url: 'https://www.bomberlures.com/' },
    { name: 'Booyah', src: '/marcas/booyah-logo.png', url: 'https://www.booyahbaits.com/' },
    { name: 'Heddon', src: '/marcas/heddon-logo.png', url: 'https://www.heddonlures.com/' },
    { name: 'Norman Lures', src: '/marcas/norman-lures.png', url: 'https://www.normanlures.com/' },
    { name: 'Storm', src: '/marcas/storm-logo.png', url: 'https://www.rapala.com/us_en/storm' },
    { name: 'War Eagle', src: '/marcas/war-eagle.png', url: 'https://wareaglecustomlures.com/' },

    // --- TERMINAL TACKLE (ANZUELOS Y PLOMOS) ---
    { name: 'Eagle Claw', src: '/marcas/eagle-claw.png', url: 'https://www.eagleclaw.com/' },
    { name: 'Trokar', src: '/marcas/trokar-logo.png', url: 'https://www.eagleclaw.com/trokar' },
    { name: 'Lazer Sharp', src: '/marcas/lazer-sharp.png', url: 'https://www.eagleclaw.com/lazer-sharp' },

    // --- LÍNEAS PARA PESCAR ---
    { name: 'Seaguar', src: '/marcas/seaguar-logo.png', url: 'https://seaguar.com/' },
    { name: 'Sufix', src: '/marcas/logo-sufix.png', url: 'https://www.rapala.com/us_en/sufix' },

    // --- ACCESORIOS Y LENTES ---
    { name: 'Costa', src: '/marcas/costa-logo.png', url: 'https://www.costadelmar.com/' },
  ];

  return (
    <>
      {/* 1. HERO (Sin tocar) */}
      <Hero />
      
      {/* 2. SORTEOS ACTIVOS (Sin tocar) */}
      <ActiveRaffles />

      {/* 3. NUEVOS INGRESOS EN TIENDA (Sustituye a categorías estáticas) */}
      <section className="py-20 bg-gray-50 dark:bg-[#111110] transition-colors duration-300" id="tienda">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header de la sección */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-action-yellow font-bold uppercase tracking-widest text-sm mb-2 block">
                Nuevas Llegadas
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight">
                Equípate como Pro
              </h2>
            </div>
            <Link 
              href="/catalogo" 
              className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white hover:text-action-yellow dark:hover:text-action-yellow transition-colors group"
            >
              Ver Todo el Catálogo 
              <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Grid de Productos desde Supabase */}
          {latestProducts && latestProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {latestProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-[#1A1A1A] rounded-2xl border border-gray-100 dark:border-gray-800">
              <p className="text-gray-500">Aún no hay productos en el catálogo.</p>
            </div>
          )}

          {/* Banners Rápidos de Categorías Populares (Opcional, abajo de los productos) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <Link href="/catalogo?dept=Agua Dulce&cat=Señuelos" className="group relative rounded-2xl overflow-hidden aspect-[21/9] shadow-md hover:shadow-xl transition-all duration-300">
              <Image src="/fondo-señuelos.png" alt="Señuelos" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex justify-between items-end">
                <div>
                  <h3 className="text-white font-display font-black text-2xl md:text-3xl uppercase tracking-tight mb-2">Señuelos</h3>
                  <p className="text-gray-300 text-sm font-medium">Plásticos, Curricanes, Jigs</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-action-yellow flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
            
            <Link href="/catalogo?dept=Agua Dulce&cat=Carretes" className="group relative rounded-2xl overflow-hidden aspect-[21/9] shadow-md hover:shadow-xl transition-all duration-300">
              <Image src="/fondo-carretes.png" alt="Carretes" fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full flex justify-between items-end">
                <div>
                  <h3 className="text-white font-display font-black text-2xl md:text-3xl uppercase tracking-tight mb-2">Carretes</h3>
                  <p className="text-gray-300 text-sm font-medium">Spinning & Baitcasting</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                  <ArrowRight size={20} />
                </div>
              </div>
            </Link>
          </div>

        </div>
      </section>

      {/* 4. MARCAS */}
      <section className="py-12 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-black overflow-hidden transition-colors duration-300" id="marcas">
        
        {/* Estilos inyectados para la animación del carrusel infinito */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 120s linear infinite;
          }
          .group-marquee:hover .animate-marquee {
            animation-play-state: paused;
          }
        `}} />

        <div className="max-w-7xl mx-auto px-4 mb-10">
          <h3 className="text-center font-display font-bold text-gray-400 uppercase tracking-widest text-sm">
            Trabajamos con las mejores marcas
          </h3>
        </div>

        {/* Contenedor del Carrusel (Pausa al pasar el mouse) */}
        <div className="relative w-full overflow-hidden flex group-marquee">
          
          {/* Pista 1 */}
          <div className="flex shrink-0 animate-marquee items-center justify-around min-w-full gap-8 md:gap-16 pr-8 md:pr-16">
            {brands.map((brand, index) => (
              <a key={index} href={brand.url} target="_blank" rel="noopener noreferrer" className="group relative block h-14 w-28 md:h-20 md:w-36 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-110" title={`Visitar sitio oficial de ${brand.name}`}>
                <div className="absolute inset-0 bg-action-yellow/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                {/* Le quitamos el grayscale para que se vean los colores originales siempre */}
                <Image src={brand.src} alt={brand.name} fill className="object-contain drop-shadow-sm group-hover:drop-shadow-xl transition-all duration-300" sizes="(max-width: 768px) 112px, 144px" />
              </a>
            ))}
          </div>

          {/* Pista 2 (Copia idéntica para crear el ciclo infinito perfecto) */}
          <div aria-hidden="true" className="flex shrink-0 animate-marquee items-center justify-around min-w-full gap-8 md:gap-16 pr-8 md:pr-16">
            {brands.map((brand, index) => (
              <a key={`dup-${index}`} href={brand.url} target="_blank" rel="noopener noreferrer" className="group relative block h-14 w-28 md:h-20 md:w-36 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-110" title={`Visitar sitio oficial de ${brand.name}`}>
                <div className="absolute inset-0 bg-action-yellow/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image src={brand.src} alt={brand.name} fill className="object-contain drop-shadow-sm group-hover:drop-shadow-xl transition-all duration-300" sizes="(max-width: 768px) 112px, 144px" />
              </a>
            ))}
          </div>
          
        </div>
      </section>

      {/* 5. NEWSLETTER (Con efecto Parallax) */}
      <section className="relative py-24 md:py-32 overflow-hidden flex items-center justify-center min-h-[500px]">
        
        {/* Fondo Parallax */}
        <div 
          className="absolute inset-0 z-0 bg-[url('/suscri.jpeg')] bg-fixed bg-cover bg-center"
        />
        
        {/* Overlay Oscuro Neutro (Garantiza que el texto blanco sea legible) */}
        <div className="absolute inset-0 z-0 bg-black/60 dark:bg-[#111110]/70" />

        {/* Contenido */}
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center w-full">
          <span className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8 shadow-2xl">
            <Mail className="text-action-yellow drop-shadow-md" size={32} />
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6 tracking-tight drop-shadow-lg uppercase">
            Únete a la Comunidad
          </h2>
          <p className="text-gray-200 text-lg mb-10 max-w-xl mx-auto font-medium drop-shadow-md">
            Recibe notificaciones sobre nuevos sorteos, ganadores y ofertas exclusivas de equipo directamente en tu correo.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-action-yellow focus:bg-black/50 backdrop-blur-md transition-all shadow-inner" 
              placeholder="Tu correo electrónico" 
              type="email" 
            />
            <button 
              className="bg-action-yellow text-black px-8 py-4 rounded-xl font-bold hover:bg-yellow-400 hover:scale-105 transition-all shadow-lg shadow-action-yellow/20 flex items-center justify-center gap-2" 
              type="submit"
            >
              Suscribirse
            </button>
          </form>
          <p className="text-gray-400 text-xs mt-6 font-medium tracking-wide">
            Sin spam. Solo pura pesca.
          </p>
        </div>
      </section>
    </>
  );
}