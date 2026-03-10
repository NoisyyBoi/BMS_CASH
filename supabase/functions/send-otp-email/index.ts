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

    await client.send({
      from: GMAIL_EMAIL,
      to: email,
      subject: subject,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
        
        <!-- Header with Logo -->
        <div style="background: linear-gradient(135deg, #1565C0 0%, #42A5F5 100%); padding: 30px 20px; text-align: center;">
            <img src="https://raw.githubusercontent.com/NoisyyBoi/BMS_CASH/main/public/logo.png" alt="BMS Logo" style="height: 60px; width: auto; margin-bottom: 15px;" />
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">BMS Cash Entry</h1>
            <p style="color: #E3F2FD; margin: 8px 0 0 0; font-size: 16px;">${title}</p>
        </div>
        
        <!-- Content -->
        <div style="padding: 40px 30px;">
            
            <!-- Greeting -->
            <div style="margin-bottom: 30px;">
                <h2 style="color: #333333; margin: 0 0 15px 0; font-size: 20px;">Hello ${username}!</h2>
                <p style="color: #666666; margin: 0; font-size: 16px; line-height: 1.5;">${message}</p>
            </div>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-radius: 12px; padding: 40px 20px; text-align: center; margin: 30px 0; border: 2px solid #1565C0;">
                <p style="color: #1565C0; margin: 0 0 15px 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Your OTP Code</p>
                <div style="font-size: 42px; font-weight: bold; letter-spacing: 12px; color: #1565C0; font-family: 'Courier New', monospace; margin: 10px 0;">
                    ${otp}
                </div>
                <p style="color: #1565C0; margin: 15px 0 0 0; font-size: 12px;">Enter this code to continue</p>
            </div>
            
            <!-- Warning -->
            <div style="background-color: #FFF3CD; border: 1px solid #FFEAA7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <div style="display: flex; align-items: center;">
                    <span style="font-size: 20px; margin-right: 10px;">⏰</span>
                    <div>
                        <p style="margin: 0; color: #856404; font-size: 14px; font-weight: 600;">Important:</p>
                        <p style="margin: 5px 0 0 0; color: #856404; font-size: 14px;">This OTP will expire in <strong>10 minutes</strong> for security reasons.</p>
                    </div>
                </div>
            </div>
            
            <!-- Security Notice -->
            <div style="background-color: #F8F9FA; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <p style="margin: 0 0 10px 0; color: #495057; font-size: 14px; font-weight: 600;">🔒 Security Notice</p>
                <p style="margin: 0; color: #6C757D; font-size: 13px; line-height: 1.4;">
                    If you didn't request this OTP, please ignore this email. Never share your OTP with anyone.
                </p>
            </div>
            
        </div>
        
        <!-- Footer -->
        <div style="background-color: #F8F9FA; padding: 30px; text-align: center; border-top: 1px solid #E9ECEF;">
            <p style="margin: 0 0 10px 0; color: #6C757D; font-size: 14px; font-weight: 600;">BMS Diesel Systems India Pvt Ltd</p>
            <p style="margin: 0; color: #ADB5BD; font-size: 12px;">Cash Entry Management System</p>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #E9ECEF;">
                <p style="margin: 0; color: #ADB5BD; font-size: 11px;">
                    This is an automated message. Please do not reply to this email.
                </p>
            </div>
        </div>
        
    </div>
</body>
</html>`,
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
