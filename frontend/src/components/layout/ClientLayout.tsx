import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { LayoutDashboard, FolderOpen, PlusCircle, CreditCard, MessageSquare, Bell, Settings } from 'lucide-react';
import { useNotificationStore } from '@store/notificationStore';
import { useChatStore } from '@store/chatStore';

const clientNavItems = [
	{ label: 'Dashboard', href: '/client', icon: LayoutDashboard },
	{ label: 'Loyihalar', href: '/client/projects', icon: FolderOpen },
	{ label: 'Yangi loyiha', href: '/client/projects/create', icon: PlusCircle },
	{ label: "To'lovlar", href: '/client/payments', icon: CreditCard },
	{ label: 'Xabarlar', href: '/client/chat', icon: MessageSquare },
	{ label: 'Bildirishnomalar', href: '/client/notifications', icon: Bell },
	{ label: 'Sozlamalar', href: '/client/settings', icon: Settings },
];

const mobileNavItems = [
	{ label: 'Bosh', href: '/client', icon: LayoutDashboard },
	{ label: 'Loyihalar', href: '/client/projects', icon: FolderOpen },
	{ label: 'Yangi', href: '/client/projects/create', icon: PlusCircle },
	{ label: 'Chat', href: '/client/chat', icon: MessageSquare },
	{ label: 'Sozlamalar', href: '/client/settings', icon: Settings },
];

export function ClientLayout() {
	const { unreadCount } = useNotificationStore();
	const { unreadTotal } = useChatStore();

	const mobileItems = mobileNavItems.map((item) => {
		if (item.href === '/client/notifications') return { ...item, badge: unreadCount };
		if (item.href === '/client/chat') return { ...item, badge: unreadTotal };
		return item;
	});

	return (
		<div className='min-h-screen bg-surface-50 pt-16'>
			<Navbar />
			<div className='flex'>
				<Sidebar items={clientNavItems} basePath='/client' />
				<main className='flex-1 p-4 md:p-6 pb-20 lg:pb-6 min-w-0'>
					<Outlet />
				</main>
			</div>
			<MobileBottomNav items={mobileItems} />
		</div>
	);
}
