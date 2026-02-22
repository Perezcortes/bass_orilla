import { createClient } from '@/utils/supabase/server';
import { Users, LayoutDashboard } from 'lucide-react';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Solo traemos un conteo rápido para el resumen
  const { count: usersCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-action-yellow/20 text-yellow-600 rounded-xl">
          <LayoutDashboard size={28} />
        </div>
        <h1 className="text-3xl font-display font-black text-gray-900 dark:text-white">Resumen General</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#1A1A1A] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Usuarios</p>
            <h3 className="text-3xl font-black text-gray-900 dark:text-white">{usersCount || 0}</h3>
          </div>
        </div>
        {/* Aquí puedes agregar más tarjetas de resumen para catálogo y publicidad después */}
      </div>
    </div>
  );
}