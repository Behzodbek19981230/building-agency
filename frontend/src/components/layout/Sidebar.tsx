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
	basePath: string;
}

export function Sidebar({ items, basePath }: Props) {
	const location = useLocation();

	return (
		<aside className='w-60 xl:w-64 sticky top-16 h-[calc(100vh-4rem)] bg-white border-r border-border hidden lg:flex flex-col'>
			<nav className='flex-1 p-3 space-y-0.5'>
				{items.map((item) => {
					const Icon = item.icon;
					const isActive =
						location.pathname === item.href ||
						(item.href !== basePath && location.pathname.startsWith(item.href + '/'));

					return (
						<Link
							key={item.href}
							to={item.href}
							className={clsx(
								'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
								isActive
									? 'bg-primary/10 text-primary'
									: 'text-muted-foreground hover:bg-muted hover:text-foreground',
							)}
						>
							<div
								className={clsx(
									'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all',
									isActive
										? 'bg-primary/10 text-primary'
										: 'text-muted-foreground group-hover:bg-muted-foreground/10 group-hover:text-foreground',
								)}
							>
								<Icon className='w-4 h-4' />
							</div>
							<span className='flex-1 truncate'>{item.label}</span>
							{item.badge !== undefined && item.badge > 0 && (
								<span className='bg-primary text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1'>
									{item.badge > 9 ? '9+' : item.badge}
								</span>
							)}
						</Link>
					);
				})}
			</nav>

			{/* Bottom branding */}
			<div className='p-4 border-t border-border'>
				<div className='flex items-center gap-2 text-xs text-muted-foreground'>
					<div className='w-5 h-5 bg-primary/10 rounded-md flex items-center justify-center'>
						<span className='text-primary font-bold text-[10px]'>B</span>
					</div>
					<span>BuildHub v1.0</span>
				</div>
			</div>
		</aside>
	);
}
