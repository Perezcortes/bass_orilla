'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
  url: string;
  className?: string;
  showText?: boolean;
}

export default function ShareButton({ title, text, url, className = '', showText = true }: ShareButtonProps) {
  const handleShare = async () => {
    // Verificamos si el navegador soporta el menú nativo de compartir (casi todos los celulares lo hacen)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: text,
          url: url,
        });
      } catch (error) {
        console.log('Error compartiendo:', error);
      }
    } else {
      // Si está en una PC vieja que no lo soporta, le copiamos el link al portapapeles
      navigator.clipboard.writeText(url);
      alert('¡Enlace copiado al portapapeles! Ya puedes pegarlo donde quieras.');
    }
  };

  return (
    <button 
      onClick={handleShare} 
      className={`flex items-center justify-center gap-2 font-bold transition-all ${className}`}
    >
      <Share2 size={18} />
      {showText && 'Compartir'}
    </button>
  );
}