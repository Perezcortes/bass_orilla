'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, ArrowRight, PackageX } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
      // Atajo de teclado (Ctrl + K o Cmd + K) para abrir buscador
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Autofocus cuando se abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden'; // Evitar scroll de la página
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Efecto de Búsqueda con "Debounce" (espera 300ms después de dejar de escribir)
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const fetchResults = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      // Búsqueda difusa en múltiples columnas (Título, Marca, Descripción, Categoría)
      const { data } = await supabase
        .from('products')
        .select('id, title, slug, brand, price, discount_price, variants')
        .or(`title.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .eq('is_active', true)
        .limit(5); // Solo mostramos los 5 mejores resultados rápidos

      setResults(data || []);
      setIsLoading(false);
    };

    const delayDebounceFn = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  // Extraer imagen del JSON
  const getProductImage = (variants: any) => {
    try {
      const parsed = typeof variants === 'string' ? JSON.parse(variants) : variants;
      return parsed?.[0]?.imageUrl || '/logo-bass.png';
    } catch {
      return '/logo-bass.png';
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsOpen(false);
      router.push(`/catalogo?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <>
      {/* Botón en el Navbar */}
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full sm:rounded-lg bg-transparent sm:bg-gray-100 sm:dark:bg-[#1A1A1A] hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors border border-transparent sm:border-gray-200 sm:dark:border-gray-800 group"
      >
        <Search size={18} className="group-hover:text-action-yellow transition-colors" />
        <span className="hidden lg:inline text-sm font-medium text-gray-500">Buscar equipo...</span>
        <span className="hidden lg:inline text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-800 ml-2">⌘K</span>
      </button>

      {/* Modal de Búsqueda (Command Palette) */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          {/* Capa invisible para cerrar al hacer clic afuera */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)}></div>

          <div className="relative w-full max-w-2xl bg-white dark:bg-[#111110] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col animate-fade-in-up">
            
            {/* Buscador Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex items-center border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#151515]">
              <Search size={24} className="absolute left-4 text-action-yellow" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Busca marcas, señuelos, técnicas (ej. flipping)..."
                className="w-full pl-12 pr-12 py-5 bg-transparent text-lg text-gray-900 dark:text-white outline-none placeholder-gray-400 font-medium"
              />
              <button 
                type="button"
                onClick={() => setIsOpen(false)}
                className="absolute right-4 p-1 rounded-md text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={20} />
              </button>
            </form>

            {/* Resultados */}
            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                  <Loader2 size={32} className="animate-spin text-action-yellow mb-4" />
                  <p>Buscando en el catálogo...</p>
                </div>
              ) : query.trim() === '' ? (
                <div className="py-8 px-6 text-center">
                  <p className="text-gray-500 text-sm">Empieza a escribir para ver resultados instantáneos.</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {['Shimano', 'Googan', 'Swimbaits', 'Flipping'].map(term => (
                      <button key={term} onClick={() => setQuery(term)} className="px-3 py-1 bg-gray-100 dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-800 rounded-full text-xs text-gray-600 dark:text-gray-400 hover:text-action-yellow transition-colors">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  <p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-gray-500">Resultados Principales</p>
                  {results.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/catalogo/${product.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#1A1A1A] transition-colors group"
                    >
                      <div className="relative w-14 h-14 bg-white rounded-lg flex-shrink-0 border border-gray-100 dark:border-gray-800 group-hover:border-action-yellow transition-colors overflow-hidden">
                        <Image src={getProductImage(product.variants)} alt={product.title} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-action-yellow uppercase tracking-wide">{product.brand}</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{product.title}</p>
                      </div>
                      <div className="text-right pr-2">
                        {product.discount_price ? (
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 line-through">${product.price}</span>
                            <span className="text-sm font-bold text-green-600 dark:text-green-400">${product.discount_price}</span>
                          </div>
                        ) : (
                          <span className="text-sm font-bold text-gray-900 dark:text-white">${product.price}</span>
                        )}
                      </div>
                    </Link>
                  ))}
                  
                  <button 
                    onClick={handleSearchSubmit}
                    className="w-full mt-2 p-3 text-sm font-bold text-center text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white bg-gray-50 dark:bg-[#1A1A1A] hover:bg-action-yellow dark:hover:bg-action-yellow rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Ver todos los resultados para "{query}" <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <PackageX size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-gray-900 dark:text-white font-medium mb-1">No encontramos resultados para "{query}"</p>
                  <p className="text-gray-500 text-sm">Intenta buscar por técnica, marca o tipo de señuelo.</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}