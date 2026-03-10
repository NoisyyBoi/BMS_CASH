# Fix "Error Sending OTP Email" Issue

## 🎉 Good News!
**Login is working!** The credentials are being accepted and it's trying to send OTP email. Now we just need to set up the email service.

## 🔧 The Issue
**"Error sending OTP email"** means the Gmail SMTP isn't configured yet.

---

## 🚀 Quick Fix - Setup Gmail SMTP

### Step 1: Get Gmail App Password (2 minutes)

1. **Go to Gmail Settings:**
   - Visit: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App passwords

2. **Enable 2FA first** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" → Follow setup

3. **Create App Password:**
   - Select app: "Mail"
   - Select device: "Other (custom name)"
   - Enter name: "BMS Cash App"
   - Click "Generate"
   - **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)

### Step 2: Deploy Edge Functions with Gmail Credentials

```bash
# Run this in your terminal
./deploy-edge-functions.sh
```

**When prompted, enter:**
- **Gmail Email:** Your Gmail address (e.g., `your-email@gmail.com`)
- **Gmail App Password:** The 16-character password (remove spaces: `abcdefghijklmnop`)

### Step 3: Update Admin Email in Database

```sql
-- Run this in Supabase SQL Editor
UPDATE admin_accounts 
SET email = 'your-gmail@gmail.com' 
WHERE username = 'kushal';

-- If the table doesn't exist, create it first:
CREATE TABLE IF NOT EXISTS admin_accounts (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Then insert the admin record:
INSERT INTO admin_accounts (username, email, password_hash) 
VALUES ('kushal', 'your-gmail@gmail.com', 'Kushal@BMS2024!')
ON CONFLICT (username) DO UPDATE SET
  email = EXCLUDED.email,
  password_hash = EXCLUDED.password_hash;
```

---

## 🧪 Test the Complete Flow

### After Setup:
1. **Login:** `kushal` / `Kushal@BMS2024!`
2. **Should see:** "✓ OTP sent to your email"
3. **Check Gmail:** Look for OTP email
4. **Enter OTP:** Complete login

---

## 🐛 Alternative: Skip Email Setup (Temporary)

If you want to test without email setup, you can temporarily disable 2FA:

### Option A: Disable 2FA Temporarily

**In `src/App.jsx`, find this section and comment it out:**

```javascript
// Temporarily disable 2FA for testing
if (passwordMatches) {
  // Skip OTP and login directly
  setIsAuthenticated(true);
  setUserRole(lowerUsername);
  localStorage.setItem('bms_user_role', lowerUsername);
  setView(VIEWS.HOME);
  loadUsers();
  loadTransactions();
  cleanupOldDeletedTransactions();
  cleanupOldSalaryPayments();
  cleanupExpiredOTPsOnLoad();
  showToast('✓ Login successful (2FA disabled)');
  return;
}

/* Comment out the OTP section:
if (passwordMatches) {
  setOtpSending(true);
  // ... OTP code
}
*/
```

---

## 🔍 Troubleshooting Email Setup

### Common Issues:

#### **"Authentication failed"**
- ✅ Make sure 2FA is enabled on Gmail
- ✅ Use App Password, not regular Gmail password
- ✅ Remove spaces from App Password: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

#### **"Edge function not found"**
- ✅ Run `./deploy-edge-functions.sh` to deploy
- ✅ Make sure Supabase CLI is installed: `npm install -g supabase`
- ✅ Login to Supabase: `supabase login`

#### **"Admin email not configured"**
- ✅ Run the SQL to insert admin record in database
- ✅ Make sure email matches your Gmail address

---

## 📋 Quick Checklist

- [ ] Gmail 2FA enabled
- [ ] Gmail App Password generated (16 characters)
- [ ] Edge functions deployed with Gmail credentials
- [ ] Admin email updated in Supabase database
- [ ] Test login → Should receive OTP email

---

## 🎯 Expected Working Flow

1. **Login:** `kushal` / `Kushal@BMS2024!`
2. **Console:** `✓ Using hardcoded password for: kushal`
3. **Message:** "✓ OTP sent to your email"
4. **Gmail:** Receive professional OTP email
5. **Enter OTP:** Complete login successfully

---

## 🚀 Next Steps

**Choose one:**

### **Option 1: Setup Gmail (Recommended)**
- Follow steps above to configure Gmail SMTP
- Get professional OTP emails
- Full 2FA security

### **Option 2: Temporary Disable 2FA**
- Comment out OTP code in App.jsx
- Login works immediately
- Setup email later

**Which option would you prefer?** The Gmail setup takes about 5 minutes and gives you the complete system! 📧