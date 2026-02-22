export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
        
        <h1 className="text-3xl md:text-4xl font-display font-black text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          Términos y Condiciones
        </h1>

        <div className="space-y-6 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
          <p>
            Bienvenido a <strong>BassOrilla</strong>. Al utilizar nuestro sitio web, participar en nuestras dinámicas de sorteos o adquirir productos de nuestro catálogo, usted acepta los siguientes términos y condiciones.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">1. Dinámica de Sorteos y Boletos</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>La plataforma muestra los sorteos activos. La solicitud, apartado y confirmación de boletos se realiza de manera directa vía WhatsApp con <strong>Jorge F. Chacon</strong> al número <strong>+52 614 533 3015</strong>.</li>
            <li>Un boleto se considera oficial <strong>únicamente</strong> cuando se ha validad el comprobante de pago vía WhatsApp y se ha confirmado su asignación.</li>
            <li>No se aceptan devoluciones ni cancelaciones de dinero una vez que el número de boleto ha sido oficialmente asignado.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">2. Catálogo de Productos y Proceso de Compra</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>El catálogo de BassOrilla está especializado en artículos de <strong>pesca deportiva de agua dulce</strong>.</li>
            <li><strong>Pedidos Especiales:</strong> Si el usuario requiere artículos para pesca de <strong>agua salada</strong> u otros productos no listados, deberá indicarlo específica y directamente a Jorge F. Chacon vía WhatsApp para gestionar su disponibilidad y cotización.</li>
            <li><strong>Proceso de Checkout:</strong> Al agregar productos al carrito y proceder al pago, el sistema generará un "ticket de pedido" que será enviado a nuestro WhatsApp oficial. La compra <strong>no se finaliza en el sitio web</strong>. La disponibilidad, cotización de envío y el pago se concretan de manera personal.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">3. Precios y Métodos de Pago</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Todos los precios mostrados están en <strong>PESOS MEXICANOS (MXN)</strong> e incluyen I.V.A. (cuando aplique).</li>
            <li>Los pagos (tanto de catálogo como de rifas) se realizan de forma externa al sitio web, exclusivamente a través de <strong>transferencias bancarias o depósitos</strong> a las cuentas proporcionadas oficialmente en WhatsApp.</li>
            <li>Los logotipos de instituciones financieras o tarjetas mostrados en el sitio son únicamente ilustrativos como referencias de los canales bancarios compatibles.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">4. Envíos y Entregas</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>La duración estimada de entrega para productos del catálogo y premios físicos es de <strong>3 a 6 días hábiles</strong> a nivel nacional. Los días comienzan a contar una vez que se verifique el pago total de la compra o la identidad del ganador.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">5. Devoluciones y Garantías de Productos</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Para pedidos del catálogo o premios, no se aceptan devoluciones de ningún producto físico a menos que se notifique (con evidencia) que llegó dañado o sin funcionar en las <strong>24 horas hábiles</strong> posteriores a su recepción. En estos casos se evaluará el reemplazo o envío al fabricante.</li>
            <li><strong>BassOrilla no es el fabricante</strong> de los artículos ofertados. Si algún producto presenta un desperfecto de fábrica aplicable a garantía, esta será responsabilidad del fabricante. BassOrilla facilitará al cliente la información necesaria para gestionar dicha garantía.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">6. Contacto Oficial</h2>
          <p>
            Cualquier duda, seguimiento de pedidos o boletos debe realizarse a través de:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>WhatsApp:</strong> +52 614 533 3015</li>
            <li><strong>Correo:</strong> contacto@bassorilla.com</li>
            <li><strong>Ubicación:</strong> Chihuahua, Chih, México</li>
          </ul>

          <div className="mt-12 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-sm">
            <em>Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
          </div>
        </div>
      </div>
    </div>
  );
}