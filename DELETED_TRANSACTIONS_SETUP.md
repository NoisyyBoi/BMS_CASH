# Deleted Transactions Feature Setup

## Overview
This feature adds a "Deleted Transactions" system that:
- Prompts for a reason before deleting any transaction
- Stores deleted transactions in a separate table
- Automatically removes deleted transactions after 30 days
- Shows who deleted the transaction and when
- Allows admins to permanently delete before 30 days if needed

## Database Setup Required

You need to run the updated SQL schema in your Supabase dashboard to create the `deleted_transactions` table.

### Steps:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to "SQL Editor" in the left sidebar
4. Click "New Query"
5. Copy and paste the SQL from `supabase-schema.sql` file
6. Click "Run" to execute

The schema includes:
- `deleted_transactions` table with all necessary fields
- Row Level Security policies
- Indexes for performance

## Features Added

### 1. Delete Reason Modal
- When deleting a transaction, a modal appears asking for a reason
- Reason is required (cannot be empty)
- Transaction is moved to `deleted_transactions` table instead of being permanently deleted

### 2. Deleted Transactions Screen
- New button on home screen: "Deleted Transactions" (red button with 🗑️ icon)
- Shows all deleted transactions with:
  - User information
  - Original transaction details
  - Deletion date and time
  - Who deleted it (admin/secondadmin)
  - Reason for deletion
  - Days remaining until permanent deletion

### 3. Automatic Cleanup
- Deleted transactions older than 30 days are automatically removed
- Cleanup runs when the app loads
- No manual intervention needed

## User Flow

1. Admin clicks delete (🗑️) button on a transaction
2. Modal appears asking for deletion reason
3. Admin enters reason and clicks "Delete Transaction"
4. Transaction is moved to "Deleted Transactions"
5. Transaction appears in "Deleted Transactions" screen
6. After 30 days, transaction is automatically removed

## Technical Details

### New Database Table: `deleted_transactions`
```sql
- id: BIGINT (unique ID for deleted record)
- userId: BIGINT (original user ID)
- userName: TEXT
- userPhone: TEXT
- amount: NUMERIC
- purpose: TEXT
- deletedReason: TEXT (why it was deleted)
- deletedBy: TEXT (admin/secondadmin)
- originalCreatedAt: TIMESTAMPTZ (when transaction was originally created)
- deletedAt: TIMESTAMPTZ (when it was deleted)
```

### New Functions in `supabaseStorage.js`
- `saveDeletedTransactionToSupabase()` - Save to deleted_transactions
- `getDeletedTransactionsFromSupabase()` - Fetch all deleted transactions
- `deleteOldDeletedTransactionsFromSupabase()` - Auto-cleanup after 30 days
- `permanentlyDeleteTransactionFromSupabase()` - Manual permanent delete

### New UI Components
- Delete Reason Modal
- Deleted Transactions Screen
- Info banner showing 30-day policy
- Days remaining countdown

## Testing

1. Create a test transaction
2. Delete it and provide a reason
3. Check "Deleted Transactions" screen
4. Verify all information is displayed correctly

## Notes

- Only admins (admin/secondadmin) can delete transactions
- Viewers cannot access delete functionality
- Deleted transactions are read-only (cannot be restored)
- 30-day countdown starts from deletion date
- Automatic cleanup runs on app load
