import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { MobileBottomNav } from './MobileBottomNav';
import { LayoutDashboard, User, FileText, Image, DollarSign, MessageSquare, Bell } from 'lucide-react';
import { useNotificationStore } from '@store/notificationStore';
import { useChatStore } from '@store/chatStore';
import { useAuthStore } from '@store/authStore';
import { AvatarUpload } from '@components/shared/AvatarUpload';

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

function AvatarRequiredModal() {
	const { user } = useAuthStore();

	return (
		<div className='fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4'>
			<div className='bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 flex flex-col items-center gap-5 text-center'>
				<div className='w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center'>
					<User className='w-8 h-8 text-primary' />
				</div>

				<div>
					<h2 className='text-xl font-bold mb-2'>Profil rasmingizni qo'shing</h2>
					<p className='text-sm text-muted-foreground leading-relaxed'>
						Mijozlar sizni topishi uchun profil rasmingiz bo'lishi majburiy.
						Rasm qo'ymasdan davom eta olmaysiz.
					</p>
				</div>

				<AvatarUpload size='lg' />

				<p className='text-xs text-muted-foreground'>
					Salom, <span className='font-semibold'>{user?.firstName}</span>! Rasm yuklagandan so'ng avtomatik davom etadi.
				</p>
			</div>
		</div>
	);
}

export function WorkerLayout() {
	const { unreadCount } = useNotificationStore();
	const { unreadTotal } = useChatStore();
	const { user } = useAuthStore();

	const mobileItems = mobileNavItems.map((item) => {
		if (item.href === '/worker/notifications') return { ...item, badge: unreadCount };
		if (item.href === '/worker/chat') return { ...item, badge: unreadTotal };
		return item;
	});

	const needsAvatar = !user?.avatar;

	return (
		<div className='min-h-screen bg-surface-50 pt-16'>
			{needsAvatar && <AvatarRequiredModal />}
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
