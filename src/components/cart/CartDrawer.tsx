'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingCart, MessageCircle, AlertCircle, ChevronRight } from 'lucide-react';

export default function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [showWarning, setShowWarning] = useState(false);

  if (!isCartOpen) return null;

  const formatPrice = (amount: number) => {
    const fixedAmount = amount.toFixed(2);
    const [integerPart, decimalPart] = fixedAmount.split('.');
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return amount < 1000 ? `$ ${amount.toFixed(2)}` : `$ ${formattedInteger}`;
  };

  // Generador inteligente del mensaje de WhatsApp
  const handleWhatsAppCheckout = () => {
    const WHATSAPP_NUMBER = "529531447499";
    
    let text = `Hola BassOrilla, me interesa concretar este pedido:\n\n`;
    
    items.forEach((item, index) => {
      text += `*${index + 1}. ${item.title}*\n`;
      if (item.color) text += `   Color: ${item.color}\n`;
      if (item.manivela) text += `   Manivela: ${item.manivela}\n`;
      if (item.size) text += `   Talla/Medida: ${item.size}\n`;
      text += `   Cantidad: ${item.quantity} x ${formatPrice(item.price)}\n`;
      text += `   Link: https://bass-orilla.vercel.app/catalogo/${item.slug}\n\n`;
    });

    text += `*TOTAL ESTIMADO: ${formatPrice(totalPrice)}*\n\n`;
    text += `¿Me pueden confirmar existencias y opciones de envío por favor?`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');
    setShowWarning(false);
  };

  return (
    <>
      {/* Fondo oscuro transparente */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Panel del Carrito (Derecha) */}
      <div className="fixed inset-y-0 right-0 z-[70] w-full sm:w-[450px] bg-white dark:bg-[#111110] shadow-2xl flex flex-col animate-slide-in-right">
        
        {/* Cabecera */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-display font-black text-gray-900 dark:text-white flex items-center gap-2">
            <ShoppingCart className="text-action-yellow" /> Mi Equipo
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Lista de Productos */}
        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
              <ShoppingCart size={64} className="text-gray-300 dark:text-gray-700" />
              <p className="text-gray-500 font-medium">Tu caja de pesca está vacía.</p>
              <button onClick={() => setIsCartOpen(false)} className="text-action-yellow font-bold underline">Volver al catálogo</button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.cartId} className="flex gap-4 bg-gray-50 dark:bg-[#1A1A1A] p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                  <div className="relative w-20 h-20 bg-white rounded-lg border border-gray-200 dark:border-gray-700 shrink-0 overflow-hidden p-1">
                    <Image src={item.image} alt={item.title} fill className="object-contain p-1" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">{item.title}</h3>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 space-y-0.5">
                        {item.color && <p>Color: {item.color}</p>}
                        {item.manivela && <p>Manivela: {item.manivela}</p>}
                        {item.size && <p>Medida: {item.size}</p>}
                      </div>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <span className="font-black text-sm text-action-yellow">{formatPrice(item.price * item.quantity)}</span>
                      <div className="flex items-center bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden h-8">
                        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="px-2 text-gray-500 hover:text-action-yellow"><Minus size={14} /></button>
                        <span className="w-6 text-center text-xs font-bold text-gray-900 dark:text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="px-2 text-gray-500 hover:text-action-yellow"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.cartId)} className="text-gray-400 hover:text-red-500 transition-colors h-fit p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer y Checkouts */}
        {items.length > 0 && (
          <div className="p-5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-[#1A1A1A]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Subtotal</span>
              <span className="text-2xl font-display font-black text-gray-900 dark:text-white">{formatPrice(totalPrice)}</span>
            </div>
            <button 
              onClick={() => setShowWarning(true)}
              className="w-full bg-action-yellow hover:bg-yellow-400 text-carbon-black font-bold py-4 rounded-xl shadow-lg transition-transform transform active:scale-95 flex items-center justify-center gap-2"
            >
              Hacer Pedido <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* === MODAL DE AVISO WHATSAPP === */}
      {showWarning && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up p-6 text-center border border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle size={32} />
            </div>
            <h3 className="text-2xl font-display font-black text-gray-900 dark:text-white mb-2">¡Casi listo!</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3 mb-8">
              <p>Para brindarte una <b>atención 100% personalizada</b> y confirmar existencias y costos de envío exactos a tu código postal...</p>
              <div className="bg-gray-50 dark:bg-black p-3 rounded-lg flex gap-2 text-left border border-gray-200 dark:border-gray-800">
                 <AlertCircle size={20} className="text-action-yellow shrink-0" />
                 <p className="text-xs">Te redirigiremos a WhatsApp donde nuestro equipo procesará tu pago de forma segura y coordinará el envío. 🎣</p>
              </div>
            </div>
            
            <div className="flex gap-3 flex-col sm:flex-row">
              <button onClick={() => setShowWarning(false)} className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 transition-colors">
                Regresar al carrito
              </button>
              <button onClick={handleWhatsAppCheckout} className="flex-[2] px-4 py-3 bg-[#25D366] hover:bg-[#1EBE57] text-white rounded-xl text-sm font-bold transition-colors shadow-lg flex justify-center items-center gap-2">
                <MessageCircle size={18} /> Enviar a WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}