import { AdminDashboard } from '@/PetWorld/Admin/AdminDashboard';

export const metadata = {
  title: 'PetWorld Admin Portal – Product & Order Management',
  description: 'Manage PetWorld products, orders, categories, customer records, and store analytics.',
};

export default function AdminPage() {
  return <AdminDashboard />;
}
