'use client';
import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export interface LoginParams {
  email: string;
  password: string;
}

const ERROR_MESSAGES = {
  MISSING_CREDENTIALS: 'Please enter your email and password.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  DEFAULT: 'Something went wrong. Please try again.',
} as const;

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ email, password }: LoginParams) => {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        const message =
          result.error in ERROR_MESSAGES
            ? ERROR_MESSAGES[result.error as keyof typeof ERROR_MESSAGES]
            : ERROR_MESSAGES.DEFAULT;
        throw new Error(message);
      }
      return result;
    },
    onSuccess: () => {
      toast.success('Successfully logged in');
      router.push('/admin/dashboard');
    },
  });
};
