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
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1565C0; margin: 0;">BMS Cash Entry</h1>
            <p style="color: #666; margin-top: 10px;">${title}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0; color: #333;">Hello <strong>${username}</strong>,</p>
            <p style="margin: 0; color: #666;">${message}</p>
          </div>
          
          <div style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); padding: 30px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1565C0; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⏱️ This OTP will expire in <strong>10 minutes</strong>
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              If you didn't request this OTP, please ignore this email.
            </p>
            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              BMS Diesel Systems India Pvt Ltd.<br>
              Cash Entry System
            </p>
          </div>
        </div>
      `,
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
