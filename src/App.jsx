import { useEffect, useState, useRef, useCallback } from 'react';
import { ShoppingCart, Star, Heart, BookOpen, Quote, Sparkles, Moon, Feather, Check, Pen, Menu, X, Search, User, ShoppingBag, Package, MapPin, ExternalLink, VolumeX, Volume2, Send, CheckCircle, Trophy } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useClerk } from '@clerk/clerk-react';
import BrandLogo from './BrandLogo.jsx';
import './index.css';

const HEART_EMOJIS = ['❤️', '🧡', '💛', '💕', '💖', '💗', '🤍', '♥️'];

const SECTIONS = ['home', 'about-book', 'reviews', 'author', 'shop'];

// Stylized "Vamshi" with a heart replacing the dot on the "i"
const VamshiName = ({ className = '' }) => (
  <span className={`vamshi-name ${className}`}>Vamsh<span className="vamshi-i">ı</span></span>
);

const REVIEWS = [
  {
    name: 'Sharvani Iyer',
    text: 'This book felt like a warm hug! The emotions were so raw and real — I cried and found myself completely immersed. A true masterpiece that speaks to the soul.',
    rating: 5,
  },
  {
    name: 'Darsh Mahapatra',
    text: 'A poetry collection that captures the quiet side of love beautifully. Every page feels like a personal letter. Vamshi\'s writing is masterful and deeply moving.',
    rating: 5,
  },
  {
    name: 'Tanishqa Bansal',
    text: 'Finished it in one sitting. I was left with a heart full of feelings and tears I didn\'t expect. Vamshi knows exactly how to touch your soul.',
    rating: 5,
  },
  {
    name: 'Vihaan Sood',
    text: 'Beautifully written and deeply moving. It makes you appreciate the silent, quiet love in your life and reminds you what truly matters.',
    rating: 5,
  },
  {
    name: 'Aarush Nambiar',
    text: 'Rarely does a book make me feel so much! Every page pulled me in deeper. Definitely one of my favourite reads this year. Absolutely stunning.',
    rating: 5,
  },
  {
    name: 'Saanvika Pillai',
    text: 'This book beautifully highlights the importance of being there for your loved ones. It touched my heart in ways I didn\'t expect. Truly transformative.',
    rating: 5,
  },
];

const READER_MOMENTS = [
  { id: 1, type: 'image', src: '/reader-dm1.jpg', alt: 'Reader message' },
  { id: 2, type: 'video', src: '/reader-video1.mp4' },
  { id: 3, type: 'image', src: '/reader-dm2.jpg', alt: 'Reader message' },
  { id: 4, type: 'video', src: '/reader-video2.mp4' },
  { id: 5, type: 'image', src: '/reader-dm3.jpg', alt: 'Reader message about You Made Me Quiet' },
  { id: 6, type: 'image', src: '/reader-dm4.jpg', alt: 'Reader message about You Made Me Quiet' },
  { id: 7, type: 'video', src: '/reader-video3.mp4' },
];

function MomentCard({ moment, onMaximize }) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="moment-card" onClick={() => onMaximize(moment)}>
      {moment.type === 'image' ? (
        <img src={moment.src} alt={moment.alt} className="moment-media" />
      ) : (
        <div className="moment-video-wrapper">
          <video 
            ref={videoRef}
            src={moment.src} 
            className="moment-media" 
            autoPlay 
            loop 
            muted={isMuted} 
            playsInline
          />
          <button className="mute-btn" onClick={toggleMute}>
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />} {isMuted ? 'UNMUTE' : 'MUTE'}
          </button>
        </div>
      )}
      <div className="maximize-hint">Click to enlarge</div>
    </div>
  );
}

function MaximizeModal({ moment, onClose }) {
  if (!moment) return null;

  return (
    <div className="policy-overlay maximize-overlay" onClick={onClose}>
      <button className="policy-close maximize-close" onClick={onClose} aria-label="Close">
        <X size={32} color="#fff" />
      </button>
      <div className="maximize-content" onClick={(e) => e.stopPropagation()}>
        {moment.type === 'image' ? (
          <img src={moment.src} alt={moment.alt} className="maximized-media" />
        ) : (
          <video src={moment.src} className="maximized-media" controls autoPlay playsInline />
        )}
      </div>
    </div>
  );
}

// ===== POLICY CONTENT =====
const POLICIES = {
  privacy: {
    title: 'Privacy Policy',
    effectiveDate: '12-06-2026',
    sections: [
      {
        heading: 'Information We Collect',
        content: 'When you make a purchase or attempt to make a purchase through WordsOfVamshi, we collect certain information from you, including your name, billing address, shipping address, payment information, email address, and phone number. This is referred to as "Order Information."',
      },
      {
        heading: 'How We Use Your Information',
        content: 'We use the Order Information to fulfill orders placed through the site (including processing payment, arranging shipping, and providing you with invoices and order confirmations). Additionally, we use this information to communicate with you and screen orders for potential risk or fraud.',
      },
      {
        heading: 'Sharing Your Information',
        content: 'We share your Personal Information with third parties to help us process orders and deliver your books. For example, we use shipping partners to deliver your order. We do not sell your personal information to any third parties for marketing purposes.',
      },
      {
        heading: 'Data Security',
        content: 'We take reasonable precautions and follow industry best practices to protect your personal information. All payment transactions are processed through secure, encrypted payment gateways. Your credit card details are always encrypted for your safety.',
      },
      {
        heading: 'Cookies',
        content: 'We may use cookies to maintain your session information and improve your browsing experience. You can modify your browser settings to decline cookies, but this may affect certain features of the website.',
      },
      {
        heading: 'Your Rights',
        content: 'You have the right to access, correct, or delete the personal information we hold about you. To exercise these rights, please contact us at wordsofvamshi@gmail.com.',
      },
      {
        heading: 'Changes to This Policy',
        content: 'We may update this privacy policy from time to time to reflect changes in our practices. We will notify you of any significant changes by posting the new policy on this page.',
      },
      {
        heading: 'Contact Us',
        content: 'For questions about this Privacy Policy, please contact us at wordsofvamshi@gmail.com.\n\nOffice Address:\n#2 Kallappa Layout, Teachers Colony,\nVapasandra, Chickballapura 562101',
      },
    ],
  },
  refund: {
    title: 'Refund Policy',
    effectiveDate: '12-06-2026',
    sections: [
      {
        heading: 'Our Promise',
        content: 'We want you to have a seamless experience while purchasing "You Made Me Quiet." If you are unsatisfied with your order, we offer a 7-day return policy, which means you have 7 days after receiving your book to request a return.',
      },
      {
        heading: 'Eligibility for Returns',
        content: 'To be eligible for a return, the book must be:\n• In the same condition as received (unused and undamaged)\n• With its original packaging intact\n• Accompanied by proof of purchase (receipt or order confirmation)',
      },
      {
        heading: 'How to Initiate a Return',
        content: 'To start a return, follow these steps:\n1. Email us at wordsofvamshi@gmail.com with your order number\n2. Provide a reason for return and upload product images if required\n3. Choose your refund method and enter the relevant details (Bank Account / UPI ID)\n4. Confirm your pickup address\n5. Submit your request',
      },
      {
        heading: 'Refund Processing',
        content: 'If your return is approved, we will schedule a pickup within 2 days. Once we receive the book, the refund will be credited within 24-48 hours. Note: A flat ₹50 deduction will apply to cover return shipping fees.',
      },
      {
        heading: 'Damaged or Incorrect Orders',
        content: 'We take utmost care in delivering your order, but if you receive a damaged, defective, or incorrect book, please contact us immediately so we can resolve the issue. Email us at wordsofvamshi@gmail.com with your order details and images of the issue.',
      },
      {
        heading: 'Need Help?',
        content: 'If you have any return-related questions, reach out to us at wordsofvamshi@gmail.com. We are here to help!\n\nOffice Address:\n#2 Kallappa Layout, Teachers Colony,\nVapasandra, Chickballapura 562101',
      },
    ],
  },
  shipping: {
    title: 'Shipping Policy',
    effectiveDate: '12-06-2026',
    sections: [
      {
        heading: 'Shipping Across India',
        content: 'We are committed to ensuring that "You Made Me Quiet" reaches every reader across India. To make your experience hassle-free, we offer free shipping on all orders.',
      },
      {
        heading: 'Fast & Reliable Dispatch',
        content: 'We understand the excitement of receiving your book, and we prioritize quick dispatch. Your order will be processed and shipped within 24 hours of confirmation, ensuring you get your book as soon as possible.',
      },
      {
        heading: 'Trusted Delivery Partners',
        content: 'To provide secure and reliable shipping, we have partnered with India\'s leading courier services. Rest assured, your order is in safe hands. We aim to deliver your order within 3 to 5 days, depending on your location.',
      },
      {
        heading: 'Order Tracking',
        content: 'Stay updated on your order\'s journey! Once your book is dispatched, you will receive a tracking number via email. You can use your order ID to monitor real-time shipping updates.',
      },
      {
        heading: 'Order Cancellation',
        content: 'Changed your mind? You can cancel your order within 24 hours of placing it. To request a cancellation, email us at wordsofvamshi@gmail.com. Unfortunately, cancellations are not possible once the order has been shipped.',
      },
      {
        heading: 'Our Commitment',
        content: 'Your satisfaction is our priority, and we are here to ensure a smooth and transparent shopping experience. If you have any questions, feel free to reach out to us at wordsofvamshi@gmail.com.\n\nOffice Address:\n#2 Kallappa Layout, Teachers Colony,\nVapasandra, Chickballapura 562101',
      },
    ],
  },
  terms: {
    title: 'Terms of Service',
    effectiveDate: '12-06-2026',
    sections: [
      {
        heading: 'Overview',
        content: 'This website is operated by WordsOfVamshi. Throughout the site, the terms "we," "us," and "our" refer to WordsOfVamshi. This website, along with all information, tools, and services available, is offered to you upon your acceptance of all terms, conditions, policies, and notices stated here.',
      },
      {
        heading: '1. Online Store Terms',
        content: 'By using this site, you confirm that you are at least the age of majority in your state or province. You may not use our products for any illegal or unauthorized purposes, nor may you violate any applicable laws (including copyright laws). Any breach of the Terms will result in immediate termination of services.',
      },
      {
        heading: '2. General Conditions',
        content: 'We reserve the right to refuse service to anyone, at any time, for any reason. You understand that your content (excluding credit card information) may be transferred across networks; credit card details are always encrypted for security. You agree not to copy, sell, resell, or exploit any portion of the Service without express written permission.',
      },
      {
        heading: '3. Accuracy of Information',
        content: 'We strive for accuracy but do not guarantee that all content on this site is error-free, complete, or up-to-date. Any reliance on the material on this site is at your own risk.',
      },
      {
        heading: '4. Pricing & Modifications',
        content: 'Prices for "You Made Me Quiet" are subject to change without notice. We reserve the right to modify or discontinue the Service (or any part of it) at any time without notice.',
      },
      {
        heading: '5. Products & Returns',
        content: '"You Made Me Quiet" is available exclusively online. Returns are accepted within 7 days of delivery (see our Refund Policy for details). We have made every effort to accurately display colors and images of our book, but we cannot guarantee your screen\'s display will be accurate.',
      },
      {
        heading: '6. Intellectual Property',
        content: 'All content on this website, including text, graphics, logos, images, and the book "You Made Me Quiet," is the property of Vamshi and is protected by copyright laws. Unauthorized reproduction, distribution, or use of any content is strictly prohibited.',
      },
      {
        heading: '7. Contact Information',
        content: 'Questions about the Terms of Service should be sent to us at wordsofvamshi@gmail.com.\n\nOffice Address:\n#2 Kallappa Layout, Teachers Colony,\nVapasandra, Chickballapura 562101',
      },
    ],
  },
};

