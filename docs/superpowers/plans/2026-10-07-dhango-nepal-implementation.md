# Dhango Nepal Full-Stack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-grade full-stack MERN e-commerce application for Dhango Nepal featuring an interactive 3D t-shirt design studio, real-time virtual try-on ($0 ongoing API cost), manual QR payment receipt verification, and complete SEO/GEO optimization for Nepal.

**Architecture:** Monorepo with an Express/Node.js backend in `server/` (handling MongoDB, file uploads for custom graphics and payment slips, and REST endpoints) and a modern React/Vite/Tailwind frontend in `client/` (Three.js 3D viewport, browser-based pose detection for live try-on, displacement fabric blending, and cart/checkout flow).

**Tech Stack:** React 19 / Vite, Tailwind CSS, Three.js, MediaPipe Pose, Node.js, Express, Multer, Mongoose / MongoDB, Playwright.

**Spec:** `docs/superpowers/specs/2026-10-07-dhango-nepal-design.md`

## Global Constraints
- Brand Name: Dhango Nepal
- T-Shirt Pricing: Display original price `Rs. 2,000` (strikethrough) and active sale price `Rs. 1,500`.
- Running Cost: $0 external API cost for 3D customization and virtual try-on.
- Payment System: Manual QR payment with receipt screenshot upload and reference ID verification.
- Typography & Polish: Emil Kowalski motion curves, clean sans display fonts, zero generic AI placeholders.
- SEO & GEO: Target keywords like "custom tshirt print in nepal", Kathmandu, Pokhara, JSON-LD Schema.

---

### Task 1: Repository Scaffolding & Git Initialization
**Files:**
- Create: `.gitignore`, `package.json`, `README.md`
- Test: Directory structure inspection
**Interfaces:**
- Produces: Root workspace script orchestration (`npm run dev:server`, `npm run dev:client`)
- [ ] Step 1: Initialize Git repository and add root `.gitignore`
- [ ] Step 2: Create root `package.json` with concurrently orchestration scripts
- [ ] Step 3: Verify git status and commit initial scaffold

---

### Task 2: Backend Architecture & Server Scaffolding
**Files:**
- Create: `server/package.json`, `server/server.js`, `server/config/db.js`
- Test: `server/tests/health.test.js`
**Interfaces:**
- Produces: Express API running on port 5000 with CORS, JSON body parser, and `/api/health`
- [ ] Step 1: Create `server/package.json` with express, cors, dotenv, multer, mongoose
- [ ] Step 2: Create `server/config/db.js` with MongoDB connection and graceful in-memory/file fallback
- [ ] Step 3: Implement `server/server.js` with healthcheck endpoint
- [ ] Step 4: Verify server starts and responds to `GET /api/health`

---

### Task 3: Static Asset Directories & Multer Storage Configuration
**Files:**
- Create: `server/middleware/upload.js`
- Test: `server/tests/upload.test.js`
**Interfaces:**
- Produces: Multer file handlers for `artwork` and `receipt` uploads in `server/uploads/`
- [ ] Step 1: Configure upload paths (`server/uploads/artworks`, `server/uploads/receipts`)
- [ ] Step 2: Implement mime-type filters (PNG, JPG, WEBP, SVG) and 10MB size limit
- [ ] Step 3: Verify upload directory creation and static serving in `server/server.js`

---

### Task 4: Product Data Model & Seeding Catalog
**Files:**
- Create: `server/models/Product.js`, `server/data/seedProducts.js`
- Test: Product query test script
**Interfaces:**
- Produces: Mongoose schema and seed dataset with 6 t-shirt variants at Rs. 1,500 (crossed out Rs. 2,000)
- [ ] Step 1: Write `Product.js` schema with originalPrice (2000), salePrice (1500), colors, and sizes
- [ ] Step 2: Write `seedProducts.js` with custom apparel entries (Classic Crewneck, Oversized Streetwear, Polo, Heavyweight Tee)
- [ ] Step 3: Seed products into database and verify query response

---

### Task 5: Order Data Model & Validation
**Files:**
- Create: `server/models/Order.js`
- Test: Order validation test
**Interfaces:**
- Produces: Order schema with customer details (Nepal phone, province, city), items, QR slip URL, and status
- [ ] Step 1: Define `Order.js` with orderId generator (`DHG-XXXXX`), payment status, and order status
- [ ] Step 2: Add validation for Nepal phone format (10 digits starting with 9)
- [ ] Step 3: Verify order model creation and indexing

