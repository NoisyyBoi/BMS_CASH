# Supabase Setup Guide for BMS Cash Entry

## Prerequisites
- A Supabase account (free tier available)
- Your React app running locally

## Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in:
   - **Project Name**: BMS Cash Entry
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your location
5. Click "Create new project" (takes ~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, click on the **Settings** icon (gear icon)
2. Go to **API** section
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Configure Your App

1. Open the `.env` file in your project root
2. Replace the placeholder values:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

### 4. Create Database Tables

1. In Supabase dashboard, click on **SQL Editor** (left sidebar)
2. Click "New query"
3. Copy the entire content from `supabase-schema.sql` file
4. Paste it into the SQL editor
5. Click "Run" button
6. You should see "Success. No rows returned"

### 5. Verify Tables Created

1. Click on **Table Editor** (left sidebar)
2. You should see two tables:
   - `users`
   - `transactions`

### 6. Update Your App Code

Now you need to replace localStorage with Supabase calls in your App.jsx:

**Replace these functions:**

```javascript
// OLD: localStorage
const users = JSON.parse(localStorage.getItem('users') || '[]');

// NEW: Supabase
import { getUsersFromSupabase, saveUserToSupabase } from './utils/supabaseStorage';
const users = await getUsersFromSupabase();
```

### 7. Test the Connection

1. Restart your development server:
   ```bash
   npm run dev
   ```

2. Try creating a user
3. Check Supabase Table Editor to see if data appears

## Deployment Options

### Option A: Netlify (Recommended - Free)

1. Push your code to GitHub
2. Go to [https://netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Add environment variables:
   - `VITE_SUPABASE_URL`: your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: your Supabase anon key
6. Click "Deploy"
7. Your app will be live at: `https://your-app.netlify.app`

### Option B: Vercel (Free)

1. Push your code to GitHub
2. Go to [https://vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables (same as Netlify)
6. Click "Deploy"

### Option C: GitHub Pages

1. Install gh-pages:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Update `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/bms-cash-entry",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploy:
   ```bash
   npm run deploy
   ```

## Security Notes

⚠️ **Important**: The current setup allows anyone to read/write data. For production:

1. Implement authentication (Supabase Auth)
2. Update RLS policies to restrict access
3. Add user roles (admin, employee, etc.)

## Troubleshooting

**Error: "Invalid API key"**
- Check your `.env` file has correct credentials
- Restart dev server after changing `.env`

**Error: "relation does not exist"**
- Run the SQL schema in Supabase SQL Editor
- Verify tables exist in Table Editor

**Data not showing**
- Check browser console for errors
- Verify Supabase URL is correct
- Check RLS policies are enabled

## Next Steps

1. Migrate existing localStorage data to Supabase
2. Add real-time updates (Supabase Realtime)
3. Implement user authentication
4. Add data export features
5. Set up automated backups

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
