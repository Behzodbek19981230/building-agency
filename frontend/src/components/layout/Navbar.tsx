import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { Bell, Menu, X, HardHat, LogOut, User, ChevronDown, LayoutDashboard } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNotificationStore } from '@store/notificationStore';
import { clsx } from 'clsx';
import { getImageUrl } from '@/utils/image';

export function Navbar() {
	const { isAuthenticated, user, logout } = useAuthStore();
	const { unreadCount } = useNotificationStore();
	const navigate = useNavigate();
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const userMenuRef = useRef<HTMLDivElement>(null);

	const handleLogout = () => {
		logout();
		setDrawerOpen(false);
		setUserMenuOpen(false);
		navigate('/');
	};

	const dashboardLink =
		user?.role === 'ADMIN' ? '/admin' : user?.role === 'WORKER' ? '/worker' : '/client';

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 10);
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	useEffect(() => {
		const onClickOutside = (e: MouseEvent) => {
			if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
				setUserMenuOpen(false);
			}
		};
		document.addEventListener('mousedown', onClickOutside);
		return () => document.removeEventListener('mousedown', onClickOutside);
	}, []);

	useEffect(() => {
		if (drawerOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	}, [drawerOpen]);

	return (
		<>
			<nav
				className={clsx(
					'sticky top-0 z-50 transition-all duration-300',
					scrolled
						? 'bg-white/95 backdrop-blur-xl shadow-nav border-b border-border'
						: 'bg-white/95 backdrop-blur-sm border-b border-border',
				)}
			>
				<div className='max-w-6xl mx-auto px-4 sm:px-6'>
					<div className='flex items-center justify-between h-16'>
						{/* Logo */}
						<Link
							to='/'
							className='flex items-center gap-2 font-bold text-lg'
							onClick={() => setDrawerOpen(false)}
						>
							<div className='w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-sm'>
								<HardHat className='w-4 h-4 text-white' />
							</div>
							<span className='text-foreground'>Build<span className='text-primary'>Hub</span></span>
						</Link>

						{/* Desktop nav links */}
						<div className='hidden md:flex items-center gap-1'>
							<Link to='/projects' className='px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all'>
								Loyihalar
							</Link>
							<Link to='/workers' className='px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all'>
								Ustalar
							</Link>
						</div>

						{/* Right side */}
						<div className='flex items-center gap-2'>
							{isAuthenticated ? (
								<>
									{/* Notifications */}
									<Link
										to={`${dashboardLink}/notifications`}
										className='relative p-2.5 rounded-xl hover:bg-muted transition-colors'
									>
										<Bell className='w-5 h-5' />
										{unreadCount > 0 && (
											<span className='absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none'>
												{unreadCount > 9 ? '9+' : unreadCount}
											</span>
										)}
									</Link>

									{/* User menu */}
									<div className='relative hidden md:block' ref={userMenuRef}>
										<button
											onClick={() => setUserMenuOpen(!userMenuOpen)}
											className='flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-muted transition-all'
										>
											{user?.avatar ? (
												<img src={getImageUrl(user.avatar)} alt='' className='w-8 h-8 rounded-xl object-cover' />
											) : (
												<div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold'>
													{user?.firstName?.[0]}{user?.lastName?.[0]}
												</div>
											)}
											<span className='text-sm font-semibold'>{user?.firstName}</span>
											<ChevronDown
												className={clsx(
													'w-4 h-4 text-muted-foreground transition-transform',
													userMenuOpen && 'rotate-180',
												)}
											/>
										</button>

										{userMenuOpen && (
											<div className='absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl border shadow-float py-2 z-50 animate-scale-in'>
												<div className='px-4 py-2 border-b border-border mb-1'>
													<p className='text-xs text-muted-foreground'>Kirgan sifatida</p>
													<p className='text-sm font-semibold'>{user?.firstName} {user?.lastName}</p>
												</div>
												<Link
													to={dashboardLink}
													className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors rounded-xl mx-1'
													onClick={() => setUserMenuOpen(false)}
												>
													<LayoutDashboard className='w-4 h-4 text-muted-foreground' /> Dashboard
												</Link>
												<Link
													to={`${dashboardLink === '/worker' ? '/worker/profile' : '/client'}`}
													className='flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors rounded-xl mx-1'
													onClick={() => setUserMenuOpen(false)}
												>
													<User className='w-4 h-4 text-muted-foreground' /> Profil
												</Link>
												<div className='border-t border-border mt-1 pt-1'>
													<button
														onClick={handleLogout}
														className='flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 w-full text-left transition-colors rounded-xl mx-1'
													>
														<LogOut className='w-4 h-4' /> Chiqish
													</button>
												</div>
											</div>
										)}
									</div>

									{/* Mobile avatar */}
									<button
										onClick={() => setDrawerOpen(true)}
										className='md:hidden flex items-center'
									>
										{user?.avatar ? (
											<img src={getImageUrl(user.avatar)} alt='' className='w-9 h-9 rounded-xl object-cover' />
										) : (
											<div className='w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-sm font-bold'>
												{user?.firstName?.[0]}{user?.lastName?.[0]}
											</div>
										)}
									</button>
								</>
							) : (
								<div className='flex items-center gap-2'>
									<Link to='/auth/login' className='hidden sm:flex btn-ghost text-sm px-4 py-2'>
										Kirish
									</Link>
									<Link to='/auth/register' className='btn-primary text-sm px-4 py-2.5'>
										Ro'yxatdan o'tish
									</Link>
								</div>
							)}

							{/* Mobile menu toggle (for non-authenticated) */}
							{!isAuthenticated && (
								<button
									className='md:hidden p-2.5 rounded-xl hover:bg-muted transition-colors'
									onClick={() => setDrawerOpen(!drawerOpen)}
								>
									<Menu className='w-5 h-5' />
								</button>
							)}
						</div>
					</div>
				</div>
			</nav>

			{/* ─── Mobile Drawer ────────────────────────────── */}
			{/* Overlay */}
			{drawerOpen && (
				<div
					className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
					onClick={() => setDrawerOpen(false)}
				/>
			)}

			{/* Drawer */}
			<div
				className={clsx(
					'fixed top-0 right-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col',
					drawerOpen ? 'translate-x-0' : 'translate-x-full',
				)}
			>
				{/* Drawer header */}
				<div className='flex items-center justify-between px-5 h-16 border-b border-border'>
					<Link to='/' className='flex items-center gap-2 font-bold' onClick={() => setDrawerOpen(false)}>
						<div className='w-7 h-7 bg-primary rounded-lg flex items-center justify-center'>
							<HardHat className='w-3.5 h-3.5 text-white' />
						</div>
						<span className='text-foreground'>Build<span className='text-primary'>Hub</span></span>
					</Link>
					<button
						onClick={() => setDrawerOpen(false)}
						className='p-2 rounded-xl hover:bg-muted transition-colors'
					>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Drawer content */}
				<div className='flex-1 overflow-y-auto py-4 px-3'>
					{isAuthenticated && (
						<div className='flex items-center gap-3 px-3 py-3 bg-primary/5 rounded-2xl mb-4'>
							{user?.avatar ? (
								<img src={getImageUrl(user.avatar)} alt='' className='w-11 h-11 rounded-xl object-cover' />
							) : (
								<div className='w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-base'>
									{user?.firstName?.[0]}{user?.lastName?.[0]}
								</div>
							)}
							<div>
								<p className='font-semibold text-sm'>{user?.firstName} {user?.lastName}</p>
								<p className='text-xs text-muted-foreground'>{user?.email}</p>
							</div>
						</div>
					)}

					<nav className='space-y-1'>
						{[
							{ to: '/projects', label: 'Loyihalar' },
							{ to: '/workers', label: 'Ustalar' },
							...(isAuthenticated ? [{ to: dashboardLink, label: 'Dashboard' }] : []),
						].map((item) => (
							<Link
								key={item.to}
								to={item.to}
								className='flex items-center px-3 py-3 text-sm font-medium rounded-xl hover:bg-muted transition-colors'
								onClick={() => setDrawerOpen(false)}
							>
								{item.label}
							</Link>
						))}
					</nav>
				</div>

				{/* Drawer footer */}
				<div className='p-4 border-t border-border pb-safe space-y-2'>
					{isAuthenticated ? (
						<button
							onClick={handleLogout}
							className='flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-destructive bg-destructive/5 hover:bg-destructive/10 rounded-xl transition-colors'
						>
							<LogOut className='w-4 h-4' /> Chiqish
						</button>
					) : (
						<>
							<Link
								to='/auth/login'
								className='btn-outline w-full'
								onClick={() => setDrawerOpen(false)}
							>
								Kirish
							</Link>
							<Link
								to='/auth/register'
								className='btn-primary w-full'
								onClick={() => setDrawerOpen(false)}
							>
								Ro'yxatdan o'tish
							</Link>
						</>
					)}
				</div>
			</div>
		</>
	);
}
