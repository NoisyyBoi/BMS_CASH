// Script to update admin password in both code and database
// Usage: node update-admin-password.js <username> <new-password>

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length !== 2) {
  console.error('Usage: node update-admin-password.js <username> <new-password>');
  console.error('Example: node update-admin-password.js kushal MyNewPassword@123');
  process.exit(1);
}

const [username, newPassword] = args;

// Validate password strength
if (newPassword.length < 8) {
  console.error('❌ Password must be at least 8 characters long');
  process.exit(1);
}

if (!/[A-Z]/.test(newPassword)) {
  console.error('❌ Password must contain at least one uppercase letter');
  process.exit(1);
}

if (!/[a-z]/.test(newPassword)) {
  console.error('❌ Password must contain at least one lowercase letter');
  process.exit(1);
}

if (!/[0-9]/.test(newPassword)) {
  console.error('❌ Password must contain at least one number');
  process.exit(1);
}

if (!/[!@#$%^&*]/.test(newPassword)) {
  console.error('❌ Password must contain at least one special character (!@#$%^&*)');
  process.exit(1);
}

// Update App.jsx
const appJsxPath = path.join(__dirname, 'src', 'App.jsx');
let appContent = fs.readFileSync(appJsxPath, 'utf8');

// Find and replace the password in ADMIN_CREDENTIALS
const credentialsRegex = new RegExp(`(${username}:\\s*['"])([^'"]+)(['"])`, 'g');
const match = credentialsRegex.exec(appContent);

if (!match) {
  console.error(`❌ Username '${username}' not found in ADMIN_CREDENTIALS`);
  process.exit(1);
}

appContent = appContent.replace(credentialsRegex, `$1${newPassword}$3`);
fs.writeFileSync(appJsxPath, appContent, 'utf8');

console.log('✅ Password updated in App.jsx');
console.log('');
console.log('📝 Next steps:');
console.log('1. Update the password in Supabase database:');
console.log('   - Go to: https://supabase.com/dashboard/project/prjezxbbkqoieockoymh/editor');
console.log('   - Open the "admin_accounts" table');
console.log(`   - Find the row where username = '${username}'`);
console.log(`   - Update the password_hash column to: ${newPassword}`);
console.log('');
console.log('2. Or run this SQL query in Supabase SQL Editor:');
console.log('');
console.log(`UPDATE admin_accounts SET password_hash = '${newPassword}', updated_at = NOW() WHERE username = '${username}';`);
console.log('');
console.log('✅ Done! The admin can now login with the new password.');
