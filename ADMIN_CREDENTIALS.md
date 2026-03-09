# Admin Credentials - Quick Reference

## 8 Admin Accounts Available

All admin accounts have full access to all features.

### Admin Account 1
- **Username**: `admin`
- **Password**: `admin123`

### Admin Account 2
- **Username**: `kushal`
- **Password**: `admin456`

### Admin Account 3
- **Username**: `admin1`
- **Password**: `admin111`

### Admin Account 4
- **Username**: `admin2`
- **Password**: `admin222`

### Admin Account 5
- **Username**: `admin3`
- **Password**: `admin333`

### Admin Account 6
- **Username**: `admin4`
- **Password**: `admin444`

### Admin Account 7
- **Username**: `admin5`
- **Password**: `admin555`

### Admin Account 8
- **Username**: `admin6`
- **Password**: `admin666`

---

## Viewer Account

For read-only access:
- **Username**: `viewer`
- **Password**: `viewer`

---

## Admin Permissions

All admin accounts can:
- ✓ Create users
- ✓ Add transactions (Give Money)
- ✓ Delete transactions (with reason)
- ✓ View deleted transactions
- ✓ Save salary payments
- ✓ Delete salary payments
- ✓ View user totals and history
- ✓ Download PDFs
- ✓ Share via WhatsApp

## Viewer Permissions

Viewers can only:
- ✓ View user totals and history
- ✓ Download PDFs
- ✓ Share via WhatsApp

Viewers cannot:
- ✗ Create users
- ✗ Add transactions
- ✗ Delete anything
- ✗ Save salary payments

---

## Usage Tips

### Assigning Accounts
- Give each team member their own admin account
- Use admin1-admin6 for individual team members
- Keep admin and secondadmin as backup accounts

### Security
- Change default passwords after first login
- Don't share credentials via insecure channels
- Each person should have their own account for accountability

### Tracking
- Each admin's username is recorded when they:
  - Delete a transaction (shows in deleted transactions)
  - Save a salary payment
  - Create a user

---

## Changing Passwords

To change any admin password:

1. Open `src/App.jsx`
2. Find the `ADMIN_CREDENTIALS` section
3. Change the password for the desired account
4. Save the file
5. Rebuild: `npm run build`
6. Deploy the updated app

Example:
```javascript
const ADMIN_CREDENTIALS = {
  admin: 'newPassword123',  // Changed
  secondadmin: 'admin456',
  admin1: 'admin111',
  // ... rest of accounts
};
```

---

## Login Instructions

1. Open the app
2. Enter username (e.g., `admin1`)
3. Enter password (e.g., `admin111`)
4. Click "Login" or press Enter
5. You'll see the home screen with all features unlocked

---

## Troubleshooting

### Can't Login
- Check username spelling (case-insensitive)
- Check password spelling (case-sensitive)
- Try a different admin account
- Clear browser cache

### Forgot Which Account You Used
- All admin accounts have the same permissions
- Use any available admin account
- Check deleted transactions to see which username was used

### Need More Accounts
- Edit `src/App.jsx`
- Add more entries to `ADMIN_CREDENTIALS`
- Follow the same pattern: `admin7: 'admin777'`

---

## Quick Copy-Paste

For sharing with team members:

```
Admin Accounts (choose one):
- admin / admin123
- secondadmin / admin456
- admin1 / admin111
- admin2 / admin222
- admin3 / admin333
- admin4 / admin444
- admin5 / admin555
- admin6 / admin666

Viewer Account (read-only):
- viewer / viewer
```
