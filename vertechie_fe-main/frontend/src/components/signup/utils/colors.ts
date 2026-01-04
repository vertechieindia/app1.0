/**
 * Color scheme for different signup types and locations
 * Each type has distinct colors, and each country has different shades within each type
 */

export type SignupType = 'techie' | 'hr' | 'company' | 'school';
export type SignupLocation = 'US' | 'IN' | 'UK' | 'CA' | 'DE' | 'CH' | 'CN';

interface ColorScheme {
  primary: string;
  light: string;
  dark: string;
  border: string;
}

type CountryColorSchemes = Record<SignupLocation, ColorScheme>;

const COUNTRY_COLORS: CountryColorSchemes = {
  US: {
    primary: '#1976d2', // Light thick blue
    light: '#e3f2fd',
    dark: '#1565c0',
    border: '#1976d2',
  },
  IN: {
    primary: '#004D40', // Peacock green
    light: '#e0f2f1',
    dark: '#003d33',
    border: '#004D40',
  },
  UK: {
    primary: '#1565c0', // Royal blue
    light: '#e3f2fd',
    dark: '#0d47a1',
    border: '#1565c0',
  },
  CA: {
    primary: '#c62828', // Canadian red
    light: '#ffebee',
    dark: '#b71c1c',
    border: '#c62828',
  },
  DE: {
    primary: '#212121', // German black
    light: '#f5f5f5',
    dark: '#000000',
    border: '#212121',
  },
  CH: {
    primary: '#d32f2f', // Swiss red
    light: '#ffcdd2',
    dark: '#b71c1c',
    border: '#d32f2f',
  },
  CN: {
    primary: '#c62828', // Chinese red
    light: '#ffebee',
    dark: '#b71c1c',
    border: '#c62828',
  },
};

const COLOR_SCHEMES: Record<SignupType, CountryColorSchemes> = {
  techie: COUNTRY_COLORS,
  hr: COUNTRY_COLORS,
  company: COUNTRY_COLORS,
  school: COUNTRY_COLORS,
};

/**
 * Get color scheme for a specific signup type and location
 */
export const getColorScheme = (type: SignupType, location: SignupLocation): ColorScheme => {
  return COLOR_SCHEMES[type][location];
};

/**
 * Get primary color for a specific signup type and location
 */
export const getPrimaryColor = (type: SignupType, location: SignupLocation): string => {
  return COLOR_SCHEMES[type][location].primary;
};

/**
 * Get light color for a specific signup type and location
 */
export const getLightColor = (type: SignupType, location: SignupLocation): string => {
  return COLOR_SCHEMES[type][location].light;
};

/**
 * Get dark color for a specific signup type and location
 */
export const getDarkColor = (type: SignupType, location: SignupLocation): string => {
  return COLOR_SCHEMES[type][location].dark;
};


