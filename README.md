# BMS Cash Entry

Employee cash transaction management system for BMS Diesel Systems India Pvt Ltd.

## Features

- Create and manage employee/user profiles
- Record cash transactions (fuel, food, advance, etc.)
- View transaction history by date
- View individual user transaction history
- Calculate monthly totals and remaining salary balance
- Offline support with PWA capabilities

## Technology Stack

- React 19.2.0
- Vite 7.2.4
- jsPDF for PDF generation
- Progressive Web App (PWA) support

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Usage

1. **Create User** - Add employee details (name, phone, referral)
2. **Give Money** - Record cash transactions with purpose
3. **User Total** - View individual employee transaction history and monthly totals
4. **History** - View all transactions grouped by date

## Data Storage

All data is stored locally in the browser's localStorage. No server or database required.
