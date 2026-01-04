/**
 * Shared types for all signup flows
 */

export type SignupType = 'techie' | 'hr' | 'company' | 'school';
export type SignupLocation = 'US' | 'IN' | 'UK' | 'CA' | 'DE' | 'CH' | 'CN';

export interface BaseSignupData {
  role: SignupType;
  location: SignupLocation;
}

export interface StepConfig {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  validation?: (data: any) => boolean | string;
  skipCondition?: (data: any) => boolean;
}

export interface SignupFlowConfig {
  type: SignupType;
  location: SignupLocation;
  steps: StepConfig[];
}

export interface StepNavigation {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  canGoBack: boolean;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
}

export interface FormData {
  [key: string]: any;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface StepComponentProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
  errors: ValidationErrors;
  setErrors: (errors: ValidationErrors) => void;
  location: SignupLocation;
  role?: SignupType;
  onNext: () => void;
  onBack: () => void;
  goToStep?: (stepId: string) => void;
}

