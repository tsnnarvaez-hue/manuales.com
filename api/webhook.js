const sgMail = require('@sendgrid/mail');

// Mapeo de IDs de manuales a sus enlaces de descarga seguros alojados en Google Drive, AWS S3 o Vercel Blob
const BASE_DE_MANUALES = {
  'manual-01': {
    nombre: 'Diagnóstico Electrónico de Microprocesadores',
    downloadUrl: 'https://tuservidor.com/descargas/manual-microprocesadores-v1.pdf'
  },
  'manual-02': {
    nombre: 'Sistemas de Congelación & Cava Cuartos',
    downloadUrl: 'https://tuservidor.com/descargas/manual-cava-cuartos-v1.pdf'
  },
  'manual-03': {
    nombre: 'Aire Acondicionado VRF/VRV & Inverter',
    downloadUrl: 'https://tuservidor.com/descargas/manual-inverter-vrf-v1.pdf'
  }
};

module.exports = async (req, res) => {
  // Solo permitir peticiones POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { item, cliente } = req.body;

  if (!item || !cliente || !cliente.email) {
    return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
  }

  const manualInfo = BASE_DE_MANUALES[item.id];
  if (!manualInfo) {
    return res.status(404).json({ error: 'Manual no encontrado en catálogo.' });
  }

  // Configuración de API Key de SendGrid
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const mensajeEmail = {
    to: cliente.email,
    from: process.env.EMAIL_REMITENTE, // Tu correo verificado
    subject: `⚡ Tu Manual Técnico: ${manualInfo.nombre}`,
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 30px; rounded-corner: 12px;">
        <h1 style="color: #38bdf8;">¡Gracias por tu compra, ${cliente.nombre}!</h1>
        <p>Tu pago para el manual <strong>${manualInfo.nombre}</strong> ha sido verificado con éxito.</p>
        <p>Haz clic en el siguiente botón para descargar tu archivo en PDF de alta resolución:</p>
        <div style="margin: 30px 0;">
          <a href="${manualInfo.downloadUrl}" style="background-color: #06b6d4; color: #020617; padding: 14px 28px; font-weight: bold; text-decoration: none; border-radius: 8px; display: inline-block;">
            📥 Descargar Manual PDF Ahora
          </a>
        </div>
        <hr style="border-color: #334155;" />
        <p style="font-size: 12px; color: #94a3b8;">Si tienes alguna duda técnica o consulta sobre el contenido, responde directamente a este correo.</p>
      </div>
    `
  };

  try {
    await sgMail.send(mensajeEmail);
    return res.status(200).json({ success: true, message: 'Manual enviado con éxito' });
  } catch (error) {
    console.error('Error enviando correo:', error);
    return res.status(500).json({ error: 'Fallo al procesar el envío del correo electrónico.' });
  }
};
