# BMS Cash Entry

A Progressive Web App (PWA) for managing cash transactions and user records for BMS Diesel Systems India Pvt Ltd.

## Features

- **Role-Based Access Control**: Admin, Second Admin, and Viewer roles
- **User Management**: Create and manage user profiles (Admin only)
- **Transaction Tracking**: Record money given to users (Admin only)
- **User History**: View individual user transaction history with monthly totals
- **Salary Calculator**: Calculate remaining balance after deducting given amounts
- **Transaction History**: View all transactions grouped by date with daily totals
- **PDF Export**: Download user or daily transaction reports as PDF
- **WhatsApp Share**: Share transaction reports via WhatsApp
- **Indian Currency Format**: All amounts displayed in Indian numbering system (lakhs/crores)
- **Cloud Sync**: Data stored in Supabase cloud database, accessible from any device
- **Offline Support**: Works offline as a PWA with cached data
- **Keyboard Navigation**: Full support for Enter key and arrow keys

## Technology Stack

- React 19
- Vite
- Supabase (Cloud Database)
- PWA (Progressive Web App)
- Indian currency formatting
- jsPDF for PDF generation

## Installation

1. Clone the repository:
```bash
git clone https://github.com/NoisyyBoi/BMS_CASH.git
cd BMS_CASH
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with your Supabase credentials (see `SUPABASE_SETUP.md`)

4. Run development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Data Storage

All data is stored in Supabase cloud database:
- Users table: User profiles (name, phone, referral)
- Transactions table: Transaction records (amount, purpose, date)

See `SUPABASE_SETUP.md` for database setup instructions.

## Usage

### Login
1. Open the app - you'll see the login screen
2. **For Admins**: Use admin credentials (see `AUTHENTICATION_GUIDE.md`)
3. **For Viewing**: Username: `viewer`, Password: `viewer`
4. Click "Login" or press Enter

### User Roles
- **Admin/Second Admin**: Can create users and add transactions
- **Viewer**: Can only view data (read-only access)

See `AUTHENTICATION_GUIDE.md` for detailed role permissions.

### Create a User (Admin Only)
1. Click "Create a User" button
2. Enter name (required) and phone number (required)
3. Optionally add referral information
4. Click "Save User"

### Give Money
1. Click "Give Money" button
2. Search and select a user
3. Enter amount in rupees
4. Select purpose (Fuel, Food, Advance, or Others)
5. Click "Save Transaction"

### View User Total
1. Click "User Total" button
2. Search and select a user
3. View transaction history and monthly total
4. Use salary calculator to see remaining balance
5. Download PDF or share via WhatsApp

### View History
1. Click "History" button
2. View all transactions grouped by date
3. Click on any date to expand/collapse transactions
4. See daily totals for each date
5. Download PDF or share via WhatsApp for any day

## PWA Installation

The app can be installed on mobile devices and desktops:
- On mobile: Tap "Add to Home Screen" in browser menu
- On desktop: Click install icon in address bar

## Deployment

See `SUPABASE_SETUP.md` for deployment instructions with environment variables.

## License

Private project for BMS Diesel Systems India Pvt Ltd
