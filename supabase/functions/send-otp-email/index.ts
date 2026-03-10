import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

const GMAIL_EMAIL = Deno.env.get('GMAIL_EMAIL')
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, otp, username, isPasswordReset } = await req.json()

    const subject = isPasswordReset 
      ? "Password Reset OTP - BMS Cash"
      : "Your Login OTP - BMS Cash"

    const title = isPasswordReset
      ? "Password Reset"
      : "Login Verification"

    const message = isPasswordReset
      ? "Your One-Time Password (OTP) for password reset is:"
      : "Your One-Time Password (OTP) for login is:"

    const client = new SMTPClient({
      connection: {
        hostname: "smtp.gmail.com",
        port: 465,
        tls: true,
        auth: {
          username: GMAIL_EMAIL,
          password: GMAIL_APP_PASSWORD,
        },
      },
    })

    const htmlContent = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${subject}</title>
</head>
<body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f8f9fa;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f9fa;">
<tr>
<td align="center" style="padding:20px;">
<table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.1);">

<tr>
<td style="background:linear-gradient(135deg,#1565C0 0%,#42A5F5 100%);padding:30px;text-align:center;border-radius:8px 8px 0 0;">
<img src="https://raw.githubusercontent.com/NoisyyBoi/BMS_CASH/main/public/logo.png" alt="BMS Logo" style="height:60px;width:auto;margin-bottom:15px;">
<h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:600;">BMS Cash Entry</h1>
<p style="color:#E3F2FD;margin:8px 0 0 0;font-size:16px;">${title}</p>
</td>
</tr>

<tr>
<td style="padding:40px 30px;">
<h2 style="color:#333333;margin:0 0 15px 0;font-size:20px;">Hello ${username}!</h2>
<p style="color:#666666;margin:0 0 30px 0;font-size:16px;line-height:1.5;">${message}</p>

<table width="100%" cellpadding="0" cellspacing="0" style="background:linear-gradient(135deg,#E3F2FD 0%,#BBDEFB 100%);border-radius:12px;border:2px solid #1565C0;margin:20px 0;">
<tr>
<td style="padding:40px 20px;text-align:center;">
<p style="color:#1565C0;margin:0 0 15px 0;font-size:14px;font-weight:600;text-transform:uppercase;letter-spacing:1px;">Your OTP Code</p>
<div style="font-size:42px;font-weight:bold;letter-spacing:12px;color:#1565C0;font-family:monospace;margin:10px 0;">${otp}</div>
<p style="color:#1565C0;margin:15px 0 0 0;font-size:12px;">Enter this code to continue</p>
</td>
</tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3CD;border:1px solid #FFEAA7;border-radius:8px;margin:20px 0;">
<tr>
<td style="padding:20px;">
<p style="margin:0;color:#856404;font-size:14px;">⏰ <strong>Important:</strong> This OTP will expire in <strong>10 minutes</strong> for security reasons.</p>
</td>
</tr>
</table>

<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8F9FA;border-radius:8px;margin:20px 0;">
<tr>
<td style="padding:20px;">
<p style="margin:0 0 10px 0;color:#495057;font-size:14px;font-weight:600;">🔒 Security Notice</p>
<p style="margin:0;color:#6C757D;font-size:13px;">If you didn't request this OTP, please ignore this email. Never share your OTP with anyone.</p>
</td>
</tr>
</table>

</td>
</tr>

<tr>
<td style="background:#F8F9FA;padding:30px;text-align:center;border-top:1px solid #E9ECEF;border-radius:0 0 8px 8px;">
<p style="margin:0 0 10px 0;color:#6C757D;font-size:14px;font-weight:600;">BMS Diesel Systems India Pvt Ltd</p>
<p style="margin:0;color:#ADB5BD;font-size:12px;">Cash Entry Management System</p>
<p style="margin:20px 0 0 0;color:#ADB5BD;font-size:11px;border-top:1px solid #E9ECEF;padding-top:20px;">This is an automated message. Please do not reply to this email.</p>
</td>
</tr>

</table>
</td>
</tr>
</table>
</body>
</html>`

    await client.send({
      from: GMAIL_EMAIL,
      to: email,
      subject: subject,
      html: htmlContent,
    })

    await client.close()
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})
