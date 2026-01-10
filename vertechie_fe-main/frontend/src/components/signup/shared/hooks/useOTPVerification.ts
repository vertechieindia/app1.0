import { useState, useCallback, useEffect, useRef } from 'react';
import { 
  auth, 
  initializeRecaptcha, 
  clearRecaptcha
} from '../../../../config/firebase';
import { 
  signInWithPhoneNumber, 
  ConfirmationResult
} from 'firebase/auth';
import axios from 'axios';
import { getLegacyApiUrl, API_ENDPOINTS } from '../../../../config/api';
import { formatPhoneForFirebase } from '../../utils/formatters';

export const useOTPVerification = () => {
  const [emailVerified, setEmailVerified] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [phoneVerifying, setPhoneVerifying] = useState(false);
  const [showEmailOTPDialog, setShowEmailOTPDialog] = useState(false);
  const [showPhoneOTPDialog, setShowPhoneOTPDialog] = useState(false);
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [phoneConfirmationResult, setPhoneConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-verify email OTP when 6 digits are entered
  useEffect(() => {
    if (emailOTP.length === 6 && showEmailOTPDialog && !emailVerifying) {
      // Auto-verify will be handled by the component
    }
  }, [emailOTP, showEmailOTPDialog, emailVerifying]);

  // Auto-verify phone OTP when 6 digits are entered
  useEffect(() => {
    if (phoneOTP.length === 6 && showPhoneOTPDialog && !phoneVerifying && phoneConfirmationResult) {
      // Auto-verify will be handled by the component
    }
  }, [phoneOTP, showPhoneOTPDialog, phoneVerifying, phoneConfirmationResult]);

  // Track if email verification is in progress to prevent duplicate calls
  const emailVerifyingRef = useRef(false);
  // Track last verified email OTP to prevent re-verifying the same wrong OTP
  const lastVerifiedEmailOTPRef = useRef<string>('');

  // Send Email OTP
  const sendEmailOTP = useCallback(async (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    }
    
    setEmailVerifying(true);
    setErrors((prev) => {
      const { email, ...rest } = prev;
      return rest;
    });

    try {
      // Reset last verified email OTP when sending new OTP
      lastVerifiedEmailOTPRef.current = '';
      
      const apiUrl = getLegacyApiUrl(API_ENDPOINTS.SEND_EMAIL_OTP);
      const response = await axios.post(apiUrl, { email });
      
      if (response.data.success || response.status === 200) {
        setShowEmailOTPDialog(true);
        setEmailOTP(''); // Clear previous OTP
        setEmailVerifying(false);
        return true;
      } else {
        setErrors((prev) => ({ ...prev, email: response.data.message || 'Failed to send OTP. Please try again.' }));
        setEmailVerifying(false);
        return false;
      }
    } catch (error: any) {
      console.error('Error sending email OTP:', error);
      setErrors((prev) => ({ 
        ...prev,
        email: error.response?.data?.message || error.response?.data?.error || 'Failed to send OTP. Please try again.' 
      }));
      setEmailVerifying(false);
      return false;
    }
  }, []);

  // Verify Email OTP
  const verifyEmailOTP = useCallback(async (otp: string, email: string) => {
    const trimmedOTP = (otp || emailOTP).trim();
    
    // Prevent duplicate calls
    if (emailVerifyingRef.current) {
      console.log('Email verification already in progress, skipping duplicate call');
      return false;
    }

    // Prevent re-verifying the same OTP that was already verified (success or failure)
    if (trimmedOTP === lastVerifiedEmailOTPRef.current && lastVerifiedEmailOTPRef.current !== '') {
      console.log('This email OTP was already verified, skipping duplicate call');
      return false;
    }
    
    if (!trimmedOTP || trimmedOTP.length !== 6) {
      setErrors((prev) => ({ ...prev, email: 'Please enter a valid 6-digit OTP' }));
      return false;
    }
    
    emailVerifyingRef.current = true;
    lastVerifiedEmailOTPRef.current = trimmedOTP; // Mark this OTP as being verified
    setEmailVerifying(true);
    setErrors((prev) => {
      const { email, ...rest } = prev;
      return rest;
    });

    try {
      const apiUrl = getLegacyApiUrl(API_ENDPOINTS.VERIFY_EMAIL_OTP);
      const response = await axios.post(apiUrl, {
        email,
        otp: trimmedOTP
      });
      
      if (response.data.success || response.status === 200) {
        setEmailVerified(true);
        setShowEmailOTPDialog(false);
        setEmailOTP('');
        setEmailVerifying(false);
        setErrors((prev) => {
          const { email, ...rest } = prev;
          return rest;
        });
        emailVerifyingRef.current = false;
        // Keep lastVerifiedEmailOTPRef to prevent re-verification of this successful OTP
        return true;
      } else {
        const errorMessage = response.data.message || 'Wrong OTP. Please check and try again.';
        setErrors((prev) => ({ ...prev, email: 'Wrong OTP. Please check and try again.' }));
        setEmailVerifying(false);
        emailVerifyingRef.current = false;
        // Keep lastVerifiedEmailOTPRef so same wrong OTP won't be verified again
        return false;
      }
    } catch (error: any) {
      console.error('Error verifying email OTP:', error);
      let errorMessage = 'Wrong OTP. Please check and try again.';
      
      if (error.response?.data?.message || error.response?.data?.error) {
        const apiError = error.response.data.message || error.response.data.error;
        // Show user-friendly "Wrong OTP" message for invalid OTP errors
        if (apiError.toLowerCase().includes('invalid') || apiError.toLowerCase().includes('wrong') || apiError.toLowerCase().includes('incorrect')) {
          errorMessage = 'Wrong OTP. Please check and try again.';
        } else {
          errorMessage = apiError;
        }
      }
      
      setErrors((prev) => ({ 
        ...prev, 
        email: errorMessage
      }));
      setEmailVerifying(false);
      emailVerifyingRef.current = false;
      // Keep lastVerifiedEmailOTPRef so same wrong OTP won't be verified again
      return false;
    }
  }, [emailOTP]);

  // Send Phone OTP
  const sendPhoneOTP = useCallback(async (phone: string) => {
    if (!phone || phone.length < 10) {
      setErrors((prev) => ({ ...prev, phone: 'Please enter a valid phone number' }));
      return false;
    }
    
    setPhoneVerifying(true);
    setErrors((prev) => {
      const { phone, ...rest } = prev;
      return rest;
    });

    try {
      // Format phone number for Firebase
      const formattedPhone = formatPhoneForFirebase(phone);
      
      // Clear any previous reCAPTCHA first
      clearRecaptcha();
      
      // Reset last verified OTP when sending new OTP
      lastVerifiedOTPRef.current = '';
      
      // Small delay to ensure cleanup is complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Initialize reCAPTCHA with fresh container
      const recaptchaVerifier = initializeRecaptcha('recaptcha-container');
      
      // Send OTP via Firebase
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
      
      setPhoneConfirmationResult(confirmationResult);
      setShowPhoneOTPDialog(true);
      setPhoneOTP(''); // Clear previous OTP
      setPhoneVerifying(false);
      return true;
    } catch (error: any) {
      console.error('Error sending phone OTP:', error);
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.code === 'auth/invalid-api-key') {
        errorMessage = 'Firebase configuration error. Please check your Firebase API key and environment variables.';
      } else if (error.code === 'auth/billing-not-enabled') {
        errorMessage = 'Firebase Phone Authentication requires billing to be enabled. Please enable billing in your Firebase Console (Project Settings > Usage and billing).';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please check your Firebase billing and quotas.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setErrors((prev) => ({ ...prev, phone: errorMessage }));
      clearRecaptcha();
      setPhoneVerifying(false);
      return false;
    }
  }, []);

  // Track if verification is in progress to prevent duplicate calls
  const verifyingRef = useRef(false);
  // Track last verified OTP to prevent re-verifying the same wrong OTP
  const lastVerifiedOTPRef = useRef<string>('');

  // Verify Phone OTP
  const verifyPhoneOTP = useCallback(async (otp: string, email: string) => {
    const trimmedOTP = otp.trim();
    
    // Prevent duplicate calls
    if (verifyingRef.current) {
      console.log('Verification already in progress, skipping duplicate call');
      return false;
    }

    // Prevent re-verifying the same OTP that was already verified (success or failure)
    if (trimmedOTP === lastVerifiedOTPRef.current && lastVerifiedOTPRef.current !== '') {
      console.log('This OTP was already verified, skipping duplicate call');
      return false;
    }

    if (!trimmedOTP || trimmedOTP.length !== 6) {
      setErrors({ phone: 'Please enter a valid 6-digit OTP' });
      return false;
    }
    
    if (!phoneConfirmationResult) {
      setErrors({ phone: 'No verification session found. Please request a new OTP.' });
      return false;
    }
    
    verifyingRef.current = true;
    lastVerifiedOTPRef.current = trimmedOTP; // Mark this OTP as being verified
    setPhoneVerifying(true);
    setErrors({});

    try {
      const result = await phoneConfirmationResult.confirm(otp.trim());
      const idToken = await result.user.getIdToken();
    
      const apiUrl = getLegacyApiUrl(API_ENDPOINTS.MOBILE_VERIFICATION);
      const response = await axios.post(apiUrl, {
        email,
        idToken
      });
      
      if (response.data.success || response.status === 200) {
        setPhoneVerified(true);
        setShowPhoneOTPDialog(false);
        setPhoneOTP('');
        setPhoneConfirmationResult(null);
        setErrors({});
        verifyingRef.current = false;
        // Keep lastVerifiedOTPRef to prevent re-verification of this successful OTP
        return true;
      } else {
        const errorMessage = response.data.message || response.data.error || 'Wrong OTP. Please try again.';
        setErrors({ phone: 'Wrong OTP. Please check and try again.' });
        verifyingRef.current = false;
        // Keep lastVerifiedOTPRef so same wrong OTP won't be verified again
        
        // If backend error indicates Firebase token issue, clear session
        if (errorMessage.includes('aud') || errorMessage.includes('Firebase')) {
          setPhoneConfirmationResult(null);
          clearRecaptcha();
          lastVerifiedOTPRef.current = ''; // Reset to allow retry with new session
        }
        
        return false;
      }
    } catch (error: any) {
      console.error('Error verifying phone OTP:', error);
      let errorMessage = 'Wrong OTP. Please check and try again.';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Wrong OTP. Please check and try again.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'Verification code has expired. Please request a new one.';
        setPhoneConfirmationResult(null);
        lastVerifiedOTPRef.current = ''; // Reset to allow retry with new session
      } else if (error.response?.data?.message || error.response?.data?.error) {
        const apiError = error.response.data.message || error.response.data.error;
        // Show user-friendly "Wrong OTP" message for invalid OTP errors
        if (apiError.toLowerCase().includes('invalid') || apiError.toLowerCase().includes('wrong') || apiError.toLowerCase().includes('incorrect')) {
          errorMessage = 'Wrong OTP. Please check and try again.';
        } else {
          errorMessage = apiError;
        }
        
        // If Firebase token error, clear session to prevent retries
        if (apiError.includes('aud') || apiError.includes('Firebase') || apiError.includes('token')) {
          setPhoneConfirmationResult(null);
          clearRecaptcha();
          lastVerifiedOTPRef.current = ''; // Reset to allow retry with new session
          errorMessage += ' Please request a new OTP.';
        }
      }
      
      setErrors({ phone: errorMessage });
      clearRecaptcha();
      verifyingRef.current = false;
      // Keep lastVerifiedOTPRef so same wrong OTP won't be verified again
      return false;
    } finally {
      setPhoneVerifying(false);
    }
  }, [phoneConfirmationResult]);

  // Cleanup
  const cleanup = useCallback(() => {
    clearRecaptcha();
  }, []);

  return {
    emailVerified,
    phoneVerified,
    emailVerifying,
    phoneVerifying,
    showEmailOTPDialog,
    showPhoneOTPDialog,
    emailOTP,
    phoneOTP,
    phoneConfirmationResult,
    errors,
    setEmailOTP,
    setPhoneOTP,
    setShowEmailOTPDialog,
    setShowPhoneOTPDialog,
    sendEmailOTP,
    verifyEmailOTP,
    sendPhoneOTP,
    verifyPhoneOTP,
    cleanup,
  };
};

