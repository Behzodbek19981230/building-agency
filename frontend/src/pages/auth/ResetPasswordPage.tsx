import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { HardHat, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/auth.service';

const schema = z.object({
  password: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, { message: 'Parollar mos emas', path: ['confirm'] });

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token') || '';

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    try {
      await authService.resetPassword(token, data.password);
      toast.success('Parol muvaffaqiyatli yangilandi');
      navigate('/auth/login');
    } catch {
      toast.error('Havola noto\'g\'ri yoki muddati o\'tgan');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <HardHat className="w-8 h-8" /> BuildHub
          </Link>
          <h1 className="text-2xl font-bold mt-2">Yangi parol o'rnatish</h1>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Yangi parol</label>
              <input {...register('password')} type="password" className="input w-full" placeholder="••••••••" />
              {errors.password && <p className="text-destructive text-xs mt-1">Kamida 8 belgi, 1 katta harf, 1 raqam</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Parolni tasdiqlang</label>
              <input {...register('confirm')} type="password" className="input w-full" placeholder="••••••••" />
              {errors.confirm && <p className="text-destructive text-xs mt-1">{errors.confirm.message as string}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-2.5">
              {isSubmitting ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Saqlanmoqda...</span> : 'Saqlash'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
