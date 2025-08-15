'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@tradygo/ui';
import { Button } from '@tradygo/ui';
import { Input } from '@tradygo/ui';
import { Alert, AlertDescription } from '@tradygo/ui';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { configService } from '../../../lib/config/config.service';
import { login } from '../../../lib/auth/client';

interface AppBranding {
  name: string;
  logoUrl: string;
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [branding, setBranding] = useState<AppBranding>({
    name: 'TradyGo',
    logoUrl: 'https://cdn.tradygo.in/brand/admin-logo.svg',
  });

  // Load configuration on component mount
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const brandingData = await configService.getBranding();
        setBranding(brandingData);
      } catch (error) {
        console.error('Failed to load configuration:', error);
      }
    };

    loadConfig();
  }, []);

  // Check for error parameter in URL
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'access_denied') {
      setError('Access denied. Admin privileges required.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login({ email, password });
      
      if (result.success) {
        // Redirect to dashboard on successful login
        window.location.href = '/dashboard';
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Brand */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-2xl">
              {branding.name.charAt(0)}
            </span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to {branding.name}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Admin Dashboard
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign in to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@tradygo.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>Protected by secure authentication</p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}