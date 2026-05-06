/**
 * Company tax ID in `gst_number`: Indian GSTIN (strict) or US EIN (IRS prefix list).
 * When `country` is IN or US, only that jurisdiction's format is accepted.
 */

export type TaxCountry = 'IN' | 'US';

const GSTIN_STRUCT = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/;

const LUHN_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const STATE_CODES = new Set([
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38',
]);

const PAN_HOLDER_TYPES = new Set(['A', 'B', 'C', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'P', 'T']);

const PAN_BODY = /^[A-Z]{5}[0-9]{4}[A-Z]$/;

/** IRS-published valid EIN prefixes (first two digits). */
const VALID_EIN_PREFIXES = new Set([
  '01', '02', '03', '04', '05', '06', '10', '11', '12', '13', '14', '15', '16',
  '20', '21', '22', '23', '24', '25', '26', '27', '30', '31', '32', '33', '34',
  '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47',
  '48', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61',
  '62', '63', '64', '65', '66', '67', '68', '71', '72', '73', '74', '75', '76',
  '77', '80', '81', '82', '83', '84', '85', '86', '87', '88', '90', '91', '92',
  '93', '94', '95', '98', '99',
]);

export function isValidEinNineDigits(digits: string): boolean {
  if (digits.length !== 9 || !/^\d{9}$/.test(digits)) return false;
  if (digits === '000000000') return false;
  if (new Set(digits).size === 1) return false;
  return VALID_EIN_PREFIXES.has(digits.slice(0, 2));
}

function luhnMod36Valid(gstin15: string): boolean {
  const n = LUHN_ALPHABET.length;
  const values = [...gstin15].reverse().map((ch) => LUHN_ALPHABET.indexOf(ch));
  let total = 0;
  for (let i = 0; i < values.length; i += 1) {
    if (i % 2 === 0) {
      total += values[i];
    } else {
      const prod = values[i] * 2;
      total += Math.floor(prod / n) + (prod % n);
    }
  }
  return total % n === 0;
}

function embeddedPanValid(pan10: string): boolean {
  if (pan10.length !== 10 || !PAN_BODY.test(pan10)) return false;
  if (!PAN_HOLDER_TYPES.has(pan10[3])) return false;
  if (pan10.slice(5, 9) === '0000') return false;
  return true;
}

export function isValidGstin(compactUpper: string): boolean {
  if (compactUpper.length !== 15 || !GSTIN_STRUCT.test(compactUpper)) return false;
  if (!STATE_CODES.has(compactUpper.slice(0, 2))) return false;
  if (compactUpper[13] !== 'Z') return false;
  if (!embeddedPanValid(compactUpper.slice(2, 12))) return false;
  return luhnMod36Valid(compactUpper);
}

/** Map API / profile country string to IN | US | null (null = accept either if valid). */
export function coerceTaxCountry(raw: unknown): TaxCountry | null {
  if (raw == null || typeof raw !== 'string') return null;
  const u = raw.trim().toUpperCase();
  if (u === 'IN' || u === 'IND' || u === 'INDIA') return 'IN';
  if (u === 'US' || u === 'USA' || u.startsWith('UNITED STATES')) return 'US';
  return null;
}

function normalizeEin(digits: string): string | null {
  return isValidEinNineDigits(digits) ? `${digits.slice(0, 2)}-${digits.slice(2)}` : null;
}

export const COMPANY_TAX_ID_HELPER =
  'India: valid 15-character GSTIN. United States: 9-digit EIN with valid IRS prefix (e.g. 12-3456789).';

export const COMPANY_TAX_ID_HELPER_IN =
  'Enter a valid 15-character Indian GSTIN (state + PAN + entity + Z + check digit).';

export const COMPANY_TAX_ID_HELPER_US =
  'Enter a valid 9-digit US EIN (valid IRS-assigned prefix), e.g. 12-3456789.';

/** Normalized value for API, or null if empty/invalid. */
export function normalizeCompanyTaxId(raw: string, country?: TaxCountry | null): string | null {
  const t = raw.trim();
  if (!t) return null;
  const compact = t.replace(/\s+/g, '').toUpperCase();
  const digits = t.replace(/\D/g, '');

  if (country === 'IN') {
    if (isValidGstin(compact)) return compact;
    return null;
  }
  if (country === 'US') {
    if (digits.length === 9 && /^\d{9}$/.test(digits)) return normalizeEin(digits);
    return null;
  }

  if (isValidGstin(compact)) return compact;
  if (digits.length === 9 && /^\d{9}$/.test(digits)) return normalizeEin(digits);
  return null;
}

export function taxIdHelperForCountry(country: TaxCountry | null): string {
  if (country === 'IN') return COMPANY_TAX_ID_HELPER_IN;
  if (country === 'US') return COMPANY_TAX_ID_HELPER_US;
  return COMPANY_TAX_ID_HELPER;
}

/** Empty allowed; non-empty must be valid for optional `country` hint. */
export function validateCompanyTaxIdOptional(
  raw: string,
  country?: TaxCountry | null,
): string | null {
  if (!raw.trim()) return null;
  return normalizeCompanyTaxId(raw, country)
    ? null
    : `Invalid tax ID. ${taxIdHelperForCountry(country ?? null)}`;
}

/** Non-empty required and must be valid. */
export function validateCompanyTaxIdRequired(
  raw: string,
  country?: TaxCountry | null,
): string | null {
  if (!raw.trim()) return 'Tax identifier is required.';
  return normalizeCompanyTaxId(raw, country)
    ? null
    : `Invalid tax ID. ${taxIdHelperForCountry(country ?? null)}`;
}
