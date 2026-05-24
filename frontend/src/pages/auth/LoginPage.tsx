import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { HardHat, Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/auth.service';
import { useAuthStore } from '@store/authStore';

const schema = z.object({
  email: z.string().email('To\'g\'ri email kiriting'),
  password: z.string().min(1, 'Parol kiritilishi shart'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [showPass, setShowPass] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary mb-2">
            <HardHat className="w-8 h-8" />
            BuildHub
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Xush kelibsiz!</h1>
          <p className="text-muted-foreground mt-1">Hisobingizga kirish</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="email@example.com"
                className="input w-full"
                autoComplete="email"
              />
              {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Parol</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input w-full pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/auth/forgot-password" className="text-sm text-primary hover:underline">
                Parolni unutdingizmi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5 text-base"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Kirish...
                </span>
              ) : 'Kirish'}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Hisobingiz yo'qmi?{' '}
            <Link to="/auth/register" className="text-primary font-medium hover:underline">
              Ro'yxatdan o'tish
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
