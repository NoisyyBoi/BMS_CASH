# Authentication & Access Control Guide

## Overview
BMS Cash Entry now has role-based access control with three user types:
- **Admin**: Full access to all features
- **Second Admin**: Full access to all features
- **Viewer**: Read-only access (can view but not modify)

## User Roles

### Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Permissions**:
  - ✓ Create users
  - ✓ Add transactions (Give Money)
  - ✓ View user totals
  - ✓ View history
  - ✓ Download PDFs
  - ✓ Share via WhatsApp

### Second Admin
- **Username**: `secondadmin`
- **Password**: `admin456`
- **Permissions**:
  - ✓ Create users
  - ✓ Add transactions (Give Money)
  - ✓ View user totals
  - ✓ View history
  - ✓ Download PDFs
  - ✓ Share via WhatsApp

### Viewer (Everyone)
- **Username**: `viewer`
- **Password**: `viewer`
- **Permissions**:
  - ✗ Cannot create users
  - ✗ Cannot add transactions
  - ✓ View user totals
  - ✓ View history
  - ✓ Download PDFs
  - ✓ Share via WhatsApp

## How It Works

### Login Process
1. Open the app - you'll see the login screen
2. Enter username and password
3. Click "Login" or press Enter
4. You'll be redirected to the home screen

### Session Persistence
- Login session is stored in browser localStorage
- You stay logged in even after closing the browser
- Session persists until you click "Logout"

### Access Control
- Viewers see locked buttons (🔒) for restricted features
- Clicking locked buttons shows: "Only admins can [action]"
- All users can view data, download PDFs, and share

### Logout
- Click the "Logout" button in the role badge
- You'll be redirected to the login screen
- Session is cleared from localStorage

## Security Features

### Current Implementation
- Credentials stored in app code (client-side)
- Session stored in localStorage
- Role-based UI restrictions
- Toast notifications for unauthorized actions

### Limitations
⚠️ **Important Security Notes:**
1. Credentials are visible in the source code
2. No server-side validation
3. Tech-savvy users can bypass client-side restrictions
4. Suitable for trusted environments only

### For Production Use
To enhance security:
1. Implement server-side authentication
2. Use Supabase Auth or similar service
3. Store credentials securely (environment variables)
4. Add JWT tokens for API requests
5. Implement Row Level Security in Supabase
6. Add password hashing
7. Enable two-factor authentication

## Changing Credentials

To change admin passwords, edit `src/App.jsx`:

```javascript
const ADMIN_CREDENTIALS = {
  admin: 'your-new-password',
  secondadmin: 'your-new-password'
};
```

Then rebuild the app:
```bash
npm run build
```

## User Interface

### Login Screen
- Clean, centered design
- Username and password fields
- Enter key navigation
- Login instructions for viewers

### Home Screen
- Role badge showing current user role
- Crown icon (👑) for admins
- Eye icon (👁️) for viewers
- Logout button in role badge
- Locked buttons (🔒) for restricted features

### Restricted Features
When viewers try to access restricted features:
- "Create a User" button is disabled and shows lock icon
- "Give Money" button is disabled and shows lock icon
- Toast message: "Only admins can [action]"

## Testing

### Test Admin Access
1. Login with: `admin` / `admin123`
2. Verify all buttons are enabled
3. Try creating a user
4. Try adding a transaction

### Test Second Admin Access
1. Login with: `secondadmin` / `admin456`
2. Verify all buttons are enabled
3. Try creating a user
4. Try adding a transaction

### Test Viewer Access
1. Login with: `viewer` / `viewer`
2. Verify "Create User" and "Give Money" are locked
3. Try clicking locked buttons - should show error
4. Verify you can view User Total and History
5. Verify you can download PDFs and share

## Troubleshooting

### Can't Login
- Check username and password spelling
- Usernames are case-insensitive
- Passwords are case-sensitive
- Clear browser cache and try again

### Session Not Persisting
- Check if localStorage is enabled
- Not in private/incognito mode
- Browser allows localStorage

### Locked Out
- Clear localStorage: `localStorage.removeItem('bms_user_role')`
- Refresh the page
- Login again

### Forgot Password
- Admin passwords are in the source code
- Check `src/App.jsx` for credentials
- Or ask the developer to reset

## Deployment Notes

When deploying:
1. Consider changing default passwords
2. Document credentials securely
3. Share credentials only with authorized users
4. Regularly review access logs (if implemented)
5. Consider implementing proper authentication for production

## Future Enhancements

Potential improvements:
- Server-side authentication
- Password reset functionality
- User management interface
- Activity logging
- Session timeout
- Multi-factor authentication
- Custom user roles
- Permission granularity
