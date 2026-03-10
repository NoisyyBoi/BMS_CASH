# Debug Password Reset Issue

## 🔍 Let's Debug This Step by Step

### Step 1: Check What's in the Database

Run this SQL in Supabase SQL Editor to see what's stored:

```sql
-- Check admin accounts table
SELECT username, email, password_hash, updated_at 
FROM admin_accounts 
WHERE username = 'kushal';
```

**Expected Result:**
- If password was reset: `password_hash` should be your NEW password
- If not reset yet: No rows or `password_hash` is old password

### Step 2: Check Browser Console

1. **Open browser console** (F12 → Console tab)
2. **Try to login** with new password
3. **Look for these logs:**
   ```
   Checking database password for: kushal
   OR
   Using hardcoded password for: kushal
   OR  
   Password does not match for admin: kushal
   ```

### Step 3: Test Different Scenarios

#### **Scenario A: Database Has New Password**
```sql
-- If this shows your NEW password
SELECT password_hash FROM admin_accounts WHERE username = 'kushal';
```
- Try login with NEW password
- Should see: "Checking database password for: kushal"

#### **Scenario B: Database Empty/Old Password**  
```sql
-- If this shows nothing or OLD password
SELECT password_hash FROM admin_accounts WHERE username = 'kushal';
```
- Try login with hardcoded password: `Kushal@BMS2024!`
- Should see: "Using hardcoded password for: kushal"

### Step 4: Manual Database Update

If password reset didn't work, manually update:

```sql
-- Update password in database
UPDATE admin_accounts 
SET password_hash = 'YourNewPassword@123',
    updated_at = NOW()
WHERE username = 'kushal';

-- Verify update
SELECT username, password_hash, updated_at 
FROM admin_accounts 
WHERE username = 'kushal';
```

### Step 5: Test Login Flow

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Try login** with the password you set in database
3. **Check console logs** for debugging info

---

## 🐛 Common Issues & Solutions

### Issue 1: Database Table Doesn't Exist
**Error:** `relation "admin_accounts" does not exist`

**Solution:** Run the SQL schema:
```sql
-- Run this in Supabase SQL Editor
-- Copy from supabase-admin-auth-setup.sql
CREATE TABLE IF NOT EXISTS admin_accounts (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Issue 2: No Admin Record in Database
**Console:** `Using hardcoded password for: kushal`

**Solution:** Insert admin record:
```sql
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('kushal', 'your-email@gmail.com', 'Kushal@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();
```

### Issue 3: Password Reset Didn't Update Database
**Console:** `Using hardcoded password for: kushal` (but you reset password)

**Solution:** Check if reset actually worked:
```sql
-- Check recent updates
SELECT username, password_hash, updated_at 
FROM admin_accounts 
WHERE username = 'kushal' 
ORDER BY updated_at DESC;
```

### Issue 4: Case Sensitivity Issue
**Console:** `No valid credentials found for: Kushal`

**Solution:** Username should be lowercase:
```sql
-- Ensure username is lowercase
UPDATE admin_accounts 
SET username = LOWER(username)
WHERE username = 'Kushal';
```

---

## 🔧 Quick Fix Commands

### Reset Everything:
```sql
-- 1. Delete existing record
DELETE FROM admin_accounts WHERE username = 'kushal';

-- 2. Insert fresh record
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('kushal', 'your-email@gmail.com', 'Kushal@BMS2024!');

-- 3. Verify
SELECT * FROM admin_accounts WHERE username = 'kushal';
```

### Test Login:
1. Use username: `kushal` (lowercase)
2. Use password: `Kushal@BMS2024!` (from database)
3. Should work with 2FA

---

## 📋 Debugging Checklist

- [ ] Database table `admin_accounts` exists
- [ ] Record exists for username `kushal`
- [ ] Password in database matches what you're typing
- [ ] Username is lowercase in database
- [ ] Browser console shows debugging logs
- [ ] No JavaScript errors in console
- [ ] Supabase connection working

---

## 🎯 Expected Working Flow

1. **Enter credentials:** `kushal` + `YourNewPassword@123`
2. **Console shows:** `Checking database password for: kushal`
3. **Password matches:** Proceeds to OTP screen
4. **OTP sent:** Check email for 6-digit code
5. **Enter OTP:** Login successful

---

## 📞 Next Steps

**Please check:**
1. **Run the SQL query** to see what's in database
2. **Check browser console** for debugging logs  
3. **Try the manual update** if needed
4. **Report back** what you see in console/database

**This will help me identify exactly what's happening!** 🔍