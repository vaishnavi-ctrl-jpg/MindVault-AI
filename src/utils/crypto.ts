/**
 * Enterprise Grade Web Crypto API AES-GCM-256 Encryption & Key Derivation
 * Zero-Knowledge Client-Side Encryption
 */

export async function encryptVaultAES256(plaintext: string, passphrase: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(plaintext);

  // Generate 16-byte random salt and 12-byte random IV
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  // Import passphrase as key material
  const passphraseKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  // Derive 256-bit AES-GCM key using PBKDF2 with 100,000 iterations
  const aesKey = await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    passphraseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt']
  );

  // Encrypt plaintext with AES-GCM
  const ciphertextBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    aesKey,
    data
  );

  const container = {
    version: "1.0-AES256-GCM",
    algorithm: "AES-GCM-256",
    kdf: "PBKDF2-SHA256",
    iterations: 100000,
    salt: bufToHex(salt),
    iv: bufToHex(iv),
    ciphertext: bufToHex(new Uint8Array(ciphertextBuffer))
  };

  return JSON.stringify(container, null, 2);
}

function bufToHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
