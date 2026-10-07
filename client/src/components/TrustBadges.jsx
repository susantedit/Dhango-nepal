import React from 'react';
import { ShieldCheck, Truck, Sparkles, RefreshCw, Layers, Award } from 'lucide-react';

export const TrustBadges = () => {
  const features = [
    {
      icon: Layers,
      title: '220 GSM Combed Cotton',
      description: 'Super-soft, pre-shrunk, heavyweight ring-spun fabric designed for all-day comfort.'
    },
    {
      icon: Sparkles,
      title: 'HD Direct-to-Garment',
      description: 'Ultra-high color gamut pigment ink that breathes with the fabric and will not crack or peel.'
    },
    {
      icon: Truck,
      title: 'Delivery Across Nepal',
      description: 'Fast doorstep dispatch to Kathmandu, Pokhara, Chitwan, Dharan, Butwal, and beyond.'
    },
    {
      icon: ShieldCheck,
      title: 'Transparent QR Payment',
      description: 'Pay securely via Fonepay or eSewa with screenshot slip verification. Zero hidden fees.'
    }
  ];

  return (
    <section className="py-12 border-b border-white/5 bg-[#0C0E14]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#12151C]/60 border border-white/5 hover:border-white/10 transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#E63946] mb-4 group-hover:scale-110 group-hover:bg-[#E63946]/10 transition">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white mb-1.5 font-display">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
