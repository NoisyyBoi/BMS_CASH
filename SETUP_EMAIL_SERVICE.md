# Email Service Setup - Step by Step

## ✅ Option A: Resend (Recommended - Simplest)

### Step 1: Sign Up for Resend (2 minutes)

1. Go to: https://resend.com
2. Click "Sign Up" (top right)
3. Sign up with your email or GitHub
4. Verify your email

### Step 2: Get Your API Key (1 minute)

1. After login, you'll see the dashboard
2. Click "API Keys" in the left sidebar
3. Click "Create API Key"
4. Give it a name: "BMS Cash App"
5. Click "Create"
6. **COPY THE API KEY** (starts with `re_...`)
   - ⚠️ You can only see it once! Save it now.

### Step 3: Add Domain (Optional but Recommended)

1. Click "Domains" in left sidebar
2. Click "Add Domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Follow DNS setup instructions
5. OR skip this and use Resend's default domain for testing

### Step 4: Update Your .env File

Open `.env` and update these lines:

```env
VITE_RESEND_API_KEY=re_your_actual_api_key_here
VITE_APP_URL=https://your-app-url.netlify.app
```

Replace:
- `re_your_actual_api_key_here` with the API key you copied
- `https://your-app-url.netlify.app` with your actual app URL

### Step 5: Update Email Functions

The email functions need to be updated to use Resend directly from the frontend.

**Update `src/utils/adminAuth.js`:**

Replace the `sendOTPEmail` function with:

```javascript
export const sendOTPEmail = async (email, otp, username) => {
  try {
    const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
    
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'BMS Cash <onboarding@resend.dev>',
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
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Resend API error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendOTPEmail:', error);
    return { success: false, error: error.message };
  }
};
```

Replace the `sendPasswordResetEmail` function with:

```javascript
export const sendPasswordResetEmail = async (email, token, username) => {
  try {
    const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
    const APP_URL = import.meta.env.VITE_APP_URL || window.location.origin;
    const resetUrl = `${APP_URL}?reset_token=${token}`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'BMS Cash <onboarding@resend.dev>',
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
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Resend API error:', data);
      return { success: false, error: data.message || 'Failed to send email' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendPasswordResetEmail:', error);
    return { success: false, error: error.message };
  }
};
```

### Step 6: Handle Password Reset Token in App

Add this to your `App.jsx` useEffect (after the existing useEffect):

```javascript
// Check for password reset token in URL
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('reset_token');
  
  if (token) {
    setResetToken(token);
    setView(VIEWS.RESET_PASSWORD);
    // Clean URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}, []);
```

### Step 7: Test It!

1. **Restart your dev server:**
   ```bash
   npm run dev
   ```

2. **Test OTP Email:**
   - Try logging in as admin
   - Check your email for OTP
   - Enter OTP to complete login

3. **Test Password Reset:**
   - Click "Forgot Password?"
   - Enter username
   - Check email for reset link
   - Click link and set new password

### ✅ Done! That's it for Resend setup.

---

## Option B: Supabase Edge Functions (Advanced)

Only use this if you want more control or need to send more than 100 emails/day.

### Step 1: Install Supabase CLI

```bash
npm install -g supabase
```

### Step 2: Login and Link Project

```bash
supabase login
supabase link --project-ref prjezxbbkqoieockoymh
```

### Step 3: Deploy Edge Functions

```bash
chmod +x deploy-edge-functions.sh
./deploy-edge-functions.sh
```

### Step 4: Set Secrets

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set APP_URL=https://your-app-url.netlify.app
```

### Step 5: Keep Original Functions

The original `sendOTPEmail` and `sendPasswordResetEmail` functions in `adminAuth.js` will work with Edge Functions (they call `supabase.functions.invoke`).

---

## 🎯 Which Option Should I Choose?

| Feature | Option A (Resend Direct) | Option B (Edge Functions) |
|---------|-------------------------|---------------------------|
| Setup Time | 5 minutes | 15-20 minutes |
| Difficulty | Easy | Medium |
| Free Tier | 100 emails/day | Unlimited |
| Security | API key in frontend | API key in backend |
| Best For | Small apps, testing | Production apps |

**Recommendation:** Start with Option A (Resend Direct). It's simpler and perfect for your use case.

---

## 🐛 Troubleshooting

### Email Not Received
- Check spam/junk folder
- Verify API key is correct in `.env`
- Check Resend dashboard for delivery status
- Make sure email address is valid

### "Invalid API Key" Error
- Make sure you copied the full API key (starts with `re_`)
- Check for extra spaces in `.env` file
- Restart your dev server after updating `.env`

### Reset Link Not Working
- Check if APP_URL is correct in `.env`
- Verify token handling code is added to App.jsx
- Check browser console for errors

---

## 📧 Email Limits

**Resend Free Tier:**
- 100 emails per day
- 3,000 emails per month
- Perfect for small teams

**Need More?**
- Upgrade to Resend Pro: $20/month for 50,000 emails
- Or use Supabase Edge Functions (unlimited)

---

## ✅ Quick Checklist

- [ ] Signed up for Resend
- [ ] Got API key
- [ ] Updated `.env` file
- [ ] Updated `adminAuth.js` functions
- [ ] Added reset token handler to App.jsx
- [ ] Restarted dev server
- [ ] Tested OTP email
- [ ] Tested password reset email
- [ ] Updated admin emails in database

---

## 🎉 You're Done!

Your email service is now configured. Users can:
- Receive OTP codes for 2FA login
- Get password reset links via email
- Reset their passwords securely

Need help? Check the troubleshooting section above.
