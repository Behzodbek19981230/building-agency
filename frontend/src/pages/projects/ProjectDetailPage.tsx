import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { projectsService } from '@services/projects.service';
import { useAuthStore } from '@store/authStore';
import { MapPin, Clock, DollarSign, Star, Loader2, ArrowLeft, HardHat } from 'lucide-react';
import { getImageUrl } from '@/utils/image';
import { StatusBadge } from '@components/ui';
import { clsx } from 'clsx';

const urgencyLabel: Record<string, string> = {
  LOW:    'Past',
  MEDIUM: "O'rta",
  HIGH:   'Yuqori',
  URGENT: 'Shoshilinch',
};

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsService.getOne(id!),
  });

  const project = data?.data?.data;
  const acceptedBid = project?.bids?.find((b: any) => b.status === 'ACCEPTED') ?? null;
  const assignedWorker = acceptedBid ? { ...acceptedBid.worker, profileId: acceptedBid.workerProfile.id } : null;

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!project) return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">Loyiha topilmadi</p>
      <Link to="/projects" className="btn-primary mt-4 inline-flex">Orqaga</Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/projects" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" /> Loyihalarga qaytish
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          {project.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
              {project.images.slice(0, 4).map((img: any, i: number) => (
                <img key={img.id} src={getImageUrl(img.url)} alt="" className={clsx('w-full object-cover', i === 0 ? 'col-span-2 h-64' : 'h-36')} />
              ))}
            </div>
          )}

          {/* Title & description */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold">{project.title}</h1>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-muted-foreground leading-relaxed">{project.description}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: MapPin, label: 'Manzil', value: project.city || 'Ko\'rsatilmagan' },
              { icon: Clock, label: 'Shoshilinchlik', value: urgencyLabel[project.urgency] ?? project.urgency },
              { icon: DollarSign, label: 'Byudjet', value: project.budgetMin ? `${(project.budgetMin/1000000).toFixed(1)}M - ${(project.budgetMax!/1000000).toFixed(1)}M so'm` : 'Ochiq' },
              { icon: Star, label: 'Takliflar', value: `${project._count?.bids || 0} ta` },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="card p-3 text-center">
                  <Icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <div className="text-xs text-muted-foreground">{m.label}</div>
                  <div className="text-sm font-medium mt-0.5">{m.value}</div>
                </div>
              );
            })}
          </div>

          {/* Bids */}
          {project.bids && project.bids.length > 0 && user?.role === 'CLIENT' && project.clientId === user.id && (
            <div className="card">
              <div className="p-4 border-b font-semibold">Takliflar ({project.bids.length})</div>
              <div className="divide-y">
                {project.bids.map((bid: any) => (
                  <div key={bid.id} className="p-4 flex items-center gap-4">
                    <img src={getImageUrl(bid.worker.avatar) || `https://ui-avatars.com/api/?name=${bid.worker.firstName}`} alt="" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="font-medium">{bid.worker.firstName} {bid.worker.lastName}</div>
                      <div className="text-sm text-muted-foreground">{bid.message.slice(0, 80)}...</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">{Number(bid.amount).toLocaleString()} so'm</div>
                      <div className="flex items-center gap-1 text-xs text-amber-500 justify-end">
                        <Star className="w-3 h-3 fill-current" /> {bid.workerProfile.rating}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Client card */}
          <div className="card p-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3">Mijoz</p>
            <div className="flex items-center gap-3">
              <img
                src={getImageUrl(project.client.avatar) || `https://ui-avatars.com/api/?name=${project.client.firstName}`}
                alt="" className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold">{project.client.firstName} {project.client.lastName}</div>
              </div>
            </div>

            {user?.role === 'WORKER' && project.status === 'OPEN' && (
              <Link to={`/projects/${project.id}#bid`} className="btn-primary w-full text-center py-2.5 mt-4">
                Taklif berish
              </Link>
            )}
          </div>

          {/* Assigned worker card */}
          {assignedWorker && (
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <HardHat className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Qabul qilgan usta</p>
              </div>
              <Link to={`/workers/${assignedWorker.profileId}`} className="flex items-center gap-3 group">
                <img
                  src={getImageUrl(assignedWorker.avatar) || `https://ui-avatars.com/api/?name=${assignedWorker.firstName}&background=3b82f6&color=fff`}
                  alt="" className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold group-hover:text-primary transition-colors">
                    {assignedWorker.firstName} {assignedWorker.lastName}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium mt-0.5">Ishda</div>
                </div>
              </Link>
            </div>
          )}

          {project.category && (
            <div className="card p-4">
              <div className="text-sm text-muted-foreground mb-1">Kategoriya</div>
              <div className="font-medium">{project.category.nameUz}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
