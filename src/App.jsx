import { useState, useEffect } from 'react';
import { categories, getMaterialsByCategory, getMaterialById, getUnitOptions } from './data/materials';
import { getSavedLists, saveList, deleteList, getUsedSiteNames, formatListForSharing, shareViaWhatsApp, copyToClipboard, generatePDF, getTodayFormatted, generateUserTransactionsPDF, generateDailyTransactionsPDF, formatUserTransactionsForWhatsApp, formatDailyTransactionsForWhatsApp, generateMonthlySummaryPDF, formatMonthlySummaryForWhatsApp } from './utils/storage';
import { getUsersFromSupabase, saveUserToSupabase, getTransactionsFromSupabase, saveTransactionToSupabase, getUserTransactionsFromSupabase, saveSalaryPaymentToSupabase, getSalaryPaymentsFromSupabase, deleteUserTransactionsFromSupabase, deleteSalaryPaymentFromSupabase, deleteTransactionFromSupabase, saveDeletedTransactionToSupabase, getDeletedTransactionsFromSupabase, deleteOldDeletedTransactionsFromSupabase, deleteOldSalaryPaymentsFromSupabase } from './utils/supabaseStorage';
import { formatIndianCurrency } from './utils/formatCurrency';
import { generateOTP, sendOTPEmail, storeOTP, verifyOTP, getAdminEmail, generateResetToken, sendPasswordResetEmail, storeResetToken, verifyResetToken, updateAdminPassword, markResetTokenUsed } from './utils/adminAuth';

import { hashPassword } from './utils/passwordHash';

// View constants
const VIEWS = {
  HOME: 'home',
  LOGIN: 'login',
  OTP_VERIFY: 'otp_verify',
  FORGOT_PASSWORD: 'forgot_password',
  RESET_PASSWORD: 'reset_password',
  CREATE_USER: 'create_user',
  GIVE_MONEY: 'give_money',
  USER_TOTAL: 'user_total',
  USER_HISTORY: 'user_history',
  SALARY_PAYMENTS: 'salary_payments',
  DELETED_TRANSACTIONS: 'deleted_transactions',
  PROJECT: 'project',
  CATEGORIES: 'categories',
  ITEMS: 'items',
  REVIEW: 'review',
  HISTORY: 'history',
};

// Admin credentials (use strong passwords to avoid security warnings)
const ADMIN_CREDENTIALS = {
  kushal: 'Kushal@123',
  admin2: 'Admin2@BMS2024!',
  admin3: 'Admin3@BMS2024!',
  admin4: 'Admin4@BMS2024!',
  admin5: 'Admin5@BMS2024!',
  admin6: 'Admin6@BMS2024!',
  admin7: 'Admin7@BMS2024!',
  admin8: 'Admin8@BMS2024!'
};

