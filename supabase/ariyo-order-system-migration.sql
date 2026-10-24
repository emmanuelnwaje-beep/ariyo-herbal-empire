-- ARIYO order checkout migration. Run ONCE in Supabase SQL Editor after reviewing.
-- Uses authenticated customer sessions, server-side product price lookup, private receipts and admin-only review.

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS whatsapp_number text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS delivery_notes text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS receipt_storage_path text;

-- Ensure the private receipt bucket exists. Receipts must never be public.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ariyo-payment-receipts','ariyo-payment-receipts',false,10485760,ARRAY['image/jpeg','image/png','image/webp','application/pdf'])
ON CONFLICT (id) DO UPDATE SET public=false, file_size_limit=10485760, allowed_mime_types=ARRAY['image/jpeg','image/png','image/webp','application/pdf'];

-- Authenticated customers can upload only into their own UID folder; admins can review receipts.
DROP POLICY IF EXISTS "Customers upload own ARIYO receipts" ON storage.objects;
CREATE POLICY "Customers upload own ARIYO receipts" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='ariyo-payment-receipts' AND (storage.foldername(name))[1]=(SELECT auth.uid())::text);
DROP POLICY IF EXISTS "Customers read own ARIYO receipts" ON storage.objects;
CREATE POLICY "Customers read own ARIYO receipts" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='ariyo-payment-receipts' AND ((storage.foldername(name))[1]=(SELECT auth.uid())::text OR (SELECT public.is_ariyo_admin())));
-- Existing admin receipt policies are preserved/recreated safely.
DROP POLICY IF EXISTS "Admins read payment receipts" ON storage.objects;
CREATE POLICY "Admins read payment receipts" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id='ariyo-payment-receipts' AND (SELECT public.is_ariyo_admin()));
DROP POLICY IF EXISTS "Admins upload payment receipts" ON storage.objects;
CREATE POLICY "Admins upload payment receipts" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id='ariyo-payment-receipts' AND (SELECT public.is_ariyo_admin()));
DROP POLICY IF EXISTS "Admins delete payment receipts" ON storage.objects;
CREATE POLICY "Admins delete payment receipts" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id='ariyo-payment-receipts' AND (SELECT public.is_ariyo_admin()));

