import { ensureAdminOrRedirect } from '../../lib/auth/server';
import { AdminLayout } from '../../src/components/layout/admin-layout';

// Layout for authenticated admin routes
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Ensure user is authenticated admin before rendering layout
  await ensureAdminOrRedirect();

  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}