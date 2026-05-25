import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HardHat, ArrowRight, User, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/auth.service';
import { clsx } from 'clsx';
import { Button, Input, PasswordInput, PhoneInput } from '@ui';

const schema = z.object({
	firstName: z.string().min(2, 'Ism kamida 2 harf'),
	lastName: z.string().min(2, 'Familiya kamida 2 harf'),
	email: z.string().email("To'g'ri email kiriting"),
	phone: z.string().optional(),
	password: z
		.string()
		.min(8, 'Parol kamida 8 ta belgi')
		.regex(/[A-Z]/, 'Kamida bitta katta harf')
		.regex(/[0-9]/, 'Kamida bitta raqam'),
	role: z.enum(['CLIENT', 'WORKER']),
});
type FormData = z.infer<typeof schema>;

export function RegisterPage() {
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const defaultRole = (searchParams.get('role') as 'CLIENT' | 'WORKER') || 'CLIENT';

	const { register, handleSubmit, watch, setValue, control, formState: { errors, isSubmitting } } =
		useForm<FormData>({ resolver: zodResolver(schema), defaultValues: { role: defaultRole, phone: '+998' } });

	const selectedRole = watch('role');

	const onSubmit = async (data: FormData) => {
		try {
			await authService.register(data);
			toast.success("Ro'yxatdan o'tdingiz! Emailingizni tasdiqlang.");
			navigate('/auth/login');
		} catch (err: any) {
			toast.error(err.response?.data?.message || "Ro'yxatdan o'tish xatosi");
		}
	};

	return (
		<div className='min-h-screen bg-surface-50 flex items-center justify-center p-4'>
			<div className='fixed inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl' />
				<div className='absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-3xl' />
			</div>

			<div className='relative w-full max-w-sm'>
				<div className='text-center mb-6'>
					<Link to='/' className='inline-flex flex-col items-center gap-2 group'>
						<div className='w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform'>
							<HardHat className='w-7 h-7 text-white' />
						</div>
						<span className='text-xl font-bold'>Build<span className='text-primary'>Hub</span></span>
					</Link>
					<h1 className='text-2xl font-bold mt-4 mb-1'>Ro'yxatdan o'tish</h1>
					<p className='text-muted-foreground text-sm'>Hisob yarating va boshlang</p>
				</div>

				<div className='bg-white rounded-3xl border border-border shadow-card p-6 md:p-8'>
					{/* Role selector */}
					<div className='grid grid-cols-2 gap-2.5 mb-5'>
						{([
							['CLIENT', 'Mijoz sifatida', User, 'Ish topshiraman'],
							['WORKER', 'Usta sifatida', HardHat, 'Ish topaman'],
						] as const).map(([role, label, Icon, sub]) => (
							<button
								key={role}
								type='button'
								onClick={() => setValue('role', role)}
								className={clsx(
									'flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all relative',
									selectedRole === role
										? 'border-primary bg-primary/5'
										: 'border-border hover:border-primary/30 hover:bg-surface-50',
								)}
							>
								<div className={clsx(
									'w-9 h-9 rounded-xl flex items-center justify-center transition-all',
									selectedRole === role ? 'bg-primary text-white' : 'bg-muted text-muted-foreground',
								)}>
									<Icon className='w-4 h-4' />
								</div>
								<span className={clsx('text-xs font-bold', selectedRole === role ? 'text-primary' : 'text-foreground')}>
									{label}
								</span>
								<span className='text-[10px] text-muted-foreground'>{sub}</span>
								{selectedRole === role && (
									<CheckCircle2 className='w-3.5 h-3.5 text-primary absolute top-2 right-2' />
								)}
							</button>
						))}
					</div>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-3.5'>
						<div className='grid grid-cols-2 gap-3'>
							<Input
								label='Ism'
								placeholder='Behzod'
								autoComplete='given-name'
								error={errors.firstName?.message}
								{...register('firstName')}
							/>
							<Input
								label='Familiya'
								placeholder='Rasulov'
								autoComplete='family-name'
								error={errors.lastName?.message}
								{...register('lastName')}
							/>
						</div>

						<Input
							label='Email'
							type='email'
							placeholder='email@example.com'
							autoComplete='email'
							error={errors.email?.message}
							{...register('email')}
						/>

						<Controller
							name='phone'
							control={control}
							render={({ field }) => (
								<PhoneInput
									label='Telefon (ixtiyoriy)'
									value={field.value}
									onChange={field.onChange}
									onBlur={field.onBlur}
									error={errors.phone?.message}
								/>
							)}
						/>

						<PasswordInput
							label='Parol'
							placeholder='Kamida 8 ta belgi'
							autoComplete='new-password'
							error={errors.password?.message}
							hint="Katta harf va raqam bo'lishi shart"
							{...register('password')}
						/>

						<Button
							type='submit'
							loading={isSubmitting}
							fullWidth
							size='lg'
							rightIcon={<ArrowRight className='w-4 h-4' />}
						>
							Ro'yxatdan o'tish
						</Button>
					</form>

					<div className='mt-5 pt-4 border-t border-border text-center'>
						<p className='text-sm text-muted-foreground'>
							Allaqachon hisobingiz bormi?{' '}
							<Link to='/auth/login' className='text-primary font-semibold hover:underline'>
								Kirish
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
