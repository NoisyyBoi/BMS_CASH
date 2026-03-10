-- STEP 2: Add admin accounts (customize the emails and usernames below)

-- Main Admin (Kushal) - REPLACE EMAIL WITH YOUR ACTUAL EMAIL
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('kushal', 'your-email@gmail.com', 'Kushal@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 2 - REPLACE WITH ACTUAL DETAILS
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('manager', 'manager@yourcompany.com', 'Manager@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Admin 3 - REPLACE WITH ACTUAL DETAILS
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('cashier', 'cashier@yourcompany.com', 'Cashier@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- View results
SELECT username, email, created_at FROM admin_accounts ORDER BY username;