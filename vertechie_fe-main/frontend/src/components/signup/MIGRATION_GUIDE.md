# Migration Guide: Refactoring Signup.tsx

This guide explains how to migrate from the monolithic Signup.tsx to the new modular architecture.

## Current State

- **File**: `frontend/src/pages/Signup.tsx`
- **Size**: ~6,484 lines
- **Contains**: All signup logic for Techie (US & India) in one file

## Target State

- **Modular Components**: Each step is a separate component
- **Reusable Flows**: Each signup type has its own flow component
- **Location-Aware**: US and India variations handled separately
- **Configurable**: Steps defined through configuration

## Migration Steps

### Step 1: Extract Role Selection (Already Done)

The role selection UI is already separate. Keep it in `Signup.tsx` as the entry point.

### Step 2: Extract Document Verification Step

**Current Location**: Lines ~195-2000+ in Signup.tsx

**New Location**: 
- `components/signup/steps/DocumentVerification/USDocumentVerification.tsx`
- `components/signup/steps/DocumentVerification/IndiaDocumentVerification.tsx`

**What to Extract**:
- Document verification state management
- Camera capture logic
- Face detection logic
- Document upload handlers

**Example**:
```typescript
// Old (in Signup.tsx)
const [showLivePhotoCamera, setShowLivePhotoCamera] = useState(false);
// ... lots of camera logic

// New (in USDocumentVerification.tsx)
const USDocumentVerification: React.FC<StepComponentProps> = ({ formData, updateFormData }) => {
  // Camera logic here
  // Update formData.livePhoto when captured
};
```

### Step 3: Extract Personal Information Step

**Current Location**: Lines ~2500-3500+ in Signup.tsx

**New Location**:
- `components/signup/steps/PersonalInformation/USPersonalInformation.tsx`
- `components/signup/steps/PersonalInformation/IndiaPersonalInformation.tsx`

**What to Extract**:
- Form fields for personal information
- Date formatting (US: MM/DD/YYYY, India: DD/MM/YYYY)
- Validation logic
- Email/Phone OTP verification

### Step 4: Extract Work Experience Step

**Current Location**: Lines ~4000-5000+ in Signup.tsx

**New Location**:
- `components/signup/steps/WorkExperience/WorkExperienceForm.tsx`

**What to Extract**:
- Experience form state
- Add/Edit/Delete experience logic
- Manager reference fields
- Warning modal

### Step 5: Extract Education Details Step

**Current Location**: Lines ~5000-5500+ in Signup.tsx

**New Location**:
- `components/signup/steps/EducationDetails/EducationForm.tsx`

**What to Extract**:
- Education form state
- Add/Edit/Delete education logic
- GPA and graduation date fields

### Step 6: Extract Review & Submit Step

**Current Location**: Lines ~5500-6000+ in Signup.tsx

**New Location**:
- `components/signup/steps/ReviewSubmit/ReviewContent.tsx`

**What to Extract**:
- Review summary display
- Terms acceptance checkbox
- Final submission logic

### Step 7: Create Techie Flow Component

**New File**: `components/signup/flows/TechieSignupFlow.tsx`

**What to Include**:
- Form data state management
- Location-based routing
- Integration with SignupFlowContainer

### Step 8: Update Main Signup.tsx

**New Structure**:
```typescript
const Signup = () => {
  const [selectedRole, setSelectedRole] = useState<SignupType | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<SignupLocation | null>(null);

  // Role selection UI
  if (!selectedRole) {
    return <RoleSelection onSelect={setSelectedRole} />;
  }

  // Location selection (for Techie only)
  if (selectedRole === 'techie' && !selectedLocation) {
    return <LocationSelection onSelect={setSelectedLocation} />;
  }

  // Render appropriate flow
  return (
    <>
      {selectedRole === 'techie' && selectedLocation && (
        <TechieSignupFlow
          location={selectedLocation}
          onComplete={handleComplete}
          onCancel={() => {
            setSelectedRole(null);
            setSelectedLocation(null);
          }}
        />
      )}
      {/* Add other signup types */}
    </>
  );
};
```

## Data Migration

### Form Data Structure

**Old**: Single `SignupFormData` interface with all fields

**New**: Type-specific form data in each flow component

```typescript
// Old
interface SignupFormData {
  role: PublicUserRole;
  country: 'US' | 'IN' | null;
  // ... all fields
}

// New (in TechieSignupFlow.tsx)
const [formData, setFormData] = useState({
  role: 'techie',
  location: 'US',
  // Techie-specific fields
});
```

### State Management

**Old**: All state in one component (50+ useState hooks)

**New**: State distributed across:
- Flow component: Main form data
- Step components: Step-specific UI state
- Shared hooks: Reusable logic (e.g., `useDocumentCapture`)

## Testing the Migration

1. **Test Techie US Flow**: Complete signup flow for US Techie
2. **Test Techie India Flow**: Complete signup flow for India Techie
3. **Test Step Navigation**: Back/Next buttons work correctly
4. **Test Validation**: Each step validates correctly
5. **Test Form Persistence**: Data persists when navigating between steps

## Common Issues & Solutions

### Issue: State Not Persisting Between Steps

**Solution**: Ensure all updates go through `updateFormData`:
```typescript
// ✅ Correct
updateFormData({ field: value });

// ❌ Wrong
setFormData({ ...formData, field: value });
```

### Issue: Validation Not Working

**Solution**: Ensure validation function returns `boolean | string`:
```typescript
const validate = (data: any): boolean | string => {
  if (!data.field) return 'Field is required';
  return true; // Not just true
};
```

### Issue: Step Component Not Rendering

**Solution**: Check that component is properly exported and imported:
```typescript
// ✅ Correct
export default DocumentVerification;

// ❌ Wrong
export { DocumentVerification };
```

## Next Steps After Migration

1. **Add Other Signup Types**: HR, Company, School
2. **Extract Shared Logic**: Move common functions to `utils/`
3. **Add Unit Tests**: Test each step component
4. **Add Integration Tests**: Test complete flows
5. **Optimize Performance**: Memoize components if needed

## Rollback Plan

If issues arise:
1. Keep old `Signup.tsx` as `Signup.tsx.backup`
2. Use feature flag to toggle between old and new:
   ```typescript
   const USE_NEW_SIGNUP = process.env.REACT_APP_USE_NEW_SIGNUP === 'true';
   return USE_NEW_SIGNUP ? <NewSignup /> : <OldSignup />;
   ```

