# System Design Specification: Dhango Nepal Full-Stack E-Commerce & Virtual Try-On Platform

- **Project:** Dhango Nepal (`Dhango-nepal`)
- **Brand:** Dhango Nepal (Custom T-Shirt Printing, Kathmandu, Nepal)
- **Pricing:** Rs. 1,500 Special Offer (Strikethrough Original Price: Rs. 2,000)
- **Date:** 2026-10-07
- **Status:** Approved Architecture

---

## 1. Executive Summary & Core Mission
Dhango Nepal is a full-stack MERN e-commerce application tailored for the Nepalese market. It allows customers across Nepal to design custom t-shirts in an interactive 3D WebGL studio (`printonator` style), preview the apparel on real human models or live via real-time camera tracking (`anywear.decart.ai` style at $0 API cost), and complete their purchase via manual QR payment slip verification.

---

## 2. Technical Stack & System Architecture

### 2.1 Architecture Diagram
```
[ Client: React + Vite + TailwindCSS + Three.js + MediaPipe ]
                         │
        REST API & Multi-part Form Data
                         │
                         ▼
        [ Server: Node.js + Express + Multer ]
                         │
          ┌──────────────┴──────────────┐
          ▼                             ▼
  [ MongoDB Database ]          [ Local Static Storage ]
  - Products & Collections      - /uploads/artworks/
  - Customer Orders             - /uploads/receipts/
  - Payment QR Statuses         - /uploads/previews/
```

### 2.2 Frontend Stack (`client/`)
- **Runtime & Bundler:** React 18 / 19 with Vite.
- **Styling & Design System:** Tailwind CSS v4 / v3, custom design tokens, dark/light balanced theme with high-contrast typography (Geist / Outfit).
- **Motion & Micro-interactions:** `motion/react` with spring physics and tactile tap states following Emil Kowalski principles.
- **3D Garment Studio:** Three.js + React Three Fiber / Three.js Canvas with OrbitControls, custom UV texture projection, color tinting (fabric, collar, trims), and high-resolution snapshot export.
- **Virtual Try-On Engine ($0 API Running Cost):**
  - **Live Webcam Mirror:** MediaPipe Pose detector for real-time shoulder and torso landmark tracking, anchoring the custom t-shirt onto the user's video feed at 30+ FPS.
  - **Studio Realistic Models:** Male & female model photography with fabric displacement textures and `multiply` blend modes to preserve natural fabric folds, muscle shadows, and lighting.
  - **Customer Photo Upload:** Upload personal selfie with interactive landmark pins.
- **Payment & Checkout:** QR code display with instant slip screenshot upload and transaction code input.
- **SEO & SEO-GEO:** Complete meta tags, JSON-LD Schema (`Product`, `LocalBusiness`), OpenGraph preview images, and automated sitemap generator.

### 2.3 Backend Stack (`server/`)
- **Runtime:** Node.js with Express.
- **Database:** MongoDB (Mongoose) with flexible local or cloud connection.
- **Asset Uploads:** Multer with mime-type validation and file size boundaries (max 10MB).
- **Static File Serving:** Express static routing for `/uploads`.
- **Security & Integrity:** Helmet, CORS, input sanitization, error middleware.

---

## 3. Detailed Component Hierarchy

### 3.1 Storefront & Navigation
- `Navbar`: Sticky blurred glass navigation with Dhango Nepal logo, links (Shop, 3D Studio, Virtual Try-On, Track Order), cart indicator with item counter, and direct WhatsApp contact.
- `HeroSection`: High-impact typographic headline, 3D interactive t-shirt preview badge, pricing tag (Rs. 1,500 with Rs. 2,000 crossed out), and dual primary action buttons ("Design Your Own" & "Live Try-On").
- `ProductGrid`: Catalog of premium 100% combed cotton t-shirts (Regular Fit, Oversized Streetwear, Polo, Hoodies) with immediate "Customize This" buttons.
- `StudioPreviewTeaser`: Interactive micro-customizer showing real-time text and graphic rotation directly on the homepage.
- `NepalTrustBadgeRow`: 100% Cotton, Direct-to-Garment printing, All-Nepal delivery (Kathmandu, Pokhara, Chitwan, Dharan, Butwal), and secure QR verification.
- `Footer`: Local business information, Kathmandu address, phone numbers, social links, FAQs, and SEO links.

### 3.2 3D Customizer Studio (`/studio`)
- `Viewport3D`: Three.js canvas featuring 360-degree rotation, zoom, and pitch.
- `ColorPicker`: Real-time color switcher for t-shirt fabric, ribbing, and sleeves.
- `ArtworkUploadZone`: Drag-and-drop artwork uploader supporting PNG, JPEG, WEBP, and SVG with transparent background support.
- `TransformControls`: Interactive scale, rotation, centering, and layer order.
- `TextTool`: Font picker, text color, curve/arc intensity, and letter spacing.
- `PrintZoneSelector`: Front chest, back print, left sleeve, right sleeve.
- `ExportEngine`: High-res PNG export of the print file for production and generation of thumbnail mockups.

### 3.3 Virtual Try-On Suite (`/try-on`)
- `TryOnModeTabs`: Tabs to switch between:
  1. **Webcam Real-Time Mirror:** Video element + MediaPipe Pose landmark calculation + dynamic WebGL mesh overlay.
  2. **Studio Models:** Switch between multiple body types (Athletic Male, Curvy Female, Oversized Streetwear Model) with natural fabric shading.
  3. **Upload Your Photo:** Allows user to upload any photo and position the custom print onto their own chest.
- `CaptureSnapshotButton`: Download or share try-on photo with friends.
- `DirectAddToCart`: Adds the exact customized shirt directly to the shopping cart.

