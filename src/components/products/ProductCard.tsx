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
  const mainImage = variants?.[0]?.imageUrl || '/placeholder.png';
  const isAvailable = variants?.some(v => v.inStock);

  // === FUNCIÓN PARA FORMATEAR EL PRECIO ===
  const formatPrice = (amount: number) => {
    if (amount < 1000) {
      return `$ ${amount.toFixed(2)}`;
    } else {
      const integerPart = Math.floor(amount).toString();
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `$ ${formattedInteger}`;
    }
  };

  return (
    <div className="group bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-800 overflow-hidden hover:-translate-y-1 flex flex-col h-full">
      
      {/* SECCIÓN DE IMAGEN (Corregida para Safari/iPhone y usando Splash Blue) */}
      <div className="relative w-full h-[160px] sm:h-[200px] md:h-[220px] overflow-hidden bg-white dark:bg-[#111110] p-2 sm:p-4 flex-shrink-0">
        {discount_price && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] sm:text-xs font-black px-2 py-1 rounded uppercase tracking-wider shadow-md">
            OFERTA
          </span>
        )}

        <Image
          src={mainImage}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-contain p-2 sm:p-4 transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay Hover */}
        <div className="hidden sm:flex absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-end p-4">
          <Link href={`/catalogo/${slug}`} className="w-full bg-white dark:bg-[#2A2A2A] text-gray-900 dark:text-white py-2.5 rounded-xl text-sm font-bold shadow-lg hover:bg-splash-blue hover:text-white dark:hover:bg-splash-blue dark:hover:text-white transition-colors flex justify-center items-center gap-2">
            <Eye size={18} /> Ver Detalles
          </Link>
        </div>
      </div>

      {/* SECCIÓN DE CONTENIDO */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-[10px] sm:text-xs font-bold text-splash-blue uppercase tracking-wider mb-0.5 sm:mb-1 line-clamp-1">
            {brand}
          </p>
          <h3 className="font-display font-bold text-sm sm:text-lg text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1 sm:mb-2" title={title}>
            {title}
          </h3>
          <p className="text-[10px] sm:text-sm text-gray-500 dark:text-gray-400 mb-2 sm:mb-4 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Miniaturas de Opciones */}
        {variants && variants.filter(v => v.colorName && v.colorName.trim() !== '').length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mb-3 sm:mb-4">
            <div className="flex gap-1 items-center">
              {variants.filter(v => v.colorName && v.colorName.trim() !== '').slice(0, 3).map((variant, index) => (
                <div key={index} className="relative w-4 h-4 sm:w-6 sm:h-6 rounded-full border border-gray-200 dark:border-gray-600 shadow-sm overflow-hidden bg-white" title={variant.colorName}>
                  <Image src={variant.imageUrl || '/placeholder.png'} alt={variant.colorName} fill className="object-cover" sizes="24px" />
                </div>
              ))}
              {variants.filter(v => v.colorName && v.colorName.trim() !== '').length > 3 && (
                <span className="text-[10px] sm:text-xs text-gray-400 font-medium ml-0.5">
                  +{variants.filter(v => v.colorName && v.colorName.trim() !== '').length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Precio y Botón */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-3 sm:pt-4 mt-auto gap-2">
          <div className="flex flex-row xl:flex-col items-center xl:items-start gap-2 xl:gap-0">
            {discount_price ? (
              <>
                <span className="text-sm xl:text-xl font-black text-red-500 order-1 xl:order-2">
                  {formatPrice(discount_price)}
                </span>
                <span className="text-[10px] xl:text-xs text-gray-400 line-through order-2 xl:order-1">
                  {formatPrice(price)}
                </span>
              </>
            ) : (
              <span className="text-sm xl:text-xl font-black text-gray-900 dark:text-white">
                {formatPrice(price)}
              </span>
            )}
          </div>

          <Link
            href={`/catalogo/${slug}`}
            className="w-full xl:w-auto bg-splash-blue hover:bg-[#3ca1d0] text-white px-3 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm hover:shadow-md group/btn"
          >
            <ShoppingCart size={14} className="group-hover/btn:rotate-12 transition-transform" />
            <span className="xl:hidden">Ver</span>
          </Link>
        </div>

        {/* Status de Stock */}
        {!isAvailable && (
          <div className="mt-2 text-center">
            <span className="text-[10px] sm:text-xs bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 sm:px-3 py-1 rounded-full font-bold uppercase tracking-wide">
              Agotado
            </span>
          </div>
        )}
      </div>
    </div>
  );
}