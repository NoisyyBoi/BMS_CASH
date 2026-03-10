-- Create admin_accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_accounts (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Disable RLS for admin_accounts table
ALTER TABLE admin_accounts DISABLE ROW LEVEL SECURITY;

-- Create OTP verification table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_otp (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE
);

-- Disable RLS for admin_otp table
ALTER TABLE admin_otp DISABLE ROW LEVEL SECURITY;

-- Insert/Update admin accounts (replace with your actual details)
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('kushal', 'bms.cash.others@gmail.com', 'Kushal@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin2', 'admin2@yourcompany.com', 'Admin2@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin3', 'admin3@yourcompany.com', 'Admin3@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin4', 'admin4@yourcompany.com', 'Admin4@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('admin5', 'admin5@yourcompany.com', 'Admin5@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- View all admin accounts to verify
SELECT username, email, created_at, updated_at 
FROM admin_accounts 
ORDER BY username;