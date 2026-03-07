# Fix: "Error deleting transaction"

## The Problem

When you try to delete a transaction, you see:
```
⚠️ Error deleting transaction
```

And in the browser console (F12), you might see:
```
relation "deleted_transactions" does not exist
```

## Why This Happens

The new `deleted_transactions` table hasn't been created in your Supabase database yet.

## The Solution (2 minutes)

### Quick Fix:

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Login and select your project

2. **Open SQL Editor**
   - Click "SQL Editor" in left sidebar
   - Click "New Query"

3. **Copy & Paste This SQL**
   ```sql
   -- Create deleted_transactions table
   CREATE TABLE IF NOT EXISTS deleted_transactions (
     id BIGINT PRIMARY KEY,
     "userId" BIGINT NOT NULL,
     "userName" TEXT NOT NULL,
     "userPhone" TEXT NOT NULL,
     amount NUMERIC NOT NULL,
     purpose TEXT NOT NULL,
     "deletedReason" TEXT NOT NULL,
     "deletedBy" TEXT NOT NULL,
     "originalCreatedAt" TIMESTAMPTZ NOT NULL,
     "deletedAt" TIMESTAMPTZ DEFAULT NOW()
   );

   -- Enable Row Level Security
   ALTER TABLE deleted_transactions ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Enable read access for all users" ON deleted_transactions
     FOR SELECT USING (true);

   CREATE POLICY "Enable insert access for all users" ON deleted_transactions
     FOR INSERT WITH CHECK (true);

   CREATE POLICY "Enable update access for all users" ON deleted_transactions
     FOR UPDATE USING (true);

   CREATE POLICY "Enable delete access for all users" ON deleted_transactions
     FOR DELETE USING (true);

   -- Create indexes
   CREATE INDEX IF NOT EXISTS idx_deleted_transactions_deleted_at ON deleted_transactions("deletedAt" DESC);
   CREATE INDEX IF NOT EXISTS idx_deleted_transactions_user_id ON deleted_transactions("userId");
   ```

4. **Click "Run"** (or press Ctrl+Enter)

5. **Refresh Your App** (F5)

6. **Try Deleting Again** - It should work now!

## Verify It Worked

1. In Supabase, click "Table Editor"
2. You should see "deleted_transactions" in the list
3. Click on it to see the table structure

## Alternative: Run Full Schema

If you want to run the complete schema (recommended):

1. Open the file `supabase-schema.sql` in your project
2. Copy ALL the content
3. Paste into Supabase SQL Editor
4. Click "Run"

This will create/update all tables including the new deleted_transactions table.

## Test the Feature

After setup:
1. Go to User History
2. Click delete (🗑️) on any transaction
3. You'll see a modal asking for a reason
4. Enter a reason (e.g., "Duplicate entry")
5. Click "Delete Transaction"
6. Check "Deleted Transactions" button on home screen
7. You should see your deleted transaction there!

## Still Not Working?

Open browser console (F12) and look for error messages. Common issues:

- **"permission denied"** → You need to be the project owner
- **"duplicate key"** → Table already exists, just refresh app
- **"syntax error"** → Copy the SQL exactly as shown above

## What Happens After Deletion?

✅ Transaction is moved to "Deleted Transactions"
✅ Shows deletion reason and who deleted it
✅ Automatically removed after 30 days
✅ Cannot be restored or permanently deleted manually
