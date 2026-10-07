import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { Palette, Eye, ShoppingBag, Check } from 'lucide-react';

export const ProductCard = ({ product, onCustomize, onTryOn }) => {
  const { addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Jet Black');
  const [selectedHex, setSelectedHex] = useState(product.colors[0]?.hex || '#111111');
  const [selectedSize, setSelectedSize] = useState('L');
  const [addedNotice, setAddedNotice] = useState(false);

  const handleQuickAdd = () => {
    addToCart({
      productId: product.id || product._id,
      title: product.title,
      color: selectedColor,
      colorHex: selectedHex,
      size: selectedSize,
      unitPrice: product.salePrice || 1500,
      originalPrice: product.originalPrice || 2000,
      mockupUrl: product.previewImage || '',
      printPlacement: { zone: 'front' }
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1800);
  };

  return (
    <div className="group rounded-2xl bg-[#12151C] border border-white/5 hover:border-white/15 transition duration-300 flex flex-col overflow-hidden shadow-xl">
      
      {/* Product Image Display & Badge */}
      <div className="relative aspect-square w-full bg-[#0F1218] p-6 flex items-center justify-center overflow-hidden border-b border-white/5">
        
        {/* Sale Tag */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5">
          <span className="px-2 py-0.5 text-[10px] font-black font-mono tracking-wider bg-[#E63946] text-white rounded">
            SALE
          </span>
          <span className="px-2 py-0.5 text-[10px] font-bold font-mono bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 rounded">
            SAVE RS. 500
          </span>
        </div>

        {/* Dynamic Graphic SVG Rendering of Selected Shirt Hue */}
        <div className="relative w-48 h-48 sm:w-56 sm:h-56 transform group-hover:scale-105 transition duration-300">
          <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]">
            <path
              d="M 50 40 L 75 40 C 80 50 120 50 125 40 L 150 40 L 180 75 L 155 95 L 145 80 L 145 170 C 145 175 140 180 135 180 L 65 180 C 60 180 55 175 55 170 L 55 80 L 45 95 L 20 75 Z"
              fill={selectedHex}
              stroke="#2B303C"
              strokeWidth="2"
            />
            {/* Subtle Neckline */}
            <path
              d="M 75 40 C 85 55 115 55 125 40"
              fill="none"
              stroke={selectedHex === '#FFFFFF' ? '#CCCCCC' : '#444444'}
              strokeWidth="2.5"
            />
            {/* Stamp Logo */}
            <circle cx="100" cy="100" r="14" fill="#E63946" fillOpacity="0.85" />
            <text x="100" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DHG</text>
            <text x="100" y="122" textAnchor="middle" fill="#E0A96D" fontSize="6" fontWeight="bold" fontFamily="sans-serif">NEPAL</text>
          </svg>
        </div>

        {/* Quick Action Overlay */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
          <button
            onClick={() => onCustomize(product, selectedColor, selectedHex)}
            className="flex-1 py-2 px-3 bg-black/80 hover:bg-black text-white text-xs font-semibold rounded-xl border border-white/20 backdrop-blur-md flex items-center justify-center gap-1.5 transition btn-tactile shadow-lg"
          >
            <Palette className="w-3.5 h-3.5 text-[#E63946]" />
            <span>Customize 3D</span>
          </button>
          <button
            onClick={() => onTryOn(product, selectedColor, selectedHex)}
            className="py-2 px-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 backdrop-blur-md flex items-center justify-center gap-1.5 transition btn-tactile shadow-lg"
            title="Try On Live"
          >
            <Eye className="w-3.5 h-3.5 text-[#E0A96D]" />
          </button>
        </div>

      </div>

      {/* Product Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-gray-400">
              {product.category || 'Custom Apparel'}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              ● In Stock
            </span>
          </div>
          <h3 className="text-base font-bold text-white font-display line-clamp-1 group-hover:text-[#E63946] transition">
            {product.title}
          </h3>
          <p className="mt-1 text-xs text-gray-400 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Color Swatches */}
        <div>
          <span className="text-[11px] font-medium text-gray-400 mb-1.5 block">
            Color: <span className="text-white font-semibold">{selectedColor}</span>
          </span>
          <div className="flex items-center gap-2">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setSelectedColor(c.name);
                  setSelectedHex(c.hex);
                }}
                className={`w-6 h-6 rounded-full border-2 transition ${
                  selectedColor === c.name
                    ? 'border-[#E63946] scale-110 shadow-lg'
                    : 'border-transparent hover:border-white/40'
                }`}
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <span className="text-[11px] font-medium text-gray-400 mb-1.5 block">
            Size: <span className="text-white font-semibold">{selectedSize}</span>
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`py-1 text-xs font-semibold rounded-lg border transition ${
                  selectedSize === sz
                    ? 'bg-white text-gray-900 border-white'
                    : 'bg-white/5 text-gray-300 border-white/5 hover:border-white/20'
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Pricing & Order CTA */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-3">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold font-display text-white">
                Rs. {product.salePrice || 1500}
              </span>
              <span className="text-xs text-gray-500 line-through">
                Rs. {product.originalPrice || 2000}
              </span>
            </div>
            <span className="text-[10px] text-gray-400 font-mono">Free delivery in KTM</span>
          </div>

          <button
            onClick={handleQuickAdd}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition btn-tactile ${
              addedNotice
                ? 'bg-emerald-600 text-white'
                : 'bg-[#E63946] hover:bg-[#d42c39] text-white shadow-lg shadow-[#E63946]/20'
            }`}
          >
            {addedNotice ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Order Now</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
