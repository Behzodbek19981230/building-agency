import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { workersService } from '@services/workers.service';
import { Star, CheckCircle, DollarSign, FileText, TrendingUp, Loader2, ToggleLeft, ToggleRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function WorkerDashboard() {
  const { user } = useAuthStore();
  const [statusLoading, setStatusLoading] = useState(false);

  const { data: statsData, isLoading } = useQuery({
    queryKey: ['worker-stats'],
    queryFn: () => workersService.getStats(),
  });

  const { data: profileData, refetch } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: () => workersService.getMyProfile(),
  });

  const stats = statsData?.data?.data;
  const profile = profileData?.data?.data;

  const toggleStatus = async () => {
    if (!profile) return;
    const newStatus = profile.status === 'AVAILABLE' ? 'OFFLINE' : 'AVAILABLE';
    setStatusLoading(true);
    try {
      await workersService.updateStatus(newStatus);
      refetch();
      toast.success(`Status: ${newStatus === 'AVAILABLE' ? 'Mavjud' : 'Offline'}`);
    } catch {
      toast.error('Xatolik');
    } finally {
      setStatusLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Salom, {user?.firstName}! 👷</h1>
          <p className="text-muted-foreground mt-1">Ustaning boshqaruv paneli</p>
        </div>

        <button
          onClick={toggleStatus}
          disabled={statusLoading}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors',
            profile?.status === 'AVAILABLE'
              ? 'bg-green-100 text-green-700 hover:bg-green-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200',
          )}
        >
          {profile?.status === 'AVAILABLE'
            ? <><ToggleRight className="w-5 h-5" /> Mavjud</>
            : <><ToggleLeft className="w-5 h-5" /> Offline</>}
        </button>
      </div>

      {/* Verification banner */}
      {profile && !profile.isVerified && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <span className="text-2xl">⏳</span>
          <div>
            <div className="font-medium text-amber-800">Profilingiz tekshirilmoqda</div>
            <div className="text-sm text-amber-600">Admin tasdiqlashini kuting. Bu jarayon 1-2 ish kuni davom etadi.</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Reyting', value: stats?.rating?.toFixed(1) || '0.0', icon: Star, color: 'text-amber-600 bg-amber-50', suffix: '★' },
            { label: 'Bajarilgan', value: stats?.completedProjects || 0, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
            { label: 'Faol takliflar', value: stats?.pendingBids || 0, icon: FileText, color: 'text-blue-600 bg-blue-50' },
            { label: 'Daromad (so\'m)', value: Number(stats?.totalEarnings || 0).toLocaleString(), icon: DollarSign, color: 'text-primary bg-primary/10' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-5">
                <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center mb-3', s.color)}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-2xl font-bold">{s.value}{s.suffix}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-semibold mb-4">Tezkor harakatlar</h3>
          <div className="space-y-3">
            <Link to="/projects" className="btn-primary w-full justify-center">Loyihalarni ko'rish</Link>
            <Link to="/worker/bids" className="btn-outline w-full justify-center">Takliflarimni ko'rish</Link>
            <Link to="/worker/portfolio" className="btn-outline w-full justify-center">Portfolio qo'shish</Link>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" /> Profil holati
          </h3>
          {profile ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tekshiruv</span>
                <span className={profile.isVerified ? 'text-green-600 font-medium' : 'text-amber-600'}>
                  {profile.isVerified ? '✓ Tasdiqlangan' : '⏳ Kutilmoqda'}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kategoriya</span>
                <span className="font-medium">{profile.category}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tajriba</span>
                <span className="font-medium">{profile.experience} yil</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sharhlar</span>
                <span className="font-medium">{profile.reviewCount} ta</span>
              </div>
              <Link to="/worker/profile" className="btn-outline w-full justify-center text-sm mt-2">
                Profilni tahrirlash
              </Link>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground text-sm mb-3">Profil yaratilmagan</p>
              <Link to="/worker/profile" className="btn-primary text-sm">Profil yaratish</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
