# Security Policy & Safeguards: Dhango Nepal

- **System:** Dhango Nepal E-Commerce Application
- **Version:** 1.0.0
- **Scope:** Frontend, Backend, File Uploads, Database, and Static Assets

---

## 1. Threat Model & Key Attack Vectors
Dhango Nepal handles user-generated artwork uploads, customer payment slip screenshots, and personal address details. The primary attack surfaces include:
1. Malicious File Uploads (untrusted extensions, executable payloads disguised as images, zip bombs).
2. Cross-Site Scripting (XSS) via custom t-shirt text and customer address inputs.
3. Insecure Direct Object References (IDOR) on order retrieval.
4. Database Injection (NoSQL injection via unvalidated query operators).
5. Denial of Service via oversized file uploads or rapid endpoint scraping.

---

## 2. File Upload Defense Pipeline (Multer)
- **MIME-Type Whitelisting:**
  Only `image/png`, `image/jpeg`, `image/webp`, and `image/svg+xml` are permitted. All executable formats (`.exe`, `.php`, `.js`, `.sh`, `.bat`) are blocked.
- **Size Bounds:**
  - Customer artwork files: Maximum 10MB.
  - Payment receipt screenshots: Maximum 5MB.
- **Sanitized Filename Generation:**
  Original file names are discarded. Stored filenames are cryptographically randomized using timestamp + UUID:
  `artwork-${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${extension}`.
- **Isolated Storage Folders:**
  Stored files reside in non-executable static directories (`uploads/artworks` and `uploads/receipts`) served strictly with static MIME headers.

---

## 3. Data Validation & Injection Prevention
- **MongoDB NoSQL Injection Protection:**
  Express body inputs are sanitized. IDs are validated as Mongoose `ObjectId` or strict regex before queries are executed.
- **Input Sanitization:**
  Customer names, phone numbers, addresses, and custom t-shirt texts are stripped of HTML tags and unescaped script blocks before persisting.
- **Nepal Phone Format Enforcement:**
  Phone numbers are validated against strict regex: `^(\+977)?[9][6-8]\d{8}$`.

---

## 4. Payment Receipt Verification & Privacy
- Payment receipts contain sensitive personal banking references.
- Receipts are only visible on the dedicated order confirmation screen via matching secret order tracking tokens, or through the protected `/admin` route.
- Admin dashboard endpoints require administrative authorization tokens.

---

## 5. HTTP & Transport Security Headers
- **CORS:** Restricted to verified client origins.
- **Helmet Middleware:** Enforces `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, and `Strict-Transport-Security`.
- **Rate Limiting:** Protection on `/api/upload/*` and `/api/orders` endpoints to prevent automated spam and server storage flooding.
