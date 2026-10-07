# Error Handling & Resilience Strategy: Dhango Nepal

- **System:** Dhango Nepal Platform
- **Scope:** Client-side failover, server error classification, upload failures, and database resilience

---

## 1. Client-Side Error Handlers & Fallbacks

### 1.1 WebGL / 3D Canvas Fallback
- **Scenario:** The user's device lacks WebGL2 hardware acceleration or has hardware acceleration disabled.
- **Handling:**
  1. The 3D viewport detects WebGL context availability upon mount.
  2. If WebGL fails, the UI renders a 2D high-resolution canvas mockup with drag-and-scale controls and a clear notification: *"Switched to 2D canvas mode for your device"*.
  3. All customization functions (colors, text, graphics, export) remain available.

### 1.2 Webcam / Camera Permission Denials
- **Scenario:** The user blocks camera access or lacks a webcam during Virtual Try-On.
- **Handling:**
  1. The application captures the `NotAllowedError` or `NotFoundError`.
  2. The UI smoothly toggles from the Live Mirror tab to the **Studio Models** tab.
  3. A friendly prompt suggests uploading a personal photo instead or using the curated models.

### 1.3 Offline & Network Disconnections
- **Scenario:** Mobile connectivity drops while customizing or checking out.
- **Handling:**
  1. Draft custom designs in the 3D Studio are stored in `localStorage` under `dhango_current_draft`.
  2. Shopping cart items persist in `localStorage` under `dhango_cart`.
  3. If an upload fails, the client shows a retry button without losing the user's design adjustments.

---

## 2. Server-Side Error Handling Pipeline

### 2.1 Standardized Error Response Format
All API errors return a consistent JSON payload:
```json
{
  "success": false,
  "error": {
    "code": "INVALID_FILE_TYPE",
    "message": "Only PNG, JPG, WEBP, and SVG image files are allowed.",
    "details": null
  }
}
```

### 2.2 Global Error Middleware
- Catches unhandled promise rejections and operational errors.
- Prevents stack traces from leaking to client responses in production.
- Logs errors with timestamp, request URL, HTTP method, and client IP.

### 2.3 Database Connectivity Failover
- If MongoDB connection drops or is temporarily unavailable, the server retains an in-memory/file-backed fallback cache for product reads and order writes, ensuring customer orders are not dropped during database restarts.
