import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  Layers,
  CheckCircle2,
  XCircle,
  Eye,
  Download,
  AlertTriangle,
  RefreshCw,
  Search,
  Check
} from 'lucide-react';

export const AdminDashboard = ({ onOpenInvoice }) => {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'inventory'
  const [orders, setOrders] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Fetch stats
      const statsRes = await fetch('/api/admin/stats');
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      }

      // Fetch orders
      const ordersRes = await fetch('/api/admin/orders');
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData.data || []);
      }

      // Fetch inventory
      const invRes = await fetch('/api/inventory');
      if (invRes.ok) {
        const invData = await invRes.json();
        setInventory(invData.data || []);
      }
    } catch (err) {
      console.warn('Error fetching admin data, using local store data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Verify payment action
  const handleVerifyPayment = async (orderId, status) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAdminData();
        setSelectedSlip(null);
      }
    } catch (err) {
      console.error('Error verifying payment:', err);
    }
  };

  // Update shipping status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  // Update inventory stock
  const handleStockUpdate = async (sku, newStock) => {
    try {
      const res = await fetch('/api/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, currentStock: newStock })
      });
      if (res.ok) {
        setInventory(prev => prev.map(item => item.sku === sku ? { ...item, currentStock: newStock } : item));
      }
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mb-1">
            <span>DHANGO BACK-OFFICE</span>
            <span>/</span>
            <span className="text-[#E63946] font-bold">MANAGEMENT CONSOLE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            Operations & Orders Dashboard
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdminData}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-gray-300 hover:text-white transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <div className="flex p-1 bg-black/40 border border-white/10 rounded-xl">
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'orders' ? 'bg-[#E63946] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === 'inventory' ? 'bg-[#E63946] text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Inventory ({inventory.length})
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Revenue', value: `Rs. ${stats?.totalRevenue || 0}`, desc: 'Verified payments' },
          { label: 'Total Orders', value: stats?.totalOrders || orders.length, desc: 'All received orders' },
          { label: 'Pending QR Checks', value: stats?.pendingPayments || 0, desc: 'Needs slip review', highlight: true },
          { label: 'Print Queue', value: stats?.inPrinting || 0, desc: 'In DTG production' },
          { label: 'Low Stock Blanks', value: stats?.lowStockCount || 0, desc: '< 10 units left', warning: true }
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${
              kpi.highlight
                ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                : kpi.warning && kpi.value > 0
                ? 'bg-red-950/20 border-red-800/40 text-red-300'
                : 'bg-[#12151C] border-white/5 text-white'
            }`}
          >
            <span className="text-[10px] font-mono uppercase text-gray-400 block mb-1">{kpi.label}</span>
            <p className="text-xl sm:text-2xl font-black font-display">{kpi.value}</p>
            <span className="text-[10px] text-gray-400 block mt-1">{kpi.desc}</span>
          </div>
        ))}
      </div>

      {/* TAB 1: ORDERS LIST */}
      {activeTab === 'orders' && (
        <div className="bg-[#12151C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-base font-bold text-white font-display">Customer Orders Pipeline</h3>
            <span className="text-xs text-gray-400 font-mono">Showing {orders.length} orders</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 font-mono font-bold text-gray-400 border-b border-white/5 uppercase">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Garment Items</th>
                  <th className="p-4">Payment & QR Slip</th>
                  <th className="p-4">Production Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No customer orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((ord) => (
                    <tr key={ord.orderId} className="hover:bg-white/5 transition">
                      
                      {/* Order ID */}
                      <td className="p-4 font-mono">
                        <span className="font-bold text-white block">{ord.orderId}</span>
                        <span className="text-[10px] text-gray-500">
                          {new Date(ord.createdAt || Date.now()).toLocaleDateString('en-NP')}
                        </span>
                      </td>

                      {/* Customer Details */}
                      <td className="p-4">
                        <span className="font-bold text-white block">{ord.customer?.name}</span>
                        <span className="font-mono text-gray-400 block">{ord.customer?.phone}</span>
                        <span className="text-[11px] text-gray-500 block truncate max-w-[160px]">
                          {ord.customer?.city}, {ord.customer?.streetAddress}
                        </span>
                      </td>

                      {/* Items */}
                      <td className="p-4">
                        {(ord.items || []).map((it, idx) => (
                          <div key={idx} className="text-[11px] mb-1">
                            <span className="text-white font-semibold">{it.title}</span>
                            <span className="text-gray-400 font-mono block">
                              {it.color} ({it.size}) × {it.quantity}
                            </span>
                          </div>
                        ))}
                        <span className="font-mono font-bold text-[#E63946] block mt-1">
                          Rs. {ord.totalAmount}
                        </span>
                      </td>

                      {/* Payment Slip & Verification */}
                      <td className="p-4">
                        <div className="space-y-1.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            ord.payment?.status === 'verified'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {ord.payment?.status}
                          </span>
                          <span className="text-[10px] font-mono text-gray-400 block truncate max-w-[130px]">
                            Ref: {ord.payment?.transactionCode}
                          </span>
                          {ord.payment?.receiptSlipUrl && (
                            <button
                              onClick={() => setSelectedSlip(ord)}
                              className="text-[11px] text-[#E0A96D] hover:underline flex items-center gap-1 font-semibold"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Slip</span>
                            </button>
                          )}
                        </div>
                      </td>

                      {/* Production Status Selector */}
                      <td className="p-4">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => handleUpdateStatus(ord.orderId, e.target.value)}
                          className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#E63946]"
                        >
                          <option value="received">Received</option>
                          <option value="payment_verified">Payment Verified</option>
                          <option value="in_printing">In Printing</option>
                          <option value="shipped">Dispatched</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onOpenInvoice(ord)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-semibold text-white transition"
                        >
                          Invoice
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: INVENTORY BLANKS MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="bg-[#12151C] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white font-display">T-Shirt Blanks Inventory Matrix</h3>
              <p className="text-xs text-gray-400">Track and restock cotton blanks across colors and sizes.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/30 font-mono font-bold text-gray-400 border-b border-white/5 uppercase">
                <tr>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Garment Color</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Current Units</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4 text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-gray-300">
                {inventory.map((inv) => (
                  <tr key={inv.sku} className="hover:bg-white/5 transition">
                    <td className="p-4 font-mono text-gray-400">{inv.sku}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: inv.colorHex }} />
                        <span className="font-semibold text-white">{inv.color}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">{inv.size}</td>
                    <td className="p-4 font-mono font-bold text-base text-white">{inv.currentStock}</td>
                    <td className="p-4">
                      {inv.currentStock <= (inv.lowStockThreshold || 10) ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-950 text-red-400 border border-red-800">
                          Low Stock ({inv.currentStock})
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                          Sufficient
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleStockUpdate(inv.sku, inv.currentStock + 10)}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] font-mono text-emerald-400 transition"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleStockUpdate(inv.sku, Math.max(0, inv.currentStock - 1))}
                          className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[11px] font-mono text-red-400 transition"
                        >
                          -1
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Slip Verification Modal */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg bg-[#12151C] border border-white/10 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-base font-bold text-white font-display">Inspect Payment Slip</h4>
              <button onClick={() => setSelectedSlip(null)} className="text-gray-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-[4/3] rounded-2xl bg-black border border-white/10 overflow-hidden flex items-center justify-center">
              <img
                src={selectedSlip.payment?.receiptSlipUrl}
                alt="Receipt Slip"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-xs space-y-1">
              <p className="text-gray-400 font-mono">Order ID: <span className="text-white font-bold">{selectedSlip.orderId}</span></p>
              <p className="text-gray-400 font-mono">Reference Code: <span className="text-[#E0A96D] font-bold">{selectedSlip.payment?.transactionCode}</span></p>
              <p className="text-gray-400 font-mono">Amount Expected: <span className="text-[#E63946] font-bold">Rs. {selectedSlip.totalAmount}</span></p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleVerifyPayment(selectedSlip.orderId, 'rejected')}
                className="flex-1 py-3 bg-red-950/60 hover:bg-red-900/60 text-red-300 font-bold rounded-xl border border-red-800 text-xs transition"
              >
                Reject Payment
              </button>
              <button
                onClick={() => handleVerifyPayment(selectedSlip.orderId, 'verified')}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/30"
              >
                <Check className="w-4 h-4" />
                <span>Verify & Approve</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
