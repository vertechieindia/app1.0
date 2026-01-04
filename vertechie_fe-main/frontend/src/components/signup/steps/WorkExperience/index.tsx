import React from 'react';
import { StepComponentProps } from '../../types';
import WorkExperienceForm from './WorkExperienceForm';

const WorkExperience: React.FC<StepComponentProps> = (props) => {
  return <WorkExperienceForm {...props} />;
};

export default WorkExperience;

