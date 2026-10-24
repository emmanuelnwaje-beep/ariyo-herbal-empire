ARIYO CUSTOMER + ADMIN DASHBOARD PACK
======================================

Files in dashboard/:
- customer.html / customer.js: customer registration, sign-in, order history/tracking, referral link/commission display, payout account and payout request UI.
- admin.html / admin.js: administrator sign-in, catalogue CRUD, services CRUD, order status updates, payment review, enquiries, review moderation, adverts, referral payout review and bank transfer settings.
- dashboard.css: responsive green/gold/cream styling.
- config.js: Supabase URL and public publishable/anon key configuration.
- The website's app.js has also been updated so WhatsApp order messages use a tidy business format and real newline breaks. The main site has a My Account link.

INSTALL:
1. Upload the extracted files/folders to the root of the existing GitHub repository, preserving the dashboard/ folder and assets/ folder.
2. In Supabase dashboard, open Project Settings -> API. Copy the Project URL and publishable/anon key (or legacy anon key) into dashboard/config.js. Do NOT use a service_role/secret key, database password, or any private key in frontend files.
3. Wait for GitHub Pages deployment, then open:
   - Customer account: https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY/dashboard/customer.html
   - Admin dashboard: https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY/dashboard/admin.html
4. In Supabase Authentication settings, configure the site's Site URL and Redirect URLs to include the GitHub Pages URL. Email confirmation may require customers to confirm before signing in.
5. Assign the owner's existing profile the admin role using SQL Editor. Replace EMAIL with the exact owner email:
   update public.profiles
   set role = 'admin'
   where id = (select id from auth.users where email = 'EMAIL');
   Run this only after confirming the email identifies the correct owner account. Do not share your password.
6. Sign in at admin.html using that owner's normal Supabase Auth account. Do not create an admin role from a public signup form.

IMPORTANT FUNCTIONAL LIMITS / SECURITY:
- Admin pages rely on Supabase Row Level Security policies already created by the ARIYO setup script. Never expose the service-role key.
- Public website WhatsApp checkout sends a well-formatted order enquiry, but it does NOT create a database order. Therefore orders placed only through WhatsApp will not automatically appear in the customer dashboard or admin order list.
- The current database schema intentionally restricts order creation. To make database order history, tracking IDs, payment submission and referral commissions work end-to-end, add a secure checkout Edge Function/server-side endpoint that validates prices from the database, creates orders and payment records, and awards the ₦500 commission only after an admin verifies a qualifying paid order. Do not let a browser trust a customer-supplied total or self-award commissions.
- The customer referral form displays the profile referral code. A production referral flow must also create/link rows in public.referrals and reliably attribute new customer orders. This UI does not award commissions by itself.
- Bank details/payout requests and admin actions will fail safely if their RLS policy is missing or if schema columns differ. Read any Supabase error shown before retrying.
- Payment verification in this UI updates the payment record and order payment status after the admin presses Verify. Only do so after checking the real bank transaction.
- Receipt upload and customer-side payment submission are not included in this pack yet.
- Do not store bank PINs, passwords, OTPs, or online banking credentials.
