#!/bin/bash

echo "🚀 BMS Cash - Supabase Edge Functions Deployment"
echo "================================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed."
    echo ""
    echo "Install it with:"
    echo "  macOS: brew install supabase/tap/supabase"
    echo "  Windows: scoop install supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI is installed"
echo ""

# Check if logged in
echo "📝 Checking Supabase login status..."
if ! supabase projects list &> /dev/null
then
    echo "❌ Not logged in to Supabase"
    echo "Running: supabase login"
    supabase login
fi

echo "✅ Logged in to Supabase"
echo ""

# Link project
echo "🔗 Linking to project..."
supabase link --project-ref prjezxbbkqoieockoymh

echo ""
echo "🔑 Setting up Gmail SMTP credentials..."
echo ""
echo "Please enter your Gmail email:"
read -r GMAIL_EMAIL
supabase secrets set GMAIL_EMAIL="$GMAIL_EMAIL"

echo ""
echo "Please enter your Gmail App Password (16 characters, no spaces):"
echo "Get this from: https://myaccount.google.com/apppasswords"
read -r GMAIL_PASSWORD
supabase secrets set GMAIL_APP_PASSWORD="$GMAIL_PASSWORD"

echo ""
echo "📤 Deploying Edge Functions..."
echo ""

echo "Deploying send-otp-email..."
supabase functions deploy send-otp-email

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📋 Deployed functions:"
supabase functions list

echo ""
echo "🎉 All done! Your Gmail SMTP OTP system is now live."
echo ""
echo "Next steps:"
echo "1. Update admin emails in Supabase (run supabase-admin-auth-setup.sql)"
echo "2. Test the login with 2FA"
echo "3. Test password reset"
echo ""
echo "📧 Gmail Setup:"
echo "   Email: $GMAIL_EMAIL"
echo "   App Password: [HIDDEN]"
echo ""
