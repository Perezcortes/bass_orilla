import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name') // Agregamos full_name a la consulta
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'admin') {
    redirect('/'); 
  }

  // Determinamos qué nombre mostrar. 
  // Si no puso nombre al registrarse, usamos el principio de su correo.
  const displayUserName = profile.full_name || user.email?.split('@')[0] || 'Administrador';

  return (
    // Pasamos la variable displayUserName como prop al cliente
    <AdminLayoutClient userName={displayUserName}>
      {children}
    </AdminLayoutClient>
  );
}