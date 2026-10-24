ARIYO PROFESSIONAL FRONTEND — UPDATED ZIP

Included:
- Responsive mobile-first homepage and navigation
- Product catalogue with category filters and enquiry links
- Services section using the service names provided for ARIYO
- Typing-effect announcements and subtle motion
- Location cards, Google Maps embed and directions links when a real address is configured
- Enquiry form UI, reviews placeholder
- Bottom-of-page install control, PWA manifest and service worker

IMPORTANT: This is a frontend starter, not a complete connected shop. Product cards are demo placeholders.
The enquiry form is NOT yet submitting to Supabase. This ZIP does not yet include authentication,
checkout, admin dashboard, payment verification, customer transaction history, referral commissions,
order tracking or receipt uploads. Those need secure integration and server-side logic.

ANDROID / GITHUB PAGES:
1. Download and extract this ZIP using Files.
2. Upload the extracted contents into the root of your GitHub repository (not the ZIP itself).
3. Keep index.html, styles.css, config.js, app.js, manifest.webmanifest and sw.js at repository root.
4. Keep assets/icon.svg inside the assets folder.
5. Enable GitHub Pages in repository Settings → Pages, main branch, root folder.
6. Open the published HTTPS site. If the install button is not available, use Chrome ⋮ → Install app or Add to Home screen.

CONFIGURATION:
Edit config.js. Add verified full addresses to locations[]; the template intentionally does not invent a business address.
Replace demoProducts with the real product catalogue or connect to Supabase. Edit announcements[] to change advert messages.
Use the project URL and publishable/anon key for browser integration only. NEVER put service_role/secret key or database password in public files.
Before launch, connect product/service reads and the enquiry form, then build secure auth/admin, verified payments, private receipts,
order tracking, referral attribution/commissions and payout workflows. Verify private storage policies before handling real receipts.


OWNER-PROVIDED BRAND ASSETS & CONTACTS ADDED
- assets/ariyo-logo.png: logo image supplied in the conversation
- assets/ariyo-hero.jpg: traditional display photo supplied in the conversation
- WhatsApp: +234 813 245 5540 (click-to-chat link uses international format 2348132455540)
- Facebook: https://www.facebook.com/share/14do6McyRJu/
- TikTok: https://www.tiktok.com/@ariyoherbalextracts
- Instagram: https://www.instagram.com/ariyoherbalextracts/
A floating WhatsApp button and footer social links are included.


SEO AND VERIFIED ADDRESS UPDATE
- Business address configured as supplied: Oyo London House, 18 Dr Haadi Babatunde Asiyanbi Road, Oyo Town, Oyo State, Nigeria.
- Added descriptive page title and meta description, Open Graph social sharing metadata, and LocalBusiness JSON-LD structured data.
- Added natural visible page copy for relevant searches, including Babalawo in Oyo Town/Oyo State, herbal products and personal care products.
- SEO does not guarantee first-page ranking. Submit the final live HTTPS URL to Google Search Console and verify the website/business information. If targeting Ibadan or Nigeria-wide queries, create pages only for areas ARIYO genuinely serves; don't claim an Ibadan address unless verified. Avoid unsupported medical claims.

PRODUCT CATALOGUE / CART UPDATE
- Added the supplied price-list image as a reference image.
- Added product cards and listed prices from the supplied image and user-provided prices.
- Added a basic cart and WhatsApp checkout with customer name, phone and delivery address.
- Added Moniepoint bank transfer details: account name Ariyo herbal extracts; account number 5216964606.
IMPORTANT: This is still a frontend-only WhatsApp order flow. It does not create an authenticated Supabase order or payment record and does not verify payments. Product descriptions intentionally avoid treating poster claims as medically proven. Confirm the product catalogue and prices before publishing.

FORMER WEBSITE DESIGN RESTORED
- Restored the former site structure: Home, About, Services, Products, Reviews, Contact/Location and footer.
- Restored forest-green/gold/cream brand palette, rounded catalogue cards, shadows, section headings, responsive grids and traditional premium look.
- Retained the current product list and prices, cart, WhatsApp checkout, bank-transfer details, supplied price-list image, address, social links, SEO metadata and PWA install support.
- Service cards now have designed image spaces; replace them with real service photos when available.


ORDER CHECKOUT UPDATE (added in ARIYO-Order-System-Update.zip)
- One checkout button uploads a payment receipt to private Supabase Storage, creates the order through a database RPC, then opens WhatsApp with order details.
- Customer must be signed in. The customer order dashboard shows pending order and payment status.
- Admin Orders tab shows customer contacts, address, items, amount and tracking ID. Payments tab offers a time-limited private receipt link. Confirming payment sets payment_status=paid and order status=confirmed.
- IMPORTANT: Run supabase/ariyo-order-system-migration.sql ONCE after reviewing. Do not rerun the full initial setup script.
- The migration adds the visible catalogue to public.products as UNPUBLISHED so an admin can review product information before publishing items for checkout. Products must be published and available for checkout.
- Ensure the exact same Supabase project URL and publishable/anon key are set in dashboard/config.js. The homepage loads that config for checkout. Never expose a service-role/secret key.
- Confirm the Moniepoint account details before launch. Delivery fee is intentionally left at ₦0 pending admin confirmation; admin must agree the final delivery amount with customer.
- Test using a small test order and verify the uploaded receipt is visible only to admins and the submitting customer.
