import React, { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import { initialProducts } from '../../../server/data/seedData';
import { Sparkles, Filter, Palette } from 'lucide-react';

export const ProductCatalog = ({ onCustomize, onTryOn }) => {
  const [products, setProducts] = useState(initialProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data.length > 0) {
            setProducts(data.data);
          }
        }
      } catch (err) {
        // Fallback to initialProducts
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { id: 'all', label: 'All Silhouettes' },
    { id: 'classic', label: 'Classic Crewneck' },
    { id: 'oversized', label: 'Oversized Boxy' },
    { id: 'streetwear', label: 'Streetwear & Heritage' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  return (
    <section id="catalog" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold tracking-wider text-[#E63946] uppercase bg-[#E63946]/10 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Signature Apparel Blanks
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Curated Canvas Blanks
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl font-normal">
            Choose a premium garment silhouette ready for your custom artwork, photos, or typography. All custom t-shirts are Rs. 1,500.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition btn-tactile ${
                activeCategory === cat.id
                  ? 'bg-white text-gray-900 shadow-lg'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {filteredProducts.map((prod) => (
          <ProductCard
            key={prod.id || prod._id || prod.slug}
            product={prod}
            onCustomize={onCustomize}
            onTryOn={onTryOn}
          />
        ))}
      </div>

      {/* 3D Studio Banner */}
      <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-[#161B26] via-[#1A1F2D] to-[#12151C] border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl text-left">
          <span className="px-3 py-1 text-xs font-mono font-bold text-[#E0A96D] bg-[#E0A96D]/10 rounded-full">
            CUSTOM CREATOR SUITE
          </span>
          <h3 className="text-2xl sm:text-4xl font-extrabold font-display text-white">
            Want to start from a blank canvas?
          </h3>
          <p className="text-sm text-gray-300 font-normal leading-relaxed">
            Upload your high-res design, add stylized Nepali or English text, adjust scales in 360° 3D, and generate production-ready 300 DPI exports.
          </p>
        </div>
        <button
          onClick={() => onCustomize(products[0], 'Jet Black', '#111111')}
          className="flex items-center gap-2 px-8 py-4 bg-[#E63946] hover:bg-[#d42c39] text-white font-bold rounded-2xl btn-tactile shadow-xl shadow-[#E63946]/25 transition shrink-0 text-base"
        >
          <Palette className="w-5 h-5" />
          <span>Launch 3D Studio</span>
        </button>
      </div>

    </section>
  );
};
