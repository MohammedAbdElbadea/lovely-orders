-- LOVELY ORDERS - Row Level Security Policies
-- Migration: 002_rls_policies

-- Enable RLS on all tables
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotional_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ===================== PUBLIC READ POLICIES =====================

CREATE POLICY "Public can view active brands" ON brands FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active collections" ON collections FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Public can view published products" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "Public can view product images" ON product_images FOR SELECT USING (
  EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.status = 'published')
);
CREATE POLICY "Public can view active variants" ON product_variants FOR SELECT USING (
  is_active = true AND EXISTS (SELECT 1 FROM products p WHERE p.id = product_id AND p.status = 'published')
);
CREATE POLICY "Public can view product collections" ON product_collections FOR SELECT USING (true);
CREATE POLICY "Public can view product tags" ON product_tags FOR SELECT USING (true);
CREATE POLICY "Public can view approved reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public can view active pages" ON pages FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view enabled homepage sections" ON homepage_sections FOR SELECT USING (is_enabled = true);
CREATE POLICY "Public can view active banners" ON promotional_banners FOR SELECT USING (
  is_active = true AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now())
);
CREATE POLICY "Public can view active campaigns" ON campaigns FOR SELECT USING (status = 'active');
CREATE POLICY "Public can view public store settings" ON store_settings FOR SELECT USING (
  key IN ('store.name', 'store.contact', 'store.social', 'payment.vodafone_number', 'payment.instapay_number')
);

-- Public can submit reviews
CREATE POLICY "Public can submit reviews" ON reviews FOR INSERT WITH CHECK (status = 'pending');

-- ===================== ADMIN POLICIES =====================

CREATE POLICY "Admins full access brands" ON brands FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access categories" ON categories FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access collections" ON collections FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access tags" ON tags FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access products" ON products FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access product_images" ON product_images FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access product_variants" ON product_variants FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access product_collections" ON product_collections FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access product_tags" ON product_tags FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access customers" ON customers FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access customer_addresses" ON customer_addresses FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access customer_notes" ON customer_notes FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access discounts" ON discounts FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access coupons" ON coupons FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access campaigns" ON campaigns FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access promotional_banners" ON promotional_banners FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access orders" ON orders FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access order_items" ON order_items FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access order_status_history" ON order_status_history FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access reviews" ON reviews FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access inventory_logs" ON inventory_logs FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access pages" ON pages FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access homepage_sections" ON homepage_sections FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access store_settings" ON store_settings FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access audit_logs" ON audit_logs FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access login_history" ON login_history FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins full access security_events" ON security_events FOR ALL USING (is_admin(auth.uid()));
CREATE POLICY "Admins view own notifications" ON notifications FOR SELECT USING (
  admin_user_id IN (SELECT id FROM admin_users WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Admins update own notifications" ON notifications FOR UPDATE USING (
  admin_user_id IN (SELECT id FROM admin_users WHERE auth_user_id = auth.uid())
);

-- Admin system tables
CREATE POLICY "Admins can view roles" ON roles FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Super admins manage roles" ON roles FOR ALL USING (
  has_permission(auth.uid(), 'permissions.manage')
);
CREATE POLICY "Admins can view permissions" ON permissions FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view role_permissions" ON role_permissions FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Admins can view admin_users" ON admin_users FOR SELECT USING (is_admin(auth.uid()));
CREATE POLICY "Super admins manage admin_users" ON admin_users FOR ALL USING (
  has_permission(auth.uid(), 'users.manage')
);

-- ===================== STORAGE BUCKETS =====================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('brand-images', 'brand-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('category-images', 'category-images', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('website-assets', 'website-assets', true, 3145728, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read product images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public read brand images" ON storage.objects FOR SELECT USING (bucket_id = 'brand-images');
CREATE POLICY "Public read category images" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');
CREATE POLICY "Public read website assets" ON storage.objects FOR SELECT USING (bucket_id = 'website-assets');

CREATE POLICY "Admins upload product images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'product-images' AND is_admin(auth.uid())
);
CREATE POLICY "Admins upload brand images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'brand-images' AND is_admin(auth.uid())
);
CREATE POLICY "Admins upload category images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'category-images' AND is_admin(auth.uid())
);
CREATE POLICY "Admins upload website assets" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'website-assets' AND is_admin(auth.uid())
);
CREATE POLICY "Admins delete storage objects" ON storage.objects FOR DELETE USING (is_admin(auth.uid()));
CREATE POLICY "Admins update storage objects" ON storage.objects FOR UPDATE USING (is_admin(auth.uid()));
