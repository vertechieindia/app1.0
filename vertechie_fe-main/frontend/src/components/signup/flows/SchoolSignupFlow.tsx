import React, { useState } from 'react';
import SignupFlowContainer from '../shared/SignupFlowContainer';
import { getSignupConfig } from '../config/stepConfig';
import { SignupLocation } from '../types';
import { PublicUserRole } from '../../../types/auth';

interface SchoolSignupFlowProps {
  location: SignupLocation;
  role?: PublicUserRole;
  onComplete: (data: any) => void | Promise<void>;
  onCancel?: () => void;
}

const SchoolSignupFlow: React.FC<SchoolSignupFlowProps> = ({
  location,
  role = 'school',
  onComplete,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    // Role and location
    role: role as PublicUserRole,
    country: location,
    
    // Document Verification
    livePhoto: null as string | null,
    governmentId: null as string | null,
    ssn: null as string | null, // US only
    panCard: null as string | null, // India only
    panNumber: null as string | null, // India only - extracted PAN number
    aadhaar: null as string | null, // India only
    nino: null as string | null, // UK only - National Insurance Number
    sin: null as string | null, // Canada only - Social Insurance Number
    sozialversicherungsnummer: null as string | null, // Germany only
    ahvNumber: null as string | null, // Switzerland only - AHV-Nummer
    residentIdCard: null as string | null, // China only - Resident Identity Card
    passport: null as string | null, // China - optional passport
    
    // Personal Information
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    visaStatus: '',
    email: '',
    confirmEmail: '',
    phone: '',
    confirmPhone: '',
    fullAddress: '',
    password: '',
    confirmPassword: '',
    emailVerified: false,
    phoneVerified: false,
    
    // School Details
    schoolName: '',
    establishedYear: '',
    address: '',
    about: '',
    
    // Terms
    termsAccepted: false,
  });

  const config = getSignupConfig('school', location);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <SignupFlowContainer
      config={config}
      formData={formData}
      updateFormData={updateFormData}
      onComplete={onComplete}
      onCancel={onCancel}
    />
  );
};

export default SchoolSignupFlow;

