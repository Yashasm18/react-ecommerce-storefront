import { useEffect, useState, useRef, useCallback } from 'react';
import { ShoppingCart, Star, BookOpen, Feather, Check, Menu, X, Search, User, ShoppingBag, Package, MapPin, ExternalLink, VolumeX, Volume2, Send, CheckCircle, Trophy, ChevronDown, ArrowRight, TrendingUp, Mail, FileText } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth, useClerk } from '@clerk/clerk-react';
import BrandLogo from './BrandLogo.jsx';
import './index.css';

const HEART_EMOJIS = ['❤️', '🧡', '💛', '💕', '💖', '💗', '🤍', '♥️'];

// Clean "Vamshi" text
const VamshiName = ({ className = '' }) => (
  <span className={`vamshi-name ${className}`}>Vamshi</span>
);


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

// ===== GLOBAL SEARCH ENGINE COMPONENT =====
const SEARCH_INDEX = [
  {
    id: 'product-author-edition',
    type: 'product',
    categoryGroup: 'books',
    categoryLabel: 'Book Edition',
    title: "You Made Me Quiet – Author's Signed Edition",
    description: "Original author copy with free bookmark & handwritten personal letter from Vamshi. ₹299 (40% OFF)",
    badge: "₹299 • Signed Copy",
    keywords: ['signed', 'author edition', 'original', 'bookmark', 'letter', 'buy', 'shop', 'order', 'paperback', 'vamshi signed', 'discount', 'offer', 'special edition', 'price', '299', '499'],
    actionType: 'navigate',
    target: 'shop'
  },
  {
    id: 'product-notion-press',
    type: 'product',
    categoryGroup: 'books',
    categoryLabel: 'Book Edition',
    title: "You Made Me Quiet – Official Notion Press Edition",
    description: "Standard paperback printed & fulfilled directly via Notion Press official storefront. ₹249",
    badge: "Notion Press",
    keywords: ['notion press', 'standard', 'paperback', 'official', 'buy notion press', 'shop', 'order', '249'],
    actionType: 'navigate',
    target: 'shop'
  },
  {
    id: 'product-amazon-kindle',
    type: 'product',
    categoryGroup: 'books',
    categoryLabel: 'Book Edition',
    title: "You Made Me Quiet – Amazon & Kindle Global Edition",
    description: "Available globally across India and worldwide on Amazon Paperback & Kindle eBook.",
    badge: "Amazon / Global",
    keywords: ['amazon', 'kindle', 'ebook', 'international', 'global', 'worldwide', 'shop', 'buy', 'online store'],
    actionType: 'navigate',
    target: 'shop'
  },
  {
    id: 'story-chapter-1',
    type: 'story',
    categoryGroup: 'story',
    categoryLabel: 'Chapter 1 Excerpt',
    title: "Read Chapter 1: The Boy Who Felt Empty",
    description: "“He was not sad every day… but happiness had stopped visiting him regularly.” Read free online excerpt.",
    badge: "Free Excerpt",
    keywords: ['chapter 1', 'the boy who felt empty', 'read', 'story', 'excerpt', 'online read', 'sample', 'sample chapter', 'first chapter', 'read book', 'quotes', 'read full story'],
    actionType: 'chapter1'
  },
  {
    id: 'page-about-book',
    type: 'story',
    categoryGroup: 'story',
    categoryLabel: 'Story & Narrative',
    title: "About The Book – Love, Silence & Letting Go",
    description: "Explore the themes of unspoken love, waiting for replies, silence, heartbreak, and emotional healing.",
    badge: "Narrative",
    keywords: ['about the book', 'about book', 'synopsis', 'story', 'silence', 'waiting', 'unspoken love', 'healing', 'letting go', 'plot', 'summary', 'expectations'],
    actionType: 'navigate',
    target: 'book'
  },
  {
    id: 'page-about-author',
    type: 'author',
    categoryGroup: 'author',
    categoryLabel: 'Author Bio',
    title: "About Vamshi C A – Bestselling Author",
    description: "Meet the author & storyteller behind You Made Me Quiet. Read his writing journey and milestones.",
    badge: "Biography",
    keywords: ['about the author', 'about author', 'vamshi', 'vamshi c a', 'writer', 'bio', 'biography', 'who is vamshi', 'milestones', 'bestseller', 'author story'],
    actionType: 'navigate',
    target: 'author-page'
  },
  {
    id: 'page-invite-vamshi',
    type: 'author',
    categoryGroup: 'author',
    categoryLabel: 'Speaking & Events',
    title: "Invite Vamshi – Keynotes, College Fests & Podcasts",
    description: "Invite author Vamshi for literary festivals, college fests, keynote sessions, book clubs, and podcasts.",
    badge: "Speaker",
    keywords: ['invite vamshi', 'invite', 'speaking', 'keynote', 'speaker', 'college fest', 'event', 'podcast', 'book club', 'guest speaker', 'invitation'],
    actionType: 'navigate',
    target: 'invite'
  },
  {
    id: 'page-contact-support',
    type: 'help',
    categoryGroup: 'help',
    categoryLabel: 'Support & Help',
    title: "Contact Us & Direct Customer Support",
    description: "Have questions about your order or want to share your review? Email: wordsofvamshi@gmail.com",
    badge: "Support",
    keywords: ['contact', 'help', 'support', 'email', 'instagram', 'customer care', 'reach out', 'wordsofvamshi@gmail.com', 'address', 'working days', 'phone', 'direct contact'],
    actionType: 'navigate',
    target: 'contact'
  },
  {
    id: 'page-for-my-mother',
    type: 'story',
    categoryGroup: 'story',
    categoryLabel: 'Special Dedication',
    title: "For My Mother – A Letter of Gratitude",
    description: "A heartfelt personal dedication letter written by author Vamshi to his mother.",
    badge: "Dedication",
    keywords: ['mother', 'for my mother', 'dedication', 'mom', 'letter', 'gratitude', 'tribute'],
    actionType: 'mother'
  },
  {
    id: 'policy-shipping-policy',
    type: 'policy',
    categoryGroup: 'help',
    categoryLabel: 'Store Policy',
    title: "Free Shipping Policy & Delivery Timelines",
    description: "Free shipping across India. Orders processed and dispatched within 24 hours (3-5 days delivery).",
    badge: "Free Delivery",
    keywords: ['shipping', 'delivery', 'dispatch', 'courier', 'free delivery', 'tracking', 'order status', 'how long', 'timeline'],
    actionType: 'policy',
    policy: 'shipping'
  },
  {
    id: 'policy-refund-policy',
    type: 'policy',
    categoryGroup: 'help',
    categoryLabel: 'Store Policy',
    title: "Refund & 7-Day Return Policy",
    description: "7-day easy return policy for unused copies or replacement for damaged and defective orders.",
    badge: "7-Day Return",
    keywords: ['refund', 'return', 'exchange', 'damaged', 'cancellation', 'money back', 'replacement', 'defective'],
    actionType: 'policy',
    policy: 'refund'
  },
  {
    id: 'policy-privacy-policy',
    type: 'policy',
    categoryGroup: 'help',
    categoryLabel: 'Store Policy',
    title: "Privacy Policy & Data Protection",
    description: "Learn how your personal details, email, and payment transactions are protected securely.",
    badge: "Security",
    keywords: ['privacy', 'privacy policy', 'security', 'data', 'information', 'personal data'],
    actionType: 'policy',
    policy: 'privacy'
  },
  {
    id: 'policy-terms-of-service',
    type: 'policy',
    categoryGroup: 'help',
    categoryLabel: 'Store Policy',
    title: "Terms of Service & Store Conditions",
    description: "Official online store terms, conditions, copyright details, and usage guidelines.",
    badge: "Terms",
    keywords: ['terms', 'terms of service', 'conditions', 'legal', 'store rules'],
    actionType: 'policy',
    policy: 'terms'
  }
];

