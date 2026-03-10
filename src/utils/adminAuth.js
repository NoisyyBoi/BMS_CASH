import { supabase } from '../supabaseClient';

// Generate a 6-digit OTP
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

// Store OTP in database
export const storeOTP = async (username, otp) => {
  try {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

    const { error } = await supabase
      .from('admin_otp')
      .insert({
        username,
        otp_code: otp,
        expires_at: expiresAt.toISOString(),
        is_used: false
      });

    if (error) {
      console.error('Error storing OTP:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in storeOTP:', error);
    return { success: false, error: error.message };
  }
};

// Verify OTP
export const verifyOTP = async (username, otpCode) => {
  try {
    const { data, error } = await supabase
      .from('admin_otp')
      .select('*')
      .eq('username', username)
      .eq('otp_code', otpCode)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return { success: false, error: 'Invalid or expired OTP' };
    }

    // Mark OTP as used
    await supabase
      .from('admin_otp')
      .update({ is_used: true })
      .eq('id', data.id);

    return { success: true };
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return { success: false, error: error.message };
  }
};

// Send OTP email via Supabase Edge Function
export const sendOTPEmail = async (email, otp, username, isPasswordReset = false) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-otp-email', {
      body: { email, otp, username, isPasswordReset }
    });

    if (error) {
      console.error('Error sending OTP email:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error in sendOTPEmail:', error);
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
