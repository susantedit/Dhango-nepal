// E2E Backend Pipeline & Logic Test for Dhango Nepal
const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('--- DHANGO NEPAL E2E PIPELINE TEST ---');
  let passed = 0;
  let failed = 0;

  // 1. Health check
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    const data = await res.json();
    if (data.status === 'online' && data.brand === 'Dhango Nepal') {
      console.log('✅ TEST 1 PASSED: API Health Endpoint Online');
      passed++;
    } else {
      console.error('❌ TEST 1 FAILED: Invalid health payload', data);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 1 FAILED:', e.message);
    failed++;
  }

  // 2. Products verification (Rs. 1,500 active, Rs. 2,000 original)
  try {
    const res = await fetch(`${BASE_URL}/api/products`);
    const data = await res.json();
    if (data.success && data.data.length >= 4) {
      const p = data.data[0];
      if (p.salePrice === 1500 && p.originalPrice === 2000) {
        console.log(`✅ TEST 2 PASSED: Products Catalog Verified (Rs. ${p.salePrice} / Rs. ${p.originalPrice})`);
        passed++;
      } else {
        console.error('❌ TEST 2 FAILED: Pricing mismatch', p);
        failed++;
      }
    } else {
      console.error('❌ TEST 2 FAILED: Insufficient products', data);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 2 FAILED:', e.message);
    failed++;
  }

  // 3. Inventory blank items
  try {
    const res = await fetch(`${BASE_URL}/api/inventory`);
    const data = await res.json();
    if (data.success && data.data.length > 0) {
      console.log(`✅ TEST 3 PASSED: Inventory Blanks Loaded (${data.data.length} SKUs)`);
      passed++;
    } else {
      console.error('❌ TEST 3 FAILED: No inventory items', data);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 3 FAILED:', e.message);
    failed++;
  }

  // 4. Create an order with manual QR payment
  let testOrderId = null;
  try {
    const orderPayload = {
      customer: {
        name: 'Suman Nepal',
        phone: '9841234567',
        province: 'Bagmati (Province 3)',
        city: 'Kathmandu',
        streetAddress: 'New Baneshwor'
      },
      items: [
        {
          productId: 'prod-classic-01',
          title: 'Dhango Classic Crewneck T-Shirt',
          color: 'Jet Black',
          size: 'L',
          quantity: 2,
          unitPrice: 1500
        }
      ],
      payment: {
        method: 'QR_TRANSFER',
        transactionCode: 'FONEPAY-TEST-998822',
        receiptSlipUrl: '/uploads/receipts/test-slip.jpg'
      }
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });

    const data = await res.json();
    if (data.success && data.data?.orderId && data.data.totalAmount === 3000) {
      testOrderId = data.data.orderId;
      console.log(`✅ TEST 4 PASSED: Order Created Successfully (${testOrderId}, Total: Rs. ${data.data.totalAmount})`);
      passed++;
    } else {
      console.error('❌ TEST 4 FAILED: Order creation error', data);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 4 FAILED:', e.message);
    failed++;
  }

  // 5. Track Order
  if (testOrderId) {
    try {
      const res = await fetch(`${BASE_URL}/api/orders/track/${testOrderId}`);
      const data = await res.json();
      if (data.success && data.data?.orderId === testOrderId) {
        console.log(`✅ TEST 5 PASSED: Order Tracking Verified (${testOrderId})`);
        passed++;
      } else {
        console.error('❌ TEST 5 FAILED:', data);
        failed++;
      }
    } catch (e) {
      console.error('❌ TEST 5 FAILED:', e.message);
      failed++;
    }
  }

  // 6. Tax Invoice Generation
  if (testOrderId) {
    try {
      const res = await fetch(`${BASE_URL}/api/orders/${testOrderId}/invoice`);
      const data = await res.json();
      if (data.success && data.data?.invoiceNumber === `INV-${testOrderId}`) {
        console.log(`✅ TEST 6 PASSED: Tax Invoice Generation Verified (PAN: ${data.data.company.panNumber})`);
        passed++;
      } else {
        console.error('❌ TEST 6 FAILED: Invoice error', data);
        failed++;
      }
    } catch (e) {
      console.error('❌ TEST 6 FAILED:', e.message);
      failed++;
    }
  }

  // 7. Admin Verification of Payment & Inventory Auto-Deduction
  if (testOrderId) {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${testOrderId}/payment`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'verified' })
      });
      const data = await res.json();
      if (data.success && data.data.payment.status === 'verified') {
        console.log(`✅ TEST 7 PASSED: Admin QR Payment Verification & Status Updated`);
        passed++;
      } else {
        console.error('❌ TEST 7 FAILED:', data);
        failed++;
      }
    } catch (e) {
      console.error('❌ TEST 7 FAILED:', e.message);
      failed++;
    }
  }

  // 8. Admin Stats
  try {
    const res = await fetch(`${BASE_URL}/api/admin/stats`);
    const data = await res.json();
    if (data.success && data.data.totalOrders >= 1) {
      console.log(`✅ TEST 8 PASSED: Admin Stats KPI Dashboard (Total Orders: ${data.data.totalOrders}, Revenue: Rs. ${data.data.totalRevenue})`);
      passed++;
    } else {
      console.error('❌ TEST 8 FAILED: Admin stats error', data);
      failed++;
    }
  } catch (e) {
    console.error('❌ TEST 8 FAILED:', e.message);
    failed++;
  }

  console.log(`\n--- SUMMARY: ${passed} PASSED, ${failed} FAILED ---`);
}

runTests();
