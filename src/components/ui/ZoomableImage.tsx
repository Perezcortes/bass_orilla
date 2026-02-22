// src/components/ui/ZoomableImage.tsx

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
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div 
      ref={imageContainerRef}
      // AQUÍ: Cambiamos bg-black por bg-white para que combine con tus fotos JPG
      className="relative w-full h-full overflow-hidden cursor-crosshair bg-white" 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
    >
      <Image 
        src={src} 
        alt={alt} 
        fill 
        priority
        className={`object-contain transition-transform duration-200 ease-out ${isHovering ? 'scale-[2.5] opacity-100' : 'scale-100 opacity-100'}`}
        style={{
          transformOrigin: isHovering ? `${position.x}% ${position.y}%` : 'center center'
        }}
      />
    </div>
  );
}