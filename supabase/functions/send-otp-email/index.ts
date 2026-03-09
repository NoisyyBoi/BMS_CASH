import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const MAILJET_API_KEY = Deno.env.get('MAILJET_API_KEY')
const MAILJET_SECRET_KEY = Deno.env.get('MAILJET_SECRET_KEY')

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
    const { email, otp, username } = await req.json()

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
          Subject: "Your Login OTP - BMS Cash",
          HTMLPart: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1565C0; margin: 0;">BMS Cash Entry</h1>
                <p style="color: #666; margin-top: 10px;">Login Verification</p>
              </div>
              
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 10px 0; color: #333;">Hello <strong>${username}</strong>,</p>
                <p style="margin: 0; color: #666;">Your One-Time Password (OTP) for login is:</p>
              </div>
              
              <div style="background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); padding: 30px; text-align: center; border-radius: 8px; margin: 20px 0;">
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1565C0; font-family: 'Courier New', monospace;">
                  ${otp}
                </div>
              </div>
              
              <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
                <p style="margin: 0; color: #856404; font-size: 14px;">
                  ⏱️ This OTP will expire in <strong>30 minutes</strong>
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
