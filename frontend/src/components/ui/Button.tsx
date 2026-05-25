import { forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const variantStyles: Record<Variant, string> = {
	primary:
		'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md active:scale-[0.97] focus-visible:ring-primary/50',
	secondary:
		'bg-secondary text-secondary-foreground hover:bg-secondary/70 active:scale-[0.97]',
	outline:
		'border-2 border-primary/70 text-primary bg-transparent hover:bg-primary hover:text-white hover:border-primary active:scale-[0.97]',
	ghost:
		'text-muted-foreground hover:text-foreground hover:bg-muted active:scale-[0.97]',
	danger:
		'bg-destructive text-white hover:bg-destructive/90 shadow-sm hover:shadow-md active:scale-[0.97] focus-visible:ring-destructive/50',
	success:
		'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm hover:shadow-md active:scale-[0.97] focus-visible:ring-emerald-500/50',
};

const sizeStyles: Record<Size, string> = {
	xs: 'h-7  px-2.5 text-xs  rounded-lg  gap-1',
	sm: 'h-8  px-3.5 text-xs  rounded-xl  gap-1.5',
	md: 'h-10 px-5   text-sm  rounded-xl  gap-2',
	lg: 'h-11 px-6   text-sm  rounded-xl  gap-2',
	xl: 'h-12 px-7   text-base rounded-2xl gap-2.5',
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	size?: Size;
	loading?: boolean;
	fullWidth?: boolean;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			variant = 'primary',
			size = 'md',
			loading = false,
			fullWidth = false,
			leftIcon,
			rightIcon,
			children,
			disabled,
			className,
			...props
		},
		ref,
	) => {
		return (
			<button
				ref={ref}
				disabled={disabled || loading}
				className={clsx(
					'inline-flex items-center justify-center font-semibold transition-all duration-150 select-none',
					'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
					'disabled:pointer-events-none disabled:opacity-50',
					variantStyles[variant],
					sizeStyles[size],
					fullWidth && 'w-full',
					className,
				)}
				{...props}
			>
				{loading ? (
					<Loader2 className='w-4 h-4 animate-spin' />
				) : (
					leftIcon && <span className='shrink-0'>{leftIcon}</span>
				)}
				{children && <span>{children}</span>}
				{!loading && rightIcon && <span className='shrink-0'>{rightIcon}</span>}
			</button>
		);
	},
);
Button.displayName = 'Button';
