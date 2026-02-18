'use client';

import Link from 'next/link';
import { Ticket, Store } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">

      {/* 1. BACKGROUND IMAGE CON CAMBIO RESPONSIVO */}
      <div className="absolute inset-0 z-0">
        {/* usar la etiqueta <picture> de HTML estándar */}
        <picture>
          {/* Para pantallas grandes (min-width: 768px), usa esta imagen.*/}
          <source media="(min-width: 768px)" srcSet="/fondo-pri.jpeg" />

          {/* Para móviles (imagen por defecto) */}
          <Image
            src="/fondo1.jpeg"
            alt="Pesca deportiva"
            fill
            priority
            // En móvil usamos tu ajuste, en desktop ya no es necesario porque la imagen es la correcta.
            className="object-cover object-[center_30%] md:object-cover"
          />
        </picture>

        {/* Los overlays siguen igual... */}
        <div className="absolute inset-0 bg-black/20 md:bg-gradient-to-b md:from-black/40 md:via-black/10 md:to-transparent z-10" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/50 z-10" />
      </div>

      {/* 2. CONTENIDO */}
      <div className="relative z-20 container mx-auto px-4 text-center mt-10 md:mt-0">
        <div className="mx-auto mb-8 animate-fade-in-up">
          <div className="inline-flex flex-col items-center">

            <h1
              className="font-display font-black text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-white tracking-tight drop-shadow-2xl mb-4 leading-none"
            >
              BassOrilla
            </h1>

            <div className="bg-[#1A1A1A] text-action-yellow font-display font-black text-sm sm:text-xl md:text-2xl px-4 py-1.5 md:px-6 md:py-2 -mt-3 md:-mt-6 transform -rotate-2 rounded-sm border border-white shadow-2xl backdrop-blur-md">
              RIFAS Y SORTEOS
            </div>
          </div>
        </div>

        <p className="text-gray-100 text-base sm:text-xl max-w-lg md:max-w-2xl mx-auto mb-8 md:mb-12 font-medium drop-shadow-lg leading-relaxed px-2">
          Participa por el equipo de tus sueños. Cañas, carretes y embarcaciones de las mejores marcas mundiales.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs sm:max-w-none mx-auto">
          <Link
            href="/sorteos"
            className="group w-full sm:w-auto bg-action-yellow text-[#1A1A1A] px-6 py-4 rounded-full font-bold text-lg shadow-[0_0_20px_rgba(249,184,36,0.5)] hover:bg-yellow-300 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Ticket className="group-hover:rotate-12 transition-transform" size={20} />
            Ver Sorteos
          </Link>
          <Link
            href="/catalogo"
            className="w-full sm:w-auto bg-white/10 backdrop-blur-md border border-white/30 text-white px-6 py-4 rounded-full font-bold text-lg hover:bg-white/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Store size={20} />
            Catálogo
          </Link>
        </div>
      </div>

      {/* 3. WAVE SVG */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-none z-30">
        <svg
          className="relative block w-[200%] sm:w-full h-12 md:h-24 fill-[#FAFAF8] dark:fill-[#111110]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>
    </section>
  );
}