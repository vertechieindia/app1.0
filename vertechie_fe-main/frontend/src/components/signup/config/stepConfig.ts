/**
 * Step configurations for each signup type and location
 */

import { StepConfig, SignupFlowConfig } from '../types';
import DocumentVerification from '../steps/DocumentVerification';
import PersonalInformation from '../steps/PersonalInformation';
import WorkExperience from '../steps/WorkExperience';
import EducationDetails from '../steps/EducationDetails';
import CompanyDetails from '../steps/CompanyDetails';
import SchoolDetails from '../steps/SchoolDetails';
import ReviewSubmit from '../steps/ReviewSubmit';

import { SignupLocation } from '../types';
import { isValidPersonName } from '../../../utils/validation';

// Validation functions
const validateDocumentVerification = (data: any, location?: SignupLocation): boolean | string => {
  // Check live photo - required for all
  if (!data.livePhoto) {
    return 'Live photo is required. Please complete the live photo verification.';
  }

  // Check location-specific documents
  if (location === 'IN') {
    // For India: require Aadhaar/DL and PAN card
    if (!data.aadhaar) {
      return 'Government ID (Aadhaar/DL) is required. Please capture and verify your government ID document.';
    }
    if (!data.panCard) {
      return 'PAN card is required. Please capture and verify your PAN card.';
    }
    // Also check if data extraction was successful
    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return 'Government ID details extraction failed. Please ensure First Name, Last Name, and Date of Birth are extracted correctly.';
    }
    if (!data.panNumber) {
      return 'PAN number extraction failed. Please ensure PAN number is extracted correctly.';
    }
  } else if (location === 'US') {
    // For US: require Government ID and SSN
    if (!data.governmentId) {
      return 'Government ID is required. Please capture and verify your government ID document.';
    }
    if (!data.ssn) {
      return 'SSN is required. Please capture and verify your SSN document.';
    }
    // Also check if data extraction was successful
    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return 'Government ID details extraction failed. Please ensure First Name, Last Name, and Date of Birth are extracted correctly.';
    }
  } else if (location === 'UK') {
    // For UK: require Government ID and National Insurance Number (NINO)
    if (!data.governmentId) {
      return 'Government ID (Passport/Driving Licence) is required. Please capture and verify your document.';
    }
    if (!data.nino) {
      return 'National Insurance Number (NINO) is required. Please capture and verify your NINO document.';
    }
    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return 'Government ID details extraction failed. Please ensure First Name, Last Name, and Date of Birth are extracted correctly.';
    }
  } else if (location === 'CA') {
    // For Canada: require Government ID and Social Insurance Number (SIN)
    if (!data.governmentId) {
      return 'Government ID (Passport/Provincial ID) is required. Please capture and verify your document.';
    }
    if (!data.sin) {
      return 'Social Insurance Number (SIN) is required. Please capture and verify your SIN document.';
    }
    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return 'Government ID details extraction failed. Please ensure First Name, Last Name, and Date of Birth are extracted correctly.';
    }
  } else if (location === 'DE') {
    // For Germany: require Government ID and Sozialversicherungsnummer
    if (!data.governmentId) {
      return 'Government ID (Personalausweis/Passport) is required. Please capture and verify your document.';
    }
    if (!data.svnr) {
      return 'Sozialversicherungsnummer is required. Please capture and verify your document.';
    }
    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return 'Government ID details extraction failed. Please ensure First Name, Last Name, and Date of Birth are extracted correctly.';
    }
  } else if (location === 'CH') {
    // For Switzerland: require Government ID and AHV-Nummer
    if (!data.governmentId) {
      return 'Government ID (ID/Passport) is required. Please capture and verify your document.';
    }
    if (!data.ahv) {
      return 'AHV-Nummer (Sozialversicherungsnummer) is required. Please capture and verify your document.';
    }
    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return 'Government ID details extraction failed. Please ensure First Name, Last Name, and Date of Birth are extracted correctly.';
    }
  } else if (location === 'CN') {
    // For China: require Resident Identity Card
    if (!data.governmentId) {
      return 'Resident Identity Card (身份证) is required. Please capture and verify your document.';
    }
    if (!data.firstName || !data.lastName || !data.dateOfBirth) {
      return 'Identity Card details extraction failed. Please ensure Name and Date of Birth are extracted correctly.';
    }
  }

  return true;
};

