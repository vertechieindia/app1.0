import React, { useState, useCallback } from 'react';
import { Box, Container, Paper, IconButton, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { StepComponentProps, StepConfig, SignupFlowConfig } from '../types';
import StepProgressIndicator from './StepProgressIndicator';
import { getPrimaryColor } from '../utils/colors';
import { getApiUrl, API_ENDPOINTS } from '../../../config/api';
import SuccessScreen from '../steps/ReviewSubmit/SuccessScreen';
import { isValidPersonName } from '../../../utils/validation';

interface SignupFlowContainerProps {
  config: SignupFlowConfig;
  formData: any;
  updateFormData: (updates: any) => void;
  onComplete: (data: any) => void | Promise<void>;
  onCancel?: () => void;
}

const SignupFlowContainer: React.FC<SignupFlowContainerProps> = ({
  config,
  formData,
  updateFormData,
  onComplete,
  onCancel,
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const currentStepConfig = config.steps[activeStep];
  const CurrentStepComponent = currentStepConfig?.component;

  const validateCurrentStep = useCallback((): boolean => {
    if (!currentStepConfig?.validation) {
      return true;
    }

    const validationResult = currentStepConfig.validation(formData);
    if (typeof validationResult === 'string') {
      setErrors({ submit: validationResult });
      return false;
    }
    return validationResult;
  }, [currentStepConfig, formData]);

  const handleNext = useCallback(async () => {
    console.log('handleNext called:', {
      activeStep,
      stepId: currentStepConfig?.id,
      stepLabel: currentStepConfig?.label,
    });

    // Sequential validation for personal-information step
    if (currentStepConfig?.id === 'personal-information') {
      // Validate first/last names (letters only)
      if (!formData.firstName || formData.firstName.trim() === '') {
        setErrors({ firstName: 'First name is required' });
        return;
      }
      if (!isValidPersonName(formData.firstName)) {
        setErrors({ firstName: 'First name can contain only letters' });
        return;
      }
      if (!formData.lastName || formData.lastName.trim() === '') {
        setErrors({ lastName: 'Last name is required' });
        return;
      }
      if (!isValidPersonName(formData.lastName)) {
        setErrors({ lastName: 'Last name can contain only letters' });
        return;
      }

      // Step 1: Check email first
      if (!formData.email || formData.email.trim() === '') {
        setErrors({ email: 'Email is required' });
        // Scroll to email field
        setTimeout(() => {
          const emailField = document.querySelector('[name="email"]');
          if (emailField) {
            (emailField as HTMLElement).focus();
            (emailField as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        return;
      }
      
      // Validate email format
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setErrors({ email: 'Please enter a valid email address' });
        return;
      }
      
      // Step 2: If email is filled, check phone (skip if phoneSkipped is true)
      if (!formData.phoneSkipped && (!formData.phone || formData.phone.trim() === '')) {
        setErrors({ phone: 'Phone number is required' });
        // Scroll to phone field
        setTimeout(() => {
          const phoneField = document.querySelector('[name="phone"]');
          if (phoneField) {
            (phoneField as HTMLElement).focus();
            (phoneField as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        return;
      }
      
      // Step 3: If phone is filled, check password
      if (!formData.password || formData.password.trim() === '') {
        setErrors({ password: 'Password is required' });
        // Scroll to password field
        setTimeout(() => {
          const passwordField = document.querySelector('[name="password"]');
          if (passwordField) {
            (passwordField as HTMLElement).focus();
            (passwordField as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
        return;
      }
      
      // Password strength validation
      if (formData.password.length < 8) {
        setErrors({ password: 'Password must be at least 8 characters long' });
        return;
      }
      
      if (!/[A-Z]/.test(formData.password)) {
        setErrors({ password: 'Password must contain at least one uppercase letter' });
        return;
      }
      
      if (!/[a-z]/.test(formData.password)) {
        setErrors({ password: 'Password must contain at least one lowercase letter' });
        return;
      }
      
      if (!/\d/.test(formData.password)) {
        setErrors({ password: 'Password must contain at least one number' });
        return;
      }
      
      if (!/[@$!%*?&]/.test(formData.password)) {
        setErrors({ password: 'Password must contain at least one special character (@$!%*?&)' });
        return;
      }
      
      if (!formData.confirmPassword || formData.confirmPassword.trim() === '') {
        setErrors({ confirmPassword: 'Please confirm your password' });
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' });
        return;
      }
    }

    if (!validateCurrentStep()) {
      console.log('Validation failed');
      return;
    }

    // If this is the Personal Information step, register the user
    // For company and school signup, this should happen when clicking Next after personal information
    if (currentStepConfig?.id === 'personal-information') {
      // Check if this is company or school signup
      const isCompanySignup = formData.role === 'company';
      const isSchoolSignup = formData.role === 'school';
      console.log('Personal Information step - Registering user:', {
        role: formData.role,
        isCompanySignup,
        isSchoolSignup,
        location: config.location,
      });
      
      setLoading(true);
      try {
        // Extract last 4 digits from PAN or SSN
        let govId = '';
        // Debug: Log all formData to see what's available
        console.log('FormData for gov_id extraction:', {
          location: config.location,
          panNumber: formData.panNumber,
          panCard: formData.panCard,
          ssn: formData.ssn,
          allFormDataKeys: Object.keys(formData),
        });
        
        if (config.location === 'IN') {
          // For India, check panNumber first (extracted from PAN card)
          // PAN format: ABCDE1234F - contains both letters and numbers
          // We need last 4 characters (including letters), not just digits
          if (formData.panNumber) {
            const panNumber = formData.panNumber.toString().trim();
            console.log('PAN number (raw):', panNumber, 'Length:', panNumber.length);
            
            // Take last 4 characters (preserving letters and numbers)
            if (panNumber.length >= 4) {
              govId = panNumber.slice(-4).toUpperCase(); // Convert to uppercase for consistency
              console.log('Extracted PAN last 4 characters:', govId);
            } else if (panNumber.length > 0) {
              // If PAN is less than 4 characters, use what we have
              govId = panNumber.toUpperCase();
              console.log('Using full PAN (less than 4 characters):', govId);
            }
          }
          
          // If panNumber is not available, check if panCard has the number embedded
          if (!govId && formData.panCard) {
            const panCardStr = formData.panCard.toString();
            console.log('Checking panCard, length:', panCardStr.length);
            // Try to extract from panCard if it's a string with PAN format (not base64 image)
            if (panCardStr.length < 1000 && panCardStr.length > 0) {
              // Not a base64 image, might be a PAN string
              const panNumber = panCardStr.trim();
              console.log('PAN extracted from panCard:', panNumber);
              if (panNumber.length >= 4) {
                govId = panNumber.slice(-4).toUpperCase();
                console.log('Extracted PAN last 4 characters from panCard:', govId);
              } else if (panNumber.length > 0) {
                govId = panNumber.toUpperCase();
                console.log('Using full PAN from panCard:', govId);
              }
            }
          }
          
          // Last resort: check if panNumber exists in formData with different casing or key
          if (!govId) {
            const possibleKeys = ['panNumber', 'pan_number', 'PAN', 'pan', 'idNumber', 'id_number'];
            for (const key of possibleKeys) {
              if ((formData as any)[key]) {
                const value = (formData as any)[key].toString().trim();
                if (value.length >= 4) {
                  govId = value.slice(-4).toUpperCase();
                  console.log(`Extracted PAN from ${key}:`, govId);
                  break;
                } else if (value.length > 0) {
                  govId = value.toUpperCase();
                  console.log(`Using full PAN from ${key}:`, govId);
                  break;
                }
              }
            }
          }
        } else if (config.location === 'US') {
          // For US, check ssn (extracted number or image)
          if (formData.ssn) {
            const ssnStr = formData.ssn.toString();
            console.log('SSN string length:', ssnStr.length);
            // Check if it's a number string (not image data - image data would be much longer)
            if (ssnStr.length < 100 && ssnStr.length > 0) {
              // Likely a number string, not base64 image
              const ssn = ssnStr.replace(/\D/g, ''); // Remove non-digits
              console.log('SSN after cleaning:', ssn, 'Length:', ssn.length);
              if (ssn.length >= 4) {
                govId = ssn.slice(-4);
                console.log('Extracted SSN last 4 digits:', govId);
              } else if (ssn.length > 0) {
                // If SSN is less than 4 digits, use what we have
                govId = ssn;
                console.log('Using full SSN (less than 4 digits):', govId);
              }
            }
          }
        }
        
        if (!govId) {
          console.error('Error: gov_id is empty. PAN/SSN may not have been extracted or stored correctly.');
          console.error('Available formData:', JSON.stringify(formData, null, 2));
        } else {
          console.log('Final gov_id:', govId);
        }

        // Format date of birth to YYYY-MM-DD for payload (API expects YYYY-MM-DD)
        let dob = formData.dateOfBirth || '';
        
        console.log('Original dateOfBirth from formData:', dob);
        
        // Remove any whitespace
        dob = dob.trim();
        
        // If already in YYYY-MM-DD format (internal storage), validate and use as is
        if (!dob.includes('/') && dob.includes('-') && dob.length === 10) {
          const parts = dob.split('-');
          if (parts.length === 3) {
            const [year, month, day] = parts;
            // Validate: year should be 4 digits, month and day should be 2 digits
            if (year.length === 4 && month.length === 2 && day.length === 2) {
              const yearNum = parseInt(year, 10);
              const monthNum = parseInt(month, 10);
              const dayNum = parseInt(day, 10);
              // Validate ranges
              if (yearNum >= 1900 && yearNum <= 2100 && monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
                dob = `${year}-${month}-${day}`; // Keep as YYYY-MM-DD
                console.log('Date is already in YYYY-MM-DD format:', dob);
              } else {
                console.error('Invalid date ranges:', { yearNum, monthNum, dayNum });
                dob = '';
              }
            }
          }
        } else if (dob.includes('/')) {
          // If date is in DD/MM/YYYY or MM/DD/YYYY format, convert to YYYY-MM-DD
          const parts = dob.split('/');
          if (parts.length === 3) {
            const [part1, part2, part3] = parts;
            
            // Check if it's MM/YYYY/DD format (wrong format) and fix it
            if (part1.length === 2 && part2.length === 4 && part3.length === 2) {
              const month = parseInt(part1, 10);
              const day = parseInt(part3, 10);
              const year = part2;
              if (month >= 1 && month <= 12 && day >= 1 && day <= 31 && year.length === 4) {
                dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                console.log('Converted MM/YYYY/DD to YYYY-MM-DD:', dob);
              }
            }
            // Check if it's DD/MM/YYYY (India) or MM/DD/YYYY (US)
            else if (part1.length === 2 && part2.length === 2 && part3.length === 4) {
              if (config.location === 'IN') {
                // DD/MM/YYYY format - convert to YYYY-MM-DD
                const [day, month, year] = parts;
                const dayNum = parseInt(day, 10);
                const monthNum = parseInt(month, 10);
                if (year.length === 4 && month.length === 2 && day.length === 2 && monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
                  dob = `${year}-${month}-${day}`;
                  console.log('Converted DD/MM/YYYY to YYYY-MM-DD:', dob);
                }
              } else {
                // MM/DD/YYYY format - convert to YYYY-MM-DD
                const [month, day, year] = parts;
                const monthNum = parseInt(month, 10);
                const dayNum = parseInt(day, 10);
                if (year.length === 4 && month.length === 2 && day.length === 2 && monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31) {
                  dob = `${year}-${month}-${day}`;
                  console.log('Converted MM/DD/YYYY to YYYY-MM-DD:', dob);
                } else {
                  console.error('Invalid MM/DD/YYYY format:', { month, day, year, monthNum, dayNum });
                }
              }
            } else {
              console.error('Unexpected date format with slashes:', dob);
            }
          }
        } else if (dob.includes('-') && dob.length === 10) {
          // Check if it's DD-MM-YYYY format (with dashes)
          const parts = dob.split('-');
          if (parts.length === 3) {
            const [part1, part2, part3] = parts;
            // If first part is 2 digits and third part is 4 digits, it might be DD-MM-YYYY
            if (part1.length === 2 && part2.length === 2 && part3.length === 4) {
              const firstNum = parseInt(part1, 10);
              const secondNum = parseInt(part2, 10);
              // If first part > 12, it's DD-MM-YYYY
              if (firstNum > 12 && secondNum >= 1 && secondNum <= 12) {
                const [day, month, year] = parts;
                dob = `${year}-${month}-${day}`;
                console.log('Converted DD-MM-YYYY to YYYY-MM-DD:', dob);
              }
              // If first part <= 12, it might be MM-DD-YYYY
              else if (firstNum >= 1 && firstNum <= 12 && secondNum >= 1 && secondNum <= 31) {
                const [month, day, year] = parts;
                dob = `${year}-${month}-${day}`;
                console.log('Converted MM-DD-YYYY to YYYY-MM-DD:', dob);
              }
            }
          }
        }
        
        // Final validation: ensure dob is in YYYY-MM-DD format
        if (dob && (!dob.includes('-') || dob.length !== 10 || !dob.match(/^\d{4}-\d{2}-\d{2}$/))) {
          console.error('Invalid date format for API after conversion:', dob);
          console.error('Original dateOfBirth:', formData.dateOfBirth);
          // Try to extract date from any format
          const dateMatch = dob.match(/(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})/);
          if (dateMatch) {
            const [, year, month, day] = dateMatch;
            dob = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            console.log('Fixed date using regex:', dob);
          } else {
            // Try alternative patterns
            const altMatch = dob.match(/(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})/);
            if (altMatch) {
              const [, part1, part2, year] = altMatch;
              const firstNum = parseInt(part1, 10);
              const secondNum = parseInt(part2, 10);
              if (config.location === 'US' && firstNum >= 1 && firstNum <= 12) {
                // MM/DD/YYYY
                dob = `${year}-${String(firstNum).padStart(2, '0')}-${String(secondNum).padStart(2, '0')}`;
              } else if (secondNum >= 1 && secondNum <= 12) {
                // DD/MM/YYYY
                dob = `${year}-${String(secondNum).padStart(2, '0')}-${String(firstNum).padStart(2, '0')}`;
              }
              console.log('Fixed date using alternative pattern:', dob);
            } else {
              console.error('Could not parse date format:', dob);
              dob = ''; // Invalid date, will cause validation error
            }
          }
        }
        
        console.log('Final dob for API:', dob);

        // Map role to API format: hiring_manager -> hr, techie -> techie
        const roleMapping: Record<string, string> = {
          'hiring_manager': 'hr',
          'techie': 'techie',
          'school': 'school',
          'company': 'company',
        };
        const apiRole = roleMapping[formData.role || 'techie'] || 'techie';

        // Prepare registration payload
        const registerPayload: any = {
          email: formData.email || '',
          first_name: formData.firstName || '',
          last_name: formData.lastName || '',
          dob: dob, // Format: YYYY-MM-DD (API expects this format)
          username: formData.email || '', // Same as email
          password: formData.password || '',
          confirm_password: formData.confirmPassword || '',
          role: apiRole, // Mapped role: hr or techie (or school/company)
          gov_id: govId, // Last 4 digits of PAN or SSN
          country: config.location === 'US' ? 'USA' : 'India',
          address: formData.fullAddress || '',
        };

        // Add work_authorization only for US
        if (config.location === 'US' && formData.visaStatus) {
          registerPayload.work_authorization = formData.visaStatus;
        }

        console.log('Registering user with payload:', registerPayload);
        console.log('User role:', formData.role, 'Is Company Signup:', formData.role === 'company', 'Is School Signup:', formData.role === 'school');

        // Call register API - Use REGISTER endpoint for all signup types (company, school, techie, hr)
        // SCHOOL_SIGNUP and COMPANY_SIGNUP endpoints are only for school/company details, not user registration
        const registerEndpoint = API_ENDPOINTS.REGISTER;
        const apiUrl = getApiUrl(registerEndpoint);
        console.log('Using registration endpoint:', registerEndpoint);
        console.log('Full registration URL:', apiUrl);
        const registerResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registerPayload),
        });

        const registerData = await registerResponse.json();

        // Check register API response
        if (!registerResponse.ok) {
          throw new Error(registerData.message || registerData.error || 'Registration failed');
        }

        console.log('User registered successfully:', registerData);
        console.log('Full registration response:', JSON.stringify(registerData, null, 2));
        
        // Store complete registration response in formData
        // Preserve current email to prevent overwriting with invalid values
        const currentEmailBeforeReg = formData.email;
        const registrationUpdateData: any = {
          registrationResponse: registerData,
          // Store all user data from registration response
          ...(registerData.user && { registeredUser: registerData.user }),
          ...(registerData.user_data && { registeredUserData: registerData.user_data }),
          ...(registerData.id && { registeredUserId: registerData.id }),
        };
        
        // Prevent email from being overwritten with invalid values like "abc@gmail.com"
        // Only update email if it's not already set or if the new value is valid
        if (registerData.user_data?.email && 
            registerData.user_data.email !== 'abc@gmail.com' && 
            registerData.user_data.email.trim() !== '' &&
            (!currentEmailBeforeReg || currentEmailBeforeReg === 'abc@gmail.com' || currentEmailBeforeReg.trim() === '')) {
          // Only update if current email is invalid or empty
          registrationUpdateData.email = registerData.user_data.email;
        } else if (currentEmailBeforeReg && currentEmailBeforeReg !== 'abc@gmail.com' && currentEmailBeforeReg.trim() !== '') {
          // Preserve current valid email
          registrationUpdateData.email = currentEmailBeforeReg;
        }
        
        updateFormData(registrationUpdateData);

        // After successful registration, call token API
        // Token API payload: only email and password (no confirm_password)
        // Password should be sent as string
        const tokenPayload = {
          email: formData.email || '',
          password: String(formData.password || ''),
        };

        console.log('Calling token API with payload:', tokenPayload);

        try {
          // Use login endpoint instead of token endpoint (login accepts JSON with email)
          const tokenApiUrl = getApiUrl(API_ENDPOINTS.AUTH.LOGIN);
          const tokenResponse = await fetch(tokenApiUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokenPayload),
          });

          const tokenData = await tokenResponse.json();

          if (!tokenResponse.ok) {
            console.error('Token API error:', tokenData);
            console.warn('Token API failed, but registration was successful. Continuing...');
          } else {
            console.log('Token received successfully:', tokenData);
            console.log('Full token response structure:', JSON.stringify(tokenData, null, 2));
            
            // Extract access token from response (check multiple possible field names)
            // Priority: access (from token API), access_token, token, etc.
            const accessToken = 
              tokenData.access ||           // Token API returns token in 'access' field
              tokenData.access_token || 
              tokenData.accessToken || 
              tokenData.token || 
              tokenData.authToken ||
              tokenData.data?.access ||
              tokenData.data?.access_token ||
              tokenData.data?.token;
            
            console.log('Extracted access token:', accessToken ? `Found (${accessToken.substring(0, 20)}...)` : 'Not found');
            console.log('Token length:', accessToken?.length || 0);
            
            // Extract user ID from token response
            const userId = 
              tokenData.user_data?.id ||
              tokenData.user_id ||
              tokenData.user?.id ||
              tokenData.id ||
              null;

            console.log('Extracted user ID:', userId);
            console.log('Full token response:', JSON.stringify(tokenData, null, 2));

            // Store complete token response in formData
            // Preserve current email to prevent overwriting with invalid values
            const currentEmail = formData.email;
            const tokenUpdateData: any = {
              tokenResponse: tokenData,
              // Store access token in formData for use in subsequent API calls
              access_token: accessToken || '',
              access: accessToken || '',              // Also store as 'access' for consistency
              token: accessToken || '',
              // Store user ID for use in subsequent API calls
              userId: userId || null,
              user_id: userId || null,
              // Store all user data from token response
              ...(tokenData.user_data && { user_data: tokenData.user_data }),
              ...(tokenData.user && { tokenUser: tokenData.user }),
            };
            
            // Prevent email from being overwritten with invalid values like "abc@gmail.com"
            // Only update email if it's not already set or if the new value is valid
            if (tokenData.user_data?.email && 
                tokenData.user_data.email !== 'abc@gmail.com' && 
                tokenData.user_data.email.trim() !== '' &&
                (!currentEmail || currentEmail === 'abc@gmail.com' || currentEmail.trim() === '')) {
              // Only update if current email is invalid or empty
              tokenUpdateData.email = tokenData.user_data.email;
            } else if (currentEmail && currentEmail !== 'abc@gmail.com' && currentEmail.trim() !== '') {
              // Preserve current valid email
              tokenUpdateData.email = currentEmail;
            }
            
            updateFormData(tokenUpdateData);

            // Store token in localStorage for persistence
            if (accessToken) {
              localStorage.setItem('authToken', accessToken);
              console.log('Token saved to localStorage:', accessToken.substring(0, 20) + '...');
            } else {
              console.warn('No access token found in token response:', Object.keys(tokenData));
              console.warn('Available fields:', JSON.stringify(tokenData, null, 2));
            }
          }
        } catch (tokenError: any) {
          console.error('Error calling token API:', tokenError);
          console.warn('Token API failed, but registration was successful. Continuing...');
        }

        // Move to next step after successful registration and token call
        setActiveStep((prev) => prev + 1);
        setErrors({});
      } catch (error: any) {
        console.error('Registration error:', error);
        setErrors({ submit: error.message || 'Failed to register user. Please try again.' });
      } finally {
        setLoading(false);
      }
      return;
    }

    // If this is the Work Experience step, post each experience to the API
    // Work Experience step - API calls are handled when Save button is clicked in the form
    // Here we just move to next step (no validation required)
    if (currentStepConfig?.id === 'work-experience') {
      console.log('Work Experience step detected, moving to next step...');
      console.log('FormData experiences:', formData.experience);
      
      const experiences = formData.experience || [];
      
      console.log('Experiences count:', experiences.length);
      
      // No validation - allow proceeding without any experience
      // All experiences are already saved via API when Save button was clicked
      // Just move to next step (Education Details)
      console.log('Moving to Education Details step');
      setActiveStep((prev) => prev + 1);
      setErrors({});
      return;
    }

    // If this is the Company Details step, API call is handled when Save button is clicked
    // Here we just move to next step (Review & Submit) - no validation required
    if (currentStepConfig?.id === 'company-details') {
      console.log('Company Details step detected, moving to next step...');
      console.log('FormData company details:', {
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        companyWebsite: formData.companyWebsite,
      });
      
      // No validation - allow proceeding without company details
      // Company details are already saved via API when Save button was clicked
      // Just move to next step (Review & Submit)
      console.log('Moving to Review & Submit step');
      setActiveStep((prev) => prev + 1);
      setErrors({});
      return;
    }

    // If this is the School Details step, API call is handled when Save button is clicked
    // Here we just move to next step (Review & Submit) - no validation required
    if (currentStepConfig?.id === 'school-details') {
      console.log('School Details step detected, moving to next step...');
      console.log('FormData school details:', {
        schoolName: formData.schoolName,
        establishedYear: formData.establishedYear,
        address: formData.address,
        startedDate: formData.startedDate,
        about: formData.about,
      });
      
      // No validation - allow proceeding without school details
      // School details are already saved via API when Save button was clicked
      // Just move to next step (Review & Submit)
      console.log('Moving to Review & Submit step');
      setActiveStep((prev) => prev + 1);
      setErrors({});
      return;
    }

    // If this is the Education Details step, API calls are handled when Save button is clicked in the form
    // Here we just move to next step (Review & Submit) - no validation required
    if (currentStepConfig?.id === 'education' || currentStepConfig?.id === 'education-details') {
      console.log('Education Details step detected, moving to next step...');
      console.log('FormData education:', formData.education);
      
      const education = formData.education || [];
      
      console.log('Education count:', education.length);
      
      // No validation - allow proceeding without any education entry
      // All education entries are already saved via API when Save button was clicked
      // Just move to next step (Review & Submit)
      console.log('Moving to Review & Submit step');
      setActiveStep((prev) => prev + 1);
      setErrors({});
      return;
    }

    // If this is the last step (Review & Submit), complete the flow
    if (activeStep === config.steps.length - 1) {
      setLoading(true);
      try {
        await onComplete(formData);
        // Show success screen after successful completion
        setShowSuccess(true);
      } catch (error: any) {
        setErrors({ submit: error.message || 'Failed to complete signup' });
      } finally {
        setLoading(false);
      }
      return;
    }

    // Move to next step
    setActiveStep((prev) => prev + 1);
    setErrors({});
  }, [activeStep, config.steps.length, config.location, currentStepConfig, validateCurrentStep, formData, onComplete, updateFormData]);

  const handleBack = useCallback(() => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
      setErrors({});
    } else if (onCancel) {
      // If on first step, call onCancel to go back to country selection
      onCancel();
    }
  }, [activeStep, onCancel]);

  const goToStep = useCallback((stepId: string) => {
    const stepIndex = config.steps.findIndex((step) => step.id === stepId);
    if (stepIndex !== -1) {
      setActiveStep(stepIndex);
      setErrors({});
    }
  }, [config.steps]);

  // Show success screen if registration is complete
  if (showSuccess) {
    return <SuccessScreen role={config.type} />;
  }

  if (!CurrentStepComponent) {
    return (
      <Container>
        <Paper>
          <Box p={4} textAlign="center">
            <p>Step configuration error</p>
          </Box>
        </Paper>
      </Container>
    );
  }

  const stepProps: StepComponentProps = {
    formData,
    updateFormData,
    errors,
    setErrors,
    location: config.location,
    role: config.type,
    onNext: handleNext,
    onBack: handleBack,
    goToStep,
  };

  // Get country display name based on location
  const getCountryName = (location: string): string => {
    const countryNames: Record<string, string> = {
      'US': 'United States',
      'IN': 'India',
      'UK': 'United Kingdom',
      'Canada': 'Canada',
      'Germany': 'Germany',
      'Switzerland': 'Switzerland',
      'China': 'China',
    };
    return countryNames[location] || location;
  };
  const countryName = getCountryName(config.location);
  
  // Get color based on signup type and location
  const countryColor = getPrimaryColor(config.type, config.location);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f5f5f5',
        py: 6,
        px: { xs: 1, sm: 2 },
        overflowX: 'hidden',
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 0.5, sm: 2 } }}>
        <Paper
          elevation={12}
          sx={{
            borderRadius: 4,
            width: '100%',
            p: { xs: 1.5, sm: 4, md: 6 },
            mx: 0,
            mt: { xs: 1, sm: -2 },
            background: 'white',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
            overflowX: 'hidden',
          }}
        >
          {/* Header with back arrow */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 4,
              position: 'relative',
              mt: { xs: 1.5, sm: -3 },
              pl: { xs: 0.75, sm: 0 },
            }}
          >
            <IconButton
              onClick={handleBack}
              sx={{ mr: 2, color: countryColor }}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: '#333',
                fontSize: { xs: '1.3rem', md: '1.5rem' },
                width: '100%',
              }}
            >
              {countryName}
            </Typography>
          </Box>

          {/* Progress Indicator */}
          <StepProgressIndicator
            steps={config.steps.map((s) => s.label)}
            activeStep={activeStep}
            location={config.location}
            config={config}
          />

          {/* Step Content */}
          <Box sx={{ mb: 4 }}>
            <CurrentStepComponent {...stepProps} />
          </Box>

          {/* Navigation Buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 4,
              gap: 1,
              flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
          >
            <Button
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: '#666',
                textTransform: 'none',
                fontSize: '1rem',
                width: { xs: '100%', sm: 'auto' },
              }}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={handleNext}
              endIcon={<ArrowForwardIcon />}
              disabled={loading}
              sx={{
                bgcolor: countryColor,
                color: 'white',
                px: 4,
                py: 1,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                width: { xs: '100%', sm: 'auto' },
                '&:hover': {
                  bgcolor: config.type === 'hr' 
                    ? (config.location === 'US' ? '#1565c0' : '#1B5E20')
                    : (config.location === 'US' ? '#1565c0' : '#0f7005'),
                },
              }}
            >
              {loading
                ? 'Processing...'
                : activeStep === config.steps.length - 1
                ? 'Submit'
                : 'Next'}
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default SignupFlowContainer;