// ===== POLICY MODAL COMPONENT =====
function PolicyModal({ policy, onClose }) {
  if (!policy) return null;
  const data = POLICIES[policy];
  if (!data) return null;

  return (
    <div className="policy-overlay" onClick={onClose}>
      <div className="policy-modal" onClick={(e) => e.stopPropagation()}>
        <button className="policy-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        <div className="policy-content">
          <h1 className="policy-title">{data.title}</h1>
          <p className="policy-date">Effective Date: {data.effectiveDate}</p>
          <div className="policy-divider"></div>
          {data.sections.map((section, index) => (
            <div key={index} className="policy-section">
              <h2>{section.heading}</h2>
              <p>{section.content.split('\n').map((line, i) => (
                <span key={i}>{line}{i < section.content.split('\n').length - 1 && <br />}</span>
              ))}</p>
            </div>
          ))}
          <div className="policy-divider"></div>
          <p className="policy-footer-note">
            If you have any questions, contact us at <a href="mailto:wordsofvamshi@gmail.com">wordsofvamshi@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// ===== CART MODAL COMPONENT =====
function CartModal({ isOpen, onClose, onContinue, cartItems, removeFromCart, onCheckout, updateQuantity }) {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="policy-overlay cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="policy-close" onClick={onClose} aria-label="Close">
          <X size={24} />
        </button>
        <div className="cart-content" style={{ padding: '2rem' }}>
          <h1 className="cart-title" style={{ textAlign: 'left', marginBottom: '2rem' }}>Your Cart</h1>
          
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <ShoppingCart size={48} color="var(--border-light)" style={{ marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Your cart is empty</h2>
              <button className="btn-primary cart-continue-btn" onClick={() => { onClose(); onContinue(); }}>Continue Shopping</button>
            </div>
          ) : (
            <div className="cart-items-container">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <img src={item.image} alt={item.title} className="cart-item-image" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', fontFamily: 'var(--font-heading)' }}>{item.title}</h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{item.edition === 'author' ? "Author's Edition" : "Standard Edition"}</p>
                    </div>
                    <div className="cart-item-controls">
                      <div className="cart-item-controls-left">
                        <span style={{ fontWeight: '600' }}>₹{item.price}</span>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.2rem' }}>
                          <button type="button" onClick={() => updateQuantity(item.edition, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1.2rem', touchAction: 'manipulation' }}>-</button>
                          <span style={{ fontSize: '1rem', minWidth: '1.5rem', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.edition, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1.2rem', touchAction: 'manipulation' }}>+</button>
                        </div>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <X size={14} /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="cart-summary" style={{ marginTop: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.1rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>₹{total}</span>
                </div>
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '1rem' }} onClick={() => { onClose(); onCheckout(); }}>
                  Proceed to Checkout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===== PROFILE MODAL COMPONENT =====
function ProfileModal({ isOpen, onClose, onOpenPolicy }) {
  if (!isOpen) return null;

  return (
    <div className="policy-overlay profile-overlay" onClick={onClose}>
      <div className="profile-modal-container">
        <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
          <button className="policy-close" onClick={onClose} aria-label="Close">
            <X size={24} />
          </button>
          
          <div className="profile-content">
            <div className="profile-logo">
              <BrandLogo variant="profile" withQuill />
            </div>
            
            <h1 className="profile-title">Sign in</h1>
            <p className="profile-subtitle">Sign in or create an account</p>
            
            <button className="profile-btn profile-btn-purple">
              Continue with shop
            </button>
            
            <div className="profile-divider">
              <span>or</span>
            </div>
            
            <div className="profile-input-group">
              <input type="email" className="profile-input" placeholder="Email" />
            </div>
            
            <button className="profile-btn profile-btn-blue">
              Continue
            </button>
            
            <label className="profile-checkbox-label">
              <input type="checkbox" defaultChecked />
              <span className="profile-checkbox-custom"><Check size={12} strokeWidth={3} /></span>
              Email me with news and offers
            </label>
            
            <p className="profile-terms">
              By continuing, you agree to our <a href="#" onClick={(e) => { e.preventDefault(); onClose(); onOpenPolicy('terms'); }}>Terms of service</a>
            </p>
          </div>
        </div>
        
        <div className="profile-footer-links">
          <a href="#" onClick={(e) => { e.preventDefault(); onClose(); onOpenPolicy('privacy'); }}>Privacy policy</a>
        </div>
      </div>
    </div>
  );
}

// ===== SEARCH MODAL COMPONENT =====
const SEARCHABLE_SECTIONS = [
  { id: 'home', title: 'Home', keywords: ['home', 'start', 'book', 'you made me quiet', 'journey', 'emotion'] },
  { id: 'about-book', title: 'About The Book', keywords: ['about', 'story', 'quiet', 'heartbreak', 'healing', 'synopsis', 'details', 'pages'] },
  { id: 'author', title: 'The Author', keywords: ['author', 'vamshi', 'writer', 'about vamshi', 'biography', 'who is'] },
  { id: 'reviews', title: 'Reviews', keywords: ['reviews', 'feedback', 'ratings', 'testimonials', 'readers', 'stars'] },
  { id: 'shop', title: 'Shop', keywords: ['shop', 'buy', 'purchase', 'paperback', 'kindle', 'store', 'cart', 'order'] },
];

function SearchModal({ isOpen, onClose, onNavigate }) {
  const [query, setQuery] = useState('');
  
  useEffect(() => {
    if (!isOpen) setQuery(''); // eslint-disable-line react-hooks/set-state-in-effect
  }, [isOpen]);

  if (!isOpen) return null;

  const results = query.trim() === '' 
    ? [] 
    : SEARCHABLE_SECTIONS.filter(s => 
        s.title.toLowerCase().includes(query.toLowerCase()) || 
        s.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="policy-overlay search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-content">
          <div className="search-input-wrapper">
            <Search className="search-icon-input" size={24} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search sections, topics, or keywords..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <button className="search-close-btn" onClick={onClose} aria-label="Close search">
              <X size={20} />
            </button>
          </div>
          
          <div className="search-results">
            {query.trim() !== '' && results.length === 0 && (
              <p className="no-results">No results found for "{query}". Try searching for "book", "author", or "buy".</p>
            )}
            {results.map(result => (
              <div 
                key={result.id} 
                className="search-result-item"
                onClick={() => { onClose(); onNavigate(result.id); }}
              >
                <h3>{result.title}</h3>
                <p>Navigate to {result.title} section</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== CHECKOUT MODAL COMPONENT =====
function CheckoutModal({ isOpen, onClose, checkoutItems = [], updateQuantity }) {
  const [step, setStep] = useState('delivery'); // 'delivery' | 'processing' | 'success' | 'error'
  const [formData, setFormData] = useState({ name: '', email: '', address: '', phone: '' });

  const totalAmount = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        setStep('delivery');
        setFormData({ name: '', email: '', address: '', phone: '' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeliverySubmit = async (e) => {
    e.preventDefault();
    await initiatePayment();
  };

  const initiatePayment = async () => {
    setStep('processing');
    try {
      const amountPaise = totalAmount * 100; 

      // 1. Create Order
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: amountPaise })
      });
      
      const orderData = await res.json();
      
      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      const itemNames = checkoutItems.map(i => i.edition === 'author' ? "Author's Ed" : "Standard Ed").join(', ');

      // 2. Initialize Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "WordsOfVamshi",
        description: `Books: ${itemNames}`,
        order_id: orderData.id,
        prefill: {
          name: formData.name,
          contact: formData.phone,
        },
        theme: {
          color: "#F5A623"
        },
        handler: async function (response) {
          try {
            // 3. Verify Payment Signature
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            
            if (verifyRes.ok && verifyData.success) {
              // 4. Send email notification to author
              await notifyAuthor(response.razorpay_payment_id, itemNames);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (err) {
            console.error('Payment Verification Error:', err);
            setStep('error');
          }
        },
        modal: {
          ondismiss: function () {
            setStep('delivery'); // Go back to form if user closes modal
          }
        }
      };

      const rzp1 = new window.Razorpay(options);
      
      rzp1.on('payment.failed', function (response) {
        console.error('Payment Failed:', response.error);
        setStep('error');
      });

      rzp1.open();

    } catch (error) {
      console.error('Payment Initialization Error:', error);
      setStep('error');
    }
  };

  const notifyAuthor = async (paymentId, itemNames) => {
    const data = new FormData();
    data.append('access_key', import.meta.env.VITE_WEB3FORMS_KEY);
    data.append('subject', `📦 New Paid Order — ${itemNames}`);
    data.append('from_name', 'WordsOfVamshi Orders');
    data.append('name', formData.name);
    data.append('address', formData.address);
    data.append('phone', formData.phone);
    data.append('message', `New order placed successfully via Razorpay!\n\nPayment ID: ${paymentId}\nName: ${formData.name}\nAddress: ${formData.address}\nPhone: ${formData.phone}\n\nItems: ${itemNames}\nTotal Paid: ₹${totalAmount}`);

    try {
      // 1. Notify Author via Web3Forms
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data,
      });

      // 2. Send automated receipt to Buyer via Resend API
      if (formData.email) {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            paymentId: paymentId,
            amount: totalAmount,
            date: new Date().toLocaleString(),
            items: checkoutItems.map(i => `${i.quantity}x ${i.edition === 'author' ? "Author's Edition" : "Standard Edition"}`)
          })
        });
      }

      setStep('success');
    } catch (err) {
      console.error(err);
      setStep('success'); // Still show success since payment went through
    }
  };

  if (!isOpen) return null;

  return (
    <div className="policy-overlay buy-order-overlay" onClick={onClose}>
      <div className="buy-order-modal" onClick={(e) => e.stopPropagation()}>
        <button className="policy-close" onClick={onClose} aria-label="Close" disabled={step === 'processing'}>
          <X size={24} />
        </button>

        {step === 'success' ? (
          <div className="buy-order-success">
            <div className="success-icon-ring">
              <div className="success-icon-circle">
                <Check size={40} strokeWidth={3} />
              </div>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your order, <strong>{formData.name}</strong>! We have received your details and the author will contact you shortly.</p>
            <div className="success-detail-card" style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="success-detail-row" style={{ padding: '0.5rem 0' }}>
                  <Package size={16} style={{ minWidth: '16px' }} />
                  <span>{item.quantity}x You Made Me Quiet — {item.edition === 'author' ? "Author's Edition" : "Standard Edition"}</span>
                </div>
              ))}
              <div className="success-detail-row" style={{ padding: '0.5rem 0', borderTop: '1px solid rgba(0,0,0,0.05)', marginTop: '0.5rem' }}>
                <MapPin size={16} style={{ minWidth: '16px' }} />
                <span>{formData.address}</span>
              </div>
            </div>
            <button className="btn-primary buy-order-done-btn" onClick={onClose} style={{ marginTop: '2rem' }}>
              Done
            </button>
          </div>
        ) : step === 'error' ? (
          <div className="buy-order-content" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
            <div className="success-icon-ring" style={{ borderColor: '#fecaca' }}>
              <div className="success-icon-circle" style={{ background: '#ef4444' }}>
                <X size={40} strokeWidth={3} />
              </div>
            </div>
            <h2 style={{ marginBottom: '1rem' }}>Something went wrong</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>We couldn't process your order. Please try again.</p>
            <button className="btn-primary" onClick={() => setStep('delivery')} style={{ width: '100%', justifyContent: 'center' }}>
              Try Again
            </button>
          </div>
        ) : step === 'processing' ? (
          <div className="buy-order-content" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '500px', margin: '0 auto' }}>
            <div className="loading-spinner" style={{ margin: '0 auto 1.5rem', width: '40px', height: '40px', border: '3px solid rgba(0,0,0,0.1)', borderTopColor: 'var(--accent)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <h2 style={{ marginBottom: '1rem' }}>Processing Payment...</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Please do not close this window.</p>
          </div>
        ) : (
          <div className="premium-checkout-container">
            <div className="premium-checkout-summary" style={{ overflowY: 'auto' }}>
              {checkoutItems.map((item, idx) => (
                <div key={idx} className="summary-book-details">
                  <img src={item.image} alt="Book Cover" className="summary-book-cover" />
                  <div className="summary-book-info" style={{ flex: 1 }}>
                    <h4>{item.title}</h4>
                    <p>{item.edition === 'author' ? "Author's Edition" : "Standard Edition"}</p>
                    <div className="checkout-item-controls">
                      <span className="summary-book-price">₹{item.price}</span>
                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-light)', borderRadius: '6px', padding: '0.2rem' }}>
                          <button type="button" onClick={() => updateQuantity(item.edition, -1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1.2rem', touchAction: 'manipulation' }}>-</button>
                          <span style={{ fontSize: '1rem', minWidth: '1.5rem', textAlign: 'center', fontWeight: '600' }}>{item.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(item.edition, 1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem 1rem', fontSize: '1.2rem', touchAction: 'manipulation' }}>+</button>
                        </div>
                    </div>
                  </div>
                </div>
              ))}
              <div className="summary-price-breakdown" style={{ marginTop: '1.5rem' }}>
                <div className="summary-price-row">
                  <span>Subtotal</span>
                  <span>₹{totalAmount}</span>
                </div>
                <div className="summary-price-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-price-row summary-total">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="buy-order-content premium-checkout-form">
              <div className="buy-order-header">
                <h2>Where should we send your copy?</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                  Enter your shipping details below. Your items will be carefully packaged and shipped.
                </p>
              </div>

              <form className="buy-order-form fade-in" onSubmit={handleDeliverySubmit}>
                <div className="buy-order-field">
                  <label htmlFor="buy-name">Full Name</label>
                  <input
                    id="buy-name"
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="buy-order-field">
                  <label htmlFor="buy-email">Email Address</label>
                  <input
                    id="buy-email"
                    type="email"
                    name="email"
                    placeholder="Where should we send your receipt?"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="buy-order-field">
                  <label htmlFor="buy-address">Delivery Address</label>
                  <textarea
                    id="buy-address"
                    name="address"
                    placeholder="Enter your full delivery address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    rows={3}
                  />
                </div>

                <div className="buy-order-field">
                  <label htmlFor="buy-phone">Phone Number</label>
                  <input
                    id="buy-phone"
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn-primary buy-order-submit-btn" style={{ width: '100%', justifyContent: 'center', padding: '1.2rem', fontSize: '1.05rem', marginTop: '1rem' }}>
                  Proceed to Payment — ₹{totalAmount}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();

  const handleAuthGatedAction = (action) => {
    if (!isSignedIn) {
      clerk.openSignIn();
    } else {
      action();
    }
  };

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [policyModal, setPolicyModal] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutSessionItems, setCheckoutSessionItems] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [notifyStatus, setNotifyStatus] = useState(''); // eslint-disable-line no-unused-vars
  const [buyOrderOpen, setBuyOrderOpen] = useState(false);
  const [bookEdition, setBookEdition] = useState('standard'); // eslint-disable-line no-unused-vars
  const [readingChapter1, setReadingChapter1] = useState(false);
  const [motherPageOpen, setMotherPageOpen] = useState(false);
  const [maximizedMedia, setMaximizedMedia] = useState(null);
  const [reviewForm, setReviewForm] = useState({ name: '', email: '', phone: '', rating: 5, review: '' });
  const [reviewSubmitStatus, setReviewSubmitStatus] = useState(''); // '' | 'sending' | 'success' | 'error'
  const [reviewFormError, setReviewFormError] = useState('');
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const lastHeartTime = useRef(0);
  const heartId = useRef(0);

  const HERO_IMAGES = [
    { src: '/book-cover-quiet.png', alt: 'You Made Me Quiet — Book Cover' },
    { src: '/book-photo-1.jpg', alt: 'You Made Me Quiet — In Nature' },
    { src: '/book-photo-2.jpg', alt: 'You Made Me Quiet — With Roses' },
    { src: '/book-photo-3.jpg', alt: 'You Made Me Quiet — On Temple Steps' },
    { src: '/book-photo-4.jpg', alt: 'You Made Me Quiet — In Bookstore' },
    { src: '/book-photo-5.jpg', alt: 'You Made Me Quiet — Bestseller Display' },
    { src: '/book-photo-6.jpg', alt: 'You Made Me Quiet — With Flowers' },
    { src: '/book-photo-7.jpg', alt: 'You Made Me Quiet — At Faqir Chand Bookstore' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroImageIndex(prev => (prev + 1) % 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Detect active section
      for (const id of SECTIONS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom > 120) {
            setActiveSection(id);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Security Hardening: Disable Context Menu & Inspect Shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => {
      // Allow right-click on input and textarea elements so users can edit text
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Block F12, Ctrl+Shift+I, Cmd+Option+I, Ctrl+Shift+J, Cmd+Option+J, Ctrl+U, Cmd+Option+C
      if (
        e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Ctrl+Shift+I/J/C
        (e.metaKey && e.altKey && (e.keyCode === 73 || e.keyCode === 74 || e.keyCode === 67)) || // Cmd+Alt+I/J/C
        (e.ctrlKey && e.keyCode === 85) || // Ctrl+U
        (e.metaKey && e.altKey && e.keyCode === 85) // Cmd+Alt+U
      ) {
        e.preventDefault();
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Track Chapter 1 Views
  useEffect(() => {
    if (readingChapter1) {
      window.scrollTo(0, 0);
      
      // Fire and forget tracking via web3forms
      const formData = new FormData();
      formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
      formData.append("subject", "New Chapter 1 Reader!");
      formData.append("from_name", "WordsOfVamshi Tracker");
      formData.append("message", "Someone just clicked to read Chapter 1 on the website.");
      
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      }).catch(err => console.error('Tracking error:', err));
    }
  }, [readingChapter1]);

  useEffect(() => {
    if (motherPageOpen) {
      window.scrollTo(0, 0);
    }
  }, [motherPageOpen]);

  // Clean up hearts after animation
  useEffect(() => {
    if (hearts.length === 0) return;
    const timer = setTimeout(() => {
      setHearts(prev => prev.slice(1));
    }, 1400);
    return () => clearTimeout(timer);
  }, [hearts]);

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast({ show: false, message: '' });
    }, 3000);
  };

  const playPopSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleAddToCart = (edition) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.edition === edition);
      if (existingItem) {
        return prev.map(item => item.edition === edition ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: Date.now(),
        edition: edition,
        quantity: 1,
        price: edition === 'author' ? 499 : 299,
        title: 'You Made Me Quiet',
        image: edition === 'author' ? '/authors-edition.png' : '/standard-edition.png'
      }];
    });
    playPopSound();
    showToast(`${edition === 'author' ? "Author's Edition" : "Standard Edition"} added to cart.`);
  };

  const handleBuyNow = (edition) => {
    setCheckoutSessionItems([{
      id: Date.now(),
      edition: edition,
      quantity: 1,
      price: edition === 'author' ? 499 : 299,
      title: 'You Made Me Quiet',
      image: edition === 'author' ? '/authors-edition.png' : '/standard-edition.png'
    }]);
    setBuyOrderOpen(true);
  };

  const updateCartQuantity = (edition, delta) => {
    setCartItems(prev => prev.map(item => {
      if (item.edition === edition) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const updateCheckoutQuantity = (edition, delta) => {
    setCheckoutSessionItems(prev => prev.map(item => {
      if (item.edition === edition) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const handleHeroMouseMove = useCallback((e) => {
    const now = Date.now();
    if (now - lastHeartTime.current < 100) return;
    lastHeartTime.current = now;

    const emoji = HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)];
    const size = 18 + Math.random() * 18;
    const drift = Math.random() * 80 - 40;
    const id = heartId.current++;

    setHearts(prev => [...prev, {
      id,
      x: e.clientX,
      y: e.clientY,
      emoji,
      size,
      drift,
    }]);
  }, []);

  const navigateTo = (sectionId) => {
    setMobileMenuOpen(false);
    const el = document.getElementById(sectionId);
    if (el) {
      const offset = window.innerWidth <= 768 ? 108 : 72;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleNotifySubmit = async (e) => { // eslint-disable-line no-unused-vars
    e.preventDefault();
    setNotifyStatus('loading');
    
    const formData = new FormData(e.target);
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    formData.append("subject", "New Book Launch Notification Sign-up!");
    formData.append("from_name", "WordsOfVamshi Website");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setNotifyStatus('success');
        e.target.reset();
      } else {
        console.error("Error", data);
        setNotifyStatus('error');
      }
    } catch (err) {
      console.error(err);
      setNotifyStatus('error');
    }
    
    setTimeout(() => {
      setNotifyStatus('');
    }, 5000);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewFormError('');

    const trimmedName = reviewForm.name.trim();
    const trimmedEmail = reviewForm.email.trim();
    const trimmedPhone = reviewForm.phone.trim();
    const trimmedReview = reviewForm.review.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setReviewFormError('Please enter your full name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setReviewFormError('Please enter a valid email address (e.g. name@domain.com).');
      return;
    }

    const phoneDigits = trimmedPhone.replace(/\D/g, '');
    const phoneRegex = /^[+\d\s\-()]{7,15}$/;
    if (!trimmedPhone || !phoneRegex.test(trimmedPhone) || phoneDigits.length < 7 || phoneDigits.length > 15) {
      setReviewFormError('Please enter a valid phone number (at least 7 to 15 digits).');
      return;
    }

    if (!trimmedReview || trimmedReview.length < 3) {
      setReviewFormError('Please write your review before submitting.');
      return;
    }

    if (!reviewForm.rating || reviewForm.rating < 1 || reviewForm.rating > 5) {
      setReviewFormError('Please select a rating between 1 and 5 stars.');
      return;
    }

    setReviewSubmitStatus('sending');

    const formData = new FormData();
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY);
    formData.append("subject", `New Reader Review from ${trimmedName}! (${reviewForm.rating}/5 Stars)`);
    formData.append("from_name", "WordsOfVamshi Reviews");
    formData.append("Name", trimmedName);
    formData.append("Email", trimmedEmail);
    formData.append("Phone Number", trimmedPhone);
    formData.append("Rating", `${'★'.repeat(reviewForm.rating)}${'☆'.repeat(5 - reviewForm.rating)} (${reviewForm.rating}/5 Stars)`);
    formData.append("Review", trimmedReview);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (data.success) {
        setReviewSubmitStatus('success');
        setReviewForm({ name: '', email: '', phone: '', rating: 5, review: '' });
      } else {
        setReviewSubmitStatus('error');
      }
    } catch (err) {
      console.error(err);
      setReviewSubmitStatus('error');
    }

    setTimeout(() => {
      setReviewSubmitStatus('');
    }, 6000);
  };

  if (motherPageOpen) {
    return (
      <div className="mother-page">
        <div className="mother-page-header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setMotherPageOpen(false)}
              className="btn-primary"
              style={{ background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-light)', padding: '0.75rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <X size={18} /> Back to Website
            </button>
          </div>
        </div>

        <div className="container mother-page-content">
          <div className="mother-page-left">
            <div className="mother-photo-frame">
              <img src="/author-with-mom.jpg" alt="Vamshi with his mother" />
            </div>
            <p className="mother-photo-caption">The inspiration behind every word.</p>
          </div>

          <div className="mother-page-right">
            <div className="mother-dedication-tag">♥ A Son's Dedication</div>
            <h1 className="mother-dedication-title">For My Mother</h1>

            <div className="mother-letter">
              <p>For my mother,</p>
              <p>You are the one who trusted me the most in this world,<br/>even when I was at my worst.</p>
              <p>You believed in me when I couldn't believe in myself.<br/>You stood by me, quietly, without expecting anything in return.</p>
              <p>Thank you… for everything you have done for me till now.</p>
              <p>As I walk ahead in life, dearest mother,<br/>I carry your love within me.</p>
              <p>I am the flower that blooms at your feet,<br/>growing because of your care, your strength,</p>
              <p>and your endless kindness.</p>
              <p>Thank you for sheltering me<br/>with your petals of love and warmth…</p>
              <p className="mother-letter-closing">I will keep growing because of you.</p>
            </div>

            <div className="mother-signature">
              <Feather size={18} />
              <span>— <VamshiName /></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (readingChapter1) {
    return (
      <div className="reading-page" style={{ minHeight: '100vh', background: 'var(--bg-cream)', padding: '2rem 1rem' }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <button 
            onClick={() => setReadingChapter1(false)} 
            className="btn-primary" 
            style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-light)', padding: '0.75rem 1.5rem', borderRadius: '50px' }}
          >
            <X size={18} /> Back to Website
          </button>
          
          <div className="chapter-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h3 style={{ fontFamily: 'var(--font-accent)', letterSpacing: '2px', color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>CHAPTER 1</h3>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', color: 'var(--text-primary)' }}>THE BOY WHO FELT EMPTY</h2>
          </div>
          
          <div className="chapter-content" style={{ fontSize: '1.2rem', lineHeight: '1.9', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)', textAlign: 'left', maxWidth: '650px', margin: '0 auto', padding: '0 1rem' }}>
            <p className="chapter-quote" style={{ fontSize: '1.6rem', fontStyle: 'italic', color: 'var(--accent)', marginBottom: '3rem', textAlign: 'center' }}>
              “He was not sad every day…<br/>but happiness had stopped visiting him regularly.”
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              There was a time when he laughed without thinking.<br/>
              A time when small things felt enough.<br/>
              Music sounded beautiful.<br/>
              Nights felt peaceful.<br/>
              And life moved without carrying so much weight inside his heart.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              But somewhere along the way…<br/>
              something changed.<br/>
              Not suddenly.<br/>
              Not loudly.<br/>
              Just quietly.<br/>
              The kind of change no one notices at first.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              He still smiled around people.<br/>
              Still answered questions.<br/>
              Still walked through crowded places like everyone else.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              But deep inside…<br/>
              he felt disconnected from everything around him.<br/>
              Sometimes he would sit alone for hours, staring at nothing, while his thoughts wandered into places even he didn’t understand.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              The world around him kept moving normally.<br/>
              People laughed.<br/>
              People loved.<br/>
              People planned their futures.<br/>
              And there he was—<br/>
              existing,<br/>
              but not fully feeling alive.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Every morning began the same way.<br/>
              Wake up.<br/>
              Get ready.<br/>
              Pretend to be okay.<br/>
              He had mastered that part of life perfectly.<br/>
              No one around him truly knew how tired his mind had become.<br/>
              No one noticed how heavy silence felt to him at night.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Because pain does not always look dramatic.<br/>
              Sometimes it looks like a person quietly losing interest in everything they once cared about.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              College became another routine.<br/>
              Long corridors.<br/>
              Half-hearted conversations.<br/>
              Noise that never really reached him.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              He would sit among friends, listening to them talk about life, relationships, dreams, and plans…<br/>
              yet somehow feel completely alone in the middle of all of it.<br/>
              Not because he hated people.<br/>
              But because something inside him had stopped connecting.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Nights were always the hardest.<br/>
              That was when his thoughts became louder than the world around him.<br/>
              He often stared at the ceiling longer than he slept.<br/>
              Thinking.<br/>
              Overthinking.<br/>
              Remembering things he wished he could forget.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Sometimes he wondered if life would always feel this empty.<br/>
              Sometimes he questioned whether peace was something people truly found… or just something they pretended to have.<br/>
              And still—<br/>
              every morning,<br/>
              he woke up and continued living like nothing was wrong.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              He never told anyone how lonely he felt.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Because loneliness is difficult to explain when you are surrounded by people every day.<br/>
              How do you tell the world that your heart feels empty…<br/>
              when your life looks completely normal from outside?
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              So he stayed quiet.<br/>
              Not because he had nothing to say—<br/>
              but because he no longer believed anyone would understand.
            </p>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Then one ordinary day…<br/>
              something unexpected happened.<br/>
              He saw her.<br/>
              Just for a moment.<br/>
              A simple glance in the middle of another normal day.<br/>
              But strangely…<br/>
              something inside him paused.<br/>
              And for the first time in a long while—<br/>
              his heart felt awake again.
            </p>
          </div>
          
          <div className="chapter-action" style={{ textAlign: 'center', marginTop: '4rem', paddingBottom: '4rem' }}>
            <button className="btn-primary" onClick={() => { setReadingChapter1(false); setTimeout(() => navigateTo('shop'), 100); }}>
              Continue Reading — Choose Your Edition
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`toast-notification ${toast.show ? 'show' : ''}`} style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <CheckCircle size={18} color="#10b981" />
        {toast.message}
      </div>

      {/* Ticker Announcement Bar */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          <span className="ticker-item">🏆 Top #1 Notion Press Bestseller • 2026</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">A dream that went global 📚 Released in 150+ countries</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">📚 Available on: Amazon, Flipkart and Notion Press!</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">"This is not just a story… it is a feeling you carry with you."</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">Paperback ₹335 · Hardcover ₹510</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">Written for the hearts that feel deeply but love silently.</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">🏆 Top #1 Notion Press Bestseller • 2026</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">A dream that went global 📚 Released in 150+ countries</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">📚 Available on: Amazon, Flipkart and Notion Press!</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">"This is not just a story… it is a feeling you carry with you."</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">Paperback ₹335 · Hardcover ₹510</span>
          <span className="ticker-item">✦</span>
          <span className="ticker-item">Written for the hearts that feel deeply but love silently.</span>
          <span className="ticker-item">✦</span>
        </div>
      </div>

      {/* Floating hearts overlay — fixed to viewport so nothing clips them */}
      <div className="hearts-overlay" aria-hidden="true">
        {hearts.map(h => (
          <span
            key={h.id}
            className="cursor-heart"
            style={{
              left: h.x + 'px',
              top: h.y + 'px',
              fontSize: h.size + 'px',
              '--drift': h.drift + 'px',
            }}
          >
            {h.emoji}
          </span>
        ))}
      </div>

      {/* Navbar */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav-inner">
          <div className="nav-logo" onClick={() => navigateTo('home')} style={{ cursor: 'pointer' }}>
            <BrandLogo variant="navbar" withQuill />
          </div>

          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <button className={`nav-link ${activeSection === 'home' ? 'active' : ''}`} onClick={() => navigateTo('home')}>Home</button>
            <button className={`nav-link ${activeSection === 'about-book' ? 'active' : ''}`} onClick={() => navigateTo('about-book')}>About The Book</button>
            <button className={`nav-link ${activeSection === 'author' ? 'active' : ''}`} onClick={() => navigateTo('author')}>The Author</button>
            <button className={`nav-link ${activeSection === 'reviews' ? 'active' : ''}`} onClick={() => navigateTo('reviews')}>Reviews</button>
            <button className={`nav-link ${motherPageOpen ? 'active' : ''}`} onClick={() => setMotherPageOpen(true)} style={{ textTransform: 'uppercase' }}>For My Mother</button>
          </div>

          <div className="nav-icons">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={22} strokeWidth={2.5} /></button>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="icon-btn" aria-label="Account">
                  <User size={22} strokeWidth={2.5} />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="clerk-user-wrapper" style={{ display: 'flex', alignItems: 'center', marginLeft: '0.5rem' }}>
                <UserButton />
              </div>
            </SignedIn>
            <button className="icon-btn" aria-label="Cart" onClick={() => setCartOpen(true)}><ShoppingBag size={22} strokeWidth={2.5} /></button>
          </div>

          <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section id="home" className="page-section hero" onMouseMove={handleHeroMouseMove}>
        <div className="hero-bg-image"></div>
        <div className="container hero-grid">
          <div className="hero-left">
            <div className="hero-bestseller-badge fade-in-up">
              <div className="hero-bestseller-icon">
                <Trophy size={14} />
              </div>
              <span>Top #1 Notion Press Bestseller</span>
              <span className="hero-bestseller-year">• 2026</span>
            </div>

            <h1 className="hero-title fade-in-up delay-1">
              You Made Me<br /><em>Qu<span className="hero-i-wrapper"><span className="hero-i-letter">i</span><span className="hero-heart">{"\u2665\uFE0E"}</span></span>et.</em>
            </h1>

            <div className="hero-subtitle-card fade-in-up delay-2">
              <p className="hero-subtitle">
                An emotional journey exploring quiet love, heartbreak, and healing. Written for the hearts that feel deeply but love silently.
              </p>
            </div>
            <p className="hero-subtitle-platform fade-in-up delay-2">
              Now available on <strong>Notion Press</strong> — India's leading self-publishing platform.
            </p>

            <div className="hero-actions fade-in-up delay-3">
              <button className="btn-primary" onClick={() => navigateTo('shop')}>
                <ShoppingCart size={18} />
                Buy Paperback
              </button>
              <button className="btn-secondary" onClick={() => navigateTo('about-book')}>
                <BookOpen size={18} />
                Read Excerpt
              </button>
            </div>

            <div className="hero-stats fade-in-up delay-4">
              <div className="stat-item">
                <div className="stat-number">
                  <span className="star-row">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </span>
                </div>
                <div className="stat-label">4.9 Rating</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">1st</div>
                <div className="stat-label">Edition</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">#1</div>
                <div className="stat-label">Independent Hit</div>
              </div>
            </div>
          </div>

          <div className="hero-right fade-in-up delay-3">
            <div className="hero-bg-circle"></div>
            <div className="book-showcase">
              <div className="hero-carousel">
                {HERO_IMAGES.map((img, i) => (
                  <img
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    className={`hero-carousel-img ${i === heroImageIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
              <div className="book-copies-badge">
                <span style={{ fontSize: '1.2rem', marginBottom: '2px' }}>🎉</span>
                <span>53,000+ SOLD</span>
                IN 3 MONTHS
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Announcement */}
      <div className="announcement-bar">
        Your genuine purchase helps keep stories alive and supports independent writing.
      </div>

      {/* ===== ABOUT THE BOOK ===== */}
      <section id="about-book" className="page-section about-book">
        <div className="about-book-wrapper">
          <div className="container about-grid" style={{ minHeight: 'auto', paddingBottom: '0' }}>
          <div className="about-left">
            <div className="section-tag">✦ Inside the Pages</div>
            <h2>The Words That<br /><em>Stay With You</em></h2>
            <p>
              "You Made Me Quiet" is a poetic exploration of the silence we hold inside when words fail us. It is not just about love lost — it is about love remembered, love that heals, and love that lives on quietly.
            </p>

            <div className="quote-block">
              "Some stories aren't written with words… they are felt with the heart."
            </div>

            <p>
              Dedicated to the one who became his silence, <VamshiName /> has crafted a deeply personal collection that speaks to anyone who has ever loved in silence — and grown from it.
            </p>
          </div>

          <div className="about-right">
            <div className="theme-card">
              <div className="theme-card-icon"><Heart size={22} /></div>
              <h3>Silent Love</h3>
              <p>"I never chose you for a moment — I chose you for a lifetime."</p>
            </div>
            <div className="theme-card">
              <div className="theme-card-icon"><Moon size={22} /></div>
              <h3>Unfinished Souls</h3>
              <p>"You are the unfinished part of my soul, a quiet echo that still calls your name."</p>
            </div>
            <div className="theme-card">
              <div className="theme-card-icon"><Sparkles size={22} /></div>
              <h3>Healing</h3>
              <p>"Even in your lowest phase, your story is not over. You still have the power to rise."</p>
            </div>
            <div className="theme-card">
              <div className="theme-card-icon"><Feather size={22} /></div>
              <h3>Growth</h3>
              <p>"Time doesn't erase love… it just teaches you how to live with it."</p>
            </div>
          </div>
        </div>

          <div className="container chapter-1-cta-wrapper" style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'var(--font-heading)', fontStyle: 'italic', fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)', letterSpacing: '0.5px' }}>
              A dream that went global 📚 Released in 150+ countries
            </p>
            <button className="btn-primary chapter-1-cta" onClick={() => setReadingChapter1(true)}>
              <BookOpen size={20} />
              Click here to read Chapter 1
            </button>
          </div>
        </div>
      </section>

      {/* ===== READER COLLECTIVE ===== */}
      <section className="page-section collective-section">
        <div className="container collective-inner">
          <div className="collective-header">
            <h3 className="collective-tag">THE READER COLLECTIVE</h3>
            <h2 className="collective-title">SHARED<br/>MOMENTS</h2>
          </div>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {/* Duplicated 3 times for seamless scrolling */}
            {[...READER_MOMENTS, ...READER_MOMENTS, ...READER_MOMENTS].map((moment, idx) => (
              <MomentCard key={`${moment.id}-${idx}`} moment={moment} onMaximize={setMaximizedMedia} />
            ))}
          </div>
        </div>

        <div className="container collective-footer">
          <h2>Join the Readers Who Already Relived Their Memories</h2>
          <p>Discover why Vamshi's heartfelt story is winning hearts across India. Start your journey through love, healing, and resilience today.</p>
          <button className="btn-primary" onClick={() => navigateTo('shop')}>
            Get Your Copy Now
          </button>
        </div>
      </section>


      {/* ===== REVIEWS ===== */}
      <section id="reviews" className="page-section reviews-section">
        <div className="container reviews-inner">
          <div className="section-header">
            <div className="section-tag">★ Reader Reviews</div>
            <h2>What Readers Are Saying</h2>
            <p>Words from the hearts that felt every page</p>
          </div>

          <div className="reviews-grid">
            {REVIEWS.slice(0, 6).map((review, i) => (
              <div key={i} className="review-card">
                <Quote className="review-quote-icon" size={32} />
                <div className="review-stars">
                  {[...Array(review.rating)].map((_, j) => (
                    <Star key={j} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="review-text">"{review.text}"</p>
                <div className="review-author">
                  <div className="review-avatar">{review.name.charAt(0)}</div>
                  <div>
                    <div className="review-name">{review.name}</div>
                    <div className="review-label">Verified Reader</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ===== SUBMIT YOUR REVIEW ===== */}
          <div className="review-submit-section fade-in-up">
            <div className="review-submit-layout">
              {/* Left Side: Info & Headline */}
              <div className="review-submit-left">
                <div className="review-submit-icon-wrapper">
                  <Pen size={28} />
                </div>
                <h3>Share Your Experience</h3>
                <p className="review-submit-desc">
                  Have you read <em>You Made Me Quiet</em>? We would love to hear your thoughts, emotions, and personal reflections. Your review means the world to Vamshi and helps fellow readers discover this journey of words.
                </p>
                
                <div className="review-submit-highlights">
                  <div className="review-highlight-item">
                    <CheckCircle size={18} className="review-highlight-icon" />
                    <span>Delivered directly to the author</span>
                  </div>
                  <div className="review-highlight-item">
                    <CheckCircle size={18} className="review-highlight-icon" />
                    <span>100% genuine reader community & reviews</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Form */}
              <div className="review-submit-right">
                {reviewSubmitStatus === 'success' ? (
                  <div className="review-success-msg">
                    <div className="review-success-icon">🎉</div>
                    <h4>Thank You For Sharing!</h4>
                    <p>Your review and details have been sent directly to Vamshi. We deeply appreciate your beautiful words and support!</p>
                    <button 
                      type="button"
                      className="btn-secondary review-reset-btn" 
                      onClick={() => setReviewSubmitStatus('')}
                    >
                      Write Another Review
                    </button>
                  </div>
                ) : (
                  <form className="review-submit-form" onSubmit={handleReviewSubmit} noValidate>
                    <div className="review-form-group">
                      <label htmlFor="review-name">Name *</label>
                      <input
                        id="review-name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={reviewForm.name}
                        onChange={(e) => {
                          setReviewForm({ ...reviewForm, name: e.target.value });
                          if (reviewFormError) setReviewFormError('');
                        }}
                        required
                        minLength={2}
                        autoComplete="name"
                      />
                    </div>

                    <div className="review-form-row">
                      <div className="review-form-group">
                        <label htmlFor="review-email">Email *</label>
                        <input
                          id="review-email"
                          name="email"
                          type="email"
                          placeholder="your.email@example.com"
                          value={reviewForm.email}
                          onChange={(e) => {
                            setReviewForm({ ...reviewForm, email: e.target.value });
                            if (reviewFormError) setReviewFormError('');
                          }}
                          required
                          autoComplete="email"
                        />
                      </div>
                      <div className="review-form-group">
                        <label htmlFor="review-phone">Phone No. *</label>
                        <input
                          id="review-phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={reviewForm.phone}
                          onChange={(e) => {
                            setReviewForm({ ...reviewForm, phone: e.target.value });
                            if (reviewFormError) setReviewFormError('');
                          }}
                          required
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="review-form-group">
                      <label>Your Rating *</label>
                      <div className="review-star-selector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`review-star-btn ${star <= reviewForm.rating ? 'active' : ''}`}
                            onClick={() => {
                              setReviewForm({ ...reviewForm, rating: star });
                              if (reviewFormError) setReviewFormError('');
                            }}
                            aria-label={`Rate ${star} out of 5 stars`}
                          >
                            <Star size={26} fill={star <= reviewForm.rating ? 'currentColor' : 'none'} />
                          </button>
                        ))}
                        <span className="review-star-label">{reviewForm.rating} / 5 Stars</span>
                      </div>
                    </div>

                    <div className="review-form-group">
                      <label htmlFor="review-text">Your Review *</label>
                      <textarea
                        id="review-text"
                        name="review"
                        placeholder="What did you feel while reading? Which part touched your heart the most?"
                        rows={4}
                        value={reviewForm.review}
                        onChange={(e) => {
                          setReviewForm({ ...reviewForm, review: e.target.value });
                          if (reviewFormError) setReviewFormError('');
                        }}
                        required
                        minLength={3}
                      />
                    </div>

                    {reviewFormError && (
                      <div className="review-error-box">
                        ⚠️ {reviewFormError}
                      </div>
                    )}

                    <button
                      type="submit"
                      className="btn-primary review-submit-btn"
                      disabled={reviewSubmitStatus === 'sending'}
                    >
                      {reviewSubmitStatus === 'sending' ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Send size={18} />
                          Submit Review
                        </>
                      )}
                    </button>

                    {reviewSubmitStatus === 'error' && (
                      <p className="review-error-msg">Something went wrong while sending your review. Please try again!</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="reviews-message-card fade-in-up">
            <Heart size={32} className="reviews-message-icon" />
            <p className="reviews-message-text">
              If these pages stayed with you in some quiet way,<br />
              I’d truly love to hear your thoughts.<br />
              Share your feelings, reflections, or even a single line that touched you—<br />
              it means more than you know.
            </p>
            <a href="https://www.instagram.com/wordsofvamshi?igsh=MXd4cGhxMWx0ZzQ1ZA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="reviews-instagram-link">
              Connect with me on Instagram: @WORDSOFVAMSHI
            </a>
            <p className="reviews-message-footer">
              Your words might become a part of my next story.
            </p>
          </div>
        </div>
      </section>

      {/* ===== AUTHOR ===== */}
      <section id="author" className="page-section author-section">
        <div className="container author-grid">
          <div className="author-img-wrapper">
            <img src="/author.png" alt="Vamshi" />
          </div>
          <div className="author-content">
            <div className="section-tag">✦ About The Author</div>
            <h2>Meet The Author</h2>
            <p>
              <VamshiName /> is a passionate writer who expresses emotions through simple yet powerful words. His writing reflects real feelings of love, care, silence, and personal growth — capturing moments that many feel but few can describe.
            </p>
            <p>
              He believes that some stories are not meant to be spoken loudly, but to be felt deeply. Through this book, he shares a journey of emotions shaped by memories, connections, and lessons that leave a lasting impact.
            </p>
            <p>
              Blending heartfelt thoughts with raw honesty, <VamshiName /> writes not just to tell a story — but to make readers feel every word.
            </p>
            <div className="quote-block" style={{ marginTop: '2rem' }}>
              "This is not just a story…<br />it is a feeling you carry with you."
            </div>
            <div className="author-signature">
              <BrandLogo variant="signature" withQuill withSwash />
            </div>

            {/* Author Achievements */}
            <div className="author-achievements" style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <Trophy size={24} color="var(--accent)" />
                <h3 style={{ fontSize: '1.5rem', margin: 0, fontFamily: 'var(--font-heading)' }}>Milestones</h3>
              </div>
              <div className="achievements-grid" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                {[
                  { src: '/rocket-badge.jpg', title: 'Rocket Launch', desc: 'Sold over 100 copies in 3 Days' },
                  { src: '/author-club-badge.png', title: '500+ Author Club', desc: 'Sold over 500 copies in 7 Days' },
                  { src: '/badge-1000.png', title: '1000+ Author Club', desc: 'Just in 08 days' },
                  { src: '/badge-1500.png', title: '1500+ Author Club', desc: 'Just in 11 days' },
                  { src: '/badge-2000.png', title: '2000+ Author Club', desc: 'Just in 13 days' },
                  { src: '/badge-2500.png', title: '2500+ Author Club', desc: 'Just in 15 days' },
                  { src: '/badge-3000.png', title: '3000+ Author Club', desc: 'Just in 18 days' },
                  { src: '/badge-3500.png', title: '3500+ Author Club', desc: 'Just in 21 days' },
                  { src: '/badge-4000.png', title: '4000+ Author Club', desc: 'Just in 24 days' },
                ].map((badge, idx) => (
                  <div key={idx} className="achievement-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', width: '150px' }}>
                    <img 
                      src={badge.src} 
                      alt={`${badge.title}`} 
                      style={{ 
                        width: '110px', 
                        height: '110px', 
                        borderRadius: '50%', 
                        objectFit: 'cover', 
                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)', 
                        marginBottom: '1rem', 
                        border: '4px solid var(--bg-cream)' 
                      }} 
                    />
                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{badge.title}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{badge.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SHOP ===== */}
      <section id="shop" className="page-section shop-section">
        <div className="container shop-inner">
          <div className="section-header">
            <div className="section-tag">📚 Now Available</div>
            <h2>Get Your Copy</h2>
            <p>Now available on Notion Press — India's leading self-publishing platform</p>
          </div>

          {/* Notion Press Buy Section */}
          <div className="notion-press-section">
            <div className="notion-press-header">
              <div className="notion-press-badge">
                <span className="notion-press-live-dot"></span>
                Available Now
              </div>
              <h3>Buy from Notion Press</h3>
              <p>Order your copy and get it delivered to your doorstep</p>
            </div>

            <div className="notion-press-options">
              {/* Paperback */}
              <div className="notion-press-card">
                <div className="notion-press-card-type">Paperback</div>
                <div className="notion-press-card-desc">Paper Cover Edition</div>
                <div className="notion-press-card-price">
                  <span style={{ color: 'var(--text-light)', textDecoration: 'line-through', fontSize: '1.5rem', fontWeight: 600 }}>
                    ₹499
                  </span>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.15rem' }}>
                    <span className="price-symbol">₹</span>
                    <span className="price-amount">335</span>
                  </div>
                  <div style={{ background: '#ff0000', color: '#fff', fontSize: '0.8rem', fontWeight: 800, padding: '0.2rem 0.5rem', marginLeft: '0.25rem', display: 'flex', alignItems: 'center' }}>
                    -15% OFF
                  </div>
                </div>
                <div style={{ background: '#fff9e6', border: '1px dashed #eab308', color: '#854d0e', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem', width: '100%' }}>
                  Use Coupon JAM273 <br/>
                  <span style={{ fontSize: '0.75rem', fontWeight: 400 }}>(Applicable only in Notion Press)</span>
                </div>
                <ul className="notion-press-card-features">
                  <li><Check size={14} /> Soft paper cover</li>
                  <li><Check size={14} /> Lightweight & portable</li>
                  <li><Check size={14} /> Standard quality print</li>
                </ul>
                <a
                  href="https://notionpress.com/in/read/you-made-me-quiet?utm_source=share_publish_email&utm_medium=whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary notion-press-buy-btn"
                >
                  <ExternalLink size={16} />
                  Buy Paperback
                </a>
              </div>

              {/* Hardcover */}
              <div className="notion-press-card notion-press-card-featured">
                <div className="notion-press-popular-tag">RECOMMENDED</div>
                <div className="notion-press-card-type">Hardcover</div>
                <div className="notion-press-card-desc">Premium Hard Cover Edition</div>
                <div className="notion-press-card-price">
                  <span style={{ color: 'var(--text-light)', textDecoration: 'line-through', fontSize: '1.5rem', fontWeight: 600 }}>
                    ₹899
                  </span>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.15rem' }}>
                    <span className="price-symbol">₹</span>
                    <span className="price-amount">510</span>
                  </div>
                </div>
                <ul className="notion-press-card-features">
                  <li><Check size={14} /> Durable hardcover binding</li>
                  <li><Check size={14} /> Premium feel & finish</li>
                  <li><Check size={14} /> Perfect for gifting & collecting</li>
                </ul>
                <a
                  href="https://notionpress.com/in/read/you-made-me-quiet?utm_source=share_publish_email&utm_medium=whatsapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary notion-press-buy-btn"
                >
                  <ExternalLink size={16} />
                  Buy Hardcover
                </a>
              </div>
            </div>

            <p className="notion-press-note">
              You will be redirected to Notion Press to complete your purchase securely.
            </p>
          </div>

          {/* Divider between Notion Press and Editions */}
          <div className="shop-divider">
            <span>or grab your author edition below</span>
          </div>

          <div className="section-header" style={{ marginBottom: '2rem' }}>
            <div className="section-tag">✦ Limited Editions</div>
            <h2>Grab Your Author Edition</h2>
          </div>

          <div className="shop-editions-grid">
            {/* Author's Edition */}
            <div className="edition-card">
              <div className="edition-img-wrapper author-img">
                <img src="/authors-edition.png" alt="You Made Me Quiet - Author's Edition" />
                <div className="edition-badge">LIMITED</div>
              </div>
              <div className="edition-content">
                <h2>Author's Edition</h2>
                <div className="shop-author-name">By <VamshiName /></div>
                
                <div className="shop-release-date" style={{ background: 'var(--accent-light)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--accent)' }}>
                  <div style={{ marginBottom: '0.25rem', fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--accent-dark)' }}>Available Now</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Book sent and packed by author with love 🖤</div>
                </div>

                <div className="shop-message">
                  <p className="edition-highlight">Only 100 copies will ever exist.</p>
                  <p>Not for everyone. Only for the readers who truly feel the silence behind <em>You Made Me Quiet</em>. The <em>Author's Edition</em> will include:</p>
                  <ul className="edition-features">
                    <li>Personally Signed Book</li>
                    <li>Exclusive Author Card</li>
                    <li>"A Letter From …" Surprise Gift</li>
                  </ul>
                  <p className="edition-note">Made for the readers who truly connect with the silence behind the story.</p>
                </div>

                <div className="edition-buy-actions">
                  <button className="btn-secondary edition-action-btn" onClick={() => handleAuthGatedAction(() => handleAddToCart('author'))}>
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                  <button className="btn-primary buy-now-btn edition-action-btn" onClick={() => handleAuthGatedAction(() => handleBuyNow('author'))}>
                    Buy Now
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <BrandLogo variant="footer" withQuill withSwash />
              <p>Exploring love, care, and human emotions through simple yet powerful words. Join our community of passionate readers.</p>
              <div className="footer-socials">
                <a href="https://www.instagram.com/wordsofvamshi?igsh=MXd4cGhxMWx0ZzQ1ZA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </a>
                <a href="mailto:wordsofvamshi@gmail.com" aria-label="Email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </a>
              </div>
            </div>

            {/* Navigate Column */}
            <div className="footer-col">
              <h4>Navigate</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('home'); }}>Home</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('about-book'); }}>About The Book</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('author'); }}>The Author</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('reviews'); }}>Reviews</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setMotherPageOpen(true); }}>For My Mother</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}>Shop</a></li>
              </ul>
            </div>

            {/* Quick Links / Policies Column */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setPolicyModal('privacy'); }}>Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setPolicyModal('refund'); }}>Refund Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setPolicyModal('shipping'); }}>Shipping Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setPolicyModal('terms'); }}>Terms of Service</a></li>
              </ul>
            </div>

            {/* Contact / Need Help Column */}
            <div className="footer-col">
              <h4>Need Help?</h4>
              <ul className="footer-contact">
                <li>
                  <strong>Email:</strong>
                  <a href="mailto:wordsofvamshi@gmail.com">wordsofvamshi@gmail.com</a>
                </li>
                <li>
                  <strong>Instagram:</strong>
                  <a href="https://www.instagram.com/wordsofvamshi?igsh=MXd4cGhxMWx0ZzQ1ZA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">@wordsofvamshi</a>
                </li>
                <li>
                  <strong>Working Days:</strong>
                  <span>Monday – Sunday</span>
                </li>
                <li>
                  <strong>Address:</strong>
                  <span>#2 Kallappa Layout, Teachers Colony, Vapasandra, Chickballapura 562101</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} <VamshiName /> · WordsOf<VamshiName />. All rights reserved.</p>
            <div className="footer-bottom-links">
              <a href="#" onClick={(e) => { e.preventDefault(); setPolicyModal('privacy'); }}>Privacy Policy</a>
              <span>·</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setPolicyModal('refund'); }}>Refund Policy</a>
              <span>·</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setPolicyModal('terms'); }}>Terms of Service</a>
              <span>·</span>
              <a href="#" onClick={(e) => { e.preventDefault(); setPolicyModal('shipping'); }}>Shipping Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal */}
      <PolicyModal policy={policyModal} onClose={() => setPolicyModal(null)} />

      {/* Cart Modal */}
      <CartModal 
        isOpen={cartOpen} 
        onClose={() => setCartOpen(false)} 
        onContinue={() => navigateTo('shop')} 
        cartItems={cartItems}
        removeFromCart={(id) => setCartItems(prev => prev.filter(item => item.id !== id))}
        updateQuantity={updateCartQuantity}
        onCheckout={() => {
          setCheckoutSessionItems([...cartItems]);
          setCartOpen(false);
          setBuyOrderOpen(true);
        }}
      />

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} onNavigate={navigateTo} />

      {/* Profile Modal */}
      <ProfileModal isOpen={profileOpen} onClose={() => setProfileOpen(false)} onOpenPolicy={setPolicyModal} />

      {/* Maximize Modal */}
      <MaximizeModal moment={maximizedMedia} onClose={() => setMaximizedMedia(null)} />

      {/* Checkout Modal */}
      <CheckoutModal 
        isOpen={buyOrderOpen} 
        onClose={() => setBuyOrderOpen(false)} 
        checkoutItems={checkoutSessionItems} 
        updateQuantity={updateCheckoutQuantity}
      />
    </>
  );
}

export default App;
