'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@tradygo/ui';
import { Input } from '@tradygo/ui';
import { Loader2, Mail } from 'lucide-react';
import { api } from '@/lib/api';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setError(null);
    setEmail(data.email);

    try {
      await api.post('/auth/forgot-password', {
        email: data.email,
      });

      setSuccess(true);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      
      if (err.status === 404) {
        setError('No account found with this email address.');
      } else if (err.status === 429) {
        setError('Too many requests. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Check your email</h3>
        <p className="mt-2 text-sm text-gray-600">
          We've sent a password reset link to{' '}
          <span className="font-medium">{email}</span>
        </p>
        <p className="mt-2 text-xs text-gray-500">
          If you don't see the email, check your spam folder or try again with a different email address.
        </p>
        
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setEmail('');
            }}
            className="w-full"
          >
            Try another email
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email address"
            {...register('email')}
            className={errors.email ? 'border-red-300' : ''}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          We'll send you a link to reset your password.
        </p>
      </div>

      <div>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send reset link'
          )}
        </Button>
      </div>
    </form>
  );
}