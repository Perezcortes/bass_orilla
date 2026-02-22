'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  X, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

// Definimos la estructura de un Perfil
type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
};

export default function UsuariosModule() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false); // Para botones de guardar/eliminar
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('todos');

  // Estados de Modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);

  // Formulario de edición/creación
  const [formData, setFormData] = useState({ full_name: '', email: '', role: 'client', password: '' });

  const supabase = createClient();

  // 1. Cargar Usuarios
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Lógica de Filtrado
  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      (user.full_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'todos' || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // 3. Manejadores de Acciones (CRUD)
  
  // ABRIR EDITAR
  const openEditModal = (user: Profile) => {
    setSelectedUser(user);
    setFormData({ full_name: user.full_name || '', email: user.email, role: user.role, password: '' });
    setIsEditModalOpen(true);
  };

  // GUARDAR EDICIÓN
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setIsProcessing(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: formData.full_name, role: formData.role })
      .eq('id', selectedUser.id);

    setIsProcessing(false);
    if (!error) {
      setIsEditModalOpen(false);
      fetchUsers(); // Recargamos la tabla
    } else {
      alert('Error al actualizar: ' + error.message);
    }
  };

  // ABRIR ELIMINAR
  const openDeleteModal = (user: Profile) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // CONFIRMAR ELIMINAR
  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);

    // Nota: Esto elimina el perfil. Para eliminar la cuenta de Auth real desde el cliente
    // se requiere configuración avanzada en Supabase. Por ahora borramos el perfil.
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', selectedUser.id);

    setIsProcessing(false);
    if (!error) {
      setIsDeleteModalOpen(false);
      fetchUsers();
    } else {
      alert('Error al eliminar: ' + error.message);
    }
  };

  return (
    <div className="animate-fade-in-up">
      
      {/* HEADER DEL MÓDULO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-500 rounded-xl">
            <Users size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white">Usuarios</h1>
            <p className="text-gray-500 text-sm mt-1">Gestiona los accesos y roles de la plataforma.</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            setFormData({ full_name: '', email: '', role: 'client', password: '' });
            setIsCreateModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 bg-action-yellow text-[#1A1A1A] px-5 py-2.5 rounded-lg font-bold hover:bg-yellow-400 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Crear Usuario
        </button>
      </div>

      {/* BARRA DE HERRAMIENTAS (Filtros y Búsqueda) */}
      <div className="bg-white dark:bg-[#1A1A1A] p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 flex flex-col sm:flex-row gap-4">
        
        {/* Buscador */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow transition-colors"
          />
        </div>

        {/* Filtro de Rol */}
        <div className="sm:w-48">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow transition-colors appearance-none"
          >
            <option value="todos">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="client">Clientes</option>
          </select>
        </div>
      </div>

      {/* TABLA DE USUARIOS */}
      <div className="bg-white dark:bg-[#1A1A1A] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 uppercase tracking-wider text-xs font-bold border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Rol</th>
                <th className="px-6 py-4">Fecha Registro</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                    Cargando usuarios...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    No se encontraron usuarios que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-bass-green flex items-center justify-center text-white font-bold shrink-0">
                         {profile.full_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="truncate">{profile.full_name || 'Sin nombre'}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 truncate">{profile.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        profile.role === 'admin' 
                          ? 'bg-action-yellow/20 text-yellow-700 dark:text-action-yellow border border-action-yellow/30' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800'
                      }`}>
                        {profile.role === 'admin' && <Shield size={12} className="mr-1.5" />}
                        {profile.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(profile.created_at).toLocaleDateString('es-MX')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(profile)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(profile)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALES ================= */}

      {/* MODAL EDITAR USUARIO */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">Editar Usuario</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Nombre Completo</label>
                <input 
                  type="text" required value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Correo (Solo lectura)</label>
                <input type="text" disabled value={formData.email} className="w-full px-4 py-2.5 bg-gray-100 dark:bg-black/40 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rol del Sistema</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#111110] border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:border-action-yellow">
                  <option value="client">Cliente (Acceso normal)</option>
                  <option value="admin">Administrador (Acceso total)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancelar</button>
                <button type="submit" disabled={isProcessing} className="flex-1 px-4 py-2.5 bg-action-yellow text-[#1A1A1A] rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors flex justify-center items-center">
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL ELIMINAR USUARIO */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-fade-in-up p-6 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white mb-2">¿Eliminar Usuario?</h3>
            <p className="text-gray-500 text-sm mb-6">
              Estás a punto de eliminar a <strong className="text-gray-900 dark:text-white">{selectedUser?.full_name}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-800 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancelar</button>
              <button onClick={handleDeleteConfirm} disabled={isProcessing} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700 transition-colors flex justify-center items-center">
                {isProcessing ? <Loader2 size={18} className="animate-spin" /> : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CREAR USUARIO (UI de Ejemplo) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-xl font-display font-bold text-gray-900 dark:text-white">Nuevo Usuario</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white"><X size={20} /></button>
            </div>
            <div className="p-6">
              <div className="bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 mb-4 text-sm text-yellow-800 dark:text-yellow-500">
                <strong>Aviso:</strong> Para crear usuarios sin cerrar tu sesión actual de Administrador, te recomendamos indicarles que se registren en la página web y posteriormente cambies su rol desde esta tabla.
              </div>
              <div className="pt-4 flex justify-end">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-6 py-2.5 bg-gray-100 dark:bg-white/10 rounded-lg text-sm font-bold text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-white/20 transition-colors">
                  Entendido, cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}