'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@tradygo/ui';
import { Input } from '@tradygo/ui';
import { Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import { api } from '@/lib/api';

const adminLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export function AdminLoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post('/auth/admin/login', {
        email: data.email,
        password: data.password,
      });

      const { accessToken, refreshToken, user } = response.data;

      // Verify user has admin role
      if (user.role !== 'ADMIN') {
        setError('Access denied. Admin privileges required.');
        return;
      }

      // Set authentication cookies
      document.cookie = `accessToken=${accessToken}; path=/; secure; sameSite=strict`;
      document.cookie = `refreshToken=${refreshToken}; path=/; secure; sameSite=strict`;

      // Redirect to admin dashboard
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('Admin login error:', err);
      
      if (err.status === 401) {
        setError('Invalid email or password');
      } else if (err.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (err.status === 429) {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <div className="text-sm text-red-700">{error}</div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@tradygo.com"
          {...register('email')}
          className={errors.email ? 'border-red-300' : ''}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="Enter your admin password"
            {...register('password')}
            className={errors.password ? 'border-red-300 pr-10' : 'pr-10'}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-400" />
            ) : (
              <Eye className="h-4 w-4 text-gray-400" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div className="text-sm">
          <a href="#" className="font-medium text-primary hover:text-primary/80">
            Forgot password?
          </a>
        </div>
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
              Signing in...
            </>
          ) : (
            'Sign in to Admin Panel'
          )}
        </Button>
      </div>

      <div className="text-center">
        <p className="text-xs text-gray-500">
          Only authorized administrators can access this panel.
        </p>
      </div>
    </form>
  );
}