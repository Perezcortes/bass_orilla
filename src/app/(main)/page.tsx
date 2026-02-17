import Hero from '@/components/home/Hero';
import Stats from '@/components/home/Stats';
import RaffleCard from '@/components/raffles/RaffleCard';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  // Mock data para los sorteos
  const raffles = [
    {
      id: '1',
      title: 'Shimano Curado DC',
      subtitle: 'Carrete de Casting Digital',
      price: 150,
      date: '15 Oct 2024',
      image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2074',
      soldPercentage: 85,
      totalTickets: 100,
      soldTickets: 85,
      badge: 'hot' as const,
    },
    {
      id: '2',
      title: 'Kit Completo Bass Pro',
      subtitle: 'Caña, carrete y señuelos',
      price: 300,
      date: '20 Oct 2024',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
      soldPercentage: 45,
      totalTickets: 100,
      soldTickets: 45,
    },
    {
      id: '3',
      title: 'Mystery Box Premium',
      subtitle: 'Caja con señuelos sorpresa',
      price: 50,
      date: '22 Oct 2024',
      image: 'https://images.unsplash.com/photo-1564701148948-15adf2c41d2c?q=80&w=2070',
      soldPercentage: 12,
      totalTickets: 100,
      soldTickets: 12,
      badge: 'new' as const,
    },
  ];

  // Mock data para categorías de tienda
  const categories = [
    {
      name: 'Señuelos',
      description: 'Hardbaits, Softbaits, Jigs',
      image: 'https://images.unsplash.com/photo-1590872241989-c5d9c221c2e9?q=80&w=2070',
    },
    {
      name: 'Carretes',
      description: 'Spinning, Baitcasting',
      image: 'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2074',
    },
    {
      name: 'Cañas',
      description: 'Casting, Spinning, Travel',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
    },
    {
      name: 'Ropa',
      description: 'Jerseys, Gorras, Buffs',
      image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=2074',
    },
  ];

  const brands = [
    { name: 'Googan Squad', src: 'marcas/googan_logo.jpg' },
    { name: 'Yum', src: '/logo_yum.png' },
    { name: 'Rage Tail', src: 'marcas/rage-tail-logo.png' },
    { name: 'Rapala', src: 'marcas/Rapala-logo.png' },
    { name: 'X-Zone', src: 'marcas/x-zone-logo.png' },
    { name: 'Z-Man', src: 'marcas/zman-logo.png' },
    { name: 'Zoom', src: 'marcas/zoom_logo.jpg' },
  ];

  return (
    <>
      <Hero />
      {/* <Stats /> */}

      {/* Sorteos Activos */}
      <section className="py-16 md:py-24 relative" id="sorteos">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
            <div>
              <span className="text-splash-blue font-bold tracking-wider text-sm uppercase">
                Gana a lo grande
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-black text-gray-900 dark:text-white mt-2">
                Sorteos{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-action-yellow to-yellow-600">
                  Activos
                </span>
              </h2>
            </div>
            <Link
              href="/sorteos"
              className="hidden md:flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-action-yellow dark:hover:text-action-yellow transition-colors font-semibold group"
            >
              Ver todos los sorteos
              <ArrowRight
                size={20}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {raffles.map((raffle) => (
              <RaffleCard key={raffle.id} {...raffle} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/sorteos"
              className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-action-yellow dark:hover:text-action-yellow transition-colors font-semibold"
            >
              Ver todos los sorteos
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Tienda - Categorías */}
      <section
        className="py-16 bg-gray-100 dark:bg-gray-900/50 transition-colors duration-300"
        id="tienda"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 dark:text-white mb-4">
              Equípate como Profesional
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Encuentra todo lo que necesitas para tu próxima salida de pesca en
              nuestro catálogo.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={`/catalogo?category=${category.name.toLowerCase()}`}
                className="group relative rounded-xl overflow-hidden aspect-[3/4] shadow-md hover:shadow-xl transition-all duration-300"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white font-display font-bold text-xl mb-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-300 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {category.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas */}
      <section
        className="py-12 border-y border-gray-200 dark:border-gray-800 bg-white dark:bg-carbon-black overflow-hidden transition-colors duration-300"
        id="marcas"
      >
        <div className="max-w-7xl mx-auto px-4 mb-10">
          <h3 className="text-center font-display font-bold text-gray-400 uppercase tracking-widest text-sm">
            Trabajamos con las mejores marcas
          </h3>
        </div>
        
        <div className="relative w-full px-4">
          <div className="flex justify-center flex-wrap gap-8 md:gap-16 items-center">
            {/* Definimos los datos aquí mismo o arriba en tu componente */}
            {[
              { name: 'Googan Squad', src: '/googan_logo.jpg', url: 'https://googansquad.com/' },
              { name: 'Yum', src: '/logo_yum.png', url: 'https://www.lurenet.com/brands/yum' },
              { name: 'Rage Tail', src: '/rage-tail-logo.png', url: 'https://www.strikeking.com/' },
              { name: 'Rapala', src: '/Rapala-logo.png', url: 'https://www.rapala.com/' },
              { name: 'X-Zone', src: '/x-zone-logo.png', url: 'https://www.xzonelures.com/' },
              { name: 'Z-Man', src: '/zman-logo.png', url: 'https://zmanfishing.com/' },
              { name: 'Zoom', src: '/zoom_logo.jpg', url: 'https://zoombaits.com/' },
            ].map((brand, index) => (
              <a
                key={index}
                href={brand.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block h-16 w-32 md:h-20 md:w-40 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-110"
                title={`Visitar sitio oficial de ${brand.name}`}
              >
                {/* Efecto de sombra/brillo detrás al hacer hover  */}
                <div className="absolute inset-0 bg-action-yellow/20 rounded-full filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                <Image
                  src={brand.src}
                  alt={brand.name}
                  fill
                  className="object-contain drop-shadow-sm group-hover:drop-shadow-xl transition-all duration-300"
                  sizes="(max-width: 768px) 128px, 160px"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter con Imagen de Fondo */}
      <section className="py-24 relative overflow-hidden">
        
        {/* 1. IMAGEN DE FONDO + OVERLAY */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/suscribete-fondo.jpeg"
            alt="Suscríbete a BassOrilla"
            fill
            className="object-cover"
          />
          
          {/* Capa 1: Un tinte verde oscuro para mantener la marca */}
          <div className="absolute inset-0 bg-bass-green/80 mix-blend-multiply" />
          
          {/* Capa 2: Un degradado negro para oscurecer más y resaltar el texto blanco */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </div>

        {/* 2. CONTENIDO */}
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          
          {/* Icono flotante con efecto Glass */}
          <span className="inline-block p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 mb-8 shadow-2xl">
            <Mail className="text-action-yellow drop-shadow-md" size={32} />
          </span>

          <h2 className="text-3xl md:text-5xl font-display font-black text-white mb-6 tracking-tight drop-shadow-lg">
            No te pierdas ningún sorteo
          </h2>
          
          <p className="text-gray-200 text-lg mb-10 max-w-xl mx-auto font-medium drop-shadow-md">
            Únete a la comunidad. Recibe notificaciones sobre nuevos
            sorteos, ganadores y ofertas exclusivas directamente en tu correo.
          </p>

          <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <input
              className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-action-yellow focus:bg-black/40 backdrop-blur-md transition-all shadow-inner"
              placeholder="Tu correo electrónico"
              type="email"
            />
            <button
              className="bg-action-yellow text-[#1A1A1A] px-8 py-4 rounded-xl font-bold hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg shadow-yellow-500/20"
              type="submit"
            >
              Suscribirse
            </button>
          </form>

          <p className="text-gray-400 text-xs mt-6 font-medium">
            Respetamos tu privacidad. No spam, solo pesca.
          </p>
        </div>
      </section>
    </>
  );
}