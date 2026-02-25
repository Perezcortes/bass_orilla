'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Send, Phone, Mail, Clock, MapPin } from 'lucide-react';

export default function ContactoPage() {
  const [formData, setFormData] = useState({
    name: '',
    topic: '',
    message: ''
  });

  const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "529531447499"; // Usa el tuyo por defecto

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Armamos el mensaje estructurado
    const text = `*Nuevo Mensaje de Contacto (Web)* 🎣\n\n*Nombre:* ${formData.name}\n*Asunto:* ${formData.topic}\n*Mensaje:* ${formData.message}\n\nMe gustaría recibir más información.`;
    const encodedText = encodeURIComponent(text);

    // Abrimos WhatsApp en una nueva pestaña
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`, '_blank');

    // Limpiamos el formulario
    setFormData({ name: '', topic: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#111110] transition-colors duration-300">

      {/* 1. HERO SECTION CON FONDO PARALLAX RESPONSIVO */}
      <div className="relative py-20 sm:py-32 md:py-48 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">

        {/* Imagen de Fondo Parallax (Responsiva: 'sus.jpeg' en móvil, 'fondo-g.png' en escritorio) */}
        <div
          className="absolute inset-0 z-0 bg-fixed bg-cover bg-center bg-[url('/sus.jpeg')] md:bg-[url('/fondo-g.png')]"
        />

        {/* Overlay ligero para legibilidad sin oscurecer de más */}
        <div className="absolute inset-0 z-0 bg-[#0f1115]/40 dark:bg-black/50" />

        {/* Texto del Hero */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mt-8 sm:mt-12">
          <span className="text-action-yellow font-bold uppercase tracking-widest text-sm mb-4 block drop-shadow-md">
            Estamos para ayudarte
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black text-white uppercase tracking-tight mb-6 drop-shadow-2xl">
            Ponte en Contacto
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 font-medium leading-relaxed drop-shadow-lg max-w-2xl mx-auto">
            ¿Tienes dudas sobre algún equipo, tu envío o nuestros sorteos? Escríbenos y un experto te atenderá personalmente.
          </p>
        </div>
      </div>

      {/* 2. SECCIÓN PRINCIPAL (FORMULARIO E INFO) - TARJETAS FLOTANTES */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* COLUMNA IZQUIERDA: FORMULARIO (OCUPA 2/3 EN DESKTOP) */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl sm:text-3xl font-display font-black text-gray-900 dark:text-white mb-8">
              Envíanos un mensaje directo
            </h2>
            <form onSubmit={handleWhatsAppSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-bold text-gray-700 dark:text-gray-300">Tu Nombre</label>
                  <input
                    id="name"
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej. Bass Orilla"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:border-action-yellow focus:ring-2 focus:ring-action-yellow/50 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="topic" className="text-sm font-bold text-gray-700 dark:text-gray-300">Asunto</label>
                  <select
                    id="topic"
                    required
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:border-action-yellow focus:ring-2 focus:ring-action-yellow/50 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>Selecciona una opción...</option>
                    <option value="Duda sobre un Producto">Duda sobre un producto / stock</option>
                    <option value="Duda sobre Sorteos">Información de Sorteos / Rifas</option>
                    <option value="Seguimiento de Envío">Seguimiento de mi envío</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-bold text-gray-700 dark:text-gray-300">Tu Mensaje</label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Hola, me gustaría saber..."
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-900 dark:text-white focus:border-action-yellow focus:ring-2 focus:ring-action-yellow/50 outline-none transition-all resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 bg-[#25D366] hover:bg-[#1EBE57] text-white rounded-xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-lg shadow-green-500/20 transform hover:-translate-y-1 active:scale-95 ml-auto"
              >
                <Send size={20} /> Iniciar chat en WhatsApp
              </button>
            </form>
          </div>

          {/* COLUMNA DERECHA: INFO DE CONTACTO (OCUPA 1/3 EN DESKTOP) */}
          <div className="lg:col-span-1 space-y-6 sm:space-y-8">
            {/* Tarjeta de Info Rápida */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-6">Otros medios de contacto</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-action-yellow/10 text-action-yellow rounded-full flex items-center justify-center shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Llámanos / WhatsApp</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">+52 614 533 3015</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-action-yellow/10 text-action-yellow rounded-full flex items-center justify-center shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Correo Electrónico</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white break-all">soporte@bassorilla.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-action-yellow/10 text-action-yellow rounded-full flex items-center justify-center shrink-0">
                    <Clock size={22} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Horario de Atención</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">Lunes a Sábado</p>
                    <p className="text-base font-medium text-gray-600 dark:text-gray-300">9:00 am - 7:00 pm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Imagen Decorativa Pequeña (Opcional) */}
            <div className="relative h-48 sm:h-64 w-full rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 hidden lg:block group">
              <Image
                src="/fondo-carretes.png" // Carrete
                alt="BassOrilla Fishing Gear"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <p className="text-white font-medium flex items-center gap-2"><MapPin size={18} className="text-action-yellow" /> Envíos a todo México</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}