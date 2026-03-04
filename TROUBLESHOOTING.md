# Troubleshooting Guide - BMS Cash Entry

## Common Issues and Solutions

### Issue: Data Not Saving

**Symptoms:**
- Users or transactions don't appear after saving
- "User created successfully" message shows but user not in list

**Solutions:**
1. Check if localStorage is enabled in browser
2. Verify you're not in private/incognito mode
3. Check browser console (F12) for errors
4. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Data Disappeared

**Symptoms:**
- Previously saved users/transactions are gone
- App shows empty state

**Solutions:**
1. Check if browser data was cleared
2. Verify you're using the same browser/device
3. Check if localStorage was manually cleared
4. Restore from backup if available

### Issue: "No users found" in Give Money

**Symptoms:**
- Cannot select user when giving money
- Dropdown shows "No users found"

**Solutions:**
1. Create a user first using "Create a User" button
2. Check if users exist: Open console (F12) and run:
   ```javascript
   JSON.parse(localStorage.getItem('bms_users'))
   ```
3. Reload the page

### Issue: User Total Not Loading

**Symptoms:**
- "Loading users..." never goes away
- Cannot select user in User Total screen

**Solutions:**
1. Check browser console for errors
2. Verify localStorage is working:
   ```javascript
   console.log(localStorage.getItem('bms_users'))
   ```
3. Hard refresh the page
4. Clear cache and reload

### Issue: History Not Showing Transactions

**Symptoms:**
- History page shows "No transactions yet"
- Transactions were saved but don't appear

**Solutions:**
1. Verify transactions exist:
   ```javascript
   JSON.parse(localStorage.getItem('bms_transactions'))
   ```
2. Check if transactions have correct structure
3. Reload the page
4. Check browser console for errors

### Issue: Currency Not Formatting Correctly

**Symptoms:**
- Amounts show as plain numbers
- No commas in Indian format

**Solutions:**
1. Check if formatIndianCurrency function is imported
2. Verify the utility file exists: `src/utils/formatCurrency.js`
3. Check browser console for errors
4. Rebuild the app: `npm run build`

### Issue: PWA Not Installing

**Symptoms:**
- No "Add to Home Screen" option
- Install prompt doesn't appear

**Solutions:**
1. Verify you're using HTTPS (or localhost)
2. Check if service worker is registered
3. Clear browser cache and reload
4. Check browser console for service worker errors
5. Verify manifest.json is accessible

### Issue: App Not Working Offline

**Symptoms:**
- App doesn't load without internet
- White screen when offline

**Solutions:**
1. Visit the app online first to cache assets
2. Check if service worker is active:
   - Open DevTools → Application → Service Workers
3. Verify PWA is properly installed
4. Clear cache and reinstall PWA

## Browser-Specific Issues

### Chrome/Edge
- localStorage limit: ~10MB
- Check: Settings → Privacy → Site Settings → Cookies and site data

### Firefox
- localStorage limit: ~10MB
- Check: Options → Privacy & Security → Cookies and Site Data

### Safari
- localStorage limit: ~5MB
- May clear data after 7 days of inactivity
- Check: Preferences → Privacy → Manage Website Data

## Data Management

### Viewing All Data

Open browser console (F12) and run:
```javascript
// View users
console.table(JSON.parse(localStorage.getItem('bms_users')))

// View transactions
console.table(JSON.parse(localStorage.getItem('bms_transactions')))
```

### Backing Up Data

```javascript
// Create backup
const backup = {
  users: localStorage.getItem('bms_users'),
  transactions: localStorage.getItem('bms_transactions'),
  date: new Date().toISOString()
};
console.log(JSON.stringify(backup));
// Copy the output and save to a file
```

### Restoring Data

```javascript
// Restore from backup
const backup = /* paste your backup JSON here */;
localStorage.setItem('bms_users', backup.users);
localStorage.setItem('bms_transactions', backup.transactions);
location.reload();
```

### Clearing All Data

```javascript
// Clear all BMS data
localStorage.removeItem('bms_users');
localStorage.removeItem('bms_transactions');
location.reload();
```

## Development Issues

### Build Errors

**Error: "Cannot find module"**
- Run: `npm install`
- Delete `node_modules` and run `npm install` again

**Error: "Vite build failed"**
- Check for syntax errors in code
- Run: `npm run lint`
- Check browser console for errors

### Dev Server Issues

**Port already in use:**
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
# Or use different port
npm run dev -- --port 3000
```

**Hot reload not working:**
- Save the file again
- Restart dev server
- Check if file is in `src/` directory

## Performance Issues

### App Running Slow

1. Check localStorage size:
   ```javascript
   let total = 0;
   for(let key in localStorage) {
     total += localStorage[key].length;
   }
   console.log('localStorage size:', (total / 1024).toFixed(2), 'KB');
   ```

2. If size > 5MB, consider archiving old data
3. Clear browser cache
4. Close other tabs/applications

### Large Transaction History

If you have thousands of transactions:
1. Export old data
2. Clear old transactions
3. Keep only recent data in localStorage

## Still Having Issues?

1. Check browser console for errors (F12)
2. Verify localStorage is enabled
3. Try a different browser
4. Clear all site data and start fresh
5. Check if JavaScript is enabled
6. Disable browser extensions temporarily

## Getting Help

When reporting issues, include:
1. Browser name and version
2. Operating system
3. Error messages from console
4. Steps to reproduce the issue
5. Screenshot if applicable
