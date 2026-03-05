import { createClient } from '@/utils/supabase/server';
import { Users } from 'lucide-react';
import CampaignWrapper from './CampaignWrapper'; // Crearemos este wrapper rápido

export const revalidate = 0;

export default async function SuscriptoresPage() {
  const supabase = await createClient();

  // 1. Traer suscriptores
  const { data: subscribers } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false });

 // 2. Traer productos activos para pasarlos al modal (AÑADIMOS category Y variants PARA LA IMAGEN)
  const { data: products } = await supabase
    .from('products')
    .select('id, title, brand, category, price, discount_price, slug, variants')
    .eq('is_active', true);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="text-action-yellow" />
            Comunidad
          </h1>
          <p className="text-gray-500 mt-1">Administra tu lista de correos y suscriptores.</p>
        </div>
        
        {/* Aquí llamamos al componente de Cliente que maneja el botón y el modal */}
        <CampaignWrapper products={products || []} />
      </div>

      <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
        {/* ... La misma tabla de suscriptores del mensaje anterior ... */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-black/50 border-b border-gray-200 dark:border-gray-800 text-sm text-gray-500">
                <th className="p-4 font-medium">Correo Electrónico</th>
                <th className="p-4 font-medium">Fecha de Suscripción</th>
                <th className="p-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {subscribers && subscribers.length > 0 ? (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">{sub.email}</td>
                    <td className="p-4 text-sm text-gray-500">{new Date(sub.created_at).toLocaleDateString('es-MX')}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800">
                        {sub.status === 'active' ? 'Activo' : sub.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">Aún no tienes suscriptores.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}