const validatePersonalInformation = (data: any): boolean | string => {
  if (!data.firstName) return 'First name is required';
  if (!data.lastName) return 'Last name is required';
  if (!isValidPersonName(data.firstName)) return 'First name can contain only letters';
  if (!isValidPersonName(data.lastName)) return 'Last name can contain only letters';
  if (!data.email) return 'Email is required';
  // Phone is optional if skipped
  if (!data.phoneSkipped && !data.phone) return 'Phone number is required';
  
  // Password validation
  if (!data.password) {
    return 'Password is required';
  }
  
  // Password strength validation
  if (data.password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(data.password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(data.password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  // Check for at least one number
  if (!/\d/.test(data.password)) {
    return 'Password must contain at least one number';
  }
  
  // Check for at least one special character
  if (!/[@$!%*?&]/.test(data.password)) {
    return 'Password must contain at least one special character (@$!%*?&)';
  }
  
  // Confirm password validation
  if (!data.confirmPassword) {
    return 'Please confirm your password';
  }
  
  // Check if passwords match
  if (data.password !== data.confirmPassword) {
    return 'Passwords do not match';
  }
  
  return true;
};

// const validateWorkExperience = (data: any): boolean | string => {
//   if (!data.experience || data.experience.length === 0) {
//     return 'At least one work experience is required';
//   }
//   return true;
// };

const validateEducation = (data: any): boolean | string => {
  if (!data.education || data.education.length === 0) {
    return 'At least one education entry is required';
  }
  return true;
};

const validateCompanyDetails = (data: any): boolean | string => {
  if (!data.companyName || !data.companyName.trim()) {
    return 'Hiring Company Name is required';
  }
  if (!data.companyEmail || !data.companyEmail.trim()) {
    return 'Hiring Company Email ID is required';
  }
  if (!data.companyWebsite || !data.companyWebsite.trim()) {
    return 'Hiring Company Website URL is required';
  }
  return true;
};

const validateSchoolDetails = (data: any): boolean | string => {
  if (!data.schoolName || !data.schoolName.trim()) {
    return 'School Name is required';
  }
  if (!data.establishedYear || !data.establishedYear.trim()) {
    return 'Established Year is required';
  }
  // Location-specific validation
  const isIndia = data.country === 'IN' || data.location === 'IN' || data.country === 'India';
  if (isIndia) {
    // India: Address is required
    if (!data.address || !data.address.trim()) {
      return 'Address is required';
    }
  } else {
    // US: Started Date is required
    if (!data.startedDate || !data.startedDate.trim()) {
      return 'Date Company Started is required';
    }
  }
  if (!data.about || !data.about.trim()) {
    return 'About School is required';
  }
  return true;
};

const validateReview = (data: any): boolean | string => {
  if (!data.termsAccepted) return 'You must accept the terms and conditions';
  return true;
};

// Techie US Configuration
export const techieUSConfig: SignupFlowConfig = {
  type: 'techie',
  location: 'US',
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: (data: any) => validateDocumentVerification(data, 'US'),
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: validatePersonalInformation,
    },
    {
      id: 'work-experience',
      label: 'Work Experience',
      component: WorkExperience,
      // validation: validateWorkExperience,
    },
    {
      id: 'education',
      label: 'Education Details',
      component: EducationDetails,
      validation: validateEducation, // At least one education entry is required
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: validateReview,
    },
  ],
};

// Techie India Configuration
export const techieIndiaConfig: SignupFlowConfig = {
  type: 'techie',
  location: 'IN',
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: (data: any) => validateDocumentVerification(data, 'IN'),
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: validatePersonalInformation,
    },
    {
      id: 'work-experience',
      label: 'Work Experience',
      component: WorkExperience,
      // validation: validateWorkExperience,
    },
    {
      id: 'education',
      label: 'Education Details',
      component: EducationDetails,
      validation: validateEducation, // At least one education entry is required
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: validateReview,
    },
  ],
};

// HR US Configuration (4 steps: Document Verification, Personal Information, Company Details, Review)
export const hrUSConfig: SignupFlowConfig = {
  type: 'hr',
  location: 'US',
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: (data: any) => validateDocumentVerification(data, 'US'),
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: validatePersonalInformation,
    },
    {
      id: 'company-details',
      label: 'Company Details',
      component: CompanyDetails,
      validation: validateCompanyDetails,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: validateReview,
    },
  ],
};

// HR India Configuration (4 steps: Document Verification, Personal Information, Company Details, Review)
export const hrIndiaConfig: SignupFlowConfig = {
  type: 'hr',
  location: 'IN',
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: (data: any) => validateDocumentVerification(data, 'IN'),
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: validatePersonalInformation,
    },
    {
      id: 'company-details',
      label: 'Company Details',
      component: CompanyDetails,
      validation: validateCompanyDetails,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: validateReview,
    },
  ],
};

