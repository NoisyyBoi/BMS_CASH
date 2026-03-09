// Password Hash Generator
// Run this script to generate hashed passwords for your admin accounts
// Usage: node generate-password-hashes.js

import CryptoJS from 'crypto-js';

const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

// Define your plain text passwords here
const passwords = {
  admin: 'admin123',
  secondadmin: 'admin456',
  admin1: 'admin111',
  admin2: 'admin222',
  admin3: 'admin333',
  admin4: 'admin444',
  admin5: 'admin555',
  admin6: 'admin666'
};

console.log('\n=== HASHED PASSWORDS FOR ADMIN CREDENTIALS ===\n');
console.log('Copy and paste this into src/App.jsx:\n');
console.log('const ADMIN_CREDENTIALS = {');

Object.entries(passwords).forEach(([username, password]) => {
  const hash = hashPassword(password);
  console.log(`  ${username}: '${hash}',`);
});

console.log('};\n');

console.log('\n=== INDIVIDUAL HASHES ===\n');
Object.entries(passwords).forEach(([username, password]) => {
  const hash = hashPassword(password);
  console.log(`${username}:`);
  console.log(`  Plain: ${password}`);
  console.log(`  Hash:  ${hash}\n`);
});
