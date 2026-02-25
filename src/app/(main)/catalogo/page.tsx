import ProductCard from '@/components/products/ProductCard';
import { PackageX, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import CatalogoFiltersClient from './CatalogoFiltersClient'; 
import SpecialOrderBanner from '@/components/products/SpecialOrderBanner';

const CATALOG_STRUCTURE: Record<string, Record<string, string[]>> = {
  "Agua Dulce": {
    "Carretes": ["Spinning", "Casting", "Spincast"],
    "Cañas": ["Spinning", "Casting"],
    "Combos": ["Combos Spinning", "Combos Casting", "Combos Spincast"],
    "Señuelos": ["Plásticos", "Curricanes", "Swimbaits", "Spinnerbaits y Buzzbaits", "Jigs y Chatterbaits", "Cucharillas"],
    "Terminal Tackle": ["Anzuelos y Tercias", "Plomos y Tungstenos", "Jigheads", "Esencias", "Accesorios Varios"]
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

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const resolvedParams = await searchParams;
  const supabase = await createClient();

  // OBTENER PARÁMETROS
  const currentPage = Number(resolvedParams.page) || 1;
  const pageSize = 16; // Subimos a 16 para que se vean filas pares (4x4 o 2x8)
  const currentDept = resolvedParams.dept;
  const currentCat = resolvedParams.cat;
  const currentSubcat = resolvedParams.subcat;
  const currentSearch = resolvedParams.q; // Lo que escribe el usuario
  const minPrice = resolvedParams.minPrice ? Number(resolvedParams.minPrice) : null;
  const maxPrice = resolvedParams.maxPrice ? Number(resolvedParams.maxPrice) : null;
  const currentSort = resolvedParams.sort || 'recent';

  // CONSTRUIR CONSULTA
  let query = supabase.from('products').select('*', { count: 'exact' }).eq('is_active', true);

  // Filtros de Categoría
  if (currentDept) query = query.eq('department', currentDept);
  if (currentCat) query = query.eq('category', currentCat);
  if (currentSubcat) query = query.eq('subcategory', currentSubcat);
  
  // Filtro de Búsqueda de Texto Avanzada (Busca en título, marca o descripción)
  if (currentSearch) {
    query = query.or(`title.ilike.%${currentSearch}%,brand.ilike.%${currentSearch}%,description.ilike.%${currentSearch}%`);
  }

  // Filtro de Rango de Precios
  if (minPrice !== null) query = query.gte('price', minPrice);
  if (maxPrice !== null) query = query.lte('price', maxPrice);

  // Ordenamiento
  if (currentSort === 'price_asc') query = query.order('price', { ascending: true });
  else if (currentSort === 'price_desc') query = query.order('price', { ascending: false });
  else if (currentSort === 'ofertas') query = query.not('discount_price', 'is', null).order('created_at', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  // Paginación
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data: products, count } = await query;
  const safeProducts = products || [];
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

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
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        
        {/* Breadcrumb Automático */}
        <nav className="flex items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-action-yellow transition-colors">Inicio</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link href="/catalogo" className={`hover:text-action-yellow transition-colors ${!currentDept && !currentSearch ? 'text-gray-900 dark:text-white font-bold' : ''}`}>Catálogo</Link>
          
          {currentSearch && (
            <>
              <ChevronRight size={14} className="mx-2 shrink-0" />
              <span className="text-gray-900 dark:text-white font-bold">Resultados para "{currentSearch}"</span>
            </>
          )}

          {!currentSearch && currentDept && (
            <>
              <ChevronRight size={14} className="mx-2 shrink-0" />
              <Link href={buildUrl({ dept: currentDept, cat: undefined, subcat: undefined, page: '1' })} className={`hover:text-action-yellow transition-colors ${!currentCat ? 'text-gray-900 dark:text-white font-bold' : ''}`}>
                {currentDept}
              </Link>
            </>
          )}
          {!currentSearch && currentCat && (
            <>
              <ChevronRight size={14} className="mx-2 shrink-0" />
              <Link href={buildUrl({ cat: currentCat, subcat: undefined, page: '1' })} className={`hover:text-action-yellow transition-colors ${!currentSubcat ? 'text-gray-900 dark:text-white font-bold' : ''}`}>
                {currentCat}
              </Link>
            </>
          )}
          {!currentSearch && currentSubcat && (
            <>
              <ChevronRight size={14} className="mx-2 shrink-0" />
              <span className="text-gray-900 dark:text-white font-bold">{currentSubcat}</span>
            </>
          )}
        </nav>

        {/* HEADER Y BARRA DE BÚSQUEDA INTERACTIVA */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 dark:text-white tracking-tight uppercase">
              {currentSearch ? 'Resultados' : (currentSubcat || currentCat || currentDept || 'EQUIPO PRO')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium text-sm sm:text-base">
              {totalItems} productos encontrados
            </p>
          </div>

          {/* Componente Cliente para la Búsqueda y Ordenamiento */}
          <CatalogoFiltersClient 
            currentSearch={currentSearch} 
            currentSort={currentSort} 
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR - TAXONOMÍA Y FILTROS */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-action-yellow" /> Categorías
                </h3>
                {(currentDept || currentSearch || minPrice !== null) && (
                  <Link href="/catalogo" className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">
                    Limpiar Todo
                  </Link>
                )}
              </div>

              {/* Acordeón de Categorías */}
              <div className="space-y-6">
                {Object.keys(CATALOG_STRUCTURE).map((dept) => {
                  const isDeptActive = currentDept === dept;
                  
                  return (
                    <div key={dept} className="border-b border-gray-50 dark:border-gray-800/50 pb-4 last:border-0 last:pb-0">
                      <Link 
                        href={buildUrl({ dept, cat: undefined, subcat: undefined, page: '1' })}
                        className={`block font-bold uppercase tracking-wider text-sm mb-3 transition-colors ${isDeptActive ? 'text-action-yellow' : 'text-gray-900 dark:text-white hover:text-action-yellow'}`}
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
                                  className={`block text-sm font-medium transition-colors ${isCatActive ? 'text-action-yellow' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'}`}
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
                                          className={`block text-xs transition-colors ${isSubActive ? 'text-action-yellow font-bold' : 'text-gray-500 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
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
          </aside>

          {/* CUADRÍCULA DE PRODUCTOS */}
          <main className="flex-1 flex flex-col">
            {safeProducts.length > 0 ? (
              <>
                {/* AQUI ESTÁ LA MAGIA MÓVIL: grid-cols-2 */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
                  {safeProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {/* --- PAGINACIÓN --- */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center border-t border-gray-200 dark:border-gray-800 pt-8">
                    <nav className="flex items-center gap-2">
                      {currentPage > 1 ? (
                        <Link href={buildUrl({ page: (currentPage - 1).toString() })} className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1A1A1A] transition-colors font-medium text-xs sm:text-sm">
                          Anterior
                        </Link>
                      ) : (
                        <span className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-gray-100 dark:border-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed font-medium text-xs sm:text-sm">
                          Anterior
                        </span>
                      )}

                      <div className="hidden sm:flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          const isCurrent = pageNum === currentPage;
                          // Mostrar solo 5 páginas alrededor de la actual para no desbordar
                          if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                            return (
                                <Link 
                                  key={pageNum}
                                  href={buildUrl({ page: pageNum.toString() })}
                                  className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${isCurrent ? 'bg-action-yellow text-[#1A1A1A] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1A1A1A]'}`}
                                >
                                  {pageNum}
                                </Link>
                            );
                          }
                          if (pageNum === currentPage - 2 || pageNum === currentPage + 2) return <span key={pageNum} className="text-gray-400">...</span>;
                          return null;
                        })}
                      </div>

                      <span className="sm:hidden text-xs font-bold text-gray-500">
                        {currentPage} / {totalPages}
                      </span>

                      {currentPage < totalPages ? (
                        <Link href={buildUrl({ page: (currentPage + 1).toString() })} className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1A1A1A] transition-colors font-medium text-xs sm:text-sm">
                          Siguiente
                        </Link>
                      ) : (
                        <span className="px-3 py-2 sm:px-4 sm:py-2 rounded-xl border border-gray-100 dark:border-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed font-medium text-xs sm:text-sm">
                          Siguiente
                        </span>
                      )}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-100 dark:border-gray-800 p-8 sm:p-16 text-center flex flex-col items-center justify-center shadow-sm h-full">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <PackageX className="text-gray-400 dark:text-gray-500" size={32} />
                </div>
                <h3 className="text-xl sm:text-2xl font-display font-black text-gray-900 dark:text-white mb-3">
                  No hay resultados
                </h3>
                <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Proximamente publicaremos estos productos!.
                </p>
                <Link href="/catalogo" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-action-yellow dark:hover:bg-action-yellow hover:text-black transition-colors">
                  Ver todo el catálogo
                </Link>
              </div>
            )}

            {/* BANNER DE PEDIDO ESPECIAL (FUERA DE LA CONDICIÓN PARA QUE SIEMPRE SALGA) */}
            <div className="mt-auto pt-8">
               <SpecialOrderBanner />
            </div>
            
          </main>

        </div>
      </div>
    </div>
  );
}