# Password Reset Guide

## ✅ What's Been Implemented

1. **Helper Functions Created** (`src/utils/adminAuth.js`)
   - `generateOTP()` - Generates 6-digit OTP codes
   - `storeOTP()` - Stores OTP in database
   - `verifyOTP()` - Verifies OTP codes
   - `generateResetToken()` - Generates secure reset tokens
   - `storeResetToken()` - Stores reset tokens in database
   - `verifyResetToken()` - Verifies reset tokens
   - `updateAdminPassword()` - Updates password in database
   - `getAdminEmail()` - Retrieves admin email from database
   - `sendOTPEmail()` - Sends OTP via email
   - `sendPasswordResetEmail()` - Sends password reset link via email

2. **Password Updated**
   - Changed kushal's password from `Kushal@123` to `Kushal@BMS2024!`

3. **Views Added**
   - `OTP_VERIFY` - For 2FA verification
   - `FORGOT_PASSWORD` - For password reset request
   - `RESET_PASSWORD` - For setting new password

## 🔧 How to Change Admin Password

### Method 1: Using the Script (Recommended)

```bash
node update-admin-password.js kushal YourNewPassword@123
```

This will:
- Update the password in `src/App.jsx`
- Show you the SQL query to run in Supabase

### Method 2: Manual Update

1. **Update in Code** (`src/App.jsx`):
   ```javascript
   const ADMIN_CREDENTIALS = {
     kushal: 'YourNewPassword@123',  // Change this
     // ... other admins
   };
   ```

2. **Update in Database**:
   - Go to Supabase Dashboard: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh
   - Navigate to: Table Editor → admin_accounts
   - Find the row for your username
   - Update the `password_hash` column with the new password
   - Click Save

   OR run this SQL query:
   ```sql
   UPDATE admin_accounts 
   SET password_hash = 'YourNewPassword@123', 
       updated_at = NOW() 
   WHERE username = 'kushal';
   ```

## 🚀 Setting Up Password Reset Feature

### Step 1: Database Setup

1. Go to Supabase SQL Editor
2. Run the SQL from `supabase-admin-auth-setup.sql`
3. Update admin emails in the INSERT statement:
   ```sql
   INSERT INTO admin_accounts (username, email, password_hash) VALUES
     ('kushal', 'your-real-email@example.com', 'Kushal@BMS2024!'),
     -- ... update other emails
   ```

### Step 2: Email Service Setup

You have two options:

#### Option A: Supabase Edge Functions (Recommended)

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Login and link project:
   ```bash
   supabase login
   supabase link --project-ref prjezxbbkqoieockoymh
   ```

3. Deploy edge functions:
   ```bash
   chmod +x deploy-edge-functions.sh
   ./deploy-edge-functions.sh
   ```

4. Set environment secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=your_resend_api_key
   supabase secrets set APP_URL=https://your-app-url.netlify.app
   ```

#### Option B: Resend API (Simpler)

1. Sign up at https://resend.com (100 emails/day free)
2. Get your API key
3. Update `.env`:
   ```
   VITE_RESEND_API_KEY=re_your_api_key_here
   VITE_APP_URL=https://your-app-url.netlify.app
   ```

### Step 3: Test the Flow

1. **Test Login with 2FA**:
   - Login as admin
   - Check email for OTP
   - Enter OTP to complete login

2. **Test Password Reset**:
   - Click "Forgot Password?"
   - Enter username
   - Check email for reset link
   - Click link and set new password
   - Login with new password

## 🔐 Password Requirements

All passwords must have:
- At least 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*)

## 📋 Current Admin Accounts

| Username | Default Password | Email (Update in DB) |
|----------|-----------------|---------------------|
| kushal   | Kushal@BMS2024! | kushal@example.com |
| admin2   | Admin2@BMS2024! | admin2@example.com |
| admin3   | Admin3@BMS2024! | admin3@example.com |
| admin4   | Admin4@BMS2024! | admin4@example.com |
| admin5   | Admin5@BMS2024! | admin5@example.com |
| admin6   | Admin6@BMS2024! | admin6@example.com |
| admin7   | Admin7@BMS2024! | admin7@example.com |
| admin8   | Admin8@BMS2024! | admin8@example.com |

## 🐛 Troubleshooting

### OTP Not Received
- Check spam folder
- Verify admin email in database
- Check Supabase Edge Function logs
- Verify RESEND_API_KEY is set

### Reset Link Not Working
- Check if link expired (1 hour expiry)
- Verify token in database
- Check browser console for errors

### Password Not Updating
- Verify password meets requirements
- Check database connection
- Verify admin_accounts table exists

### Database Tables Missing
- Run `supabase-admin-auth-setup.sql` in Supabase SQL Editor
- Check table permissions (RLS should be disabled)

## 📚 Related Files

- `src/utils/adminAuth.js` - Helper functions
- `src/App.jsx` - Main app with login/reset logic
- `supabase-admin-auth-setup.sql` - Database schema
- `deploy-edge-functions.sh` - Deploy script
- `supabase/functions/send-otp-email/index.ts` - OTP email function
- `supabase/functions/send-reset-email/index.ts` - Reset email function

## 🔄 How Password Reset Works

1. User clicks "Forgot Password?"
2. Enters username
3. System generates secure reset token
4. Token stored in database with 1-hour expiry
5. Email sent with reset link containing token
6. User clicks link, enters new password
7. System verifies token
8. Password updated in database
9. Token marked as used
10. User can login with new password

## 🎯 Quick Commands

```bash
# Change password
node update-admin-password.js kushal NewPassword@123

# Deploy edge functions
./deploy-edge-functions.sh

# Test Supabase connection
node -e "require('./src/supabaseClient.js').supabase.from('admin_accounts').select('username').then(console.log)"
```

## ✅ Checklist

- [ ] Database tables created (run SQL schema)
- [ ] Admin emails updated in database
- [ ] Edge functions deployed OR Resend API configured
- [ ] Environment variables set
- [ ] Passwords updated to strong passwords
- [ ] Tested login with 2FA
- [ ] Tested password reset flow
- [ ] Email delivery working
