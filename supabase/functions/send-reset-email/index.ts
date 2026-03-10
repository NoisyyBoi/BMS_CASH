import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts"

const GMAIL_EMAIL = Deno.env.get('GMAIL_EMAIL')
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')
const APP_URL = Deno.env.get('APP_URL') || 'http://localhost:5173'

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
    const { email, resetToken, username } = await req.json()
    const resetUrl = `${APP_URL}?reset_token=${resetToken}`

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
      subject: "Password Reset Request - BMS Cash",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1565C0; margin: 0;">BMS Cash Entry</h1>
            <p style="color: #666; margin-top: 10px;">Password Reset Request</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0 0 10px 0; color: #333;">Hello <strong>${username}</strong>,</p>
            <p style="margin: 0; color: #666;">You requested to reset your password for BMS Cash Entry System.</p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
              Reset Your Password
            </a>
          </div>
          
          <div style="background-color: #e8f4fd; border-left: 4px solid #1565C0; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #1565C0; font-size: 14px;">
              🔗 If the button doesn't work, copy and paste this link in your browser:
            </p>
            <p style="margin: 10px 0 0 0; word-break: break-all; font-family: monospace; background: white; padding: 10px; border-radius: 4px; font-size: 12px;">
              ${resetUrl}
            </p>
          </div>
          
          <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
            <p style="margin: 0; color: #856404; font-size: 14px;">
              ⏱️ This reset link will expire in <strong>1 hour</strong>
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
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