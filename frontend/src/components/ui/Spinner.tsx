import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

interface SpinnerProps {
	size?: 'xs' | 'sm' | 'md' | 'lg';
	className?: string;
	label?: string;
}

const sizeMap = {
	xs: 'w-3 h-3',
	sm: 'w-4 h-4',
	md: 'w-6 h-6',
	lg: 'w-8 h-8',
};

export function Spinner({ size = 'md', className, label }: SpinnerProps) {
	return (
		<div className={clsx('flex flex-col items-center justify-center gap-3', className)}>
			<Loader2 className={clsx('animate-spin text-primary', sizeMap[size])} />
			{label && <p className='text-sm text-muted-foreground'>{label}</p>}
		</div>
	);
}

export function PageSpinner({ label = 'Yuklanmoqda...' }: { label?: string }) {
	return (
		<div className='flex items-center justify-center min-h-[300px]'>
			<Spinner size='lg' label={label} />
		</div>
	);
}
