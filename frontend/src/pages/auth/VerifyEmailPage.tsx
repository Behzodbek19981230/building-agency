import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { HardHat, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { authService } from '@services/auth.service';

export function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!token) { setStatus('error'); return; }
    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="card p-10 text-center max-w-md w-full">
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-bold text-primary mb-6">
          <HardHat className="w-6 h-6" /> BuildHub
        </Link>
        {status === 'loading' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Email tasdiqlanmoqda...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Email tasdiqlandi!</h2>
            <p className="text-muted-foreground mb-6">Hisobingiz faollashtirildi. Endi kirishingiz mumkin.</p>
            <Link to="/auth/login" className="btn-primary inline-flex">Kirish</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <XCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Xatolik!</h2>
            <p className="text-muted-foreground mb-6">Havola noto'g'ri yoki muddati o'tgan.</p>
            <Link to="/auth/login" className="btn-outline inline-flex">Kirish sahifasiga</Link>
          </>
        )}
      </div>
    </div>
  );
}
