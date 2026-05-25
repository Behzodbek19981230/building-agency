import { clsx } from 'clsx';

interface AvatarProps {
	src?: string | null;
	name?: string | null;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	shape?: 'circle' | 'rounded';
	className?: string;
	online?: boolean;
}

const sizeMap = {
	xs: 'w-6 h-6 text-[10px]',
	sm: 'w-8 h-8 text-xs',
	md: 'w-10 h-10 text-sm',
	lg: 'w-12 h-12 text-base',
	xl: 'w-16 h-16 text-xl',
};

const onlineSizeMap = {
	xs: 'w-1.5 h-1.5 -right-0 -bottom-0',
	sm: 'w-2 h-2 right-0 bottom-0',
	md: 'w-2.5 h-2.5 right-0 bottom-0',
	lg: 'w-3 h-3 right-0 bottom-0',
	xl: 'w-3.5 h-3.5 right-0.5 bottom-0.5',
};

function getInitials(name: string) {
	const parts = name.trim().split(/\s+/);
	if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
	return name.slice(0, 2).toUpperCase();
}

export function Avatar({ src, name, size = 'md', shape = 'circle', className, online }: AvatarProps) {
	const shape_cls = shape === 'circle' ? 'rounded-full' : 'rounded-xl';

	return (
		<div className={clsx('relative inline-flex shrink-0', sizeMap[size], className)}>
			{src ? (
				<img
					src={src}
					alt={name ?? ''}
					className={clsx('w-full h-full object-cover', shape_cls)}
				/>
			) : (
				<div
					className={clsx(
						'w-full h-full bg-primary/10 text-primary font-bold flex items-center justify-center',
						shape_cls,
					)}
				>
					{name ? getInitials(name) : '?'}
				</div>
			)}
			{online !== undefined && (
				<span
					className={clsx(
						'absolute border-2 border-white rounded-full',
						onlineSizeMap[size],
						online ? 'bg-emerald-500' : 'bg-gray-300',
					)}
				/>
			)}
		</div>
	);
}
