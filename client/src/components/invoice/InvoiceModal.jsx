import React from 'react';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

export const InvoiceModal = ({ order, isOpen, onClose }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl my-8 bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden print:p-0 print:m-0 print:border-none print:shadow-none print:w-full">
        
        {/* Modal Top Bar (Hidden during print) */}
        <div className="p-4 bg-gray-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-[#E63946]">TAX INVOICE</span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-300 font-mono">{order.orderId}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E63946] hover:bg-[#d42c39] text-white text-xs font-bold rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-8 sm:p-10 space-y-6">
          
          {/* Header Row */}
          <div className="flex items-start justify-between border-b pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-extrabold text-2xl tracking-tight text-gray-900 font-display">
                  DHANGO NEPAL
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-black text-white rounded">
                  APPAREL
                </span>
              </div>
              <p className="text-xs text-gray-600">Custom T-Shirt Printing Studio</p>
              <p className="text-xs text-gray-600">New Baneshwor, Kathmandu, Nepal</p>
              <p className="text-xs text-gray-600 font-mono">PAN / VAT: 619284735</p>
              <p className="text-xs text-gray-600">Phone: +977-9800000000</p>
            </div>

            <div className="text-right">
              <span className="text-xs font-mono font-bold uppercase text-gray-500 block">
                INVOICE NUMBER
              </span>
              <p className="text-base font-extrabold font-mono text-gray-900">
                INV-{order.orderId}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Date: {new Date(order.createdAt || Date.now()).toLocaleDateString('en-NP', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
              <span className="inline-block mt-2 px-2.5 py-0.5 text-[10px] font-bold font-mono uppercase bg-emerald-100 text-emerald-800 rounded">
                PAYMENT: QR VERIFIED
              </span>
            </div>
          </div>

          {/* Customer & Shipping Row */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b pb-6">
            <div>
              <span className="font-mono font-bold text-gray-500 uppercase block mb-1">Billed & Shipped To:</span>
              <p className="font-bold text-gray-900 text-sm">{order.customer?.name}</p>
              <p className="text-gray-700 font-mono">{order.customer?.phone}</p>
              <p className="text-gray-700">{order.customer?.streetAddress}</p>
              <p className="text-gray-700">{order.customer?.city}, {order.customer?.province}</p>
            </div>

            <div>
              <span className="font-mono font-bold text-gray-500 uppercase block mb-1">Payment Details:</span>
              <p className="text-gray-700"><span className="font-semibold">Method:</span> Fonepay / eSewa QR Transfer</p>
              <p className="text-gray-700 font-mono"><span className="font-semibold">Txn Ref ID:</span> {order.payment?.transactionCode || 'N/A'}</p>
              <p className="text-gray-700"><span className="font-semibold">Status:</span> {order.payment?.status?.toUpperCase() || 'PENDING VERIFICATION'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b font-mono font-bold text-gray-600 uppercase">
                  <th className="py-2">Item Description</th>
                  <th className="py-2">Variant</th>
                  <th className="py-2 text-center">Qty</th>
                  <th className="py-2 text-right">Unit Rate</th>
                  <th className="py-2 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(order.items || []).map((item, idx) => (
                  <tr key={idx} className="text-gray-800">
                    <td className="py-3 font-medium">
                      {item.title}
                      <span className="block text-[11px] text-gray-500">100% Super-Combed Cotton (DTG Print)</span>
                    </td>
                    <td className="py-3 font-mono">
                      {item.color} · {item.size}
                    </td>
                    <td className="py-3 text-center font-mono">
                      {item.quantity}
                    </td>
                    <td className="py-3 text-right font-mono">
                      Rs. {item.unitPrice || 1500}
                    </td>
                    <td className="py-3 text-right font-mono font-bold">
                      Rs. {(item.unitPrice || 1500) * (item.quantity || 1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Breakdown */}
          <div className="border-t pt-4 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal (Offer Rate):</span>
                <span className="font-mono font-semibold">Rs. {order.totalAmount}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery (Nepal):</span>
                <span className="font-mono font-semibold text-emerald-700">FREE</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-gray-900 border-t pt-2">
                <span>Total Payable:</span>
                <span className="font-mono text-[#E63946]">Rs. {order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="pt-6 border-t text-[11px] text-gray-500 text-center space-y-1">
            <p className="font-medium">Thank you for choosing Dhango Nepal for your custom apparel.</p>
            <p>For inquiries or tracking support, contact orders@dhangonepal.com or +977-9800000000.</p>
          </div>

        </div>

      </div>
    </div>
  );
};
