import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY')
const MAILJET_SECRET_KEY = Deno.env.get('MAILJET_SECRET_KEY')
const APP_URL = Deno.env.get('APP_URL')

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

    const auth = btoa(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`)

    const res = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify({
        Messages: [{
          From: {
            Email: "noisyboi460@gmail.com",
            Name: "BMS Cash"
          },
          To: [{
            Email: email
          }],
          Subject: "Password Reset Request - BMS Cash",
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1565C0; margin: 0;">BMS Cash Entry</h1>
                <p style="color: #666; margin-top: 10px;">Password Reset Request</p>
              </div>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #333;">Hello <strong>${username}</strong>,</p>
                <p style="margin: 0; color: #666;">You requested to reset your password. Click the button below to proceed:</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="background: linear-gradient(135deg, #42A5F5 0%, #1E88E5 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">
                  Reset Password
                </a>
              </div>
              
              <div style="background-color: #f5f5f5; padding: 15px; border-radius: 4px; margin: 20px 0;">
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
                <p style="margin: 0; background-color: white; padding: 10px; border-radius: 4px; word-break: break-all; font-size: 12px; color: #1565C0;">
                  ${resetUrl}
                </p>
              </div>
              
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  ⏱️ This link will expire in <strong>30 minutes</strong>
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
          `
        }]
      })
    })

    const data = await res.json()
    
    return new Response(JSON.stringify(data), {
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
