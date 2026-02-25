'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Truck, CreditCard, Package, Ticket, 
  ChevronDown, MessageCircle, HelpCircle 
} from 'lucide-react';

// === DATOS DE LAS PREGUNTAS FRECUENTES ===
const faqsData = [
  {
    id: 'envios',
    label: 'Envíos y Entregas',
    icon: Truck,
    questions: [
      {
        q: '¿Hacen envíos a todo México?',
        a: 'Sí, realizamos envíos a toda la República Mexicana. Trabajamos con paqueterías seguras para garantizar que tu equipo (especialmente cañas) llegue en perfectas condiciones.'
      },
      {
        q: '¿Cuánto cuesta el envío?',
        a: 'El costo del envío depende de tu código postal y del volumen del paquete (las cañas suelen requerir tubos especiales de PVC). Al enviarnos tu pedido por WhatsApp, te cotizaremos el envío exacto antes de que pagues.'
      },
      {
        q: '¿Cuánto tiempo tarda en llegar mi pedido?',
        a: 'Por lo general, los envíos estándar tardan de 3 a 5 días hábiles después de confirmado tu pago. Si estás en una zona extendida, podría demorar un par de días más.'
      }
    ]
  },
  {
    id: 'pagos',
    label: 'Pagos y Compras',
    icon: CreditCard,
    questions: [
      {
        q: '¿Qué métodos de pago aceptan?',
        a: 'Actualmente aceptamos Transferencia Interbancaria (SPEI), depósitos en tiendas OXXO, y pago en efectivo únicamente si la entrega es personal en nuestra localidad.'
      },
      {
        q: '¿Es seguro comprar por WhatsApp?',
        a: 'Totalmente. Nuestro sistema web organiza tu pedido, pero la venta se cierra directamente con nosotros por WhatsApp. Esto nos permite darte una atención 100% humana, confirmar existencias en tiempo real y enviarte fotos de tu paquete antes de enviarlo.'
      }
    ]
  },
  {
    id: 'productos',
    label: 'Productos y Stock',
    icon: Package,
    questions: [
      {
        q: '¿Qué pasa si un producto dice "Agotado"?',
        a: 'Si un señuelo o carrete está agotado, puedes mandarnos un mensaje. Constantemente resurtimos inventario e incluso podemos hacer pedidos especiales a nuestros proveedores si buscas un modelo en específico.'
      },
      {
        q: '¿Todos los productos son originales?',
        a: 'Sí, en BassOrilla somos pescadores y sabemos lo importante que es la calidad. Todos nuestros productos de marcas como Shimano, Rapala, Strike King, etc., son 100% originales.'
      }
    ]
  },
  {
    id: 'sorteos',
    label: 'Sorteos y Rifas',
    icon: Ticket,
    questions: [
      {
        q: '¿Cómo funcionan los sorteos?',
        a: 'Periódicamente organizamos rifas de combos premium o paquetes de señuelos. Puedes comprar tus boletos directamente en la sección "Sorteos" de la página. Los ganadores se eligen de forma transparente mediante la loteria nacional en vivo.'
      },
      {
        q: '¿Si gano un sorteo, el envío está incluido?',
        a: 'No, el envío del premio corre por tu cuenta a cualquier parte de México, a menos que las bases del sorteo especifiquen lo contrario.'
      }
    ]
  }
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState(faqsData[0].id);
  const [openQuestionIndex, setOpenQuestionIndex] = useState<number | null>(0); // La primera abierta por defecto

  const handleToggle = (index: number) => {
    setOpenQuestionIndex(openQuestionIndex === index ? null : index);
  };

  const currentCategoryData = faqsData.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111110] transition-colors duration-300 py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabecera */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="w-16 h-16 bg-action-yellow/10 text-action-yellow rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Resolvemos tus dudas al instante. Selecciona una categoría para encontrar la información que necesitas sobre tus compras en BassOrilla.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Menú de Categorías (Sidebar en Desktop / Tabs tipo píldora en Móvil) */}
          <div className="w-full lg:w-1/4 shrink-0">
            {/* lg:sticky evita que estorbe en celular, flex-wrap acomoda los botones automáticamente */}
            <div className="flex flex-wrap lg:flex-col gap-2 pb-6 lg:pb-0 lg:sticky lg:top-24">
              {faqsData.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setOpenQuestionIndex(0); // Abre la primera pregunta al cambiar
                    }}
                    className={`flex-grow lg:flex-grow-0 flex items-center justify-center lg:justify-start gap-2 px-3 sm:px-5 py-3 sm:py-4 rounded-xl font-bold text-[13px] sm:text-base transition-all duration-300 ${
                      isActive 
                        ? 'bg-[#2d5a27] text-white shadow-md lg:transform lg:translate-x-2' 
                        : 'bg-white dark:bg-[#1A1A1A] text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#252525] border border-gray-100 dark:border-gray-800'
                    }`}
                  >
                    <Icon size={18} className={`shrink-0 ${isActive ? 'text-action-yellow' : 'text-gray-400'}`} />
                    <span className="whitespace-nowrap sm:whitespace-normal">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Área de Preguntas (Acordeón) */}
          <div className="w-full lg:w-3/4">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              {currentCategoryData?.questions.map((faq, index) => {
                const isOpen = openQuestionIndex === index;
                return (
                  <div 
                    key={index} 
                    className="border-b border-gray-100 dark:border-gray-800/50 last:border-0"
                  >
                    <button
                      onClick={() => handleToggle(index)}
                      className="w-full flex items-center justify-between p-5 sm:p-6 text-left focus:outline-none group"
                    >
                      <h3 className={`font-bold text-base sm:text-lg pr-4 transition-colors ${isOpen ? 'text-[#2d5a27] dark:text-action-yellow' : 'text-gray-900 dark:text-white group-hover:text-[#2d5a27] dark:group-hover:text-action-yellow'}`}>
                        {faq.q}
                      </h3>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-[#2d5a27] text-white rotate-180' : 'bg-gray-100 dark:bg-[#252525] text-gray-500'}`}>
                        <ChevronDown size={18} />
                      </div>
                    </button>
                    
                    {/* Animación del contenido usando Grid */}
                    <div 
                      className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                    >
                      <div className="overflow-hidden">
                        <div className="px-5 sm:px-6 pb-6 text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed">
                          {faq.a}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Final */}
            <div className="mt-8 bg-action-yellow/10 dark:bg-action-yellow/5 border border-action-yellow/20 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <h4 className="font-display font-bold text-xl text-gray-900 dark:text-white mb-2">¿No encontraste tu respuesta?</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Nuestro equipo de soporte está listo para ayudarte directamente.</p>
              </div>
              <Link 
                href="/contacto"
                className="shrink-0 px-6 py-3 bg-[#2d5a27] hover:bg-[#1e3c1a] text-white rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <MessageCircle size={18} /> Contáctanos
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}