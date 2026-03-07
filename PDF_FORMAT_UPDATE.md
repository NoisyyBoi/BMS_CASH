# PDF Format Update

## Overview
All PDF reports now include a professional header with company logo and information, plus a clean table layout for transaction data.

## New PDF Header Format

### Logo
- Company logo (icon-512.png) displayed on the left side
- Size: 30mm x 30mm

### Company Information (to the right of logo)
```
BMS DEISEL SYSTEMS INDIA PVT LTD
Giridhama Nagar, Doddabettahalli, Vidyaranyapura,
Bengaluru, Karnataka 560065
Land: 080 2973 3225, Ph: 9900118148, 9844088148
Email: bmsdieselsystems@gmail.com
```

## Transaction Table Format

### User Transaction History PDF
```
-------------------------------------------------------------
Date        Time      Purpose                    Amount (Rs.)
-------------------------------------------------------------
7 Mar 2026  12:20 PM  Owes from Overpayment...      -2,000
8 Mar 2026  02:30 PM  Food                           1,500
9 Mar 2026  10:15 AM  Fuel                           3,000
-------------------------------------------------------------
```

### Daily Transaction Report PDF
```
-------------------------------------------------------------
Time      User              Purpose              Amount (Rs.)
-------------------------------------------------------------
12:20 PM  John Doe          Food                      1,500
02:30 PM  Jane Smith        Fuel                      3,000
04:45 PM  Bob Johnson       Advance                   5,000
-------------------------------------------------------------
```

### Monthly Summary PDF
```
-------------------------------------------------------------
Date              Transactions              Amount (Rs.)
-------------------------------------------------------------
7 Mar 2026        5 transactions                 15,000
8 Mar 2026        3 transactions                  8,500
9 Mar 2026        7 transactions                 22,000
-------------------------------------------------------------
```

## Features

### Professional Header
- Company logo prominently displayed
- Complete contact information
- Clean, professional layout

### Table Layout
- Column headers with clear labels
- Horizontal lines separating header and data
- Right-aligned amounts for easy reading
- Negative amounts shown in RED color
- Automatic page breaks with repeated headers

### Data Formatting
- Dates: "7 Mar 2026" format
- Times: "12:20 PM" format
- Amounts: Indian numbering system (Rs. 1,00,000)
- Negative amounts: "-2,000" in red color
- Long text truncated with "..." to fit columns

### Smart Pagination
- Automatic page breaks when content exceeds page height
- Table headers repeated on each new page
- Consistent formatting across all pages

## Technical Details

### Functions Updated
1. `generateUserTransactionsPDF()` - User transaction history
2. `generateDailyTransactionsPDF()` - Daily transaction report
3. `generateMonthlySummaryPDF()` - Monthly summary report

### Logo Loading
- Attempts to load logo from `/icons/icon-512.png`
- Continues without logo if loading fails (2-second timeout)
- No error shown to user if logo missing

### Currency Formatting
- Uses `formatCurrencyForPDF()` helper function
- Indian numbering: 1,00,000 (not 100,000)
- Displays as "Rs. 1,00,000" in PDF
- Negative amounts: "-2,000" (without Rs. prefix in table)

## File Locations

- Logo: `public/icons/icon-512.png`
- PDF Functions: `src/utils/storage.js`

## Testing

To test the new PDF format:
1. Go to User History
2. Click "Download PDF" button
3. Check that:
   - Logo appears in header
   - Company information is displayed
   - Transactions are in table format
   - Negative amounts are in red
   - Page breaks work correctly

## Notes

- All PDFs use A4 portrait format
- Margins: 20mm on all sides
- Font: Helvetica (built-in PDF font)
- Logo loads asynchronously (doesn't block PDF generation)
- Table columns auto-adjust based on content
