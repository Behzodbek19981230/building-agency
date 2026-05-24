import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { workersService } from '@services/workers.service';
import { Star, MapPin, CheckCircle, Briefcase, Award, Loader2, ArrowLeft, MessageSquare } from 'lucide-react';
import { useAuthStore } from '@store/authStore';

export function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => workersService.getOne(id!),
  });

  const worker = data?.data?.data;

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  if (!worker) return <div className="text-center py-20 text-muted-foreground">Usta topilmadi</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/workers" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" /> Ustalarga qaytish
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile header */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={worker.user?.avatar || `https://ui-avatars.com/api/?name=${worker.user?.firstName}&size=80&background=3b82f6&color=fff`}
                  alt="" className="w-20 h-20 rounded-2xl object-cover"
                />
                {worker.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold">{worker.user?.firstName} {worker.user?.lastName}</h1>
                <p className="text-muted-foreground">{worker.category}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(worker.rating) ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                    ))}
                    <span className="text-sm ml-1">{worker.rating?.toFixed(1)} ({worker.reviewCount} sharh)</span>
                  </div>
                  {worker.city && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" /> {worker.city}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {worker.bio && <p className="mt-4 text-muted-foreground leading-relaxed">{worker.bio}</p>}

            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t">
              {[
                { icon: Briefcase, label: 'Bajarilgan', value: worker.completedProjects },
                { icon: Award, label: 'Tajriba', value: `${worker.experience} yil` },
                { icon: Star, label: 'Reyting', value: worker.rating?.toFixed(1) },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="text-center">
                    <Icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="font-bold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          {worker.skills?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold mb-3">Ko'nikmalar</h2>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((s: any) => (
                  <span key={s.id} className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full">{s.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Portfolio */}
          {worker.portfolio?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold mb-4">Portfolio</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {worker.portfolio.map((p: any) => (
                  <div key={p.id} className="rounded-xl overflow-hidden border">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-32 object-cover" />
                    ) : (
                      <div className="w-full h-32 bg-muted flex items-center justify-center text-3xl">🏗️</div>
                    )}
                    <div className="p-2">
                      <div className="text-sm font-medium truncate">{p.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5 space-y-3">
            {worker.hourlyRate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Soatlik narx</span>
                <span className="font-semibold">{Number(worker.hourlyRate).toLocaleString()} so'm</span>
              </div>
            )}
            {worker.dailyRate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kunlik narx</span>
                <span className="font-semibold">{Number(worker.dailyRate).toLocaleString()} so'm</span>
              </div>
            )}
            {worker.minProjectBudget && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Min. loyiha</span>
                <span className="font-semibold">{Number(worker.minProjectBudget).toLocaleString()} so'm</span>
              </div>
            )}

            {user && user.role === 'CLIENT' && (
              <div className="pt-3 border-t space-y-2">
                <Link to="/client/projects/create" className="btn-primary w-full text-center py-2.5">
                  Loyiha yaratish
                </Link>
                <button className="btn-outline w-full gap-2 py-2">
                  <MessageSquare className="w-4 h-4" /> Xabar yuborish
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