const POPULAR_SEARCH_CHIPS = [
  { label: "Signed Author Edition", query: "signed" },
  { label: "Read Chapter 1", query: "chapter 1" },
  { label: "About The Book", query: "about the book" },
  { label: "Invite Vamshi", query: "invite" },
  { label: "Contact Support", query: "contact" },
  { label: "Free Shipping", query: "shipping" },
  { label: "Return Policy", query: "refund" },
];

function SearchModal({ isOpen, onClose, onNavigate, onOpenChapter1, onOpenMotherPage, onOpenPolicy }) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all'); // 'all' | 'books' | 'story' | 'author' | 'help'
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery(''); // eslint-disable-line react-hooks/set-state-in-effect
      setActiveCategory('all');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  const handleAction = useCallback((item) => {
    onClose();
    if (item.actionType === 'navigate') {
      onNavigate(item.target);
    } else if (item.actionType === 'chapter1') {
      onOpenChapter1?.();
    } else if (item.actionType === 'mother') {
      onOpenMotherPage?.();
    } else if (item.actionType === 'policy') {
      onOpenPolicy?.(item.policy);
    }
  }, [onClose, onNavigate, onOpenChapter1, onOpenMotherPage, onOpenPolicy]);

  if (!isOpen) return null;

  const normalizedQuery = query.trim().toLowerCase();

  const filteredResults = SEARCH_INDEX.filter(item => {
    // Category filtering
    if (activeCategory !== 'all' && item.categoryGroup !== activeCategory) {
      return false;
    }

    if (normalizedQuery === '') {
      return true;
    }

    const titleMatch = item.title.toLowerCase().includes(normalizedQuery);
    const descMatch = item.description.toLowerCase().includes(normalizedQuery);
    const badgeMatch = item.badge.toLowerCase().includes(normalizedQuery);
    const keywordMatch = item.keywords.some(k => k.toLowerCase().includes(normalizedQuery));

    return titleMatch || descMatch || badgeMatch || keywordMatch;
  });

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults.length > 0 && filteredResults[selectedIndex]) {
        handleAction(filteredResults[selectedIndex]);
      }
    }
  };

  const getTagClass = (type) => {
    if (type === 'product') return 'product';
    if (type === 'story') return 'story';
    if (type === 'author') return 'page';
    if (type === 'policy') return 'policy';
    return '';
  };

  const getCategoryIcon = (type) => {
    if (type === 'product') return <ShoppingBag size={14} />;
    if (type === 'story') return <BookOpen size={14} />;
    if (type === 'author') return <Feather size={14} />;
    if (type === 'help') return <Mail size={14} />;
    if (type === 'policy') return <FileText size={14} />;
    return <Search size={14} />;
  };

  return (
    <div className="policy-overlay search-overlay" onClick={onClose}>
      <div className="search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-content">
          {/* Top Search Input Bar */}
          <div className="search-input-wrapper">
            <Search className="search-icon-input" size={22} />
            <input 
              ref={inputRef}
              type="text" 
              className="search-input" 
              placeholder="Search books, chapters, stories, author, policies, or help..." 
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button 
                className="search-clear-btn" 
                onClick={() => {
                  setQuery('');
                  setSelectedIndex(0);
                  inputRef.current?.focus();
                }}
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}
            <span className="search-kbd-esc">ESC</span>
            <button className="search-close-btn" onClick={onClose} aria-label="Close search">
              <X size={20} />
            </button>
          </div>

          {/* Filter Tabs Bar */}
          <div className="search-tabs-bar">
            {[
              { id: 'all', label: 'All Results' },
              { id: 'books', label: 'Books & Editions' },
              { id: 'story', label: 'Story & Chapters' },
              { id: 'author', label: 'Author & Speaking' },
              { id: 'help', label: 'Support & Policies' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`search-tab-pill ${activeCategory === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(tab.id);
                  setSelectedIndex(0);
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Empty Query: Popular Searches */}
          {query.trim() === '' && activeCategory === 'all' && (
            <div className="search-popular-wrapper">
              <div className="search-popular-title">
                <TrendingUp size={14} color="var(--accent, #eab308)" />
                Popular Searches
              </div>
              <div className="search-popular-chips">
                {POPULAR_SEARCH_CHIPS.map((chip, idx) => (
                  <button
                    key={idx}
                    className="search-popular-chip"
                    onClick={() => {
                      setQuery(chip.query);
                      setSelectedIndex(0);
                    }}
                  >
                    <Search size={12} />
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results List */}
          <div className="search-results">
            {filteredResults.length === 0 ? (
              <div className="no-results">
                <p>No results found for <strong>"{query}"</strong>.</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', color: '#9ca3af' }}>
                  Try searching for <em>signed</em>, <em>chapter 1</em>, <em>vamshi</em>, <em>shipping</em>, or <em>support</em>.
                </p>
              </div>
            ) : (
              filteredResults.map((item, index) => (
                <div 
                  key={item.id} 
                  className={`search-result-item ${selectedIndex === index ? 'selected' : ''}`}
                  onMouseEnter={() => setSelectedIndex(index)}
                  onClick={() => handleAction(item)}
                >
                  <div className="search-result-info">
                    <div className="search-result-meta">
                      <span className={`search-result-tag ${getTagClass(item.type)}`}>
                        {getCategoryIcon(item.type)} {item.categoryLabel}
                      </span>
                      <span className="search-result-badge">{item.badge}</span>
                    </div>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                  <div className="search-result-action">
                    <span>{item.actionType === 'chapter1' ? 'Read' : item.actionType === 'policy' ? 'View' : 'Jump to'}</span>
                    <ArrowRight size={16} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Hints */}
          <div className="search-footer-hints">
            <div className="search-hints-group">
              <span><strong>↑ ↓</strong> to navigate</span>
              <span><strong>↵</strong> to select</span>
              <span><strong>esc</strong> to close</span>
            </div>
            <span>{filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'}</span>
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

// ===== SHOP CATALOG VIEW (MATCHING SAGAR'S SHOP PAGE) =====
function ShopCatalogView({ onAddToCart, onBuyNow }) {
  const [openDropdown, setOpenDropdown] = useState(null); // 'availability' | 'price' | null
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [sortBy, setSortBy] = useState('best-selling');
  const dropdownRef = useRef(null);

  const rawProducts = [
    {
      id: 'author-edition',
      title: "You Made Me Quiet – Author's Signed Edition (Original Copy & Also Get free Bookmark and A Personal Letter from the Author)",
      image: '/authors-edition.png',
      discount: '-40% OFF',
      originalPrice: '₹ 499.00',
      price: '₹ 299.00',
      numericPrice: 299,
      inStock: true,
      edition: 'author',
      isDirectBuy: true,
      buttonText: 'Buy Now',
      createdDate: 1
    },
    {
      id: 'paperback-edition',
      title: 'You Made Me Quiet – Paperback Edition (Official Print by Notion Press)',
      image: '/book-cover-quiet.png',
      discount: '-33% OFF',
      originalPrice: '₹ 499.00',
      price: '₹ 335.00',
      numericPrice: 335,
      inStock: true,
      edition: 'paperback',
      isDirectBuy: false,
      notionUrl: 'https://notionpress.com/in/read/you-made-me-quiet?utm_source=share_publish_email&utm_medium=whatsapp',
      buttonText: 'Buy on Notion Press',
      createdDate: 2
    },
    {
      id: 'hardcover-edition',
      title: "You Made Me Quiet – Collector's Hardcover Edition (Premium Hard Cover Finish)",
      image: '/book-photo-1.jpg',
      discount: '-43% OFF',
      originalPrice: '₹ 899.00',
      price: '₹ 510.00',
      numericPrice: 510,
      inStock: true,
      edition: 'hardcover',
      isDirectBuy: false,
      notionUrl: 'https://notionpress.com/in/read/you-made-me-quiet?utm_source=share_publish_email&utm_medium=whatsapp',
      buttonText: 'Buy Hardcover',
      createdDate: 3
    }
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products
  let filteredProducts = rawProducts.filter(p => {
    if (inStock && !p.inStock) return false;
    if (outOfStock && p.inStock) return false;
    if (priceFrom && p.numericPrice < parseFloat(priceFrom)) return false;
    if (priceTo && p.numericPrice > parseFloat(priceTo)) return false;
    return true;
  });

  // Sort products
  filteredProducts.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.numericPrice - b.numericPrice;
      case 'price-high':
        return b.numericPrice - a.numericPrice;
      case 'title-az':
        return a.title.localeCompare(b.title);
      case 'title-za':
        return b.title.localeCompare(a.title);
      case 'date-old':
        return a.createdDate - b.createdDate;
      case 'date-new':
        return b.createdDate - a.createdDate;
      case 'featured':
      case 'most-relevant':
      case 'best-selling':
      default:
        return 0;
    }
  });

  const selectedAvailabilityCount = (inStock ? 1 : 0) + (outOfStock ? 1 : 0);

  return (
    <main className="shop-catalog-page">
      <div className="container">
        <h1 className="shop-catalog-title">All</h1>

        <div className="shop-filter-bar" ref={dropdownRef}>
          <div className="shop-filter-left">
            <span className="shop-filter-label">Filter:</span>

            {/* Availability Filter Dropdown */}
            <div className="shop-filter-dropdown-wrap">
              <button 
                className={`shop-dropdown-pill ${openDropdown === 'availability' || selectedAvailabilityCount > 0 ? 'active' : ''}`}
                type="button"
                onClick={() => setOpenDropdown(prev => prev === 'availability' ? null : 'availability')}
              >
                Availability <ChevronDown size={14} />
              </button>

              {openDropdown === 'availability' && (
                <div className="shop-filter-popover" onClick={(e) => e.stopPropagation()}>
                  <div className="shop-popover-header">
                    <span>{selectedAvailabilityCount} selected</span>
                    <button 
                      type="button" 
                      className="shop-popover-reset"
                      onClick={() => { setInStock(false); setOutOfStock(false); }}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="shop-popover-body">
                    <label className="shop-checkbox-row">
                      <input 
                        type="checkbox" 
                        className="shop-checkbox-input"
                        checked={inStock}
                        onChange={(e) => setInStock(e.target.checked)}
                      />
                      <span>In stock ({rawProducts.filter(p => p.inStock).length})</span>
                    </label>
                    <label className="shop-checkbox-row disabled">
                      <input 
                        type="checkbox" 
                        className="shop-checkbox-input"
                        checked={outOfStock}
                        onChange={(e) => setOutOfStock(e.target.checked)}
                        disabled
                      />
                      <span style={{ color: '#888' }}>Out of stock (0)</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Price Filter Dropdown */}
            <div className="shop-filter-dropdown-wrap">
              <button 
                className={`shop-dropdown-pill ${openDropdown === 'price' || priceFrom || priceTo ? 'active' : ''}`}
                type="button"
                onClick={() => setOpenDropdown(prev => prev === 'price' ? null : 'price')}
              >
                Price <ChevronDown size={14} />
              </button>

              {openDropdown === 'price' && (
                <div className="shop-filter-popover" onClick={(e) => e.stopPropagation()}>
                  <div className="shop-popover-header">
                    <span>The highest price is ₹ 899.00</span>
                    <button 
                      type="button" 
                      className="shop-popover-reset"
                      onClick={() => { setPriceFrom(''); setPriceTo(''); }}
                    >
                      Reset
                    </button>
                  </div>
                  <div className="shop-price-inputs-row">
                    <div className="shop-price-input-group">
                      <span className="shop-price-symbol">₹</span>
                      <input 
                        type="number" 
                        placeholder="From"
                        className="shop-price-input"
                        value={priceFrom}
                        onChange={(e) => setPriceFrom(e.target.value)}
                      />
                    </div>
                    <div className="shop-price-input-group">
                      <span className="shop-price-symbol">₹</span>
                      <input 
                        type="number" 
                        placeholder="To"
                        className="shop-price-input"
                        value={priceTo}
                        onChange={(e) => setPriceTo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="shop-filter-right">
            <div className="shop-sort-select-wrap">
              <span className="shop-filter-label">Sort by:</span>
              <select 
                className="shop-sort-select" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="most-relevant">Most relevant</option>
                <option value="best-selling">Best selling</option>
                <option value="title-az">Alphabetically, A-Z</option>
                <option value="title-za">Alphabetically, Z-A</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
                <option value="date-old">Date, old to new</option>
                <option value="date-new">Date, new to old</option>
              </select>
            </div>
            <span className="shop-product-count">{filteredProducts.length} products</span>
          </div>
        </div>

        <div className="shop-products-grid">
          {filteredProducts.map((product) => (
            <article key={product.id} className="shop-card">
              <div className="shop-card-image-box">
                <img src={product.image} alt={product.title} loading="lazy" />
                <span className="shop-card-discount-badge">{product.discount}</span>
              </div>
              <div className="shop-card-info">
                <h3 className="shop-card-title">{product.title}</h3>
                <div className="shop-card-prices">
                  <span className="shop-card-original-price">{product.originalPrice}</span>
                  <span className="shop-card-current-price">{product.price}</span>
                </div>
                <div className="shop-card-actions">
                  {product.isDirectBuy ? (
                    <>
                      <button 
                        className="shop-card-btn-primary" 
                        onClick={() => onBuyNow(product.edition)}
                      >
                        Buy Now
                      </button>
                      <button 
                        className="shop-card-btn-secondary" 
                        onClick={() => onAddToCart(product.edition)}
                        title="Add to Cart"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <a 
                        href={product.notionUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="shop-card-btn-primary"
                      >
                        <ExternalLink size={15} />
                        {product.buttonText}
                      </a>
                      <button 
                        className="shop-card-btn-secondary" 
                        onClick={() => onAddToCart('paperback')}
                        title="Add to Cart"
                      >
                        <ShoppingCart size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

// ===== AUTHOR PAGE VIEW (MATCHING SAGAR'S EDITORIAL LAYOUT WITH VAMSHI CONTENT) =====
function AuthorPageView({ onReadChapter, onGoToShop }) {
  return (
    <main className="author-page-view">
      <div className="container">
        {/* Centered Author Photo at the top */}
        <div className="author-page-hero-img-box">
          <img src="/vamshi-author.jpg" alt="Vamshi — Author of You Made Me Quiet" />
        </div>

        {/* Content matching user's real text and layout */}
        <div className="author-page-body-container">
          <h1 className="author-page-main-title">
            Vamshi C A – Bestselling Author of <em>You Made Me Quiet</em>
          </h1>
          <h2 className="author-page-subtitle">
            Vamshi C A – Author & Storyteller
          </h2>

          <p className="author-page-lead-italic">
            Some stories are written to be read.<br />
            Others are written because there are feelings that were never meant to stay unspoken.
          </p>

          <p className="author-page-paragraph">
            I’m <VamshiName /> C A, author of <em>You Made Me Quiet</em> — an emotional journey about love, care, silence, waiting, and the things we carry when words are no longer enough.
          </p>

          <p className="author-page-paragraph">
            <em>You Made Me Quiet</em> was born from emotions that many people experience but rarely express. It is a story of what happens when someone becomes a part of your world, leaves an unforgettable mark on your heart, and teaches you that not every feeling gets the ending we hope for.
          </p>

          <h3 className="author-page-section-heading">From Feelings to Pages</h3>

          <p className="author-page-paragraph">
            <em>You Made Me Quiet</em> is more than just a love story. It is a journey through:
          </p>

          <ul className="author-page-list">
            <li className="author-page-list-item">
              <strong>Unspoken Love:</strong> The feelings we carry even when we cannot say them.
            </li>
            <li className="author-page-list-item">
              <strong>Waiting:</strong> The hope, uncertainty, and emotions that come with waiting for an answer.
            </li>
            <li className="author-page-list-item">
              <strong>Care & Connection:</strong> How one person can become deeply meaningful in our lives.
            </li>
            <li className="author-page-list-item">
              <strong>Silence:</strong> The things we say without words and the emotions hidden behind them.
            </li>
            <li className="author-page-list-item">
              <strong>Healing:</strong> Learning to move forward while still respecting what once meant everything.
            </li>
          </ul>

          <h3 className="author-page-section-heading">More Than a Love Story — A Community of Resilience</h3>

          <p className="author-page-paragraph">
            Today, <em>You Made Me Quiet</em> is a recognized Bestseller, building a community of readers who value resilience, deep care, and the power of genuine human connection.
          </p>

          <p className="author-page-paragraph">
            A book only succeeds when a reader carries it in their heart. Thank you for being part of this journey.
          </p>

          <div className="author-page-actions">
            <button 
              className="author-page-read-link"
              onClick={onReadChapter}
            >
              Read the Book &rarr;
            </button>

            <button 
              className="author-page-cta-btn"
              onClick={onGoToShop}
            >
              Click here to read full story
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ===== ABOUT THE BOOK PAGE VIEW (MATCHING SAGAR'S EDITORIAL LAYOUT) =====
function BookPageView({ onReadChapter, onGoToShop }) {
  return (
    <main className="author-page-view">
      <div className="container">
        {/* Centered Author Photo at the top */}
        <div className="author-page-hero-img-box">
          <img src="/vamshi-author.jpg" alt="Vamshi with You Made Me Quiet" />
        </div>

        <div className="author-page-body-container">
          <h1 className="author-page-main-title">
            About <em>You Made Me Quiet</em> – A Story of Love, Silence, Expectations &amp; Letting Go
          </h1>

          <p className="author-page-lead-italic">
            Sometimes, we don't stop loving someone.<br />
            We simply learn to stay silent about it.
          </p>

          <p className="author-page-paragraph">
            <em>You Made Me Quiet</em> is a deeply emotional story about love that isn't always returned, conversations that remain unfinished, and the painful distance between two people who once meant everything to each other.
          </p>

          <h2 className="author-page-section-heading">About You Made Me Quiet</h2>

          <p className="author-page-paragraph">
            <em>You Made Me Quiet</em> is a story about the kind of love that asks for nothing but still hurts when it receives nothing.
          </p>

          <p className="author-page-paragraph">
            It is about waiting for replies, waiting for calls, holding onto promises, and slowly realizing that sometimes you're the only one trying to keep a connection alive.
          </p>

          <p className="author-page-paragraph">
            Through love, friendship, silence and heartbreak, the story explores what happens when you finally understand that loving someone doesn't always mean you have to keep holding on.
          </p>

          <h2 className="author-page-section-heading">Where It All Begins</h2>

          <p className="author-page-paragraph">
            It begins with a connection.<br />
            A few conversations.<br />
            A friendship that slowly becomes something more.<br />
            And then, without realizing it, one person starts feeling much more than the other.
          </p>

          <h2 className="author-page-section-heading">A Love That Was Never Equal</h2>

          <p className="author-page-paragraph">
            There are moments when you keep asking yourself:<br />
            “Why am I always waiting?”<br />
            Why does one message mean so much to you while it means so little to them?<br />
            Why do you keep making time for someone who can barely make time for you?<br />
            And how long can you keep loving someone who keeps making you feel like an option?
          </p>

          <h2 className="author-page-section-heading">Why This Book?</h2>

          <p className="author-page-paragraph">
            This is not simply a love story. It is for anyone who has waited for a reply, stayed awake for a call, misunderstood silence, held onto hope, or loved someone a little more than they were loved back.
          </p>

          <p className="author-page-paragraph">
            If you've ever had someone who made you feel everything—and then made you learn how to feel nothing—<strong>this book is for you.</strong>
          </p>

          <p className="author-page-lead-italic" style={{ marginTop: '2.5rem', textAlign: 'center', borderLeft: 'none', paddingLeft: 0 }}>
            “Some stories aren't written with words.<br />
            They are felt with the heart.”
          </p>

          <div className="author-page-actions">
            <button 
              className="author-page-read-link"
              onClick={onGoToShop}
            >
              Get Your Copy Now &rarr;
            </button>

            <button 
              className="author-page-cta-btn"
              onClick={onReadChapter}
            >
              Click here to read full story
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ===== CONTACT PAGE VIEW (MATCHING SAGAR REFERENCE WITH VAMSHI FOOTER INFO) =====
function ContactPageView() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', comment: '' });
  const [status, setStatus] = useState(''); // '' | 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const data = new FormData();
    data.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE");
    data.append("subject", `New Reader Message from ${formData.name || 'Reader'} via Contact Page`);
    data.append("from_name", "WordsOfVamshi Contact Page");
    data.append("to_email", "wordsofvamshi@gmail.com");
    data.append("Name", formData.name);
    data.append("Email", formData.email);
    data.append("Phone Number", formData.phone);
    data.append("Message", formData.comment);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', comment: '' });
      } else {
        // Direct fallback to mailto:wordsofvamshi@gmail.com
        const subject = encodeURIComponent(`Message from ${formData.name || 'Reader'}`);
        const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.comment}`);
        window.open(`mailto:wordsofvamshi@gmail.com?subject=${subject}&body=${body}`, '_blank');
        setStatus('success');
        setFormData({ name: '', email: '', phone: '', comment: '' });
      }
    } catch (err) {
      console.error(err);
      const subject = encodeURIComponent(`Message from ${formData.name || 'Reader'}`);
      const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\nMessage:\n${formData.comment}`);
      window.open(`mailto:wordsofvamshi@gmail.com?subject=${subject}&body=${body}`, '_blank');
      setStatus('success');
    }
  };

  return (
    <main className="contact-page-view">
      <div className="contact-page-container">
        <h1 className="contact-page-title">Contact</h1>

        <p className="contact-page-intro">
          We’d love to hear from you. Whether you’ve read the book, are waiting for your order, or simply want to connect, your message is always welcome.
        </p>

        <h2 className="contact-section-title">How Can We Help?</h2>
        <ul className="contact-page-list">
          <li className="contact-page-list-item">Have questions about your order?</li>
          <li className="contact-page-list-item">Want to share how the book impacted you?</li>
          <li className="contact-page-list-item">Need support or want to reach out directly to the author’s team?</li>
        </ul>
        <p className="contact-page-intro" style={{ marginBottom: '2rem' }}>
          We are here for you, just like the story promises.
        </p>

        <h2 className="contact-section-title">Direct Contact:</h2>
        <div className="contact-info-block">
          <p><strong>Email:</strong> <a href="mailto:wordsofvamshi@gmail.com">wordsofvamshi@gmail.com</a></p>
          <p><strong>Instagram:</strong> <a href="https://www.instagram.com/wordsofvamshi?igsh=MXd4cGhxMWx0ZzQ1ZA%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer">@wordsofvamshi</a></p>
        </div>

        <h2 className="contact-section-title">Business Address:</h2>
        <div className="contact-address-block">
          <p><strong>WordsOfVamshi</strong></p>
          <p>#2 Kallappa Layout, Teachers Colony, Vapasandra</p>
          <p>Chickballapura, Karnataka - 562101, India</p>
          <p style={{ marginTop: '0.5rem', color: '#666' }}><strong>Working Days:</strong> Monday – Sunday (10 AM to 8 PM)</p>
        </div>

        <h2 className="contact-section-title">Order & Delivery Support</h2>
        <p className="contact-page-intro">
          Please note: Due to overwhelming demand, shipping may take a little longer than usual. We are working hard to deliver your order as soon as possible. Thank you for your patience and understanding.
        </p>

        <h2 className="contact-section-title">Your Story Matters</h2>
        <p className="contact-page-intro" style={{ marginBottom: '1.5rem' }}>
          If you’ve finished reading <em>You Made Me Quiet</em>, we would love to hear your thoughts. Your experience can help guide other readers on their journey.
        </p>

        {status === 'success' && (
          <div className="contact-status-banner success">
            <CheckCircle size={20} />
            <span>Thank you for reaching out! Your message has been sent directly to Vamshi.</span>
          </div>
        )}

        <form className="contact-form-wrapper" onSubmit={handleSubmit}>
          <div className="contact-form-grid-2">
            <input 
              type="text"
              className="contact-input"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input 
              type="email"
              required
              className="contact-input"
              placeholder="Email *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="contact-form-group">
            <input 
              type="tel"
              className="contact-input"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="contact-form-group">
            <textarea 
              required
              className="contact-textarea"
              placeholder="Comment"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className="contact-submit-btn"
            disabled={status === 'sending'}
          >
            {status === 'sending' ? (
              <>
                <Send size={16} className="animate-spin" />
                Sending...
              </>
            ) : 'Send'}
          </button>
        </form>
      </div>
    </main>
  );
}

// ===== INVITE VAMSHI PAGE VIEW (MATCHING SAGAR'S EDITORIAL INVITE PAGE) =====
function InvitePageView() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    organization: '',
    date: '',
    message: ''
  });
  const [status, setStatus] = useState(''); // '' | 'sending' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    const fullName = `${formData.firstName} ${formData.lastName}`.trim();
    const data = new FormData();
    data.append("access_key", import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE");
    data.append("subject", `New Speaking / Event Invitation from ${fullName || 'Guest'} (${formData.organization || 'Organization'})`);
    data.append("from_name", "WordsOfVamshi Invite Form");
    data.append("to_email", "wordsofvamshi@gmail.com");
    data.append("First Name", formData.firstName);
    data.append("Last Name", formData.lastName);
    data.append("Email", formData.email);
    data.append("Phone Number", formData.phone);
    data.append("Organization", formData.organization);
    data.append("Tentative Date", formData.date);
    data.append("Message", formData.message);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });
      const result = await res.json();
      if (result.success) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', organization: '', date: '', message: '' });
      } else {
        const subject = encodeURIComponent(`Speaking Invitation from ${fullName} - ${formData.organization}`);
        const body = encodeURIComponent(
          `Name: ${fullName}\n` +
          `Organization: ${formData.organization}\n` +
          `Email: ${formData.email}\n` +
          `Phone: ${formData.phone}\n` +
          `Tentative Date: ${formData.date}\n\n` +
          `Message:\n${formData.message}`
        );
        window.open(`mailto:wordsofvamshi@gmail.com?subject=${subject}&body=${body}`, '_blank');
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', organization: '', date: '', message: '' });
      }
    } catch (err) {
      console.error(err);
      const subject = encodeURIComponent(`Speaking Invitation from ${fullName} - ${formData.organization}`);
      const body = encodeURIComponent(
        `Name: ${fullName}\n` +
        `Organization: ${formData.organization}\n` +
        `Email: ${formData.email}\n` +
        `Phone: ${formData.phone}\n` +
        `Tentative Date: ${formData.date}\n\n` +
        `Message:\n${formData.message}`
      );
      window.open(`mailto:wordsofvamshi@gmail.com?subject=${subject}&body=${body}`, '_blank');
      setStatus('success');
    }
  };

  return (
    <main className="invite-page-view">
      <div className="invite-page-container">
        <h1 className="invite-page-title">Let’s share a story together.</h1>

        <p className="invite-page-intro">
          I believe in the power of shared stories. I love speaking to different groups about connection and the journey of writing. From the themes of my book, <em>You Made Me Quiet</em>, to the lessons learned through writing and storytelling, I am here to inspire your audience.
        </p>

        <p className="invite-page-note">
          Please fill out the form below to get started. I usually plan my schedule 4-6 weeks in advance to give every event my full focus.
        </p>

        {status === 'success' && (
          <div className="contact-status-banner success" style={{ maxWidth: '740px', margin: '0 auto 2rem' }}>
            <CheckCircle size={20} />
            <span>Thank you! Your invitation request has been sent directly to Vamshi.</span>
          </div>
        )}

        <div className="invite-card-form">
          <form onSubmit={handleSubmit}>
            <div className="invite-form-grid-2">
              <div className="invite-form-group" style={{ marginBottom: 0 }}>
                <label className="invite-label">First Name *</label>
                <input 
                  type="text"
                  required
                  className="invite-input"
                  placeholder="Your first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>

              <div className="invite-form-group" style={{ marginBottom: 0 }}>
                <label className="invite-label">Last Name *</label>
                <input 
                  type="text"
                  required
                  className="invite-input"
                  placeholder="Your last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>

            <div className="invite-form-group">
              <label className="invite-label">Email *</label>
              <input 
                type="email"
                required
                className="invite-input"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="invite-form-group">
              <label className="invite-label">Phone Number</label>
              <input 
                type="tel"
                className="invite-input"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="invite-form-group">
              <label className="invite-label">Your Organization (School, College, or Company) *</label>
              <input 
                type="text"
                required
                className="invite-input"
                placeholder="Name of your organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>

            <div className="invite-form-group">
              <label className="invite-label">Tentative Date</label>
              <input 
                type="text"
                className="invite-input"
                placeholder="DD/MM/YYYY"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="invite-form-group">
              <label className="invite-label">Any additional details or message for me?</label>
              <textarea 
                className="invite-textarea"
                placeholder="Share any specific topics, audience details, or questions you have..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              className="invite-submit-btn"
              disabled={status === 'sending'}
            >
              {status === 'sending' ? (
                <>
                  <Send size={16} className="animate-spin" />
                  Sending Request...
                </>
              ) : 'Send Request'}
            </button>
          </form>
        </div>
      </div>
    </main>
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
  const [currentPage, setCurrentPage] = useState('home'); // 'home' | 'shop' | 'author' | 'book' | 'contact' | 'invite'
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

  const navigateTo = (target) => {
    setMobileMenuOpen(false);
    if (target === 'shop') {
      setCurrentPage('shop');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (target === 'author-page' || target === 'author-bio' || target === 'about-author') {
      setCurrentPage('author');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (target === 'book' || target === 'about-book' || target === 'book-page') {
      setCurrentPage('book');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (target === 'contact' || target === 'contact-page') {
      setCurrentPage('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (target === 'invite' || target === 'invite-vamshi' || target === 'invite-page') {
      setCurrentPage('invite');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (target === 'home') {
      setCurrentPage('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (currentPage !== 'home') {
      setCurrentPage('home');
      setTimeout(() => {
        const el = document.getElementById(target);
        if (el) {
          const offset = window.innerWidth <= 768 ? 108 : 72;
          const y = el.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 50);
      return;
    }
    const el = document.getElementById(target);
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
          <span className="ticker-item">Every copy includes a Chikkaballapur-themed bookmark + personal letter from Vamshi.</span>
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
          <span className="ticker-item">Every copy includes a Chikkaballapur-themed bookmark + personal letter from Vamshi.</span>
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
          {/* Mobile Toggle on Far Left */}
          <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle navigation menu">
            {mobileMenuOpen ? <X size={26} strokeWidth={2.2} /> : <Menu size={26} strokeWidth={2.2} />}
          </div>

          {/* Centered Brand Signature Logo */}
          <div className="nav-logo" onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }} style={{ cursor: 'pointer' }}>
            <BrandLogo variant="navbar" withQuill />
          </div>

          {/* Navigation Links & Mobile Drawer */}
          <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <button className={`nav-link ${currentPage === 'home' && !motherPageOpen ? 'active' : ''}`} onClick={() => { navigateTo('home'); setMobileMenuOpen(false); }}>Home</button>
            <button className={`nav-link ${currentPage === 'shop' && !motherPageOpen ? 'active' : ''}`} onClick={() => { navigateTo('shop'); setMobileMenuOpen(false); }}>Shop</button>
            <button className={`nav-link ${currentPage === 'author' && !motherPageOpen ? 'active' : ''}`} onClick={() => { navigateTo('author-page'); setMobileMenuOpen(false); }}>About The Author</button>
            <button className={`nav-link ${currentPage === 'book' && !motherPageOpen ? 'active' : ''}`} onClick={() => { navigateTo('book'); setMobileMenuOpen(false); }}>About The Book</button>
            <button className={`nav-link ${currentPage === 'contact' && !motherPageOpen ? 'active' : ''}`} onClick={() => { navigateTo('contact'); setMobileMenuOpen(false); }}>Contact</button>
            <button className={`nav-link ${currentPage === 'invite' && !motherPageOpen ? 'active' : ''}`} onClick={() => { navigateTo('invite'); setMobileMenuOpen(false); }}>Invite Vamshi</button>
            <button className="nav-link" onClick={() => { setPolicyModal('shipping'); setMobileMenuOpen(false); }}>Track Your Order</button>
            <button className={`nav-link ${motherPageOpen ? 'active' : ''}`} onClick={() => { setMotherPageOpen(true); setMobileMenuOpen(false); }}>For My Mother</button>

            {/* Mobile Drawer Bottom Section (Log in + Vamshi's Gmail + Socials) */}
            <div className="mobile-drawer-footer">
              <div className="mobile-drawer-auth">
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="mobile-drawer-login-btn" onClick={() => setMobileMenuOpen(false)}>
                      <User size={18} strokeWidth={2.2} />
                      <span>Log in</span>
                    </button>
                  </SignInButton>
                </SignedOut>
                <SignedIn>
                  <div className="mobile-drawer-logged-in">
                    <UserButton showName />
                  </div>
                </SignedIn>
              </div>

              <div className="mobile-drawer-email-row">
                <a href="mailto:wordsofvamshi@gmail.com" className="mobile-drawer-email-link">
                  <Mail size={16} />
                  <span>wordsofvamshi@gmail.com</span>
                </a>
              </div>

              <div className="mobile-drawer-socials">
                <a href="https://instagram.com/wordsofvamshi" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="mobile-drawer-social-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                </a>
                <a href="mailto:wordsofvamshi@gmail.com" aria-label="Email" className="mobile-drawer-social-icon">
                  <Mail size={20} strokeWidth={2} />
                </a>
              </div>
            </div>
          </div>

          {/* Action Icons on Far Right */}
          <div className="nav-icons">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}><Search size={20} strokeWidth={2.5} /></button>
            <SignedOut>
              <SignInButton mode="modal">
                <button className="icon-btn" aria-label="Account">
                  <User size={20} strokeWidth={2.5} />
                </button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="clerk-user-wrapper" style={{ display: 'flex', alignItems: 'center', marginLeft: '0.25rem' }}>
                <UserButton />
              </div>
            </SignedIn>
            <button className="icon-btn" aria-label="Cart" onClick={() => setCartOpen(true)}><ShoppingBag size={20} strokeWidth={2.5} /></button>
          </div>
        </div>
      </nav>

      {/* Page Content: Home vs Shop */}
      {currentPage === 'home' ? (
        <>
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
                Buy Now
              </button>
              <button className="btn-secondary" onClick={() => setReadingChapter1(true)}>
                <BookOpen size={18} />
                Read Chapter 1
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

      {/* ===== OFFICIAL SPOTLIGHT ===== */}
      <section className="page-section spotlight-section">
        <div className="container spotlight-grid">
          <div className="spotlight-left">
            <div className="spotlight-book-wrapper">
              <img src="/book-cover-quiet.png" alt="You Made Me Quiet — Book Cover" className="spotlight-book-img" />
              <div className="spotlight-bestseller-seal">
                <span>BEST</span>
                <span>SELLER</span>
              </div>
            </div>
          </div>
          <div className="spotlight-right">
            <div className="spotlight-tag">🏆 Official Spotlight</div>
            <h2 className="spotlight-title">
              THE STORY THAT<br />REACHED 53K<br />HEARTS.
            </h2>
            <div className="spotlight-stats">
              <div className="spotlight-stat">
                <div className="spotlight-stat-number">53,000+</div>
                <div className="spotlight-stat-label">COPIES SOLD</div>
              </div>
              <div className="spotlight-stat-divider"></div>
              <div className="spotlight-stat">
                <div className="spotlight-stat-number">#1</div>
                <div className="spotlight-stat-label">INDEPENDENT HIT</div>
              </div>
            </div>
            <p className="spotlight-desc">
              Experience the raw, emotional journey of quiet love and healing. <strong>"You Made Me Quiet"</strong> has crossed the 53,000+ copy milestone — making it one of India's most beloved independent books of 2026.
            </p>
            <button className="btn-primary" onClick={() => navigateTo('shop')}>
              <ShoppingCart size={18} />
              Get Your Copy
            </button>
          </div>
        </div>
      </section>

      {/* ===== AUTHOR ===== */}
      <section id="author" className="page-section author-section-v2">
        <div className="container author-v2-grid">
          <div className="author-v2-img-wrapper">
            <img src="/vamshi-author.jpg" alt="Vamshi — Author of You Made Me Quiet" />
            <div className="author-v2-label">THE AUTHOR</div>
          </div>
          <div className="author-v2-content">
            <div className="author-v2-name-watermark">VAMSHI</div>
            <h2 className="author-v2-name">VAMSHI</h2>
            <p className="author-v2-bio">
              <VamshiName /> isn't just an author; he's a storyteller who captures the raw, unfiltered emotions of a generation.
            </p>
            <div className="author-v2-tags">
              <span className="author-v2-tag">POET</span>
              <span className="author-v2-tag">ROMANCE WRITER</span>
              <span className="author-v2-tag">DREAMER</span>
            </div>
            <button className="author-v2-bio-btn" onClick={() => navigateTo('author-page')}>
              READ FULL BIO
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
          <button
            onClick={() => navigateTo('shop')}
            className="btn-primary"
          >
            Get Your Copy Now
          </button>
        </div>
      </section>
        </>
      ) : currentPage === 'shop' ? (
        <ShopCatalogView
          onAddToCart={(edition) => handleAuthGatedAction(() => handleAddToCart(edition))}
          onBuyNow={(edition) => handleAuthGatedAction(() => handleBuyNow(edition))}
        />
      ) : currentPage === 'author' ? (
        <AuthorPageView
          onReadChapter={() => setReadingChapter1(true)}
          onGoToShop={() => navigateTo('shop')}
        />
      ) : currentPage === 'book' ? (
        <BookPageView
          onReadChapter={() => setReadingChapter1(true)}
          onGoToShop={() => navigateTo('shop')}
        />
      ) : currentPage === 'contact' ? (
        <ContactPageView />
      ) : (
        <InvitePageView />
      )}

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
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('shop'); }}>Shop</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('author-page'); }}>About The Author</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('book'); }}>About The Book</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('contact'); }}>Contact</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('invite'); }}>Invite Vamshi</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); setMotherPageOpen(true); }}>For My Mother</a></li>
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
      <SearchModal 
        isOpen={searchOpen} 
        onClose={() => setSearchOpen(false)} 
        onNavigate={navigateTo}
        onOpenChapter1={() => setReadingChapter1(true)}
        onOpenMotherPage={() => setMotherPageOpen(true)}
        onOpenPolicy={(policy) => setPolicyModal(policy)}
      />

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
