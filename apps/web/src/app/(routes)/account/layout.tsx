import { redirect } from 'next/navigation';
import { getUser } from '@/lib/auth';
import { AccountSidebar } from '@/components/account/account-sidebar';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect('/login?returnUrl=/account');
  }

  if (user.role !== 'CUSTOMER') {
    redirect('/');
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
        <aside className="lg:col-span-3">
          <AccountSidebar user={user} />
        </aside>
        <main className="lg:col-span-9">
          <div className="bg-white shadow sm:rounded-lg">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}