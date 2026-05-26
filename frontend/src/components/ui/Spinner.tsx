import { clsx } from 'clsx';

interface SpinnerProps {
	size?: 'xs' | 'sm' | 'md' | 'lg';
	className?: string;
}

const sizeMap = {
	xs: 'w-4 h-4 border-[2px]',
	sm: 'w-5 h-5 border-[2px]',
	md: 'w-7 h-7 border-[2.5px]',
	lg: 'w-10 h-10 border-[3px]',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
	return (
		<div
			className={clsx(
				'rounded-full border-primary/20 border-t-primary animate-spin',
				sizeMap[size],
				className,
			)}
		/>
	);
}

export function PageSpinner({ label }: { label?: string }) {
	return (
		<div className="flex flex-col items-center justify-center min-h-[300px] gap-5">
			<div className="relative flex items-center justify-center">
				{/* outer soft ring */}
				<div className="w-16 h-16 rounded-full border-4 border-primary/10" />
				{/* spinning arc */}
				<div className="absolute w-16 h-16 rounded-full border-4 border-transparent border-t-primary animate-spin" />
				{/* inner pulse dot */}
				<div className="absolute w-5 h-5 rounded-full bg-primary/20 animate-pulse" />
				<div className="absolute w-2.5 h-2.5 rounded-full bg-primary" />
			</div>
			{label && (
				<p className="text-sm font-medium text-muted-foreground tracking-wide">{label}</p>
			)}
		</div>
	);
}
