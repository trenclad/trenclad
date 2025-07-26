import React from 'react';
import { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/resetForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password and get back to business.',
};

export default function page() {
  return <ResetPasswordForm />;
}
