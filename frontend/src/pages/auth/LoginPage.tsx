import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HardHat, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/auth.service';
import { useAuthStore } from '@store/authStore';
import { Button, Input, PasswordInput } from '@ui';

const schema = z.object({
	email: z.string().email("To'g'ri email kiriting"),
	password: z.string().min(1, 'Parol kiritilishi shart'),
});
type FormData = z.infer<typeof schema>;

export function LoginPage() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login } = useAuthStore();

	const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const from = (location.state as any)?.from?.pathname || '/dashboard';

	const onSubmit = async (data: FormData) => {
		try {
			const res = await authService.login(data.email, data.password);
			const { user, accessToken, refreshToken } = res.data.data;
			login(user, accessToken, refreshToken);
			toast.success(`Xush kelibsiz, ${user.firstName}!`);
			navigate(from, { replace: true });
		} catch (err: any) {
			toast.error(err.response?.data?.message || 'Kirish xatosi');
		}
	};

	return (
		<div className='min-h-screen bg-surface-50 flex items-center justify-center p-4'>
			<div className='fixed inset-0 overflow-hidden pointer-events-none'>
				<div className='absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl' />
				<div className='absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-orange-100/50 rounded-full blur-3xl' />
			</div>

			<div className='relative w-full max-w-sm'>
				<div className='text-center mb-8'>
					<Link to='/' className='inline-flex flex-col items-center gap-2 group'>
						<div className='w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform'>
							<HardHat className='w-7 h-7 text-white' />
						</div>
						<span className='text-xl font-bold'>Build<span className='text-primary'>Hub</span></span>
					</Link>
					<h1 className='text-2xl font-bold mt-4 mb-1'>Xush kelibsiz!</h1>
					<p className='text-muted-foreground text-sm'>Hisobingizga kiring</p>
				</div>

				<div className='bg-white rounded-3xl border border-border shadow-card p-6 md:p-8'>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
						<Input
							label='Email'
							type='email'
							placeholder='email@example.com'
							autoComplete='email'
							error={errors.email?.message}
							{...register('email')}
						/>

						<div>
							<div className='flex items-center justify-between mb-1.5'>
								<span className='text-sm font-medium'>Parol</span>
								<Link to='/auth/forgot-password' className='text-xs text-primary hover:underline font-medium'>
									Unutdingizmi?
								</Link>
							</div>
							<PasswordInput
								placeholder='••••••••'
								autoComplete='current-password'
								error={errors.password?.message}
								{...register('password')}
							/>
						</div>

						<Button type='submit' loading={isSubmitting} fullWidth size='lg' rightIcon={<ArrowRight className='w-4 h-4' />}>
							Kirish
						</Button>
					</form>

					<div className='mt-6 pt-5 border-t border-border text-center'>
						<p className='text-sm text-muted-foreground'>
							Hisobingiz yo'qmi?{' '}
							<Link to='/auth/register' className='text-primary font-semibold hover:underline'>
								Ro'yxatdan o'tish
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
