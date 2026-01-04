import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Alert,
  Button,
  CircularProgress,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { StepComponentProps } from '../../types';
import { isValidUrl, isValidEmail } from '../../../../utils/validation';
import axios from 'axios';
import { getApiUrl, API_ENDPOINTS } from '../../../../config/api';
import { getPrimaryColor, getLightColor } from '../../utils/colors';
import { formatDateToMMDDYYYY } from '../../utils/formatters';

const CompanyDetailsForm: React.FC<StepComponentProps> = ({
  formData,
  updateFormData,
  errors,
  setErrors,
  role,
  location,
}) => {
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  // Company signup specific fields (US)
  const [ein, setEin] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [regState, setRegState] = useState('');
  const [startedDate, setStartedDate] = useState('');
  const [about, setAbout] = useState('');
  // Company signup specific fields (India)
  const [cin, setCin] = useState('');
  const [establishedYear, setEstablishedYear] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Check if this is company signup (not HR)
  const isCompanySignup = role === 'company';
  // Get location from props or formData
  const currentLocation = location || formData.country || (formData.location as string) || 'US';
  const isIndia = currentLocation === 'IN' || (currentLocation as string).toUpperCase() === 'INDIA' || (currentLocation as string).toLowerCase() === 'india';

  const rawCompanyDetails = formData.companyDetails !== null && formData.companyDetails !== undefined
    ? formData.companyDetails
    : isCompanySignup
      ? isIndia
        ? (formData.companyName && formData.companyName.trim() && 
           formData.companyWebsite && formData.companyWebsite.trim())
          ? {
              companyName: formData.companyName,
              companyWebsite: formData.companyWebsite,
              cin: formData.cin || '',
              establishedYear: formData.establishedYear || '',
              companyAddress: formData.companyAddress || '',
              about: formData.about || '',
              id: formData.companyId || formData.company_id,
            }
          : null
        : (formData.companyName && formData.companyName.trim() && 
           formData.companyWebsite && formData.companyWebsite.trim())
          ? {
              companyName: formData.companyName,
              companyWebsite: formData.companyWebsite,
              ein: formData.ein || '',
              accountNumber: formData.accountNumber || '',
              regState: formData.regState || '',
              startedDate: formData.startedDate || '',
              about: formData.about || '',
              id: formData.companyId || formData.company_id,
            }
          : null
      : (formData.companyName && formData.companyName.trim() && 
         formData.companyEmail && formData.companyEmail.trim() && 
         formData.companyWebsite && formData.companyWebsite.trim())
        ? {
            companyName: formData.companyName,
            companyEmail: formData.companyEmail,
            companyWebsite: formData.companyWebsite,
            id: formData.companyId || formData.company_id,
          }
        : null;

  // Validate location match for company signup - only use data if it matches current location
  const companyDetails = rawCompanyDetails && isCompanySignup ? (() => {
    const hasCin = !!(rawCompanyDetails.cin && rawCompanyDetails.cin.trim());
    const hasEin = !!(rawCompanyDetails.ein && rawCompanyDetails.ein.trim());
    const hasAddress = !!(rawCompanyDetails.companyAddress && rawCompanyDetails.companyAddress.trim());
    const hasStartedDate = !!(rawCompanyDetails.startedDate && rawCompanyDetails.startedDate.trim());
    
    // Check if data matches current location
    const isDataForIndia = hasCin && hasAddress && !hasEin && !hasStartedDate;
    const isDataForUS = hasEin && hasStartedDate && !hasCin;
    
    // Only return data if it matches current location
    if ((isIndia && isDataForIndia) || (!isIndia && isDataForUS)) {
      return rawCompanyDetails;
    }
    // Data doesn't match location - return null
    console.log('FormData company details do not match current location. Ignoring formData.');
    return null;
  })() : rawCompanyDetails;

  // Fetch company details from API if not in formData - only once
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      // Don't fetch if companyDetails was explicitly set to null AND all fields are empty (user removed it)
      // Only fetch if companyDetails is undefined (not yet loaded) and we have a user ID
      const wasExplicitlyRemoved = formData.companyDetails === null && 
        !formData.companyName && 
        !formData.companyWebsite &&
        !formData.companyId &&
        !formData.company_id &&
        (isCompanySignup ? (!formData.ein && !formData.accountNumber) : !formData.companyEmail);
      const hasNoData = !companyDetails && !formData.companyName && !formData.companyWebsite &&
        (isCompanySignup ? (!formData.ein && !formData.accountNumber) : !formData.companyEmail);
      
      // Get user ID from token response (id from token API)
      // This id should be used to fetch company details
      const userId = formData.userId || formData.user_id || 
                     (formData.tokenResponse as any)?.user_data?.id ||
                     (formData.tokenResponse as any)?.user_id ||
                     (formData.tokenResponse as any)?.user?.id ||
                     null;
      
      // Only fetch if we have user ID from token response and haven't already loaded data
      // Always try to fetch company details using the id from token response
      // If data exists, show it. If not, show empty form for user to add
      if (!wasExplicitlyRemoved && hasNoData && userId && !formData.companyDetails) {
        try {
          // Get token from multiple sources - check all possible locations
          const token = 
            localStorage.getItem('authToken') ||
            formData.token ||
            formData.access_token ||
            formData.access ||
            (formData.tokenResponse as any)?.access ||
            (formData.tokenResponse as any)?.access_token ||
            (formData.tokenResponse as any)?.token ||
            (formData.registrationResponse as any)?.access ||
            (formData.registrationResponse as any)?.access_token ||
            (formData.registrationResponse as any)?.token ||
            null;

          // If no token found, don't make the API call - it will fail with auth error
          if (!token) {
            console.warn('No authentication token found. Skipping company details fetch until token is available.');
            // Mark as checked to prevent infinite retries, but don't set to null so it can retry when token is available
            return;
          }
          
          console.log('Fetching company details using id from token response:', userId);
          // Use different endpoint for company signup vs HR signup
          const endpoint = isCompanySignup ? API_ENDPOINTS.COMPANY_SIGNUP : API_ENDPOINTS.COMPANY;
          const apiUrl = getApiUrl(endpoint);
          // Use 'id' query parameter instead of 'user' - id comes from token response
          const getUrl = `${apiUrl}?id=${userId}`;
          
          console.log('Fetching company details with token:', token ? `${token.substring(0, 20)}...` : 'No token');
          
          const response = await axios.get(getUrl, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          // Handle both single object and array response
          let fetchedData = null;
          if (Array.isArray(response.data) && response.data.length > 0) {
            fetchedData = response.data[0];
          } else if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
            fetchedData = response.data;
          }

          if (fetchedData) {
            // Validate that fetched data matches current location (for company signup)
            if (isCompanySignup) {
              const hasCin = !!(fetchedData.cin && fetchedData.cin.trim());
              const hasEin = !!(fetchedData.ein && fetchedData.ein.trim());
              const hasAddress = !!(fetchedData.company_address && fetchedData.company_address.trim());
              const hasStartedDate = !!(fetchedData.started_date || fetchedData.startedDate);
              
              // Check if data matches current location
              const isDataForIndia = hasCin && hasAddress && !hasEin && !hasStartedDate;
              const isDataForUS = hasEin && hasStartedDate && !hasCin;
              
              // Only use the data if it matches the current location
              if (!((isIndia && isDataForIndia) || (!isIndia && isDataForUS))) {
                // Data doesn't match location - don't use it, set to null
                console.log('Fetched company details do not match current location. Ignoring fetched data.');
                if (formData.companyDetails === undefined) {
                  updateFormData({
                    companyDetails: null,
                  });
                }
                return;
              }
            }
            
            const companyId = fetchedData.id || fetchedData.company_id;
            const savedCompanyDetails: any = {
              companyName: fetchedData.company_name || fetchedData.companyName || '',
              companyWebsite: fetchedData.company_website || fetchedData.companyWebsite || fetchedData.comapny_website || fetchedData.compnay_website || '',
              id: companyId,
            };

            const updateData: any = {
              companyName: savedCompanyDetails.companyName,
              companyWebsite: savedCompanyDetails.companyWebsite,
              companyDetails: savedCompanyDetails,
              companyId: companyId,
              company_id: companyId,
            };

            if (isCompanySignup) {
              if (isIndia) {
                // India company signup fields
                savedCompanyDetails.cin = fetchedData.cin || '';
                savedCompanyDetails.establishedYear = fetchedData.established_year || fetchedData.establishedYear || '';
                savedCompanyDetails.companyAddress = fetchedData.company_address || fetchedData.companyAddress || '';
                savedCompanyDetails.regState = fetchedData.reg_state || fetchedData.regState || '';
                savedCompanyDetails.about = fetchedData.about || '';
                updateData.cin = savedCompanyDetails.cin;
                updateData.establishedYear = savedCompanyDetails.establishedYear;
                updateData.companyAddress = savedCompanyDetails.companyAddress;
                updateData.regState = savedCompanyDetails.regState;
                updateData.about = savedCompanyDetails.about;
              } else {
                // US company signup fields
                savedCompanyDetails.ein = fetchedData.ein || '';
                savedCompanyDetails.accountNumber = fetchedData.account_number || fetchedData.accountNumber || '';
                savedCompanyDetails.regState = fetchedData.reg_state || fetchedData.regState || '';
                // Store date in YYYY-MM-DD format (API format)
                savedCompanyDetails.startedDate = fetchedData.started_date || fetchedData.startedDate || '';
                savedCompanyDetails.about = fetchedData.about || '';
                updateData.ein = savedCompanyDetails.ein;
                updateData.accountNumber = savedCompanyDetails.accountNumber;
                updateData.regState = savedCompanyDetails.regState;
                updateData.startedDate = savedCompanyDetails.startedDate; // Store in YYYY-MM-DD format
                updateData.about = savedCompanyDetails.about;
              }
            } else {
              savedCompanyDetails.companyEmail = fetchedData.company_email || fetchedData.companyEmail || '';
              updateData.companyEmail = savedCompanyDetails.companyEmail;
            }

            // Only update if we don't already have this data
            if (!formData.companyId && !formData.company_id) {
              updateFormData(updateData);
            }
          } else {
            // API returned empty - no company details exist for this user
            // Mark as null to indicate no company details found, user can add new details
            console.log('No company details found for user. User can add new company details.');
            if (formData.companyDetails === undefined) {
              updateFormData({
                companyDetails: null,
              });
            }
          }
        } catch (error: any) {
          console.error('Error fetching company details:', error);
          
          // Check if it's an authentication error
          const isAuthError = error?.response?.status === 401 || 
                             error?.response?.status === 403 ||
                             error?.message?.toLowerCase().includes('authentication') ||
                             error?.response?.data?.detail?.toLowerCase().includes('authentication') ||
                             error?.response?.data?.message?.toLowerCase().includes('authentication');
          
          if (isAuthError) {
            console.warn('Authentication error when fetching company details. Token may not be available yet. Will retry when token is available.');
            // Don't mark as null - allow retry when token becomes available
            return;
          }
          
          // Mark as checked to prevent infinite retries for other errors
          if (formData.companyDetails === undefined) {
            updateFormData({
              companyDetails: null,
            });
          }
        }
      }
    };

    fetchCompanyDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formData.userId, 
    formData.user_id, 
    formData.token, 
    formData.access_token, 
    formData.access,
    formData.tokenResponse,
    // Include tokenResponse.user_data.id to trigger when id becomes available
    (formData.tokenResponse as any)?.user_data?.id
  ]);

  // Initialize form when company details exist
  useEffect(() => {
    if (companyDetails && !showCompanyForm) {
      setCompanyName(companyDetails.companyName || companyDetails.company_name || '');
      setCompanyWebsite(companyDetails.companyWebsite || companyDetails.company_website || companyDetails.comapny_website || '');
      if (isCompanySignup) {
        if (isIndia) {
          // India fields
          setCin(companyDetails.cin || '');
          setEstablishedYear(companyDetails.establishedYear || companyDetails.established_year || '');
          setCompanyAddress(companyDetails.companyAddress || companyDetails.company_address || '');
          setAbout(companyDetails.about || '');
        } else {
          // US fields
          // Format EIN as XX-XXXXXXX if it's 9 digits
          const einValue = companyDetails.ein || '';
          if (einValue && /^\d{9}$/.test(einValue.replace(/-/g, ''))) {
            const einDigits = einValue.replace(/-/g, '');
            setEin(`${einDigits.substring(0, 2)}-${einDigits.substring(2)}`);
          } else {
            setEin(einValue);
          }
          
          setAccountNumber(companyDetails.accountNumber || companyDetails.account_number || '');
          setRegState(companyDetails.regState || companyDetails.reg_state || '');
          
          // Convert YYYY-MM-DD to MM-DD-YYYY for display
          const dateValue = companyDetails.startedDate || companyDetails.started_date || '';
          if (dateValue) {
            const dateMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (dateMatch) {
              const [, year, month, day] = dateMatch;
              setStartedDate(`${month}-${day}-${year}`);
            } else {
              setStartedDate(dateValue);
            }
          } else {
            setStartedDate('');
          }
          
          setAbout(companyDetails.about || '');
        }
      } else {
        setCompanyEmail(companyDetails.companyEmail || companyDetails.company_email || '');
      }
    }
  }, [companyDetails, showCompanyForm, isCompanySignup, isIndia]);

  // Get colors based on signup type and location
  const signupType = (role as 'techie' | 'hr' | 'company' | 'school') || 'techie';
  const locationForColors = (currentLocation as 'US' | 'IN') || 'US';
  const primaryColor = getPrimaryColor(signupType, locationForColors);
  const lightColor = getLightColor(signupType, locationForColors);
  const borderColor = primaryColor;

  const handleAddCompany = useCallback(() => {
    setIsEditing(false);
    setCompanyName('');
    setCompanyWebsite('');
    if (isCompanySignup) {
      if (isIndia) {
        setCin('');
        setEstablishedYear('');
        setCompanyAddress('');
        setAbout('');
      } else {
        setEin('');
        setAccountNumber('');
        setRegState('');
        setStartedDate('');
        setAbout('');
      }
    } else {
      setCompanyEmail('');
    }
    setShowCompanyForm(true);
  }, [isCompanySignup, isIndia]);

  const handleEditCompany = useCallback(() => {
    if (companyDetails) {
      setIsEditing(true);
      setCompanyName(companyDetails.companyName || companyDetails.company_name || '');
      setCompanyWebsite(companyDetails.companyWebsite || companyDetails.company_website || companyDetails.comapny_website || '');
      if (isCompanySignup) {
        if (isIndia) {
          // India fields
          setCin(companyDetails.cin || '');
          setEstablishedYear(companyDetails.establishedYear || companyDetails.established_year || '');
          setCompanyAddress(companyDetails.companyAddress || companyDetails.company_address || '');
          setAbout(companyDetails.about || '');
        } else {
          // US fields
          // Format EIN as XX-XXXXXXX if it's 9 digits
          const einValue = companyDetails.ein || '';
          if (einValue && /^\d{9}$/.test(einValue.replace(/-/g, ''))) {
            const einDigits = einValue.replace(/-/g, '');
            setEin(`${einDigits.substring(0, 2)}-${einDigits.substring(2)}`);
          } else {
            setEin(einValue);
          }
          
          setAccountNumber(companyDetails.accountNumber || companyDetails.account_number || '');
          setRegState(companyDetails.regState || companyDetails.reg_state || '');
          
          // Convert YYYY-MM-DD to MM-DD-YYYY for display
          const dateValue = companyDetails.startedDate || companyDetails.started_date || '';
          if (dateValue) {
            const dateMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
            if (dateMatch) {
              const [, year, month, day] = dateMatch;
              setStartedDate(`${month}-${day}-${year}`);
            } else {
              setStartedDate(dateValue);
            }
          } else {
            setStartedDate('');
          }
          
          setAbout(companyDetails.about || '');
        }
      } else {
        setCompanyEmail(companyDetails.companyEmail || companyDetails.company_email || '');
      }
      setShowCompanyForm(true);
    }
  }, [companyDetails, isCompanySignup, isIndia]);

  const handleRemoveCompany = useCallback(async () => {
    const companyId = formData.companyId || formData.company_id || companyDetails?.id;
    
    // Clear local form state
    setCompanyName('');
    setCompanyWebsite('');
    if (isCompanySignup) {
      if (isIndia) {
        setCin('');
        setEstablishedYear('');
        setCompanyAddress('');
        setAbout('');
      } else {
        setEin('');
        setAccountNumber('');
        setRegState('');
        setStartedDate('');
        setAbout('');
      }
    } else {
      setCompanyEmail('');
    }
    
    if (!companyId) {
      // Just remove from formData if no ID
      const clearData: any = {
        companyName: '',
        companyWebsite: '',
        companyDetails: null,
        companyId: null,
        company_id: null,
      };
      if (isCompanySignup) {
        if (isIndia) {
          clearData.cin = '';
          clearData.establishedYear = '';
          clearData.companyAddress = '';
          clearData.about = '';
        } else {
          clearData.ein = '';
          clearData.accountNumber = '';
          clearData.regState = '';
          clearData.startedDate = '';
          clearData.about = '';
        }
      } else {
        clearData.companyEmail = '';
      }
      updateFormData(clearData);
      return;
    }

    // Delete from API
    try {
      const token = 
        localStorage.getItem('authToken') ||
        formData.token ||
        formData.access_token ||
        formData.access ||
        (formData.tokenResponse as any)?.access ||
        (formData.tokenResponse as any)?.access_token ||
        (formData.tokenResponse as any)?.token;

      // Use different endpoint for company signup vs HR signup
      const endpoint = isCompanySignup ? API_ENDPOINTS.COMPANY_SIGNUP : API_ENDPOINTS.COMPANY;
      const apiUrl = getApiUrl(endpoint);
      const deleteUrl = `${apiUrl}${companyId}/`;
      
      await axios.delete(deleteUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      // Remove from formData
      const clearData: any = {
        companyName: '',
        companyWebsite: '',
        companyDetails: null,
        companyId: null,
        company_id: null,
      };
      if (isCompanySignup) {
        if (isIndia) {
          clearData.cin = '';
          clearData.establishedYear = '';
          clearData.companyAddress = '';
          clearData.about = '';
        } else {
          clearData.ein = '';
          clearData.accountNumber = '';
          clearData.regState = '';
          clearData.startedDate = '';
          clearData.about = '';
        }
      } else {
        clearData.companyEmail = '';
      }
      updateFormData(clearData);
    } catch (error: any) {
      console.error('Error deleting company details:', error);
      // Still remove from formData even if API call fails
      const clearData: any = {
        companyName: '',
        companyWebsite: '',
        companyDetails: null,
        companyId: null,
        company_id: null,
      };
      if (isCompanySignup) {
        if (isIndia) {
          clearData.cin = '';
          clearData.establishedYear = '';
          clearData.companyAddress = '';
          clearData.about = '';
        } else {
          clearData.ein = '';
          clearData.accountNumber = '';
          clearData.regState = '';
          clearData.startedDate = '';
          clearData.about = '';
        }
      } else {
        clearData.companyEmail = '';
      }
      updateFormData(clearData);
    }
  }, [formData, companyDetails, updateFormData, isCompanySignup, isIndia]);

  const handleCompanyFormClose = useCallback(() => {
    setShowCompanyForm(false);
    setIsEditing(false);
    setIsSaving(false);
    if (setErrors) {
      setErrors({});
    }
  }, [setErrors]);

  const handleChange = useCallback((field: string, value: string) => {
    if (field === 'companyName') {
      setCompanyName(value);
    } else if (field === 'companyEmail') {
      setCompanyEmail(value);
    } else if (field === 'companyWebsite') {
      setCompanyWebsite(value);
    } else if (field === 'ein') {
      setEin(value);
    } else if (field === 'accountNumber') {
      setAccountNumber(value);
    } else if (field === 'regState') {
      setRegState(value);
    } else if (field === 'startedDate') {
      setStartedDate(value);
    } else if (field === 'about') {
      setAbout(value);
    } else if (field === 'cin') {
      setCin(value);
    } else if (field === 'establishedYear') {
      setEstablishedYear(value);
    } else if (field === 'companyAddress') {
      setCompanyAddress(value);
    }

    // Clear error when user starts typing
    if (errors[field] && setErrors) {
      setErrors({ ...errors, [field]: '' });
    }
  }, [errors, setErrors]);

  const handleSave = useCallback(async () => {
    const validationErrors: Record<string, string> = {};

    // Validate Company Name (required for both)
    if (!companyName || !companyName.trim()) {
      validationErrors.companyName = isCompanySignup ? 'Company Name is required' : 'Hiring Company Name is required';
    } else if (companyName.trim().length < 2) {
      validationErrors.companyName = 'Company Name must be at least 2 characters';
    } else if (companyName.trim().length > 200) {
      validationErrors.companyName = 'Company Name must not exceed 200 characters';
    }

    // Validate Company Website (required for both)
    if (!companyWebsite || !companyWebsite.trim()) {
      validationErrors.companyWebsite = isCompanySignup ? 'Company Website is required' : 'Hiring Company Website URL is required';
    } else if (!isValidUrl(companyWebsite.trim())) {
      validationErrors.companyWebsite = 'Please enter a valid website URL (e.g., https://www.example.com)';
    }

    if (isCompanySignup) {
      if (isIndia) {
        // India company signup validation
        if (!cin || !cin.trim()) {
          validationErrors.cin = 'CIN is required';
        } else {
          const cinValue = cin.trim().replace(/\s/g, ''); // Remove spaces
          // CIN format: U12345AB1234CD1234 (21 characters, alphanumeric)
          // Basic validation: should be alphanumeric, typically 21 characters
          if (cinValue.length < 5) {
            validationErrors.cin = 'CIN must be at least 5 characters';
          } else if (cinValue.length > 25) {
            validationErrors.cin = 'CIN must not exceed 25 characters';
          } else if (!/^[A-Z0-9]+$/i.test(cinValue)) {
            validationErrors.cin = 'CIN must contain only letters and numbers';
          }
        }
        
        if (!establishedYear || !establishedYear.trim()) {
          validationErrors.establishedYear = 'Established Year is required';
        } else {
          const yearValue = establishedYear.trim();
          const year = parseInt(yearValue, 10);
          const currentYear = new Date().getFullYear();
          
          if (isNaN(year)) {
            validationErrors.establishedYear = 'Established Year must be a valid number';
          } else if (year < 1800) {
            validationErrors.establishedYear = 'Established Year must be at least 1800';
          } else if (year > currentYear) {
            validationErrors.establishedYear = `Established Year cannot be greater than ${currentYear}`;
          } else if (yearValue.length !== 4) {
            validationErrors.establishedYear = 'Established Year must be 4 digits (YYYY)';
          }
        }
        
        if (!regState || !regState.trim()) {
          validationErrors.regState = 'Registration State is required';
        } else {
          const stateValue = regState.trim();
          if (stateValue.length < 2) {
            validationErrors.regState = 'Registration State must be at least 2 characters';
          } else if (stateValue.length > 100) {
            validationErrors.regState = 'Registration State must not exceed 100 characters';
          }
        }
        
        if (!companyAddress || !companyAddress.trim()) {
          validationErrors.companyAddress = 'Address is required';
        } else {
          const addressValue = companyAddress.trim();
          if (addressValue.length < 10) {
            validationErrors.companyAddress = 'Address must be at least 10 characters';
          } else if (addressValue.length > 500) {
            validationErrors.companyAddress = 'Address must not exceed 500 characters';
          }
        }
        
        if (!about || !about.trim()) {
          validationErrors.about = 'About Company is required';
        } else if (about.trim().length < 10) {
          validationErrors.about = 'About Company must be at least 10 characters';
        } else if (about.trim().length > 500) {
          validationErrors.about = 'About Company must not exceed 500 characters';
        }
      } else {
        // US company signup validation
        if (!ein || !ein.trim()) {
          validationErrors.ein = 'EIN is required';
        } else {
          const einValue = ein.trim().replace(/\s/g, ''); // Remove spaces
          // US EIN format: XX-XXXXXXX (9 digits total, with optional hyphen)
          // Remove hyphens for validation
          const einDigits = einValue.replace(/-/g, '');
          
          if (einDigits.length !== 9) {
            validationErrors.ein = 'EIN must be exactly 9 digits';
          } else if (!/^\d{9}$/.test(einDigits)) {
            validationErrors.ein = 'EIN must contain only numbers';
          } else {
            // Validate EIN format: should be XX-XXXXXXX or XXXXXXXXX
            // First two digits should be valid (01-94 for most cases, but we'll allow 00-99)
            const firstTwo = parseInt(einDigits.substring(0, 2), 10);
            if (firstTwo < 0 || firstTwo > 99) {
              validationErrors.ein = 'EIN format is invalid';
            }
          }
        }
        
        if (!accountNumber || !accountNumber.trim()) {
          validationErrors.accountNumber = 'Everify Account Number is required';
        } else {
          const accountNum = accountNumber.trim().replace(/\s/g, ''); // Remove spaces
          if (!/^\d+$/.test(accountNum)) {
            validationErrors.accountNumber = 'Everify Account Number must contain only numbers';
          } else if (accountNum.length < 4) {
            validationErrors.accountNumber = 'Everify Account Number must be at least 4 digits';
          } else if (accountNum.length > 8) {
            validationErrors.accountNumber = 'Everify Account Number must not exceed 8 digits';
          } else {
            // Check if account number exceeds maximum integer value
            const accountNumInt = parseInt(accountNum, 10);
            if (isNaN(accountNumInt) || accountNumInt > 2147483647) {
              validationErrors.accountNumber = 'Everify Account Number must be less than or equal to 2147483647';
            }
          }
        }
        
        if (!regState || !regState.trim()) {
          validationErrors.regState = 'Registration State is required';
        } else {
          const stateValue = regState.trim();
          if (stateValue.length < 2) {
            validationErrors.regState = 'Registration State must be at least 2 characters';
          } else if (stateValue.length > 100) {
            validationErrors.regState = 'Registration State must not exceed 100 characters';
          }
        }
        
        if (!startedDate || !startedDate.trim()) {
          validationErrors.startedDate = 'Started Date is required';
        } else {
          const dateValue = startedDate.trim();
          // Accept MM-DD-YYYY format
          const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;
          const match = dateValue.match(dateRegex);
          
          if (!match) {
            validationErrors.startedDate = 'Please enter a valid date in MM-DD-YYYY format';
          } else {
            const month = parseInt(match[1], 10);
            const day = parseInt(match[2], 10);
            const year = parseInt(match[3], 10);
            
            // Validate month
            if (month < 1 || month > 12) {
              validationErrors.startedDate = 'Month must be between 01 and 12';
            }
            // Validate day
            else if (day < 1 || day > 31) {
              validationErrors.startedDate = 'Day must be between 01 and 31';
            }
            // Validate year
            else if (year < 1900 || year > new Date().getFullYear()) {
              validationErrors.startedDate = `Year must be between 1900 and ${new Date().getFullYear()}`;
            }
            // Validate actual date (check if date is valid, e.g., not Feb 30)
            else {
              const date = new Date(year, month - 1, day);
              if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
                validationErrors.startedDate = 'Please enter a valid date';
              } else {
                const today = new Date();
                today.setHours(23, 59, 59, 999); // Set to end of today
                if (date > today) {
                  validationErrors.startedDate = 'Started Date cannot be in the future';
                }
              }
            }
          }
        }
        
        if (!about || !about.trim()) {
          validationErrors.about = 'About is required';
        } else if (about.trim().length < 10) {
          validationErrors.about = 'About must be at least 10 characters';
        } else if (about.trim().length > 500) {
          validationErrors.about = 'About must not exceed 500 characters';
        }
      }
    } else {
      // HR signup validation
      if (!companyEmail || !companyEmail.trim()) {
        validationErrors.companyEmail = 'Hiring Company Email ID is required';
      } else if (!isValidEmail(companyEmail.trim())) {
        validationErrors.companyEmail = 'Please enter a valid email address';
      }
    }

    // If there are validation errors, display them
    if (Object.keys(validationErrors).length > 0) {
      if (setErrors) {
        setErrors(validationErrors);
      }
      return;
    }

    // Start saving
    setIsSaving(true);
    if (setErrors) {
      setErrors({});
    }

    try {
      // Get authentication token from localStorage or formData
      const token = 
        localStorage.getItem('authToken') ||
        formData.token ||
        formData.access_token ||
        formData.access ||
        (formData.tokenResponse as any)?.access ||
        (formData.tokenResponse as any)?.access_token ||
        (formData.tokenResponse as any)?.token;

      console.log('Saving company details to API...');
      console.log('Token source:', token ? 'Found' : 'Not found');

      // Get user ID from formData (stored from token response)
      const userId = 
        formData.userId ||
        formData.user_id ||
        (formData.tokenResponse as any)?.user_data?.id ||
        (formData.tokenResponse as any)?.user_id ||
        (formData.tokenResponse as any)?.user?.id ||
        null;

      console.log('User ID source:', userId ? `Found (${userId})` : 'Not found');

      if (!userId) {
        const errorMsg = 'User ID not found. Please complete registration first.';
        console.error(errorMsg);
        if (setErrors) {
          setErrors({ submit: errorMsg });
        }
        setIsSaving(false);
        return;
      }

      // Prepare API payload based on signup type
      const payload: any = {
        user: userId, // User ID is required
      };

      if (isCompanySignup) {
        // Company signup payload
        payload.company_name = companyName.trim();
        payload.company_website = companyWebsite.trim();
        
        if (isIndia) {
          // India company signup payload
          payload.cin = cin.trim();
          payload.established_year = parseInt(establishedYear.trim(), 10);
          payload.company_address = companyAddress.trim();
          payload.reg_state = regState.trim(); // Registration State is required for India too
          payload.about = about.trim();
        } else {
          // US company signup payload
          // Format EIN: remove spaces and hyphens, then format as XX-XXXXXXX
          const einFormatted = ein.trim().replace(/\s/g, '').replace(/-/g, '');
          payload.ein = einFormatted.length === 9 
            ? `${einFormatted.substring(0, 2)}-${einFormatted.substring(2)}`
            : einFormatted;
          
          // Parse account number (4-8 digits)
          const accountNumStr = accountNumber.trim().replace(/\s/g, '');
          const accountNumInt = parseInt(accountNumStr, 10);
          payload.account_number = accountNumInt;
          payload.reg_state = regState.trim();
          
          // Convert MM-DD-YYYY to YYYY-MM-DD for API
          const dateMatch = startedDate.trim().match(/^(\d{2})-(\d{2})-(\d{4})$/);
          if (dateMatch) {
            const [, month, day, year] = dateMatch;
            payload.started_date = `${year}-${month}-${day}`;
          } else {
            payload.started_date = startedDate.trim();
          }
          
          payload.about = about.trim();
        }
      } else {
        // HR signup payload
        payload.company_name = companyName.trim();
        payload.company_email = companyEmail.trim();
        payload.company_website = companyWebsite.trim();
      }

      console.log('Company details payload:', payload);

      // Check if company details already exist (for editing)
      const companyId = formData.companyId || formData.company_id || null;
      const isEdit = !!companyId;

      console.log('Company operation:', isEdit ? 'PATCH (Update)' : 'POST (Create)');
      console.log('Company ID:', companyId || 'Not found (will create new)');

      // Call company API - Use different endpoint for company signup vs HR signup
      // Use PATCH for editing, POST for new
      const endpoint = isCompanySignup ? API_ENDPOINTS.COMPANY_SIGNUP : API_ENDPOINTS.COMPANY;
      const apiUrl = getApiUrl(endpoint);
      let response;
      
      if (isEdit && companyId) {
        // Update existing company details using PATCH
        const updateUrl = `${apiUrl}${companyId}/`;
        console.log('Patching company details:', updateUrl);
        response = await axios.patch(updateUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        console.log('Company details updated successfully:', response.status, response.data);
      } else {
        // Create new company details using POST
        console.log('Posting new company details:', apiUrl);
        response = await axios.post(apiUrl, payload, {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        });
        console.log('Company details saved successfully:', response.status, response.data);
      }

      // Store company ID if returned from API (for future edits)
      const returnedCompanyId = response.data?.id || response.data?.company_id || companyId;
      
      // Save data to formData
      const savedCompanyDetails: any = {
        companyName: companyName.trim(),
        companyWebsite: companyWebsite.trim(),
        id: returnedCompanyId || companyId,
      };

      const updateData: any = {
        companyName: companyName.trim(),
        companyWebsite: companyWebsite.trim(),
        companyDetails: savedCompanyDetails,
        companyId: returnedCompanyId || companyId,
        company_id: returnedCompanyId || companyId,
      };

      if (isCompanySignup) {
        if (isIndia) {
          savedCompanyDetails.cin = cin.trim();
          savedCompanyDetails.establishedYear = establishedYear.trim();
          savedCompanyDetails.companyAddress = companyAddress.trim();
          savedCompanyDetails.about = about.trim();
          updateData.cin = cin.trim();
          updateData.establishedYear = establishedYear.trim();
          updateData.companyAddress = companyAddress.trim();
          updateData.about = about.trim();
        } else {
          savedCompanyDetails.ein = ein.trim();
          savedCompanyDetails.accountNumber = accountNumber.trim();
          savedCompanyDetails.regState = regState.trim();
          savedCompanyDetails.startedDate = startedDate.trim();
          savedCompanyDetails.about = about.trim();
          updateData.ein = ein.trim();
          updateData.accountNumber = accountNumber.trim();
          updateData.regState = regState.trim();
          updateData.startedDate = startedDate.trim();
          updateData.about = about.trim();
        }
      } else {
        savedCompanyDetails.companyEmail = companyEmail.trim();
        updateData.companyEmail = companyEmail.trim();
      }

      updateFormData(updateData);

      // Clear errors on success and close form
      if (setErrors) {
        setErrors({});
      }
      
      // Close form after successful save
      handleCompanyFormClose();
    } catch (error: any) {
      console.error('Error saving company details:', error);
      const errorMessage = 
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'Failed to save company details. Please try again.';
      
      if (setErrors) {
        setErrors({ submit: errorMessage });
      }
    } finally {
      setIsSaving(false);
    }
  }, [companyName, companyEmail, companyWebsite, ein, accountNumber, regState, startedDate, about, isCompanySignup, setErrors, updateFormData, formData, handleCompanyFormClose]);

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            mb: 4,
            mt: -2,
            color: '#333',
            fontSize: { xs: '1.3rem', md: '1.5rem' },
          }}
        >
          Company Details
        </Typography>
        {!companyDetails && (
          <Button
            variant="contained"
            startIcon={<Box component="span" sx={{ fontSize: '1.2rem', fontWeight: 700 }}>+</Box>}
            onClick={handleAddCompany}
            sx={{
              bgcolor: primaryColor,
              color: 'white',
              textTransform: 'none',
              px: 3,
              py: 1,
              mb: 4,
              mt: -2,
              fontWeight: 600,
              '&:hover': {
                backgroundColor: role === 'hr'
                  ? (formData.country === 'IN' ? '#1B5E20' : '#1565c0')
                  : (formData.country === 'IN' ? '#0f7005' : '#1565c0'),
              },
            }}
          >
            Add Company
          </Button>
        )}
      </Box>

      {/* Empty State or Company Details List */}
      {!companyDetails ? (
        <Paper
          elevation={0}
          sx={{
            mt: -6,
            p: 8,
            textAlign: 'center',
            border: '2px dashed #e0e0e0',
            borderRadius: 2,
            bgcolor: '#fafafa',
          }}
        >
          <BusinessIcon
            sx={{
              fontSize: 80,
              color: '#9e9e9e',
              mb: 2,
            }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: '#424242',
            }}
          >
            No Company Details Added
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: '#757575',
            }}
          >
            Add your company details to complete your profile
          </Typography>
        </Paper>
      ) : (
        <Box>
          <Paper sx={{ p: 3, mb: 2, border: '1px solid #e0e0e0', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: primaryColor }}>
                  {companyDetails.companyName || companyDetails.company_name || 'Company Name'}
                </Typography>
                {isCompanySignup ? (
                  isIndia ? (
                    <>
                      {companyDetails.companyWebsite && (
                        <Typography variant="body2" sx={{ color: '#1976d2', mb: 0.5 }}>
                          {companyDetails.companyWebsite || companyDetails.company_website || companyDetails.comapny_website}
                        </Typography>
                      )}
                      {companyDetails.cin && (
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          CIN: {companyDetails.cin}
                        </Typography>
                      )}
                      {companyDetails.establishedYear && (
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          Established Year: {companyDetails.establishedYear || companyDetails.established_year}
                        </Typography>
                      )}
                      {companyDetails.companyAddress && (
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          Address: {companyDetails.companyAddress || companyDetails.company_address}
                        </Typography>
                      )}
                    </>
                  ) : (
                    <>
                      {companyDetails.companyWebsite && (
                        <Typography variant="body2" sx={{ color: '#1976d2', mb: 0.5 }}>
                          {companyDetails.companyWebsite || companyDetails.company_website || companyDetails.comapny_website}
                        </Typography>
                      )}
                      {companyDetails.ein && (
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          EIN: {companyDetails.ein}
                        </Typography>
                      )}
                      {companyDetails.regState && (
                        <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>
                          State: {companyDetails.regState || companyDetails.reg_state}
                        </Typography>
                      )}
                    </>
                  )
                ) : (
                  <>
                    <Typography variant="body1" sx={{ mb: 1, color: '#333', fontWeight: 600 }}>
                      {companyDetails.companyEmail || companyDetails.company_email || 'Company Email'}
                    </Typography>
                    {companyDetails.companyWebsite && (
                      <Typography variant="body2" sx={{ color: '#1976d2', mb: 1 }}>
                        {companyDetails.companyWebsite || companyDetails.company_website}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={handleEditCompany}
                  sx={{ textTransform: 'none' }}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveCompany}
                  sx={{ textTransform: 'none' }}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      )}

      {/* Company Details Form Modal */}
      <Dialog
        open={showCompanyForm}
        onClose={handleCompanyFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            fontSize: '1.6rem',
            textAlign: 'center',
            borderBottom: '1px solid #eee',
            pb: 1,
            color: 'primary.main',
            letterSpacing: 0.5,
          }}
        >
          {isEditing ? 'Edit Company Details' : 'Add Company Details'}
        </DialogTitle>
        <DialogContent sx={{ p: 4,mt:2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={isCompanySignup ? "Company Name *" : "Hiring Company Name *"}
                value={companyName}
                onChange={(e) => handleChange('companyName', e.target.value)}
                error={!!errors.companyName}
                helperText={errors.companyName}
                required
              />
            </Grid>

            {isCompanySignup ? (
              isIndia ? (
                // India company signup fields
                <>
                 <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Registration State *"
                      value={regState}
                      onChange={(e) => handleChange('regState', e.target.value)}
                      error={!!errors.regState}
                      helperText={errors.regState || 'State where company is registered'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Website URL *"
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => handleChange('companyWebsite', e.target.value)}
                      error={!!errors.companyWebsite}
                      helperText={errors.companyWebsite || 'Enter the full website URL (e.g., https://www.example.com)'}
                      placeholder="https://www.example.com"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="CIN *"
                      value={cin}
                      onChange={(e) => {
                        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''); // Only alphanumeric, uppercase
                        if (value.length > 25) {
                          value = value.substring(0, 25);
                        }
                        handleChange('cin', value);
                      }}
                      placeholder="U12345AB1234CD1234"
                      error={!!errors.cin}
                      helperText={errors.cin || 'Company Identification Number (5-25 alphanumeric characters)'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Established Year *"
                      type="text"
                      value={establishedYear}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ''); // Only digits
                        if (value.length > 4) {
                          value = value.substring(0, 4);
                        }
                        handleChange('establishedYear', value);
                      }}
                      placeholder="YYYY"
                      error={!!errors.establishedYear}
                      helperText={errors.establishedYear || 'Format: YYYY (e.g., 2020)'}
                      required
                    />
                  </Grid>
                 
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address *"
                      multiline
                      rows={3}
                      value={companyAddress}
                      onChange={(e) => handleChange('companyAddress', e.target.value)}
                      error={!!errors.companyAddress}
                      helperText={errors.companyAddress || 'Company registered address'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="About Company *"
                      multiline
                      rows={4}
                      value={about}
                      onChange={(e) => handleChange('about', e.target.value)}
                      error={!!errors.about}
                      helperText={errors.about || 'Brief description of the company'}
                      required
                    />
                  </Grid>
                </>
              ) : (
                // US company signup fields
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Company Website *"
                      type="url"
                      value={companyWebsite}
                      onChange={(e) => handleChange('companyWebsite', e.target.value)}
                      error={!!errors.companyWebsite}
                      helperText={errors.companyWebsite || 'Enter the full website URL (e.g., https://www.example.com)'}
                      placeholder="https://www.example.com"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="EIN *"
                      value={ein}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
                        // Format as XX-XXXXXXX
                        if (value.length > 2) {
                          value = value.substring(0, 2) + '-' + value.substring(2, 9);
                        }
                        handleChange('ein', value);
                      }}
                      placeholder="XX-XXXXXXX"
                      error={!!errors.ein}
                      helperText={errors.ein || 'Format: XX-XXXXXXX (9 digits)'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Everify Account Number *"
                      type="text"
                      value={accountNumber}
                      onChange={(e) => {
                        // Only allow digits, max 8 digits
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length > 8) {
                          value = value.substring(0, 8);
                        }
                        handleChange('accountNumber', value);
                      }}
                      placeholder="12345678"
                      error={!!errors.accountNumber}
                      helperText={errors.accountNumber || 'Must be between 4 and 8 digits'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Registration State *"
                      value={regState}
                      onChange={(e) => handleChange('regState', e.target.value)}
                      error={!!errors.regState}
                      helperText={errors.regState}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Company Started Date *"
                      type="text"
                      placeholder="MM-DD-YYYY"
                      value={startedDate}
                      onChange={(e) => {
                        let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
                        if (inputValue.length <= 8) {
                          // Format as MM-DD-YYYY while typing
                          let formattedValue = inputValue;
                          if (inputValue.length > 2) {
                            formattedValue = inputValue.slice(0, 2) + '-' + inputValue.slice(2);
                          }
                          if (inputValue.length > 4) {
                            formattedValue = inputValue.slice(0, 2) + '-' + inputValue.slice(2, 4) + '-' + inputValue.slice(4, 8);
                          }
                          handleChange('startedDate', formattedValue);
                        }
                      }}
                      onBlur={(e) => {
                        // Validate format on blur
                        const value = e.target.value.trim();
                        if (value && !/^\d{2}-\d{2}-\d{4}$/.test(value)) {
                          // Try to fix common mistakes
                          const parts = value.replace(/\D/g, '');
                          if (parts.length === 8) {
                            const formatted = `${parts.slice(0, 2)}-${parts.slice(2, 4)}-${parts.slice(4)}`;
                            handleChange('startedDate', formatted);
                          }
                        }
                      }}
                      error={!!errors.startedDate}
                      helperText={errors.startedDate || 'Format: MM-DD-YYYY'}
                      required
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="About *"
                      multiline
                      rows={4}
                      value={about}
                      onChange={(e) => handleChange('about', e.target.value)}
                      error={!!errors.about}
                      helperText={errors.about || 'Brief description of the company'}
                      required
                    />
                  </Grid>
                </>
              )
            ) : (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hiring Company Email ID *"
                    type="email"
                    value={companyEmail}
                    onChange={(e) => handleChange('companyEmail', e.target.value)}
                    error={!!errors.companyEmail}
                    helperText={errors.companyEmail}
                    placeholder="company@example.com"
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Hiring Company Website URL *"
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => handleChange('companyWebsite', e.target.value)}
                    error={!!errors.companyWebsite}
                    helperText={errors.companyWebsite || 'Enter the full website URL (e.g., https://www.example.com)'}
                    placeholder="https://www.example.com"
                    required
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, justifyContent: 'center', gap: 2, borderTop: '1px solid #eee' }}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleCompanyFormClose}
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaving}
            startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              px: 4,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              boxShadow: 2,
              backgroundColor: primaryColor,
              '&:hover': {
                backgroundColor: role === 'hr'
                  ? (formData.country === 'IN' ? '#1B5E20' : '#1565c0')
                  : (formData.country === 'IN' ? '#0f7005' : '#1565c0'),
              },
            }}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {errors.submit && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {errors.submit}
        </Alert>
      )}
    </Box>
  );
};

export default CompanyDetailsForm;

