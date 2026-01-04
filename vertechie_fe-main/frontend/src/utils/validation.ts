/**
 * Type definition for email validation function
 */
export type ValidateEmailFn = (email: string) => boolean;

/**
 * Validates an email address using a regular expression
 * @param email - The email address to validate
 * @returns boolean indicating if the email is valid
 */
export const isValidEmail: ValidateEmailFn = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a URL format
 * @param url - The URL to validate
 * @returns boolean indicating if the URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates a phone number (allows digits, spaces, dashes, parentheses, and +)
 * @param phone - The phone number to validate
 * @returns boolean indicating if the phone is valid
 */
export const isValidPhone = (phone: string): boolean => {
  if (!phone || phone.trim() === '') return false;
  // Allow digits, spaces, dashes, parentheses, and + sign
  const phoneRegex = /^[\d\s\-\(\)\+]+$/;
  // Should have at least 10 digits
  const digitCount = phone.replace(/\D/g, '').length;
  return phoneRegex.test(phone) && digitCount >= 10;
};

/**
 * Validates a LinkedIn URL
 * @param url - The LinkedIn URL to validate
 * @returns boolean indicating if it's a valid LinkedIn URL
 */
export const isValidLinkedInUrl = (url: string): boolean => {
  if (!url || url.trim() === '') return false;
  try {
    const urlObj = new URL(url);
    return (
      (urlObj.hostname === 'www.linkedin.com' || urlObj.hostname === 'linkedin.com') &&
      urlObj.pathname.startsWith('/in/')
    );
  } catch {
    return false;
  }
};

/**
 * Validates that end date is after start date
 * @param startDate - Start date string (YYYY-MM-DD)
 * @param endDate - End date string (YYYY-MM-DD)
 * @returns boolean indicating if dates are valid
 */
export const isValidDateRange = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return true; // Allow empty dates (handled by required validation)
  const start = new Date(startDate);
  const end = new Date(endDate);
  return end >= start;
};

/**
 * Validates GPA (supports both 0-4 and 0-10 scales)
 * @param gpa - GPA string to validate
 * @returns boolean indicating if GPA is valid
 */
export const isValidGPA = (gpa: string): boolean => {
  if (!gpa || gpa.trim() === '') return true; // Optional field
  const numGpa = parseFloat(gpa);
  if (isNaN(numGpa)) return false;
  // Allow 0-4 scale (common in US) or 0-10 scale (common internationally)
  return (numGpa >= 0 && numGpa <= 4) || (numGpa >= 0 && numGpa <= 10);
}; 