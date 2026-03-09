# 🗑️ Salary Payment Deletion with Reason Tracking

## Overview

When deleting salary payments, admins must provide a reason. The deleted payment is stored in the deleted transactions table for audit purposes and automatically removed after 30 days.

---

## How It Works

### Step 1: Click Delete Button
Admin clicks the 🗑️ button on a salary payment in the Salary Payments screen.

### Step 2: Provide Reason (Required)
A modal appears asking for a deletion reason:

```
┌─────────────────────────────────────────┐
│ Delete Salary Payment              ✕    │
├─────────────────────────────────────────┤
│ ⚠️ Please provide a reason              │
│                                         │
│ This salary payment will be moved to    │
│ deleted transactions and automatically  │
│ removed after 30 days.                  │
│                                         │
│ Reason for deletion:                    │
│ ┌─────────────────────────────────────┐ │
│ │ Enter reason (e.g., Duplicate       │ │
│ │ entry, Wrong amount, Incorrect      │ │
│ │ calculation, etc.)                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│  [Cancel]  [Delete Payment]             │
└─────────────────────────────────────────┘
```

### Step 3: Confirm Deletion
- Reason is required (button disabled until reason is entered)
- Click "Delete Payment" to confirm
- Payment is moved to deleted transactions
- Original payment is removed from salary_payments table

### Step 4: Auto-Delete After 30 Days
- Deleted payment stored in deleted_transactions table
- Automatically removed after 30 days
- Same as regular transaction deletions

---

## What Gets Stored

### In Deleted Transactions Table

When a salary payment is deleted, the following information is saved:

```javascript
{
  id: Date.now(),
  userId: payment.userId,
  userName: payment.userName,
  userPhone: payment.userPhone,
  amount: payment.paidToEmployee,  // Amount paid to employee
  purpose: "Salary Payment - March 2026",  // Month of payment
  deletedReason: "Duplicate entry",  // Admin's reason
  deletedBy: "kushal",  // Which admin deleted it
  originalCreatedAt: payment.createdAt,  // Original payment date
  deletedAt: new Date().toISOString()  // When it was deleted
}
```

---

## Viewing Deleted Salary Payments

### Deleted Transactions Screen

Go to Home → Deleted Transactions to see all deleted items including salary payments.

```
┌─────────────────────────────────────────────┐
│ Salary Payment - March 2026                 │
│ Ramesh Kumar • 9876543210                   │
│ Amount: ₹25,000                             │
│                                             │
│ Deleted by: kushal                          │
│ Reason: Duplicate entry                     │
│ Deleted: 7 Mar 2026, 3:45 PM               │
│ Auto-deletes in: 25 days                    │
└─────────────────────────────────────────────┘
```

---

## Comparison: Transaction vs Salary Payment Deletion

| Feature | Regular Transaction | Salary Payment |
|---------|-------------------|----------------|
| Reason Required | ✅ Yes | ✅ Yes |
| Stored in deleted_transactions | ✅ Yes | ✅ Yes |
| Auto-delete after | 30 days | 30 days |
| Purpose field | Original purpose | "Salary Payment - [Month]" |
| Amount field | Transaction amount | paidToEmployee amount |
| Shows in Deleted Transactions | ✅ Yes | ✅ Yes |

---

## Why This Feature?

### 1. Audit Trail
- Track why salary payments were deleted
- Know who deleted them and when
- Maintain accountability

### 2. Mistake Recovery
- If deleted by mistake, you have 30 days to review
- Can see the original payment details
- Reason helps understand context

### 3. Compliance
- Financial records require deletion reasons
- Audit requirements for payroll changes
- Transparency in salary management

### 4. Team Coordination
- Multiple admins can see deletion history
- Understand why payments were removed
- Avoid duplicate deletions

---

## Example Deletion Reasons

### Good Reasons:
- ✅ "Duplicate entry - already paid"
- ✅ "Wrong amount - should be ₹30,000 not ₹25,000"
- ✅ "Incorrect calculation - deduction was wrong"
- ✅ "Employee left before payment"
- ✅ "Payment cancelled by management"
- ✅ "Entered in wrong month"

