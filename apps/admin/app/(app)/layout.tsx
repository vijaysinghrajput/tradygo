import { AdminLayout } from '../../src/components/layout/admin-layout';

// Layout for authenticated admin routes
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}