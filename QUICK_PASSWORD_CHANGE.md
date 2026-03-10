# Quick Password Change Guide

## 🚀 Change Password in 2 Steps

### Step 1: Update in Code (Already Done!)
✅ Changed kushal's password from `Kushal@123` to `Kushal@BMS2024!`

### Step 2: Update in Database

Go to Supabase and run this SQL:

```sql
UPDATE admin_accounts 
SET password_hash = 'Kushal@BMS2024!', 
    updated_at = NOW() 
WHERE username = 'kushal';
```

**Where to run it:**
1. Go to: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh/editor
2. Click "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste the SQL above
5. Click "Run"

That's it! ✅

## 🔄 To Change Password Again

### Option 1: Use the Script
```bash
node update-admin-password.js kushal YourNewPassword@123
```

### Option 2: Manual (2 places)

**1. In `src/App.jsx` (line ~30):**
```javascript
const ADMIN_CREDENTIALS = {
  kushal: 'YourNewPassword@123',  // ← Change here
  // ...
};
```

**2. In Supabase (SQL Editor):**
```sql
UPDATE admin_accounts 
SET password_hash = 'YourNewPassword@123', 
    updated_at = NOW() 
WHERE username = 'kushal';
```

## 📝 Password Rules
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character (!@#$%^&*)

## ✅ Current Status

| Item | Status |
|------|--------|
| Helper functions created | ✅ Done |
| Password updated in code | ✅ Done (Kushal@BMS2024!) |
| Password updated in DB | ⏳ Run SQL above |
| 2FA system ready | ✅ Done |
| Password reset ready | ✅ Done |
| Email setup needed | ⏳ See PASSWORD_RESET_GUIDE.md |

## 🎯 Next Steps

1. **Run the SQL** in Supabase (see Step 2 above)
2. **Update admin emails** in database (currently using example.com)
3. **Setup email service** (Resend or Supabase Edge Functions)
4. **Test login** with new password

See `PASSWORD_RESET_GUIDE.md` for complete setup instructions.
