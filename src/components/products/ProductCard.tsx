import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShoppingCart } from 'lucide-react';

interface Variant {
  colorName: string;
  imageUrl: string;
  inStock: boolean;
}

interface ProductCardProps {
  id: string;
  slug: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  discount_price: number | null;
  variants: Variant[];
}

export default function ProductCard({
  slug,
  title,
  brand,
  description,
  price,
  discount_price,
  variants,
}: ProductCardProps) {
  // Determinamos la imagen principal (la de la primera variante)
  const mainImage = variants?.[0]?.imageUrl || '/placeholder.png';
  
  // Verificamos si hay al menos una variante en stock
  const isAvailable = variants?.some(v => v.inStock);

  // === FUNCIÓN PARA FORMATEAR EL PRECIO ===
  // Esto convierte 11279 a "$ 11,279" sin decimales innecesarios
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0, // No muestra decimales si es un número entero
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden hover:-translate-y-1 flex flex-col h-full">
      {/* SECCIÓN DE IMAGEN */}
      <div className="relative aspect-[4/3] overflow-hidden bg-white dark:bg-gray-800 p-4">
        {/* Badge de Oferta Dinámico */}
        {discount_price && (
          <span className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded uppercase tracking-wider shadow-md">
            OFERTA
          </span>
        )}

        <Image
          src={mainImage}
          alt={title}
          fill
          className="object-contain p-4 transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <Link href={`/catalogo/${slug}`} className="w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-action-yellow hover:text-black dark:hover:bg-action-yellow transition-colors flex justify-center items-center gap-2">
            <Eye size={18} /> Ver Detalles
          </Link>
        </div>
      </div>

      {/* SECCIÓN DE CONTENIDO */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
            {brand}
          </p>
          <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-2 mb-2" title={title}>
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Miniaturas de Colores (Imágenes reales) */}
        {variants && variants.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-gray-400 uppercase">
              Colores:
            </span>
            <div className="flex gap-1.5 items-center">
              {variants.slice(0, 4).map((variant, index) => (
                <div
                  key={index}
                  className="relative w-6 h-6 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden"
                  title={variant.colorName}
                >
                  <Image src={variant.imageUrl} alt={variant.colorName} fill className="object-cover" />
                </div>
              ))}
              {variants.length > 4 && (
                <span className="text-xs text-gray-400 font-medium ml-1">
                  +{variants.length - 4}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Precio y Botón (Alineados abajo) */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4 mt-auto">
          <div className="flex flex-col">
            {discount_price ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(price)}
                </span>
                <span className="text-xl font-black text-red-500">
                  {formatPrice(discount_price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-black text-gray-900 dark:text-white">
                {formatPrice(price)}
              </span>
            )}
          </div>

          <Link
            href={`/catalogo/${slug}`}
            className="bg-action-yellow hover:bg-yellow-400 text-[#1A1A1A] px-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 shadow-sm hover:shadow-md group/btn"
          >
            <ShoppingCart size={16} className="group-hover/btn:rotate-12 transition-transform" />
            Comprar
          </Link>
        </div>

        {/* Status de Stock */}
        {!isAvailable && (
          <div className="mt-3 text-center">
            <span className="text-xs bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 rounded-full font-bold uppercase">
              Agotado
            </span>
          </div>
        )}
      </div>
    </div>
  );
}