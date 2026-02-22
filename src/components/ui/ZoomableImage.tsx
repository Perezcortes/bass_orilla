'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

interface ZoomableImageProps {
  src: string;
  alt: string;
}

export default function ZoomableImage({ src, alt }: ZoomableImageProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;

    // Obtenemos las dimensiones y posición del contenedor
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    
    // Calculamos el porcentaje exacto donde está el cursor dentro de la imagen
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setPosition({ x, y });
  };

  return (
    <div 
      ref={imageContainerRef}
      className="relative w-full h-full overflow-hidden cursor-crosshair bg-black"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <Image 
        src={src} 
        alt={alt} 
        fill 
        priority
        // AQUÍ ESTÁ EL CAMBIO: Usamos 'object-contain' en lugar de 'object-cover'
        className={`object-contain transition-transform duration-200 ease-out ${isHovering ? 'scale-[2] opacity-100' : 'scale-100 opacity-90'}`}
        style={{
          // Mueve el centro del zoom exactamente a las coordenadas del ratón
          transformOrigin: isHovering ? `${position.x}% ${position.y}%` : 'center center'
        }}
      />
    </div>
  );
}