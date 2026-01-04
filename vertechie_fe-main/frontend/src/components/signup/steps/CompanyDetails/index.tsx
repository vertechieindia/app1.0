import React from 'react';
import { StepComponentProps } from '../../types';
import CompanyDetailsForm from './CompanyDetailsForm';

const CompanyDetails: React.FC<StepComponentProps> = (props) => {
  return <CompanyDetailsForm {...props} />;
};

export default CompanyDetails;

