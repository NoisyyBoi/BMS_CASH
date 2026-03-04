# Quick Setup Guide - Fix "Error Saving User"

## Problem
Getting "Error saving user" message when trying to create a user.

## Cause
The Supabase database tables haven't been created yet.

## Solution (5 minutes)

### Step 1: Open Test File
1. Open `test-supabase-connection.html` in your browser
2. Click "1. Test Connection"
3. If it says tables don't exist, continue to Step 2

### Step 2: Create Database Tables

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh/sql
2. Click "New query"
3. Copy ALL the SQL below and paste it:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  referral TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id BIGINT PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "userName" TEXT NOT NULL,
  "userPhone" TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  purpose TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations)
CREATE POLICY "Enable all for users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Enable all for transactions" ON transactions FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions("userId");
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions("createdAt" DESC);
```

4. Click "Run" button
5. You should see "Success. No rows returned"

**Option B: Copy from File**

1. Open `supabase-schema.sql` file
2. Copy ALL the content
3. Go to: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh/sql
4. Click "New query"
5. Paste and click "Run"

### Step 3: Verify Setup

1. Go back to `test-supabase-connection.html`
2. Click "2. Check Tables"
3. Should show ✅ for both tables
4. Click "4. Test User Creation"
5. Should show success message

### Step 4: Test the App

1. Open your app: `npm run dev`
2. Login as admin (username: `admin`, password: `admin123`)
3. Click "Create a User"
4. Fill in the form and save
5. Should work now! ✅

## Still Having Issues?

### Check Browser Console
1. Press F12 to open developer tools
2. Go to "Console" tab
3. Look for error messages
4. Share the error message for help

### Verify Supabase Connection
1. Check `.env` file has correct credentials
2. Verify Supabase project is active
3. Check internet connection

### Common Errors

**"relation does not exist"**
- Tables not created yet
- Run the SQL schema (Step 2)

**"permission denied"**
- RLS policies not set up
- Run the SQL schema (Step 2)

**"Failed to fetch"**
- Internet connection issue
- Supabase project might be paused
- Check Supabase dashboard

## Need Help?

1. Check `SUPABASE_SETUP.md` for detailed guide
2. Check `TROUBLESHOOTING.md` for common issues
3. Open browser console (F12) for error details
4. Check Supabase dashboard for project status

## Quick Links

- Supabase Dashboard: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh
- SQL Editor: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh/sql
- Table Editor: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh/editor
