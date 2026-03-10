import { supabase } from '../supabaseClient';

// Send OTP using Supabase built-in auth (no SMTP needed!)
export const sendOTPEmail = async (email, username, isPasswordReset = false) => {
  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email,
      options: {
        // Optional: customize email template
        data: {
          username: username,
          purpose: isPasswordReset ? 'password_reset' : 'login'
        }
      }
    });

    if (error) {
      console.error('Error sending OTP:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendOTPEmail:', error);
    return { success: false, error: error.message };
  }
};

// Verify OTP using Supabase built-in auth
export const verifyOTP = async (email, otpCode) => {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email,
      token: otpCode,
      type: 'email'
    });

    if (error) {
      console.error('Error verifying OTP:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return { success: false, error: error.message };
  }
};

// Get admin email from database
export const getAdminEmail = async (username) => {
  try {
    const { data, error } = await supabase
      .from('admin_accounts')
      .select('email')
      .eq('username', username)
      .single();

    if (error) {
      console.error('Error fetching admin email:', error);
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: 'Admin account not found' };
    }

    return { success: true, email: data.email };
  } catch (error) {
    console.error('Error in getAdminEmail:', error);
    return { success: false, error: error.message };
  }
};

// Update admin password in database
export const updateAdminPassword = async (username, newPassword) => {
  try {
    const { error } = await supabase
      .from('admin_accounts')
      .update({ 
        password_hash: newPassword,
        updated_at: new Date().toISOString()
      })
      .eq('username', username);

    if (error) {
      console.error('Error updating password:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in updateAdminPassword:', error);
    return { success: false, error: error.message };
  }
};
