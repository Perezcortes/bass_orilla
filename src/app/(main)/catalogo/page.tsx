import ProductCard from '@/components/products/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function CatalogoPage() {
  // Mock data para productos
  const products = [
    {
      id: '1',
      name: 'Yamamoto Senko 5"',
      brand: 'Yamamoto',
      description: 'The standard for soft plastics. Irresistible fall.',
      price: 8.49,
      image:
        'https://images.unsplash.com/photo-1590872241989-c5d9c221c2e9?q=80&w=2070',
      colors: ['#2f5e38', '#a05e2b', '#d9f99d', '#f3f4f6'],
      badge: 'best-seller' as const,
      rating: 4.8,
      inStock: true,
    },
    {
      id: '2',
      name: 'Strike King Squarebill 1.5',
      brand: 'Strike King',
      description: 'Deflects off cover to trigger aggressive strikes.',
      price: 5.99,
      originalPrice: 7.99,
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
      colors: ['#fbbf24', '#9ca3af'],
      badge: 'sale' as const,
      rating: 4.5,
      inStock: true,
    },
    {
      id: '3',
      name: 'Jackall Gantarel Jr.',
      brand: 'Jackall',
      description: 'Premium bluegill imitator with realistic S-swimming action.',
      price: 34.99,
      image:
        'https://images.unsplash.com/photo-1544552866-d3ed42536cfd?q=80&w=2074',
      colors: ['#86efac', '#fb923c'],
      badge: 'raffle' as const,
      rating: 5.0,
      inStock: true,
    },
    {
      id: '4',
      name: 'War Eagle Spinnerbait',
      brand: 'War Eagle',
      description: 'Double willow leaf blades for maximum flash.',
      price: 8.99,
      image:
        'https://images.unsplash.com/photo-1564701148948-15adf2c41d2c?q=80&w=2070',
      colors: ['#ffffff', '#fde047'],
      rating: 4.3,
      inStock: true,
    },
    {
      id: '5',
      name: 'LiveTarget Hollow Body Frog',
      brand: 'LiveTarget',
      description: 'Walk-the-dog action over heavy lily pads.',
      price: 13.49,
      image:
        'https://images.unsplash.com/photo-1590872241989-c5d9c221c2e9?q=80&w=2070',
      colors: ['#16a34a', '#854d0e', '#000000'],
      badge: 'new' as const,
      rating: 4.6,
      inStock: true,
    },
    {
      id: '6',
      name: 'Strike King Tour Grade Jig',
      brand: 'Strike King',
      description: 'Heavy cover flipping jig. Stand-up head design.',
      price: 4.99,
      image:
        'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070',
      colors: ['#1e3a8a', '#166534'],
      rating: 4.7,
      inStock: true,
    },
  ];

  const categories = [
    { name: 'Soft Plastics', count: 24 },
    { name: 'Hard Baits', count: 18 },
    { name: 'Jigs & Spoons', count: 12 },
    { name: 'Topwater', count: 15 },
  ];

  const brands = [
    { name: 'BassOrilla Gear', count: 8 },
    { name: 'Yamamoto', count: 12 },
    { name: 'Strike King', count: 16 },
    { name: 'Rapala', count: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4] dark:bg-[#1A1A1A] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm text-gray-500 dark:text-gray-400 mb-2">
          <a href="/" className="hover:text-action-yellow">
            Inicio
          </a>
          <span className="mx-2">/</span>
          <span className="text-gray-800 dark:text-gray-200 font-medium">
            Catálogo
          </span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight">
              Señuelos Pro
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {products.length} productos encontrados
            </p>
          </div>

          {/* Sort & Search */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-initial">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-action-yellow focus:border-action-yellow transition-colors"
              />
            </div>
            <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-sm rounded-lg focus:ring-action-yellow focus:border-action-yellow py-2 pl-3 pr-10 transition-colors">
              <option>Destacados</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
              <option>Más Recientes</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg flex items-center gap-2">
                  <SlidersHorizontal size={20} />
                  Filtros
                </h3>
                <button className="text-action-yellow text-sm font-medium hover:underline">
                  Limpiar
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wide mb-3">
                  Categoría
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category.name} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-action-yellow rounded border-gray-300 dark:border-gray-600 focus:ring-action-yellow bg-transparent"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 flex-1">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({category.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700 pb-6">
                <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wide mb-3">
                  Marca
                </h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <label key={brand.name} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox text-action-yellow rounded border-gray-300 dark:border-gray-600 focus:ring-action-yellow bg-transparent"
                      />
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 flex-1">
                        {brand.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({brand.count})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-display font-bold text-gray-900 dark:text-white uppercase text-sm tracking-wide mb-3">
                  Precio
                </h3>
                <div className="space-y-4">
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full accent-action-yellow"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  ←
                </button>
                <button className="px-4 py-2 rounded-lg bg-action-yellow text-carbon-black font-bold">
                  1
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                  2
                </button>
                <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                  3
                </button>
                <span className="text-gray-400">...</span>
                <button className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 font-medium">
                  8
                </button>
                <button className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800">
                  →
                </button>
              </nav>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}