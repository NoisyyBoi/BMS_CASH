# Gmail SMTP Setup for OTP (100% Free)

## Step 1: Set Supabase Secrets

```bash
supabase secrets set GMAIL_EMAIL=your-email@gmail.com
supabase secrets set GMAIL_APP_PASSWORD=your-16-char-app-password
```

Replace:
- `your-email@gmail.com` with your Gmail address
- `your-16-char-app-password` with the app password you generated

## Step 2: Deploy the Function

```bash
supabase functions deploy send-otp-email
```

## Step 3: Test It

Try logging in as admin - you should receive OTP via Gmail!

## Troubleshooting

**"Invalid credentials" error:**
- Make sure you're using the App Password, not your regular Gmail password
- App Password should be 16 characters (remove spaces if you copied them)

**Email not received:**
- Check spam folder
- Verify Gmail email is correct in secrets
- Check function logs: Go to Supabase Dashboard → Edge Functions → send-otp-email → Logs

**"Less secure app" error:**
- You must use App Password (not regular password)
- Make sure 2-Step Verification is enabled on your Google Account

## Benefits of Gmail SMTP

✅ Completely FREE
✅ No verification needed
✅ Can send to any email
✅ 500 emails/day limit (more than enough)
✅ Works immediately
✅ Very reliable

## Your Gmail Credentials

- Email: (your Gmail)
- App Password: (16-character password from Google)

That's it! Simple and free! 🎉
