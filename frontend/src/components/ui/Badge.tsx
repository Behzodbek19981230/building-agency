import { clsx } from 'clsx';

type BadgeVariant =
	| 'default'
	| 'primary'
	| 'secondary'
	| 'success'
	| 'warning'
	| 'danger'
	| 'info'
	| 'outline';

const variantStyles: Record<BadgeVariant, string> = {
	default: 'bg-muted text-muted-foreground',
	primary: 'bg-primary/10 text-primary',
	secondary: 'bg-secondary text-secondary-foreground',
	success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
	warning: 'bg-amber-50 text-amber-700 border border-amber-200',
	danger: 'bg-red-50 text-red-700 border border-red-200',
	info: 'bg-blue-50 text-blue-700 border border-blue-200',
	outline: 'border border-border text-muted-foreground bg-transparent',
};

interface BadgeProps {
	variant?: BadgeVariant;
	children: React.ReactNode;
	className?: string;
	dot?: boolean;
}

export function Badge({ variant = 'default', children, className, dot }: BadgeProps) {
	return (
		<span
			className={clsx(
				'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold',
				variantStyles[variant],
				className,
			)}
		>
			{dot && (
				<span
					className={clsx(
						'w-1.5 h-1.5 rounded-full flex-shrink-0',
						variant === 'success' && 'bg-emerald-500',
						variant === 'warning' && 'bg-amber-500',
						variant === 'danger' && 'bg-red-500',
						variant === 'primary' && 'bg-primary',
						variant === 'info' && 'bg-blue-500',
						(variant === 'default' || variant === 'secondary' || variant === 'outline') &&
							'bg-muted-foreground',
					)}
				/>
			)}
			{children}
		</span>
	);
}

/* ─── Status Badge ───────────────────────────────────── */
const statusMap: Record<
	string,
	{ label: string; variant: BadgeVariant; dot: boolean }
> = {
	// Projects
	OPEN: { label: 'Ochiq', variant: 'success', dot: true },
	IN_PROGRESS: { label: 'Jarayonda', variant: 'info', dot: true },
	COMPLETED: { label: 'Tugallandi', variant: 'success', dot: false },
	CANCELLED: { label: 'Bekor qilindi', variant: 'danger', dot: false },
	DISPUTED: { label: 'Nizo', variant: 'warning', dot: true },
	// Bids
	PENDING: { label: 'Kutilmoqda', variant: 'warning', dot: true },
	ACCEPTED: { label: 'Qabul qilindi', variant: 'success', dot: false },
	REJECTED: { label: 'Rad etildi', variant: 'danger', dot: false },
	WITHDRAWN: { label: "Qaytarib olindi", variant: 'default', dot: false },
	// Users
	ACTIVE: { label: 'Faol', variant: 'success', dot: true },
	INACTIVE: { label: 'Nofaol', variant: 'default', dot: false },
	SUSPENDED: { label: "To'xtatildi", variant: 'danger', dot: true },
	// Payments
	ESCROW: { label: 'Escrowda', variant: 'info', dot: true },
	RELEASED: { label: "O'tkazildi", variant: 'success', dot: false },
	REFUNDED: { label: 'Qaytarildi', variant: 'warning', dot: false },
	// Worker
	VERIFIED: { label: 'Tasdiqlangan', variant: 'success', dot: false },
	UNVERIFIED: { label: 'Tasdiqlanmagan', variant: 'default', dot: false },
};

export function StatusBadge({ status }: { status: string }) {
	const config = statusMap[status] ?? { label: status, variant: 'default' as BadgeVariant, dot: false };
	return (
		<Badge variant={config.variant} dot={config.dot}>
			{config.label}
		</Badge>
	);
}
