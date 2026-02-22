import Image from 'next/image';
import Link from 'next/link';
import { Ticket, Calendar, Megaphone, ArrowRight, MessageCircle } from 'lucide-react';
import ShareButton from '@/components/ui/ShareButton'; // <-- Importamos nuestro nuevo botón

export interface RaffleCardProps {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  image: string;
  type: 'anuncio' | 'sorteo';
  slug: string;
}

export default function RaffleCard({ title, subtitle, date, image, type, slug }: RaffleCardProps) {
  const WHATSAPP_NUMBER = "529531447499";
  const DOMINIO = "https://bassorilla.com"; // Recuerda cambiarlo cuando tengas tu dominio final
  const linkPublicacion = `${DOMINIO}/publicaciones/${slug}`;

  const mensajeFormateado = encodeURIComponent(
    `Hola, vi este sorteo en su página web:\n\n${linkPublicacion}\n\nMe gustaría pedir más información.`
  );

  return (
    <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group border border-gray-100 dark:border-gray-800 flex flex-col h-full">
      <div className="relative h-56 w-full overflow-hidden bg-gray-100 dark:bg-black">
        <Image src={image} alt={title} fill className="object-contain group-hover:scale-105 transition-transform duration-500" />
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

        {/* --- NUEVA ÁREA DE BOTONES --- */}
        <div className="flex flex-col gap-2 mt-auto">
          <Link 
            href={`/publicaciones/${slug}`}
            className="w-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-900 dark:text-white text-center py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 group/btn"
          >
            Ver Detalles <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
          </Link>

          <div className="flex gap-2">
            {type === 'sorteo' ? (
              <>
                <a 
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajeFormateado}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white text-center py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
                <ShareButton 
                  title={title} text={subtitle} url={linkPublicacion} showText={false}
                  className="w-12 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white rounded-xl" 
                />
              </>
            ) : (
              <ShareButton 
                title={title} text={subtitle} url={linkPublicacion} 
                className="w-full bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white py-3 rounded-xl" 
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}