### 3.4 Cart, QR Payment & Checkout Flow
- `CartDrawer`: Slide-over drawer with item summary, custom print thumbnail preview, size selector (S, M, L, XL, XXL), quantity modifier, and subtotal calculation.
- `CheckoutPage`:
  - Customer contact: Name, Nepal phone number (98XXXXXXXX format), email.
  - Delivery details: Province (1 to 7), City (Kathmandu, Lalitpur, Bhaktapur, Pokhara, etc.), Street Address, Delivery Notes.
  - Pricing Summary: Product Price (Rs. 1,500), Delivery Fee (Free in Valley / Flat Rs. 100 outside), Total.
  - Payment Instructions: High-resolution QR code (Fonepay / eSewa / Khalti), Dhango Nepal account name, and account number.
  - Proof Upload: Screenshot uploader for bank/eSewa transfer slip and transaction reference code input.
- `OrderSuccessPage`: Unique Order ID (`DHG-XXXXX`), payment status notice, receipt summary, and one-click WhatsApp confirmation link.

### 3.5 Firebase Authentication & Customer Profile
- `AuthModal`: Firebase Google Sign-In and Email/Password login/signup modal.
- `UserProfilePage`: Order history, tracking links, re-order custom designs, and saved delivery addresses.
- `AuthContext`: Client-side reactive auth state listener (`onAuthStateChanged`) providing current user profile and Firebase JWT token for API calls.

### 3.6 Automated Invoice Generator
- `InvoiceModal` / `/invoice/:orderId`: Printable, downloadable branded invoice.
- Contains Dhango Nepal logo, Kathmandu address, invoice number, customer billing/shipping details, itemized garment custom prints, Rs. 1,500 rate, payment verification stamp with transaction code, and tax breakdown.

### 3.7 Inventory Management Engine
- `InventoryItem` Schema: Tracks plain t-shirt blanks by `color` (Black, White, Grey, Navy, etc.) and `size` (S, M, L, XL, XXL) with `currentStock`, `reservedStock`, and `lowStockThreshold` (default 10).
- Automatically checks stock availability before adding to cart or finalizing custom orders.
- Automatically decrements blank stock upon order payment verification.
- Admin stock manager: Real-time matrix view allowing 1-click quantity adjustments and low-stock indicators.

### 3.8 Admin Dashboard (`/admin`)
- Overview metrics: Total orders, pending payments, orders in print queue, dispatched orders, low-stock inventory alerts.
- Order Management Table:
  - Customer name, phone number, address.
  - Direct download links for the high-res custom artwork and preview mockup.
  - Payment slip viewer with zoom modal to inspect transfer screenshot.
  - Status updater: `pending_payment` -> `payment_verified` -> `in_printing` -> `dispatched` -> `delivered`.
- Inventory Table: Garment blank color/size stock levels with restock controls.

---

## 4. Data Models & API Specifications

### 4.1 Data Models (Mongoose Schemas)
- **`Product`**:
  ```javascript
  {
    title: String,
    slug: String,
    description: String,
    originalPrice: { type: Number, default: 2000 },
    salePrice: { type: Number, default: 1500 },
    colors: [{ name: String, hex: String }],
    sizes: [String],
    defaultArtworkUrl: String,
    category: String,
    isFeatured: Boolean
  }
  ```
- **`Order`**:
  ```javascript
  {
    orderId: { type: String, unique: true },
    customer: {
      name: String,
      phone: String,
      email: String,
      province: String,
      city: String,
      address: String
    },
    items: [{
      productId: String,
      title: String,
      size: String,
      color: String,
      quantity: Number,
      unitPrice: Number,
      artworkUrl: String,
      mockupUrl: String,
      printZones: Object
    }],
    totalAmount: Number,
    payment: {
      method: { type: String, default: 'QR_TRANSFER' },
      transactionCode: String,
      receiptSlipUrl: String,
      status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
      verifiedAt: Date
    },
    orderStatus: {
      type: String,
      enum: ['received', 'payment_verified', 'printing', 'shipped', 'delivered', 'cancelled'],
      default: 'received'
    },
    createdAt: { type: Date, default: Date.now }
  }
  ```

### 4.2 REST API Endpoints
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/upload/artwork` - Upload customer print graphic (returns file URL)
- `POST /api/upload/receipt` - Upload payment QR slip (returns file URL)
- `POST /api/orders` - Create new order
- `GET /api/orders/:orderId` - Track order by ID and phone
- `GET /api/admin/orders` - Admin list of all orders
- `PATCH /api/admin/orders/:orderId/payment` - Verify or reject payment
- `PATCH /api/admin/orders/:orderId/status` - Update delivery status

---

## 5. SEO & Nepal GEO Optimization

### 5.1 Primary Keyword Clusters
- `custom tshirt print in nepal`
- `tshirt printing kathmandu`
- `customized t shirts nepal`
- `dhango nepal custom printing`
- `online t shirt design nepal`
- `oversized custom tshirt kathmandu`

### 5.2 Structured Data (JSON-LD)
- `Product` schema with price valid in `NPR` (1500), seller `Dhango Nepal`, stock status `InStock`.
- `LocalBusiness` schema with Kathmandu coordinates, Nepal telephone country code (`+977`), and opening hours.
- OpenGraph image tags pointing to generated high-res mockups.
- `robots.txt` and `sitemap.xml` automatically serving all active product and category routes.

---

## 6. Verification & Quality Gates
- **Visual & Component Polish:** Tested against responsive viewports (375px mobile, 768px tablet, 1440px desktop) using Playwright CLI.
- **Zero API Cost Verification:** WebGL customizer and camera try-on operate entirely client-side without external SaaS dependencies.
- **End-to-End Flow Validation:** Design customization -> Try-on preview -> Cart -> QR payment slip upload -> Order creation -> Admin verification.
