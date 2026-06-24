-- LOVELY ORDERS - Seed Data
-- Migration: 003_seed_data

-- Roles
INSERT INTO roles (id, name, description, is_system) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'super_admin', 'Full system access', true),
  ('a0000000-0000-0000-0000-000000000002', 'admin', 'General administration', true),
  ('a0000000-0000-0000-0000-000000000003', 'order_manager', 'Order management', true),
  ('a0000000-0000-0000-0000-000000000004', 'inventory_manager', 'Inventory management', true),
  ('a0000000-0000-0000-0000-000000000005', 'marketing_manager', 'Marketing and promotions', true),
  ('a0000000-0000-0000-0000-000000000006', 'support_manager', 'Customer support', true);

-- Permissions
INSERT INTO permissions (id, name, module, description) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'products.view', 'products', 'View products'),
  ('b0000000-0000-0000-0000-000000000002', 'products.create', 'products', 'Create products'),
  ('b0000000-0000-0000-0000-000000000003', 'products.edit', 'products', 'Edit products'),
  ('b0000000-0000-0000-0000-000000000004', 'products.delete', 'products', 'Delete products'),
  ('b0000000-0000-0000-0000-000000000005', 'orders.view', 'orders', 'View orders'),
  ('b0000000-0000-0000-0000-000000000006', 'orders.update', 'orders', 'Update orders'),
  ('b0000000-0000-0000-0000-000000000007', 'orders.cancel', 'orders', 'Cancel orders'),
  ('b0000000-0000-0000-0000-000000000008', 'orders.verify_payment', 'orders', 'Verify payments'),
  ('b0000000-0000-0000-0000-000000000009', 'customers.view', 'customers', 'View customers'),
  ('b0000000-0000-0000-0000-000000000010', 'customers.manage', 'customers', 'Manage customers'),
  ('b0000000-0000-0000-0000-000000000011', 'inventory.view', 'inventory', 'View inventory'),
  ('b0000000-0000-0000-0000-000000000012', 'inventory.manage', 'inventory', 'Manage inventory'),
  ('b0000000-0000-0000-0000-000000000013', 'marketing.view', 'marketing', 'View marketing'),
  ('b0000000-0000-0000-0000-000000000014', 'marketing.manage', 'marketing', 'Manage marketing'),
  ('b0000000-0000-0000-0000-000000000015', 'reviews.view', 'reviews', 'View reviews'),
  ('b0000000-0000-0000-0000-000000000016', 'reviews.moderate', 'reviews', 'Moderate reviews'),
  ('b0000000-0000-0000-0000-000000000017', 'cms.view', 'cms', 'View CMS content'),
  ('b0000000-0000-0000-0000-000000000018', 'cms.manage', 'cms', 'Manage CMS content'),
  ('b0000000-0000-0000-0000-000000000019', 'settings.view', 'settings', 'View settings'),
  ('b0000000-0000-0000-0000-000000000020', 'settings.manage', 'settings', 'Manage settings'),
  ('b0000000-0000-0000-0000-000000000021', 'users.manage', 'users', 'Manage admin users'),
  ('b0000000-0000-0000-0000-000000000022', 'permissions.manage', 'permissions', 'Manage permissions'),
  ('b0000000-0000-0000-0000-000000000023', 'audit.view', 'security', 'View audit logs'),
  ('b0000000-0000-0000-0000-000000000024', 'security.view', 'security', 'View security events');

-- Super admin gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000001', id FROM permissions;

-- Admin role permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000002', id FROM permissions
WHERE name NOT IN ('users.manage', 'permissions.manage');

-- Order manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000003', id FROM permissions
WHERE name IN ('products.view', 'orders.view', 'orders.update', 'orders.cancel', 'orders.verify_payment', 'customers.view');

-- Inventory manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000004', id FROM permissions
WHERE name IN ('products.view', 'products.create', 'products.edit', 'inventory.view', 'inventory.manage', 'orders.view');

-- Marketing manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000005', id FROM permissions
WHERE name IN ('products.view', 'marketing.view', 'marketing.manage', 'cms.view', 'cms.manage');

-- Support manager permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 'a0000000-0000-0000-0000-000000000006', id FROM permissions
WHERE name IN ('products.view', 'customers.view', 'customers.manage', 'orders.view', 'reviews.view', 'reviews.moderate');

