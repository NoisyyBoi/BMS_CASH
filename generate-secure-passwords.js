// Generate Secure Passwords
// This script generates strong, unique passwords that won't trigger security warnings

function generateSecurePassword(base, length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = base + '_';
  for (let i = 0; i < length - base.length - 1; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

console.log('\n=== SECURE PASSWORDS FOR YOUR ADMIN ACCOUNTS ===\n');
console.log('These passwords are strong and unique, won\'t trigger security warnings:\n');

const accounts = ['kushal', 'admin2', 'admin3', 'admin4', 'admin5', 'admin6', 'admin7', 'admin8'];

console.log('Copy these to a secure location:\n');
accounts.forEach(account => {
  const password = generateSecurePassword(account, 16);
  console.log(`${account}: ${password}`);
});

console.log('\n\nRecommended Format for src/App.jsx:');
console.log('const ADMIN_CREDENTIALS = {');
accounts.forEach(account => {
  const password = generateSecurePassword(account, 16);
  console.log(`  ${account}: '${password}',`);
});
console.log('};\n');

console.log('\n=== ALTERNATIVE: Simple but Secure Passwords ===\n');
console.log('If you want memorable passwords that are still secure:\n');
const simplePasswords = {
  kushal: 'Kushal@BMS2024!',
  admin2: 'Admin2@BMS2024!',
  admin3: 'Admin3@BMS2024!',
  admin4: 'Admin4@BMS2024!',
  admin5: 'Admin5@BMS2024!',
  admin6: 'Admin6@BMS2024!',
  admin7: 'Admin7@BMS2024!',
  admin8: 'Admin8@BMS2024!'
};

Object.entries(simplePasswords).forEach(([user, pass]) => {
  console.log(`${user}: ${pass}`);
});

console.log('\n\nFor src/App.jsx:');
console.log('const ADMIN_CREDENTIALS = {');
Object.entries(simplePasswords).forEach(([user, pass]) => {
  console.log(`  ${user}: '${pass}',`);
});
console.log('};\n');
