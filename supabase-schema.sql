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

-- Create salary_payments table
CREATE TABLE IF NOT EXISTS salary_payments (
  id BIGINT PRIMARY KEY,
  "userId" BIGINT NOT NULL,
  "userName" TEXT NOT NULL,
  "userPhone" TEXT NOT NULL,
  "monthlySalary" NUMERIC NOT NULL,
  "moneyGiven" NUMERIC NOT NULL,
  "paidSalary" NUMERIC,
  "deductedAmount" NUMERIC,
  "paidToEmployee" NUMERIC NOT NULL,
  "remainingBalance" NUMERIC,
  month TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_payments ENABLE ROW LEVEL SECURITY;

-- Create policies for users table (allow all operations for now)
CREATE POLICY "Enable read access for all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON users
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON users
  FOR DELETE USING (true);

-- Create policies for transactions table (allow all operations for now)
CREATE POLICY "Enable read access for all users" ON transactions
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON transactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON transactions
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON transactions
  FOR DELETE USING (true);

-- Create policies for salary_payments table (allow all operations for now)
CREATE POLICY "Enable read access for all users" ON salary_payments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON salary_payments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON salary_payments
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON salary_payments
  FOR DELETE USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions("userId");
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_salary_payments_user_id ON salary_payments("userId");
CREATE INDEX IF NOT EXISTS idx_salary_payments_created_at ON salary_payments("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_salary_payments_month ON salary_payments(month);
