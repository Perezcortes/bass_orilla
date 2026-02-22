export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] dark:bg-[#111110] py-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white dark:bg-[#1A1A1A] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12">
        
        <h1 className="text-3xl md:text-4xl font-display font-black text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
          Aviso de Privacidad
        </h1>

        <div className="space-y-6 text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed">
          <p>
            En cumplimiento con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su reglamento, se informa respecto el uso y protección de datos personales que la plataforma <strong>BassOrilla</strong> recabe, como sigue:
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">I. Identidad y domicilio del responsable</h2>
          <p>
            Responsable del tratamiento de sus datos personales: <strong>Jorge F. Chacon</strong> (representante de BassOrilla).<br />
            Correo electrónico: <strong>contacto@bassorilla.com</strong><br />
            Teléfono / WhatsApp: <strong>+52 614 533 3015</strong><br />
            Domicilio: Chihuahua, Chih, México.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">II. Datos que se solicitarán</h2>
          <p>Los datos personales solicitados a personas físicas son exclusivamente los necesarios para la dinámica de las rifas y la venta de productos de catálogo:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Nombre completo y correo electrónico (para registro en el sitio).</li>
            <li>Número telefónico / WhatsApp (para contacto, validación de boletos y confirmación de pedidos).</li>
            <li>Información postal y dirección de envío (para la entrega de productos comprados en el catálogo o envío de premios).</li>
          </ul>
          <p className="mt-4 p-4 bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 rounded-lg border border-yellow-500/20">
            <strong>Nota Importante:</strong> BassOrilla <strong>NO</strong> recaba, procesa ni almacena información bancaria ni números de tarjetas de crédito/débito dentro de este sitio web. Todos los pagos de catálogo y sorteos se realizan de manera externa mediante transferencias interbancarias validadas vía WhatsApp.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">III. Fines con los que utilizaremos sus datos</h2>
          <p><strong>Fines Necesarios:</strong></p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Creación de cuenta y registro en la plataforma.</li>
            <li>Procesar los "tickets de pedido" generados en el carrito de compras del catálogo.</li>
            <li>Contactarlo vía WhatsApp para finalizar el proceso de apartado, pago y confirmación (ya sea de productos o boletos).</li>
            <li>Gestión de la logística para el envío de compras y premios a su domicilio.</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">IV. Derechos ARCO</h2>
          <p>
            Para limitar el uso de sus datos, o para ejercer sus derechos de Acceso, Rectificación, Cancelación u Oposición, el titular deberá enviar una solicitud al correo: <strong>contacto@bassorilla.com</strong> o vía WhatsApp al <strong>+52 614 533 3015</strong>.
          </p>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">V. Transferencia de datos y Seguridad</h2>
          <p>
            Nos comprometemos a no transferir sus datos personales a terceros sin su consentimiento. La información de domicilio podrá ser compartida con servicios de paquetería exclusivamente para la entrega de productos o premios. <strong>BassOrilla no recaba datos sensibles.</strong>
          </p>

          <div className="mt-12 p-4 bg-gray-50 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 text-sm">
            <em>Última actualización: {new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}</em>
          </div>
        </div>
      </div>
    </div>
  );
}