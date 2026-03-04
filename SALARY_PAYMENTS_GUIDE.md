# Salary Payments Feature Guide

## Overview
The Salary Payments feature allows admins to save and track salary payment records for employees. This feature stores detailed information about monthly salary calculations, deductions, and payments.

## Features Implemented

### 1. Save Salary Payment Button
- Located in the User History screen, after the salary calculator section
- Only visible to admins (admin and secondadmin roles)
- Only appears when a monthly salary has been entered
- Saves the complete salary calculation to the database

### 2. Salary Payments History View
- New screen accessible from the home page
- Shows all saved salary payment records
- Displays records in reverse chronological order (newest first)
- Available to all users (admins and viewers)

### 3. Home Screen Button
- New "Salary Payments" button added to the home screen
- Icon: 💵
- Kannada translation: ಸಂಬಳ ಪಾವತಿಗಳು
- Loads all salary payment records when clicked

## Data Stored

Each salary payment record includes:
- **User Information**: Name, phone number, user ID
- **Monthly Salary**: The employee's monthly salary amount
- **Money Given**: Total money given to employee this month
- **Paid Salary**: Any salary already paid (reduces balance)
- **Deducted Amount**: Amount deducted from this month's salary
- **Paid to Employee**: Final amount paid to employee
- **Remaining Balance**: Balance carried forward to next month (if any)
- **Month**: Month and year of the payment (e.g., "March 2026")
- **Created At**: Timestamp of when the record was saved

## How to Use

### For Admins:

1. **Navigate to User History**:
   - Go to Home → User Total
   - Select a user
   - Enter their monthly salary in the calculator

2. **Fill in Salary Details**:
   - Enter monthly salary
   - Optionally enter paid salary (if already paid)
   - For negative balance: Enter "Can Pay Now" and "Deduct from Salary"
   - For positive balance: Enter "Deduct from Salary" if needed

3. **Save the Payment**:
   - Click the "💾 Save Salary Payment" button
   - The record will be saved to the database
   - A success toast message will appear
   - Fields will be reset for next entry

4. **View Saved Payments**:
   - Go to Home → Salary Payments
   - View all saved payment records
   - Records are sorted by date (newest first)

### For Viewers:

1. **View Salary Payments**:
   - Go to Home → Salary Payments
   - View all saved payment records
   - Cannot save new payments (admin only)

## Database Schema

The `salary_payments` table includes:
```sql
CREATE TABLE salary_payments (
  id BIGINT PRIMARY KEY,
  userId BIGINT NOT NULL,
  userName TEXT NOT NULL,
  userPhone TEXT NOT NULL,
  monthlySalary NUMERIC NOT NULL,
  moneyGiven NUMERIC NOT NULL,
  paidSalary NUMERIC,
  deductedAmount NUMERIC,
  paidToEmployee NUMERIC NOT NULL,
  remainingBalance NUMERIC,
  month TEXT NOT NULL,
  createdAt TIMESTAMPTZ DEFAULT NOW()
);
```

## Next Steps

To use this feature, you need to:

1. **Run the SQL Schema**:
   - Open your Supabase dashboard
   - Go to SQL Editor
   - Run the SQL from `supabase-schema.sql`
   - This will create the `salary_payments` table

2. **Test the Feature**:
   - Login as admin
   - Go to User Total → Select a user
   - Enter salary details and save
   - Check Salary Payments to see the saved record

## UI Components

### Salary Payment Card
Each payment record is displayed in a card with:
- **Header**: User info (name, phone) and month
- **Body**: All payment details with color-coded values
  - Green: Positive amounts (salary, paid amounts)
  - Red: Negative amounts (deductions, remaining balance)
- **Footer**: Date and time of record creation

### Color Coding
- **Green**: Salary amounts, paid amounts
- **Red**: Deductions, money given, remaining balance
- **Blue**: User information header

## Notes

- Only admins can save salary payments
- All users can view saved payments
- Records cannot be edited or deleted (for audit purposes)
- All amounts are displayed in Indian currency format (lakhs/crores)
- Timestamps are in Indian timezone (en-IN)
