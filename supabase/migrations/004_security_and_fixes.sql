-- Migration: 004_security_and_fixes
-- Security fixes & inventory dashboard extensions

-- 1. Collision-safe Order Number Generator via Postgres Sequence
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  seq_val BIGINT;
BEGIN
  seq_val := nextval('order_number_seq');
  RETURN 'LO-' || TO_CHAR(now(), 'YYMMDD') || '-' || LPAD(seq_val::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Bind SECURITY DEFINER functions to search_path = public (Supabase Security Advisor)
ALTER FUNCTION is_admin(user_id UUID) SECURITY DEFINER SET search_path = public;
ALTER FUNCTION has_permission(user_id UUID, perm_name TEXT) SECURITY DEFINER SET search_path = public;

-- 3. Inventory Extensions for Phase 4
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode VARCHAR(100) UNIQUE;

-- Create Suppliers Table
CREATE TABLE IF NOT EXISTS suppliers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Add Batch & Expiry tracking columns to Inventory Logs
ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS batch_number VARCHAR(100);
ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS expiration_date DATE;
ALTER TABLE inventory_logs ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL;
