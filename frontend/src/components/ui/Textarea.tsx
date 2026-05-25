import { forwardRef, TextareaHTMLAttributes, useId } from 'react';
import { AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	hint?: string;
	wrapperClassName?: string;
	showCount?: boolean;
	maxLength?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ label, error, hint, wrapperClassName, className, showCount, maxLength, id, value, ...props }, ref) => {
		const autoId = useId();
		const inputId = id ?? autoId;
		const charCount = typeof value === 'string' ? value.length : 0;

		return (
			<div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
				{label && (
					<div className='flex items-center justify-between'>
						<label htmlFor={inputId} className='text-sm font-medium text-foreground'>
							{label}
						</label>
						{showCount && maxLength && (
							<span className={clsx('text-xs', charCount > maxLength * 0.9 ? 'text-amber-500' : 'text-muted-foreground')}>
								{charCount}/{maxLength}
							</span>
						)}
					</div>
				)}
				<div className='relative'>
					<textarea
						ref={ref}
						id={inputId}
						maxLength={maxLength}
						value={value}
						className={clsx(
							'flex w-full min-h-[100px] rounded-xl border bg-background px-4 py-3 text-sm',
							'placeholder:text-muted-foreground/60',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
							'disabled:cursor-not-allowed disabled:opacity-50',
							'resize-y transition-all duration-150',
							error ? 'border-destructive focus-visible:ring-destructive/30' : 'border-input',
							className,
						)}
						{...props}
					/>
					{error && (
						<AlertCircle className='absolute right-3 top-3 w-4 h-4 text-destructive pointer-events-none' />
					)}
				</div>
				{error && <p className='text-xs text-destructive'>{error}</p>}
				{hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}
			</div>
		);
	},
);
Textarea.displayName = 'Textarea';