---

### Task 6: Products & Categories REST API
**Files:**
- Create: `server/routes/productRoutes.js`, `server/controllers/productController.js`
- Test: HTTP endpoint verification
**Interfaces:**
- Produces: `GET /api/products`, `GET /api/products/:id`
- [ ] Step 1: Implement `productController.js` with list and detail query handlers
- [ ] Step 2: Wire `productRoutes.js` into `server/server.js`
- [ ] Step 3: Test endpoints with curl/fetch and verify JSON format

---

### Task 7: File Upload API Endpoints
**Files:**
- Create: `server/routes/uploadRoutes.js`
- Test: Multi-part upload test
**Interfaces:**
- Produces: `POST /api/upload/artwork`, `POST /api/upload/receipt` returning uploaded file URLs
- [ ] Step 1: Wire Multer artwork and receipt endpoints in `uploadRoutes.js`
- [ ] Step 2: Add route registration in `server.js`
- [ ] Step 3: Verify test upload returns JSON with public URL `/uploads/...`

---

### Task 8: Orders & Tracking REST API
**Files:**
- Create: `server/routes/orderRoutes.js`, `server/controllers/orderController.js`
- Test: Order creation and tracking endpoint test
**Interfaces:**
- Produces: `POST /api/orders`, `GET /api/orders/:orderId`
- [ ] Step 1: Implement `orderController.js` to create order with `pending_payment` and calculate subtotal
- [ ] Step 2: Implement order lookup endpoint with phone number verification
- [ ] Step 3: Verify order lifecycle via API call

---

### Task 9: Admin Management REST API
**Files:**
- Create: `server/routes/adminRoutes.js`, `server/controllers/adminController.js`
- Test: Admin API test
**Interfaces:**
- Produces: `GET /api/admin/orders`, `PATCH /api/admin/orders/:orderId/payment`, `PATCH /api/admin/orders/:orderId/status`
- [ ] Step 1: Implement admin order listing with payment filter and search
- [ ] Step 2: Implement payment status verification toggle (`verified` / `rejected`)
- [ ] Step 3: Implement shipping status update endpoint

---

### Task 10: Client Vite + React + TailwindCSS Scaffolding
**Files:**
- Create: `client/package.json`, `client/vite.config.js`, `client/index.html`, `client/src/main.jsx`
- Test: Client build check (`npm run build`)
**Interfaces:**
- Produces: Running Vite React dev environment on port 5173 with Tailwind CSS
- [ ] Step 1: Initialize Vite React client with Tailwind and Lucide/Phosphor icons
- [ ] Step 2: Configure proxy in `vite.config.js` to forward `/api` and `/uploads` to port 5000
- [ ] Step 3: Verify client compiles cleanly

---

### Task 11: Design System, Tokens & Typography
**Files:**
- Create: `client/src/index.css`, `client/src/styles/theme.css`
- Test: CSS compilation and visual theme inspection
**Interfaces:**
- Produces: Emil Kowalski-inspired design system: clean typography, tactile button states, deep charcoal background (`#0B0D11`) and crisp cream/accent palette
- [ ] Step 1: Define CSS custom properties for colors, radiuses, and spring easings
- [ ] Step 2: Create utility classes for glassmorphic navbar, subtle borders, and micro-interactions
- [ ] Step 3: Import brand typography and verify style rendering

---

### Task 12: Brand Navigation & Header Bar
**Files:**
- Create: `client/src/components/Navbar.jsx`
- Test: Responsive navigation rendering
**Interfaces:**
- Produces: Sticky glass header with Dhango Nepal logo, nav links (Shop, 3D Studio, Try-On, Track), cart button with badge, and WhatsApp direct contact
- [ ] Step 1: Implement logo branding from `logo.jpg`
- [ ] Step 2: Add navigation routes and mobile slide-out menu
- [ ] Step 3: Add cart toggle and order tracking link

---