// Company US Configuration (4 steps: Document Verification, Personal Information, Company Details, Review)
// No validation restrictions - user can navigate freely between steps
export const companyUSConfig: SignupFlowConfig = {
  type: 'company',
  location: 'US',
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'company-details',
      label: 'Company Details',
      component: CompanyDetails,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: undefined, // No validation - allow free navigation
    },
  ],
};

// Company India Configuration (4 steps: Document Verification, Personal Information, Company Details, Review)
// No validation restrictions - user can navigate freely between steps
export const companyIndiaConfig: SignupFlowConfig = {
  type: 'company',
  location: 'IN',
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'company-details',
      label: 'Company Details',
      component: CompanyDetails,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: undefined, // No validation - allow free navigation
    },
  ],
};

// School US Configuration (4 steps: Document Verification, Personal Information, School Details, Review)
export const schoolUSConfig: SignupFlowConfig = {
  type: 'school',
  location: 'US',
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'school-details',
      label: 'School Details',
      component: SchoolDetails,
      validation: validateSchoolDetails,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: undefined, // No validation - allow free navigation
    },
  ],
};

// School India Configuration (4 steps: Document Verification, Personal Information, School Details, Review)
export const schoolIndiaConfig: SignupFlowConfig = {
  type: 'school',
  location: 'IN',
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: undefined, // No validation - allow free navigation
    },
    {
      id: 'school-details',
      label: 'School Details',
      component: SchoolDetails,
      validation: validateSchoolDetails,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: undefined, // No validation - allow free navigation
    },
  ],
};

// Generic config generator for new countries (UK, CA, DE, CH, CN)
const createTechieConfig = (location: SignupLocation): SignupFlowConfig => ({
  type: 'techie',
  location,
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: (data: any) => validateDocumentVerification(data, location),
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: validatePersonalInformation,
    },
    {
      id: 'work-experience',
      label: 'Work Experience',
      component: WorkExperience,
    },
    {
      id: 'education',
      label: 'Education Details',
      component: EducationDetails,
      validation: validateEducation,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: validateReview,
    },
  ],
});

const createHRConfig = (location: SignupLocation): SignupFlowConfig => ({
  type: 'hr',
  location,
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: (data: any) => validateDocumentVerification(data, location),
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: validatePersonalInformation,
    },
    {
      id: 'company-details',
      label: 'Company Details',
      component: CompanyDetails,
      validation: validateCompanyDetails,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: validateReview,
    },
  ],
});

const createCompanyConfig = (location: SignupLocation): SignupFlowConfig => ({
  type: 'company',
  location,
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: undefined,
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: undefined,
    },
    {
      id: 'company-details',
      label: 'Company Details',
      component: CompanyDetails,
      validation: undefined,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: undefined,
    },
  ],
});

const createSchoolConfig = (location: SignupLocation): SignupFlowConfig => ({
  type: 'school',
  location,
  steps: [
    {
      id: 'document-verification',
      label: 'Document Verification',
      component: DocumentVerification,
      validation: undefined,
    },
    {
      id: 'personal-information',
      label: 'Personal Information',
      component: PersonalInformation,
      validation: undefined,
    },
    {
      id: 'school-details',
      label: 'School Details',
      component: SchoolDetails,
      validation: validateSchoolDetails,
    },
    {
      id: 'review',
      label: 'Review & Submit',
      component: ReviewSubmit,
      validation: undefined,
    },
  ],
});

// Helper function to get config
export const getSignupConfig = (
  type: 'techie' | 'hr' | 'company' | 'school',
  location: SignupLocation
): SignupFlowConfig => {
  // Predefined configs for US and India
  const configMap: Record<string, SignupFlowConfig> = {
    'techie-US': techieUSConfig,
    'techie-IN': techieIndiaConfig,
    'hr-US': hrUSConfig,
    'hr-IN': hrIndiaConfig,
    'company-US': companyUSConfig,
    'company-IN': companyIndiaConfig,
    'school-US': schoolUSConfig,
    'school-IN': schoolIndiaConfig,
  };

  // Check if we have a predefined config
  const predefinedKey = `${type}-${location}`;
  if (configMap[predefinedKey]) {
    return configMap[predefinedKey];
  }

  // Generate config dynamically for other countries (UK, CA, DE, CH, CN)
  switch (type) {
    case 'techie':
      return createTechieConfig(location);
    case 'hr':
      return createHRConfig(location);
    case 'company':
      return createCompanyConfig(location);
    case 'school':
      return createSchoolConfig(location);
    default:
      return createTechieConfig(location);
  }
};

