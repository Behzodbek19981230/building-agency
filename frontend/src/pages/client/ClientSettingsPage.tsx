import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '@store/authStore';
import { authService } from '@services/auth.service';
import { AvatarUpload } from '@components/shared/AvatarUpload';
import { Save, Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

export function ClientSettingsPage() {
  const { user, updateUser } = useAuthStore();

  const [form, setForm] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    phone: user?.phone ?? '',
  });

  const [passwords, setPasswords] = useState({
    current: '',
    next: '',
    confirm: '',
  });
  const [pwError, setPwError] = useState('');

  const profileMutation = useMutation({
    mutationFn: () => authService.updateProfile({
      firstName: form.firstName.trim() || undefined,
      lastName: form.lastName.trim() || undefined,
      phone: form.phone.trim() || undefined,
    }),
    onSuccess: (res) => {
      updateUser(res.data?.data ?? {});
      toast.success('Profil yangilandi');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
  });

  const passwordMutation = useMutation({
    mutationFn: () => authService.changePassword(passwords.current, passwords.next),
    onSuccess: () => {
      toast.success('Parol o\'zgartirildi');
      setPasswords({ current: '', next: '', confirm: '' });
      setPwError('');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
  });

  const handlePasswordSubmit = () => {
    if (passwords.next !== passwords.confirm) {
      setPwError('Yangi parollar mos emas');
      return;
    }
    if (passwords.next.length < 6) {
      setPwError('Parol kamida 6 ta belgidan iborat bo\'lsin');
      return;
    }
    setPwError('');
    passwordMutation.mutate();
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h1 className="text-xl md:text-2xl font-bold">Sozlamalar</h1>

      {/* Avatar */}
      <div className="card p-5 flex flex-col items-center gap-3">
        <AvatarUpload size="lg" />
        <p className="text-sm text-muted-foreground text-center">
          Profilingizga rasm qo'shing
        </p>
      </div>

      {/* Profile info */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold">Shaxsiy ma'lumotlar</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Ism</label>
            <input
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.firstName}
              onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
              placeholder="Ism"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">Familiya</label>
            <input
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={form.lastName}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              placeholder="Familiya"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Telefon</label>
          <input
            className="w-full px-3 py-2 rounded-xl border border-border bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+998901234567"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-muted-foreground font-medium">Email</label>
          <input
            className="w-full px-3 py-2 rounded-xl border border-border bg-surface-50 text-sm text-muted-foreground cursor-not-allowed"
            value={user?.email ?? ''}
            disabled
          />
        </div>

        <button
          onClick={() => profileMutation.mutate()}
          disabled={profileMutation.isPending}
          className="btn-primary w-full gap-2 flex items-center justify-center"
        >
          {profileMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Saqlash
        </button>
      </div>

      {/* Change password */}
      <div className="card p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" /> Parolni o'zgartirish
        </h2>

        {['current', 'next', 'confirm'].map((k) => (
          <div key={k} className="space-y-1">
            <label className="text-xs text-muted-foreground font-medium">
              {k === 'current' ? 'Joriy parol' : k === 'next' ? 'Yangi parol' : 'Yangi parolni takrorlang'}
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded-xl border border-border bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={passwords[k as keyof typeof passwords]}
              onChange={(e) => setPasswords((p) => ({ ...p, [k]: e.target.value }))}
            />
          </div>
        ))}

        {pwError && <p className="text-sm text-destructive">{pwError}</p>}

        <button
          onClick={handlePasswordSubmit}
          disabled={passwordMutation.isPending}
          className="btn-outline w-full gap-2 flex items-center justify-center"
        >
          {passwordMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          Parolni o'zgartirish
        </button>
      </div>
    </div>
  );
}
