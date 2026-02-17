'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext'; 
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Search,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  // Obtenemos el usuario y la función de cerrar sesión de Supabase
  const { user, signOut } = useAuth();

  // Referencia para cerrar el dropdown si haces clic fuera
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/sorteos', label: 'Sorteos' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/marcas', label: 'Marcas' },
    { href: '/contacto', label: 'Contacto' },
  ];

  // Helper para obtener iniciales del nombre
  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-bone-white/95 dark:bg-carbon-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO GRANDE --- */}
          <Link href="/" className="flex items-center gap-3 group z-50">
            <div className="relative h-16 w-16 md:h-24 md:w-24 -my-4 transition-transform duration-300 group-hover:scale-110 filter drop-shadow-lg">
              <Image
                src="/logo-bass.png"
                alt="BassOrilla Logo"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 64px, 96px"
                priority
              />
            </div>
            
            <div className="hidden md:block">
              <h1 className="font-display font-black text-2xl lg:text-3xl tracking-tight text-carbon-black dark:text-bone-white leading-none">
                Bass<span className="text-action-yellow">Orilla</span>
              </h1>
              <span className="text-[10px] lg:text-xs font-bold text-action-yellow tracking-widest uppercase block mt-0.5">
                Rifas y Sorteos
              </span>
            </div>
          </Link>

          {/* --- MENÚ DE ESCRITORIO --- */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-sm lg:text-base text-gray-700 dark:text-gray-300 hover:text-action-yellow dark:hover:text-action-yellow transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-action-yellow transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* --- ICONOS Y ACCIONES --- */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            
            {/* Search - Desktop only */}
            <button className="hidden sm:flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
              <Search size={20} />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Cambiar tema"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* --- LÓGICA DE USUARIO (SUPABASE) --- */}
            {user ? (
              // SI ESTÁ LOGUEADO
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1 pr-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition focus:outline-none focus:ring-2 focus:ring-action-yellow"
                >
                  {/* Avatar Generado con Iniciales */}
                  <div className="w-8 h-8 rounded-full bg-bass-green flex items-center justify-center text-white font-bold text-xs shadow-sm">
                    {getInitials(user.user_metadata?.full_name)}
                  </div>
                  {/* Flechita pequeña */}
                  <ChevronDown size={14} className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#252525] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 py-2 animate-fade-in-up origin-top-right z-50">
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {user.user_metadata?.full_name || 'Usuario'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    
                    <div className="py-1">
                      {user.user_metadata?.role === 'admin' ? (
                        <Link 
                          href="/dashboard" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <LayoutDashboard size={16} className="mr-3 text-action-yellow" /> 
                          Panel Admin
                        </Link>
                      ) : (
                        <Link 
                          href="/perfil" 
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                        >
                          <User size={16} className="mr-3 text-action-yellow" /> 
                          Mi Perfil
                        </Link>
                      )}
                      
                      <Link 
                        href="/configuracion" 
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                      >
                        <Settings size={16} className="mr-3 text-gray-400" /> 
                        Configuración
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                      <button 
                        onClick={handleSignOut}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut size={16} className="mr-3" /> 
                        Cerrar Sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // SI NO ESTÁ LOGUEADO
              <Link
                href="/login"
                className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-action-yellow transition-colors py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
              >
                <User size={20} />
                <span className="hidden lg:inline">Entrar</span>
              </Link>
            )}

            {/* Cart */}
            <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors group">
              <ShoppingCart size={20} />
              <span className="absolute top-0 right-0 h-4 w-4 bg-action-yellow rounded-full text-[10px] font-bold text-carbon-black flex items-center justify-center transform translate-x-1 -translate-y-1">
                0
              </span>
            </button>

            {/* CTA Button */}
            <Link
              href="/sorteos"
              className="hidden md:flex bg-action-yellow hover:bg-yellow-500 text-carbon-black px-6 py-2 rounded-full font-bold text-sm transition-all hover:scale-105 shadow-lg shadow-action-yellow/20"
            >
              Participar
            </Link>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800 text-carbon-black dark:text-bone-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* --- MENÚ MÓVIL --- */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 animate-fade-in-up bg-bone-white dark:bg-carbon-black absolute left-0 right-0 shadow-xl z-40 px-4">
            {/* Si está logueado en móvil mostramos info extra */}
            {user && (
               <div className="mb-4 p-4 bg-gray-100 dark:bg-white/5 rounded-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bass-green flex items-center justify-center text-white font-bold text-sm">
                    {getInitials(user.user_metadata?.full_name)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="font-bold text-gray-900 dark:text-white truncate">{user.user_metadata?.full_name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
               </div>
            )}

            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-action-yellow transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              
              {/* Enlaces específicos de móvil para auth */}
              {user ? (
                 <>
                    <Link
                      href={user.user_metadata?.role === 'admin' ? "/dashboard" : "/perfil"}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {user.user_metadata?.role === 'admin' ? "Panel Admin" : "Mi Perfil"}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left block px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                    >
                      Cerrar Sesión
                    </button>
                 </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              )}

              <div className="pt-4">
                <Link
                  href="/sorteos"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-action-yellow hover:bg-yellow-500 text-carbon-black py-3 rounded-lg font-bold text-center transition-all shadow-md"
                >
                  Participar Ahora
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}