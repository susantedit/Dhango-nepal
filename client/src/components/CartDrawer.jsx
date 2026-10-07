import React from 'react';
import { useCart } from '../context/CartContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export const CartDrawer = ({ onOpenCheckout }) => {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    totalQuantity,
    subtotal,
    originalTotal,
    totalSavings
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#10131A] border-l border-white/10 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E63946] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="text-lg font-bold font-display text-white">Your Cart</h3>
              <span className="px-2 py-0.5 text-xs font-mono bg-white/10 text-gray-300 rounded-full">
                {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'}
              </span>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 opacity-30 text-[#E63946]" />
                <p className="text-base font-semibold text-gray-300">Your cart is empty</p>
                <p className="text-xs text-gray-500 mt-1">Design a custom t-shirt in our 3D Studio or catalog to get started.</p>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-[#161A22] border border-white/5 flex gap-4 items-start"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.artworkUrl ? (
                      <img src={item.artworkUrl} alt={item.title} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="w-8 h-8 rounded-full" style={{ backgroundColor: item.colorHex || '#111' }} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{item.title}</h4>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      Size: {item.size} · Color: {item.color}
                    </p>

                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-sm font-extrabold text-white font-display">
                        Rs. {item.unitPrice * item.quantity}
                      </span>
                      <span className="text-[11px] text-gray-500 line-through">
                        Rs. {item.originalPrice * item.quantity}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-white/10 rounded-lg bg-black/40">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-1 hover:text-[#E63946] text-gray-400 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="p-1 hover:text-[#E63946] text-gray-400 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-500 hover:text-red-400 p-1 transition"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cartItems.length > 0 && (
            <div className="p-6 border-t border-white/10 bg-[#0E1117] space-y-4">
              
              {/* Promotional Savings Banner */}
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-medium">Dhango Discount Applied:</span>
                <span className="font-mono font-bold text-emerald-400">Save Rs. {totalSavings}</span>
              </div>

              {/* Price Calculation */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Regular Subtotal</span>
                  <span className="line-through font-mono">Rs. {originalTotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Special Offer Price</span>
                  <span className="font-mono text-white font-bold">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery in Nepal</span>
                  <span className="font-mono text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-white/10">
                  <span>Total Amount</span>
                  <span className="font-display text-[#E63946]">Rs. {subtotal}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onOpenCheckout();
                }}
                className="w-full py-4 bg-[#E63946] hover:bg-[#d42c39] text-white font-extrabold rounded-2xl btn-tactile shadow-xl shadow-[#E63946]/30 flex items-center justify-center gap-2 transition text-sm"
              >
                <span>Proceed to QR Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-gray-400 font-mono">
                Manual QR Transfer via Fonepay / eSewa · Safe & Verified
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
