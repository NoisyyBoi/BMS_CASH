# Admin Account Management Guide

## 🎯 Quick Setup

### Step 1: Update Admin Details
1. **Open Supabase Dashboard:** https://supabase.com/dashboard/project/prjezxbbkqoieockoymh
2. **Go to SQL Editor** (left sidebar)
3. **Copy and paste** the SQL from `customize-admin-accounts.sql`
4. **Edit the details** with your actual admin information
5. **Click "Run"** to execute

### Step 2: Test Login
- Try logging in with your updated credentials
- Should receive OTP at the new email address

---

## 📝 Admin Account Template

```sql
-- Replace with actual details:
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('your-username', 'your-email@gmail.com', 'YourPassword@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();
```

---

## 🔧 Common Operations

### ✅ Add New Admin
```sql
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('newadmin', 'newadmin@company.com', 'NewAdmin@2024!')
ON CONFLICT (username) DO NOTHING;
```

### ✅ Update Admin Email
```sql
UPDATE admin_accounts 
SET email = 'newemail@company.com', updated_at = NOW()
WHERE username = 'kushal';
```

### ✅ Update Admin Password
```sql
UPDATE admin_accounts 
SET password_hash = 'NewPassword@2024!', updated_at = NOW()
WHERE username = 'kushal';
```

### ✅ Delete Admin
```sql
DELETE FROM admin_accounts 
WHERE username = 'oldadmin';
```

### ✅ View All Admins
```sql
SELECT username, email, created_at, updated_at 
FROM admin_accounts 
ORDER BY username;
```

---

## 🎨 Suggested Admin Structure

### **For Small Business:**
- `owner` - Business owner (main admin)
- `manager` - Store manager
- `cashier` - Daily operations

### **For Medium Business:**
- `kushal` - Main admin
- `manager` - Operations manager
- `accountant` - Financial management
- `supervisor` - Daily supervision
- `cashier1` - Primary cashier
- `cashier2` - Secondary cashier

### **For Large Business:**
- `admin` - System administrator
- `finance` - Finance department
- `operations` - Operations team
- `branch1` - Branch 1 manager
- `branch2` - Branch 2 manager
- `auditor` - Audit access

---

## 🔒 Password Requirements

**All passwords must:**
- Be at least 8 characters long
- Include uppercase and lowercase letters
- Include numbers
- Include special characters (@, !, #, etc.)

**Examples:**
- `Manager@2024!`
- `Cashier#123`
- `Admin$2024`

---

## 📧 Email Requirements

**For OTP delivery:**
- Must be valid, active email addresses
- Admins should have access to these emails
- Consider using company email addresses
- Gmail, Outlook, and other providers supported

---

## 🧪 Testing Checklist

After updating admin accounts:

- [ ] **Login Test:** Try logging with new credentials
- [ ] **OTP Test:** Verify OTP emails are received
- [ ] **Password Reset:** Test forgot password flow
- [ ] **Multiple Admins:** Test different admin accounts
- [ ] **Email Delivery:** Check spam/junk folders

---

## 🚨 Important Notes

### **Security:**
- Never share admin credentials
- Use strong, unique passwords
- Regularly update passwords
- Monitor login activities

### **Email Setup:**
- Make sure Gmail SMTP is configured
- OTP emails go to the admin's registered email
- Check spam folders if emails don't arrive

### **Database:**
- Changes take effect immediately
- Old OTPs are automatically cleaned up
- Password changes require new login

---

## 🆘 Troubleshooting

### **"Admin email not configured"**
- Run the SQL to insert/update admin record
- Make sure email field is not empty

### **"Invalid credentials"**
- Check username spelling (case-sensitive)
- Verify password matches database
- Try hardcoded password if database fails

### **"Error sending OTP email"**
- Verify Gmail SMTP is configured
- Check admin email is valid
- Run `./deploy-edge-functions.sh` if needed

### **"OTP expired"**
- OTPs expire in 10 minutes
- Request new OTP if expired
- Check system time is correct

---

## 📞 Quick Commands

### **Reset Everything:**
```sql
DELETE FROM admin_accounts;
-- Then run your insert statements
```

### **Emergency Access:**
```sql
-- Add emergency admin
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('emergency', 'your-email@gmail.com', 'Emergency@2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash;
```

### **Check Current Setup:**
```sql
SELECT 'Current admins:' as info;
SELECT username, email, 
       CASE WHEN password_hash = 'Kushal@BMS2024!' THEN 'Default Password' 
            ELSE 'Custom Password' END as password_status,
       updated_at
FROM admin_accounts 
ORDER BY username;
```

---

**Ready to customize your admin accounts!** 🚀