import ReactSelect, {
	Props as ReactSelectProps,
	GroupBase,
	StylesConfig,
	components,
	DropdownIndicatorProps,
	ClearIndicatorProps,
} from 'react-select';
import { ChevronDown, X } from 'lucide-react';
import { useId } from 'react';
import { clsx } from 'clsx';

export interface SelectOption {
	value: string | number;
	label: string;
	description?: string;
	icon?: React.ReactNode;
	disabled?: boolean;
}

/* ─── Custom dropdown indicator ─────────────────────── */
function DropdownIndicator<O extends SelectOption>(
	props: DropdownIndicatorProps<O, boolean, GroupBase<O>>,
) {
	return (
		<components.DropdownIndicator {...props}>
			<ChevronDown
				className={clsx(
					'w-4 h-4 text-muted-foreground transition-transform duration-200',
					props.selectProps.menuIsOpen && 'rotate-180',
				)}
			/>
		</components.DropdownIndicator>
	);
}

function ClearIndicator<O extends SelectOption>(
	props: ClearIndicatorProps<O, boolean, GroupBase<O>>,
) {
	return (
		<components.ClearIndicator {...props}>
			<X className='w-3.5 h-3.5 text-muted-foreground hover:text-foreground transition-colors' />
		</components.ClearIndicator>
	);
}

/* ─── Shared react-select styles ────────────────────── */
function buildStyles<O extends SelectOption>(
	hasError: boolean,
): StylesConfig<O, boolean, GroupBase<O>> {
	return {
		control: (base, state) => ({
			...base,
			height: '36px',
			minHeight: '36px',
			borderRadius: '10px',
			borderColor: hasError
				? 'hsl(var(--destructive))'
				: state.isFocused
					? 'hsl(var(--ring))'
					: 'hsl(var(--input))',
			boxShadow: state.isFocused
				? `0 0 0 2px hsl(var(--ring) / 0.3)`
				: 'none',
			backgroundColor: 'hsl(var(--background))',
			'&:hover': {
				borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--muted-foreground) / 0.4)',
			},
			transition: 'all 150ms',
			cursor: 'pointer',
		}),
		valueContainer: (base) => ({
			...base,
			padding: '0 12px',
			fontSize: '13px',
		}),
		placeholder: (base) => ({
			...base,
			color: 'hsl(var(--muted-foreground) / 0.6)',
			fontSize: '13px',
		}),
		singleValue: (base) => ({
			...base,
			color: 'hsl(var(--foreground))',
			fontSize: '13px',
			fontWeight: '500',
		}),
		multiValue: (base) => ({
			...base,
			backgroundColor: 'hsl(var(--primary) / 0.1)',
			borderRadius: '8px',
		}),
		multiValueLabel: (base) => ({
			...base,
			color: 'hsl(var(--primary))',
			fontSize: '13px',
			fontWeight: '600',
			padding: '2px 6px',
		}),
		multiValueRemove: (base) => ({
			...base,
			color: 'hsl(var(--primary))',
			borderRadius: '0 8px 8px 0',
			'&:hover': {
				backgroundColor: 'hsl(var(--primary) / 0.2)',
				color: 'hsl(var(--primary))',
			},
		}),
		indicatorSeparator: () => ({ display: 'none' }),
		indicatorsContainer: (base) => ({
			...base,
			paddingRight: '8px',
			gap: '2px',
		}),
		menu: (base) => ({
			...base,
			borderRadius: '12px',
			border: '1px solid hsl(var(--border))',
			boxShadow: '0 10px 40px -4px rgb(0 0 0 / 0.12), 0 0 0 1px rgb(0 0 0 / 0.04)',
			overflow: 'hidden',
			zIndex: 9999,
			marginTop: '6px',
			backgroundColor: 'hsl(var(--background))',
		}),
		menuList: (base) => ({
			...base,
			padding: '4px',
			maxHeight: '220px',
		}),
		option: (base, state) => ({
			...base,
			borderRadius: '8px',
			padding: '7px 10px',
			fontSize: '13px',
			fontWeight: state.isSelected ? '600' : '400',
			backgroundColor: state.isSelected
				? 'hsl(var(--primary) / 0.1)'
				: state.isFocused
					? 'hsl(var(--muted))'
					: 'transparent',
			color: state.isSelected
				? 'hsl(var(--primary))'
				: 'hsl(var(--foreground))',
			cursor: state.isDisabled ? 'not-allowed' : 'pointer',
			opacity: state.isDisabled ? 0.5 : 1,
			'&:active': {
				backgroundColor: 'hsl(var(--primary) / 0.15)',
			},
		}),
		noOptionsMessage: (base) => ({
			...base,
			fontSize: '13px',
			color: 'hsl(var(--muted-foreground))',
			padding: '8px',
		}),
		loadingMessage: (base) => ({
			...base,
			fontSize: '13px',
			color: 'hsl(var(--muted-foreground))',
		}),
		input: (base) => ({
			...base,
			color: 'hsl(var(--foreground))',
			fontSize: '13px',
		}),
	};
}

