import { redirect } from 'next/navigation';
import { configService } from '../lib/config/config.service';

export default async function RootPage() {
  const redirectConfig = await configService.getRedirectConfig();
  redirect(redirectConfig.admin);
}