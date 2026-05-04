import React from 'react';
import { StepComponentProps } from '../../types';
import E2EDocumentStubStep, { isE2eStub } from './E2EDocumentStubStep';
import USDocumentVerification from './USDocumentVerification';
import IndiaDocumentVerification from './IndiaDocumentVerification';
import UKDocumentVerification from './UKDocumentVerification';
import CanadaDocumentVerification from './CanadaDocumentVerification';
import GermanyDocumentVerification from './GermanyDocumentVerification';
import SwitzerlandDocumentVerification from './SwitzerlandDocumentVerification';
import ChinaDocumentVerification from './ChinaDocumentVerification';
import { IdentityDisclaimerProvider } from './IdentityDisclaimerContext';

const DocumentVerification: React.FC<StepComponentProps> = (props) => {
  const { location, formData, updateFormData } = props;

  if (isE2eStub()) {
    return (
      <IdentityDisclaimerProvider formData={formData} updateFormData={updateFormData}>
        <E2EDocumentStubStep {...props} />
      </IdentityDisclaimerProvider>
    );
  }

  let Step: React.FC<StepComponentProps>;
  switch (location) {
    case 'US':
      Step = USDocumentVerification;
      break;
    case 'IN':
      Step = IndiaDocumentVerification;
      break;
    case 'UK':
      Step = UKDocumentVerification;
      break;
    case 'CA':
      Step = CanadaDocumentVerification;
      break;
    case 'DE':
      Step = GermanyDocumentVerification;
      break;
    case 'CH':
      Step = SwitzerlandDocumentVerification;
      break;
    case 'CN':
      Step = ChinaDocumentVerification;
      break;
    default:
      Step = USDocumentVerification;
  }

  return (
    <IdentityDisclaimerProvider formData={formData} updateFormData={updateFormData}>
      <Step {...props} />
    </IdentityDisclaimerProvider>
  );
};

export default DocumentVerification;

