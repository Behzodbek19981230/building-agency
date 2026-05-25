import { forwardRef, InputHTMLAttributes, useState, useId } from 'react';
import { Eye, EyeOff, Search, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { IMaskInput } from 'react-imask';

/* ─── Base Input ─────────────────────────────────────── */
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	error?: string;
	hint?: string;
	leftIcon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	wrapperClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
	({ label, error, hint, leftIcon, rightIcon, wrapperClassName, className, id, ...props }, ref) => {
		const autoId = useId();
		const inputId = id ?? autoId;

		return (
			<div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
				{label && (
					<label htmlFor={inputId} className='text-sm font-medium text-foreground'>
						{label}
					</label>
				)}
				<div className='relative flex items-center'>
					{leftIcon && (
						<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'>
							{leftIcon}
						</span>
					)}
					<input
						ref={ref}
						id={inputId}
						className={clsx(
							'flex h-11 w-full rounded-xl border bg-background px-4 py-2.5 text-sm',
							'placeholder:text-muted-foreground/60',
							'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
							'disabled:cursor-not-allowed disabled:opacity-50',
							'transition-all duration-150',
							error
								? 'border-destructive focus-visible:ring-destructive/30'
								: 'border-input',
							leftIcon && 'pl-10',
							rightIcon && 'pr-10',
							className,
						)}
						{...props}
					/>
					{rightIcon && (
						<span className='absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none'>
							{rightIcon}
						</span>
					)}
					{error && !rightIcon && (
						<AlertCircle className='absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive pointer-events-none' />
					)}
				</div>
				{error && <p className='text-xs text-destructive flex items-center gap-1'>{error}</p>}
				{hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}
			</div>
		);
	},
);
Input.displayName = 'Input';

/* ─── Password Input ─────────────────────────────────── */
interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightIcon'> {}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
	(props, ref) => {
		const [show, setShow] = useState(false);
		return (
			<Input
				ref={ref}
				{...props}
				type={show ? 'text' : 'password'}
				rightIcon={
					<button
						type='button'
						onClick={() => setShow((s) => !s)}
						className='pointer-events-auto text-muted-foreground hover:text-foreground transition-colors'
						tabIndex={-1}
					>
						{show ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
					</button>
				}
			/>
		);
	},
);
PasswordInput.displayName = 'PasswordInput';

/* ─── Search Input ───────────────────────────────────── */
export const SearchInput = forwardRef<HTMLInputElement, InputProps>(
	(props, ref) => (
		<Input
			ref={ref}
			type='search'
			leftIcon={<Search className='w-4 h-4' />}
			{...props}
		/>
	),
);
SearchInput.displayName = 'SearchInput';

/* ─── Phone Input (+998 XX XXX XX XX) ───────────────── */
interface PhoneInputProps {
	label?: string;
	error?: string;
	hint?: string;
	value?: string;
	onChange?: (value: string) => void;
	onBlur?: () => void;
	disabled?: boolean;
	placeholder?: string;
	wrapperClassName?: string;
	id?: string;
}

export function PhoneInput({
	label,
	error,
	hint,
	value,
	onChange,
	onBlur,
	disabled,
	wrapperClassName,
	id,
}: PhoneInputProps) {
	const autoId = useId();
	const inputId = id ?? autoId;

	return (
		<div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
			{label && (
				<label htmlFor={inputId} className='text-sm font-medium text-foreground'>
					{label}
				</label>
			)}
			<div className='relative flex items-center'>
				<span className='absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground pointer-events-none select-none'>
					🇺🇿
				</span>
				<IMaskInput
					id={inputId}
					mask='+{998} (00) 000-00-00'
					value={value ?? '+998'}
					onAccept={(val: string) => onChange?.(val)}
					onBlur={onBlur}
					disabled={disabled}
					placeholder='+998 (90) 000-00-00'
					className={clsx(
						'flex h-11 w-full rounded-xl border bg-background pl-10 pr-4 py-2.5 text-sm font-medium tracking-wide',
						'placeholder:text-muted-foreground/60 placeholder:font-normal placeholder:tracking-normal',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
						'disabled:cursor-not-allowed disabled:opacity-50',
						'transition-all duration-150',
						error ? 'border-destructive focus-visible:ring-destructive/30' : 'border-input',
					)}
				/>
				{error && (
					<AlertCircle className='absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive pointer-events-none' />
				)}
			</div>
			{error && <p className='text-xs text-destructive'>{error}</p>}
			{hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}
		</div>
	);
}

