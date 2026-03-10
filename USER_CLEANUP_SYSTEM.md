# User Cleanup System - Automatic Inactive User Removal

This system automatically removes users who have had no transactions or salary payments for more than 120 days, helping keep the database clean and efficient.

## How It Works

The system checks for users who have been inactive for more than 120 days by looking at:
- Last transaction date
- Last salary payment date  
- User creation date (if no transactions/payments exist)

If a user's last activity was more than 120 days ago, they are automatically deleted.

## Implementation

### 1. Database Functions (SQL)

Two SQL files are provided:

#### `cleanup-inactive-users.sql`
- Simple cleanup function for one-time use
- Shows which users will be deleted before deletion
- Safe to run manually

#### `auto-cleanup-inactive-users.sql` 
- Comprehensive solution with logging
- Supports dry-run mode to preview deletions
- Creates cleanup log table for tracking
- Includes scheduling options

### 2. JavaScript Integration

The cleanup is integrated into the app and runs automatically:

#### Automatic Cleanup
- Runs once per day when admins log in
- Uses localStorage to prevent multiple runs per day
- Silently handles errors without disrupting the app

#### Manual Cleanup
You can also trigger cleanup manually:

```javascript
// Dry run - see what would be deleted
const result = await cleanupInactiveUsersFromSupabase(120, true);
console.log('Would delete:', result.cleanedUsers);

// Actually delete inactive users
const result = await cleanupInactiveUsersFromSupabase(120, false);
console.log('Deleted:', result.count, 'users');
```

## Setup Instructions

### 1. Run the SQL Setup

Execute the SQL setup in your Supabase dashboard:

```sql
-- Run this in Supabase SQL Editor
-- Copy and paste from auto-cleanup-inactive-users.sql
```

### 2. Test the System

First, run a dry run to see what would be deleted:

```sql
-- Check which users would be deleted (dry run)
SELECT * FROM auto_cleanup_inactive_users(120, TRUE);
```

### 3. Enable Automatic Cleanup

The cleanup is already integrated into the app and will run automatically when:
- Admins log in (once per day maximum)
- The app initializes with admin/viewer sessions

### 4. Optional: Schedule Regular Cleanup

For PostgreSQL with pg_cron extension:

```sql
-- Run cleanup every Sunday at 2 AM
SELECT cron.schedule('cleanup-inactive-users', '0 2 * * 0', 'SELECT cleanup_inactive_users_simple();');
```

## Monitoring

### View Cleanup History

```sql
-- See cleanup log
SELECT * FROM user_cleanup_log ORDER BY cleanup_date DESC;
```

### Check Current Inactive Users

```sql
-- See who would be deleted now (dry run)
SELECT * FROM auto_cleanup_inactive_users(120, TRUE);
```

## Configuration

### Change Inactive Period

To change from 120 days to a different period:

1. **In SQL**: Modify the `inactive_days` parameter
2. **In JavaScript**: Change the first parameter in `cleanupInactiveUsersFromSupabase()`

```javascript
// Change to 90 days
await cleanupInactiveUsersFromSupabase(90, false);
```

### Disable Automatic Cleanup

To disable automatic cleanup, comment out the `cleanupInactiveUsersOnLoad()` calls in `App.jsx`.

## Safety Features

1. **Dry Run Mode**: Always test with dry run first
2. **Logging**: All cleanup operations are logged
3. **Fallback**: If SQL functions fail, JavaScript fallback is used
4. **Rate Limiting**: Automatic cleanup runs max once per day
5. **Error Handling**: Failures don't crash the app

## Troubleshooting

### SQL Functions Not Found

If you get "function does not exist" errors:
1. Make sure you ran the SQL setup in Supabase
2. Check that the functions were created successfully
3. The system will fall back to JavaScript-based cleanup

### No Users Being Deleted

Check if users actually meet the criteria:
```sql
-- Debug query to see user activity
SELECT 
    u.name,
    u.created_at,
    MAX(t.created_at) as last_transaction,
    MAX(sp.created_at) as last_salary_payment,
    EXTRACT(DAY FROM (NOW() - GREATEST(
        COALESCE(MAX(t.created_at), u.created_at),
        COALESCE(MAX(sp.created_at), u.created_at)
    ))) as days_inactive
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id  
LEFT JOIN salary_payments sp ON u.id = sp.user_id
GROUP BY u.id, u.name, u.created_at
ORDER BY days_inactive DESC;
```

## Manual Cleanup Commands

```sql
-- See what would be deleted (safe)
SELECT * FROM auto_cleanup_inactive_users(120, TRUE);

-- Actually delete inactive users
SELECT * FROM auto_cleanup_inactive_users(120, FALSE);

-- Simple cleanup (no details)
SELECT cleanup_inactive_users_simple();

-- Custom period (90 days)
SELECT * FROM auto_cleanup_inactive_users(90, FALSE);
```

The system is designed to be safe, automatic, and maintainable while keeping your user database clean and efficient.