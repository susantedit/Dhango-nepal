import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { TrustBadges } from './components/TrustBadges';
import { ProductCatalog } from './components/ProductCatalog';
import { StudioStudio } from './components/studio/StudioStudio';
import { VirtualTryOn } from './components/tryon/VirtualTryOn';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { InvoiceModal } from './components/invoice/InvoiceModal';
import { AuthModal } from './components/AuthModal';
import { TrackOrder } from './pages/TrackOrder';
import { AdminDashboard } from './pages/AdminDashboard';
import { ShieldCheck, MapPin, Phone, Mail, Instagram, Facebook } from 'lucide-react';

export const AppContent = () => {
  const [currentTab, setCurrentTab] = useState('shop'); // 'shop' | 'studio' | 'tryon' | 'track' | 'admin'
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState(null);

  // Studio customizer state carried across views
  const [studioConfig, setStudioConfig] = useState({
    product: null,
    color: 'Jet Black',
    hex: '#111111',
    artwork: null
  });

  const handleStartCustomizing = (product, colorName, hexCode) => {
    setStudioConfig({
      product,
      color: colorName || 'Jet Black',
      hex: hexCode || '#111111',
      artwork: null
    });
    setCurrentTab('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartTryOn = (product, colorName, hexCode) => {
    setStudioConfig({
      product,
      color: colorName || 'Jet Black',
      hex: hexCode || '#111111',
      artwork: null
    });
    setCurrentTab('tryon');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSwitchToTryOn = ({ artwork, color, hex }) => {
    setStudioConfig(prev => ({
      ...prev,
      artwork,
      color,
      hex
    }));
    setCurrentTab('tryon');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#E63946] selection:text-white">
      
      {/* Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Tab Content */}
      <main className="flex-1">
        {currentTab === 'shop' && (
          <div className="animate-fadeIn">
            <HeroSection setCurrentTab={setCurrentTab} />
            <TrustBadges />
            <ProductCatalog
              onCustomize={handleStartCustomizing}
              onTryOn={handleStartTryOn}
            />
          </div>
        )}

        {currentTab === 'studio' && (
          <div className="animate-fadeIn">
            <StudioStudio
              initialProduct={studioConfig.product}
              initialColor={studioConfig.color}
              initialHex={studioConfig.hex}
              onSwitchToTryOn={handleSwitchToTryOn}
            />
          </div>
        )}

        {currentTab === 'tryon' && (
          <div className="animate-fadeIn">
            <VirtualTryOn
              initialArtwork={studioConfig.artwork}
              initialColor={studioConfig.color}
              initialHex={studioConfig.hex}
              onSwitchToStudio={() => setCurrentTab('studio')}
            />
          </div>
        )}

        {currentTab === 'track' && (
          <div className="animate-fadeIn">
            <TrackOrder onOpenInvoice={(order) => setActiveInvoiceOrder(order)} />
          </div>
        )}

        {currentTab === 'admin' && (
          <div className="animate-fadeIn">
            <AdminDashboard onOpenInvoice={(order) => setActiveInvoiceOrder(order)} />
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer onOpenCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setActiveInvoiceOrder(order)}
      />
      <InvoiceModal
        order={activeInvoiceOrder}
        isOpen={!!activeInvoiceOrder}
        onClose={() => setActiveInvoiceOrder(null)}
      />
      <AuthModal />

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#080A0E] pt-12 pb-8 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg text-white font-display">DHANGO NEPAL</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#E63946] text-white rounded">STUDIO</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed">
              Nepal's premier custom apparel printing destination. 3D WebGL preview and zero-delay virtual try-on engine.
            </p>
            <div className="flex items-center gap-2 pt-1 font-mono text-white text-xs">
              <span className="px-2 py-0.5 bg-white/10 rounded">Flat Rs. 1,500</span>
              <span className="text-gray-500 line-through">Rs. 2,000</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase font-mono tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setCurrentTab('shop')} className="hover:text-white transition">Shop Apparel</button></li>
              <li><button onClick={() => setCurrentTab('studio')} className="hover:text-white transition">3D Design Studio</button></li>
              <li><button onClick={() => setCurrentTab('tryon')} className="hover:text-white transition">Virtual Try-On Engine</button></li>
              <li><button onClick={() => setCurrentTab('track')} className="hover:text-white transition">Track Your Order</button></li>
              <li><button onClick={() => setCurrentTab('admin')} className="hover:text-white transition">Admin Portal</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase font-mono tracking-wider mb-3">Nepal Delivery</h4>
            <p className="text-xs text-gray-400 leading-relaxed mb-2">
              Express delivery across all 7 provinces: Kathmandu Valley, Pokhara, Chitwan, Dharan, Butwal, Biratnagar, and Dhangadhi.
            </p>
            <p className="text-emerald-400 font-mono text-[11px]">Free delivery on orders inside Valley.</p>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white uppercase font-mono tracking-wider mb-3">Contact Dhango</h4>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E63946] shrink-0" />
              <span>New Baneshwor, Kathmandu, Nepal</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <Phone className="w-4 h-4 text-[#E0A96D] shrink-0" />
              <span>+977-9800000000</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>orders@dhangonepal.com</span>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-400">
          <p>© 2026 Dhango Nepal. All rights reserved.</p>
          <p>Custom T-Shirt Printing Kathmandu · Designed with Precision</p>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
