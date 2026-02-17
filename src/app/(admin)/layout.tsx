import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Ahora la consulta ya no fallará porque arreglamos las políticas
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Verificamos si es admin
  if (!profile || profile.role !== 'admin') {
    redirect('/'); 
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-[#121212]">
      <aside className="w-64 bg-carbon-black text-white hidden md:block p-6 fixed h-full">
        <h2 className="text-xl font-bold text-action-yellow mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <a href="/dashboard" className="block hover:text-action-yellow transition-colors">Resumen</a>
          <a href="/dashboard/usuarios" className="block hover:text-action-yellow transition-colors">Usuarios</a>
          <a href="/dashboard/sorteos" className="block hover:text-action-yellow transition-colors">Sorteos</a>
          <div className="pt-10 border-t border-gray-700 mt-10">
            <a href="/" className="block text-gray-400 hover:text-white transition-colors">← Volver a la web</a>
          </div>
        </nav>
      </aside>
      
      <main className="flex-1 p-8 md:ml-64">
        {children}
      </main>
    </div>
  );
}