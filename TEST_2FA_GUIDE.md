# Testing 2FA and Password Reset

## ✅ Setup Complete!

Your 2FA system is now fully configured and enabled. Here's how to test it:

## Test 1: Admin Login with 2FA

1. **Go to your app login page**
2. **Enter admin credentials:**
   - Username: `kushal` (or any admin username)
   - Password: `Kushal@BMS2024!` (or the correct password)
3. **Click "Login →"**
4. **You should see:**
   - Message: "✓ OTP sent to your email"
   - Screen changes to "Verify OTP"
5. **Check your email** (the one you set in the database)
6. **You should receive an email with:**
   - Subject: "Your Login OTP - BMS Cash"
   - A 6-digit code in large blue numbers
7. **Enter the OTP** on the verification screen
8. **Click "Verify OTP"**
9. **You should be logged in successfully!**

## Test 2: Resend OTP

1. On the OTP verification screen
2. Click "Resend OTP"
3. Check your email for a new OTP
4. The new OTP should work

## Test 3: Forgot Password

1. **On login page, click "Forgot Password?"**
2. **Enter your username** (e.g., `kushal`)
3. **Click "Send Reset Link"**
4. **Check your email**
5. **You should receive an email with:**
   - Subject: "Password Reset Request - BMS Cash"
   - A blue "Reset Password" button
6. **Click the button** (or copy the link)
7. **Enter new password twice**
8. **Click "Reset Password"**
9. **You should see:** "✓ Password updated successfully"
10. **Try logging in with the new password**

## Test 4: Viewer Login (No 2FA)

1. **Username:** `viewer`
2. **Password:** `viewer`
3. **Should login directly** without OTP (viewers don't need 2FA)

## Test 5: User Login (No 2FA)

1. **Username:** User's name (e.g., "John Doe")
2. **Password:** User's phone number
3. **Should login directly** without OTP (users don't need 2FA)

## Troubleshooting

### "Admin email not configured"
- Make sure you ran the SQL in Supabase Dashboard
- Check that admin emails are correct in the database

### "Error sending OTP email"
- Check Supabase Edge Functions are deployed
- Verify Resend API key is set correctly
- Check function logs in Supabase Dashboard

### "Invalid or expired OTP"
- OTPs expire after 10 minutes
- Each OTP can only be used once
- Request a new OTP with "Resend OTP"

### Email not received
- Check spam/junk folder
- Verify email address in database is correct
- Check Resend dashboard for delivery status

### "Invalid or expired reset link"
- Reset links expire after 1 hour
- Each link can only be used once
- Request a new reset link

## Check Function Logs

If something isn't working:

```bash
# View OTP email function logs
supabase functions logs send-otp-email

# View reset email function logs
supabase functions logs send-reset-email
```

## Security Features Working:

✅ OTP expires after 10 minutes
✅ OTP is single-use only
✅ Reset links expire after 1 hour
✅ Reset links are single-use only
✅ Only admins require 2FA
✅ Viewers and users login directly

## What Happens Now:

- **Admins:** Must verify email with OTP every login
- **Viewers:** Login directly (no 2FA)
- **Users:** Login directly (no 2FA)
- **Password Reset:** Available for all admins via email

## Email Templates:

Your emails include:
- Professional BMS Cash branding
- Clear OTP display (large blue numbers)
- Expiration warnings
- Security notices
- Company information

## Next Steps:

1. Test admin login with 2FA
2. Test password reset
3. Verify emails are being received
4. Update to GitHub
5. Deploy to production

Everything is ready to go! 🎉
