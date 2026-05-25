import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { workersService } from '@services/workers.service';
import { projectsService } from '@services/projects.service';
import {
  DollarSign, Briefcase, Star, TrendingUp, Calendar,
  CheckCircle, MapPin, MessageSquare, Spinner,
} from 'lucide-react';
import { Card, CardBody, Spinner as SpinnerUI } from '@components/ui';

export function WorkerEarningsPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['worker-stats'],
    queryFn: () => workersService.getStats(),
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['worker-completed-projects'],
    queryFn: () => projectsService.getMy('COMPLETED'),
  });

  const stats = statsData?.data?.data;
  const projects: any[] = projectsData?.data?.data ?? [];
  const isLoading = statsLoading || projectsLoading;

  const totalEarned    = Number(stats?.totalEarnings ?? 0);
  const completedCount = stats?.completedProjects ?? 0;
  const activeCount    = stats?.activeProjects ?? 0;
  const rating         = stats?.rating ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Daromadlar</h1>

      {isLoading ? (
        <div className="flex justify-center py-16"><SpinnerUI /></div>
      ) : (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Jami daromad',        value: `${totalEarned.toLocaleString()} so'm`, icon: DollarSign,  color: 'bg-emerald-500' },
              { label: 'Bajarilgan loyihalar', value: completedCount,                         icon: CheckCircle, color: 'bg-blue-500'    },
              { label: 'Faol loyihalar',       value: activeCount,                            icon: TrendingUp,  color: 'bg-violet-500'  },
              { label: 'Reyting',              value: `${rating.toFixed(1)} ★`,               icon: Star,        color: 'bg-amber-500'   },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label}>
                  <CardBody className="flex items-center gap-3 p-5">
                    <div className={`p-2.5 rounded-xl ${s.color} shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="font-bold">{s.value}</p>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Completed projects */}
          <Card>
            <CardBody className="p-0">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">Bajarilgan loyihalar</h2>
                {projects.length > 0 && (
                  <span className="text-xs bg-surface-100 text-muted-foreground px-2 py-0.5 rounded-full">
                    {projects.length} ta
                  </span>
                )}
              </div>

              {projects.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Hali bajarilgan loyiha yo'q</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {projects.map((p) => (
                    <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                      {/* Client avatar */}
                      <Link to={`/clients/${p.client?.id}`} className="shrink-0">
                        <img
                          src={
                            p.client?.avatar ||
                            `https://ui-avatars.com/api/?name=${p.client?.firstName ?? 'U'}&size=40&background=6366f1&color=fff`
                          }
                          alt=""
                          className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{p.title}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">
                          <Link
                            to={`/clients/${p.client?.id}`}
                            className="hover:text-primary transition-colors"
                          >
                            {p.client?.firstName} {p.client?.lastName}
                          </Link>
                          {p.city && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" /> {p.city}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(p.createdAt).toLocaleDateString('uz-UZ')}
                          </span>
                        </div>
                      </div>

                      {/* Price + review button */}
                      <div className="flex items-center gap-3 shrink-0">
                        {p.finalPrice && (
                          <div className="text-right hidden sm:block">
                            <p className="font-bold text-emerald-600 text-sm">
                              {Number(p.finalPrice).toLocaleString()} so'm
                            </p>
                          </div>
                        )}
                        <Link
                          to={`/clients/${p.client?.id}`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Baholash
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
