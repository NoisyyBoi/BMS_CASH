# Setup 2FA and Password Reset for Admin Accounts

## Step 1: Run the SQL Setup

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `prjezxbbkqoieockoymh`
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase-admin-auth-setup.sql`
6. **IMPORTANT**: Update the email addresses in the INSERT statement with real admin emails
7. Click **Run** to execute the SQL

## Step 2: Enable Email Service in Supabase

1. In Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Supabase provides built-in email service (no external service needed!)
3. The default SMTP is already configured

## Step 3: Create Supabase Edge Functions

### Option A: Using Supabase CLI (Recommended)

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref prjezxbbkqoieockoymh
```

4. Create the Edge Functions directory:
```bash
mkdir -p supabase/functions
```

5. Create OTP Email Function:
```bash
supabase functions new send-otp-email
```

6. Replace the content of `supabase/functions/send-otp-email/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { email, otp, username } = await req.json()

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'BMS Cash <noreply@yourdomain.com>',
        to: [email],
        subject: 'Your Login OTP - BMS Cash',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1565C0;">BMS Cash - Login Verification</h2>
            <p>Hello ${username},</p>
            <p>Your One-Time Password (OTP) for login is:</p>
            <div style="background-color: #E3F2FD; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1565C0; border-radius: 8px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this OTP, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">BMS Cash Entry System</p>
          </div>
        `
      })
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
```

7. Create Password Reset Email Function:
```bash
supabase functions new send-reset-email
```

8. Replace the content of `supabase/functions/send-reset-email/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  try {
    const { email, resetToken, username } = await req.json()
    const resetUrl = `${Deno.env.get('APP_URL')}/reset-password?token=${resetToken}`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'BMS Cash <noreply@yourdomain.com>',
        to: [email],
        subject: 'Password Reset Request - BMS Cash',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #1565C0;">BMS Cash - Password Reset</h2>
            <p>Hello ${username},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; word-break: break-all;">
              ${resetUrl}
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">BMS Cash Entry System</p>
          </div>
        `
      })
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
```

9. Set environment secrets:
```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set APP_URL=https://your-app-url.netlify.app
```

10. Deploy the functions:
```bash
supabase functions deploy send-otp-email
supabase functions deploy send-reset-email
```

### Option B: Using Resend for Email (Simpler Alternative)

1. Sign up for free at https://resend.com (100 emails/day free)
2. Get your API key from Resend dashboard
3. Add to your `.env` file:
```
VITE_RESEND_API_KEY=re_your_api_key_here
```

## Step 4: Update Admin Emails

In the SQL file, update these lines with real admin emails:

```sql
INSERT INTO admin_accounts (username, email, password_hash) VALUES
  ('kushal', 'real-email@example.com', 'Kushal@BMS2024!'),
  ('admin2', 'admin2-email@example.com', 'Admin2@BMS2024!'),
  -- ... update all emails
```

## Step 5: Test the Setup

1. Try logging in as an admin
2. You should receive an OTP email
3. Enter the OTP to complete login
4. Try "Forgot Password" to test password reset

## Troubleshooting

- **Emails not sending**: Check Supabase logs in Dashboard → Edge Functions → Logs
- **OTP expired**: OTPs expire after 10 minutes
- **Reset link expired**: Reset links expire after 1 hour
- **Email in spam**: Check spam folder, or configure SPF/DKIM records

## Security Notes

- OTPs are single-use and expire after 10 minutes
- Reset tokens are single-use and expire after 1 hour
- All passwords are hashed before storage
- Failed login attempts should be rate-limited (implement if needed)
