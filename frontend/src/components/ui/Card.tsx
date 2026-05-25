import { clsx } from 'clsx';

interface CardProps {
	children: React.ReactNode;
	className?: string;
	hover?: boolean;
	padding?: 'none' | 'sm' | 'md' | 'lg';
	onClick?: () => void;
}

const paddingMap = {
	none: '',
	sm: 'p-4',
	md: 'p-5 md:p-6',
	lg: 'p-6 md:p-8',
};

export function Card({ children, className, hover, padding = 'md', onClick }: CardProps) {
	return (
		<div
			onClick={onClick}
			className={clsx(
				'bg-card text-card-foreground rounded-2xl border border-border shadow-card',
				hover && 'hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer',
				paddingMap[padding],
				className,
			)}
		>
			{children}
		</div>
	);
}

export function CardHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={clsx('flex items-center justify-between gap-4 mb-4', className)}>
			{children}
		</div>
	);
}

export function CardTitle({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<h3 className={clsx('font-semibold text-base md:text-lg leading-tight', className)}>
			{children}
		</h3>
	);
}

export function CardBody({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return <div className={clsx(className)}>{children}</div>;
}

export function CardFooter({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={clsx('flex items-center gap-3 pt-4 mt-4 border-t border-border', className)}>
			{children}
		</div>
	);
}
