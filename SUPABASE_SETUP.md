# Supabase Cloud Database Setup

## Overview
BMS Cash Entry is now configured to use Supabase cloud database for data storage and synchronization across devices.

## Current Configuration

### Credentials (Already Configured)
- **Supabase URL**: https://prjezxbbkqoieockoymh.supabase.co
- **Anon Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamV6eGJia3FvaWVvY2tveW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjIzOTgsImV4cCI6MjA4ODA5ODM5OH0.06egx5ok0Z7kAjv9NMP0xTqbunSR8CzrnyLe-YnYMBs

These credentials are stored in `.env` file (not committed to git for security).

## Database Setup

### Step 1: Create Tables

1. Go to your Supabase project: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh
2. Click on "SQL Editor" in the left sidebar
3. Click "New query"
4. Copy the entire content from `supabase-schema.sql`
5. Paste it into the SQL editor
6. Click "Run" button

This will create:
- `users` table (id, name, phone, referral, createdAt)
- `transactions` table (id, userId, userName, userPhone, amount, purpose, createdAt)
- Row Level Security policies (allows all operations)
- Performance indexes

### Step 2: Verify Tables

1. Click "Table Editor" in the left sidebar
2. You should see two tables: `users` and `transactions`
3. Both tables should be empty initially

## Features

### Cloud Sync
- All data is stored in Supabase cloud
- Accessible from any device with internet
- Real-time data synchronization
- Automatic backups by Supabase

### Data Operations
- **Create User**: Saves to Supabase `users` table
- **Give Money**: Saves to Supabase `transactions` table
- **User Total**: Fetches user-specific transactions
- **History**: Fetches all transactions grouped by date

## Testing

### Test Connection
1. Run the app: `npm run dev`
2. Try creating a user
3. Check Supabase Table Editor to see if data appears
4. Try adding a transaction
5. Verify data in both app and Supabase dashboard

### Check Data in Supabase
1. Go to Table Editor
2. Click on `users` table - you should see created users
3. Click on `transactions` table - you should see transactions

## Deployment

When deploying to Netlify/Vercel, add these environment variables:

```
VITE_SUPABASE_URL=https://prjezxbbkqoieockoymh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByamV6eGJia3FvaWVvY2tveW1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjIzOTgsImV4cCI6MjA4ODA5ODM5OH0.06egx5ok0Z7kAjv9NMP0xTqbunSR8CzrnyLe-YnYMBs
```

## Benefits

1. **Multi-Device Access**: Access data from any device
2. **Cloud Backup**: Automatic backups by Supabase
3. **Data Persistence**: Data never lost (unlike localStorage)
4. **Scalability**: Can handle large amounts of data
5. **Real-time**: Changes reflect immediately

## Limitations

1. **Internet Required**: Needs internet connection to save/load data
2. **API Limits**: Free tier has usage limits (check Supabase dashboard)
3. **Public Access**: Current setup allows anyone with URL to access (see Security section)

## Security Notes

⚠️ **Current Setup**: The database is configured with open access (anyone can read/write).

### For Production:
1. Implement authentication (Supabase Auth)
2. Update Row Level Security policies to restrict access
3. Add user roles (admin, employee, etc.)
4. Use environment variables for credentials
5. Never commit `.env` file to git

## Troubleshooting

### Error: "relation does not exist"
- Run the SQL schema in Supabase SQL Editor
- Verify tables exist in Table Editor

### Data not showing
- Check browser console for errors
- Verify Supabase URL is correct in `.env`
- Check internet connection
- Verify RLS policies are enabled

### Connection errors
- Check if Supabase project is active
- Verify API keys are correct
- Check browser network tab for failed requests

## Migration from localStorage

If you have existing data in localStorage:

1. Open browser console (F12)
2. Export localStorage data:
```javascript
const users = JSON.parse(localStorage.getItem('bms_users'));
const transactions = JSON.parse(localStorage.getItem('bms_transactions'));
console.log(JSON.stringify({users, transactions}));
```
3. Copy the output
4. Manually insert into Supabase using Table Editor or SQL

## Support

- Supabase Dashboard: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh
- Supabase Docs: https://supabase.com/docs
- Check `TROUBLESHOOTING.md` for common issues
