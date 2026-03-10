-- =====================================================
-- CUSTOMIZE YOUR ADMIN ACCOUNTS
-- =====================================================
-- Edit the details below and run in Supabase SQL Editor

-- =====================================================
-- REPLACE WITH YOUR ACTUAL ADMIN DETAILS:
-- =====================================================

-- 👤 ADMIN 1 (Main Admin)
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('kushal', 'your-email@gmail.com', 'YourPassword@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- 👤 ADMIN 2
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('manager', 'manager@yourcompany.com', 'Manager@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- 👤 ADMIN 3
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('supervisor', 'supervisor@yourcompany.com', 'Supervisor@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- 👤 ADMIN 4
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('accountant', 'accountant@yourcompany.com', 'Accountant@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- 👤 ADMIN 5
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('cashier', 'cashier@yourcompany.com', 'Cashier@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- =====================================================
-- ADD MORE ADMINS AS NEEDED:
-- =====================================================

-- 👤 ADMIN 6 (Copy and modify as needed)
-- INSERT INTO admin_accounts (username, email, password_hash) 
-- VALUES ('admin6', 'admin6@yourcompany.com', 'Admin6@2024!')
-- ON CONFLICT (username) DO UPDATE SET
--   email = EXCLUDED.email,
--   password_hash = EXCLUDED.password_hash,
--   updated_at = NOW();

-- =====================================================
-- VERIFY YOUR CHANGES:
-- =====================================================
SELECT username, email, created_at, updated_at 
FROM admin_accounts 
ORDER BY username;