'use client';

import { useLogin } from '@/lib/hooks/admin/queries/useAuth';
import { FormEvent, useState } from 'react';
import z from 'zod';
import FormField from './components/FormField';
import FormError from './components/FormError';

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, 'Password is required'),
})

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const { mutate: login, isPending: isLoggingIn, error: loginError } = useLogin();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFieldErrors(errors as Record<string, string[]>);
      return;
    }
    login({ email, password });
  };

  return (
    <main className="page flex items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 shadow-md rounded p-10 w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold mb-4 text-gray-100">
          Login
        </h1>
        {
          loginError && (
            <FormError error={loginError.message} className='mt-0 mb-2' />
          )
        }
        <FormField
          id='email'
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          error={fieldErrors.email?.[0]}
        />

        <FormField
          id='password'
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          error={fieldErrors.password?.[0]}
        />

        <button
          type="submit"
          disabled={isLoggingIn}
          className="bg-blue-600 text-white p-2 rounded w-full hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingIn ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  );
}
