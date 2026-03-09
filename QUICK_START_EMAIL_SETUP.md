# Quick Start: Email Setup for 2FA

## What You Need

1. ✅ Supabase account (you already have this)
2. ✅ Resend account (free - sign up at https://resend.com)
3. ✅ 10 minutes of your time

## Option 1: Automated Setup (Easiest)

### Step 1: Install Supabase CLI

**On macOS (you're using this):**
```bash
brew install supabase/tap/supabase
```

### Step 2: Get Resend API Key

1. Go to https://resend.com
2. Sign up (it's free)
3. Go to "API Keys" → "Create API Key"
4. Copy the key (starts with `re_`)

### Step 3: Run the Setup Script

```bash
./deploy-edge-functions.sh
```

The script will:
- Login to Supabase
- Link your project
- Ask for your Resend API key
- Ask for your app URL
- Deploy both email functions
- Show you the results

That's it! ✅

## Option 2: Manual Setup

Follow the detailed guide in `SUPABASE_EDGE_FUNCTIONS_SETUP.md`

## After Setup

1. **Update Admin Emails:**
   - Open `supabase-admin-auth-setup.sql`
   - Replace example emails with real ones
   - Run it in Supabase Dashboard → SQL Editor

2. **Enable 2FA in Code:**
   - Let me know when setup is complete
   - I'll re-enable the 2FA code

3. **Test It:**
   - Try logging in as admin
   - You should receive OTP email
   - Enter OTP to complete login

## Troubleshooting

**"Command not found: supabase"**
- Install Supabase CLI first (see Step 1)

**"Email not sending"**
- Check Resend API key is correct
- Verify you're using the right email in admin_accounts table

**"Function not found"**
- Make sure deployment completed successfully
- Check: `supabase functions list`

## Need Help?

Run these commands to check status:
```bash
# Check if CLI is installed
supabase --version

# Check if logged in
supabase projects list

# Check deployed functions
supabase functions list

# View function logs
supabase functions logs send-otp-email
```

## What Gets Deployed

1. **send-otp-email**: Sends 6-digit OTP for login
2. **send-reset-email**: Sends password reset link

Both functions use Resend to send professional HTML emails.

## Cost

- Supabase Edge Functions: FREE
- Resend Free Tier: 100 emails/day (more than enough)
- Total Cost: $0 💰

## Files Created

- ✅ `supabase/functions/send-otp-email/index.ts`
- ✅ `supabase/functions/send-reset-email/index.ts`
- ✅ `deploy-edge-functions.sh` (automated setup)
- ✅ `SUPABASE_EDGE_FUNCTIONS_SETUP.md` (detailed guide)
- ✅ This quick start guide

Ready to start? Run:
```bash
brew install supabase/tap/supabase
./deploy-edge-functions.sh
```
