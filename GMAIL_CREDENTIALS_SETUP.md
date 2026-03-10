# Gmail SMTP Setup with New Credentials

## 🔧 Step-by-Step Gmail Setup

### Step 1: Create/Use Gmail Account

1. **Use existing Gmail** or **create new Gmail account**
2. **Enable 2-Factor Authentication** (required for App Passwords)
   - Go to: https://myaccount.google.com/security
   - Click "2-Step Verification" → Follow setup

### Step 2: Generate App Password

1. **Go to Google Account Settings:**
   - Visit: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → App passwords

2. **Create App Password:**
   - Select app: "Mail"
   - Select device: "Other (custom name)"
   - Enter name: "BMS Cash App"
   - Click "Generate"

3. **Copy the 16-character password** (e.g., `abcd efgh ijkl mnop`)
   - ⚠️ **Save this immediately** - you can't see it again!

### Step 3: Update Environment Variables

Update your `.env` file:

```env
# Supabase (keep existing)
VITE_SUPABASE_URL=https://prjezxbbkqoieockoymh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Gmail SMTP (update these)
GMAIL_EMAIL=your-gmail@gmail.com
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

**Important:** 
- Use the **16-character app password**, not your regular Gmail password
- Remove spaces from app password: `abcd efgh ijkl mnop` → `abcdefghijklmnop`

### Step 4: Deploy Edge Functions with New Credentials

```bash
# Deploy with new Gmail credentials
./deploy-edge-functions.sh
```

When prompted:
- **Gmail Email:** Enter your Gmail address
- **Gmail App Password:** Enter the 16-character password

### Step 5: Test the Setup

1. **Update admin email in database:**
   ```sql
   UPDATE admin_accounts 
   SET email = 'your-gmail@gmail.com' 
   WHERE username = 'kushal';
   ```

2. **Test login 2FA:**
   - Login as admin → Should receive OTP email
   - Check Gmail inbox for OTP

3. **Test password reset:**
   - "Forgot Password?" → Enter username
   - Should receive OTP email for password reset

---

## 🔄 Deploy Script Update

The `deploy-edge-functions.sh` script will ask for:

```bash
🔑 Setting up Gmail SMTP credentials...

Please enter your Gmail email:
> your-gmail@gmail.com

Please enter your Gmail App Password (16 characters):
> abcdefghijklmnop

📤 Deploying Edge Functions...
✅ Deployment complete!
```

---

## 📧 Email Templates

### Login OTP Email:
```
Subject: Your Login OTP - BMS Cash

BMS Cash Entry
Login Verification

Hello kushal,

Your One-Time Password (OTP) for login is:

    123456

⏱️ This OTP will expire in 10 minutes

If you didn't request this OTP, please ignore this email.

BMS Diesel Systems India Pvt Ltd.
Cash Entry System
```

### Password Reset OTP Email:
```
Subject: Password Reset OTP - BMS Cash

BMS Cash Entry  
Password Reset

Hello kushal,

Your One-Time Password (OTP) for password reset is:

    123456

⏱️ This OTP will expire in 10 minutes

If you didn't request this OTP, please ignore this email.

BMS Diesel Systems India Pvt Ltd.
Cash Entry System
```

---

## 🐛 Troubleshooting

### "Authentication failed" Error:
- ✅ Verify 2FA is enabled on Gmail
- ✅ Use App Password, not regular password
- ✅ Remove spaces from App Password
- ✅ Check Gmail email is correct

### OTP Email Not Received:
- ✅ Check spam/junk folder
- ✅ Verify Gmail credentials in edge function
- ✅ Check Supabase Edge Function logs
- ✅ Verify admin email in database

### "Less secure app access" Error:
- ✅ Use App Password (not regular password)
- ✅ Enable 2FA first, then create App Password
- ✅ Don't use "Less secure apps" setting

---

## 🔐 Security Best Practices

### Gmail Account Security:
- ✅ Use dedicated Gmail for app emails
- ✅ Enable 2-Factor Authentication
- ✅ Use App Passwords (never regular password)
- ✅ Monitor account activity regularly

### Environment Variables:
- ✅ Never commit `.env` to Git
- ✅ Use different credentials for dev/prod
- ✅ Rotate App Passwords periodically
- ✅ Limit access to credentials

---

## ✅ Quick Setup Checklist

- [ ] Gmail account ready (2FA enabled)
- [ ] App Password generated (16 characters)
- [ ] `.env` file updated with credentials
- [ ] Edge functions deployed with new credentials
- [ ] Admin email updated in database
- [ ] Login 2FA tested and working
- [ ] Password reset tested and working
- [ ] OTP emails received successfully

---

## 🎯 Final Result

After setup, you'll have:
- ✅ **Custom OTP generation** (6-digit codes)
- ✅ **Gmail SMTP delivery** (reliable email service)
- ✅ **Professional email templates** (branded for BMS Cash)
- ✅ **Database OTP storage** (secure verification)
- ✅ **10-minute expiry** (security best practice)
- ✅ **Password reset functionality** (updates database)

**Your OTP system will be fully functional with Gmail SMTP!** 🚀