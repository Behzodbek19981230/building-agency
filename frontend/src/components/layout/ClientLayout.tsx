import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import {
  LayoutDashboard, FolderOpen, PlusCircle, CreditCard, MessageSquare, Bell
} from 'lucide-react';

const clientNavItems = [
  { label: 'Dashboard', href: '/client', icon: LayoutDashboard },
  { label: 'Loyihalarim', href: '/client/projects', icon: FolderOpen },
  { label: 'Yangi loyiha', href: '/client/projects/create', icon: PlusCircle },
  { label: 'To\'lovlar', href: '/client/payments', icon: CreditCard },
  { label: 'Xabarlar', href: '/client/chat', icon: MessageSquare },
  { label: 'Bildirishnomalar', href: '/client/notifications', icon: Bell },
];

export function ClientLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar items={clientNavItems} basePath="/client" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
