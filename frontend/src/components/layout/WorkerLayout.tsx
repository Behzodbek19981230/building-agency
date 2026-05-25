import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { LayoutDashboard, User, FileText, Image, DollarSign, MessageSquare, Bell } from 'lucide-react';
import { useNotificationStore } from '@store/notificationStore';
import { useChatStore } from '@store/chatStore';

const workerNavItems = [
	{ label: 'Dashboard', href: '/worker', icon: LayoutDashboard },
	{ label: 'Profilim', href: '/worker/profile', icon: User },
	{ label: 'Takliflarim', href: '/worker/bids', icon: FileText },
	{ label: 'Portfolio', href: '/worker/portfolio', icon: Image },
	{ label: 'Daromadlar', href: '/worker/earnings', icon: DollarSign },
	{ label: 'Xabarlar', href: '/worker/chat', icon: MessageSquare },
	{ label: 'Bildirishnomalar', href: '/worker/notifications', icon: Bell },
];

const mobileNavItems = [
	{ label: 'Bosh', href: '/worker', icon: LayoutDashboard },
	{ label: 'Takliflar', href: '/worker/bids', icon: FileText },
	{ label: 'Chat', href: '/worker/chat', icon: MessageSquare },
	{ label: 'Daromad', href: '/worker/earnings', icon: DollarSign },
	{ label: 'Profil', href: '/worker/profile', icon: User },
];

export function WorkerLayout() {
	const { unreadCount } = useNotificationStore();
	const { unreadTotal } = useChatStore();

	const mobileItems = mobileNavItems.map((item) => {
		if (item.href === '/worker/notifications') return { ...item, badge: unreadCount };
		if (item.href === '/worker/chat') return { ...item, badge: unreadTotal };
		return item;
	});

	return (
		<div className='min-h-screen bg-surface-50'>
			<Navbar />
			<div className='flex'>
				<Sidebar items={workerNavItems} basePath='/worker' />
				<main className='flex-1 p-4 md:p-6 pb-20 lg:pb-6 min-w-0'>
					<Outlet />
				</main>
			</div>
			<MobileBottomNav items={mobileItems} />
		</div>
	);
}