INSERT INTO public.products (name, slug, description, price, category, is_published) VALUES
  ('Infection Flusher (Big)', 'infection-flusher-big', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'herbal', false),
  ('Infection Flusher (Small)', 'infection-flusher-small', 'Contact ARIYO to confirm availability and ask for product information.', 5000.0, 'herbal', false),
  ('Gonorrhea/Sweetie', 'gonorrhea-sweetie', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'herbal', false),
  ('Jedi/Opa Eyin (2 Litres)', 'jedi-opa-eyin-2-litres', 'Contact ARIYO to confirm availability and ask for product information.', 15000.0, 'herbal', false),
  ('Jedi/Opa Eyin (1 Litre)', 'jedi-opa-eyin-1-litre', 'Contact ARIYO to confirm availability and ask for product information.', 8000.0, 'herbal', false),
  ('Active Man (Manpower 2 Litres)', 'active-man-manpower-2-litres', 'Contact ARIYO to confirm availability and ask for product information.', 20000.0, 'personal-care', false),
  ('Active Man (Manpower 1 Litre)', 'active-man-manpower-1-litre', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'personal-care', false),
  ('Yeast Infection Treatment', 'yeast-infection-treatment', 'Contact ARIYO to confirm availability and ask for product information.', 15000.0, 'herbal', false),
  ('Genital Wart Treatment', 'genital-wart-treatment', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'herbal', false),
  ('Detox (Big)', 'detox-big', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'herbal', false),
  ('Detox (Small)', 'detox-small', 'Contact ARIYO to confirm availability and ask for product information.', 5000.0, 'herbal', false),
  ('Lungs and Liver Detox', 'lungs-and-liver-detox', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'herbal', false),
  ('Smoker Detox', 'smoker-detox', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'herbal', false),
  ('Immune Booster (Big)', 'immune-booster-big', 'Contact ARIYO to confirm availability and ask for product information.', 20000.0, 'herbal', false),
  ('Immune Booster (Small)', 'immune-booster-small', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'herbal', false),
  ('PID', 'pid', 'Contact ARIYO to confirm availability and ask for product information.', 25000.0, 'herbal', false),
  ('Womb Cleanser', 'womb-cleanser', 'Contact ARIYO to confirm availability and ask for product information.', 20000.0, 'herbal', false),
  ('Hormonal Imbalance', 'hormonal-imbalance', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'herbal', false),
  ('Staphylococcus Package', 'staphylococcus-package', 'Contact ARIYO to confirm availability and ask for product information.', 25000.0, 'herbal', false),
  ('Fibroid Package', 'fibroid-package', 'Contact ARIYO to confirm availability and ask for product information.', 40000.0, 'herbal', false),
  ('Ovarian Cyst', 'ovarian-cyst', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'herbal', false),
  ('Koko Master Combo', 'koko-master-combo', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'personal-care', false),
  ('Kidney Treatment', 'kidney-treatment', 'Contact ARIYO to confirm availability and ask for product information.', 50000.0, 'herbal', false),
  ('Breast Lump (with Soap and Cream)', 'breast-lump-with-soap-and-cream', 'Contact ARIYO to confirm availability and ask for product information.', 40000.0, 'personal-care', false),
  ('Libido Booster', 'libido-booster', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'personal-care', false),
  ('Wetness Combo', 'wetness-combo', 'Contact ARIYO to confirm availability and ask for product information.', 15000.0, 'personal-care', false),
  ('Ovulation Booster', 'ovulation-booster', 'Contact ARIYO to confirm availability and ask for product information.', 20000.0, 'herbal', false),
  ('Sperm Booster', 'sperm-booster', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'personal-care', false),
  ('UTI', 'uti', 'Contact ARIYO to confirm availability and ask for product information.', 25000.0, 'herbal', false),
  ('Period Restorer', 'period-restorer', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'herbal', false),
  ('PCOS', 'pcos', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'herbal', false),
  ('Fertility Package', 'fertility-package', 'Contact ARIYO to confirm availability and ask for product information.', 70000.0, 'herbal', false),
  ('Hypo/Hypertension Package', 'hypo-hypertension-package', 'Contact ARIYO to confirm availability and ask for product information.', 40000.0, 'herbal', false),
  ('Ulcer Cure', 'ulcer-cure', 'Contact ARIYO to confirm availability and ask for product information.', 25000.0, 'herbal', false),
  ('Diabetes Package', 'diabetes-package', 'Contact ARIYO to confirm availability and ask for product information.', 40000.0, 'herbal', false),
  ('Sperm Leakage (EDA)', 'sperm-leakage-eda', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'personal-care', false),
  ('Tube Blockage', 'tube-blockage', 'Contact ARIYO to confirm availability and ask for product information.', 30000.0, 'herbal', false),
  ('Hemorrhoid Herb (with Soap)', 'hemorrhoid-herb-with-soap', 'Contact ARIYO to confirm availability and ask for product information.', 20000.0, 'herbal', false),
  ('WeightLoss/Fat Tummy Herb (Big)', 'weightloss-fat-tummy-herb-big', 'Contact ARIYO to confirm availability and ask for product information.', 16000.0, 'herbal', false),
  ('WeightLoss/Fat Tummy Herb (Small)', 'weightloss-fat-tummy-herb-small', 'Contact ARIYO to confirm availability and ask for product information.', 8000.0, 'herbal', false),
  ('Ose Kokoro (Pimples/Rashes/Eczema)', 'ose-kokoro-pimples-rashes-eczema', 'Contact ARIYO to confirm availability and ask for product information.', 5000.0, 'personal-care', false),
  ('Malaria/Fever/Typhoid', 'malaria-fever-typhoid', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'herbal', false),
  ('Contraceptive Neutralizer', 'contraceptive-neutralizer', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'herbal', false),
  ('Coochie Oil', 'coochie-oil', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'personal-care', false),
  ('Feminine Wash', 'feminine-wash', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'personal-care', false),
  ('Breast Firming Oil (Big)', 'breast-firming-oil-big', 'Contact ARIYO to confirm availability and ask for product information.', 20000.0, 'personal-care', false),
  ('Breast Firming Oil (Small)', 'breast-firming-oil-small', 'Contact ARIYO to confirm availability and ask for product information.', 10000.0, 'personal-care', false),
  ('Scorpion Drink', 'scorpion-drink', 'Contact ARIYO to confirm availability and ask for product information.', 500.0, 'personal-care', false)
ON CONFLICT (slug) DO UPDATE SET name=excluded.name, description=excluded.description, price=excluded.price, category=excluded.category, is_published=false, updated_at=now();

