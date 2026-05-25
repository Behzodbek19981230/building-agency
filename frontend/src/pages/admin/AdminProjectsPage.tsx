import { useEffect, useState, useCallback, useRef } from 'react';
import { UserPlus, X, Search, Check } from 'lucide-react';
import { Card, CardBody, Button, StatusBadge, Spinner, Badge, Select, Input, MoneyInput, Avatar } from '@components/ui';
import { adminService } from '@services/admin.service';
import type { Project } from '@/types';

const statusOptions = [
  { value: '', label: 'Barchasi' },
  { value: 'OPEN', label: 'Ochiq' },
  { value: 'IN_PROGRESS', label: 'Jarayonda' },
  { value: 'COMPLETED', label: 'Tugallandi' },
  { value: 'CANCELLED', label: 'Bekor qilindi' },
  { value: 'DISPUTED', label: 'Nizo' },
];

interface WorkerOption {
  id: string;
  userId: string;
  category: string;
  rating: number;
  isVerified: boolean;
  city?: string;
  user: { id: string; firstName: string; lastName: string; avatar?: string };
}

const categoryLabels: Record<string, string> = {
  BUILDER: 'Qurilishchi', ELECTRICIAN: 'Elektrik', PLUMBER: 'Santexnik',
  PAINTER: "Bo'yoqchi", CARPENTER: 'Duradgor', INTERIOR_DESIGNER: 'Dizayner',
  ARCHITECT: 'Arxitektor', TILE_INSTALLER: 'Plitkachi', ROOFER: 'Tom ustasi',
  WELDER: 'Payvandchi', SMART_HOME: 'Aqlli uy', HVAC_SPECIALIST: 'HVAC',
  PLASTERER: 'Shtukaturchi', STUCCO_WORKER: 'Gipschi',
};

interface AssignModalProps {
  project: Project;
  onClose: () => void;
  onAssigned: (projectId: string) => void;
}

function AssignWorkerModal({ project, onClose, onAssigned }: AssignModalProps) {
  const [search, setSearch] = useState('');
  const [workers, setWorkers] = useState<WorkerOption[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(false);
  const [selected, setSelected] = useState<WorkerOption | null>(null);
  const [finalPrice, setFinalPrice] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const fetchWorkers = useCallback((q: string) => {
    setLoadingWorkers(true);
    adminService
      .searchWorkers(q || undefined)
      .then((res) => setWorkers(res.data.data))
      .finally(() => setLoadingWorkers(false));
  }, []);

  useEffect(() => {
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => fetchWorkers(search), 300);
    return () => clearTimeout(searchTimeout.current);
  }, [search, fetchWorkers]);

  const handleAssign = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await adminService.assignWorkerToProject(
        project.id,
        selected.user.id,
        finalPrice ? Number(finalPrice) : undefined,
      );
      onAssigned(project.id);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="min-w-0">
            <h2 className="font-semibold text-lg">Usta biriktirish</h2>
            <p className="text-sm text-muted-foreground truncate">{project.title}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors ml-2 shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              className="w-full pl-9 pr-4 h-10 rounded-xl border border-border bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Ism yoki mutaxassislik bo'yicha qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Worker list */}
        <div className="flex-1 overflow-y-auto divide-y divide-border">
          {loadingWorkers ? (
            <div className="flex justify-center py-10">
              <Spinner />
            </div>
          ) : workers.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Usta topilmadi</p>
          ) : (
            workers.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelected(selected?.id === w.id ? null : w)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  selected?.id === w.id
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'hover:bg-surface-100'
                }`}
              >
                <Avatar
                  src={w.user.avatar}
                  alt={`${w.user.firstName} ${w.user.lastName}`}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">
                    {w.user.firstName} {w.user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {categoryLabels[w.category] ?? w.category}
                    {w.city ? ` · ${w.city}` : ''}
                    {` · ⭐ ${w.rating.toFixed(1)}`}
                  </p>
                </div>
                {w.isVerified && (
                  <Badge variant="success" className="shrink-0">Tasdiqlangan</Badge>
                )}
                {selected?.id === w.id && (
                  <Check className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            ))
          )}
        </div>

        {/* Final price + submit */}
        <div className="p-4 border-t border-border space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Yakuniy narx (ixtiyoriy)
            </label>
            <MoneyInput
              value={finalPrice}
              onChange={(e) => setFinalPrice(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={onClose}>
              Bekor qilish
            </Button>
            <Button
              fullWidth
              disabled={!selected}
              loading={submitting}
              onClick={handleAssign}
            >
              Biriktirish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [assignProject, setAssignProject] = useState<Project | null>(null);
  const limit = 20;

  const fetchProjects = useCallback(() => {
    setLoading(true);
    adminService
      .getAllProjects({ page, limit, status: status || undefined })
      .then((res) => {
        setProjects(res.data.data);
        setTotal(res.data.meta?.total ?? res.data.data?.length ?? 0);
      })
      .finally(() => setLoading(false));
  }, [page, status]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleAssigned = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status: 'IN_PROGRESS' } : p)),
    );
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loyihalar</h1>
        <Badge variant="secondary">{total} ta</Badge>
      </div>

      <div className="flex">
        <Select
          options={statusOptions}
          value={status}
          onChange={(v) => { setStatus(v as string); setPage(1); }}
          className="w-44"
        />
      </div>

      <Card>
        <CardBody className="p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner />
            </div>
          ) : projects.length === 0 ? (
            <p className="text-center text-muted-foreground py-16">Loyihalar topilmadi</p>
          ) : (
            <div className="divide-y divide-border">
              {projects.map((project) => (
                <div key={project.id} className="flex items-center gap-4 px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{project.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-muted-foreground truncate">
                        {project.client.firstName} {project.client.lastName}
                      </p>
                      {project.category && (
                        <span className="text-xs text-muted-foreground">· {project.category.nameUz}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.budgetMin && (
                      <span className="text-sm font-medium hidden md:block">
                        {Number(project.budgetMin).toLocaleString()} so'm
                      </span>
                    )}
                    <StatusBadge status={project.status} />
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(project.createdAt).toLocaleDateString('uz-UZ')}
                    </span>
                    {(project.status === 'OPEN' || project.status === 'DRAFT') && (
                      <Button
                        variant="outline"
                        size="xs"
                        leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                        onClick={() => setAssignProject(project)}
                      >
                        Biriktirish
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Oldingi
          </Button>
          <span className="flex items-center px-3 text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Keyingi
          </Button>
        </div>
      )}

      {assignProject && (
        <AssignWorkerModal
          project={assignProject}
          onClose={() => setAssignProject(null)}
          onAssigned={handleAssigned}
        />
      )}
    </div>
  );
}
