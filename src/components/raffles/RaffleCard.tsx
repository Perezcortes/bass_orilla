import Image from 'next/image';
import Link from 'next/link';
import { Ticket, Calendar, Megaphone, ArrowRight } from 'lucide-react';

export interface RaffleCardProps {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  type: 'anuncio' | 'sorteo';
  slug: string; // Recibimos el slug
}

export default function RaffleCard({ title, subtitle, date, image, type, slug }: RaffleCardProps) {
  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-800 flex flex-col">
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-black">
        <Image src={image} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-4 left-4 flex gap-2">
          {type === 'sorteo' ? (
            <div className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Ticket size={12} className="text-action-yellow" /> Sorteo
            </div>
          ) : (
            <div className="bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Megaphone size={12} /> Anuncio
            </div>
          )}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-xl font-display font-black text-gray-900 dark:text-white mb-1 line-clamp-1">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{subtitle}</p>
          <div className="flex items-center gap-2 text-xs font-medium text-gray-400 bg-gray-50 dark:bg-white/5 w-fit px-3 py-1.5 rounded-lg mb-6">
            <Calendar size={14} /> {date}
          </div>
        </div>

        {/* Botón que lleva a la URL amigable */}
        <Link 
          href={`/publicaciones/${slug}`}
          className="w-full bg-gray-100 dark:bg-white/5 hover:bg-action-yellow hover:text-[#1A1A1A] text-gray-900 dark:text-white text-center py-3.5 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn"
        >
          Ver Detalles <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}