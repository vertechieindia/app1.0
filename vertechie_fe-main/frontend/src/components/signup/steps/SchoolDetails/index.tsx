import React from 'react';
import { StepComponentProps } from '../../types';
import SchoolDetailsForm from './SchoolDetailsForm';

const SchoolDetails: React.FC<StepComponentProps> = (props) => {
  return <SchoolDetailsForm {...props} />;
};

export default SchoolDetails;

