/**
 * @file src/lib/sovereign-id.ts
 * @description THE SOVEREIGN GENERATOR ENGINE
 * Protocol 30: Automated Identity Creation (No Human Error).
 */

const ARABIC_TO_ENGLISH_MAP: Record<string, string> = {
  'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th', 'ج': 'j',
  'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'dh', 'ر': 'r', 'ز': 'z', 'س': 's', 'ش': 'sh',
  'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a', 'غ': 'gh', 'ف': 'f', 'ق': 'q',
  'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n', 'ه': 'h', 'و': 'w', 'ي': 'y', 'ة': 'a',
  'ى': 'a', ' ': '.' 
};

/**
 * Transliterates Arabic names to a standardized English slug for corporate email.
 */
export function generateSovereignEmail(arabicName: string): string {
  const cleanName = arabicName.trim();
  let englishSlug = '';

  for (let i = 0; i < cleanName.length; i++) {
    const char = cleanName[i];
    if (ARABIC_TO_ENGLISH_MAP[char]) {
      englishSlug += ARABIC_TO_ENGLISH_MAP[char];
    } else if (/[a-zA-Z0-9]/.test(char)) {
      englishSlug += char.toLowerCase();
    }
  }

  // Add a unique short suffix to prevent collisions
  const uniqueSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `${englishSlug || 'staff'}.${uniqueSuffix}@safar-gate.com`;
}

/**
 * Generates a high-entropy temporary PIN for initial access.
 */
export function generateTemporaryPIN(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous characters (I, O, 1, 0)
  let pin = '';
  for (let i = 0; i < 8; i++) {
    pin += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pin;
}