/* ─── Select Props ───────────────────────────────────── */
interface SelectProps<O extends SelectOption = SelectOption>
	extends Omit<
		ReactSelectProps<O, false, GroupBase<O>>,
		'onChange' | 'value' | 'options' | 'styles' | 'isDisabled' | 'isOptionDisabled'
	> {
	label?: string;
	error?: string;
	hint?: string;
	options: O[];
	value?: string | number | null;
	onChange?: (value: string | number | null, option: O | null) => void;
	disabled?: boolean;
	wrapperClassName?: string;
}

export function Select<O extends SelectOption = SelectOption>({
	label,
	error,
	hint,
	options,
	value,
	onChange,
	disabled,
	wrapperClassName,
	placeholder = 'Tanlang...',
	...rest
}: SelectProps<O>) {
	const autoId = useId();
	const selected = value != null ? options.find((o) => o.value === value) ?? null : null;

	return (
		<div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
			{label && (
				<label className='text-sm font-medium text-foreground'>
					{label}
				</label>
			)}
			<ReactSelect<O, false, GroupBase<O>>
				instanceId={autoId}
				options={options}
				value={selected}
				onChange={(opt) => onChange?.(opt?.value ?? null, opt ?? null)}
				isDisabled={disabled}
				isOptionDisabled={(opt) => !!opt.disabled}
				placeholder={placeholder}
				styles={buildStyles<O>(!!error)}
				components={{ DropdownIndicator, ClearIndicator } as any}
				noOptionsMessage={() => "Natija topilmadi"}
				loadingMessage={() => "Yuklanmoqda..."}
				menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
				menuPosition='fixed'
				{...rest}
			/>
			{error && <p className='text-xs text-destructive'>{error}</p>}
			{hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}
		</div>
	);
}

/* ─── Multi Select ───────────────────────────────────── */
interface MultiSelectProps<O extends SelectOption = SelectOption>
	extends Omit<
		ReactSelectProps<O, true, GroupBase<O>>,
		'onChange' | 'value' | 'options' | 'styles' | 'isMulti' | 'isDisabled'
	> {
	label?: string;
	error?: string;
	hint?: string;
	options: O[];
	value?: (string | number)[];
	onChange?: (values: (string | number)[], options: O[]) => void;
	disabled?: boolean;
	wrapperClassName?: string;
}

export function MultiSelect<O extends SelectOption = SelectOption>({
	label,
	error,
	hint,
	options,
	value = [],
	onChange,
	disabled,
	wrapperClassName,
	placeholder = "Tanlang...",
	...rest
}: MultiSelectProps<O>) {
	const autoId = useId();
	const selected = options.filter((o) => value.includes(o.value));

	return (
		<div className={clsx('flex flex-col gap-1.5', wrapperClassName)}>
			{label && (
				<label className='text-sm font-medium text-foreground'>
					{label}
				</label>
			)}
			<ReactSelect<O, true, GroupBase<O>>
				instanceId={autoId}
				isMulti
				options={options}
				value={selected}
				onChange={(opts) => {
					const arr = (opts as O[]) ?? [];
					onChange?.(arr.map((o) => o.value), arr);
				}}
				isDisabled={disabled}
				isOptionDisabled={(opt) => !!opt.disabled}
				placeholder={placeholder}
				styles={buildStyles<O>(!!error) as StylesConfig<O, true, GroupBase<O>>}
				components={{ DropdownIndicator, ClearIndicator } as any}
				noOptionsMessage={() => "Natija topilmadi"}
				menuPortalTarget={typeof window !== 'undefined' ? document.body : undefined}
				menuPosition='fixed'
				closeMenuOnSelect={false}
				{...rest}
			/>
			{error && <p className='text-xs text-destructive'>{error}</p>}
			{hint && !error && <p className='text-xs text-muted-foreground'>{hint}</p>}
		</div>
	);
}
