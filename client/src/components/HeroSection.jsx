import React from 'react';
import { Sparkles, ArrowRight, Eye, ShieldCheck, Truck, Palette, Flame } from 'lucide-react';

export const HeroSection = ({ setCurrentTab }) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 sm:pt-14 sm:pb-24 border-b border-white/5">
      {/* Subtle background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#E63946]/10 blur-[130px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Value Prop, Pricing & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Offer Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-[#E63946] animate-pulse"></span>
              <span className="text-xs font-mono font-semibold tracking-wide text-gray-300 uppercase">
                NEPAL'S #1 CUSTOM APPAREL PLATFORM
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold font-mono bg-[#E0A96D] text-black rounded">
                LIMITED DROP
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.05]">
              Wear your own vision with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E63946] via-[#FF6B6B] to-[#E0A96D]">
                Dhango Nepal.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-gray-300 max-w-xl font-normal leading-relaxed">
              Design custom t-shirts in an interactive 3D WebGL studio, try them on live using real-time camera tracking, and pay securely via QR transfer.
            </p>

            {/* Prominent Pricing Banner: Rs. 1,500 active, Rs. 2,000 crossed out */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#12151C]/90 border border-white/10 max-w-md shadow-xl flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono uppercase text-gray-400 tracking-wider block mb-0.5">
                  Custom Printed T-Shirt
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    Rs. 1,500
                  </span>
                  <span className="text-lg sm:text-xl font-medium text-gray-500 line-through">
                    Rs. 2,000
                  </span>
                  <span className="px-2 py-0.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 rounded-md">
                    SAVE RS. 500
                  </span>
                </div>
              </div>
              <div className="text-right border-l border-white/10 pl-4">
                <span className="text-[11px] font-mono text-gray-400 block">DTG Quality</span>
                <span className="text-xs font-semibold text-white">100% Cotton</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentTab('studio')}
                className="flex items-center justify-center gap-2.5 px-6 py-4 bg-[#E63946] hover:bg-[#d42c39] text-white font-semibold rounded-xl btn-tactile shadow-xl shadow-[#E63946]/25 transition text-base"
              >
                <Palette className="w-5 h-5" />
                <span>Start 3D Design Studio</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setCurrentTab('tryon')}
                className="flex items-center justify-center gap-2.5 px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/15 text-white font-semibold rounded-xl btn-tactile transition text-base backdrop-blur-sm"
              >
                <Eye className="w-5 h-5 text-[#E0A96D]" />
                <span>Live Virtual Try-On</span>
              </button>
            </div>

            {/* Micro Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-medium text-gray-400">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Delivery Across Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>Fonepay / eSewa QR Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#E63946]" />
                <span>Super-Combed 220 GSM</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame */}
              <div className="relative p-3 rounded-3xl bg-gradient-to-b from-white/15 to-white/5 border border-white/10 shadow-2xl backdrop-blur-md">
                
                {/* Visual Canvas Display */}
                <div className="relative aspect-[4/5] rounded-2xl bg-[#0F1218] overflow-hidden flex flex-col items-center justify-center p-6 border border-white/5">
                  
                  {/* Floating 360° Studio Tag */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-[11px] font-mono font-medium text-white shadow">
                    <Sparkles className="w-3.5 h-3.5 text-[#E63946]" />
                    <span>360° Interactive Canvas</span>
                  </div>

                  <div className="absolute top-4 right-4 z-20 px-2.5 py-1 bg-[#E63946] text-white rounded-lg text-xs font-black font-mono shadow">
                    Rs. 1,500
                  </div>

                  {/* 3D T-Shirt Graphic Representation */}
                  <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center group cursor-pointer"
                       onClick={() => setCurrentTab('studio')}>
                    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[0_25px_35px_rgba(0,0,0,0.6)] transform group-hover:scale-105 transition duration-300">
                      {/* T-Shirt Silhouette */}
                      <path
                        d="M 50 40 L 75 40 C 80 50 120 50 125 40 L 150 40 L 180 75 L 155 95 L 145 80 L 145 170 C 145 175 140 180 135 180 L 65 180 C 60 180 55 175 55 170 L 55 80 L 45 95 L 20 75 Z"
                        fill="#16181F"
                        stroke="#2B303C"
                        strokeWidth="2.5"
                      />
                      {/* Collar Ribbing */}
                      <path
                        d="M 75 40 C 85 55 115 55 125 40"
                        fill="none"
                        stroke="#E63946"
                        strokeWidth="3.5"
                      />
                      {/* Central Custom Print Zone with Dhango Stamp */}
                      <rect x="75" y="75" width="50" height="60" rx="4" fill="rgba(230, 57, 70, 0.15)" stroke="rgba(230, 57, 70, 0.4)" strokeDasharray="3 3" />
                      <circle cx="100" cy="100" r="16" fill="#E63946" fillOpacity="0.8" />
                      <text x="100" y="104" textAnchor="middle" fill="#FFFFFF" fontSize="10" fontWeight="bold" fontFamily="sans-serif">DHG</text>
                      <text x="100" y="125" textAnchor="middle" fill="#E0A96D" fontSize="7" fontWeight="bold" fontFamily="sans-serif">NEPAL</text>
                    </svg>

                    {/* Interactive hover ripple */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                      <span className="px-3.5 py-1.5 bg-black/80 backdrop-blur-md border border-white/20 rounded-xl text-xs font-semibold text-white shadow-2xl">
                        Click to Customize ➔
                      </span>
                    </div>
                  </div>

                  {/* Garment Details & Color Selector Preview */}
                  <div className="w-full mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-white">Classic Fit (Black)</p>
                      <p className="text-[10px] text-gray-400 font-mono">100% Cotton · 220 GSM</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-4 h-4 rounded-full bg-[#111111] border-2 border-white shadow"></span>
                      <span className="w-4 h-4 rounded-full bg-white border border-gray-400"></span>
                      <span className="w-4 h-4 rounded-full bg-[#9E9E9E]"></span>
                      <span className="w-4 h-4 rounded-full bg-[#1B2A4A]"></span>
                    </div>
                  </div>

                </div>

                {/* Floating Customer Stat Badge */}
                <div className="absolute -bottom-4 -left-3 sm:-left-6 px-4 py-2.5 bg-[#12151C] border border-white/10 rounded-xl shadow-2xl flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-7 h-7 rounded-full bg-[#E63946] flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#12151C]">KTM</div>
                    <div className="w-7 h-7 rounded-full bg-[#E0A96D] flex items-center justify-center text-[10px] font-bold text-black border-2 border-[#12151C]">PKR</div>
                    <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white border-2 border-[#12151C]">BRT</div>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-tight">1,200+ Delivered</p>
                    <p className="text-[10px] text-gray-400">Across All Nepal</p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
