'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';

const CATALOG_STRUCTURE: Record<string, Record<string, string[]>> = {
  "Agua Dulce": {
    "Carretes": ["Spinning", "Casting", "Spincast"],
    "Cañas": ["Spinning", "Casting"],
    "Combos": ["Combos Spinning", "Combos Casting", "Combos Spincast"],
    "Señuelos": ["Plásticos", "Curricanes", "Swimbaits", "Spinnerbaits y Buzzbaits", "Jigs y Chatterbaits", "Cucharillas"],
    "Terminal Tackle": ["Anzuelos y Tercias", "Plomos y Tungstenos", "Jigheads", "Esencias"]
  },
  "Ropa y Accesorios": {
    "Ropa": ["Buff", "Camisas y jerseys", "Gorras y Sombreros", "Guantes", "Chalecos Salvavidas", "Pantalones y Shorts"],
    "Accesorios Varios": ["Básculas", "Herramientas", "Red de Pesca", "Cuchillos y Navajas", "Otros Accesorios"],
    "Almacenaje": ["Almacenaje para Señuelos", "Almacenaje para Cañas", "Almacenaje para Carretes"],
    "Lentes Polarizados": ["General"]
  },
  "Líneas para Pescar": {
    "Monofilamento": ["General"],
    "Fluorocarbono": ["General"],
    "Trenzado": ["General"],
    "Líderes": ["General"]
  }
};

export default function CatalogoSidebarClient({
  currentDept,
  currentCat,
  currentSubcat,
  currentSearch,
  minPrice,
  maxPrice,
  currentSort
}: {
  currentDept?: string;
  currentCat?: string;
  currentSubcat?: string;
  currentSearch?: string;
  minPrice: number | null;
  maxPrice: number | null;
  currentSort: string;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const buildUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (currentDept) params.set('dept', currentDept);
    if (currentCat) params.set('cat', currentCat);
    if (currentSubcat) params.set('subcat', currentSubcat);
    if (currentSearch) params.set('q', currentSearch);
    if (minPrice !== null) params.set('minPrice', minPrice.toString());
    if (maxPrice !== null) params.set('maxPrice', maxPrice.toString());
    if (currentSort && currentSort !== 'recent') params.set('sort', currentSort);

    Object.keys(updates).forEach(key => {
      if (updates[key] === undefined) params.delete(key);
      else params.set(key, updates[key] as string);
    });
    return `/catalogo?${params.toString()}`;
  };

  return (
    <aside className="w-full lg:w-72 flex-shrink-0">
      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-5 lg:p-6 sticky top-24 transition-colors duration-300">
        
        {/* Cabecera / Botón Móvil */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2 lg:cursor-default flex-1 outline-none text-left"
          >
            <SlidersHorizontal size={20} className="text-splash-blue shrink-0" />
            <span>Categorías</span>
            <ChevronDown 
              size={18} 
              className={`ml-auto lg:hidden text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {(currentDept || currentSearch || minPrice !== null) && (
            <Link href="/catalogo" className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors ml-4 shrink-0">
              Limpiar
            </Link>
          )}
        </div>

        {/* Acordeón de Categorías (Controlado por estado en React) */}
        <div className={`${isOpen ? 'block' : 'hidden'} lg:block pt-6 transition-all duration-300`}>
          <div className="space-y-6">
            {Object.keys(CATALOG_STRUCTURE).map((dept) => {
              const isDeptActive = currentDept === dept;

              return (
                <div key={dept} className="border-b border-gray-50 dark:border-gray-800/50 pb-4 last:border-0 last:pb-0">
                  <Link
                    href={buildUrl({ dept, cat: undefined, subcat: undefined, page: '1' })}
                    onClick={() => setIsOpen(false)} // Cierra el menú al elegir
                    className={`block font-bold uppercase tracking-wider text-sm mb-3 transition-colors ${isDeptActive ? 'text-splash-blue' : 'text-gray-900 dark:text-white hover:text-splash-blue'}`}
                  >
                    {dept}
                  </Link>

                  {(isDeptActive || !currentDept) && (
                    <div className="space-y-4 pl-3 border-l-2 border-gray-100 dark:border-gray-800">
                      {Object.keys(CATALOG_STRUCTURE[dept]).map((cat) => {
                        const isCatActive = currentCat === cat;

                        return (
                          <div key={cat}>
                            <Link
                              href={buildUrl({ dept, cat, subcat: undefined, page: '1' })}
                              onClick={() => setIsOpen(false)}
                              className={`block text-sm font-medium transition-colors ${isCatActive ? 'text-splash-blue' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
                            >
                              {cat}
                            </Link>

                            {isCatActive && (
                              <div className="mt-2 space-y-2 pl-3">
                                {CATALOG_STRUCTURE[dept][cat].map((subcat) => {
                                  const isSubActive = currentSubcat === subcat;
                                  return (
                                    <Link
                                      key={subcat}
                                      href={buildUrl({ dept, cat, subcat, page: '1' })}
                                      onClick={() => setIsOpen(false)}
                                      className={`block text-xs transition-colors ${isSubActive ? 'text-splash-blue font-bold' : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
                                    >
                                      • {subcat}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
}