import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { projectsService } from '@services/projects.service';
import { PlusCircle, FolderOpen, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { getImageUrl } from '@/utils/image';

const statusLabels: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Ochiq', color: 'text-blue-600 bg-blue-50' },
  IN_PROGRESS: { label: 'Jarayonda', color: 'text-amber-600 bg-amber-50' },
  COMPLETED: { label: 'Tugallangan', color: 'text-green-600 bg-green-50' },
  CANCELLED: { label: 'Bekor', color: 'text-gray-600 bg-gray-50' },
  DISPUTED: { label: 'Nizo', color: 'text-red-600 bg-red-50' },
};

export function ClientDashboard() {
  const { user } = useAuthStore();
  const { data, isLoading } = useQuery({
    queryKey: ['my-projects'],
    queryFn: () => projectsService.getMy(),
  });

  const projects = data?.data?.data || [];
  const stats = {
    total: projects.length,
    open: projects.filter((p: any) => p.status === 'OPEN').length,
    inProgress: projects.filter((p: any) => p.status === 'IN_PROGRESS').length,
    completed: projects.filter((p: any) => p.status === 'COMPLETED').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Salom, {user?.firstName}! 👋</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">Loyihalaringizni boshqaring</p>
        </div>
        <Link to="/client/projects/create" className="btn-primary gap-2 text-sm shrink-0">
          <PlusCircle className="w-4 h-4" /> Yangi loyiha
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Jami loyihalar', value: stats.total, icon: FolderOpen, color: 'text-primary bg-primary/10' },
          { label: 'Ochiq', value: stats.open, icon: Clock, color: 'text-blue-600 bg-blue-50' },
          { label: 'Jarayonda', value: stats.inProgress, icon: AlertCircle, color: 'text-amber-600 bg-amber-50' },
          { label: 'Tugallangan', value: stats.completed, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-3 md:p-5">
              <div className={clsx('w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center mb-2 md:mb-3', s.color)}>
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="text-xl md:text-2xl font-bold">{s.value}</div>
              <div className="text-xs md:text-sm text-muted-foreground">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Recent projects */}
      <div className="card">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">So'nggi loyihalar</h2>
          <Link to="/client/projects" className="text-sm text-primary hover:underline">Barchasi →</Link>
        </div>

        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          </div>
        ) : projects.length === 0 ? (
          <div className="p-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-30" />
            <p className="text-muted-foreground mb-4">Hali loyiha yo'q</p>
            <Link to="/client/projects/create" className="btn-primary">Birinchi loyihani yarating</Link>
          </div>
        ) : (
          <div className="divide-y">
            {projects.slice(0, 5).map((project: any) => {
              const s = statusLabels[project.status] || { label: project.status, color: 'text-gray-600 bg-gray-50' };
              return (
                <Link key={project.id} to={`/projects/${project.id}`} className="flex items-center gap-3 p-3 md:p-4 hover:bg-muted/50 transition-colors">
                  {project.images?.[0] ? (
                    <img src={getImageUrl(project.images[0].url)} alt="" className="w-11 h-11 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-11 h-11 md:w-14 md:h-14 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{project.title}</div>
                    <div className="text-sm text-muted-foreground">{project._count?.bids || 0} taklif</div>
                  </div>
                  <span className={clsx('badge text-xs px-2.5 py-1', s.color)}>{s.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
