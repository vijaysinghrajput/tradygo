import { redirect } from 'next/navigation';

export default function NewSellerPage() {
  // Redirect to the existing new vendor page
  redirect('/admin/vendors/new');
}