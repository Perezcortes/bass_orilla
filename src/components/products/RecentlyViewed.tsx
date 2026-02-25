'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard'; 

type ViewedProduct = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  discount_price: number | null;
  variants: any[];
};

export default function RecentlyViewed({ currentProductId }: { currentProductId?: string }) {
  const [viewedProducts, setViewedProducts] = useState<ViewedProduct[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('bassorilla_viewed');
      if (stored) {
        let parsed = JSON.parse(stored);
        
        // Excluimos el producto actual para que no se vea a sí mismo en la lista
        if (currentProductId) {
          parsed = parsed.filter((p: ViewedProduct) => p.id !== currentProductId);
        }
        
        setViewedProducts(parsed);
      }
    } catch (error) {
      console.error('Error leyendo vistos recientemente', error);
    }
  }, [currentProductId]);

  // Función para mover el carrusel con las flechas
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      // Desplazamos aproximadamente el 80% del contenedor visible para que siempre asome la siguiente tarjeta
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.8; 
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Si no hay productos en el historial, no mostramos nada
  if (viewedProducts.length === 0) return null;

  return (
    <div className="mt-16 sm:mt-24 border-t border-gray-200 dark:border-gray-800 pt-10 sm:pt-12 relative overflow-hidden">
      
      {/* Cabecera y Controles */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-1">
          <h3 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white uppercase">
            Vistos Recientemente
          </h3>
          <div className="hidden sm:block h-px flex-1 bg-gradient-to-r from-gray-200 to-transparent dark:from-gray-800"></div>
        </div>

        {/* Flechas de navegación (Solo aparecen si hay más de 2 productos) */}
        {viewedProducts.length > 2 && (
          <div className="flex gap-2 ml-4">
            <button 
              onClick={() => scroll('left')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#2d5a27] hover:text-white hover:border-[#2d5a27] transition-all active:scale-95 shrink-0"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-[#2d5a27] hover:text-white hover:border-[#2d5a27] transition-all active:scale-95 shrink-0"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
      
      {/* Carrusel Deslizable */}
      <div className="-mx-4 px-4 sm:mx-0 sm:px-0"> {/* Compensa el padding en móvil para que el scroll llegue al borde */}
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-3 sm:gap-4 snap-x snap-mandatory pb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {viewedProducts.map(product => (
            <div 
              key={product.id} 
              // ANCHOS FIJOS: 160px en móvil para que sean "mini cards", más grandes en PC
              className="w-[160px] sm:w-[200px] lg:w-[240px] snap-start shrink-0"
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}