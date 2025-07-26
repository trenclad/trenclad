import React from 'react';
import { Metadata } from 'next';
import { SignInForm } from '@/components/auth/signinForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Welcome back! Sign in to continue.',
};

export default function page() {
  return <SignInForm />;
}
