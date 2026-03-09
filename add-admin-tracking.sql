-- Migration: Add admin tracking to existing tables
-- Run this in your Supabase SQL Editor if you already have data

-- Add createdBy column to transactions table
ALTER TABLE transactions 
ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

-- Add createdBy column to salary_payments table
ALTER TABLE salary_payments 
ADD COLUMN IF NOT EXISTS "createdBy" TEXT;

-- Optional: Set a default value for existing records
-- UPDATE transactions SET "createdBy" = 'admin' WHERE "createdBy" IS NULL;
-- UPDATE salary_payments SET "createdBy" = 'admin' WHERE "createdBy" IS NULL;

-- Create index for better performance (optional)
CREATE INDEX IF NOT EXISTS idx_transactions_created_by ON transactions("createdBy");
CREATE INDEX IF NOT EXISTS idx_salary_payments_created_by ON salary_payments("createdBy");
