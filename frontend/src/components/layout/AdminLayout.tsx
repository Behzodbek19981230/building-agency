import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import {
  LayoutDashboard, Users, HardHat, FolderOpen, AlertTriangle, BarChart3
} from 'lucide-react';

const adminNavItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Foydalanuvchilar', href: '/admin/users', icon: Users },
  { label: 'Ustalar', href: '/admin/workers', icon: HardHat },
  { label: 'Loyihalar', href: '/admin/projects', icon: FolderOpen },
  { label: 'Nizolar', href: '/admin/disputes', icon: AlertTriangle },
  { label: 'Analitika', href: '/admin/analytics', icon: BarChart3 },
];

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar items={adminNavItems} basePath="/admin" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
