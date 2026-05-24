import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import {
  LayoutDashboard, User, FileText, Image, DollarSign, MessageSquare, Bell
} from 'lucide-react';

const workerNavItems = [
  { label: 'Dashboard', href: '/worker', icon: LayoutDashboard },
  { label: 'Profilim', href: '/worker/profile', icon: User },
  { label: 'Takliflarim', href: '/worker/bids', icon: FileText },
  { label: 'Portfolio', href: '/worker/portfolio', icon: Image },
  { label: 'Daromadlar', href: '/worker/earnings', icon: DollarSign },
  { label: 'Xabarlar', href: '/worker/chat', icon: MessageSquare },
  { label: 'Bildirishnomalar', href: '/worker/notifications', icon: Bell },
];

export function WorkerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar items={workerNavItems} basePath="/worker" />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
