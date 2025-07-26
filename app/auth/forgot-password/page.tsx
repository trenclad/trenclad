import React from 'react';
import { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/forgotForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Lost your password? Let’s get you back in.',
};

export default function page() {
  return <ForgotPasswordForm />;
}
