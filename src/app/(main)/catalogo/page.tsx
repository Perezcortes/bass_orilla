import ProductCard from '@/components/products/ProductCard';
import { Search, SlidersHorizontal, PackageX, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

// === TAXONOMÍA MAESTRA ===
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

  // 1. OBTENER PARÁMETROS DE LA URL
  const currentPage = Number(resolvedParams.page) || 1;
  const pageSize = 15; // Límite de 15 productos por página
  const currentDept = resolvedParams.dept;
  const currentCat = resolvedParams.cat;
  const currentSubcat = resolvedParams.subcat;
  const currentSearch = resolvedParams.q;
  const currentSort = resolvedParams.sort || 'recent';

  // 2. CONSTRUIR LA CONSULTA A SUPABASE DINÁMICAMENTE
  let query = supabase
    .from('products')
    .select('*', { count: 'exact' }) // count exacto para la paginación
    .eq('is_active', true);

  // Filtros de jerarquía
  if (currentDept) query = query.eq('department', currentDept);
  if (currentCat) query = query.eq('category', currentCat);
  if (currentSubcat) query = query.eq('subcategory', currentSubcat);
  
  // Búsqueda por texto (Busca en título o marca)
  if (currentSearch) {
    query = query.or(`title.ilike.%${currentSearch}%,brand.ilike.%${currentSearch}%`);
  }

  // Ordenamiento
  if (currentSort === 'price_asc') query = query.order('price', { ascending: true });
  else if (currentSort === 'price_desc') query = query.order('price', { ascending: false });
  else if (currentSort === 'ofertas') query = query.not('discount_price', 'is', null).order('created_at', { ascending: false });
  else query = query.order('created_at', { ascending: false }); // 'recent' por defecto

  // Paginación
  const from = (currentPage - 1) * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  // 3. EJECUTAR CONSULTA
  const { data: products, count } = await query;
  const safeProducts = products || [];
  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Función auxiliar para generar URLs manteniendo los otros parámetros
  const buildUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    if (currentDept) params.set('dept', currentDept);
    if (currentCat) params.set('cat', currentCat);
    if (currentSubcat) params.set('subcat', currentSubcat);
    if (currentSearch) params.set('q', currentSearch);
    if (currentSort && currentSort !== 'recent') params.set('sort', currentSort);
    
    // Aplicamos actualizaciones
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
        <nav className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-action-yellow transition-colors">Inicio</Link>
          <ChevronRight size={14} className="mx-2 shrink-0" />
          <Link href="/catalogo" className={`hover:text-action-yellow transition-colors ${!currentDept ? 'text-gray-900 dark:text-white font-bold' : ''}`}>Catálogo</Link>
          
          {currentDept && (
            <>
              <ChevronRight size={14} className="mx-2 shrink-0" />
              <Link href={buildUrl({ dept: currentDept, cat: undefined, subcat: undefined, page: '1' })} className={`hover:text-action-yellow transition-colors ${!currentCat ? 'text-gray-900 dark:text-white font-bold' : ''}`}>
                {currentDept}
              </Link>
            </>
          )}
          {currentCat && (
            <>
              <ChevronRight size={14} className="mx-2 shrink-0" />
              <Link href={buildUrl({ cat: currentCat, subcat: undefined, page: '1' })} className={`hover:text-action-yellow transition-colors ${!currentSubcat ? 'text-gray-900 dark:text-white font-bold' : ''}`}>
                {currentCat}
              </Link>
            </>
          )}
          {currentSubcat && (
            <>
              <ChevronRight size={14} className="mx-2 shrink-0" />
              <span className="text-gray-900 dark:text-white font-bold">{currentSubcat}</span>
            </>
          )}
        </nav>

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 border-b border-gray-200 dark:border-gray-800 pb-6">
          <div>
            <h2 className="text-3xl md:text-5xl font-display font-black text-gray-900 dark:text-white tracking-tight uppercase">
              {currentSubcat || currentCat || currentDept || 'EQUIPO PRO'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">
              Mostrando {safeProducts.length} de {totalItems} productos
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Solo maquetamos la barra de búsqueda y el orden, le agregaremos su lógica cliente en el próximo paso si quieres */}
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input defaultValue={currentSearch || ''} type="text" placeholder="Buscar..." className="w-full sm:w-64 pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1A1A1A] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow transition-colors shadow-sm" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR - TAXONOMÍA JERÁRQUICA */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100 dark:border-gray-800">
                <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-action-yellow" /> Explorar
                </h3>
                {(currentDept || currentSearch) && (
                  <Link href="/catalogo" className="text-xs font-bold text-gray-500 hover:text-action-yellow transition-colors">
                    Limpiar Filtros
                  </Link>
                )}
              </div>

              {/* Acordeón de Categorías */}
              <div className="space-y-6">
                {Object.keys(CATALOG_STRUCTURE).map((dept) => {
                  const isDeptActive = currentDept === dept;
                  
                  return (
                    <div key={dept} className="border-b border-gray-50 dark:border-gray-800/50 pb-4 last:border-0 last:pb-0">
                      {/* Enlace de Departamento */}
                      <Link 
                        href={buildUrl({ dept, cat: undefined, subcat: undefined, page: '1' })}
                        className={`block font-bold uppercase tracking-wider text-sm mb-3 transition-colors ${isDeptActive ? 'text-action-yellow' : 'text-gray-900 dark:text-white hover:text-action-yellow'}`}
                      >
                        {dept}
                      </Link>

                      {/* Solo mostramos categorías si el departamento está activo o si no hay ninguno seleccionado */}
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

                                {/* Solo mostramos subcategorías si la categoría está activa */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {safeProducts.map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}
                </div>

                {/* --- PAGINACIÓN --- */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center border-t border-gray-200 dark:border-gray-800 pt-8">
                    <nav className="flex items-center gap-2">
                      {/* Botón Anterior */}
                      {currentPage > 1 ? (
                        <Link href={buildUrl({ page: (currentPage - 1).toString() })} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1A1A1A] transition-colors font-medium text-sm">
                          Anterior
                        </Link>
                      ) : (
                        <span className="px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed font-medium text-sm">
                          Anterior
                        </span>
                      )}

                      {/* Números de página */}
                      <div className="hidden sm:flex items-center gap-2">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          const isCurrent = pageNum === currentPage;
                          return (
                            <Link 
                              key={pageNum}
                              href={buildUrl({ page: pageNum.toString() })}
                              className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-bold transition-colors ${isCurrent ? 'bg-action-yellow text-[#1A1A1A] shadow-md' : 'text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-[#1A1A1A]'}`}
                            >
                              {pageNum}
                            </Link>
                          );
                        })}
                      </div>

                      {/* Contador Móvil */}
                      <span className="sm:hidden text-sm font-medium text-gray-500">
                        Pág {currentPage} de {totalPages}
                      </span>

                      {/* Botón Siguiente */}
                      {currentPage < totalPages ? (
                        <Link href={buildUrl({ page: (currentPage + 1).toString() })} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#1A1A1A] transition-colors font-medium text-sm">
                          Siguiente
                        </Link>
                      ) : (
                        <span className="px-4 py-2 rounded-xl border border-gray-100 dark:border-gray-800/50 text-gray-300 dark:text-gray-600 cursor-not-allowed font-medium text-sm">
                          Siguiente
                        </span>
                      )}
                    </nav>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl border border-gray-100 dark:border-gray-800 p-16 text-center flex flex-col items-center justify-center shadow-sm h-full">
                <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mb-6">
                  <PackageX className="text-gray-400 dark:text-gray-500" size={40} />
                </div>
                <h3 className="text-2xl font-display font-black text-gray-900 dark:text-white mb-3">
                  No hay resultados
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                  No encontramos productos que coincidan con estos filtros. Intenta buscar en otra categoría.
                </p>
                <Link href="/catalogo" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold hover:bg-action-yellow dark:hover:bg-action-yellow hover:text-black transition-colors">
                  Ver todo el catálogo
                </Link>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}