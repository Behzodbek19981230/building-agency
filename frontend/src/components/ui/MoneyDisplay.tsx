/**
 * Formats a number as UZS (Uzbek So'm) currency.
 * Example: 1234567 → "1 234 567 so'm"
 */
export function formatMoney(
	amount: number | string | undefined | null,
	options?: { currency?: boolean; compact?: boolean },
): string {
	const { currency = true, compact = false } = options ?? {};
	const num = Number(amount ?? 0);
	if (isNaN(num)) return currency ? "0 so'm" : '0';

	if (compact && num >= 1_000_000) {
		const mln = num / 1_000_000;
		const formatted = mln % 1 === 0 ? mln.toFixed(0) : mln.toFixed(1);
		return currency ? `${formatted} mln so'm` : `${formatted} mln`;
	}
	if (compact && num >= 1_000) {
		const k = num / 1_000;
		const formatted = k % 1 === 0 ? k.toFixed(0) : k.toFixed(1);
		return currency ? `${formatted} ming so'm` : `${formatted} ming`;
	}

	const parts = Math.abs(num).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	const sign = num < 0 ? '−' : '';
	return currency ? `${sign}${parts} so'm` : `${sign}${parts}`;
}

/* ─── MoneyDisplay component ─────────────────────────── */
interface MoneyDisplayProps {
	amount?: number | string | null;
	className?: string;
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	compact?: boolean;
	showCurrency?: boolean;
	colorize?: boolean;
}

const sizeMap = {
	xs: 'text-xs',
	sm: 'text-sm',
	md: 'text-base',
	lg: 'text-lg font-semibold',
	xl: 'text-xl font-bold',
};

export function MoneyDisplay({
	amount,
	className,
	size = 'md',
	compact = false,
	showCurrency = true,
	colorize = false,
}: MoneyDisplayProps) {
	const num = Number(amount ?? 0);
	const parts = Math.abs(num).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	const sign = num < 0 ? '−' : '';

	return (
		<span
			className={[
				sizeMap[size],
				colorize && num > 0 ? 'text-emerald-600' : '',
				colorize && num < 0 ? 'text-destructive' : '',
				className ?? '',
			]
				.filter(Boolean)
				.join(' ')}
		>
			{compact ? formatMoney(amount, { currency: showCurrency, compact: true }) : (
				<>
					{sign}
					{parts}
					{showCurrency && (
						<span className='font-normal text-[0.85em] ml-1 opacity-70'>so'm</span>
					)}
				</>
			)}
		</span>
	);
}
