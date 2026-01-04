import React from 'react';
import { StepComponentProps } from '../../types';
import EducationForm from './EducationForm';

const EducationDetails: React.FC<StepComponentProps> = (props) => {
  return <EducationForm {...props} />;
};

export default EducationDetails;

