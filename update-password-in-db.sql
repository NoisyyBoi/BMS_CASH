-- Quick SQL script to update admin password in Supabase
-- Run this in Supabase SQL Editor after updating password in code

-- Update kushal's password (change the password value as needed)
UPDATE admin_accounts 
SET password_hash = 'Kushal@BMS2024!', 
    updated_at = NOW() 
WHERE username = 'kushal';

-- Verify the update
SELECT username, email, password_hash, updated_at 
FROM admin_accounts 
WHERE username = 'kushal';

-- To update other admin passwords, use this template:
-- UPDATE admin_accounts 
-- SET password_hash = 'YourNewPassword@123', 
--     updated_at = NOW() 
-- WHERE username = 'admin2';