/* ─── Money Input (UZS So'm) ─────────────────────────── */
interface MoneyInputProps {
	label?: string;
	error?: string;
	hint?: string;
	value?: string | number;
	onChange?: (raw: number, formatted: string) => void;
	onBlur?: () => void;
	disabled?: boolean;
	placeholder?: string;
	wrapperClassName?: string;
	id?: string;
	min?: number;
	max?: number;
}

export function MoneyInput({
	label,
	error,
	hint,
	value,
	onChange,
	onBlur,
	disabled,
	placeholder = '0',
	wrapperClassName,
	id,
	min,
	max,
}: MoneyInputProps) {
	const autoId = useId();
	const inputId = id ?? autoId;

	const numVal = value !== undefined && value !== '' ? String(value) : '';

	return (
		<div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
			{label && (
				<label htmlFor={inputId} className='text-sm font-medium text-foreground'>
					{label}
				</label>
			)}
			<div className='relative flex items-center'>
				<IMaskInput
					id={inputId}
					mask={Number}
					thousandsSeparator=' '
					radix='.'
					scale={0}
					min={min}
					max={max}
					value={numVal}
					onAccept={(_val: unknown, maskRef: { typedValue: number; value: string }) => {
						onChange?.(maskRef.typedValue ?? 0, maskRef.value);
					}}
					onBlur={onBlur}
					disabled={disabled}
					placeholder={placeholder}
					inputMode='numeric'
					className={clsx(
						'flex h-11 w-full rounded-xl border bg-background pl-4 pr-16 py-2.5 text-sm font-medium tracking-wide',
						'placeholder:text-muted-foreground/60 placeholder:font-normal',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
						'disabled:cursor-not-allowed disabled:opacity-50',
						'transition-all duration-150',
						error ? 'border-destructive focus-visible:ring-destructive/30' : 'border-input',
					)}
				/>
				<span className='absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground pointer-events-none bg-muted px-1.5 py-0.5 rounded-md'>
					so'm
				</span>
				{error && (
					<AlertCircle className='absolute right-14 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive pointer-events-none' />
				)}
			</div>
			{error && <p className='text-xs text-destructive'>{error}</p>}
			{hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}
		</div>
	);
}

/* ─── Number Input (xonalar, maydon, m²) ────────────── */
interface NumberInputProps {
	label?: string;
	error?: string;
	hint?: string;
	value?: string | number;
	onChange?: (raw: number) => void;
	onBlur?: () => void;
	disabled?: boolean;
	placeholder?: string;
	suffix?: string;
	min?: number;
	max?: number;
	scale?: number;
	wrapperClassName?: string;
	id?: string;
}

export function NumberInput({
	label,
	error,
	hint,
	value,
	onChange,
	onBlur,
	disabled,
	placeholder = '0',
	suffix,
	min,
	max,
	scale = 0,
	wrapperClassName,
	id,
}: NumberInputProps) {
	const autoId = useId();
	const inputId = id ?? autoId;

	const numVal = value !== undefined && value !== '' ? String(value) : '';

	return (
		<div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
			{label && (
				<label htmlFor={inputId} className='text-sm font-medium text-foreground'>
					{label}
				</label>
			)}
			<div className='relative flex items-center'>
				<IMaskInput
					id={inputId}
					mask={Number}
					scale={scale}
					min={min}
					max={max}
					value={numVal}
					onAccept={(_val: unknown, maskRef: { typedValue: number }) => {
						onChange?.(maskRef.typedValue ?? 0);
					}}
					onBlur={onBlur}
					disabled={disabled}
					placeholder={placeholder}
					inputMode='numeric'
					className={clsx(
						'flex h-11 w-full rounded-xl border bg-background py-2.5 text-sm font-medium',
						'placeholder:text-muted-foreground/60 placeholder:font-normal',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent',
						'disabled:cursor-not-allowed disabled:opacity-50',
						'transition-all duration-150',
						error ? 'border-destructive focus-visible:ring-destructive/30' : 'border-input',
						suffix ? 'pl-4 pr-12' : 'px-4',
					)}
				/>
				{suffix && (
					<span className='absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground pointer-events-none bg-muted px-1.5 py-0.5 rounded-md'>
						{suffix}
					</span>
				)}
			</div>
			{error && <p className='text-xs text-destructive'>{error}</p>}
			{hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}
		</div>
	);
}
