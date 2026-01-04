/**
 * Utility functions for formatting data
 */

/**
 * Format date to MM/DD/YYYY format
 */
export const formatDateToMMDDYYYY = (dateString: string): string => {
  if (!dateString) return '';
  
  // Remove any whitespace
  dateString = dateString.trim();
  
  // If already in MM/DD/YYYY format, validate and return
  if (dateString.includes('/')) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      const [part1, part2, part3] = parts;
      // Check if it's already in MM/DD/YYYY format (first part <= 12, second part <= 31, third part is 4 digits)
      if (part1.length === 2 && part2.length === 2 && part3.length === 4) {
        const month = parseInt(part1, 10);
        const day = parseInt(part2, 10);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return dateString; // Already in MM/DD/YYYY format
        }
      }
      // If it's in wrong format like MM/YYYY/DD, fix it
      if (part1.length === 2 && part2.length === 4 && part3.length === 2) {
        const month = parseInt(part1, 10);
        const day = parseInt(part3, 10);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
          return `${part1}/${part3}/${part2}`; // Convert MM/YYYY/DD to MM/DD/YYYY
        }
      }
      // If it's in DD/MM/YYYY format, convert to MM/DD/YYYY
      if (part1.length === 2 && part2.length === 2 && part3.length === 4) {
        const first = parseInt(part1, 10);
        const second = parseInt(part2, 10);
        if (first > 12 && second <= 12) {
          // First part is day (>12), second is month (<=12), so it's DD/MM/YYYY
          return `${part2}/${part1}/${part3}`; // Convert to MM/DD/YYYY
        }
      }
    }
  }
  
  // If in YYYY-MM-DD or DD-MM-YYYY format (with dashes), convert to MM/DD/YYYY
  if (dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [part1, part2, part3] = parts;
      
      // Check if it's YYYY-MM-DD format (first part is 4 digits - year)
      if (part1.length === 4 && part2.length === 2 && part3.length === 2) {
        const [year, month, day] = parts;
        const monthNum = parseInt(month, 10);
        const dayNum = parseInt(day, 10);
        const yearNum = parseInt(year, 10);
        // Validate ranges
        if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum >= 1900 && yearNum <= 2100) {
          return `${month}/${day}/${year}`;
        }
      }
      // Check if it's DD-MM-YYYY or MM-DD-YYYY format (both have 2-2-4 pattern)
      else if (part1.length === 2 && part2.length === 2 && part3.length === 4) {
        const firstNum = parseInt(part1, 10);
        const secondNum = parseInt(part2, 10);
        const yearNum = parseInt(part3, 10);
        
        // If first part > 12, it must be DD-MM-YYYY (day can be > 12, month cannot)
        if (firstNum > 12 && secondNum >= 1 && secondNum <= 12 && yearNum >= 1900 && yearNum <= 2100) {
          // DD-MM-YYYY format: convert to MM/DD/YYYY
          const [day, month, year] = parts;
          return `${month}/${day}/${year}`;
        }
        // If first part <= 12 and second part <= 31, it's likely MM-DD-YYYY (US format)
        else if (firstNum >= 1 && firstNum <= 12 && secondNum >= 1 && secondNum <= 31 && yearNum >= 1900 && yearNum <= 2100) {
          // MM-DD-YYYY format: already in correct order, just change dashes to slashes
          const [month, day, year] = parts;
          return `${month}/${day}/${year}`;
        }
        // If second part > 12, it must be DD-MM-YYYY (month cannot be > 12)
        else if (secondNum > 12 && firstNum >= 1 && firstNum <= 31 && yearNum >= 1900 && yearNum <= 2100) {
          // DD-MM-YYYY format: convert to MM/DD/YYYY
          const [day, month, year] = parts;
          return `${month}/${day}/${year}`;
        }
      }
    }
  }
  
  // If we get here, return the original string (might be in an unexpected format)
  return dateString;
};

/**
 * Format date to DD/MM/YYYY format
 */
export const formatDateToDDMMYYYY = (dateString: string): string => {
  if (!dateString) return '';
  
  // If already in DD/MM/YYYY format, return as is
  if (dateString.includes('/') && dateString.length <= 10) {
    const parts = dateString.split('/');
    if (parts.length === 3) {
      // Check if it's DD/MM/YYYY format (first part is day, <= 31)
      if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        // If day <= 31 and month <= 12, it's likely DD/MM/YYYY
        if (day <= 31 && month <= 12) {
          return dateString;
        }
      }
      // If it's MM/DD/YYYY format, convert to DD/MM/YYYY
      if (parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
        const first = parseInt(parts[0], 10);
        const second = parseInt(parts[1], 10);
        // If first part > 12, it's likely DD/MM/YYYY already
        if (first > 12 && second <= 12) {
          return dateString; // Already DD/MM/YYYY
        }
        // Otherwise swap to convert MM/DD/YYYY to DD/MM/YYYY
        return `${parts[1]}/${parts[0]}/${parts[2]}`;
      }
    }
  }
  
  // If in YYYY-MM-DD format, convert to DD/MM/YYYY
  if (dateString.includes('-')) {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      // Validate parts
      if (year.length === 4 && month.length === 2 && day.length === 2) {
        return `${day}/${month}/${year}`;
      }
    }
  }
  
  return dateString;
};

/**
 * Format phone number for Firebase (add country code if needed)
 */
export const formatPhoneForFirebase = (phone: string): string => {
  let phoneNumber = phone;
  // If phone doesn't start with +, assume it's a US number and add +1
  if (!phoneNumber.startsWith('+')) {
    // Remove any non-digit characters
    phoneNumber = phoneNumber.replace(/\D/g, '');
    // Add country code if needed (assuming US +1)
    if (phoneNumber.length === 10) {
      phoneNumber = `+1${phoneNumber}`;
    } else {
      phoneNumber = `+${phoneNumber}`;
    }
  }
  return phoneNumber;
};

