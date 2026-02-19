'use client';
import { signIn } from 'next-auth/react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export interface LoginParams {
  email: string;
  password: string;
}

export const useLogin = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async ({ email, password }: LoginParams) => {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) throw new Error('Invalid email or password');
      return result;
    },
    onSuccess: () => {
      toast.success('Successfully logged in')
      router.push('/admin/dashboard')
    }
  });
};