-- Store settings
INSERT INTO store_settings (key, value) VALUES
  ('store.name', '"LOVELY ORDERS"'),
  ('store.contact', '{"phone": "01067258266", "email": "hello@lovelyorders.com"}'),
  ('store.social', '{"instagram": "", "facebook": ""}'),
  ('payment.vodafone_number', '"01067258266"'),
  ('payment.instapay_number', '"01067258266"'),
  ('inventory.low_stock_threshold', '5');

-- Brands
INSERT INTO brands (id, name, slug, description, is_active, sort_order) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Dior', 'dior', 'French luxury beauty house', true, 1),
  ('c0000000-0000-0000-0000-000000000002', 'Chanel', 'chanel', 'Timeless French elegance', true, 2),
  ('c0000000-0000-0000-0000-000000000003', 'La Mer', 'la-mer', 'Miracle broth skincare', true, 3),
  ('c0000000-0000-0000-0000-000000000004', 'Tom Ford Beauty', 'tom-ford-beauty', 'Modern luxury beauty', true, 4);

-- Categories
INSERT INTO categories (id, name, slug, description, sort_order, is_active) VALUES
  ('d0000000-0000-0000-0000-000000000001', 'Skincare', 'skincare', 'Premium skincare products', 1, true),
  ('d0000000-0000-0000-0000-000000000002', 'Makeup', 'makeup', 'Luxury makeup collection', 2, true),
  ('d0000000-0000-0000-0000-000000000003', 'Fragrance', 'fragrance', 'Exclusive fragrances', 3, true),
  ('d0000000-0000-0000-0000-000000000004', 'Serums', 'serums', 'Targeted treatment serums', 1, true),
  ('d0000000-0000-0000-0000-000000000005', 'Moisturizers', 'moisturizers', 'Hydrating moisturizers', 2, true),
  ('d0000000-0000-0000-0000-000000000006', 'Lipstick', 'lipstick', 'Luxury lip colors', 1, true);

UPDATE categories SET parent_id = 'd0000000-0000-0000-0000-000000000001' WHERE id IN ('d0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000005');
UPDATE categories SET parent_id = 'd0000000-0000-0000-0000-000000000002' WHERE id = 'd0000000-0000-0000-0000-000000000006';

-- Collections
INSERT INTO collections (id, name, slug, description, is_featured, sort_order, is_active) VALUES
  ('e0000000-0000-0000-0000-000000000001', 'Summer Glow', 'summer-glow', 'Radiant summer essentials', true, 1, true),
  ('e0000000-0000-0000-0000-000000000002', 'Night Ritual', 'night-ritual', 'Evening skincare collection', true, 2, true);

