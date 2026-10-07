# Requirements Specification: Dhango Nepal

## 1. Functional Requirements
- **FR-1:** Storefront catalog displaying customizable apparel with price tag Rs. 1,500 (crossed out Rs. 2,000).
- **FR-2:** 3D Design Studio (`printonator` style) with 360-degree rotation, garment color switching, drag-and-drop artwork uploads, and text tool with custom fonts.
- **FR-3:** Virtual Try-On ($0 ongoing API cost) supporting live webcam pose tracking, studio model wrinkle blending, and selfie uploads.
- **FR-4:** Cart & Checkout with Nepal address validation (10-digit mobile, Province 1-7, City, Street).
- **FR-5:** Manual QR Payment display (Fonepay / eSewa) with receipt screenshot upload and reference ID input.
- **FR-6:** Order Confirmation screen with tracking code and WhatsApp chat link.
- **FR-7:** Admin dashboard with order table, payment verification modal, and artwork download.
- **FR-8:** SEO and GEO metadata targeting Nepal search terms.
- **FR-9:** Firebase Authentication with Google Sign-In and Email/Password, plus server-side token validation.
- **FR-10:** Automated branded invoice generator with print/PDF, PAN placeholder, itemized rates, and QR verification stamp.
- **FR-11:** Blank garment inventory management tracking plain t-shirt blanks across color and size matrix with low stock warnings.

## 2. Non-Functional Requirements
- **NFR-1:** 30+ FPS client-side rendering for 3D viewport and webcam overlay.
- **NFR-2:** Strict file upload filtering (max 10MB, image MIME types only).
- **NFR-3:** Fallback 2D canvas support for devices without WebGL2.
- **NFR-4:** Full WCAG AA contrast compliance and touch-optimized buttons.
