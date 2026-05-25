import { useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { Button } from './Button';
import { clsx } from 'clsx';

interface ConfirmModalProps {
	open: boolean;
	title: string;
	description?: string;
	confirmLabel?: string;
	cancelLabel?: string;
	variant?: 'danger' | 'success' | 'default';
	loading?: boolean;
	onConfirm: () => void;
	onClose: () => void;
}

const icons = {
	danger:  <AlertTriangle className="w-6 h-6 text-destructive" />,
	success: <CheckCircle className="w-6 h-6 text-emerald-500" />,
	default: <Info className="w-6 h-6 text-primary" />,
};

const iconBg = {
	danger:  'bg-destructive/10',
	success: 'bg-emerald-50',
	default: 'bg-primary/10',
};

export function ConfirmModal({
	open,
	title,
	description,
	confirmLabel = 'Tasdiqlash',
	cancelLabel = 'Bekor qilish',
	variant = 'default',
	loading = false,
	onConfirm,
	onClose,
}: ConfirmModalProps) {
	useEffect(() => {
		if (open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => { document.body.style.overflow = ''; };
	}, [open]);

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/40 backdrop-blur-sm"
				onClick={onClose}
			/>

			{/* Modal */}
			<div className="relative bg-background rounded-2xl shadow-xl w-full max-w-sm p-6 flex flex-col gap-4">
				{/* Icon */}
				<div className={clsx('w-12 h-12 rounded-2xl flex items-center justify-center', iconBg[variant])}>
					{icons[variant]}
				</div>

				{/* Text */}
				<div className="space-y-1">
					<h2 className="text-base font-semibold">{title}</h2>
					{description && (
						<p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
					)}
				</div>

				{/* Actions */}
				<div className="flex gap-3 mt-1">
					<Button
						variant="secondary"
						fullWidth
						onClick={onClose}
						disabled={loading}
					>
						{cancelLabel}
					</Button>
					<Button
						variant={variant === 'danger' ? 'danger' : variant === 'success' ? 'success' : 'primary'}
						fullWidth
						loading={loading}
						onClick={onConfirm}
					>
						{confirmLabel}
					</Button>
				</div>
			</div>
		</div>
	);
}
