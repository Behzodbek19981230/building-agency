import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HardHat, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '@services/auth.service';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Reset havolasi yuborildi');
    } catch {
      toast.error('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold text-primary">
            <HardHat className="w-8 h-8" /> BuildHub
          </Link>
          <h1 className="text-2xl font-bold mt-2">Parolni tiklash</h1>
        </div>
        <div className="card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✉️</span>
              </div>
              <h2 className="font-bold text-lg mb-2">Email yuborildi!</h2>
              <p className="text-muted-foreground text-sm mb-6">Emailingizni tekshiring va havolaga bosing.</p>
              <Link to="/auth/login" className="btn-primary w-full text-center py-2.5">Kirish sahifasiga</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Email manzilingiz</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  required className="input w-full" placeholder="email@example.com"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
                {loading ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Yuborilmoqda...</span> : 'Havolani yuborish'}
              </button>
              <Link to="/auth/login" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground justify-center">
                <ArrowLeft className="w-4 h-4" /> Orqaga
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
