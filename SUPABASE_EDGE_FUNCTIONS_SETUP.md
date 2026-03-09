# Supabase Edge Functions Setup Guide

## Prerequisites

1. Supabase account with your project
2. Resend account (free tier: 100 emails/day)
3. Terminal/Command Line access

## Step 1: Install Supabase CLI

### On macOS:
```bash
brew install supabase/tap/supabase
```

### On Windows:
```bash
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### On Linux:
```bash
brew install supabase/tap/supabase
```

Or download from: https://github.com/supabase/cli/releases

## Step 2: Login to Supabase

```bash
supabase login
```

This will open a browser window. Login with your Supabase credentials.

## Step 3: Link Your Project

```bash
supabase link --project-ref prjezxbbkqoieockoymh
```

When prompted, enter your database password (from Supabase dashboard).

## Step 4: Get Resend API Key

1. Go to https://resend.com
2. Sign up for free account
3. Verify your email
4. Go to "API Keys" in dashboard
5. Click "Create API Key"
6. Name it "BMS Cash App"
7. Copy the API key (starts with `re_`)

## Step 5: Set Environment Secrets

Set the Resend API key:
```bash
supabase secrets set RESEND_API_KEY=re_your_actual_api_key_here
```

Set your app URL (replace with your actual Netlify URL):
```bash
supabase secrets set APP_URL=https://your-app-name.netlify.app
```

## Step 6: Deploy the Edge Functions

Deploy the OTP email function:
```bash
supabase functions deploy send-otp-email
```

Deploy the password reset email function:
```bash
supabase functions deploy send-reset-email
```

## Step 7: Verify Deployment

Check if functions are deployed:
```bash
supabase functions list
```

You should see:
- send-otp-email
- send-reset-email

## Step 8: Test the Functions

You can test the functions from Supabase Dashboard:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to "Edge Functions" in left sidebar
4. Click on "send-otp-email"
5. Click "Invoke Function"
6. Use this test payload:
```json
{
  "email": "your-test-email@gmail.com",
  "otp": "123456",
  "username": "kushal"
}
```

## Step 9: Update Admin Emails in Database

1. Go to Supabase Dashboard → SQL Editor
2. Run the SQL from `supabase-admin-auth-setup.sql`
3. Make sure to update the email addresses with real ones

## Step 10: Enable 2FA in Your App

Now that email functions are working, you can enable 2FA. I'll update the code for you.

## Troubleshooting

### Function not found error:
- Make sure you're linked to the correct project
- Run `supabase functions list` to verify deployment

### Email not sending:
- Check Resend API key is correct
- Verify secrets are set: `supabase secrets list`
- Check function logs: Go to Dashboard → Edge Functions → Logs

### CORS errors:
- The functions already include CORS headers
- Make sure you're calling from the correct domain

### Resend domain verification:
- Free tier uses `onboarding@resend.dev` (no verification needed)
- For custom domain, verify it in Resend dashboard

## Verify Everything Works

1. Try logging in as admin
2. You should receive OTP email
3. Enter OTP to complete login
4. Try "Forgot Password"
5. You should receive reset link email

## Important Notes

- Free Resend tier: 100 emails/day
- OTPs expire in 10 minutes
- Reset links expire in 1 hour
- Functions run on Supabase's infrastructure (no extra cost)

## Need Help?

- Supabase CLI docs: https://supabase.com/docs/guides/cli
- Edge Functions docs: https://supabase.com/docs/guides/functions
- Resend docs: https://resend.com/docs

## Commands Reference

```bash
# Login
supabase login

# Link project
supabase link --project-ref prjezxbbkqoieockoymh

# Set secrets
supabase secrets set RESEND_API_KEY=your_key
supabase secrets set APP_URL=your_url

# Deploy functions
supabase functions deploy send-otp-email
supabase functions deploy send-reset-email

# List functions
supabase functions list

# View logs
supabase functions logs send-otp-email

# Delete function (if needed)
supabase functions delete send-otp-email
```
