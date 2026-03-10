-- =====================================================
-- BMS Cash Entry - Update All Admin Accounts
-- =====================================================
-- Run this SQL in Supabase SQL Editor to update all admin accounts
-- with proper emails and usernames

-- First, let's see what's currently in the database
SELECT 'Current admin accounts:' as info;
SELECT username, email, password_hash, created_at, updated_at 
FROM admin_accounts 
ORDER BY username;

-- =====================================================
-- STEP 1: Clear existing admin accounts (optional)
-- =====================================================
-- Uncomment the next line if you want to start fresh
-- DELETE FROM admin_accounts;

-- =====================================================
-- STEP 2: Update/Insert Admin Accounts
-- =====================================================
-- Replace the emails and usernames below with your actual admin details

-- Main Admin (Kushal)
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('kushal', 'bms.cash.others@gmail.com', 'Kushal@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 2 - Update with actual details
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin2', 'admin2@yourdomain.com', 'Admin2@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 3 - Update with actual details
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin3', 'admin3@yourdomain.com', 'Admin3@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 4 - Update with actual details
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin4', 'admin4@yourdomain.com', 'Admin4@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 5 - Update with actual details
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin5', 'admin5@yourdomain.com', 'Admin5@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 6 - Update with actual details
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin6', 'admin6@yourdomain.com', 'Admin6@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 7 - Update with actual details
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin7', 'admin7@yourdomain.com', 'Admin7@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 8 - Update with actual details
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin8', 'admin8@yourdomain.com', 'Admin8@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- =====================================================
-- STEP 3: Verify Updates
-- =====================================================
SELECT 'Updated admin accounts:' as info;
SELECT username, email, password_hash, created_at, updated_at 
FROM admin_accounts 
ORDER BY username;

-- =====================================================
-- STEP 4: Clean up old OTPs and tokens
-- =====================================================
DELETE FROM admin_otp WHERE expires_at < NOW();
DELETE FROM password_reset_tokens WHERE expires_at < NOW();

SELECT 'Cleanup completed. Admin accounts updated successfully!' as result;