### Bad Reasons:
- ❌ "Delete" (too vague)
- ❌ "Wrong" (not specific)
- ❌ "Mistake" (what kind of mistake?)
- ❌ "Test" (not a real reason)

---

## Workflow Example

### Scenario: Duplicate Salary Payment

1. **Discovery**: Admin notices duplicate payment for March 2026
2. **Delete**: Clicks 🗑️ on the duplicate payment
3. **Reason**: Enters "Duplicate entry - already paid on 1st March"
4. **Confirm**: Clicks "Delete Payment"
5. **Result**: 
   - Payment removed from Salary Payments screen
   - Stored in Deleted Transactions with reason
   - Other admins can see why it was deleted
   - Auto-deletes after 30 days

---

## Admin Permissions

### Who Can Delete?
- ✅ All admin accounts (kushal, admin2-admin8)
- ❌ Viewers cannot delete
- ❌ Users cannot delete

### Deletion Process
1. Must be logged in as admin
2. Must provide a reason (required field)
3. Cannot delete without reason
4. Deletion is immediate after confirmation

---

## Technical Details

### Modal Reuse
The same delete reason modal is used for both:
- Regular transaction deletions
- Salary payment deletions

The modal title and text change dynamically:
- Transaction: "Delete Transaction"
- Salary Payment: "Delete Salary Payment"

### Database Operations

```javascript
// 1. Save to deleted_transactions
await saveDeletedTransactionToSupabase(deletedTransaction);

// 2. Delete from salary_payments
await deleteSalaryPaymentFromSupabase(paymentId);

// 3. Reload salary payments list
const payments = await getSalaryPaymentsFromSupabase();
setSalaryPayments(payments);
```

---

## Auto-Delete Timeline

### Salary Payment Lifecycle

```
Day 0: Payment created
  ↓
Day X: Admin deletes with reason
  ↓
Moved to deleted_transactions
  ↓
Day X+1 to X+29: Visible in Deleted Transactions
  ↓
Day X+30: Automatically deleted forever
```

### Warning Display

In Deleted Transactions screen:
- Days 30-8: No warning
- Days 7-1: "Auto-deletes in X days" (orange warning)
- Day 0: Deleted automatically

---

## Best Practices

### 1. Be Specific
Always provide clear, specific reasons for deletion:
- What was wrong?
- Why was it deleted?
- What action was taken?

### 2. Review Before Deleting
- Double-check the payment details
- Verify it's the correct payment to delete
- Consider if it should be corrected instead

### 3. Document Important Deletions
For significant deletions:
- Take a screenshot before deleting
- Note the reason in your records
- Inform relevant team members

### 4. Regular Reviews
- Check Deleted Transactions weekly
- Verify deletions were appropriate
- Learn from deletion patterns

---

## Troubleshooting

### Can't delete payment?
- Check you're logged in as admin
- Viewers cannot delete payments
- Verify payment exists in the list

### Reason field won't accept input?
- Click inside the text area
- Modal should auto-focus on reason field
- Try refreshing the page

### Delete button disabled?
- Reason field must have text
- Cannot be empty or just spaces
- Type at least a few characters

### Payment still showing after deletion?
- Refresh the Salary Payments screen
- Go back to Home and reopen
- Check Deleted Transactions to confirm

---

## Summary

✅ Salary payment deletion requires a reason  
✅ Deleted payments stored in deleted_transactions  
✅ Auto-delete after 30 days  
✅ Same process as regular transactions  
✅ Full audit trail maintained  
✅ Admin tracking included  
✅ Purpose shows as "Salary Payment - [Month]"  
✅ Amount shows paidToEmployee value  

---

**Last Updated**: Today  
**Feature**: Salary payment deletion with mandatory reason  
**Storage**: deleted_transactions table  
**Retention**: 30 days before auto-delete