### Task 13: Storefront Hero Section with Strikethrough Pricing
**Files:**
- Create: `client/src/components/HeroSection.jsx`
- Test: Hero viewport render
**Interfaces:**
- Produces: Hero with high-contrast copy, Rs. 1,500 active price tag (Rs. 2,000 crossed out), and dual CTAs ("Start 3D Design" & "Live Virtual Try-On")
- [ ] Step 1: Build hero layout adhering to viewport height and 2-line headline rule
- [ ] Step 2: Add interactive floating 3D apparel card with rotate animation
- [ ] Step 3: Link primary CTAs directly to `/studio` and `/try-on`

---

### Task 14: Trust Badges & Nepal Delivery Value Row
**Files:**
- Create: `client/src/components/TrustBadges.jsx`
- Test: Visual review of trust signals
**Interfaces:**
- Produces: Row highlighting 100% Combed Cotton, DTG Vibrant Prints, Cash/QR Verification, and All-Nepal Delivery
- [ ] Step 1: Design clean 4-column trust feature cards
- [ ] Step 2: Add icons for cotton quality, print longevity, fast delivery across Nepal, and QR payment

---

### Task 15: Product Catalog & Category Filter
**Files:**
- Create: `client/src/components/ProductCatalog.jsx`, `client/src/components/ProductCard.jsx`
- Test: Product card rendering and filter interaction
**Interfaces:**
- Produces: Grid of customizable t-shirt styles with live price tags, color swatches, and "Customize" buttons
- [ ] Step 1: Fetch products from `/api/products` with loading skeleton
- [ ] Step 2: Render product cards with original Rs. 2,000 crossed out and offer Rs. 1,500 highlighted
- [ ] Step 3: Add category filter pills (All, Oversized, Classic, Minimalist, Graphic)

---

### Task 16: Interactive Homepage Micro-Customizer Teaser
**Files:**
- Create: `client/src/components/CustomizerTeaser.jsx`
- Test: Real-time slider and text change test
**Interfaces:**
- Produces: Live interactive mini-widget on the homepage letting users type text and see it appear on a shirt instantly
- [ ] Step 1: Build live text preview on front t-shirt canvas
- [ ] Step 2: Add quick color chips to switch shirt hue on the fly
- [ ] Step 3: Provide "Open in 3D Studio" button carrying the draft into the full studio

---

### Task 17: Three.js 3D Studio Canvas & OrbitControls
**Files:**
- Create: `client/src/components/studio/StudioCanvas.jsx`, `client/src/components/studio/TShirtModel.jsx`
- Test: WebGL viewport rendering and camera rotation
**Interfaces:**
- Produces: 3D interactive viewport allowing 360-degree rotation, pitch, and zoom on the apparel mesh
- [ ] Step 1: Set up Three.js scene, camera, ambient lighting, and directional key light
- [ ] Step 2: Create detailed parametric 3D t-shirt mesh with realistic fabric material
- [ ] Step 3: Add OrbitControls with smooth damping and boundary limits

---

### Task 18: 3D Studio Garment Color Customizer
**Files:**
- Create: `client/src/components/studio/ColorToolbar.jsx`
- Test: Fabric material color change test
**Interfaces:**
- Produces: Color picker toolbar for t-shirt body, collar ribbing, and cuffs
- [ ] Step 1: Define curated palette (Onyx Black, Snow White, Heather Grey, Navy Blue, Crimson, Forest Olive)
- [ ] Step 2: Connect color state to Three.js material uniform color properties
- [ ] Step 3: Add custom hex color picker for advanced personalization

---

### Task 19: 3D Studio Artwork Upload & Transform Engine
**Files:**
- Create: `client/src/components/studio/ArtworkManager.jsx`, `client/src/components/studio/TransformControls.jsx`
- Test: File drag-and-drop and texture mapping
**Interfaces:**
- Produces: Drag/drop graphic upload, position/scale/rotation sliders, and real-time canvas texture projection onto the 3D t-shirt
- [ ] Step 1: Implement file upload with drag-and-drop and transparent PNG support
- [ ] Step 2: Build dynamic offscreen canvas combining graphic transformations
- [ ] Step 3: Update Three.js CanvasTexture in real time with high visual sharpness

---