-- Checkout RPC: the browser submits product names and quantities, never trusted prices.
CREATE OR REPLACE FUNCTION public.submit_ariyo_order(
  p_order_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text,
  p_whatsapp_number text,
  p_delivery_address text,
  p_delivery_notes text,
  p_items jsonb,
  p_receipt_path text,
  p_payment_reference text DEFAULT NULL
) RETURNS TABLE(order_id uuid, order_number text, tracking_id text, total numeric)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE
  v_uid uuid := auth.uid();
  v_items jsonb := '[]'::jsonb;
  v_item jsonb;
  v_name text;
  v_qty integer;
  v_product record;
  v_subtotal numeric(12,2) := 0;
  v_order_number text;
  v_tracking_id text;
BEGIN
  IF v_uid IS NULL THEN RAISE EXCEPTION 'Please sign in before placing an order.'; END IF;
  IF length(trim(coalesce(p_customer_name,''))) < 2 OR length(trim(coalesce(p_email,''))) < 5
     OR length(trim(coalesce(p_phone,''))) < 7 OR length(trim(coalesce(p_whatsapp_number,''))) < 7
     OR length(trim(coalesce(p_delivery_address,''))) < 5 THEN
    RAISE EXCEPTION 'Complete your name, email, phone, WhatsApp number and delivery address.';
  END IF;
  IF p_items IS NULL OR jsonb_typeof(p_items) <> 'array' OR jsonb_array_length(p_items)=0 THEN
    RAISE EXCEPTION 'Your cart is empty.';
  END IF;
  IF p_receipt_path IS NULL OR split_part(p_receipt_path,'/',1) <> v_uid::text
     OR split_part(p_receipt_path,'/',2) <> p_order_id::text THEN
    RAISE EXCEPTION 'Receipt path is invalid.';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM storage.objects o WHERE o.bucket_id='ariyo-payment-receipts' AND o.name=p_receipt_path) THEN
    RAISE EXCEPTION 'Upload your payment receipt before submitting the order.';
  END IF;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
    v_name := trim(coalesce(v_item->>'name',''));
    v_qty := greatest(0, least(100, coalesce((v_item->>'qty')::integer,0)));
    IF v_name='' OR v_qty < 1 THEN RAISE EXCEPTION 'A cart item or quantity is invalid.'; END IF;
    SELECT p.id,p.name,p.price,p.currency,p.stock_status INTO v_product
    FROM public.products p WHERE p.name=v_name AND p.is_published=true LIMIT 1;
    IF NOT FOUND OR v_product.stock_status <> 'available' THEN
      RAISE EXCEPTION 'Product is unavailable: %', v_name;
    END IF;
    v_subtotal := v_subtotal + (v_product.price * v_qty);
    v_items := v_items || jsonb_build_array(jsonb_build_object(
      'product_id',v_product.id,'name',v_product.name,'price',v_product.price,
      'qty',v_qty,'quantity',v_qty,'line_total',v_product.price*v_qty,'currency',v_product.currency
    ));
  END LOOP;

  INSERT INTO public.orders (id,customer_id,customer_name,email,phone,whatsapp_number,delivery_address,delivery_notes,items,subtotal,delivery_fee,total,status,payment_status)
  VALUES (p_order_id,v_uid,trim(p_customer_name),trim(p_email),trim(p_phone),trim(p_whatsapp_number),trim(p_delivery_address),nullif(trim(coalesce(p_delivery_notes,'')),''),v_items,v_subtotal,0,v_subtotal,'pending','receipt_submitted')
  RETURNING public.orders.order_number, public.orders.tracking_id INTO v_order_number,v_tracking_id;

  INSERT INTO public.payment_records (order_id,customer_id,payment_method,payment_reference,amount,currency,receipt_storage_path,status,submitted_at)
  VALUES (p_order_id,v_uid,'bank_transfer',nullif(trim(coalesce(p_payment_reference,'')),''),v_subtotal,'NGN',p_receipt_path,'pending',now());

  RETURN QUERY SELECT p_order_id,v_order_number,v_tracking_id,v_subtotal;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_ariyo_order(uuid,text,text,text,text,text,text,jsonb,text,text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.submit_ariyo_order(uuid,text,text,text,text,text,text,jsonb,text,text) TO authenticated;

-- Customers cannot directly insert/update orders or set payment status; order creation is via the RPC above.
REVOKE INSERT, UPDATE, DELETE ON public.orders FROM anon;
REVOKE INSERT, UPDATE, DELETE ON public.payment_records FROM anon;
GRANT SELECT ON public.orders, public.payment_records TO authenticated;

-- Payment records are updated only by admin through the existing admin policies.