function App() {
  const [view, setView] = useState(VIEWS.LOGIN);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin', 'secondadmin', or 'viewer'
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const [siteName, setSiteName] = useState('');
  const [projectDate, setProjectDate] = useState(getTodayFormatted());
  const [savedLists, setSavedLists] = useState([]);
  const [toast, setToast] = useState(null);
  const [showSiteSelector, setShowSiteSelector] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // New states
  const [searchQuery, setSearchQuery] = useState('');
  const [sizeFilter, setSizeFilter] = useState(null);
  const [numpadMaterial, setNumpadMaterial] = useState(null);
  const [numpadValue, setNumpadValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemQty, setCustomItemQty] = useState('');

  // User creation states
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userReferral, setUserReferral] = useState('');

  // Give money states
  const [selectedUser, setSelectedUser] = useState(null);
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [moneyAmount, setMoneyAmount] = useState('');
  const [moneyPurpose, setMoneyPurpose] = useState('');
  const [customPurpose, setCustomPurpose] = useState('');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [expandedDates, setExpandedDates] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);

  // User total states
  const [selectedUserForHistory, setSelectedUserForHistory] = useState(null);
  const [userHistorySearchQuery, setUserHistorySearchQuery] = useState('');
  const [showUserHistoryDropdown, setShowUserHistoryDropdown] = useState(false);
  const [totalSalary, setTotalSalary] = useState('');
  const [payingNow, setPayingNow] = useState('');
  const [userTransactionsData, setUserTransactionsData] = useState([]);
  const [userMonthlyTotal, setUserMonthlyTotal] = useState(0);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [salaryPayments, setSalaryPayments] = useState([]);
  const [loadingSalaryPayments, setLoadingSalaryPayments] = useState(false);
  const [showMonthlySummary, setShowMonthlySummary] = useState(false);
  const [expandedSalaryMonths, setExpandedSalaryMonths] = useState({});
  const [deletedTransactions, setDeletedTransactions] = useState([]);
  const [loadingDeletedTransactions, setLoadingDeletedTransactions] = useState(false);
  const [showDeleteReasonModal, setShowDeleteReasonModal] = useState(false);
  const [deleteReasonText, setDeleteReasonText] = useState('');
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // 2FA and Password Reset states
  const [pendingAdminUsername, setPendingAdminUsername] = useState(null);
  const [otpCode, setOtpCode] = useState('');
  const [otpSending, setOtpSending] = useState(false);
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordResetLoading, setPasswordResetLoading] = useState(false);

  useEffect(() => {
    setSavedLists(getSavedLists());
    
    // Check for stored session
    const storedRole = localStorage.getItem('bms_user_role');
    const storedUserId = localStorage.getItem('bms_logged_in_user_id');
    
    if (storedRole) {
      setIsAuthenticated(true);
      setUserRole(storedRole);
      
      // If it's a user session, restore their data
      if (storedRole === 'user' && storedUserId) {
        const restoreUserSession = async () => {
          try {
            const users = await getUsersFromSupabase();
            const user = users.find(u => u.id.toString() === storedUserId);
            
            if (user) {
              setSelectedUserForHistory(user);
              const transactions = await getUserTransactionsFromSupabase(user.id);
              setUserTransactionsData(transactions);
              const monthlyTotal = getMonthlyTotal(transactions);
              setUserMonthlyTotal(monthlyTotal);
              setView(VIEWS.USER_HISTORY);
            } else {
              // User not found, logout
              handleLogout();
            }
          } catch (error) {
            console.error('Error restoring user session:', error);
            handleLogout();
          }
        };
        restoreUserSession();
      } else {
        // Admin or viewer session
        setView(VIEWS.HOME);
        loadUsers();
        loadTransactions();
        cleanupOldDeletedTransactions();
        cleanupOldSalaryPayments();
      }
    }
  }, []);

  // Scroll to top whenever view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [view]);

  const handleLogin = async () => {
    const username = loginUsername.trim();
    const password = loginPassword.trim();

    // Check admin credentials (case-insensitive username)
    const lowerUsername = username.toLowerCase();
    if (ADMIN_CREDENTIALS[lowerUsername] === password) {
      // Admin login - send OTP for 2FA
      setOtpSending(true);
      try {
        // Get admin email
        const emailResult = await getAdminEmail(lowerUsername);
        if (!emailResult.success) {
          showToast('⚠️ Admin email not configured. Please contact support.');
          setOtpSending(false);
          return;
        }

        // Generate and store OTP
        const otp = generateOTP();
        const storeResult = await storeOTP(lowerUsername, otp);
        if (!storeResult.success) {
          showToast('⚠️ Error generating OTP. Please try again.');
          setOtpSending(false);
          return;
        }

        // Send OTP email
        const sendResult = await sendOTPEmail(emailResult.email, otp, lowerUsername);
        if (!sendResult.success) {
          showToast('⚠️ Error sending OTP email. Please try again.');
          setOtpSending(false);
          return;
        }

        // Move to OTP verification screen
        setPendingAdminUsername(lowerUsername);
        setView(VIEWS.OTP_VERIFY);
        showToast('✓ OTP sent to your email');
      } catch (error) {
        console.error('Error in 2FA flow:', error);
        showToast('⚠️ Error in login process. Please try again.');
      } finally {
        setOtpSending(false);
      }
      return;
    }
    
    // Check viewer credentials
    if (lowerUsername === 'viewer' && password === 'viewer') {
      setIsAuthenticated(true);
      setUserRole('viewer');
      localStorage.setItem('bms_user_role', 'viewer');
      localStorage.removeItem('bms_logged_in_user_id');
      setView(VIEWS.HOME);
      loadUsers();
      loadTransactions();
      cleanupOldDeletedTransactions();
      cleanupOldSalaryPayments();
      showToast('✓ Logged in as Viewer');
      return;
    }
    
    // Check if it's a user login (name + phone number)
    try {
      const users = await getUsersFromSupabase();
      const matchedUser = users.find(user => 
        user.name.toLowerCase() === lowerUsername && user.phone === password
      );
      
      if (matchedUser) {
        setIsAuthenticated(true);
        setUserRole('user');
        setSelectedUserForHistory(matchedUser);
        localStorage.setItem('bms_user_role', 'user');
        localStorage.setItem('bms_logged_in_user_id', matchedUser.id.toString());
        
        // Load user's transactions
        const transactions = await getUserTransactionsFromSupabase(matchedUser.id);
        setUserTransactionsData(transactions);
        const monthlyTotal = getMonthlyTotal(transactions);
        setUserMonthlyTotal(monthlyTotal);
        
        setView(VIEWS.USER_HISTORY);
        showToast(`✓ Welcome ${matchedUser.name}`);
        return;
      }
    } catch (error) {
      console.error('Error checking user credentials:', error);
    }
    
    showToast('⚠️ Invalid credentials');
  };

  const handleVerifyOTP = async () => {
    if (!otpCode.trim() || otpCode.length !== 6) {
      showToast('⚠️ Please enter a valid 6-digit OTP');
      return;
    }

    setOtpVerifying(true);
    try {
      const result = await verifyOTP(pendingAdminUsername, otpCode);
      if (result.success) {
        // OTP verified - complete login
        setIsAuthenticated(true);
        setUserRole(pendingAdminUsername);
        localStorage.setItem('bms_user_role', pendingAdminUsername);
        localStorage.removeItem('bms_logged_in_user_id');
        setView(VIEWS.HOME);
        loadUsers();
        loadTransactions();
        cleanupOldDeletedTransactions();
        cleanupOldSalaryPayments();
        showToast('✓ Login successful');
        
        // Reset OTP states
        setOtpCode('');
        setPendingAdminUsername(null);
      } else {
        showToast('⚠️ ' + (result.error || 'Invalid or expired OTP'));
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      showToast('⚠️ Error verifying OTP. Please try again.');
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!pendingAdminUsername) return;

    setOtpSending(true);
    try {
      const emailResult = await getAdminEmail(pendingAdminUsername);
      if (!emailResult.success) {
        showToast('⚠️ Error getting admin email');
        setOtpSending(false);
        return;
      }

      const otp = generateOTP();
      await storeOTP(pendingAdminUsername, otp);
      await sendOTPEmail(emailResult.email, otp, pendingAdminUsername);
      showToast('✓ New OTP sent to your email');
    } catch (error) {
      console.error('Error resending OTP:', error);
      showToast('⚠️ Error resending OTP');
    } finally {
      setOtpSending(false);
    }
  };

  const handleForgotPassword = async () => {
    const username = forgotPasswordEmail.trim().toLowerCase();
    if (!username) {
      showToast('⚠️ Please enter your username');
      return;
    }

    // Check if username exists in admin credentials
    if (!ADMIN_CREDENTIALS[username]) {
      showToast('⚠️ Username not found');
      return;
    }

    setPasswordResetLoading(true);
    try {
      // Get admin email
      const emailResult = await getAdminEmail(username);
      if (!emailResult.success) {
        showToast('⚠️ Email not configured for this account');
        setPasswordResetLoading(false);
        return;
      }

      // Generate and store reset token
      const token = generateResetToken();
      const storeResult = await storeResetToken(username, token);
      if (!storeResult.success) {
        showToast('⚠️ Error generating reset link');
        setPasswordResetLoading(false);
        return;
      }

      // Send reset email
      const sendResult = await sendPasswordResetEmail(emailResult.email, token, username);
      if (!sendResult.success) {
        showToast('⚠️ Error sending reset email');
        setPasswordResetLoading(false);
        return;
      }

      showToast('✓ Password reset link sent to your email');
      setForgotPasswordEmail('');
      setView(VIEWS.LOGIN);
    } catch (error) {
      console.error('Error in password reset:', error);
      showToast('⚠️ Error sending reset email');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      showToast('⚠️ Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('⚠️ Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      showToast('⚠️ Password must be at least 8 characters');
      return;
    }

    setPasswordResetLoading(true);
    try {
      // Verify reset token
      const verifyResult = await verifyResetToken(resetToken);
      if (!verifyResult.success) {
        showToast('⚠️ Invalid or expired reset link');
        setPasswordResetLoading(false);
        return;
      }

      // Update password
      const updateResult = await updateAdminPassword(verifyResult.username, newPassword);
      if (!updateResult.success) {
        showToast('⚠️ Error updating password');
        setPasswordResetLoading(false);
        return;
      }

      // Mark token as used
      await markResetTokenUsed(resetToken);

      showToast('✓ Password updated successfully');
      setNewPassword('');
      setConfirmPassword('');
      setResetToken('');
      setView(VIEWS.LOGIN);
    } catch (error) {
      console.error('Error resetting password:', error);
      showToast('⚠️ Error resetting password');
    } finally {
      setPasswordResetLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setSelectedUserForHistory(null);
    setUserTransactionsData([]);
    setUserMonthlyTotal(0);
    localStorage.removeItem('bms_user_role');
    localStorage.removeItem('bms_logged_in_user_id');
    setView(VIEWS.LOGIN);
    setLoginUsername('');
    setLoginPassword('');
    showToast('✓ Logged out');
  };

  const isAdmin = () => {
    // Check if userRole exists in ADMIN_CREDENTIALS (any admin account)
    return userRole && ADMIN_CREDENTIALS.hasOwnProperty(userRole);
  };

  const loadUsers = async () => {
    try {
      const users = await getUsersFromSupabase();
      setAllUsers(users);
    } catch (error) {
      console.error('Error loading users:', error);
      setAllUsers([]);
    }
  };

  const loadTransactions = async () => {
    try {
      const transactions = await getTransactionsFromSupabase();
      setAllTransactions(transactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setAllTransactions([]);
    }
  };

  const cleanupOldDeletedTransactions = async () => {
    try {
      await deleteOldDeletedTransactionsFromSupabase();
    } catch (error) {
      // Silently fail if table doesn't exist yet
      if (!error.message || !error.message.includes('relation')) {
        console.error('Error cleaning up old deleted transactions:', error);
      }
    }
  };

  const cleanupOldSalaryPayments = async () => {
    try {
      await deleteOldSalaryPaymentsFromSupabase();
    } catch (error) {
      // Silently fail if there's an error
      console.error('Error cleaning up old salary payments:', error);
    }
  };

  const loadDeletedTransactions = async () => {
    setLoadingDeletedTransactions(true);
    try {
      const deleted = await getDeletedTransactionsFromSupabase();
      setDeletedTransactions(deleted);
    } catch (error) {
      console.error('Error loading deleted transactions:', error);
      
      // Check if table doesn't exist
      if (error.message && error.message.includes('relation') && error.message.includes('deleted_transactions')) {
        showToast('⚠️ Database not set up. Check SETUP_DELETED_TRANSACTIONS.md');
        console.error('Please run the SQL schema from supabase-schema.sql in your Supabase dashboard.');
        console.error('See SETUP_DELETED_TRANSACTIONS.md for instructions.');
      }
      
      setDeletedTransactions([]);
    } finally {
      setLoadingDeletedTransactions(false);
    }
  };

  const openDeletedTransactions = async () => {
    await loadDeletedTransactions();
    setView(VIEWS.DELETED_TRANSACTIONS);
  };

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const startNewList = () => {
    setSelectedItems({});
    setSiteName('');
    setProjectDate(getTodayFormatted());
    setView(VIEWS.PROJECT);
  };

  const startCreateUser = () => {
    if (!isAdmin()) {
      showToast('⚠️ Only admins can create users');
      return;
    }
    setUserName('');
    setUserPhone('');
    setUserReferral('');
    setView(VIEWS.CREATE_USER);
  };

  const startGiveMoney = () => {
    if (!isAdmin()) {
      showToast('⚠️ Only admins can add transactions');
      return;
    }
    setSelectedUser(null);
    setUserSearchQuery('');
    setMoneyAmount('');
    setMoneyPurpose('');
    setCustomPurpose('');
    setShowUserDropdown(false);
    setView(VIEWS.GIVE_MONEY);
  };

  const startUserTotal = async () => {
    setSelectedUserForHistory(null);
    setUserHistorySearchQuery('');
    setShowUserHistoryDropdown(false);
    
    // Reload users to ensure fresh data
    await loadUsers();
    
    setView(VIEWS.USER_TOTAL);
  };

  const openHistory = async () => {
    // Reload transactions to ensure fresh data
    await loadTransactions();
    setView(VIEWS.HISTORY);
  };

  const selectUserForHistory = async (user) => {
    setSelectedUserForHistory(user);
    setUserHistorySearchQuery(user.name);
    setShowUserHistoryDropdown(false);
    setTotalSalary('');
    
    // Load user transactions
    const transactions = await getUserTransactionsFromSupabase(user.id);
    setUserTransactionsData(transactions);
    
    const monthlyTotal = getMonthlyTotal(transactions);
    setUserMonthlyTotal(monthlyTotal);
    
    setView(VIEWS.USER_HISTORY);
  };

  const getFilteredUsersForHistory = () => {
    if (!userHistorySearchQuery.trim()) return allUsers;
    
    const query = userHistorySearchQuery.toLowerCase();
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.phone.includes(query)
    );
  };

  const getMonthlyTotal = (transactions) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return transactions
      .filter(t => {
        const transDate = new Date(t.createdAt);
        return transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getFilteredUsers = () => {
    if (!userSearchQuery.trim()) return allUsers;
    
    const query = userSearchQuery.toLowerCase();
    return allUsers.filter(user => 
      user.name.toLowerCase().includes(query) || 
      user.phone.includes(query)
    );
  };

  const selectUser = (user) => {
    setSelectedUser(user);
    setUserSearchQuery(user.name);
    setShowUserDropdown(false);
  };

  const handleSaveTransaction = async () => {
    if (!selectedUser) {
      showToast('⚠️ Please select a user');
      return;
    }
    if (!moneyAmount.trim() || parseFloat(moneyAmount) <= 0) {
      showToast('⚠️ Please enter a valid amount');
      return;
    }
    if (!moneyPurpose) {
      showToast('⚠️ Please select a purpose');
      return;
    }
    if (moneyPurpose === 'others' && !customPurpose.trim()) {
      showToast('⚠️ Please specify the purpose');
      return;
    }

    const transaction = {
      id: Date.now(),
      userId: selectedUser.id,
      userName: selectedUser.name,
      userPhone: selectedUser.phone,
      amount: parseFloat(moneyAmount),
      purpose: moneyPurpose === 'others' ? customPurpose.trim() : moneyPurpose,
      createdBy: userRole, // Track which admin created this
      createdAt: new Date().toISOString(),
    };

    try {
      await saveTransactionToSupabase(transaction);
      await loadTransactions(); // Reload transactions list
      showToast('✓ Transaction saved successfully');
      setView(VIEWS.HOME);
    } catch (error) {
      console.error('Error saving transaction:', error);
      showToast('⚠️ Error saving transaction');
    }
  };

  const handleSaveSalaryPayment = async () => {
    if (!selectedUserForHistory) {
      showToast('⚠️ No user selected');
      return;
    }
    if (!totalSalary || parseFloat(totalSalary) <= 0) {
      showToast('⚠️ Please enter monthly salary');
      return;
    }

    const salary = parseFloat(totalSalary);
    const balance = salary - userMonthlyTotal;
    const isNegative = balance < 0;
    const absBalance = Math.abs(balance);
    const payAmount = parseFloat(payingNow) || (isNegative ? 0 : balance);
    
    let paidToEmployee, remainingBalance, deductedAmount;
    
    if (isNegative) {
      // Employee owes money
      deductedAmount = Math.min(payAmount, salary);
      paidToEmployee = salary - deductedAmount;
      remainingBalance = absBalance - deductedAmount;
    } else {
      // Employee has salary remaining
      const difference = payAmount - balance;
      
      if (difference > 0) {
        // Overpayment - employee owes money back
        paidToEmployee = payAmount;
        remainingBalance = difference; // This is what employee owes
        deductedAmount = null;
      } else {
        // Normal payment or underpayment
        paidToEmployee = payAmount;
        remainingBalance = Math.abs(difference); // Carry forward credit
        deductedAmount = null;
      }
    }
    
    const now = new Date();
    const monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    const salaryPayment = {
      id: Date.now(),
      userId: selectedUserForHistory.id,
      userName: selectedUserForHistory.name,
      userPhone: selectedUserForHistory.phone,
      monthlySalary: salary,
      moneyGiven: userMonthlyTotal,
      paidSalary: null,
      deductedAmount: deductedAmount,
      paidToEmployee: paidToEmployee,
      remainingBalance: remainingBalance > 0 ? remainingBalance : null,
      month: monthName,
      createdBy: userRole, // Track which admin created this
      createdAt: new Date().toISOString(),
    };

    try {
      // Save salary payment
      await saveSalaryPaymentToSupabase(salaryPayment);
      
      // Delete all old transactions for this user
      await deleteUserTransactionsFromSupabase(selectedUserForHistory.id);
      
      // If there's a remaining balance (debt or credit), create a transaction
      if (remainingBalance > 0) {
        const difference = payAmount - balance;
        const isDebt = difference > 0; // Employee owes money (overpayment)
        
        const balanceTransaction = {
          id: Date.now() + 1,
          userId: selectedUserForHistory.id,
          userName: selectedUserForHistory.name,
          userPhone: selectedUserForHistory.phone,
          amount: -remainingBalance, // Negative amount (shows in red)
          purpose: isDebt 
            ? `Owes from Overpayment (${monthName})` 
            : isNegative 
              ? `Balance Carried Forward - Advance (${monthName})`
              : `Balance Carried Forward - Credit (${monthName})`,
          createdBy: userRole, // Track which admin created this
          createdAt: new Date().toISOString(),
        };
        await saveTransactionToSupabase(balanceTransaction);
      }
      
      showToast('✓ Salary payment saved successfully');
      
      // Wait a moment for database to update
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Reload all data
      await loadTransactions();
      const transactions = await getUserTransactionsFromSupabase(selectedUserForHistory.id);
      setUserTransactionsData(transactions);
      const monthlyTotal = getMonthlyTotal(transactions);
      setUserMonthlyTotal(monthlyTotal);
      
      // Reset fields
      setTotalSalary('');
      setPayingNow('');
    } catch (error) {
      console.error('Error saving salary payment:', error);
      showToast('⚠️ Error saving salary payment');
    }
  };

  const openSalaryPayments = async () => {
    setLoadingSalaryPayments(true);
    try {
      const payments = await getSalaryPaymentsFromSupabase();
      setSalaryPayments(payments);
    } catch (error) {
      console.error('Error loading salary payments:', error);
      setSalaryPayments([]);
    } finally {
      setLoadingSalaryPayments(false);
    }
    setView(VIEWS.SALARY_PAYMENTS);
  };

  const handleDeleteSalaryPayment = async (paymentId) => {
    if (!isAdmin()) {
      showToast('⚠️ Only admins can delete payments');
      return;
    }
    
    // Find the payment to delete
    const payment = salaryPayments.find(p => p.id === paymentId);
    if (!payment) {
      showToast('⚠️ Payment not found');
      return;
    }
    
    // Show delete reason modal
    setTransactionToDelete({ ...payment, type: 'salary_payment' });
    setDeleteReasonText('');
    setShowDeleteReasonModal(true);
  };

  const handleDeleteTransaction = async (transactionId) => {
    if (!isAdmin()) {
      showToast('⚠️ Only admins can delete transactions');
      return;
    }
    
    // Find the transaction to delete
    const transaction = userTransactionsData.find(t => t.id === transactionId);
    if (!transaction) {
      showToast('⚠️ Transaction not found');
      return;
    }
    
    // Show delete reason modal
    setTransactionToDelete(transaction);
    setDeleteReasonText('');
    setShowDeleteReasonModal(true);
  };

  const confirmDeleteTransaction = async () => {
    if (!deleteReasonText.trim()) {
      showToast('⚠️ Please provide a reason for deletion');
      return;
    }

    if (!transactionToDelete) return;

    try {
      // Check if it's a salary payment or regular transaction
      const isSalaryPayment = transactionToDelete.type === 'salary_payment';
      
      if (isSalaryPayment) {
        // Handle salary payment deletion
        const deletedTransaction = {
          id: Date.now(),
          userId: transactionToDelete.userId,
          userName: transactionToDelete.userName,
          userPhone: transactionToDelete.userPhone,
          amount: transactionToDelete.paidToEmployee, // Use paidToEmployee as the amount
          purpose: `Salary Payment - ${transactionToDelete.month}`,
          deletedReason: deleteReasonText.trim(),
          deletedBy: userRole,
          originalCreatedAt: transactionToDelete.createdAt,
          deletedAt: new Date().toISOString(),
        };
        
        console.log('Saving deleted salary payment:', deletedTransaction);
        await saveDeletedTransactionToSupabase(deletedTransaction);
        
        console.log('Deleting from salary_payments table:', transactionToDelete.id);
        await deleteSalaryPaymentFromSupabase(transactionToDelete.id);
        
        showToast('✓ Salary payment deleted');
        
        // Reload salary payments
        const payments = await getSalaryPaymentsFromSupabase();
        setSalaryPayments(payments);
      } else {
        // Handle regular transaction deletion
        const deletedTransaction = {
          id: Date.now(),
          userId: transactionToDelete.userId,
          userName: transactionToDelete.userName,
          userPhone: transactionToDelete.userPhone,
          amount: transactionToDelete.amount,
          purpose: transactionToDelete.purpose,
          deletedReason: deleteReasonText.trim(),
          deletedBy: userRole,
          originalCreatedAt: transactionToDelete.createdAt,
          deletedAt: new Date().toISOString(),
        };
        
        console.log('Saving deleted transaction:', deletedTransaction);
        await saveDeletedTransactionToSupabase(deletedTransaction);
        
        console.log('Deleting from transactions table:', transactionToDelete.id);
        await deleteTransactionFromSupabase(transactionToDelete.id);
        
        showToast('✓ Transaction deleted');
        
        // Reload transactions
        const transactions = await getUserTransactionsFromSupabase(selectedUserForHistory.id);
        setUserTransactionsData(transactions);
        const monthlyTotal = getMonthlyTotal(transactions);
        setUserMonthlyTotal(monthlyTotal);
        await loadTransactions();
      }
      
      // Close modal
      setShowDeleteReasonModal(false);
      setTransactionToDelete(null);
      setDeleteReasonText('');
    } catch (error) {
      console.error('Error deleting:', error);
      console.error('Error details:', error.message, error.details, error.hint);
      
      // Show more specific error message
      if (error.message && error.message.includes('relation') && error.message.includes('deleted_transactions')) {
        showToast('⚠️ Database table not set up. Please run SQL schema.');
        console.error('Please run the SQL schema from supabase-schema.sql in your Supabase dashboard.');
      } else if (error.message) {
        showToast(`⚠️ Error: ${error.message.substring(0, 50)}`);
      } else {
        showToast('⚠️ Error deleting');
      }
    }
  };

  const toggleDateExpansion = (date) => {
    setExpandedDates(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const toggleSalaryMonthExpansion = (month) => {
    setExpandedSalaryMonths(prev => ({
      ...prev,
      [month]: !prev[month]
    }));
  };

  const handleSaveUser = async () => {
    if (!userName.trim() || !userPhone.trim()) {
      showToast('⚠️ Name and Phone are required');
      return;
    }

    const user = {
      id: Date.now(),
      name: userName.trim(),
      phone: userPhone.trim(),
      referral: userReferral.trim() || null,
      createdAt: new Date().toISOString(),
    };

    try {
      await saveUserToSupabase(user);
      await loadUsers(); // Reload users list
      showToast('✓ User created successfully');
      setView(VIEWS.HOME);
    } catch (error) {
      console.error('Error saving user:', error);
      
      // Show more specific error message
      if (error.message && error.message.includes('relation')) {
        showToast('⚠️ Database tables not set up. Check console.');
        console.error('Please run the SQL schema in Supabase dashboard. See SUPABASE_SETUP.md');
      } else if (error.message) {
        showToast(`⚠️ Error: ${error.message.substring(0, 50)}`);
      } else {
        showToast('⚠️ Error saving user. Check console.');
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('⚠️ Image size should be less than 5MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadUserPDF = () => {
    generateUserTransactionsPDF(
      selectedUserForHistory,
      userTransactionsData,
      userMonthlyTotal,
      formatIndianCurrency
    );
    showToast('✓ PDF downloaded');
  };

  const handleShareUserWhatsApp = () => {
    const message = formatUserTransactionsForWhatsApp(
      selectedUserForHistory,
      userTransactionsData,
      userMonthlyTotal,
      formatIndianCurrency
    );
    shareViaWhatsApp(message);
  };

  const handleDownloadDailyPDF = (date, transactions, total) => {
    generateDailyTransactionsPDF(date, transactions, total, formatIndianCurrency);
    showToast('✓ PDF downloaded');
  };

  const handleShareDailyWhatsApp = (date, transactions, total) => {
    const message = formatDailyTransactionsForWhatsApp(date, transactions, total, formatIndianCurrency);
    shareViaWhatsApp(message);
  };

  const handleDownloadMonthlySummaryPDF = (monthYear, dailySummaries, monthlyTotal) => {
    generateMonthlySummaryPDF(monthYear, dailySummaries, monthlyTotal, formatIndianCurrency);
    showToast('✓ Monthly summary PDF downloaded');
  };

  const handleShareMonthlySummaryWhatsApp = (monthYear, dailySummaries, monthlyTotal) => {
    const message = formatMonthlySummaryForWhatsApp(monthYear, dailySummaries, monthlyTotal, formatIndianCurrency);
    shareViaWhatsApp(message);
  };

  const continueToCategories = () => {
    setView(VIEWS.CATEGORIES);
  };

  const openCategory = (categoryId) => {
    setCurrentCategory(categoryId);
    setSearchQuery('');
    setSizeFilter(null);
    setView(VIEWS.ITEMS);
  };

  const updateQuantity = (materialId, delta) => {
    setSelectedItems(prev => {
      const current = prev[materialId]?.quantity || 0;
      const newQty = Math.max(0, current + delta);
      
      if (newQty === 0) {
        const { [materialId]: _, ...rest } = prev;
        return rest;
      }
      
      const material = getMaterialById(materialId);
      const existingUnit = prev[materialId]?.unit || material.unit;
      
      return {
        ...prev,
        [materialId]: {
          id: materialId,
          name: material.name,
          nameKannada: material.nameKannada,
          unit: existingUnit,
          unitType: material.unitType,
          quantity: newQty,
          category: material.category,
        }
      };
    });
  };

  const setQuantityDirect = (materialId, qty) => {
    setSelectedItems(prev => {
      if (qty <= 0) {
        const { [materialId]: _, ...rest } = prev;
        return rest;
      }
      
      const material = getMaterialById(materialId);
      // Handle custom items (no material in database)
      if (!material) {
        return {
          ...prev,
          [materialId]: {
            ...prev[materialId],
            quantity: qty,
          }
        };
      }
      const existingUnit = prev[materialId]?.unit || material.unit;
      
      return {
        ...prev,
        [materialId]: {
          id: materialId,
          name: material.name,
          nameKannada: material.nameKannada,
          unit: existingUnit,
          unitType: material.unitType,
          quantity: qty,
          category: material.category,
        }
      };
    });
  };

  // Add a custom item
  const addCustomItem = () => {
    const name = customItemName.trim();
    const qty = parseInt(customItemQty, 10) || 1;
    if (!name) return;
    
    const id = 'custom_' + Date.now();
    setSelectedItems(prev => ({
      ...prev,
      [id]: {
        id,
        name,
        nameKannada: '',
        unit: 'Nos',
        unitType: 'default',
        quantity: qty,
        category: currentCategory || 'other',
        isCustom: true,
      }
    }));
    setCustomItemName('');
    setCustomItemQty('');
    setShowCustomItemModal(false);
    showToast('✓ Custom item added');
  };

  // Remove item from review
  const removeItem = (materialId) => {
    setSelectedItems(prev => {
      const { [materialId]: _, ...rest } = prev;
      return rest;
    });
    showToast('✓ Item removed');
  };

  const updateUnit = (materialId, newUnit) => {
    setSelectedItems(prev => {
      if (!prev[materialId]) return prev;
      return {
        ...prev,
        [materialId]: {
          ...prev[materialId],
          unit: newUnit,
        }
      };
    });
  };

  const getSelectedCount = () => Object.keys(selectedItems).length;
  
  const getCategoryItemCount = (categoryId) => {
    const categoryMaterials = getMaterialsByCategory(categoryId);
    return categoryMaterials.filter(m => selectedItems[m.id]).length;
  };

  const handleShare = () => {
    const items = Object.values(selectedItems);
    const text = formatListForSharing(items, siteName, projectDate);
    shareViaWhatsApp(text);
  };

  const handleCopy = async () => {
    const items = Object.values(selectedItems);
    const text = formatListForSharing(items, siteName, projectDate);
    const success = await copyToClipboard(text);
    if (success) {
      showToast('✓ Copied to clipboard');
    }
  };

  const handleDownloadPDF = () => {
    const items = Object.values(selectedItems);
    generatePDF(items, siteName, projectDate);
    showToast('✓ PDF downloaded');
  };

  const handleSaveList = () => {
    const items = Object.values(selectedItems);
    if (items.length === 0) return;
    
    const list = {
      siteName: siteName || 'Untitled Site',
      projectDate,
      items,
    };
    
    saveList(list);
    setSavedLists(getSavedLists());
    showToast('✓ List saved');
    setView(VIEWS.HOME);
    setSelectedItems({});
    setSiteName('');
  };

  const handleDuplicateList = (list) => {
    const itemsMap = {};
    list.items.forEach(item => {
      itemsMap[item.id] = item;
    });
    setSelectedItems(itemsMap);
    setSiteName(list.siteName + ' (Copy)');
    setProjectDate(getTodayFormatted());
    setView(VIEWS.CATEGORIES);
  };

  const handleDeleteList = (listId) => {
    setDeleteConfirmId(listId);
  };

  const confirmDelete = () => {
    if (deleteConfirmId) {
      deleteList(deleteConfirmId);
      setSavedLists(getSavedLists());
      showToast('✓ Deleted');
      setDeleteConfirmId(null);
    }
  };

  const goBack = () => {
    if (view === VIEWS.ITEMS) {
      setView(VIEWS.CATEGORIES);
    } else if (view === VIEWS.CATEGORIES) {
      setView(VIEWS.PROJECT);
    } else if (view === VIEWS.PROJECT || view === VIEWS.HISTORY || view === VIEWS.CREATE_USER || view === VIEWS.GIVE_MONEY || view === VIEWS.USER_TOTAL || view === VIEWS.SALARY_PAYMENTS || view === VIEWS.DELETED_TRANSACTIONS) {
      setView(VIEWS.HOME);
    } else if (view === VIEWS.USER_HISTORY) {
      // If logged in as user, logout instead of going back
      if (userRole === 'user') {
        handleLogout();
      } else {
        setView(VIEWS.USER_TOTAL);
      }
    } else if (view === VIEWS.REVIEW) {
      setView(VIEWS.CATEGORIES);
    }
  };

  // Generate date options: today first, then future 7 days, then past 7 days
  const getDateOptions = () => {
    const dates = [];
    const formatDay = (offset) => {
      const d = new Date();
      d.setDate(d.getDate() + offset);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return { label: `${day}-${month}-${year}`, offset };
    };
    // Today
    dates.push(formatDay(0));
    // Future 1–7 days
    for (let i = 1; i <= 7; i++) dates.push(formatDay(i));
    // Past 1–7 days
    for (let i = 1; i <= 7; i++) dates.push(formatDay(-i));
    return dates;
  };

  // ===== NEW: Number pad helpers =====
  const openNumpad = (materialId) => {
    const currentQty = selectedItems[materialId]?.quantity || 0;
    setNumpadMaterial(materialId);
    setNumpadValue(currentQty > 0 ? String(currentQty) : '');
  };

  const handleNumpadPress = (key) => {
    if (key === 'backspace') {
      setNumpadValue(prev => prev.slice(0, -1));
    } else if (key === 'clear') {
      setNumpadValue('');
    } else {
      // Prevent unreasonably large numbers
      if (numpadValue.length < 4) {
        setNumpadValue(prev => prev + key);
      }
    }
  };

  const handleNumpadDone = () => {
    const qty = parseInt(numpadValue, 10) || 0;
    if (numpadMaterial) {
      setQuantityDirect(numpadMaterial, qty);
    }
    setNumpadMaterial(null);
    setNumpadValue('');
  };

  // ===== NEW: Voice input (mic) =====
  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast('Voice input not supported on this browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // English (India)
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSiteName(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      showToast('Could not recognize voice');
      setIsListening(false);
    };

    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // ===== NEW: Get filtered materials for items view =====
  const getFilteredMaterials = () => {
    let items = getMaterialsByCategory(currentCategory);
    
    // Apply search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.nameKannada.includes(q) || 
        (m.size && m.size.toLowerCase().includes(q))
      );
    }
    
    // Apply size filter
    if (sizeFilter) {
      items = items.filter(m => m.size === sizeFilter);
    }
    
    return items;
  };

  // Get unique sizes for filter chips
  const getUniqueSizes = () => {
    const items = getMaterialsByCategory(currentCategory);
    const sizes = items.map(m => m.size).filter(Boolean);
    return [...new Set(sizes)];
  };

  // Group items by subGroup (for fittings)
  const groupBySubGroup = (items) => {
    const groups = {};
    items.forEach(item => {
      const group = item.subGroup || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(item);
    });
    return groups;
  };

  // Render a single material item card
  const renderItemCard = (material) => {
    const qty = selectedItems[material.id]?.quantity || 0;
    const currentUnit = selectedItems[material.id]?.unit || material.unit;
    const unitOpts = getUnitOptions(material.unitType);
    
    return (
      <div key={material.id} className={`item-card ${qty > 0 ? 'selected' : ''}`}>
        <div className="item-info">
          <div className="item-name">{material.name}</div>
          <div className="item-name-kannada">{material.nameKannada}</div>
          <div className="item-meta">
            {material.size && <span className="item-tag">{material.size}</span>}
          </div>
        </div>
        
        {/* Unit Toggle (if available) */}
        {unitOpts && qty > 0 && (
          <div className="unit-toggle">
            {unitOpts.map(unit => (
              <button
                key={unit}
                className={`unit-btn ${currentUnit === unit ? 'active' : ''}`}
                onClick={() => updateUnit(material.id, unit)}
              >
                {unit}
              </button>
            ))}
          </div>
        )}
        
        <div className="item-controls">
          <button 
            className="qty-btn minus" 
            onClick={() => updateQuantity(material.id, -1)}
            disabled={qty === 0}
          >
            −
          </button>
          <div 
            className="qty-display tappable"
            onClick={() => openNumpad(material.id)}
          >
            {qty}
            <span className="qty-unit">{currentUnit}</span>
          </div>
          <button 
            className="qty-btn plus"
            onClick={() => updateQuantity(material.id, 1)}
          >
            +
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Header */}
      {view !== VIEWS.HOME && view !== VIEWS.LOGIN && (
        <header className="header">
          <div className="header-content">
            <button className="back-btn" onClick={goBack} aria-label="Go back">
              ←
            </button>
            <div className="header-center">
              <img src="/logo.png" alt="BMS Diesel Systems" className="header-logo" />
              <div className="header-text">
                <h1>
                  {view === VIEWS.PROJECT && 'New Project'}
                  {view === VIEWS.CREATE_USER && 'Create User'}
                  {view === VIEWS.GIVE_MONEY && 'Give Money'}
                  {view === VIEWS.USER_TOTAL && 'User Total'}
                  {view === VIEWS.USER_HISTORY && 'User History'}
                  {view === VIEWS.SALARY_PAYMENTS && 'Salary Payments'}
                  {view === VIEWS.DELETED_TRANSACTIONS && 'Deleted Transactions'}
                  {view === VIEWS.CATEGORIES && 'Select Category'}
                  {view === VIEWS.ITEMS && categories.find(c => c.id === currentCategory)?.name}
                  {view === VIEWS.REVIEW && 'Review List'}
                  {view === VIEWS.HISTORY && 'History'}
                </h1>
                {view === VIEWS.USER_HISTORY && selectedUserForHistory && (
                  <p className="header-subtitle">{selectedUserForHistory.name}</p>
                )}
              </div>
            </div>
            <div className="header-spacer"></div>
          </div>
        </header>
      )}

      <main className="main-content">
        {/* Login Screen */}
        {view === VIEWS.LOGIN && (
          <div className="login-screen">
            <div className="login-container">
              <div className="login-logo">
                <img src="/bmscash.png" alt="BMS CASH" className="login-logo-image" />
              </div>
              
              <div className="login-form">
                <div className="project-section">
                  <label className="project-label">
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    className="project-input"
                    placeholder="Enter username"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && document.getElementById('password-input').focus()}
                    autoFocus
                  />
                </div>

                <div className="project-section">
                  <label className="project-label">
                    <span>Password</span>
                  </label>
                  <input
                    id="password-input"
                    type="password"
                    className="project-input"
                    placeholder="Enter password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>

                <button 
                  className="btn btn-success project-continue" 
                  onClick={handleLogin}
                  disabled={!loginUsername.trim() || !loginPassword.trim() || otpSending}
                >
                  {otpSending ? 'Sending OTP...' : 'Login →'}
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => setView(VIEWS.FORGOT_PASSWORD)}
                  style={{ marginTop: '10px' }}
                >
                  Forgot Password?
                </button>

                <div className="login-info">
                  <p className="login-info-text">
                    <strong>For Viewers:</strong> Username: Your Name, Password: Your Phone Number
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTP Verification Screen */}
        {view === VIEWS.OTP_VERIFY && (
          <div className="login-screen">
            <header className="app-header">
              <div className="header-content">
                <img src="/logo.png" alt="BMS Logo" className="header-logo" />
                <h1 className="header-title">BMS Cash Entry</h1>
              </div>
            </header>
            <div className="login-container">
              <div className="login-form">
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                  Enter the 6-digit code sent to your email
                </p>

                <div className="project-section">
                  <label className="project-label">
                    <span>OTP Code</span>
                  </label>
                  <input
                    type="text"
                    className="project-input"
                    placeholder="Enter 6-digit OTP"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                    maxLength={6}
                    autoFocus
                    style={{ textAlign: 'center', fontSize: '24px', letterSpacing: '5px' }}
                  />
                </div>

                <button 
                  className="btn btn-success project-continue" 
                  onClick={handleVerifyOTP}
                  disabled={otpCode.length !== 6 || otpVerifying}
                >
                  {otpVerifying ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={handleResendOTP}
                  disabled={otpSending}
                  style={{ marginTop: '10px' }}
                >
                  {otpSending ? 'Sending...' : 'Resend OTP'}
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setView(VIEWS.LOGIN);
                    setOtpCode('');
                    setPendingAdminUsername(null);
                  }}
                  style={{ marginTop: '10px' }}
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forgot Password Screen */}
        {view === VIEWS.FORGOT_PASSWORD && (
          <div className="login-screen">
            <div className="login-container">
              <div className="login-form">
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                  Enter your username to receive a password reset link
                </p>

                <div className="project-section">
                  <label className="project-label">
                    <span>Username</span>
                  </label>
                  <input
                    type="text"
                    className="project-input"
                    placeholder="Enter your username"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleForgotPassword()}
                    autoFocus
                  />
                </div>

                <button 
                  className="btn btn-success project-continue" 
                  onClick={handleForgotPassword}
                  disabled={!forgotPasswordEmail.trim() || passwordResetLoading}
                >
                  {passwordResetLoading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setView(VIEWS.LOGIN);
                    setForgotPasswordEmail('');
                  }}
                  style={{ marginTop: '10px' }}
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reset Password Screen */}
        {view === VIEWS.RESET_PASSWORD && (
          <div className="login-screen">
            <header className="app-header">
              <div className="header-content">
                <img src="/logo.png" alt="BMS Logo" className="header-logo" />
                <h1 className="header-title">Reset Password</h1>
              </div>
            </header>
            <div className="login-container">
              <div className="login-form">
                <p style={{ textAlign: 'center', marginBottom: '20px', color: '#666' }}>
                  Enter your new password
                </p>

                <div className="project-section">
                  <label className="project-label">
                    <span>New Password</span>
                  </label>
                  <input
                    type="password"
                    className="project-input"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoFocus
                  />
                </div>

                <div className="project-section">
                  <label className="project-label">
                    <span>Confirm Password</span>
                  </label>
                  <input
                    type="password"
                    className="project-input"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                  />
                </div>

                <button 
                  className="btn btn-success project-continue" 
                  onClick={handleResetPassword}
                  disabled={!newPassword.trim() || !confirmPassword.trim() || passwordResetLoading}
                >
                  {passwordResetLoading ? 'Resetting...' : 'Reset Password'}
                </button>

                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setView(VIEWS.LOGIN);
                    setNewPassword('');
                    setConfirmPassword('');
                    setResetToken('');
                  }}
                  style={{ marginTop: '10px' }}
                >
                  ← Back to Login
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Home Screen */}
        {view === VIEWS.HOME && (
          <div className="home-screen">
            <div className="home-hero">
              <div className="home-hero-icon">
                <img src="/logo.png" alt="BMS Diesel Systems" className="company-logo" />
              </div>
            </div>
            
            <div className="home-content">
              <img src="/others.png" alt="Others" className="others-image" />
            </div>
            
            <div className="home-actions">
              <button 
                className="btn btn-primary" 
                onClick={startCreateUser}
                disabled={!isAdmin()}
                style={{ opacity: isAdmin() ? 1 : 0.5 }}
              >
                <span className="btn-icon">👤</span>
                <span className="btn-content">
                  <span>Create a User</span>
                  <span className="btn-kannada">ಬಳಕೆದಾರರನ್ನು ರಚಿಸಿ</span>
                </span>
                {!isAdmin() && <span className="btn-lock">🔒</span>}
              </button>
              
              <button 
                className="btn btn-success" 
                onClick={startGiveMoney}
                disabled={!isAdmin()}
                style={{ opacity: isAdmin() ? 1 : 0.5 }}
              >
                <span className="btn-icon">💰</span>
                <span className="btn-content">
                  <span>Give Money</span>
                  <span className="btn-kannada">ಹಣ ನೀಡಿ</span>
                </span>
                {!isAdmin() && <span className="btn-lock">🔒</span>}
              </button>
              
              <button className="btn btn-accent" onClick={startUserTotal}>
                <span className="btn-icon">📊</span>
                <span className="btn-content">
                  <span>User Total</span>
                  <span className="btn-kannada">ಬಳಕೆದಾರರ ಒಟ್ಟು</span>
                </span>
              </button>
              
              <button className="btn btn-lilac" onClick={openSalaryPayments}>
                <span className="btn-icon">💵</span>
                <span className="btn-content">
                  <span>Salary Payments</span>
                  <span className="btn-kannada">ಸಂಬಳ ಪಾವತಿಗಳು</span>
                </span>
              </button>
              
              <button className="btn btn-grey" onClick={openHistory}>
                <span className="btn-icon">📋</span>
                <span className="btn-content">
                  <span>History</span>
                  <span className="btn-kannada">ಇತಿಹಾಸ</span>
                </span>
              </button>
              
              <button className="btn btn-danger" onClick={openDeletedTransactions}>
                <span className="btn-icon">🗑️</span>
                <span className="btn-content">
                  <span>Deleted Transactions</span>
                  <span className="btn-kannada">ಅಳಿಸಿದ ವಹಿವಾಟುಗಳು</span>
                </span>
              </button>
            </div>
            
            {/* Logout Button at Bottom */}
            <div className="logout-container">
              <button className="btn-logout-bottom" onClick={handleLogout}>
                <span className="logout-icon">🚪</span>
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Create User Screen */}
        {view === VIEWS.CREATE_USER && (
          <div className="project-screen">
            <div className="project-section">
              <label className="project-label">
                <span>Name</span>
                <span className="project-label-kannada">ಹೆಸರು</span>
                <span className="required-mark">*</span>
              </label>
              <input
                type="text"
                className="project-input"
                placeholder="Enter full name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="project-section">
              <label className="project-label">
                <span>Phone Number</span>
                <span className="project-label-kannada">ಫೋನ್ ಸಂಖ್ಯೆ</span>
                <span className="required-mark">*</span>
              </label>
              <input
                type="tel"
                className="project-input"
                placeholder="Enter phone number"
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                maxLength="10"
              />
            </div>

            <div className="project-section">
              <label className="project-label">
                <span>Referral (Optional)</span>
                <span className="project-label-kannada">ಉಲ್ಲೇಖ</span>
              </label>
              <input
                type="text"
                className="project-input"
                placeholder="Enter referral code or name"
                value={userReferral}
                onChange={(e) => setUserReferral(e.target.value)}
              />
            </div>

            <button 
              className="btn btn-success project-continue" 
              onClick={handleSaveUser}
              disabled={!userName.trim() || !userPhone.trim()}
            >
              Save User →
              <span className="btn-kannada">ಉಳಿಸಿ</span>
            </button>
          </div>
        )}

        {/* Give Money Screen */}
        {view === VIEWS.GIVE_MONEY && (
          <div className="project-screen">
            {/* User Selection */}
            <div className="project-section">
              <label className="project-label">
                <span>Select User</span>
                <span className="project-label-kannada">ಬಳಕೆದಾರರನ್ನು ಆಯ್ಕೆಮಾಡಿ</span>
                <span className="required-mark">*</span>
              </label>
              <div className="user-search-container">
                <input
                  type="text"
                  className="project-input"
                  placeholder="Type user name or phone..."
                  value={userSearchQuery}
                  onChange={(e) => {
                    setUserSearchQuery(e.target.value);
                    setShowUserDropdown(true);
                    if (!e.target.value.trim()) {
                      setSelectedUser(null);
                    }
                  }}
                  onFocus={() => setShowUserDropdown(true)}
                  autoFocus
                />
                
                {showUserDropdown && (
                  <div className="user-dropdown">
                    {getFilteredUsers().length > 0 ? (
                      getFilteredUsers().map(user => (
                        <div
                          key={user.id}
                          className="user-dropdown-item"
                          onClick={() => selectUser(user)}
                        >
                          <div className="user-dropdown-name">{user.name}</div>
                          <div className="user-dropdown-phone">{user.phone}</div>
                        </div>
                      ))
                    ) : (
                      <div className="user-dropdown-empty">
                        <p>No users found</p>
                        <button 
                          className="btn-link"
                          onClick={() => {
                            setView(VIEWS.CREATE_USER);
                          }}
                        >
                          Create a new user →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Amount Input */}
            <div className="project-section">
              <label className="project-label">
                <span>Amount (₹)</span>
                <span className="project-label-kannada">ಮೊತ್ತ</span>
                <span className="required-mark">*</span>
              </label>
              <input
                type="number"
                className="project-input"
                placeholder="Enter amount"
                value={moneyAmount}
                onChange={(e) => setMoneyAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>

            {/* Purpose Dropdown */}
            <div className="project-section">
              <label className="project-label">
                <span>Purpose</span>
                <span className="project-label-kannada">ಉದ್ದೇಶ</span>
                <span className="required-mark">*</span>
              </label>
              <select
                className="project-input project-select"
                value={moneyPurpose}
                onChange={(e) => {
                  setMoneyPurpose(e.target.value);
                  if (e.target.value !== 'others') {
                    setCustomPurpose('');
                  }
                }}
              >
                <option value="">Select purpose...</option>
                <option value="fuel">Fuel</option>
                <option value="food">Food</option>
                <option value="advance">Advance</option>
                <option value="others">Others</option>
              </select>
            </div>

            {/* Custom Purpose Input (shown when "Others" is selected) */}
            {moneyPurpose === 'others' && (
              <div className="project-section">
                <label className="project-label">
                  <span>Specify Purpose</span>
                  <span className="project-label-kannada">ಉದ್ದೇಶವನ್ನು ನಮೂದಿಸಿ</span>
                  <span className="required-mark">*</span>
                </label>
                <input
                  type="text"
                  className="project-input"
                  placeholder="Enter purpose"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                />
              </div>
            )}

            <button 
              className="btn btn-success project-continue" 
              onClick={handleSaveTransaction}
              disabled={
                !selectedUser || 
                !moneyAmount.trim() || 
                parseFloat(moneyAmount) <= 0 || 
                !moneyPurpose ||
                (moneyPurpose === 'others' && !customPurpose.trim())
              }
            >
              Save Transaction →
              <span className="btn-kannada">ಉಳಿಸಿ</span>
            </button>
          </div>
        )}

        {/* User Total Screen - Select User */}
        {view === VIEWS.USER_TOTAL && (
          <div className="project-screen">
            <div className="project-section">
              <label className="project-label">
                <span>Select User</span>
                <span className="project-label-kannada">ಬಳಕೆದಾರರನ್ನು ಆಯ್ಕೆಮಾಡಿ</span>
              </label>
              <div className="user-search-container">
                <input
                  type="text"
                  className="project-input"
                  placeholder="Type user name or phone..."
                  value={userHistorySearchQuery}
                  onChange={(e) => {
                    setUserHistorySearchQuery(e.target.value);
                    setShowUserHistoryDropdown(true);
                  }}
                  onFocus={() => setShowUserHistoryDropdown(true)}
                  autoFocus
                />
                
                {showUserHistoryDropdown && (
                  <div className="user-dropdown">
                    {allUsers.length === 0 ? (
                      <div className="user-dropdown-empty">
                        <p>Loading users...</p>
                      </div>
                    ) : getFilteredUsersForHistory().length > 0 ? (
                      getFilteredUsersForHistory().map(user => (
                        <div
                          key={user.id}
                          className="user-dropdown-item"
                          onClick={() => selectUserForHistory(user)}
                        >
                          <div className="user-dropdown-name">{user.name}</div>
                          <div className="user-dropdown-phone">{user.phone}</div>
                        </div>
                      ))
                    ) : (
                      <div className="user-dropdown-empty">
                        <p>No users found</p>
                        <button 
                          className="btn-link"
                          onClick={() => {
                            setView(VIEWS.CREATE_USER);
                          }}
                        >
                          Create a new user →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User History Screen */}
        {view === VIEWS.USER_HISTORY && selectedUserForHistory && (
          <div className="user-history-screen">
            {(() => {
              const userTransactions = userTransactionsData;
              const monthlyTotal = userMonthlyTotal;
              const now = new Date();
              const monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
              
              if (userTransactions.length === 0) {
                return (
                  <div className="empty-state">
                    <div className="empty-icon">💰</div>
                    <p>No transactions for this user</p>
                    <p>ಈ ಬಳಕೆದಾರರಿಗೆ ಯಾವುದೇ ವಹಿವಾಟುಗಳಿಲ್ಲ</p>
                  </div>
                );
              }
              
              // Sort by date (newest first)
              const allTransactions = [...userTransactions].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
              );
              
              // Filter transactions by purpose
              const sortedTransactions = transactionFilter === 'all' 
                ? allTransactions
                : allTransactions.filter(t => {
                    const purpose = t.purpose.toLowerCase();
                    if (transactionFilter === 'food') return purpose.includes('food');
                    if (transactionFilter === 'fuel') return purpose.includes('fuel');
                    if (transactionFilter === 'advance') return purpose.includes('advance');
                    if (transactionFilter === 'others') {
                      return !purpose.includes('food') && 
                             !purpose.includes('fuel') && 
                             !purpose.includes('advance');
                    }
                    return true;
                  });
              
              return (
                <>
                  <div className="user-info-card">
                    <div className="user-info-header">
                      <div className="user-info-icon">
                        {selectedUserForHistory.image ? (
                          <img src={selectedUserForHistory.image} alt={selectedUserForHistory.name} className="user-info-photo" />
                        ) : (
                          '👤'
                        )}
                      </div>
                      <div>
                        <div className="user-info-name">{selectedUserForHistory.name}</div>
                        <div className="user-info-phone">{selectedUserForHistory.phone}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Transaction Filter Dropdown */}
                  <div className="filter-section">
                    <label className="filter-label">
                      <span className="filter-icon">🔍</span>
                      Filter by Purpose:
                    </label>
                    <select 
                      className="filter-dropdown"
                      value={transactionFilter}
                      onChange={(e) => setTransactionFilter(e.target.value)}
                    >
                      <option value="all">All Transactions</option>
                      <option value="food">Food</option>
                      <option value="fuel">Fuel</option>
                      <option value="advance">Advance</option>
                      <option value="others">Others</option>
                    </select>
                  </div>
                  
                  {sortedTransactions.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🔍</div>
                      <p>No transactions found for "{transactionFilter}"</p>
                    </div>
                  ) : (
                    <div className="transactions-list">
                      {sortedTransactions.map(transaction => (
                      <div key={transaction.id} className="history-card transaction-card">
                        <div className="transaction-header">
                          <div className="transaction-info">
                            <div className="transaction-purpose-main">{transaction.purpose}</div>
                            <div className="transaction-date">
                              {new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                              {transaction.createdBy && (
                                <span className="transaction-admin"> • by {transaction.createdBy}</span>
                              )}
                            </div>
                          </div>
                          <div className="transaction-amount-container">
                            <div className={`transaction-amount ${transaction.amount < 0 ? 'negative' : ''}`}>
                              {transaction.amount < 0 ? '-' : ''}{formatIndianCurrency(Math.abs(transaction.amount))}
                            </div>
                            {isAdmin() && (
                              <button 
                                className="delete-btn-small"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                title="Delete transaction"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  )}
                  
                  <div className="monthly-total-card">
                    <div className="monthly-total-header">
                      <span className="monthly-total-icon">📅</span>
                      <span className="monthly-total-month">{monthName}</span>
                    </div>
                    <div className="monthly-total-amount">
                      <span className="monthly-total-label">Total Amount Given:</span>
                      <span className="monthly-total-value">{formatIndianCurrency(monthlyTotal)}</span>
                    </div>
                  </div>
                  
                  {/* Download and Share Buttons */}
                  <div className="transaction-actions">
                    <button className="share-btn whatsapp" onClick={handleShareUserWhatsApp}>
                      📱 WhatsApp
                    </button>
                    <button className="share-btn pdf" onClick={handleDownloadUserPDF}>
                      📄 Download PDF
                    </button>
                  </div>
                  
                  <div className="salary-calculator-card">
                    <div className="calculator-header">
                      <span className="calculator-icon">🧮</span>
                      <span className="calculator-title">Salary & Balance Calculator</span>
                    </div>
                    
                    <div className="calculator-input-group">
                      <label className="calculator-label">Monthly Salary (₹)</label>
                      <input
                        type="number"
                        className="calculator-input"
                        placeholder="Enter monthly salary"
                        value={totalSalary}
                        onChange={(e) => setTotalSalary(e.target.value)}
                        min="0"
                        step="100"
                      />
                    </div>
                    
                    {totalSalary && parseFloat(totalSalary) > 0 && (
                      <div className="calculator-result">
                        <div className="calculator-breakdown">
                          <div className="calculator-row">
                            <span className="calculator-row-label">💰 Monthly Salary:</span>
                            <span className="calculator-row-value">{formatIndianCurrency(parseFloat(totalSalary))}</span>
                          </div>
                          <div className="calculator-row subtract">
                            <span className="calculator-row-label">
                              {monthlyTotal < 0 ? '⚠️ Employee Owes (From Last Month):' : '💸 Money Given This Month:'}
                            </span>
                            <span className="calculator-row-value">
                              {monthlyTotal < 0 ? '' : '- '}{formatIndianCurrency(Math.abs(monthlyTotal))}
                            </span>
                          </div>
                        </div>
                        
                        {(() => {
                          const salary = parseFloat(totalSalary);
                          // If monthlyTotal is negative, employee owes money, so subtract it from salary
                          // If monthlyTotal is positive, money was given, so subtract it from salary
                          const balance = monthlyTotal < 0 
                            ? salary + monthlyTotal  // monthlyTotal is already negative, so this subtracts
                            : salary - monthlyTotal;
                          const isNegative = balance < 0;
                          const absBalance = Math.abs(balance);
                          
                          return (
                            <>
                              <div className={`calculator-final ${isNegative ? 'negative' : 'positive'}`}>
                                <span className="calculator-final-label">
                                  {isNegative ? '⚠️ Employee Owes:' : '✅ Salary Remaining:'}
                                </span>
                                <span className="calculator-final-value">
                                  {formatIndianCurrency(absBalance)}
                                </span>
                              </div>
                              
                              {isNegative ? (
                                <>
                                  <div className="balance-info negative-info">
                                    <div className="info-icon">⚠️</div>
                                    <div className="info-content">
                                      <div className="info-title">Advance Taken</div>
                                      <div className="info-text">
                                        Employee has taken {formatIndianCurrency(absBalance)} more than their salary. Enter how much to pay now.
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="calculator-input-group">
                                    <label className="calculator-label">💵 Employee Paying Back Now (₹)</label>
                                    <input
                                      type="number"
                                      className="calculator-input"
                                      placeholder="Amount employee is paying back in cash"
                                      value={payingNow}
                                      onChange={(e) => setPayingNow(e.target.value)}
                                      min="0"
                                      max={absBalance}
                                      step="100"
                                    />
                                    <div className="input-helper-text">
                                      Enter how much the employee is paying back in cash. Remaining will be deducted from salary.
                                    </div>
                                  </div>
                                  
                                  {(() => {
                                    const cashPayback = parseFloat(payingNow) || 0;
                                    // Employee is paying back in cash, rest deducted from salary
                                    const remainingDebt = absBalance - cashPayback;
                                    const deductFromSalary = Math.min(remainingDebt, salary);
                                    const salaryToPay = salary - deductFromSalary;
                                    const stillOwes = remainingDebt - deductFromSalary;
                                    
                                    return (
                                      <>
                                        {cashPayback > 0 && (
                                          <div className="payment-breakdown">
                                            <div className="payment-row">
                                              <span>Total Advance Taken:</span>
                                              <span>{formatIndianCurrency(absBalance)}</span>
                                            </div>
                                            <div className="payment-row paid">
                                              <span>Employee Paying Back (Cash):</span>
                                              <span>- {formatIndianCurrency(cashPayback)}</span>
                                            </div>
                                            <div className="payment-row paid">
                                              <span>Deducting from Salary:</span>
                                              <span>- {formatIndianCurrency(deductFromSalary)}</span>
                                            </div>
                                            {stillOwes > 0 && (
                                              <div className="payment-row remaining">
                                                <span>Still Owes (Carry Forward):</span>
                                                <span>{formatIndianCurrency(stillOwes)}</span>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                        
                                        <div className="salary-after-deduction">
                                          <div className="salary-header">
                                            <span className="salary-icon">💵</span>
                                            <span className="salary-title">This Month Payment</span>
                                          </div>
                                          <div className="salary-content">
                                            <div className="salary-row">
                                              <span>Monthly Salary:</span>
                                              <span>{formatIndianCurrency(salary)}</span>
                                            </div>
                                            {deductFromSalary > 0 && (
                                              <div className="salary-row subtract">
                                                <span>Deduction (Advance Repayment):</span>
                                                <span>- {formatIndianCurrency(deductFromSalary)}</span>
                                              </div>
                                            )}
                                            <div className="salary-row total">
                                              <span>Paying to Employee:</span>
                                              <span>{formatIndianCurrency(salaryToPay)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        
                                        <div className="next-month-deduction">
                                          <div className="deduction-header">
                                            <span className="deduction-icon">📅</span>
                                            <span className="deduction-title">Next Month Calculation</span>
                                          </div>
                                          <div className="deduction-content">
                                            {stillOwes > 0 ? (
                                              <>
                                                <div className="deduction-row">
                                                  <span>Next Month Salary:</span>
                                                  <span>{formatIndianCurrency(salary)}</span>
                                                </div>
                                                <div className="deduction-row subtract">
                                                  <span>Carried Forward Balance:</span>
                                                  <span>- {formatIndianCurrency(stillOwes)}</span>
                                                </div>
                                                <div className="deduction-row total">
                                                  <span>Available Next Month:</span>
                                                  <span>{formatIndianCurrency(Math.max(0, salary - stillOwes))}</span>
                                                </div>
                                                {stillOwes > salary && (
                                                  <div className="deduction-note">
                                                    <span className="note-icon">ℹ️</span>
                                                    <span className="note-text">
                                                      Balance of {formatIndianCurrency(stillOwes - salary)} will carry forward to the following month.
                                                    </span>
                                                  </div>
                                                )}
                                              </>
                                            ) : (
                                              <div className="deduction-row">
                                                <span>Full Salary Available:</span>
                                                <span>{formatIndianCurrency(salary)}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </>
                              ) : (
                                <>
                                  <div className="balance-info positive-info">
                                    <div className="info-icon">✅</div>
                                    <div className="info-content">
                                      <div className="info-title">Salary Available</div>
                                      <div className="info-text">
                                        Employee has {formatIndianCurrency(balance)} remaining from this month's salary.
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="calculator-input-group">
                                    <label className="calculator-label">💵 Paying to Employee Now (₹)</label>
                                    <input
                                      type="number"
                                      className="calculator-input"
                                      placeholder="Enter amount to pay this month"
                                      value={payingNow}
                                      onChange={(e) => setPayingNow(e.target.value)}
                                      min="0"
                                      step="100"
                                    />
                                    <div className="input-helper-text">
                                      Enter how much to pay. If more than available, employee owes you the difference.
                                    </div>
                                  </div>
                                  
                                  {(() => {
                                    const payAmount = parseFloat(payingNow) || balance;
                                    const difference = payAmount - balance;
                                    const isOverpayment = difference > 0;
                                    
                                    return (
                                      <>
                                        <div className="salary-after-deduction">
                                          <div className="salary-header">
                                            <span className="salary-icon">💵</span>
                                            <span className="salary-title">This Month Payment</span>
                                          </div>
                                          <div className="salary-content">
                                            <div className="salary-row">
                                              <span>Salary Available:</span>
                                              <span>{formatIndianCurrency(balance)}</span>
                                            </div>
                                            <div className="salary-row total">
                                              <span>Paying to Employee:</span>
                                              <span>{formatIndianCurrency(payAmount)}</span>
                                            </div>
                                            {isOverpayment ? (
                                              <div className="salary-row negative">
                                                <span>⚠️ Overpayment (Employee Owes):</span>
                                                <span className="text-danger">{formatIndianCurrency(difference)}</span>
                                              </div>
                                            ) : difference < 0 && (
                                              <div className="salary-row remaining">
                                                <span>Carry Forward to Next Month:</span>
                                                <span>{formatIndianCurrency(Math.abs(difference))}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        
                                        <div className="next-month-deduction">
                                          <div className="deduction-header">
                                            <span className="deduction-icon">📅</span>
                                            <span className="deduction-title">Next Month Calculation</span>
                                          </div>
                                          <div className="deduction-content">
                                            {isOverpayment ? (
                                              <>
                                                <div className="deduction-row">
                                                  <span>Next Month Salary:</span>
                                                  <span>{formatIndianCurrency(salary)}</span>
                                                </div>
                                                <div className="deduction-row subtract">
                                                  <span>Employee Must Return:</span>
                                                  <span>- {formatIndianCurrency(difference)}</span>
                                                </div>
                                                <div className="deduction-row total">
                                                  <span>Available After Return:</span>
                                                  <span>{formatIndianCurrency(salary - difference)}</span>
                                                </div>
                                                <div className="deduction-note">
                                                  <span className="note-icon">⚠️</span>
                                                  <span className="note-text">
                                                    Employee owes {formatIndianCurrency(difference)} and must return it next month.
                                                  </span>
                                                </div>
                                              </>
                                            ) : difference < 0 ? (
                                              <>
                                                <div className="deduction-row">
                                                  <span>Next Month Salary:</span>
                                                  <span>{formatIndianCurrency(salary)}</span>
                                                </div>
                                                <div className="deduction-row positive">
                                                  <span>Carried Forward Balance:</span>
                                                  <span>+ {formatIndianCurrency(Math.abs(difference))}</span>
                                                </div>
                                                <div className="deduction-row total">
                                                  <span>Total Available Next Month:</span>
                                                  <span>{formatIndianCurrency(salary + Math.abs(difference))}</span>
                                                </div>
                                              </>
                                            ) : (
                                              <div className="deduction-row">
                                                <span>Full Salary Available:</span>
                                                <span>{formatIndianCurrency(salary)}</span>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </>
                                    );
                                  })()}
                                </>
                              )}
                            </>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  
                  
                  {/* Save Salary Payment Button - Shows for admins when salary is entered */}
                  {isAdmin() && totalSalary && parseFloat(totalSalary) > 0 && (
                    <div className="save-payment-container">
                      <button 
                        className="btn btn-success save-salary-btn" 
                        onClick={handleSaveSalaryPayment}
                      >
                        💾 Save Salary Payment
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Salary Payments History Screen */}
        {view === VIEWS.SALARY_PAYMENTS && (
          <div className="salary-payments-screen">
            {loadingSalaryPayments ? (
              <div className="empty-state">
                <div className="empty-icon">⏳</div>
                <p>Loading salary payments...</p>
              </div>
            ) : salaryPayments.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">💰</div>
                <p>No salary payments saved yet</p>
                <p>ಇನ್ನೂ ಯಾವುದೇ ಸಂಬಳ ಪಾವತಿಗಳಿಲ್ಲ</p>
              </div>
            ) : (
              <div className="salary-payments-list">
                {(() => {
                  // Sort payments by date (newest first)
                  const sortedPayments = [...salaryPayments].sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                  );
                  
                  // Group by month
                  const groupedByMonth = {};
                  sortedPayments.forEach(payment => {
                    const month = payment.month;
                    if (!groupedByMonth[month]) {
                      groupedByMonth[month] = {
                        payments: [],
                        total: 0
                      };
                    }
                    groupedByMonth[month].payments.push(payment);
                    groupedByMonth[month].total += payment.paidToEmployee;
                  });
                  
                  return Object.entries(groupedByMonth).map(([month, data]) => (
                    <div key={month} className="history-date-group">
                      <div 
                        className="daily-summary"
                        onClick={() => toggleSalaryMonthExpansion(month)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="daily-summary-date">
                          <span className="daily-summary-icon">📅</span>
                          {month}
                          <span className="daily-summary-count">({data.payments.length})</span>
                        </div>
                        <div className="daily-summary-right">
                          <div className="daily-summary-total">
                            <span className="daily-summary-label">Total:</span>
                            <span className="daily-summary-amount">{formatIndianCurrency(data.total)}</span>
                          </div>
                          <span className={`expand-icon ${expandedSalaryMonths[month] ? 'expanded' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </div>
                      
                      {expandedSalaryMonths[month] && (
                        <div className="transactions-container">
                          {data.payments.map(payment => (
                            <div key={payment.id} className="salary-payment-card">
                              <div className="payment-card-header">
                                <div className="payment-user-info">
                                  <div className="payment-user-icon">👤</div>
                                  <div>
                                    <div className="payment-user-name">{payment.userName}</div>
                                    <div className="payment-user-phone">{payment.userPhone}</div>
                                  </div>
                                </div>
                                {isAdmin() && (
                                  <button 
                                    className="delete-btn-small delete-btn-white"
                                    onClick={() => handleDeleteSalaryPayment(payment.id)}
                                    title="Delete payment record"
                                  >
                                    🗑️
                                  </button>
                                )}
                              </div>
                              
                              <div className="payment-card-body">
                                <div className="payment-detail-row">
                                  <span className="payment-detail-label">💰 Monthly Salary:</span>
                                  <span className="payment-detail-value">{formatIndianCurrency(payment.monthlySalary)}</span>
                                </div>
                                <div className="payment-detail-row">
                                  <span className="payment-detail-label">💸 Money Given:</span>
                                  <span className="payment-detail-value subtract">{formatIndianCurrency(payment.moneyGiven)}</span>
                                </div>
                                {payment.paidSalary && (
                                  <div className="payment-detail-row">
                                    <span className="payment-detail-label">💳 Paid Salary:</span>
                                    <span className="payment-detail-value positive">{formatIndianCurrency(payment.paidSalary)}</span>
                                  </div>
                                )}
                                {payment.deductedAmount && (
                                  <div className="payment-detail-row">
                                    <span className="payment-detail-label">📉 Deducted:</span>
                                    <span className="payment-detail-value subtract">{formatIndianCurrency(payment.deductedAmount)}</span>
                                  </div>
                                )}
                                <div className="payment-detail-row total">
                                  <span className="payment-detail-label">💵 Paid to Employee:</span>
                                  <span className="payment-detail-value">{formatIndianCurrency(payment.paidToEmployee)}</span>
                                </div>
                                {payment.remainingBalance && payment.remainingBalance > 0 && (
                                  <div className="payment-detail-row remaining">
                                    <span className="payment-detail-label">⚠️ Remaining Balance:</span>
                                    <span className="payment-detail-value">{formatIndianCurrency(payment.remainingBalance)}</span>
                                  </div>
                                )}
                              </div>
                              
                              <div className="payment-card-footer">
                                <span className="payment-date">
                                  {new Date(payment.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                  {payment.createdBy && (
                                    <span className="transaction-admin"> • by {payment.createdBy}</span>
                                  )}
                                </span>
                                {(() => {
                                  const createdDate = new Date(payment.createdAt);
                                  const now = new Date();
                                  const daysElapsed = Math.floor((now - createdDate) / (1000 * 60 * 60 * 24));
                                  const daysRemaining = 120 - daysElapsed;
                                  
                                  if (daysRemaining <= 30 && daysRemaining > 0) {
                                    return (
                                      <div className="auto-delete-warning">
                                        <span className="warning-icon">⏰</span>
                                        <span className="warning-text">Auto-deletes in {daysRemaining} days</span>
                                      </div>
                                    );
                                  }
                                  return null;
                                })()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        )}

        {/* Deleted Transactions Screen */}
        {view === VIEWS.DELETED_TRANSACTIONS && (
          <div className="deleted-transactions-screen">
            {loadingDeletedTransactions ? (
              <div className="empty-state">
                <div className="empty-icon">⏳</div>
                <p>Loading deleted transactions...</p>
              </div>
            ) : deletedTransactions.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗑️</div>
                <p>No deleted transactions</p>
                <p>ಅಳಿಸಿದ ವಹಿವಾಟುಗಳಿಲ್ಲ</p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)', marginTop: 'var(--space-md)' }}>
                  Deleted transactions are automatically removed after 30 days
                </p>
              </div>
            ) : (
              <div className="deleted-transactions-list">
                <div className="info-banner">
                  <span className="info-banner-icon">ℹ️</span>
                  <span className="info-banner-text">
                    Deleted transactions are automatically removed after 30 days
                  </span>
                </div>
                
                {deletedTransactions.map(transaction => {
                  const deletedDate = new Date(transaction.deletedAt);
                  const originalDate = new Date(transaction.originalCreatedAt);
                  const daysRemaining = 30 - Math.floor((new Date() - deletedDate) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <div key={transaction.id} className="deleted-transaction-card">
                      <div className="deleted-card-header">
                        <div className="deleted-user-info">
                          <div className="deleted-user-icon">👤</div>
                          <div>
                            <div className="deleted-user-name">{transaction.userName}</div>
                            <div className="deleted-user-phone">{transaction.userPhone}</div>
                          </div>
                        </div>
                        <div className={`transaction-amount ${transaction.amount < 0 ? 'negative' : ''}`}>
                          {transaction.amount < 0 ? '-' : ''}{formatIndianCurrency(Math.abs(transaction.amount))}
                        </div>
                      </div>
                      
                      <div className="deleted-card-body">
                        <div className="deleted-detail-row">
                          <span className="deleted-detail-label">Purpose:</span>
                          <span className="deleted-detail-value">{transaction.purpose}</span>
                        </div>
                        <div className="deleted-detail-row">
                          <span className="deleted-detail-label">Original Date:</span>
                          <span className="deleted-detail-value">
                            {originalDate.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="deleted-detail-row">
                          <span className="deleted-detail-label">Deleted Date:</span>
                          <span className="deleted-detail-value">
                            {deletedDate.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="deleted-detail-row">
                          <span className="deleted-detail-label">Deleted By:</span>
                          <span className="deleted-detail-value">{transaction.deletedBy}</span>
                        </div>
                        <div className="deleted-reason-box">
                          <div className="deleted-reason-label">Reason for Deletion:</div>
                          <div className="deleted-reason-text">{transaction.deletedReason}</div>
                        </div>
                        <div className="deleted-expiry-info">
                          <span className="expiry-icon">⏰</span>
                          <span className="expiry-text">
                            {daysRemaining > 0 
                              ? `Will be permanently deleted in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
                              : 'Will be deleted soon'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Project Screen - Site Name & Date */}
        {view === VIEWS.PROJECT && (
          <div className="project-screen">
            <div className="project-section">
              <label className="project-label">
                <span>Site Name</span>
                <span className="project-label-kannada">ಸೈಟ್ ಹೆಸರು</span>
              </label>
              
              <div className="site-input-row">
                <button 
                  className="project-input-btn"
                  onClick={() => setShowSiteSelector(true)}
                >
                  {siteName || 'Tap to select site...'}
                </button>
                <button 
                  className={`mic-btn ${isListening ? 'listening' : ''}`}
                  onClick={startVoiceInput}
                  aria-label="Voice input"
                >
                  {isListening ? '🔴' : '🎤'}
                </button>
              </div>
              
              {showSiteSelector && (
                <div className="modal-overlay" onClick={() => setShowSiteSelector(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Select Site</h3>
                      <button className="modal-close" onClick={() => setShowSiteSelector(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      {/* Show previously used site names from saved lists */}
                      {getUsedSiteNames().length > 0 && (
                        <>
                          <div className="modal-section-label">Recent Sites</div>
                          {getUsedSiteNames().map(name => (
                            <button
                              key={name}
                              className={`modal-option ${siteName === name ? 'selected' : ''}`}
                              onClick={() => {
                                setSiteName(name);
                                setShowSiteSelector(false);
                              }}
                            >
                              {name}
                            </button>
                          ))}
                        </>
                      )}
                      <button
                        className="modal-option other"
                        onClick={() => {
                          const custom = prompt('Enter site name:');
                          if (custom) {
                            setSiteName(custom);
                          }
                          setShowSiteSelector(false);
                        }}
                      >
                        ✏️ Other / Custom
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="project-section">
              <label className="project-label">
                <span>Date</span>
                <span className="project-label-kannada">ದಿನಾಂಕ</span>
              </label>
              
              <button 
                className="project-input-btn"
                onClick={() => setShowDatePicker(true)}
              >
                📅 {projectDate}
              </button>
              
              {showDatePicker && (
                <div className="modal-overlay" onClick={() => setShowDatePicker(false)}>
                  <div className="modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                      <h3>Select Date</h3>
                      <button className="modal-close" onClick={() => setShowDatePicker(false)}>✕</button>
                    </div>
                    <div className="modal-body">
                      {getDateOptions().map((dateObj) => (
                        <button
                          key={dateObj.label}
                          className={`modal-option ${projectDate === dateObj.label ? 'selected' : ''}`}
                          onClick={() => {
                            setProjectDate(dateObj.label);
                            setShowDatePicker(false);
                          }}
                        >
                          {dateObj.offset === 0 ? '📅 Today - ' : ''}{dateObj.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="btn btn-success project-continue" onClick={continueToCategories}>
              Continue to Materials →
              <span className="btn-kannada">ಮುಂದುವರಿಸು</span>
            </button>
          </div>
        )}

        {/* Category Selection */}
        {view === VIEWS.CATEGORIES && (
          <>
            {siteName && (
              <div className="project-info-bar">
                <span>📍 {siteName}</span>
                <span>📅 {projectDate}</span>
              </div>
            )}
            
            <div className="category-grid">
              {categories.map(cat => {
                const itemCount = getCategoryItemCount(cat.id);
                return (
                  <div 
                    key={cat.id} 
                    className={`category-card ${itemCount > 0 ? 'has-items' : ''}`}
                    onClick={() => openCategory(cat.id)}
                  >
                    <div className="category-icon">{cat.icon}</div>
                    <div className="category-info">
                      <div className="category-name">{cat.name}</div>
                      <div className="category-name-kannada">{cat.nameKannada}</div>
                    </div>
                    {itemCount > 0 && (
                      <span className="category-badge">{itemCount}</span>
                    )}
                    <span className="category-arrow">›</span>
                  </div>
                );
              })}
            </div>
            
            {getSelectedCount() > 0 && (
              <div className="fab-container">
                <button className="fab" onClick={() => setView(VIEWS.REVIEW)}>
                  View List
                  <span className="fab-badge">{getSelectedCount()}</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Item Selection */}
        {view === VIEWS.ITEMS && (
          <>
            {/* Search Bar */}
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button className="search-clear" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>

            {/* Size Filter Chips */}
            {getUniqueSizes().length > 1 && !searchQuery && (
              <div className="size-filters">
                <button
                  className={`size-chip ${sizeFilter === null ? 'active' : ''}`}
                  onClick={() => setSizeFilter(null)}
                >
                  All
                </button>
                {getUniqueSizes().map(size => (
                  <button
                    key={size}
                    className={`size-chip ${sizeFilter === size ? 'active' : ''}`}
                    onClick={() => setSizeFilter(sizeFilter === size ? null : size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Items List (with sub-group headers for fittings) */}
            {currentCategory === 'fittings' && !searchQuery && !sizeFilter ? (
              <div className="items-list">
                {Object.entries(groupBySubGroup(getFilteredMaterials())).map(([groupName, groupItems]) => (
                  <div key={groupName}>
                    <div className="items-subgroup-header">{groupName}</div>
                    {groupItems.map(material => renderItemCard(material))}
                  </div>
                ))}
              </div>
            ) : (
              <div className="items-list">
                {getFilteredMaterials().map(material => renderItemCard(material))}
              </div>
            )}
            
            {/* Add Custom Item Button */}
            <button 
              className="add-custom-btn"
              onClick={() => setShowCustomItemModal(true)}
            >
              ➕ Add Custom Item
            </button>

            {getSelectedCount() > 0 && (
              <div className="fab-container">
                <button className="fab" onClick={() => setView(VIEWS.REVIEW)}>
                  View List
                  <span className="fab-badge">{getSelectedCount()}</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* Review Screen */}
        {view === VIEWS.REVIEW && (
          <div className="review-screen">
            {/* Project Info */}
            {(siteName || projectDate) && (
              <div className="review-project-info">
                {siteName && <div className="review-site">📍 Site: {siteName}</div>}
                <div className="review-date">📅 Date: {projectDate}</div>
              </div>
            )}
            
            <div className="review-header">
              <h2>Material List</h2>
              <span className="review-count">{getSelectedCount()} items</span>
            </div>
            
            <div className="review-list">
              {/* Group items by category */}
              {(() => {
                const items = Object.values(selectedItems);
                const grouped = {};
                items.forEach(item => {
                  const cat = item.category || (getMaterialById(item.id) ? getMaterialById(item.id).category : 'other');
                  const catInfo = categories.find(c => c.id === cat);
                  const catName = catInfo ? `${catInfo.icon} ${catInfo.name}` : '📦 Other';
                  if (!grouped[catName]) grouped[catName] = [];
                  grouped[catName].push(item);
                });
                return Object.entries(grouped).map(([catName, catItems]) => (
                  <div key={catName} className="review-category-group">
                    <div className="review-category-header">{catName}</div>
                    {catItems.map(item => (
                      <div key={item.id} className="review-item">
                        <span className="review-item-name">{item.name}</span>
                        <span 
                          className="review-item-qty tappable"
                          onClick={() => openNumpad(item.id)}
                        >
                          {item.quantity} {item.unit}
                        </span>
                        <button 
                          className="review-item-delete"
                          onClick={() => removeItem(item.id)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                ));
              })()}
            </div>
            
            <div className="review-actions">
              <button className="share-btn whatsapp" onClick={handleShare}>
                📱 WhatsApp
              </button>
              <button className="share-btn pdf" onClick={handleDownloadPDF}>
                📄 Download PDF
              </button>
              <button className="share-btn copy" onClick={handleCopy}>
                📋 Copy Text
              </button>
              <button className="btn btn-success" onClick={handleSaveList}>
                💾 Save List
              </button>
            </div>
          </div>
        )}

        {/* History Screen */}
        {view === VIEWS.HISTORY && (
          <div className="history-list">
            {(() => {
              const transactions = allTransactions;
              
              if (transactions.length === 0) {
                return (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>No transactions yet</p>
                    <p>ಯಾವುದೇ ವಹಿವಾಟುಗಳಿಲ್ಲ</p>
                  </div>
                );
              }
              
              // Sort by date (newest first)
              const sortedTransactions = [...transactions].sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
              );
              
              // Group transactions by date and calculate daily totals
              const groupedByDate = {};
              sortedTransactions.forEach(transaction => {
                const date = new Date(transaction.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                });
                
                if (!groupedByDate[date]) {
                  groupedByDate[date] = {
                    transactions: [],
                    total: 0
                  };
                }
                
                groupedByDate[date].transactions.push(transaction);
                // Add absolute values - don't subtract negatives
                groupedByDate[date].total += Math.abs(transaction.amount);
              });
              
              // Calculate monthly summary
              const now = new Date();
              const currentMonth = now.getMonth();
              const currentYear = now.getFullYear();
              const monthYear = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
              
              const dailySummaries = [];
              let monthlyTotal = 0;
              
              Object.entries(groupedByDate).forEach(([date, data]) => {
                const transDate = new Date(data.transactions[0].createdAt);
                if (transDate.getMonth() === currentMonth && transDate.getFullYear() === currentYear) {
                  dailySummaries.push({
                    date: date,
                    total: data.total,
                    count: data.transactions.length
                  });
                  monthlyTotal += data.total;
                }
              });
              
              return (
                <>
                  {/* Monthly Summary Button */}
                  {dailySummaries.length > 0 && (
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                      <div 
                        style={{ 
                          background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%)',
                          color: 'white',
                          padding: 'var(--space-md)',
                          borderRadius: 'var(--radius-lg)',
                          marginBottom: showMonthlySummary ? 'var(--space-md)' : '0',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onClick={() => setShowMonthlySummary(!showMonthlySummary)}
                      >
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9 }}>Monthly Summary</div>
                        <div style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 700, marginTop: 'var(--space-xs)' }}>
                          {formatIndianCurrency(monthlyTotal)}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', opacity: 0.9, marginTop: 'var(--space-xs)' }}>
                          {monthYear} • {dailySummaries.length} days
                        </div>
                        <div style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-xs)', opacity: 0.8 }}>
                          {showMonthlySummary ? '▲ Hide Options' : '▼ Show Options'}
                        </div>
                      </div>
                      
                      {showMonthlySummary && (
                        <div className="transaction-actions" style={{ animation: 'slideDown 0.3s ease' }}>
                          <button 
                            className="share-btn whatsapp" 
                            onClick={() => handleShareMonthlySummaryWhatsApp(monthYear, dailySummaries, monthlyTotal)}
                          >
                            📱 Share Summary
                          </button>
                          <button 
                            className="share-btn pdf" 
                            onClick={() => handleDownloadMonthlySummaryPDF(monthYear, dailySummaries, monthlyTotal)}
                          >
                            📄 Download Summary
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Daily Transactions */}
                  {Object.entries(groupedByDate).map(([date, data]) => (
                    <div key={date} className="history-date-group">
                      <div 
                        className="daily-summary"
                        onClick={() => toggleDateExpansion(date)}
                      >
                        <div className="daily-summary-date">
                          <span className="daily-summary-icon">📅</span>
                          {date}
                          <span className="daily-summary-count">({data.transactions.length})</span>
                        </div>
                        <div className="daily-summary-right">
                          <div className="daily-summary-total">
                            <span className="daily-summary-label">Total:</span>
                            <span className="daily-summary-amount">{formatIndianCurrency(data.total)}</span>
                          </div>
                          <span className={`expand-icon ${expandedDates[date] ? 'expanded' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </div>
                      
                      {expandedDates[date] && (
                        <div className="transactions-container">
                          {data.transactions.map(transaction => (
                            <div key={transaction.id} className="history-card transaction-card">
                              <div className="transaction-header">
                                <div className="transaction-user">
                                  <div className="transaction-user-icon">👤</div>
                                  <div>
                                    <div className="transaction-user-name">{transaction.userName}</div>
                                    <div className="transaction-user-phone">{transaction.userPhone}</div>
                                  </div>
                                </div>
                                <div className={`transaction-amount ${transaction.amount < 0 ? 'negative' : ''}`}>
                                  {transaction.amount < 0 ? '-' : ''}{formatIndianCurrency(Math.abs(transaction.amount))}
                                </div>
                              </div>
                              
                              <div className="transaction-details">
                                <div className="transaction-purpose">
                                  <span className="transaction-label">Purpose:</span>
                                  <span className="transaction-value">{transaction.purpose}</span>
                                </div>
                                <div className="transaction-date">
                                  {new Date(transaction.createdAt).toLocaleTimeString('en-IN', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                  {transaction.createdBy && (
                                    <span className="transaction-admin"> • by {transaction.createdBy}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Download and Share Buttons for Daily Transactions */}
                          <div className="transaction-actions">
                            <button 
                              className="share-btn whatsapp" 
                              onClick={() => handleShareDailyWhatsApp(date, data.transactions, data.total)}
                            >
                              📱 WhatsApp
                            </button>
                            <button 
                              className="share-btn pdf" 
                              onClick={() => handleDownloadDailyPDF(date, data.transactions, data.total)}
                            >
                              📄 Download PDF
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        )}
      </main>

      {/* Number Pad Modal */}
      {numpadMaterial && (
        <div className="modal-overlay" onClick={handleNumpadDone}>
          <div className="numpad-modal" onClick={e => e.stopPropagation()}>
            <div className="numpad-header">
              <span className="numpad-title">
                {getMaterialById(numpadMaterial)?.name || selectedItems[numpadMaterial]?.name || 'Item'}
              </span>
              <button className="modal-close" onClick={handleNumpadDone}>✕</button>
            </div>
            <div className="numpad-display">
              <span className="numpad-value">{numpadValue || '0'}</span>
              <span className="numpad-unit">
                {selectedItems[numpadMaterial]?.unit || getMaterialById(numpadMaterial)?.unit || 'Nos'}
              </span>
            </div>
            <div className="numpad-grid">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                <button 
                  key={n} 
                  className="numpad-btn"
                  onClick={() => handleNumpadPress(String(n))}
                >
                  {n}
                </button>
              ))}
              <button className="numpad-btn numpad-clear" onClick={() => handleNumpadPress('clear')}>
                C
              </button>
              <button className="numpad-btn" onClick={() => handleNumpadPress('0')}>
                0
              </button>
              <button className="numpad-btn numpad-backspace" onClick={() => handleNumpadPress('backspace')}>
                ⌫
              </button>
            </div>
            <button className="numpad-done" onClick={handleNumpadDone}>
              ✓ Done
            </button>
          </div>
        </div>
      )}

      {/* Custom Item Modal */}
      {showCustomItemModal && (
        <div className="modal-overlay" onClick={() => setShowCustomItemModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Custom Item</h3>
              <button className="modal-close" onClick={() => setShowCustomItemModal(false)}>✕</button>
            </div>
            <div className="modal-body custom-item-form">
              <input
                type="text"
                className="custom-item-input"
                placeholder="Item name (e.g. Rubber Gasket)"
                value={customItemName}
                onChange={(e) => setCustomItemName(e.target.value)}
                autoFocus
              />
              <input
                type="number"
                className="custom-item-input"
                placeholder="Quantity (default: 1)"
                value={customItemQty}
                onChange={(e) => setCustomItemQty(e.target.value)}
                min="1"
              />
              <button 
                className="btn btn-primary custom-item-submit"
                onClick={addCustomItem}
                disabled={!customItemName.trim()}
              >
                ➕ Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="modal-overlay" onClick={() => setDeleteConfirmId(null)}>
          <div className="modal confirm-modal" onClick={e => e.stopPropagation()}>
            <div className="confirm-icon">🗑️</div>
            <h3 className="confirm-title">Delete this list?</h3>
            <p className="confirm-text">This cannot be undone.</p>
            <div className="confirm-buttons">
              <button className="btn btn-secondary" onClick={() => setDeleteConfirmId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Reason Modal */}
      {showDeleteReasonModal && (
        <div className="modal-overlay" onClick={() => {
          setShowDeleteReasonModal(false);
          setTransactionToDelete(null);
          setDeleteReasonText('');
        }}>
          <div className="modal delete-reason-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{transactionToDelete?.type === 'salary_payment' ? 'Delete Salary Payment' : 'Delete Transaction'}</h3>
              <button className="modal-close" onClick={() => {
                setShowDeleteReasonModal(false);
                setTransactionToDelete(null);
                setDeleteReasonText('');
              }}>✕</button>
            </div>
            <div className="modal-body">
              <div className="delete-reason-info">
                <div className="info-icon">⚠️</div>
                <div className="info-content">
                  <div className="info-title">Please provide a reason</div>
                  <div className="info-text">
                    This {transactionToDelete?.type === 'salary_payment' ? 'salary payment' : 'transaction'} will be moved to deleted transactions and automatically removed after 30 days.
                  </div>
                </div>
              </div>
              
              <div className="delete-reason-form">
                <label className="delete-reason-label">Reason for deletion:</label>
                <textarea
                  className="delete-reason-textarea"
                  placeholder="Enter reason (e.g., Duplicate entry, Wrong amount, Incorrect calculation, etc.)"
                  value={deleteReasonText}
                  onChange={(e) => setDeleteReasonText(e.target.value)}
                  rows="4"
                  autoFocus
                />
              </div>
              
              <div className="delete-reason-buttons">
                <button 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowDeleteReasonModal(false);
                    setTransactionToDelete(null);
                    setDeleteReasonText('');
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={confirmDeleteTransaction}
                  disabled={!deleteReasonText.trim()}
                >
                  {transactionToDelete?.type === 'salary_payment' ? 'Delete Payment' : 'Delete Transaction'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
