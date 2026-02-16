export default function Home() {
  return (
    <main className="min-h-screen bg-bone-white">
      {/* Header / Navbar */}
      <nav className="bg-bass-green p-4 text-white">
        <h1 className="text-2xl font-bold">BassOrilla</h1>
      </nav>

      {/* Sección de Publicidad / Sorteos */}
      <section className="bg-splash-blue p-8 text-center text-white">
        <h2 className="text-3xl font-black italic">¡PRÓXIMO SORTEO!</h2>
        <p>Participa en nuestras dinámicas activas.</p>
      </section>

      {/* Grid de Productos */}
      <div className="container mx-auto py-10">
        <h2 className="text-2xl font-bold text-carbon-black mb-6">Catálogo de Pesca</h2>
        {/* Aquí irán tus componentes de Filtros y ProductCard */}
      </div>
    </main>
  );
}