# Order Lifecycle & Customer Flow: Dhango Nepal

- **System:** Dhango Nepal Order Processing
- **Pricing:** Rs. 1,500 per custom t-shirt (showing crossed-out original Rs. 2,000)
- **Payment Method:** Manual QR Transfer (Fonepay, eSewa, Khalti)

---

## 1. End-to-End Order State Machine

```
[ Customer Submits Customizer Design / Studio Cart ]
                          │
                          ▼
[ Checkout: Delivery Form + QR Slip Upload ]
                          │
                          ▼
             [ Order Created (Status: received) ]
     (Payment Status: pending, Order ID: DHG-XXXXX)
                          │
                          ▼
[ Order Confirmation / Congratulations Screen ]
 - Order ID & Total (Rs. 1,500 * Qty)
 - Payment Slip Thumbnail & Reference Code
 - One-Click WhatsApp Support Button
                          │
                          ▼
[ Admin Verification in Dashboard ]
   ├── If QR slip & reference match:
   │     Payment Status -> 'verified'
   │     Order Status -> 'printing'
   └── If payment invalid/unmatched:
         Payment Status -> 'rejected'
         Customer contacted via phone/WhatsApp
                          │
                          ▼
          [ Garment DTG Production ]
                          │
                          ▼
          [ Courier Dispatch (Status: shipped) ]
                          │
                          ▼
        [ Delivery to Doorstep (Status: delivered) ]
```

---

## 2. Order Confirmation ("Congratulations") Screen Experience

When an order is placed:
1. **Confetti & Tactile Success State:** Instant celebratory visual confirmation using Emil Kowalski spring physics.
2. **Order ID:** A prominent tracking code (e.g. `DHG-92841`).
3. **Summary Card:**
   - Visual preview thumbnail of the customized t-shirt.
   - Selected size (S, M, L, XL, XXL) and garment color.
   - Price calculation: ~~Rs. 2,000~~ **Rs. 1,500**.
   - Delivery destination (Customer name, Nepal phone number, city, address).
4. **Payment Review Badge:**
   - Displays uploaded payment slip thumbnail.
   - Bank / eSewa reference code entered by user.
   - Status notice: *"Payment pending admin verification. Our team verifies slips within 15–30 minutes."*
5. **Direct WhatsApp Confirmation:**
   - Button: *"Confirm via WhatsApp"*.
   - Auto-opens WhatsApp with pre-filled message:
     `"Namaste Dhango Nepal! I have placed order #DHG-XXXXX for a custom t-shirt (Total: Rs. 1,500). Here is my order confirmation."`
6. **Live Tracking Link:**
   - Direct link to `/track?id=DHG-XXXXX` to monitor printing and delivery updates.
