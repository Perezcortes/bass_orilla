'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/utils/supabase/client'; // <-- Necesario para actualizar el perfil
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
  ChevronDown,
  Save,
  CheckCircle
} from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // === ESTADOS PARA EL MODAL DE PERFIL ===
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const { setIsCartOpen, totalItems } = useCart();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sincronizar el nombre del formulario cuando el usuario carga
  useEffect(() => {
    if (user) {
      setEditName(user.user_metadata?.full_name || '');
    }
  }, [user]);

  // Cerrar dropdown al dar clic afuera
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
    { href: '/publicaciones', label: 'Sorteos' },
    { href: '/catalogo', label: 'Catálogo' },
    { href: '/marcas', label: 'Marcas' },
    { href: '/contacto', label: 'Contacto' },
  ];

  const getInitials = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  // === FUNCIÓN PARA ACTUALIZAR PERFIL ===
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsUpdating(true);
    setUpdateMsg(null);
    const supabase = createClient();

    try {
      // 1. Actualizamos la metadata de Auth
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: editName }
      });
      if (authError) throw authError;

      // 2. Actualizamos la tabla de perfiles (profiles)
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ full_name: editName })
        .eq('id', user.id);
      if (dbError) throw dbError;

      setUpdateMsg({ type: 'success', text: 'Perfil actualizado correctamente.' });
      
      // Cerramos el modal después de 2 segundos
      setTimeout(() => {
        setShowProfileModal(false);
        setUpdateMsg(null);
      }, 2000);

    } catch (error) {
      console.error(error);
      setUpdateMsg({ type: 'error', text: 'Hubo un error al actualizar tu perfil.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-bone-white/95 dark:bg-carbon-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm transition-colors duration-300">
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
                  Rifas y Articulos
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
              <button className="hidden sm:flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                <Search size={20} />
              </button>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* User Auth */}
              {user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-1 pr-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2d5a27] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                      {getInitials(user.user_metadata?.full_name)}
                    </div>
                    <ChevronDown size={14} className={`text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#1A1A1A] rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 py-2 animate-fade-in-up origin-top-right z-50">
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                          {user.user_metadata?.full_name || 'Usuario'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono mt-0.5">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1 border-b border-gray-100 dark:border-gray-800">
                        {/* OPCIÓN ADMIN */}
                        {user.user_metadata?.role === 'admin' && (
                          <Link href="/dashboard" onClick={() => setIsProfileOpen(false)} className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                            <LayoutDashboard size={16} className="mr-3 text-action-yellow" /> Panel Admin
                          </Link>
                        )}
                        
                        {/* OPCIÓN MI PERFIL (Para todos) */}
                        <button 
                          onClick={() => {
                            setIsProfileOpen(false);
                            setShowProfileModal(true);
                          }} 
                          className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          <User size={16} className="mr-3 text-action-yellow" /> Mi Perfil
                        </button>
                      </div>

                      <div className="pt-1">
                        <button onClick={handleSignOut} className="w-full text-left flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                          <LogOut size={16} className="mr-3" /> Cerrar Sesión
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/login" className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-action-yellow py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5">
                  <User size={20} />
                  <span className="hidden lg:inline">Entrar</span>
                </Link>
              )}

              {/* --- BOTÓN DEL CARRITO --- */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors group"
              >
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 bg-action-yellow rounded-full text-[10px] font-bold text-carbon-black flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {totalItems}
                  </span>
                )}
              </button>

              <Link href="/publicaciones" className="hidden md:flex bg-action-yellow hover:bg-yellow-500 text-carbon-black px-6 py-2 rounded-full font-bold text-sm shadow-lg">
                Participar
              </Link>

              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg text-carbon-black dark:text-bone-white">
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* --- MENÚ MÓVIL --- */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800 absolute left-0 right-0 bg-bone-white dark:bg-carbon-black shadow-xl z-40 px-4">
              {user && (
                <div className="mb-4 p-4 bg-gray-100 dark:bg-[#1A1A1A] rounded-xl flex items-center gap-3 border border-gray-200 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-[#2d5a27] flex items-center justify-center text-white font-bold text-sm">
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
                  <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                    {link.label}
                  </Link>
                ))}
                
                {user ? (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
                    {user.user_metadata?.role === 'admin' && (
                      <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                        <LayoutDashboard size={18} className="mr-3 text-action-yellow" /> Panel Admin
                      </Link>
                    )}
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false);
                        setShowProfileModal(true);
                      }} 
                      className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <User size={18} className="mr-3 text-action-yellow" /> Mi Perfil
                    </button>
                    <button onClick={handleSignOut} className="w-full flex items-center px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10">
                      <LogOut size={18} className="mr-3" /> Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)} className="flex items-center px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <User size={18} className="mr-3" /> Iniciar Sesión
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* === MODAL DE ACTUALIZACIÓN DE PERFIL === */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-[#1A1A1A] w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative animate-fade-in-up border border-gray-100 dark:border-gray-800">
            
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-display font-bold text-xl text-gray-900 dark:text-white flex items-center gap-2">
                <User className="text-action-yellow" size={24} /> Mi Perfil
              </h3>
              <button 
                onClick={() => setShowProfileModal(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              
              {updateMsg && (
                <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${updateMsg.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                  {updateMsg.type === 'success' && <CheckCircle size={16} />}
                  {updateMsg.text}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Correo Electrónico</label>
                <input 
                  type="email" 
                  value={user?.email || ''} 
                  disabled 
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-black border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-500 dark:text-gray-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-gray-400 mt-1">El correo no puede modificarse desde esta pantalla.</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-3 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:border-action-yellow focus:ring-1 focus:ring-action-yellow outline-none transition-all"
                />
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="w-full bg-[#2d5a27] hover:bg-[#1e3c1a] disabled:bg-gray-400 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  {isUpdating ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}