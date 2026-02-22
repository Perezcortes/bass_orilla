'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Megaphone, 
  Menu, 
  X, 
  LogOut,
  Globe
} from 'lucide-react';

export default function AdminLayoutClient({ 
  children, 
  userName 
}: { 
  children: React.ReactNode;
  userName: string;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const menuItems = [
    { name: 'Resumen', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Usuarios', href: '/dashboard/usuarios', icon: Users },
    { name: 'Catálogo', href: '/dashboard/catalogo', icon: ShoppingBag },
    { name: 'Publicidad', href: '/dashboard/publicidad', icon: Megaphone },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] flex font-sans">
      
      {/* OVERLAY PARA MÓVIL */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR (Menú Lateral) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1A1A1A] border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static md:flex-shrink-0
      `}>
        
        {/* HEADER DEL SIDEBAR (Solo Logo y Título) */}
        <div className="flex flex-col items-center pt-8 pb-6 border-b border-gray-200 dark:border-gray-800 relative">
          
          <button 
            className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>

          <div className="relative w-24 h-24 mb-3">
             <Image 
               src="/logo-bass.png" 
               alt="BassOrilla Logo" 
               fill 
               className="object-contain"
             />
          </div>
          
          <span className="font-display font-black text-2xl text-gray-900 dark:text-white tracking-tight">
            Admin-Bass<span className="text-action-yellow">Orilla</span>
          </span>
        </div>

        {/* LINKS DE NAVEGACIÓN */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold transition-all duration-200
                  ${isActive 
                    ? 'bg-action-yellow text-[#1A1A1A] shadow-sm' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }
                `}
              >
                <Icon size={18} className={isActive ? 'text-[#1A1A1A]' : 'opacity-70'} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER DEL SIDEBAR (Volver a la tienda web) */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Globe size={18} className="opacity-70" />
            Ir a Tienda Web
          </Link>
        </div>
      </aside>

      {/* ÁREA DE CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOPBAR / NAVBAR SUPERIOR */}
        <header className="h-16 bg-white dark:bg-[#1A1A1A] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-8 shrink-0 z-30">
          
          {/* Lado Izquierdo: Botón Hamburguesa (solo en móvil) */}
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 -ml-2 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none transition-colors"
            >
              <Menu size={24} />
            </button>
            <span className="ml-2 md:hidden font-display font-black text-lg text-gray-900 dark:text-white">
              Panel
            </span>
          </div>

          {/* Lado Derecho: Perfil de Usuario y Cerrar Sesión */}
          <div className="flex items-center gap-4 md:gap-6">
            
            {/* Información del Usuario */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">
                  Bienvenido
                </p>
                <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">
                  {userName}
                </p>
              </div>
              
              {/* Avatar (Inicial del nombre) */}
              <div className="w-9 h-9 rounded-full bg-action-yellow text-[#1A1A1A] flex items-center justify-center font-bold text-sm shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Divisor vertical */}
            <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>

            {/* Botón de Cerrar Sesión */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors p-2"
              title="Cerrar Sesión"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Salir</span>
            </button>

          </div>
        </header>

        {/* INYECCIÓN DE MÓDULOS (Contenido) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
        
      </main>
    </div>
  );
}