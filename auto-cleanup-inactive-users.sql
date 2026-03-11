-- Auto Cleanup Inactive Users - Complete Solution
-- This script provides both manual cleanup and automatic scheduling options

-- 1. Create a comprehensive cleanup function
CREATE OR REPLACE FUNCTION auto_cleanup_inactive_users(
    inactive_days INTEGER DEFAULT 120,
    dry_run BOOLEAN DEFAULT FALSE
)
RETURNS TABLE(
    action TEXT,        
    user_id BIGINT,
    user_name TEXT,
    user_phone TEXT,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    days_inactive INTEGER,
    cleanup_date TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    cleanup_count INTEGER := 0;
    current_cleanup_time TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Log the cleanup attempt
    INSERT INTO user_cleanup_log (cleanup_date, inactive_days_threshold, dry_run)
    VALUES (current_cleanup_time, inactive_days, dry_run);
    
    -- Find and return inactive users
    RETURN QUERY
    WITH user_last_activity AS (
        SELECT 
            u.id,
            u.name,
            u.phone,
            u."createdAt",
            GREATEST(
                COALESCE(MAX(t."createdAt"), u."createdAt"),
                COALESCE(MAX(sp."createdAt"), u."createdAt")
            ) as last_activity
        FROM users u
        LEFT JOIN transactions t ON u.id = t."userId"
        LEFT JOIN salary_payments sp ON u.id = sp."userId"
        GROUP BY u.id, u.name, u.phone, u."createdAt"
    ),
    inactive_users AS (
        SELECT 
            id,
            name,
            phone,
            last_activity,
            EXTRACT(DAY FROM (NOW() - last_activity))::INTEGER as days_since_activity
        FROM user_last_activity
        WHERE EXTRACT(DAY FROM (NOW() - last_activity)) > inactive_days
    )
    SELECT 
        CASE WHEN dry_run THEN 'WOULD DELETE' ELSE 'DELETED' END::TEXT,
        iu.id,
        iu.name,
        iu.phone,
        iu.last_activity,
        iu.days_since_activity,
        current_cleanup_time
    FROM inactive_users iu;
    
    -- Get count for logging
    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    -- Actually delete users if not dry run
    IF NOT dry_run THEN
        WITH user_last_activity AS (
            SELECT 
                u.id,
                u.name,
                u.phone,
                u."createdAt",
                GREATEST(
                    COALESCE(MAX(t."createdAt"), u."createdAt"),
                    COALESCE(MAX(sp."createdAt"), u."createdAt")
                ) as last_activity
            FROM users u
            LEFT JOIN transactions t ON u.id = t."userId"
            LEFT JOIN salary_payments sp ON u.id = sp."userId"
            GROUP BY u.id, u.name, u.phone, u."createdAt"
        ),
        inactive_users AS (
            SELECT id
            FROM user_last_activity
            WHERE EXTRACT(DAY FROM (NOW() - last_activity)) > inactive_days
        )
        DELETE FROM users 
        WHERE id IN (SELECT id FROM inactive_users);
    END IF;
    
    -- Update the log with results (using explicit table reference)
    UPDATE user_cleanup_log 
    SET users_cleaned = cleanup_count
    WHERE user_cleanup_log.cleanup_date = current_cleanup_time;
    
END;
$$ LANGUAGE plpgsql;

-- 2. Create a log table to track cleanup operations
CREATE TABLE IF NOT EXISTS user_cleanup_log (
    id SERIAL PRIMARY KEY,
    cleanup_date TIMESTAMP WITH TIME ZONE NOT NULL,
    inactive_days_threshold INTEGER NOT NULL,
    dry_run BOOLEAN NOT NULL DEFAULT FALSE,
    users_cleaned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create a simple cleanup function for regular use
CREATE OR REPLACE FUNCTION cleanup_inactive_users_simple()
RETURNS INTEGER AS $$
DECLARE
    cleanup_count INTEGER := 0;
    current_cleanup_time TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    -- Delete users inactive for more than 120 days
    WITH user_last_activity AS (
        SELECT 
            u.id,
            GREATEST(
                COALESCE(MAX(t."createdAt"), u."createdAt"),
                COALESCE(MAX(sp."createdAt"), u."createdAt")
            ) as last_activity
        FROM users u
        LEFT JOIN transactions t ON u.id = t."userId"
        LEFT JOIN salary_payments sp ON u.id = sp."userId"
        GROUP BY u.id, u."createdAt"
    ),
    inactive_users AS (
        SELECT id
        FROM user_last_activity
        WHERE EXTRACT(DAY FROM (NOW() - last_activity)) > 120
    )
    DELETE FROM users 
    WHERE id IN (SELECT id FROM inactive_users);
    
    GET DIAGNOSTICS cleanup_count = ROW_COUNT;
    
    -- Log the cleanup
    INSERT INTO user_cleanup_log (cleanup_date, inactive_days_threshold, users_cleaned)
    VALUES (current_cleanup_time, 120, cleanup_count);
    
    RETURN cleanup_count;
END;
$$ LANGUAGE plpgsql;

-- 4. Usage Examples:

-- Dry run to see what would be deleted (120 days)
-- SELECT * FROM auto_cleanup_inactive_users(120, TRUE);

-- Actually delete inactive users (120 days)
-- SELECT * FROM auto_cleanup_inactive_users(120, FALSE);

-- Simple cleanup (120 days, no details)
-- SELECT cleanup_inactive_users_simple();

-- Custom inactive period (90 days)
-- SELECT * FROM auto_cleanup_inactive_users(90, FALSE);

-- 5. View cleanup history
-- SELECT * FROM user_cleanup_log ORDER BY cleanup_date DESC;

-- 6. Optional: Create a scheduled job (PostgreSQL with pg_cron extension)
-- This requires the pg_cron extension to be installed
-- SELECT cron.schedule('cleanup-inactive-users', '0 2 * * 0', 'SELECT cleanup_inactive_users_simple();');

-- 7. Manual cleanup commands for immediate use:

-- Check which users would be deleted (dry run)
SELECT * FROM auto_cleanup_inactive_users(120, TRUE);

-- Uncomment the line below to actually perform the cleanup
-- SELECT * FROM auto_cleanup_inactive_users(120, FALSE);