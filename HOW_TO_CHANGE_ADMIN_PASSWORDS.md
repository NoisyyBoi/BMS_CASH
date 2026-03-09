# How to Change Admin Credentials

## Quick Guide

### Step 1: Open the File
Open the file: `src/App.jsx`

### Step 2: Find the Admin Credentials Section
Look for this section near the top of the file (around line 25):

```javascript
const ADMIN_CREDENTIALS = {
  admin: 'admin123',
  secondadmin: 'admin456',
  admin1: 'admin111',
  admin2: 'admin222',
  admin3: 'admin333',
  admin4: 'admin444',
  admin5: 'admin555',
  admin6: 'admin666'
};
```

### Step 3: Change the Credentials

#### To Change Username AND Password:
```javascript
const ADMIN_CREDENTIALS = {
  john: 'mypassword123',        // Changed from admin
  sarah: 'sarahpass456',        // Changed from secondadmin
  manager1: 'secure111',        // Changed from admin1
  manager2: 'secure222',        // Changed from admin2
  supervisor1: 'super333',      // Changed from admin3
  supervisor2: 'super444',      // Changed from admin4
  employee1: 'emp555',          // Changed from admin5
  employee2: 'emp666'           // Changed from admin6
};
```

#### To Change ONLY Passwords (Keep Usernames):
```javascript
const ADMIN_CREDENTIALS = {
  admin: 'MyNewPassword123!',           // Changed password
  secondadmin: 'SecurePass456!',        // Changed password
  admin1: 'StrongPass111!',             // Changed password
  admin2: 'SafePass222!',               // Changed password
  admin3: 'SecretPass333!',             // Changed password
  admin4: 'PrivatePass444!',            // Changed password
  admin5: 'ProtectedPass555!',          // Changed password
  admin6: 'GuardedPass666!'             // Changed password
};
```

### Step 4: Save the File
Save `src/App.jsx` after making changes.

### Step 5: Rebuild the App (if deployed)
If you've already deployed the app, rebuild it:
```bash
npm run build
```

### Step 6: Test the New Credentials
1. Logout if currently logged in
2. Try logging in with new credentials
3. Verify all features work correctly

---

## Examples

### Example 1: Company-Specific Usernames
```javascript
const ADMIN_CREDENTIALS = {
  bmsdiesel_admin: 'BMS@2024!',
  bmsdiesel_manager: 'Manager@2024!',
  accounts_head: 'Accounts@2024!',
  operations_head: 'Operations@2024!',
  supervisor_north: 'North@2024!',
  supervisor_south: 'South@2024!',
  supervisor_east: 'East@2024!',
  supervisor_west: 'West@2024!'
};
```

### Example 2: Name-Based Usernames
```javascript
const ADMIN_CREDENTIALS = {
  rajesh: 'Rajesh@123',
  priya: 'Priya@456',
  suresh: 'Suresh@789',
  amit: 'Amit@321',
  kavita: 'Kavita@654',
  deepak: 'Deepak@987',
  neha: 'Neha@147',
  vikram: 'Vikram@258'
};
```

### Example 3: Role-Based Usernames
```javascript
const ADMIN_CREDENTIALS = {
  owner: 'Owner@2024!',
  director: 'Director@2024!',
  manager: 'Manager@2024!',
  accountant: 'Accountant@2024!',
  supervisor1: 'Super1@2024!',
  supervisor2: 'Super2@2024!',
  clerk1: 'Clerk1@2024!',
  clerk2: 'Clerk2@2024!'
};
```

---

## Important Rules

### Username Rules:
- ✓ Can use letters, numbers, underscores
- ✓ Case-insensitive (ADMIN = admin = Admin)
- ✓ No spaces (use underscore instead: `bms_admin`)
- ✓ Keep it simple and memorable
- ✗ Avoid special characters except underscore

### Password Rules:
- ✓ Can use any characters
- ✓ Case-sensitive (Password123 ≠ password123)
- ✓ Longer is better (8+ characters recommended)
- ✓ Mix letters, numbers, symbols for security
- ✓ Make it unique for each account

---

## Adding More Admin Accounts

Want more than 8 admins? Just add more lines:

```javascript
const ADMIN_CREDENTIALS = {
  admin: 'admin123',
  secondadmin: 'admin456',
  admin1: 'admin111',
  admin2: 'admin222',
  admin3: 'admin333',
  admin4: 'admin444',
  admin5: 'admin555',
  admin6: 'admin666',
  admin7: 'admin777',        // New admin 9
  admin8: 'admin888',        // New admin 10
  admin9: 'admin999',        // New admin 11
  newmanager: 'manager123'   // New admin 12
};
```

The system will automatically recognize any account you add here!

---

## Removing Admin Accounts

Don't need all 8 accounts? Just delete the lines:

```javascript
const ADMIN_CREDENTIALS = {
  admin: 'admin123',
  secondadmin: 'admin456',
  admin1: 'admin111'
  // Removed admin2, admin3, admin4, admin5, admin6
};
```

---

## Security Tips

### 1. Use Strong Passwords
❌ Bad: `123`, `password`, `admin`
✅ Good: `BMS@Secure2024!`, `MyStr0ng!Pass`

### 2. Don't Share Credentials
- Give each person their own account
- Don't share passwords via email/SMS
- Use secure channels to share

### 3. Change Default Passwords
- Change passwords after first deployment
- Don't use the default passwords in production

### 4. Regular Updates
- Change passwords every 3-6 months
- Update if someone leaves the company
- Update if credentials are compromised

### 5. Document Securely
- Keep a secure record of credentials
- Don't commit passwords to public repositories
- Use password managers for team

---

## After Changing Credentials

### Update Documentation
Remember to update these files with new credentials:
- `ADMIN_CREDENTIALS.md`
- `AUTHENTICATION_GUIDE.md`
- Any internal documentation

### Inform Your Team
- Notify all admins about the change
- Provide new credentials securely
- Set a deadline for first login

### Test Everything
- Test each admin account
- Verify all features work
- Check that old credentials don't work

---

## Troubleshooting

### Changed credentials but still can't login?
1. Check for typos in username/password
2. Make sure you saved the file
3. Rebuild the app: `npm run build`
4. Clear browser cache
5. Try in incognito/private mode

### Old credentials still work?
1. Make sure you saved `src/App.jsx`
2. Rebuild the app
3. Clear browser cache
4. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Locked out of all accounts?
1. Check the `ADMIN_CREDENTIALS` section in `src/App.jsx`
2. Verify the syntax is correct (commas, quotes, etc.)
3. Make sure at least one account exists
4. Rebuild and redeploy

---

## Quick Reference

**File to Edit:** `src/App.jsx`

**Section to Find:** `const ADMIN_CREDENTIALS = {`

**Line Number:** Around line 25-33

**Format:**
```javascript
username: 'password',
```

**Remember:**
- Username: case-insensitive
- Password: case-sensitive
- Don't forget commas between entries
- Last entry doesn't need a comma

---

## Need Help?

If you're not comfortable editing code:
1. Ask a developer to help
2. Make a backup before changing
3. Test in development before production
4. Keep a copy of old credentials until new ones work

---

**That's it!** You can now customize all admin credentials to match your organization's needs. 🎉
