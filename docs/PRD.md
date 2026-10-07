# Product Requirements Document (PRD): Dhango Nepal

- **Product Name:** Dhango Nepal (`dhango.np` / `dhangonepal.com`)
- **Brand Identity:** Premium Custom T-Shirt Studio in Nepal
- **Primary Value Proposition:** Design your personalized t-shirt in 3D, try it on virtually in real-time, and get it delivered across Nepal for Rs. 1,500.
- **Document Version:** 1.0.0
- **Status:** Approved for Implementation

---

## 1. Objectives & Scope
Dhango Nepal provides high-quality custom graphic and typography apparel for the Nepali market. The platform addresses two traditional barriers in custom merchandise:
1. **Uncertainty of Output:** Solved via an interactive 3D WebGL editor (`printonator` style) and real-time virtual try-on on models, uploaded photos, and live webcam mirror (`anywear.decart.ai` style at $0 API cost).
2. **Payment Friction:** Solved via manual QR transfer verification (Fonepay, eSewa, Khalti) with screenshot receipt uploads.

---

## 2. Target Market & User Personas
- **University Students & Creators (18–25):** Looking for streetwear, anime prints, oversized aesthetics, and custom brand logos.
- **Corporate & Events Teams (22–35):** Seeking branded merchandise for tech meetups, college fests, or sports teams in Kathmandu and Pokhara.
- **Gift Buyers:** Creating personalized photo tees and anniversary gifts.

---

## 3. Product Pricing Strategy
- **Standard Base Price:** Displayed as ~~Rs. 2,000~~ (original retail price).
- **Special Promotional Offer:** **Rs. 1,500** flat rate per custom t-shirt.
- **Delivery Rates:**
  - Inside Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur): Free delivery on orders over 1 item or flat Rs. 50.
  - Outside Valley (Pokhara, Chitwan, Butwal, Biratnagar, Dharan, Nepalgunj, Dhangadhi): Flat Rs. 100 via courier partner.

---

## 4. Key Functional Modules

### 4.1 3D Design Studio
- **3D Canvas Viewport:** Three.js orbit view allowing 360-degree rotation, zoom, and tilt.
- **Color Customization:** 6 garment colors (Jet Black, Optical White, Heather Grey, Navy, Forest Green, Maroon).
- **Artwork Placement:** Drag-and-drop graphic upload (PNG/JPEG/WEBP/SVG) with scale, rotate, center, and layer controls.
- **Typography Engine:** Font styling (Streetwear, Gothic, Sans Bold, Nepali Calligraphy), arc curvature, and color selector.
- **Print Resolution Export:** 300 DPI high-res transparent PNG generator for DTG printing equipment.

### 4.2 Zero-Cost Virtual Try-On
- **Live Webcam Mirror:** MediaPipe Pose tracking user chest and shoulders, dynamically overlaying the customized shirt in real-time.
- **Studio Model Carousel:** Male and female models with realistic fabric displacement maps and wrinkle shading.
- **Photo Upload:** Upload selfie, place pin markers, and view design directly on the customer's picture.

### 4.3 QR Payment & Checkout
- **Delivery Form:** Customer name, 10-digit Nepal mobile number (`98XXXXXXXX`), Province (1 to 7), City/District, and street address.
- **QR Slip Upload:** Display Dhango Nepal Fonepay/eSewa QR code, prompt screenshot upload, and transaction code entry.
- **Confirmation & WhatsApp Chat:** Generates unique order ID (`DHG-XXXXX`) and pre-fills WhatsApp message to customer support.

### 4.4 Firebase Authentication & User Profiles
- **Authentication Providers:** Firebase Client SDK supporting Google 1-tap Sign-In and Email/Password.
- **Backend Verification:** Firebase Admin SDK middleware to verify Bearer ID tokens and protect user order history and admin routes.
- **Customer Account Area:** View past orders, track live print statuses, and re-order previous custom designs.

### 4.5 Automated Invoice Generation
- **Branded Invoice Layout:** Clean, printable invoice with Dhango Nepal brand logo (`logo.jpg`), Kathmandu address, PAN number placeholder, invoice number, and issue date.
- **Itemized Breakdown:** Garment variant, custom artwork preview, size, quantity, unit price (Rs. 1,500), delivery fee, and total.
- **Payment & QR Verification Stamp:** Includes bank/eSewa reference code and verification timestamp.
- **Formats:** Instant browser print / PDF download on order completion and customer dashboard.

### 4.6 Blank Garment Inventory Management
- **Stock Tracking Matrix:** Real-time stock counts for plain t-shirt blanks indexed by `Color × Size` (e.g. Black-L: 45 units, White-M: 12 units).
- **Auto-Deduction:** Deducts blank stock upon order confirmation.
- **Out of Stock Prevention:** Disables unavailable sizes/colors in the 3D Studio and Product Catalog.
- **Admin Stock Adjustment:** Dedicated inventory tab in Admin to add batches, adjust stock levels, and view low-stock alerts (< 10 units).

### 4.7 Admin Back-Office
- List all orders with status filter (`pending_payment`, `verified`, `printing`, `shipped`, `delivered`).
- Download original 300 DPI customer artwork files and preview mockups.
- Inspect uploaded payment receipts in an interactive zoom modal to verify transaction codes.
- Manage inventory stock levels and download customer invoices.
