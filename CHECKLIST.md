# Setup Checklist for Deleted Transactions

## Before You Can Delete Transactions:

- [ ] Open Supabase Dashboard (https://supabase.com/dashboard)
- [ ] Go to SQL Editor
- [ ] Copy content from `supabase-schema.sql`
- [ ] Paste and Run in SQL Editor
- [ ] Verify "deleted_transactions" table appears in Table Editor
- [ ] Refresh your app (F5)
- [ ] Test deleting a transaction

## If You See Errors:

### "Error deleting transaction"
→ Read `FIX_DELETE_ERROR.md`

### "Database not set up"
→ Read `SETUP_DELETED_TRANSACTIONS.md`

### "relation does not exist"
→ You haven't run the SQL script yet

## Quick Test:

1. Login as admin
2. Go to User Total → Select a user
3. Click delete (🗑️) on any transaction
4. Modal should appear asking for reason
5. Enter reason and delete
6. Go to home → Click "Deleted Transactions"
7. Your deleted transaction should appear there

## Files to Read:

1. **FIX_DELETE_ERROR.md** - Quick fix for delete errors
2. **SETUP_DELETED_TRANSACTIONS.md** - Detailed setup guide
3. **DELETED_TRANSACTIONS_SETUP.md** - Feature overview
4. **supabase-schema.sql** - SQL script to run

## Need Help?

1. Open browser console (F12)
2. Try to delete a transaction
3. Look for error messages in red
4. The error will tell you what's wrong
