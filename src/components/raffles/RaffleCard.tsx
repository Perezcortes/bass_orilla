import Image from 'next/image';
import Link from 'next/link';
import { Ticket, Calendar, TrendingUp } from 'lucide-react';

interface RaffleCardProps {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  date: string;
  image: string;
  soldPercentage: number;
  totalTickets: number;
  soldTickets: number;
  badge?: 'hot' | 'new' | 'ending';
}

export default function RaffleCard({
  id,
  title,
  subtitle,
  price,
  date,
  image,
  soldPercentage,
  totalTickets,
  soldTickets,
  badge,
}: RaffleCardProps) {
  const getBadgeConfig = () => {
    switch (badge) {
      case 'hot':
        return {
          text: '¡Últimos boletos!',
          className: 'bg-red-600 animate-pulse',
        };
      case 'new':
        return {
          text: 'Nuevo',
          className: 'bg-bass-green',
        };
      case 'ending':
        return {
          text: 'Por terminar',
          className: 'bg-orange-500',
        };
      default:
        return null;
    }
  };

  const badgeConfig = getBadgeConfig();

  const getProgressColor = () => {
    if (soldPercentage >= 80) return 'bg-action-yellow';
    if (soldPercentage >= 50) return 'bg-bass-green';
    return 'bg-splash-blue';
  };

  return (
    <div className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-action-yellow/10 border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative h-64 overflow-hidden">
        {badgeConfig && (
          <div
            className={`absolute top-4 right-4 z-10 ${badgeConfig.className} text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide`}
          >
            {badgeConfig.text}
          </div>
        )}
        
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60"></div>
        
        <div className="absolute bottom-4 left-4">
          <h3 className="text-white font-display font-bold text-2xl mb-1">
            {title}
          </h3>
          <p className="text-gray-200 text-sm">{subtitle}</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Precio del boleto
            </span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              ${price.toFixed(2)} MXN
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500 dark:text-gray-400 block">
              Fecha del sorteo
            </span>
            <div className="flex items-center gap-1 text-sm font-semibold text-splash-blue">
              <Calendar size={14} />
              {date}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2 flex justify-between text-xs font-medium">
          <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
            <TrendingUp size={14} />
            {soldPercentage}% Vendido
          </span>
          <span className="text-action-yellow">
            {soldTickets}/{totalTickets}
          </span>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
          <div
            className={`${getProgressColor()} h-2.5 rounded-full transition-all duration-300`}
            style={{ width: `${soldPercentage}%` }}
          ></div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/sorteos/${id}`}
          className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold py-3 px-4 rounded-xl hover:bg-action-yellow hover:text-carbon-black dark:hover:bg-action-yellow transition-all flex items-center justify-center gap-2 group"
        >
          <Ticket className="group-hover:rotate-12 transition-transform" size={20} />
          Comprar Boleto
        </Link>
      </div>
    </div>
  );
}