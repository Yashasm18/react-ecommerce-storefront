import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ error: 'Missing required payment signature fields' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!key_secret) {
      console.error('Razorpay key secret not found in environment');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(text.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      // Payment is successful and verified
      return res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } else {
      // Signature mismatch
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
}
