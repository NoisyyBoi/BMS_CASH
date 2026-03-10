-- Update admin email to match Gmail SMTP configuration
-- Run this in Supabase SQL Editor

-- Create admin_accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_accounts (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE admin_accounts DISABLE ROW LEVEL SECURITY;

-- Create OTP table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_otp (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE
);

-- Disable RLS for OTP table
ALTER TABLE admin_otp DISABLE ROW LEVEL SECURITY;

-- Insert/update admin account with the Gmail that's configured
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('kushal', 'bms.cash.others@gmail.com', 'Kushal@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Verify the update
SELECT username, email, password_hash, updated_at 
FROM admin_accounts 
WHERE username = 'kushal';