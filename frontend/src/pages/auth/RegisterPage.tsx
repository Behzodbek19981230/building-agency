import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HardHat, Eye, EyeOff, Loader2, User, HardHat as WorkerIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/auth.service';
import { clsx } from 'clsx';

const schema = z.object({
  firstName: z.string().min(2, 'Ism kamida 2 harf'),
  lastName: z.string().min(2, 'Familiya kamida 2 harf'),
  email: z.string().email('To\'g\'ri email kiriting'),
  phone: z.string().optional(),
  password: z.string()
    .min(8, 'Parol kamida 8 ta belgi')
    .regex(/[A-Z]/, 'Kamida bitta katta harf')
    .regex(/[0-9]/, 'Kamida bitta raqam'),
  role: z.enum(['CLIENT', 'WORKER']),
});

type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPass, setShowPass] = useState(false);
  const defaultRole = (searchParams.get('role') as 'CLIENT' | 'WORKER') || 'CLIENT';

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: FormData) => {
    try {
      await authService.register(data);
      toast.success('Ro\'yxatdan o\'tdingiz! Emailingizni tasdiqlang.');
      navigate('/auth/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Ro\'yxatdan o\'tish xatosi');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <HardHat className="w-8 h-8" />
            BuildHub
          </Link>
          <h1 className="text-2xl font-bold mt-2">Ro'yxatdan o'tish</h1>
          <p className="text-muted-foreground mt-1">Hesob yarating va boshlang</p>
        </div>

        <div className="card p-8">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {([['CLIENT', 'Mijoz', User], ['WORKER', 'Usta', WorkerIcon]] as const).map(([role, label, Icon]) => (
              <button
                key={role}
                type="button"
                onClick={() => setValue('role', role)}
                className={clsx(
                  'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                  selectedRole === role
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/30',
                )}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1.5">Ism</label>
                <input {...register('firstName')} className="input w-full" placeholder="Behzod" />
                {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Familiya</label>
                <input {...register('lastName')} className="input w-full" placeholder="Rasulov" />
                {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input {...register('email')} type="email" className="input w-full" placeholder="email@example.com" />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Telefon (ixtiyoriy)</label>
              <input {...register('phone')} type="tel" className="input w-full" placeholder="+998 90 123 45 67" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Parol</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  className="input w-full pr-10"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5 text-base mt-2">
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Ro'yxatdan o'tilmoqda...
                </span>
              ) : 'Ro\'yxatdan o\'tish'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Allaqachon hisobingiz bormi?{' '}
            <Link to="/auth/login" className="text-primary font-medium hover:underline">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
