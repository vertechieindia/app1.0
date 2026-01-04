# Signup Flow Components

This directory contains the modular signup flow architecture for VerTechie.

## Quick Start

### Using a Signup Flow

```typescript
import TechieSignupFlow from './flows/TechieSignupFlow';

<TechieSignupFlow
  location="US"
  onComplete={async (data) => {
    // Handle signup completion
    console.log('Signup data:', data);
  }}
  onCancel={() => {
    // Handle cancellation
    navigate('/');
  }}
/>
```

## Architecture Overview

### Directory Structure

```
signup/
├── types/           # TypeScript interfaces and types
├── steps/           # Individual step components
├── flows/           # Signup type-specific flows (Techie, HR, Company, School)
├── shared/          # Shared components and utilities
├── config/          # Step configurations
└── utils/           # Utility functions
```

### Component Hierarchy

1. **Signup.tsx** (Main Entry Point)
   - Handles role selection
   - Routes to appropriate flow

2. **[Type]SignupFlow** (e.g., TechieSignupFlow)
   - Manages form data for that signup type
   - Initializes SignupFlowContainer with config

3. **SignupFlowContainer** (Shared)
   - Manages step navigation
   - Handles validation
   - Renders current step

4. **Step Components** (Steps/)
   - Render step-specific UI
   - Handle step-specific logic
   - Location-aware (US vs India)

## Adding a New Signup Type

1. **Create Flow Component** (`flows/YourSignupFlow.tsx`)
   ```typescript
   import SignupFlowContainer from '../shared/SignupFlowContainer';
   import { getSignupConfig } from '../config/stepConfig';

   const YourSignupFlow: React.FC<Props> = ({ location, onComplete }) => {
     const [formData, setFormData] = useState({ /* your data */ });
     const config = getSignupConfig('your-type', location);
     // ... rest of implementation
   };
   ```

2. **Add Configuration** (`config/stepConfig.ts`)
   ```typescript
   export const yourTypeUSConfig: SignupFlowConfig = {
     type: 'your-type',
     location: 'US',
     steps: [
       // Define your steps
     ],
   };
   ```

3. **Update getSignupConfig** to include your new type

## Customizing Steps

### Location-Specific Steps

Create location-specific components:
- `steps/DocumentVerification/USDocumentVerification.tsx`
- `steps/DocumentVerification/IndiaDocumentVerification.tsx`

Then route in the index:
```typescript
const DocumentVerification: React.FC<StepComponentProps> = (props) => {
  if (props.location === 'US') {
    return <USDocumentVerification {...props} />;
  }
  return <IndiaDocumentVerification {...props} />;
};
```

### Adding Validation

Add validation in `config/stepConfig.ts`:
```typescript
const validateYourStep = (data: any): boolean | string => {
  if (!data.requiredField) return 'Required field is missing';
  return true;
};

{
  id: 'your-step',
  label: 'Your Step',
  component: YourStepComponent,
  validation: validateYourStep,
}
```

## Step Component Props

All step components receive these props:

```typescript
interface StepComponentProps {
  formData: FormData;              // Current form data
  updateFormData: (updates) => void; // Update form data
  errors: ValidationErrors;        // Current errors
  setErrors: (errors) => void;     // Set errors
  location: SignupLocation;        // 'US' or 'IN'
  onNext: () => void;              // Navigate to next step
  onBack: () => void;              // Navigate to previous step
}
```

## Migration from Old Signup.tsx

1. **Extract Step Logic**: Move step rendering logic to step components
2. **Extract Form Data**: Define form data structure in flow component
3. **Update Validation**: Move validation to step config
4. **Wire Up Navigation**: Use SignupFlowContainer for navigation

## Best Practices

1. **Keep Steps Focused**: Each step should handle one concern
2. **Reuse Components**: Share common UI across steps
3. **Type Safety**: Use TypeScript interfaces for form data
4. **Validation**: Validate at step level and form level
5. **Error Handling**: Show clear error messages
6. **Loading States**: Show loading during async operations

## Example: Complete Flow

```typescript
// In Signup.tsx
const handleRoleSelection = (role: SignupType, location: SignupLocation) => {
  setSelectedRole(role);
  setSelectedLocation(location);
  setShowFlow(true);
};

{showFlow && selectedRole === 'techie' && (
  <TechieSignupFlow
    location={selectedLocation}
    onComplete={handleSignupComplete}
    onCancel={() => setShowFlow(false)}
  />
)}
```