### Task 20: 3D Studio Typography & Clipart Engine
**Files:**
- Create: `client/src/components/studio/TextManager.jsx`, `client/src/components/studio/PresetArtwork.jsx`
- Test: Text rendering on 3D canvas
**Interfaces:**
- Produces: Text input with font styles (Streetwear, Gothic, Sans Bold, Nepali Calligraphy), arc curve effect, and clipart library
- [ ] Step 1: Implement text layer controls (font, size, color, letter-spacing, curvature)
- [ ] Step 2: Add Nepali culture & streetwear preset graphics (Yeti, Buddha eyes, Kathmandu streets, Minimalist Nepal flag)
- [ ] Step 3: Composite text and artwork onto the garment print canvas

---

### Task 21: High-Resolution Print Export & Mockup Generator
**Files:**
- Create: `client/src/components/studio/ExportManager.jsx`
- Test: High-res PNG export validation
**Interfaces:**
- Produces: Print-ready 300 DPI transparent PNG of the custom artwork and a composite 3D mockup screenshot for order placement
- [ ] Step 1: Render offscreen print zone at 2400×3000px resolution for production printing
- [ ] Step 2: Snapshot the 3D Three.js canvas as a preview mockup PNG
- [ ] Step 3: Pack artwork and mockup into the cart state

---

### Task 22: Virtual Try-On Studio Models Engine (Fabric Wrinkle Displacement)
**Files:**
- Create: `client/src/components/tryon/StudioModelsView.jsx`
- Test: Displacement blend rendering on model photos
**Interfaces:**
- Produces: Photorealistic model try-on showing custom graphics mapped with wrinkle displacement and `multiply` blend mode on male and female models
- [ ] Step 1: Create studio model plates (Athletic Male, Curvy Female, Streetwear Oversized)
- [ ] Step 2: Implement canvas displacement shader / blend pipeline preserving natural chest contours and light folds
- [ ] Step 3: Add real-time slider to adjust graphic vertical position and scale on the model

---

### Task 23: Virtual Try-On User Photo Upload & Torso Alignment
**Files:**
- Create: `client/src/components/tryon/UserPhotoTryOn.jsx`
- Test: Custom photo upload and alignment pins
**Interfaces:**
- Produces: Upload personal selfie or full-body photo with shoulder alignment guides to view custom shirt on oneself
- [ ] Step 1: Implement photo upload with client-side orientation correction
- [ ] Step 2: Provide interactive chest bounding box with rotate/scale handles
- [ ] Step 3: Render composite try-on photo with download button

---

### Task 24: Real-Time Webcam Try-On Mirror ($0 API Cost)
**Files:**
- Create: `client/src/components/tryon/WebcamMirrorTryOn.jsx`
- Test: Camera feed permission and canvas overlay tracking
**Interfaces:**
- Produces: Real-time mirror video feed using browser pose detection to anchor the customized shirt onto the user's body
- [ ] Step 1: Set up WebRTC getUserMedia video stream with graceful camera permission fallback
- [ ] Step 2: Implement shoulder/torso landmark tracking loop (at 30+ FPS)
- [ ] Step 3: Project the customized shirt onto user torso with real-time scaling and position updates
- [ ] Step 4: Add snapshot button to freeze frame and inspect try-on look

---

### Task 25: Shopping Cart State & Slide-Over Drawer
**Files:**
- Create: `client/src/context/CartContext.jsx`, `client/src/components/CartDrawer.jsx`
- Test: Add to cart, quantity change, and price calculation
**Interfaces:**
- Produces: Persistent shopping cart with custom thumbnail preview, size selector, quantity modifier, and subtotal calculation
- [ ] Step 1: Implement React CartContext with localStorage persistence
- [ ] Step 2: Build sliding cart drawer with spring animations
- [ ] Step 3: Verify item addition from catalog, 3D Studio, and Try-On page

---

### Task 26: Checkout Page & Nepal Delivery Form
**Files:**
- Create: `client/src/pages/CheckoutPage.jsx`
- Test: Form validation for Nepal phone and address
**Interfaces:**
- Produces: Multi-step checkout with delivery info (Name, Nepal phone `98XXXXXXXX`, Province 1-7, City/District, Street)
- [ ] Step 1: Build responsive 2-column checkout layout (form on left, order summary on right)
- [ ] Step 2: Add Nepal province and city autocomplete dropdowns
- [ ] Step 3: Validate phone format and mandatory address fields

---

