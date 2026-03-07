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


// ===== DELETE USER TRANSACTIONS =====

export const deleteUserTransactionsFromSupabase = async (userId) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('userId', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting user transactions:', error);
    throw error;
  }
};


// ===== DELETE SALARY PAYMENT =====

export const deleteSalaryPaymentFromSupabase = async (paymentId) => {
  try {
    const { error } = await supabase
      .from('salary_payments')
      .delete()
      .eq('id', paymentId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting salary payment:', error);
    throw error;
  }
};

// ===== DELETE SINGLE TRANSACTION =====

export const deleteTransactionFromSupabase = async (transactionId) => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', transactionId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
};

// ===== DELETED TRANSACTIONS MANAGEMENT =====

export const saveDeletedTransactionToSupabase = async (deletedTransaction) => {
  try {
    const { data, error } = await supabase
      .from('deleted_transactions')
      .insert([deletedTransaction])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving deleted transaction:', error);
    throw error;
  }
};

export const getDeletedTransactionsFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('deleted_transactions')
      .select('*')
      .order('deletedAt', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching deleted transactions:', error);
    throw error;
  }
};

export const deleteOldDeletedTransactionsFromSupabase = async () => {
  try {
    // Calculate date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { error } = await supabase
      .from('deleted_transactions')
      .delete()
      .lt('deletedAt', thirtyDaysAgo.toISOString());
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting old deleted transactions:', error);
    throw error;
  }
};

export const permanentlyDeleteTransactionFromSupabase = async (deletedTransactionId) => {
  try {
    const { error } = await supabase
      .from('deleted_transactions')
      .delete()
      .eq('id', deletedTransactionId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error permanently deleting transaction:', error);
    throw error;
  }
};
