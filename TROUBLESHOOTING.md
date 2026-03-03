# 🔧 Troubleshooting Guide - Data Not Fetching

## Quick Fix Checklist

### ✅ Step 1: Verify Database Tables Exist

1. Open `test-supabase.html` in your browser
2. Click **"Test Connection"**
3. If you see an error about tables not existing:
   - Go to: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh/sql
   - Click "New query"
   - Copy ALL content from `supabase-schema.sql`
   - Paste and click "Run"
   - You should see "Success. No rows returned"

### ✅ Step 2: Verify Data Exists

1. In `test-supabase.html`, click **"Test Users Table"**
2. If you see 0 users:
   - Click **"Create Test Data"** to add sample data
   - OR create a user in your app

3. Click **"Test Transactions Table"**
4. If you see 0 transactions:
   - Create a transaction in your app (Give Money)

### ✅ Step 3: Check Browser Console

1. Open your app in browser
2. Press F12 to open Developer Tools
3. Go to "Console" tab
4. Look for any red error messages
5. Common errors:
   - **"relation does not exist"** → Tables not created (see Step 1)
   - **"Invalid API key"** → Check .env file
   - **"Network error"** → Check internet connection

### ✅ Step 4: Restart Dev Server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

Then open: http://localhost:5174

### ✅ Step 5: Clear Browser Cache

Sometimes old code is cached:
1. Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) to hard refresh
2. Or clear browser cache in settings

## What I Fixed

✅ **User Total Screen:**
- Now reloads users when opening the view
- Shows "Loading users..." while fetching
- Uses correct state (`allUsers`) instead of async call

✅ **History Screen:**
- Now reloads transactions when opening the view
- Automatically refreshes after saving new transaction
- Uses correct state (`allTransactions`)

✅ **User History Screen:**
- Loads user transactions when selecting a user
- Calculates monthly total correctly
- Shows empty state if no transactions

## Testing Each Feature

### Test User Total:
1. Create at least one user (Create a User button)
2. Click "User Total"
3. You should see the user in the dropdown
4. Click on the user
5. You should see their transaction history

### Test History:
1. Create at least one transaction (Give Money)
2. Click "History"
3. You should see transactions grouped by date
4. Click on a date to expand/collapse

### Test Give Money:
1. Click "Give Money"
2. Select a user (or create one)
3. Enter amount and purpose
4. Click "Save Transaction"
5. Check History to verify it was saved

## Still Not Working?

### Check Supabase Dashboard:

1. Go to: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh
2. Click "Table Editor"
3. Click "users" table - you should see your users
4. Click "transactions" table - you should see your transactions

### Check Network Tab:

1. Open browser (F12)
2. Go to "Network" tab
3. Try creating a user or transaction
4. Look for requests to `supabase.co`
5. Click on them to see if they succeeded (status 200/201) or failed

### Common Issues:

**Issue: "No users found"**
- Solution: Create a user first using "Create a User" button
- Or run test-supabase.html and click "Create Test Data"

**Issue: "No transactions yet"**
- Solution: Create a transaction using "Give Money" button
- Make sure you selected a user and entered amount

**Issue: Data shows in Supabase but not in app**
- Solution: Hard refresh browser (Ctrl+Shift+R)
- Or restart dev server

**Issue: "Loading users..." never goes away**
- Solution: Check browser console for errors
- Verify tables exist in Supabase
- Check internet connection

## Debug Mode

Add this to see what's happening:

1. Open browser console (F12)
2. Type: `localStorage.clear()` and press Enter (clears old data)
3. Refresh page
4. Watch console for any errors

## Contact Support

If still not working:
1. Take a screenshot of browser console errors
2. Take a screenshot of Supabase Table Editor
3. Share what step you're stuck on

## Quick Test Script

Run this in browser console to test:

```javascript
// Test if Supabase is loaded
console.log('Testing Supabase...');

// Check if data is in state
console.log('Users:', window.allUsers);
console.log('Transactions:', window.allTransactions);
```
