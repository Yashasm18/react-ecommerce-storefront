export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { name, email, paymentId, amount, date, items = [] } = req.body;

  const htmlContent = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h2 style="color: #111;">Your order is confirmed! 📖</h2>
      <p>Hi ${name},</p>
      <p>Thank you for buying my book, it means the world to me.</p>
      
      <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Order Details</h3>
        <p><strong>Items:</strong> ${items.join(', ')}</p>
        <p><strong>Amount Paid:</strong> ₹${amount}</p>
        <p><strong>Payment ID:</strong> ${paymentId}</p>
        <p><strong>Date:</strong> ${date}</p>
      </div>

      <p><strong>Delivery Info:</strong><br>
      Your copy will be carefully packaged and dispatched soon. You will receive tracking details once it ships.</p>

      <p><strong>Need Help?</strong><br>
      Reply directly to this email or DM <a href="https://instagram.com/wordsofvamshi" style="color: #6366f1;">@wordsofvamshi</a> on Instagram if you have any questions.</p>

      <p style="margin-top: 30px; font-style: italic; color: #555;">
        "Hope these words find you at the right time 🤍"
      </p>
      <p>— Vamshi</p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Vamshi <orders@wordsofvamshi.com>',
        to: email,
        subject: 'Your order is confirmed! 📖 — You Made Me Quiet by Vamshi',
        html: htmlContent
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error sending email');
    }

    res.status(200).json({ success: true, id: data.id });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}
