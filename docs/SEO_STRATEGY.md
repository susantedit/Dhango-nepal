# SEO & Nepal GEO Local Search Strategy: Dhango Nepal

- **Target Domain:** Dhango Nepal (`dhango.np` / `dhangonepal.com`)
- **Primary Market:** Nepal (Kathmandu Valley, Pokhara, Chitwan, Dharan, Butwal, Biratnagar)
- **Primary Keywords:**
  - `custom tshirt print in nepal`
  - `tshirt printing kathmandu`
  - `customised t shirts nepal`
  - `dhango nepal custom printing`
  - `online t shirt design nepal`
  - `oversized custom tshirt kathmandu`
  - `custom hoodie printing nepal`

---

## 1. Technical SEO Foundation
- **Semantic HTML5:** Clean single `<h1>` per page, hierarchical `<h2>` and `<h3>` tags, descriptive link labels.
- **Dynamic Meta Tags (`SEOHead.jsx`):**
  - Page title with brand suffix (e.g. `Design Custom T-Shirts in Nepal | Dhango Nepal`).
  - Target meta description (under 160 characters) detailing the Rs. 1,500 offer and delivery coverage across Nepal.
  - Canonical tags preventing duplicate content indexing across query parameters.
- **Robots & Sitemap:**
  - `robots.txt` granting crawling access to all public catalog and customization pages, disallowing `/admin` and private upload paths.
  - `sitemap.xml` with dynamic daily/weekly changefreq on active product endpoints.

---

## 2. Structured Data (JSON-LD) Implementations

### 2.1 LocalBusiness Schema (Nepal Local SEO)
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Dhango Nepal",
  "image": "https://dhangonepal.com/logo.jpg",
  "telephone": "+977-9800000000",
  "email": "support@dhangonepal.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "New Baneshwor",
    "addressLocality": "Kathmandu",
    "addressRegion": "Bagmati",
    "postalCode": "44600",
    "addressCountry": "NP"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "27.6915",
    "longitude": "85.3420"
  },
  "priceRange": "NPR 1500",
  "currenciesAccepted": "NPR",
  "paymentAccepted": "Fonepay, eSewa, Khalti, Bank Transfer"
}
```

### 2.2 Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Custom Printed T-Shirt - Dhango Nepal",
  "image": "https://dhangonepal.com/uploads/mockup-default.png",
  "description": "100% Combed Cotton Custom Printed T-Shirt with high-density DTG print delivered across Nepal.",
  "brand": {
    "@type": "Brand",
    "name": "Dhango Nepal"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://dhangonepal.com/studio",
    "priceCurrency": "NPR",
    "price": "1500",
    "priceValidUntil": "2027-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Dhango Nepal"
    }
  }
}
```

---

## 3. GEO Citations & OpenGraph Signals
- OpenGraph tags (`og:title`, `og:description`, `og:image`, `og:locale: "en_NP"`, `og:site_name: "Dhango Nepal"`).
- Twitter Card tags (`summary_large_image`).
- City-focused landing keywords in trust cards and footer sections to optimize for regional Google Nepal search rankings.
