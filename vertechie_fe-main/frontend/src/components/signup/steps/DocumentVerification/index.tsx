import React from 'react';
import { StepComponentProps } from '../../types';
import USDocumentVerification from './USDocumentVerification';
import IndiaDocumentVerification from './IndiaDocumentVerification';
import UKDocumentVerification from './UKDocumentVerification';
import CanadaDocumentVerification from './CanadaDocumentVerification';
import GermanyDocumentVerification from './GermanyDocumentVerification';
import SwitzerlandDocumentVerification from './SwitzerlandDocumentVerification';
import ChinaDocumentVerification from './ChinaDocumentVerification';

const DocumentVerification: React.FC<StepComponentProps> = (props) => {
  const { location } = props;

  switch (location) {
    case 'US':
      return <USDocumentVerification {...props} />;
    case 'IN':
      return <IndiaDocumentVerification {...props} />;
    case 'UK':
      return <UKDocumentVerification {...props} />;
    case 'CA':
      return <CanadaDocumentVerification {...props} />;
    case 'DE':
      return <GermanyDocumentVerification {...props} />;
    case 'CH':
      return <SwitzerlandDocumentVerification {...props} />;
    case 'CN':
      return <ChinaDocumentVerification {...props} />;
    default:
      return <USDocumentVerification {...props} />;
  }
};

export default DocumentVerification;

