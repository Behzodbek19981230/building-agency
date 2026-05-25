import { useEffect, useState } from 'react';
import { Users, HardHat, FolderOpen, DollarSign, Activity, AlertTriangle, Clock } from 'lucide-react';
import { Card, CardBody, Spinner, StatusBadge } from '@components/ui';
import { adminService } from '@services/admin.service';

interface DashboardStats {
  totalUsers: number;
  totalWorkers: number;
  totalProjects: number;
  totalRevenue: number;
  activeProjects: number;
  pendingVerifications: number;
  openDisputes: number;
}

interface RecentProject {
  id: string;
  title: string;
  status: string;
  createdAt: string;
  client: { firstName: string; lastName: string };
  category?: { nameUz: string };
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4 p-5">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardBody>
    </Card>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => {
        setStats(res.data.data.stats);
        setRecentProjects(res.data.data.recentProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner className="mt-20 mx-auto" />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Foydalanuvchilar" value={stats.totalUsers} color="bg-blue-500" />
          <StatCard icon={HardHat} label="Ustalar" value={stats.totalWorkers} color="bg-violet-500" />
          <StatCard icon={FolderOpen} label="Loyihalar" value={stats.totalProjects} color="bg-indigo-500" />
          <StatCard
            icon={DollarSign}
            label="Daromad (komissiya)"
            value={`${stats.totalRevenue.toLocaleString()} so'm`}
            color="bg-emerald-500"
          />
          <StatCard icon={Activity} label="Faol loyihalar" value={stats.activeProjects} color="bg-cyan-500" />
          <StatCard
            icon={Clock}
            label="Tasdiq kutayotgan"
            value={stats.pendingVerifications}
            color="bg-amber-500"
          />
          <StatCard icon={AlertTriangle} label="Ochiq nizolar" value={stats.openDisputes} color="bg-red-500" />
        </div>
      )}

      <Card>
        <CardBody className="p-0">
          <div className="p-5 border-b border-border">
            <h2 className="font-semibold text-lg">So'nggi loyihalar</h2>
          </div>
          <div className="divide-y divide-border">
            {recentProjects.length === 0 && (
              <p className="p-6 text-center text-muted-foreground">Loyihalar yo'q</p>
            )}
            {recentProjects.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 gap-4">
                <div className="min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {p.client.firstName} {p.client.lastName} · {p.category?.nameUz}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={p.status} />
                  <span className="text-xs text-muted-foreground hidden sm:block">
                    {new Date(p.createdAt).toLocaleDateString('uz-UZ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
