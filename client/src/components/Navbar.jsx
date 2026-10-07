import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, Sparkles, User, Search, Menu, X, ShieldCheck, Compass, MessageCircle } from 'lucide-react';

export const Navbar = ({ currentTab, setCurrentTab }) => {
  const { totalQuantity, setIsCartOpen } = useCart();
  const { user, setIsAuthModalOpen, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'shop', label: 'Shop Catalog' },
    { id: 'studio', label: '3D Studio', badge: '360°' },
    { id: 'tryon', label: 'Virtual Try-On', badge: 'Live' },
    { id: 'track', label: 'Track Order' },
    { id: 'admin', label: 'Admin Portal' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setCurrentTab('shop')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#E63946]/50 transition shadow-lg">
              <img 
                src="/logo.jpg" 
                alt="Dhango Nepal" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-[#E63946] transition">
                  DHANGO
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono tracking-wider bg-[#E63946] text-white rounded">
                  NEPAL
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono tracking-wider">
                CUSTOM T-SHIRT STUDIO
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setCurrentTab(link.id)}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition btn-tactile ${
                  currentTab === link.id
                    ? 'text-white bg-white/10 shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
                {link.badge && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold font-mono text-[#E63946] bg-[#E63946]/15 border border-[#E63946]/25 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Actions: WhatsApp + User Auth + Cart Drawer */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct WhatsApp Contact */}
            <a
              href="https://wa.me/9779800000000?text=Namaste%20Dhango%20Nepal,%20I%20have%20an%20inquiry%20regarding%20custom%20t-shirt%20printing."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-2 px-3 py-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-xl hover:bg-emerald-900/40 transition btn-tactile"
              title="Chat with Dhango Nepal on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>

            {/* Auth / Account */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white hover:bg-white/10 transition btn-tactile">
                  <div className="w-6 h-6 rounded-full bg-[#E63946] flex items-center justify-center font-bold text-[11px] text-white">
                    {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                  </div>
                  <span className="hidden sm:inline font-medium max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </button>
                <div className="absolute right-0 mt-2 w-48 py-2 bg-[#12151C] border border-white/10 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition duration-150 z-50">
                  <div className="px-4 py-2 border-b border-white/5">
                    <p className="text-xs text-white font-medium truncate">{user.displayName}</p>
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setCurrentTab('track')}
                    className="w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-white hover:bg-white/5 transition"
                  >
                    My Orders
                  </button>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-950/30 transition"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition btn-tactile"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center justify-center w-10 h-10 bg-[#E63946] hover:bg-[#d42c39] text-white rounded-xl shadow-lg shadow-[#E63946]/25 transition btn-tactile"
              title="View Cart"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white text-gray-900 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-[#0A0C10] shadow animate-bounce">
                  {totalQuantity}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0A0C10]/95 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-fadeIn">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setCurrentTab(link.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition ${
                currentTab === link.id
                  ? 'text-white bg-[#E63946]'
                  : 'text-gray-300 hover:bg-white/5'
              }`}
            >
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-white/20 rounded">
                  {link.badge}
                </span>
              )}
            </button>
          ))}
          <a
            href="https://wa.me/9779800000000"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 mt-3 py-3 text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-xl"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp Customer Support
          </a>
        </div>
      )}
    </header>
  );
};
