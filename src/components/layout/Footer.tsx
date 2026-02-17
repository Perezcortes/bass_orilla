import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Navegación',
      links: [
        { label: 'Inicio', href: '/' },
        { label: 'Sorteos Activos', href: '/sorteos' },
        { label: 'Catálogo', href: '/catalogo' },
        { label: 'Ganadores Anteriores', href: '/ganadores' },
      ],
    },
    {
      title: 'Soporte',
      links: [
        { label: 'Preguntas Frecuentes', href: '/faq' },
        { label: 'Términos y Condiciones', href: '/terminos' },
        { label: 'Política de Privacidad', href: '/privacidad' },
        { label: 'Contacto', href: '/contacto' },
      ],
    },
  ];

  return (
    <footer className="bg-[#111110] text-white pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* 1. Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block relative w-24 h-24 mb-2">
               <Image 
                 src="/logo-bass.png" 
                 alt="BassOrilla Logo" 
                 fill 
                 className="object-contain"
               />
            </Link>
            
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              La plataforma líder en rifas y sorteos de pesca deportiva en México. 
              Llevamos el mejor equipo a tus manos con total seguridad y confianza.
            </p>

            <div className="flex gap-4 pt-2">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:bg-action-yellow hover:border-action-yellow hover:text-carbon-black transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook size={18} className="group-hover:scale-110 transition-transform" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800/50 border border-gray-700 flex items-center justify-center hover:bg-action-yellow hover:border-action-yellow hover:text-carbon-black transition-all duration-300 group"
                aria-label="Instagram"
              >
                <Instagram size={18} className="group-hover:scale-110 transition-transform" />
              </a>
            </div>
          </div>

          {/* 2. Navigation Sections (Map) */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-display font-bold text-lg text-white mb-6 relative inline-block">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-8 h-1 bg-action-yellow/50 rounded-full"></span>
              </h4>
              <ul className="space-y-4 text-sm">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-action-yellow hover:translate-x-1 transition-all inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* 3. Contact Section */}
          <div>
            <h4 className="font-display font-bold text-lg text-white mb-6 relative inline-block">
              Contacto
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-action-yellow/50 rounded-full"></span>
            </h4>
            <ul className="space-y-5 text-sm text-gray-400">
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded bg-gray-800 text-action-yellow group-hover:bg-action-yellow group-hover:text-black transition-colors">
                  <Mail size={14} />
                </div>
                <span className="group-hover:text-gray-200 transition-colors">contacto@bassorilla.com</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded bg-gray-800 text-action-yellow group-hover:bg-action-yellow group-hover:text-black transition-colors">
                  <Phone size={14} />
                </div>
                <span className="group-hover:text-gray-200 transition-colors">+52 614 533 3015</span>
              </li>
              <li className="flex items-start gap-3 group">
                <div className="mt-1 p-1.5 rounded bg-gray-800 text-action-yellow group-hover:bg-action-yellow group-hover:text-black transition-colors">
                  <MapPin size={14} />
                </div>
                <span className="group-hover:text-gray-200 transition-colors">Chihuahua, Chih, México</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © {currentYear} BassOrilla Inc. Todos los derechos reservados.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-gray-600 text-[12px] font-bold uppercase tracking-widest hidden sm:block">
              Pagos Seguros
            </span>
            
            {/* AQUÍ ESTÁN TUS IMÁGENES DE PAGOS */}
            <div className="flex gap-3 items-center">
               {/* Visa */}
               <div className="relative h-8 w-12 bg-white rounded shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                  <Image src="/pagos/visa.png" alt="Visa" fill className="object-contain p-1" />
               </div>
               
               {/* MasterCard */}
               <div className="relative h-8 w-12 bg-white rounded shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                  <Image src="/pagos/MasterCard.jpg" alt="MasterCard" fill className="object-contain p-0.5" />
               </div>
               
               {/* Mercado Pago */}
               <div className="relative h-8 w-12 bg-white rounded shadow-sm overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
                  <Image src="/pagos/Mercado_Pago.png" alt="Mercado Pago" fill className="object-contain p-1" />
               </div>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}