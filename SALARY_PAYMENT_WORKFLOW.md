# Salary Payment Workflow

## Overview
The salary payment system now includes automatic transaction management. When you save a salary payment, the system automatically clears old transactions and creates a new balance transaction if needed.

## How It Works

### Step 1: Calculate Salary
1. Go to User Total → Select a user
2. Enter Monthly Salary (e.g., ₹20,000)
3. System shows:
   - Money Given This Month
   - Balance (positive or negative)

### Step 2: Enter Payment Amount
- Field: "Paying to Employee Now (₹)"
- Enter how much you're paying the employee this month
- System calculates:
  - Deduction from salary (if negative balance)
  - Amount to pay employee
  - Remaining balance to carry forward

### Step 3: Save Salary Payment
When you click "💾 Save Salary Payment":

**Automatic Actions:**
1. ✅ Saves the salary payment record
2. ✅ Deletes ALL old transactions for this user
3. ✅ Creates a new transaction with remaining balance (if any)
4. ✅ Refreshes the user's transaction history

## Transaction Management

### If Balance is Fully Paid:
- All old transactions are cleared
- No new transaction is created
- User starts fresh next month

### If Balance Remains:
- All old transactions are cleared
- A new transaction is created with:
  - **Negative amount** (shown in RED)
  - Purpose: "Balance Carried Forward (Advance)" or "Balance Carried Forward (Credit)"
  - This becomes the starting balance for next month

## Visual Indicators

### Transaction Display:
- **Green amounts**: Positive (money given to employee)
- **Red amounts**: Negative (balance carried forward/debt)

### Example Transaction After Salary Payment:
```
Purpose: Balance Carried Forward (Advance)
Amount: -₹5,000 (in RED)
Date: March 4, 2026
```

## Complete Example Workflow

### Scenario: Employee Owes Money

**Initial State:**
- Transaction 1: Fuel - ₹8,000
- Transaction 2: Food - ₹5,000
- Transaction 3: Advance - ₹12,000
- **Total Money Given: ₹25,000**

**Salary Calculation:**
- Monthly Salary: ₹20,000
- Money Given: ₹25,000
- Employee Owes: ₹5,000

**Payment Entry:**
- Paying to Employee Now: ₹15,000
- Deduction from Salary: ₹5,000
- Paying to Employee: ₹15,000
- Remaining Balance: ₹0

**After Saving:**
- ✅ All 3 old transactions deleted
- ✅ No new transaction (balance fully paid)
- ✅ User starts fresh

### Scenario: Partial Payment

**Initial State:**
- Transaction 1: Fuel - ₹8,000
- Transaction 2: Food - ₹5,000
- Transaction 3: Advance - ₹12,000
- **Total Money Given: ₹25,000**

**Salary Calculation:**
- Monthly Salary: ₹20,000
- Money Given: ₹25,000
- Employee Owes: ₹5,000

**Payment Entry:**
- Paying to Employee Now: ₹17,000
- Deduction from Salary: ₹3,000
- Paying to Employee: ₹17,000
- Remaining Balance: ₹2,000

**After Saving:**
- ✅ All 3 old transactions deleted
- ✅ New transaction created:
  - Purpose: "Balance Carried Forward (Advance)"
  - Amount: **-₹2,000** (RED)
- ✅ Next month starts with -₹2,000 balance

### Scenario: Employee Has Credit

**Initial State:**
- Transaction 1: Fuel - ₹5,000
- Transaction 2: Food - ₹3,000
- **Total Money Given: ₹8,000**

**Salary Calculation:**
- Monthly Salary: ₹20,000
- Money Given: ₹8,000
- Salary Remaining: ₹12,000

**Payment Entry:**
- Paying to Employee Now: ₹10,000
- Remaining Balance: ₹2,000 (credit)

**After Saving:**
- ✅ All 2 old transactions deleted
- ✅ New transaction created:
  - Purpose: "Balance Carried Forward (Credit)"
  - Amount: **-₹2,000** (RED - represents credit to be paid)
- ✅ Next month: ₹20,000 + ₹2,000 = ₹22,000 available

## Benefits

1. **Clean History**: Old transactions are cleared after salary payment
2. **Clear Balance**: Only one transaction shows the carried forward balance
3. **Easy Tracking**: Red negative amounts clearly show debts/credits
4. **Automatic**: No manual transaction management needed
5. **Accurate**: System calculates everything automatically

## Important Notes

- ⚠️ Saving salary payment is PERMANENT - old transactions are deleted
- ⚠️ Make sure calculations are correct before saving
- ⚠️ Negative amounts (RED) represent balances to be settled
- ✅ System automatically handles all transaction management
- ✅ Next month calculations include carried forward balance

## Database Changes

The system now includes:
- `deleteUserTransactionsFromSupabase()` - Clears all user transactions
- Automatic creation of balance transactions with negative amounts
- Transaction display supports negative amounts with red styling
