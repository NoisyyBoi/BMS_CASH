# 🗑️ Salary Payment Auto-Delete Feature

## Overview

Salary payments are automatically deleted after 120 days (4 months) to keep the database clean and maintain only recent payment records.

---

## How It Works

### Automatic Cleanup
- Runs every time an admin or viewer logs in
- Runs when the app loads (if already logged in)
- Silently deletes salary payments older than 120 days
- No user action required

### Calculation
```javascript
// Calculate date 120 days ago
const oneHundredTwentyDaysAgo = new Date();
oneHundredTwentyDaysAgo.setDate(oneHundredTwentyDaysAgo.getDate() - 120);

// Delete all payments older than this date
DELETE FROM salary_payments WHERE createdAt < oneHundredTwentyDaysAgo
```

---

## Visual Indicators

### Warning Display
When a salary payment is within 30 days of auto-deletion, a warning appears:

```
┌─────────────────────────────────────────────┐
│ 👤 Ramesh Kumar                             │
│    9876543210                               │
│ 💰 Monthly Salary: ₹30,000                 │
│ 💵 Paid to Employee: ₹25,000               │
│ 7 Nov 2025, 3:45 PM • by kushal            │
│ ⏰ Auto-deletes in 25 days                  │
└─────────────────────────────────────────────┘
```

### Warning Thresholds
- **120-31 days old**: No warning shown
- **30-1 days old**: Orange warning displayed
- **0 days (120+ days)**: Automatically deleted

---

## Why 120 Days?

### Benefits
1. **Clean Database**: Removes old records automatically
2. **Performance**: Keeps queries fast with less data
3. **Relevant Data**: Focus on recent 4 months of payments
4. **Storage**: Reduces database storage usage

### Retention Period
- 120 days = 4 months
- Covers current month + 3 previous months
- Enough time for quarterly reviews
- Sufficient for most accounting needs

---

## Comparison with Other Features

| Feature | Auto-Delete Period | Warning Period |
|---------|-------------------|----------------|
| Deleted Transactions | 30 days | Last 7 days |
| Salary Payments | 120 days | Last 30 days |
| Regular Transactions | Never | N/A |
| Users | Never | N/A |

---

## Important Notes

### What Gets Deleted
✅ Salary payment records older than 120 days  
✅ All payment details (salary, deductions, etc.)  
✅ Admin tracking information  

### What Stays
❌ Regular transactions (never auto-deleted)  
❌ User accounts (never auto-deleted)  
❌ Deleted transactions (auto-delete after 30 days)  
❌ Recent salary payments (less than 120 days old)  

---

## Manual Deletion

Admins can still manually delete salary payments before the 120-day period:

1. Go to "Salary Payments" screen
2. Expand the month
3. Click the 🗑️ button on any payment
4. Confirm deletion

Manual deletion is immediate and doesn't wait for the 120-day period.

---

## Database Implementation

### Function
```javascript
export const deleteOldSalaryPaymentsFromSupabase = async () => {
  try {
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
```

### When It Runs
1. **App Load**: When user is already logged in
2. **Admin Login**: When admin logs in
3. **Viewer Login**: When viewer logs in

---

## Example Timeline

### Payment Created: January 1, 2026
- **Jan 1 - Apr 1**: No warning (0-90 days)
- **Apr 2 - Apr 30**: No warning (91-119 days)
- **May 1**: Warning appears "Auto-deletes in 30 days"
- **May 15**: Warning shows "Auto-deletes in 15 days"
- **May 30**: Warning shows "Auto-deletes in 1 day"
- **May 31**: Payment automatically deleted

---

## Styling

### Warning Box
```css
.auto-delete-warning {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: rgba(255, 111, 0, 0.1);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--accent);
}
```

### Colors
- Background: Light orange (rgba(255, 111, 0, 0.1))
- Border: Orange accent color
- Text: Orange accent color
- Icon: ⏰ (clock emoji)

---

## Troubleshooting

### Payments not being deleted?
1. Check that you're logging in as admin or viewer
2. Verify the payment is actually older than 120 days
3. Check browser console for errors
4. Ensure Supabase connection is working

### Warning not showing?
1. Payment must be between 1-30 days from deletion
2. Payments older than 90 days show warning
3. Check that payment has valid `createdAt` date

### Want to keep old payments?
If you need to keep payments longer than 120 days:
1. Export them to PDF before deletion
2. Or modify the code to increase the retention period
3. Change `120` to desired number of days in `supabaseStorage.js`

---

## Changing Retention Period

To change from 120 days to a different period:

### Step 1: Update Function
Edit `src/utils/supabaseStorage.js`:

```javascript
export const deleteOldSalaryPaymentsFromSupabase = async () => {
  try {
    // Change 120 to your desired number of days
    const retentionDays = 180; // Example: 6 months
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    const { error } = await supabase
      .from('salary_payments')
      .delete()
      .lt('createdAt', cutoffDate.toISOString());
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting old salary payments:', error);
    throw error;
  }
};
```

### Step 2: Update Warning Display
Edit `src/App.jsx` in the salary payment card:

```javascript
const daysRemaining = 180 - daysElapsed; // Change 120 to your retention days
```

---

## Best Practices

### 1. Regular Backups
- Export salary payments to PDF monthly
- Keep PDF records for accounting
- Store PDFs in secure location

### 2. Quarterly Reviews
- Review payments before they're deleted
- Export important records
- Verify calculations are correct

### 3. Communication
- Inform team about auto-deletion
- Set reminders for important payments
- Export before 120-day deadline

---

## Summary

✅ Salary payments auto-delete after 120 days  
✅ Warning shows in last 30 days  
✅ Runs automatically on login  
✅ Keeps database clean and fast  
✅ Manual deletion still available  
✅ Regular transactions never auto-delete  

---

**Last Updated**: Today  
**Feature**: Auto-delete salary payments after 120 days  
**Warning Period**: Last 30 days before deletion  
**Retention**: 4 months (120 days)
