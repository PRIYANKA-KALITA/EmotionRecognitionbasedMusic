import React from 'react';
import { SignUp } from '@clerk/clerk-react';

const CustomSignUp = () => {
  return (
    <SignUp
      path="/sign-up"
      routing="path"
      additionalSignUpFields={[
        {
          fieldId: 'fullName',
          label: 'Full Name',
          placeholder: 'Enter your full name',
          required: true,
        },
      ]}
    />
  );
};

export default CustomSignUp;
