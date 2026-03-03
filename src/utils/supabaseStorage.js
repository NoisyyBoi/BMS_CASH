import { supabase } from '../supabaseClient';

// Users table operations
export const saveUserToSupabase = async (user) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{
      id: user.id,
      name: user.name,
      phone: user.phone,
      referral: user.referral,
      created_at: user.createdAt
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getUsersFromSupabase = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Convert to app format
  return data.map(user => ({
    id: user.id,
    name: user.name,
    phone: user.phone,
    referral: user.referral,
    createdAt: user.created_at
  }));
};

// Transactions table operations
export const saveTransactionToSupabase = async (transaction) => {
  const { data, error } = await supabase
    .from('transactions')
    .insert([{
      id: transaction.id,
      user_id: transaction.userId,
      user_name: transaction.userName,
      user_phone: transaction.userPhone,
      amount: transaction.amount,
      purpose: transaction.purpose,
      created_at: transaction.createdAt
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const getTransactionsFromSupabase = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Convert to app format
  return data.map(transaction => ({
    id: transaction.id,
    userId: transaction.user_id,
    userName: transaction.user_name,
    userPhone: transaction.user_phone,
    amount: parseFloat(transaction.amount),
    purpose: transaction.purpose,
    createdAt: transaction.created_at
  }));
};

export const getUserTransactionsFromSupabase = async (userId) => {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  
  // Convert to app format
  return data.map(transaction => ({
    id: transaction.id,
    userId: transaction.user_id,
    userName: transaction.user_name,
    userPhone: transaction.user_phone,
    amount: parseFloat(transaction.amount),
    purpose: transaction.purpose,
    createdAt: transaction.created_at
  }));
};
