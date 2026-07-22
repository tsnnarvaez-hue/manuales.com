// Serverless function en Vercel
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email_comprador, manual_id } = req.body;

  if (!email_comprador || !manual_id) {
    return res.status(400).json({ message: 'Faltan parámetros de compra' });
  }

  try {
    // Lógica para enviar el correo mediante un proveedor (Nodemailer, EmailJS o SendGrid)
    console.log(`Enviando manual ID ${manual_id} a: ${email_comprador}`);

    return res.status(200).json({
      success: true,
      message: `Manual #${manual_id} enviado exitosamente a ${email_comprador}`
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
