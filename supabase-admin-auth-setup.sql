-- Create admin_accounts table to store admin emails for 2FA
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

-- Create OTP verification table
CREATE TABLE IF NOT EXISTS admin_otp (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (username) REFERENCES admin_accounts(username) ON DELETE CASCADE
);

-- Disable RLS for admin_otp table
ALTER TABLE admin_otp DISABLE ROW LEVEL SECURITY;

-- Create password reset tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  reset_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  FOREIGN KEY (username) REFERENCES admin_accounts(username) ON DELETE CASCADE
);

-- Disable RLS for password_reset_tokens table
ALTER TABLE password_reset_tokens DISABLE ROW LEVEL SECURITY;

-- Insert admin accounts with their emails (update these with actual admin emails)
INSERT INTO admin_accounts (username, email, password_hash) VALUES
  ('kushal', 'kushal@example.com', 'Kushal@BMS2024!'),
  ('admin2', 'admin2@example.com', 'Admin2@BMS2024!'),
  ('admin3', 'admin3@example.com', 'Admin3@BMS2024!'),
  ('admin4', 'admin4@example.com', 'Admin4@BMS2024!'),
  ('admin5', 'admin5@example.com', 'Admin5@BMS2024!'),
  ('admin6', 'admin6@example.com', 'Admin6@BMS2024!'),
  ('admin7', 'admin7@example.com', 'Admin7@BMS2024!'),
  ('admin8', 'admin8@example.com', 'Admin8@BMS2024!')
ON CONFLICT (username) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_otp_username ON admin_otp(username);
CREATE INDEX IF NOT EXISTS idx_admin_otp_expires ON admin_otp(expires_at);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(reset_token);
CREATE INDEX IF NOT EXISTS idx_reset_tokens_expires ON password_reset_tokens(expires_at);

-- Function to clean up expired OTPs (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS void AS $$
BEGIN
  DELETE FROM admin_otp WHERE expires_at < NOW();
  DELETE FROM password_reset_tokens WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
