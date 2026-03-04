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

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users("createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions("userId");
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions("createdAt" DESC);
