import CryptoJS from 'crypto-js';

/**
 * Hash a password using SHA-256
 * @param {string} password - Plain text password
 * @returns {string} - Hashed password
 */
export const hashPassword = (password) => {
  return CryptoJS.SHA256(password).toString();
};

/**
 * Verify if a password matches a hash
 * @param {string} password - Plain text password to verify
 * @param {string} hash - Hashed password to compare against
 * @returns {boolean} - True if password matches hash
 */
export const verifyPassword = (password, hash) => {
  const hashedInput = hashPassword(password);
  return hashedInput === hash;
};

/**
 * Generate hashed passwords for admin credentials
 * Use this function to generate hashes for your passwords
 * @param {string} password - Plain text password
 */
export const generateHash = (password) => {
  const hash = hashPassword(password);
  console.log(`Password: ${password}`);
  console.log(`Hash: ${hash}`);
  return hash;
};
