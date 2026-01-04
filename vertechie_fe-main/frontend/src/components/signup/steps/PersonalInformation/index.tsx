import React from 'react';
import { StepComponentProps } from '../../types';
import USPersonalInformation from './USPersonalInformation';
import IndiaPersonalInformation from './IndiaPersonalInformation';
import GenericPersonalInformation from './GenericPersonalInformation';

const PersonalInformation: React.FC<StepComponentProps> = (props) => {
  const { location } = props;

  switch (location) {
    case 'US':
      return <USPersonalInformation {...props} />;
    case 'IN':
      return <IndiaPersonalInformation {...props} />;
    case 'UK':
    case 'CA':
    case 'DE':
    case 'CH':
    case 'CN':
      return <GenericPersonalInformation {...props} />;
    default:
      return <USPersonalInformation {...props} />;
  }
};

export default PersonalInformation;

