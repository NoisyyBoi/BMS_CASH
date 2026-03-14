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

export const updateTransactionInSupabase = async (transactionId, updates) => {
  try {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', transactionId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
};

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

export const deleteOldSalaryPaymentsFromSupabase = async () => {
  try {
    // Calculate date 120 days ago
    const oneHundredTwentyDaysAgo = new Date();
    oneHundredTwentyDaysAgo.setDate(oneHundredTwentyDaysAgo.getDate() - 120);
    
    const { error } = await supabase
      .from('salary_payments')
      .delete()
      .lt('createdAt', oneHundredTwentyDaysAgo.toISOString());
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting old salary payments:', error);
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
// ===== USER CLEANUP MANAGEMENT =====

export const cleanupInactiveUsersFromSupabase = async (inactiveDays = 120, dryRun = false) => {
  try {
    // Call the PostgreSQL function to cleanup inactive users
    const { data, error } = await supabase
      .rpc('auto_cleanup_inactive_users', {
        inactive_days: inactiveDays,
        dry_run: dryRun
      });
    
    if (error) throw error;
    return {
      success: true,
      cleanedUsers: data || [],
      count: data ? data.length : 0
    };
  } catch (error) {
    console.error('Error cleaning up inactive users:', error);
    
    // Fallback to manual cleanup if function doesn't exist
    try {
      return await manualCleanupInactiveUsers(inactiveDays, dryRun);
    } catch (fallbackError) {
      console.error('Fallback cleanup also failed:', fallbackError);
      throw error;
    }
  }
};

// Fallback manual cleanup function
const manualCleanupInactiveUsers = async (inactiveDays = 120, dryRun = false) => {
  try {
    // Get all users with their last activity
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*');
    
    if (usersError) throw usersError;
    
    const inactiveUsers = [];
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - inactiveDays);
    
    for (const user of users) {
      // Get user's latest transaction
      const { data: transactions } = await supabase
        .from('transactions')
        .select('createdAt')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false })
        .limit(1);
      
      // Get user's latest salary payment
      const { data: salaryPayments } = await supabase
        .from('salary_payments')
        .select('createdAt')
        .eq('userId', user.id)
        .order('createdAt', { ascending: false })
        .limit(1);
      
      // Determine last activity date
      const lastTransaction = transactions && transactions.length > 0 ? new Date(transactions[0].createdAt) : null;
      const lastSalaryPayment = salaryPayments && salaryPayments.length > 0 ? new Date(salaryPayments[0].createdAt) : null;
      const userCreatedAt = new Date(user.createdAt);
      
      const lastActivity = [lastTransaction, lastSalaryPayment, userCreatedAt]
        .filter(date => date !== null)
        .reduce((latest, current) => current > latest ? current : latest);
      
      // Check if user is inactive
      if (lastActivity < cutoffDate) {
        const daysInactive = Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24));
        inactiveUsers.push({
          action: dryRun ? 'WOULD DELETE' : 'DELETED',
          user_id: user.id,
          user_name: user.name,
          user_phone: user.phone,
          last_activity_date: lastActivity.toISOString(),
          days_inactive: daysInactive,
          cleanup_date: new Date().toISOString()
        });
      }
    }
    
    // Actually delete users if not dry run
    if (!dryRun && inactiveUsers.length > 0) {
      const userIdsToDelete = inactiveUsers.map(u => u.user_id);
      
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .in('id', userIdsToDelete);
      
      if (deleteError) throw deleteError;
    }
    
    return {
      success: true,
      cleanedUsers: inactiveUsers,
      count: inactiveUsers.length
    };
  } catch (error) {
    console.error('Error in manual cleanup:', error);
    throw error;
  }
};

export const getCleanupLogFromSupabase = async () => {
  try {
    const { data, error } = await supabase
      .from('user_cleanup_log')
      .select('*')
      .order('cleanup_date', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cleanup log:', error);
    return [];
  }
};