-- Sample Products
INSERT INTO products (id, name, slug, description, short_description, brand_id, category_id, subcategory_id, sku, price, compare_at_price, stock_quantity, is_featured, is_best_seller, is_new_arrival, is_on_sale, status, published_at) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'Capture Totale Super Potent Serum', 'capture-totale-serum', 'An extraordinary anti-aging serum that rejuvenates skin from within.', 'Anti-aging serum for youthful radiance', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 'DIOR-SERUM-001', 185.00, 220.00, 45, true, true, false, true, 'published', now()),
  ('f0000000-0000-0000-0000-000000000002', 'Crème de la Mer', 'creme-de-la-mer', 'The iconic moisturizer born from the sea.', 'Legendary moisturizing cream', 'c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005', 'LAMER-CREAM-001', 380.00, NULL, 30, true, true, false, false, 'published', now()),
  ('f0000000-0000-0000-0000-000000000003', 'Rouge Allure Velvet', 'rouge-allure-velvet', 'Intense color and comfort in a powdery matte finish.', 'Matte lipstick with intense color', 'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000006', 'CHANEL-LIP-001', 45.00, NULL, 100, false, true, true, false, 'published', now()),
  ('f0000000-0000-0000-0000-000000000004', 'Black Orchid Eau de Parfum', 'black-orchid-edp', 'A luxurious and sensual fragrance of rich dark accords.', 'Iconic luxury fragrance', 'c0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000003', NULL, 'TF-FRAG-001', 165.00, 195.00, 25, true, false, true, true, 'published', now()),
  ('f0000000-0000-0000-0000-000000000005', 'Prestige Le Nectar', 'prestige-le-nectar', 'Ultimate regeneration for exceptional skin.', 'Premium regeneration nectar', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005', 'DIOR-NEC-001', 420.00, NULL, 15, true, false, true, false, 'published', now()),
  ('f0000000-0000-0000-0000-000000000006', 'The Concentrate', 'the-concentrate', 'Powerful serum with Miracle Broth.', 'Concentrated healing serum', 'c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000004', 'LAMER-CON-001', 295.00, 350.00, 20, false, true, false, true, 'published', now());

-- Product images (placeholder URLs)
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1620916566399-0b6e75d9d0?w=800', 'Capture Totale Serum', 0, true),
  ('f0000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800', 'Crème de la Mer', 0, true),
  ('f0000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800', 'Rouge Allure Velvet', 0, true),
  ('f0000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', 'Black Orchid', 0, true),
  ('f0000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1611937660819-6fda978a3e0?w=800', 'Prestige Le Nectar', 0, true),
  ('f0000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1608248543773-f5112a5c5629?w=800', 'The Concentrate', 0, true);

-- Product collections
INSERT INTO product_collections (product_id, collection_id) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001'),
  ('f0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002'),
  ('f0000000-0000-0000-0000-000000000005', 'e0000000-0000-0000-0000-000000000002');

-- Sample reviews
INSERT INTO reviews (product_id, reviewer_name, rating, title, content, status) VALUES
  ('f0000000-0000-0000-0000-000000000001', 'Sarah M.', 5, 'Absolutely transformative', 'My skin has never looked better. Worth every penny.', 'approved'),
  ('f0000000-0000-0000-0000-000000000002', 'Emma L.', 5, 'The holy grail', 'This cream changed my skincare routine forever.', 'approved'),
  ('f0000000-0000-0000-0000-000000000003', 'Nadia K.', 4, 'Beautiful color', 'Gorgeous shade and long-lasting formula.', 'approved');

-- Homepage sections
INSERT INTO homepage_sections (section_type, title, config, sort_order, is_enabled) VALUES
  ('hero', 'Discover Luxury Beauty', '{"subtitle": "Curated premium cosmetics & skincare", "cta_text": "Shop Now", "cta_link": "/products", "image_url": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1920"}', 1, true),
  ('featured_products', 'Featured Products', '{"limit": 4, "filter": "featured"}', 2, true),
  ('featured_brands', 'Our Brands', '{"limit": 4}', 3, true),
  ('new_arrivals', 'New Arrivals', '{"limit": 4, "filter": "new_arrival"}', 4, true),
  ('best_sellers', 'Best Sellers', '{"limit": 4, "filter": "best_seller"}', 5, true),
  ('reviews', 'What Our Customers Say', '{"limit": 3}', 6, true);

-- CMS Pages
INSERT INTO pages (title, slug, content, meta_title, meta_description, status, published_at) VALUES
  ('About Us', 'about', '<h2>Our Story</h2><p>LOVELY ORDERS is Egypt''s premier destination for luxury cosmetics and skincare. We curate the finest products from world-renowned brands.</p>', 'About Us | LOVELY ORDERS', 'Learn about LOVELY ORDERS luxury beauty store', 'active', now()),
  ('Contact Us', 'contact', '<h2>Get in Touch</h2><p>Phone: 01067258266<br>Email: hello@lovelyorders.com</p>', 'Contact | LOVELY ORDERS', 'Contact LOVELY ORDERS', 'active', now()),
  ('FAQ', 'faq', '<h2>Frequently Asked Questions</h2><p><strong>How do I place an order?</strong><br>Browse products, add to cart, and checkout.</p>', 'FAQ | LOVELY ORDERS', 'Frequently asked questions', 'active', now()),
  ('Privacy Policy', 'privacy', '<h2>Privacy Policy</h2><p>We respect your privacy and protect your personal data.</p>', 'Privacy Policy | LOVELY ORDERS', 'Our privacy policy', 'active', now()),
  ('Refund Policy', 'refund', '<h2>Refund Policy</h2><p>We offer refunds within 14 days for unopened products.</p>', 'Refund Policy | LOVELY ORDERS', 'Our refund policy', 'active', now()),
  ('Shipping Policy', 'shipping', '<h2>Shipping Policy</h2><p>We deliver across Egypt within 2-5 business days.</p>', 'Shipping Policy | LOVELY ORDERS', 'Our shipping policy', 'active', now());

-- Promotional banner
INSERT INTO promotional_banners (title, subtitle, link_url, placement, sort_order, is_active) VALUES
  ('Summer Sale', 'Up to 30% off selected luxury items', '/deals', 'homepage', 1, true);
