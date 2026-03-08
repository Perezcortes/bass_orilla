'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter } from 'lucide-react';

export default function CatalogoFiltersClient({ 
  currentSearch, 
  currentSort,
  minPrice,
  maxPrice
}: { 
  currentSearch?: string, 
  currentSort: string,
  minPrice: number | null,
  maxPrice: number | null
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Estados locales para los inputs
  const [searchValue, setSearchValue] = useState(currentSearch || '');
  const [localMin, setLocalMin] = useState(minPrice?.toString() || '');
  const [localMax, setLocalMax] = useState(maxPrice?.toString() || '');
  const [showFilters, setShowFilters] = useState(false);

  // Función para actualizar la URL sin perder la categoría actual
  const updateUrl = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    // Siempre que buscamos o filtramos, volvemos a la página 1
    params.delete('page');
    router.push(`/catalogo?${params.toString()}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUrl('q', searchValue);
  };

  const applyPriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (localMin) params.set('minPrice', localMin); else params.delete('minPrice');
    if (localMax) params.set('maxPrice', localMax); else params.delete('maxPrice');
    params.delete('page');
    router.push(`/catalogo?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
      
      {/* Barra de Búsqueda */}
      <form onSubmit={handleSearchSubmit} className="relative flex-1 lg:w-80 group">
        <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-splash-blue transition-colors">
          <Search size={18} />
        </button>
        <input 
          type="text" 
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Buscar colores, marcas, curricanes..." 
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-splash-blue transition-colors shadow-sm" 
        />
      </form>

      {/* Botón Filtros Móvil */}
      <div className="flex gap-2">
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex-1 flex items-center justify-center gap-2 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-xl py-3 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-splash-blue transition-colors"
        >
          <Filter size={16} /> Filtros de Precio
        </button>

        {/* Ordenamiento */}
        <select 
          value={currentSort}
          onChange={(e) => updateUrl('sort', e.target.value)}
          className="flex-1 lg:w-auto bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 text-sm text-gray-900 dark:text-white rounded-xl focus:outline-none focus:border-splash-blue py-3 px-4 transition-colors shadow-sm appearance-none cursor-pointer hover:border-splash-blue/50"
        >
          <option value="recent">Más Recientes</option>
          <option value="ofertas">Solo Ofertas</option>
          <option value="price_asc">Menor a Mayor Precio</option>
          <option value="price_desc">Mayor a Menor Precio</option>
        </select>
      </div>

      {/* Rango de Precios (Visible en Desktop o si se presiona el botón en Móvil) */}
      <div className={`flex items-center gap-2 ${showFilters ? 'flex' : 'hidden lg:flex'} bg-white dark:bg-[#1A1A1A] p-1.5 rounded-xl border border-gray-200 dark:border-gray-800`}>
        <input 
          type="number" 
          placeholder="Min $" 
          value={localMin}
          onChange={(e) => setLocalMin(e.target.value)}
          className="w-20 py-1.5 px-2 bg-gray-50 dark:bg-black rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-splash-blue border border-transparent"
        />
        <span className="text-gray-400">-</span>
        <input 
          type="number" 
          placeholder="Max $" 
          value={localMax}
          onChange={(e) => setLocalMax(e.target.value)}
          className="w-20 py-1.5 px-2 bg-gray-50 dark:bg-black rounded-lg text-xs text-center focus:outline-none focus:ring-1 focus:ring-splash-blue border border-transparent"
        />
        <button 
          onClick={applyPriceFilter}
          className="bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-splash-blue dark:hover:bg-splash-blue dark:hover:text-white transition-colors"
        >
          Ir
        </button>
      </div>

    </div>
  );
}