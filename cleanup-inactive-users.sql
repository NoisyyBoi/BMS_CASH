-- Cleanup Inactive Users Script
-- Deletes users who have had no transactions or salary payments for more than 120 days

-- First, let's create a function to safely delete inactive users
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS TABLE(
    deleted_user_id BIGINT,
    deleted_user_name TEXT,
    deleted_user_phone TEXT,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    days_inactive INTEGER
) AS $$
BEGIN
    -- Return information about users that will be deleted
    RETURN QUERY
    WITH user_last_activity AS (
        SELECT 
            u.id,
            u.name,
            u.phone,
            u.created_at,
            GREATEST(
                COALESCE(MAX(t.created_at), u.created_at),
                COALESCE(MAX(sp.created_at), u.created_at)
            ) as last_activity
        FROM users u
        LEFT JOIN transactions t ON u.id = t.user_id
        LEFT JOIN salary_payments sp ON u.id = sp.user_id
        GROUP BY u.id, u.name, u.phone, u.created_at
    ),
    inactive_users AS (
        SELECT 
            id,
            name,
            phone,
            last_activity,
            EXTRACT(DAY FROM (NOW() - last_activity))::INTEGER as days_since_activity
        FROM user_last_activity
        WHERE EXTRACT(DAY FROM (NOW() - last_activity)) > 120
    )
    SELECT 
        iu.id,
        iu.name,
        iu.phone,
        iu.last_activity,
        iu.days_since_activity
    FROM inactive_users iu;
    
    -- Delete the inactive users
    WITH user_last_activity AS (
        SELECT 
            u.id,
            u.name,
            u.phone,
            u.created_at,
            GREATEST(
                COALESCE(MAX(t.created_at), u.created_at),
                COALESCE(MAX(sp.created_at), u.created_at)
            ) as last_activity
        FROM users u
        LEFT JOIN transactions t ON u.id = t.user_id
        LEFT JOIN salary_payments sp ON u.id = sp.user_id
        GROUP BY u.id, u.name, u.phone, u.created_at
    ),
    inactive_users AS (
        SELECT id
        FROM user_last_activity
        WHERE EXTRACT(DAY FROM (NOW() - last_activity)) > 120
    )
    DELETE FROM users 
    WHERE id IN (SELECT id FROM inactive_users);
    
END;
$$ LANGUAGE plpgsql;

-- Execute the cleanup and show results
SELECT * FROM cleanup_inactive_users();

-- Drop the function after use (optional)
-- DROP FUNCTION IF EXISTS cleanup_inactive_users();