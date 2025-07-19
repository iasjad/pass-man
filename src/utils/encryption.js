import CryptoJS from 'crypto-js';

const secretKey = import.meta.env.VITE_ENCRYPTION_SECRET_KEY;

if (!secretKey) {
  throw new Error(
    'VITE_ENCRYPTION_SECRET_KEY is not set in your environment variables.'
  );
}

export const encryptData = (text) => {
  if (text === null || typeof text === 'undefined') {
    return null;
  }
  return CryptoJS.AES.encrypt(text, secretKey).toString();
};

export const decryptData = (ciphertext) => {
  if (ciphertext === null || typeof ciphertext === 'undefined') {
    return null;
  }
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.error('Decryption failed:', error);
    return '';
  }
};
