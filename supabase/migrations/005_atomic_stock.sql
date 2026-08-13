-- LOVELY ORDERS - Atomic Stock Decrement Migration
-- Migration: 005_atomic_stock

-- 1. Create atomic stock decrement PostgreSQL function
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_qty INT)
RETURNS BOOLEAN AS $$
DECLARE
  v_updated INT;
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - p_qty,
      is_available = (stock_quantity - p_qty) > 0
  WHERE id = p_product_id AND stock_quantity >= p_qty;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
