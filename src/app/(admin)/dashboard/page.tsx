import { createClient } from '@/utils/supabase/server';
import { User, Shield, Users } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Obtenemos todos los perfiles (Gracias a RLS, solo el admin recibirá datos)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-display font-black mb-8 dark:text-white">Dashboard</h1>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white dark:bg-[#1E1E1E] p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Usuarios Totales</p>
              <h3 className="text-2xl font-bold dark:text-white">{profiles?.length || 0}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="bg-white dark:bg-[#1E1E1E] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-lg dark:text-white">Usuarios Recientes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 dark:bg-black/20 text-gray-500 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Usuario</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Rol</th>
                <th className="px-6 py-4 font-medium">Fecha Registro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {profiles?.map((profile) => (
                <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-bass-green flex items-center justify-center text-white text-xs">
                       {profile.full_name?.[0] || 'U'}
                    </div>
                    {profile.full_name || 'Sin nombre'}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{profile.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      profile.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' 
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                    }`}>
                      {profile.role === 'admin' && <Shield size={12} className="mr-1" />}
                      {profile.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}