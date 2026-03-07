# Quick Setup: Deleted Transactions Feature

## ⚠️ IMPORTANT: You must complete this setup before using the delete feature!

The error "Error deleting transaction" means the database table hasn't been created yet.

## Step-by-Step Setup (5 minutes)

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Login to your account
3. Select your project: **prjezxbbkqoieockoymh**

### Step 2: Open SQL Editor
1. Click on **"SQL Editor"** in the left sidebar (icon looks like </> )
2. Click **"New Query"** button (top right)

### Step 3: Run the SQL Script
1. Copy ALL the text from the `supabase-schema.sql` file
2. Paste it into the SQL Editor
3. Click the **"Run"** button (or press Ctrl+Enter / Cmd+Enter)
4. Wait for "Success. No rows returned" message

### Step 4: Verify Table Creation
1. Click on **"Table Editor"** in the left sidebar
2. You should now see a new table called **"deleted_transactions"**
3. Click on it to verify it has these columns:
   - id
   - userId
   - userName
   - userPhone
   - amount
   - purpose
   - deletedReason
   - deletedBy
   - originalCreatedAt
   - deletedAt

### Step 5: Test the Feature
1. Go back to your app
2. Refresh the page (F5)
3. Try deleting a transaction
4. You should now see the "Delete Transaction" modal asking for a reason
5. Enter a reason and click "Delete Transaction"
6. Check "Deleted Transactions" button on home screen to see the deleted transaction

## Troubleshooting

### Error: "relation 'deleted_transactions' does not exist"
- **Solution**: You haven't run the SQL script yet. Go back to Step 2.

### Error: "permission denied"
- **Solution**: Make sure you're logged in as the project owner in Supabase dashboard.

### Error: "duplicate key value"
- **Solution**: The table already exists. Try refreshing your app.

### Still having issues?
1. Open browser console (F12)
2. Look for red error messages
3. Copy the full error message
4. Check if the table exists in Supabase Table Editor

## What This Feature Does

✅ Asks for a reason before deleting any transaction
✅ Stores deleted transactions for 30 days
✅ Shows who deleted it and when
✅ Automatically removes after 30 days

## SQL Script Location

The SQL script is in the file: `supabase-schema.sql`

It contains:
- CREATE TABLE for deleted_transactions
- Row Level Security policies
- Indexes for performance
- All other existing tables (users, transactions, salary_payments)

## Need Help?

If you see any errors:
1. Check browser console (F12 → Console tab)
2. Look for error messages in red
3. The error message will tell you what's wrong