### Task 27: Manual QR Payment Display & Slip Upload
**Files:**
- Create: `client/src/components/checkout/QRPaymentSection.jsx`
- Test: QR slip screenshot upload and transaction code input
**Interfaces:**
- Produces: High-res QR code display (Fonepay / eSewa / Khalti), Dhango Nepal account details, screenshot uploader, and transaction ID input
- [ ] Step 1: Render branded QR code card with scan instructions and account number
- [ ] Step 2: Implement screenshot file uploader sending image to `/api/upload/receipt`
- [ ] Step 3: Submit order to `/api/orders` with receipt URL and transaction code

---

### Task 28: Order Confirmation Page & WhatsApp Chat Link
**Files:**
- Create: `client/src/pages/OrderConfirmationPage.jsx`
- Test: Order success rendering and WhatsApp message formatting
**Interfaces:**
- Produces: Order confirmation with unique ID (`DHG-XXXXX`), payment verification status notice, and one-click WhatsApp message button
- [ ] Step 1: Fetch and display confirmed order details
- [ ] Step 2: Format pre-filled WhatsApp message URL (`https://wa.me/97798XXXXXXXX?text=...`)
- [ ] Step 3: Provide copy order ID and "Track My Order" direct links

---

### Task 29: Order Tracking Portal
**Files:**
- Create: `client/src/pages/TrackOrderPage.jsx`
- Test: Order lookup by ID and phone
**Interfaces:**
- Produces: Public tracking portal where customers enter order ID and phone to see live progress (Payment Verification -> Printing -> Shipped -> Delivered)
- [ ] Step 1: Build tracking input form with real-time feedback
- [ ] Step 2: Display visual timeline stepper showing current order progress
- [ ] Step 3: Show uploaded custom mockup and delivery address details

---

### Task 30: Admin Dashboard - Overview Stats & Metrics
**Files:**
- Create: `client/src/pages/AdminDashboardPage.jsx`, `client/src/components/admin/AdminStats.jsx`
- Test: Admin stats rendering
**Interfaces:**
- Produces: Admin panel displaying total orders, pending payment count, total revenue (NPR), and orders in print queue
- [ ] Step 1: Build password-protected admin view
- [ ] Step 2: Fetch and render KPI metric cards
- [ ] Step 3: Add quick filter tabs (All, Pending Payment, Printing, Shipped)

---

### Task 31: Admin Order Inspection & Payment Verification
**Files:**
- Create: `client/src/components/admin/AdminOrderList.jsx`, `client/src/components/admin/ReceiptModal.jsx`
- Test: Verify payment and update order status
**Interfaces:**
- Produces: Order management table with high-res artwork download, receipt screenshot zoom modal, payment approve/reject toggle, and shipping stepper
- [ ] Step 1: Implement table listing orders with customer details and item previews
- [ ] Step 2: Add payment slip inspect modal with 1-click "Verify Payment" button
- [ ] Step 3: Add status transition selector (`printing`, `shipped`, `delivered`) and update backend

---

### Task 32: SEO, Nepal GEO Local Schema, OpenGraph & Sitemap
**Files:**
- Create: `client/public/robots.txt`, `client/public/sitemap.xml`, `client/src/components/SEOHead.jsx`
- Test: Meta tag inspection and schema validator check
**Interfaces:**
- Produces: JSON-LD LocalBusiness and Product schemas, canonical URLs, Kathmandu GEO tags, and meta descriptions targeting Nepal search queries
- [ ] Step 1: Implement dynamic `SEOHead.jsx` injecting title, meta description, and canonical tags
- [ ] Step 2: Add JSON-LD schema for Dhango Nepal with NPR currency pricing
- [ ] Step 3: Create `robots.txt` and `sitemap.xml` listing all pages

---

### Task 33: End-to-End Automated Verification with Playwright
**Files:**
- Create: `tests/e2e/storefront.spec.js`, `tests/e2e/customizer.spec.js`, `tests/e2e/checkout.spec.js`
- Test: Playwright test execution
**Interfaces:**
- Produces: Automated browser verification validating storefront load, 3D customizer interaction, cart addition, and checkout flow
- [ ] Step 1: Set up Playwright test runner
- [ ] Step 2: Test storefront navigation, pricing display (Rs. 1,500 with Rs. 2,000 crossed out), and responsive layout
- [ ] Step 3: Test 3D Studio customization and high-res print export
- [ ] Step 4: Test cart, QR checkout, and order submission
