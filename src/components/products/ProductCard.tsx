import Image from 'next/image';
import Link from 'next/link';
import { Star, Eye, Heart, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  colors: string[];
  badge?: 'best-seller' | 'sale' | 'new' | 'raffle';
  rating?: number;
  inStock?: boolean;
}

export default function ProductCard({
  id,
  name,
  brand,
  description,
  price,
  originalPrice,
  image,
  colors,
  badge,
  rating = 4.5,
  inStock = true,
}: ProductCardProps) {
  const getBadgeConfig = () => {
    switch (badge) {
      case 'best-seller':
        return {
          text: 'Best Seller',
          className: 'bg-action-yellow text-carbon-black',
        };
      case 'sale':
        return {
          text: 'Sale',
          className: 'bg-red-500 text-white',
        };
      case 'new':
        return {
          text: 'New',
          className: 'bg-bass-green text-white',
        };
      case 'raffle':
        return {
          text: 'Win This!',
          className: 'bg-black/50 backdrop-blur-md text-white border border-white/20',
        };
      default:
        return null;
    }
  };

  const badgeConfig = getBadgeConfig();

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800">
        {badgeConfig && (
          <span
            className={`absolute top-3 left-3 z-10 ${badgeConfig.className} text-xs font-black px-2 py-1 rounded uppercase tracking-wider`}
          >
            {badgeConfig.text}
          </span>
        )}

        <Image
          src={image}
          alt={name}
          fill
          className="object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white py-2 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-50 dark:hover:bg-gray-600 flex justify-center items-center gap-2 transition-colors">
              <Eye size={16} />
              Vista Rápida
            </button>
            <button className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2 rounded-lg shadow-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-gray-600 transition-colors">
              <Heart size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
              {brand}
            </p>
            <h3 className="font-display font-bold text-lg text-gray-900 dark:text-white leading-tight line-clamp-1">
              {name}
            </h3>
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
          {description}
        </p>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center text-action-yellow">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(rating) ? 'fill-current' : ''}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({rating})
            </span>
          </div>
        )}

        {/* Colors */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-semibold text-gray-400 uppercase">
            Colores:
          </span>
          <div className="flex gap-1.5">
            {colors.slice(0, 4).map((color, index) => (
              <div
                key={index}
                className="w-5 h-5 rounded-full border-2 border-white dark:border-gray-600 shadow-sm cursor-pointer hover:scale-110 transition-transform"
                style={{ backgroundColor: color }}
              />
            ))}
            {colors.length > 4 && (
              <span className="text-xs text-gray-400 ml-1">
                +{colors.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                ${originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xl font-black text-bass-green dark:text-action-yellow">
              ${price.toFixed(2)}
            </span>
          </div>

          <Link
            href={`/catalogo/${id}`}
            className="bg-bass-green hover:bg-bass-green/90 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg group/btn"
          >
            <ShoppingCart
              size={16}
              className="group-hover/btn:rotate-12 transition-transform"
            />
            Ver Detalles
          </Link>
        </div>

        {/* Stock Status */}
        {!inStock && (
          <div className="mt-3 text-center">
            <span className="text-xs text-red-500 dark:text-red-400 font-semibold">
              Agotado
            </span>
          </div>
        )}
      </div>
    </div>
  );
}