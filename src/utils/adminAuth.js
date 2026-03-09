import { supabase } from '../supabaseClient';

// Generate 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate reset token
export const generateResetToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Send OTP email via Supabase Edge Function
export const sendOTPEmail = async (email, otp, username) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-otp-email', {
      body: { email, otp, username }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email via Supabase Edge Function
export const sendPasswordResetEmail = async (email, resetToken, username) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-reset-email', {
      body: { email, resetToken, username }
    });

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error sending reset email:', error);
    return { success: false, error: error.message };
  }
};

// Store OTP in database
export const storeOTP = async (username, otp) => {
  try {
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const { data, error } = await supabase
      .from('admin_otp')
      .insert([
        {
          username,
          otp_code: otp,
          expires_at: expiresAt.toISOString(),
          is_used: false
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error storing OTP:', error);
    return { success: false, error: error.message };
  }
};

// Verify OTP
export const verifyOTP = async (username, otp) => {
  try {
    const { data, error } = await supabase
      .from('admin_otp')
      .select('*')
      .eq('username', username)
      .eq('otp_code', otp)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return { success: false, error: 'Invalid or expired OTP' };
    }

    // Mark OTP as used
    const { error: updateError } = await supabase
      .from('admin_otp')
      .update({ is_used: true })
      .eq('id', data[0].id);

    if (updateError) throw updateError;

    return { success: true };
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return { success: false, error: error.message };
  }
};

// Get admin email by username
export const getAdminEmail = async (username) => {
  try {
    console.log('Fetching email for username:', username);
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('email')
      .eq('username', username)
      .single();

    console.log('Query result:', { data, error });
    
    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }
    
    if (!data) {
      console.error('No data returned for username:', username);
      return { success: false, error: 'Admin account not found' };
    }
    
    console.log('Email found:', data.email);
    return { success: true, email: data.email };
  } catch (error) {
    console.error('Error getting admin email:', error);
    return { success: false, error: error.message };
  }
};

// Store password reset token
export const storeResetToken = async (username, token) => {
  try {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    const { data, error } = await supabase
      .from('password_reset_tokens')
      .insert([
        {
          username,
          reset_token: token,
          expires_at: expiresAt.toISOString(),
          is_used: false
        }
      ])
      .select();

    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error storing reset token:', error);
    return { success: false, error: error.message };
  }
};

// Verify reset token
export const verifyResetToken = async (token) => {
  try {
    const { data, error } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('reset_token', token)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error) throw error;

    if (!data) {
      return { success: false, error: 'Invalid or expired reset token' };
    }

    return { success: true, username: data.username };
  } catch (error) {
    console.error('Error verifying reset token:', error);
    return { success: false, error: error.message };
  }
};

// Update admin password
export const updateAdminPassword = async (username, newPassword) => {
  try {
    const { data, error } = await supabase
      .from('admin_accounts')
      .update({ password_hash: newPassword, updated_at: new Date().toISOString() })
      .eq('username', username);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error updating password:', error);
    return { success: false, error: error.message };
  }
};

// Mark reset token as used
export const markResetTokenUsed = async (token) => {
  try {
    const { error } = await supabase
      .from('password_reset_tokens')
      .update({ is_used: true })
      .eq('reset_token', token);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error marking token as used:', error);
    return { success: false, error: error.message };
  }
};
