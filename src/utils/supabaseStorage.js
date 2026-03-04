import { supabase } from '../supabaseClient';

// ===== USER MANAGEMENT =====

export const getUsersFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const saveUserToSupabase = async (user) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving user:', error);
    throw error;
  }
};

// ===== TRANSACTION MANAGEMENT =====

export const getTransactionsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};

export const saveTransactionToSupabase = async (transaction) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert([transaction])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving transaction:', error);
    throw error;
  }
};

export const getUserTransactionsFromSupabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user transactions:', error);
    throw error;
  }
};

// ===== SALARY PAYMENT MANAGEMENT =====

export const getSalaryPaymentsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('salary_payments')
      .select('*')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching salary payments:', error);
    throw error;
  }
};

export const saveSalaryPaymentToSupabase = async (payment) => {
  try {
    const { data, error } = await supabase
      .from('salary_payments')
      .insert([payment])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving salary payment:', error);
    throw error;
  }
};

export const getUserSalaryPaymentsFromSupabase = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('salary_payments')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false});
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user salary payments:', error);
    throw error;
  }
};
