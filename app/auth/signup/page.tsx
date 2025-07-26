import React from 'react';
import { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/signupForm';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Join us and get started in seconds!',
};

export default function page() {
  return <SignUpForm />;
}
