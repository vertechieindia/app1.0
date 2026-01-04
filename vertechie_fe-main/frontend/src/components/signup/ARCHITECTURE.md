# Signup Flow Architecture

## Overview
This document outlines the modular architecture for handling multiple signup types, locations, and steps.

## Structure

```
src/components/signup/
├── types/
│   ├── index.ts              # Shared types and interfaces
│   ├── techie.ts            # Techie-specific types
│   ├── hr.ts                # HR-specific types
│   ├── company.ts           # Company-specific types
│   └── school.ts            # School-specific types
├── steps/
│   ├── DocumentVerification/
│   │   ├── index.tsx
│   │   ├── USDocumentVerification.tsx
│   │   └── IndiaDocumentVerification.tsx
│   ├── PersonalInformation/
│   │   ├── index.tsx
│   │   ├── USPersonalInformation.tsx
│   │   └── IndiaPersonalInformation.tsx
│   ├── WorkExperience/
│   │   ├── index.tsx
│   │   └── WorkExperienceForm.tsx
│   ├── EducationDetails/
│   │   ├── index.tsx
│   │   └── EducationForm.tsx
│   └── ReviewSubmit/
│       ├── index.tsx
│       └── ReviewContent.tsx
├── flows/
│   ├── TechieSignupFlow.tsx
│   ├── HRSignupFlow.tsx
│   ├── CompanySignupFlow.tsx
│   └── SchoolSignupFlow.tsx
├── shared/
│   ├── SignupFlowContainer.tsx    # Base container with step management
│   ├── StepProgressIndicator.tsx
│   ├── NavigationButtons.tsx
│   └── hooks/
│       ├── useSignupFlow.ts       # Main hook for flow management
│       ├── useStepValidation.ts   # Validation hook
│       └── useDocumentCapture.ts  # Document capture logic
├── config/
│   ├── stepConfig.ts              # Step definitions per type/location
│   └── validationRules.ts         # Validation rules
└── utils/
    ├── formatters.ts              # Date formatting, etc.
    └── validators.ts              # Common validators

src/pages/
└── Signup.tsx                     # Main entry point - routes to appropriate flow
```

## Component Hierarchy

```
Signup (pages/Signup.tsx)
  └─> RoleSelection (existing component)
       └─> SignupFlowContainer (shared/SignupFlowContainer.tsx)
            └─> [SignupType]SignupFlow (flows/[Type]SignupFlow.tsx)
                 └─> Step Components (steps/[StepName]/index.tsx)
                      └─> Location-specific components (US/India variants)
```

## Data Flow

1. **Signup.tsx**: Handles role selection and routes to appropriate flow
2. **SignupFlowContainer**: Manages step state, navigation, and progress
3. **[Type]SignupFlow**: Defines step order and configuration for that signup type
4. **Step Components**: Render step-specific UI and handle step logic
5. **Location Components**: Handle location-specific variations (US vs India)

## Benefits

1. **Separation of Concerns**: Each component has a single responsibility
2. **Reusability**: Step components can be shared across signup types
3. **Maintainability**: Changes to one signup type don't affect others
4. **Testability**: Smaller, focused components are easier to test
5. **Scalability**: Easy to add new signup types or steps
6. **Type Safety**: Strong typing with TypeScript interfaces

## Step Configuration

Each signup type defines its steps through a configuration object:

```typescript
const techieUSConfig = {
  steps: [
    { id: 'document-verification', component: DocumentVerification, validation: validateDocuments },
    { id: 'personal-info', component: PersonalInformation, validation: validatePersonalInfo },
    { id: 'work-experience', component: WorkExperience, validation: validateWorkExperience },
    { id: 'education', component: EducationDetails, validation: validateEducation },
    { id: 'review', component: ReviewSubmit, validation: validateReview }
  ],
  location: 'US',
  type: 'techie'
};
```

