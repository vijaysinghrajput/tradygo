import { redirect } from 'next/navigation';
import { fetchMeOrNull } from '../lib/auth/server';
import { configService } from '../lib/config/config.service';

export default async function RootPage() {
  // Check if user is authenticated
  const user = await fetchMeOrNull();
  
  // Get dynamic redirect configuration
  const redirectConfig = await configService.getRedirectConfig();
  
  if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
    // User is authenticated admin, redirect to configured dashboard URL
    redirect(redirectConfig.admin);
  } else {
    // User is not authenticated or not admin, redirect to login
    redirect('/login');
  }
}