import React, { useState } from 'react';
import { Search, CheckCircle2, Clock, Package, Truck, AlertCircle, FileText } from 'lucide-react';

export const TrackOrder = ({ onOpenInvoice }) => {
  const [orderIdInput, setOrderIdInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!orderIdInput.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setOrder(null);

    try {
      const url = `/api/orders/track/${encodeURIComponent(orderIdInput.trim())}${phoneInput ? `?phone=${encodeURIComponent(phoneInput.trim())}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.data) {
          setOrder(data.data);
          return;
        }
      }
      
      // Fallback search in localStorage
      const savedOrders = JSON.parse(localStorage.getItem('dhango_local_orders') || '[]');
      const match = savedOrders.find(o => o.orderId.toUpperCase() === orderIdInput.trim().toUpperCase());
      if (match) {
        setOrder(match);
      } else {
        setErrorMsg('Order not found. Please check your Order ID and phone number.');
      }
    } catch (err) {
      setErrorMsg('Error tracking order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 'received', label: 'Order Received', desc: 'QR slip submitted' },
    { id: 'payment_verified', label: 'Payment Verified', desc: 'Reference confirmed' },
    { id: 'in_printing', label: 'In Printing', desc: 'DTG high-density print' },
    { id: 'shipped', label: 'Dispatched', desc: 'Handed to courier' },
    { id: 'delivered', label: 'Delivered', desc: 'Doorstep arrival' }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'received': return 0;
      case 'payment_verified': return 1;
      case 'in_printing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  return (
    <div className="py-12 sm:py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Search Card */}
      <div className="text-center mb-10">
        <span className="text-xs font-mono font-bold text-[#E63946] uppercase tracking-wider">
          REAL-TIME DISPATCH UPDATES
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white mt-1">
          Track Your Custom Order
        </h2>
        <p className="text-xs sm:text-sm text-gray-400 mt-2 max-w-md mx-auto">
          Enter your Dhango Nepal Order Code (e.g. DHG-49281) to view verification, printing, and delivery status.
        </p>

        <form onSubmit={handleTrack} className="mt-8 max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            value={orderIdInput}
            onChange={(e) => setOrderIdInput(e.target.value)}
            placeholder="Order ID (e.g. DHG-12345)"
            className="flex-1 py-3 px-4 bg-[#12151C] border border-white/10 rounded-xl text-white placeholder-gray-500 font-mono text-sm uppercase focus:border-[#E63946] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="py-3 px-6 bg-[#E63946] hover:bg-[#d42c39] text-white font-bold rounded-xl btn-tactile text-sm flex items-center justify-center gap-2 shadow-lg"
          >
            <Search className="w-4 h-4" />
            <span>{loading ? 'Searching...' : 'Track'}</span>
          </button>
        </form>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-xs text-red-300 max-w-md mx-auto">
            {errorMsg}
          </div>
        )}
      </div>

      {/* Order Result Card */}
      {order && (
        <div className="p-6 sm:p-8 bg-[#12151C] border border-white/10 rounded-3xl shadow-2xl space-y-8 animate-fadeIn">
          
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs font-mono text-gray-400">ORDER TRACKING</span>
              <h3 className="text-2xl font-bold font-mono text-white">{order.orderId}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Recipient: <span className="text-white font-semibold">{order.customer?.name}</span> · {order.customer?.city}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                order.payment?.status === 'verified'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                Payment: {order.payment?.status}
              </span>

              <button
                onClick={() => onOpenInvoice(order)}
                className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs text-white transition"
              >
                <FileText className="w-3.5 h-3.5 text-[#E0A96D]" />
                <span>Invoice</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div>
            <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-6">
              Production & Shipping Stepper
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {steps.map((st, idx) => {
                const currentIdx = getStepIndex(order.orderStatus);
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;

                return (
                  <div
                    key={st.id}
                    className={`p-3.5 rounded-2xl border transition ${
                      isCurrent
                        ? 'bg-[#E63946]/10 border-[#E63946] text-white shadow-lg'
                        : isPassed
                        ? 'bg-white/5 border-emerald-800/60 text-gray-300'
                        : 'bg-black/20 border-white/5 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      {isPassed ? (
                        <CheckCircle2 className={`w-4 h-4 ${isCurrent ? 'text-[#E63946]' : 'text-emerald-400'}`} />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-600" />
                      )}
                      <span className="text-xs font-bold font-display">{st.label}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{st.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Items Summary */}
          <div className="pt-6 border-t border-white/10">
            <h4 className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-4">
              Order Items
            </h4>
            <div className="space-y-3">
              {(order.items || []).map((it, idx) => (
                <div key={idx} className="p-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white block">{it.title}</span>
                    <span className="text-gray-400 font-mono">
                      Color: {it.color} · Size: {it.size} · Qty: {it.quantity}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white">
                    Rs. {(it.unitPrice || 1500) * (it.quantity || 1)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
