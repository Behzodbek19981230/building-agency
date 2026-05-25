import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LucideIcon } from 'lucide-react';

interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
	badge?: number;
}

interface Props {
	items: NavItem[];
}

export function MobileBottomNav({ items }: Props) {
	const location = useLocation();
	const displayItems = items.slice(0, 5);

	return (
		<nav className='lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-border mobile-nav-safe shadow-[0_-1px_0_0_hsl(var(--border))]'>
			<div className='grid h-16' style={{ gridTemplateColumns: `repeat(${displayItems.length}, 1fr)` }}>
				{displayItems.map((item) => {
					const Icon = item.icon;
					const isActive =
						location.pathname === item.href ||
						(item.href !== '/' && location.pathname.startsWith(item.href + '/'));

					return (
						<Link
							key={item.href}
							to={item.href}
							className={clsx(
								'flex flex-col items-center justify-center gap-1 px-1 transition-all duration-150 active:scale-90',
								isActive ? 'text-primary' : 'text-muted-foreground',
							)}
						>
							<div className='relative'>
								<div
									className={clsx(
										'flex items-center justify-center w-10 h-6 rounded-full transition-all',
										isActive && 'bg-primary/10',
									)}
								>
									<Icon className={clsx('w-5 h-5 transition-all', isActive && 'scale-110')} />
								</div>
								{item.badge !== undefined && item.badge > 0 && (
									<span className='absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none'>
										{item.badge > 9 ? '9+' : item.badge}
									</span>
								)}
							</div>
							<span className={clsx('text-[10px] font-semibold leading-none', isActive ? 'text-primary' : 'text-muted-foreground')}>
								{item.label}
							</span>
						</Link>
					);
				})}
			</div>
		</nav>
	);
}
