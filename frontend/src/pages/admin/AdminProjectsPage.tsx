import { useEffect, useState, useCallback, useRef } from 'react';
import { UserPlus, X, Search, Check } from 'lucide-react';
import { Card, CardBody, Button, StatusBadge, Badge, Select, Input, MoneyInput, Avatar, Pagination, SkeletonProjectRow, Spinner } from '@components/ui';
import { adminService } from '@services/admin.service';
import type { Project } from '@/types';
import { getImageUrl } from '@/utils/image';

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
  const [finalPrice, setFinalPrice] = useState(0);
  const [commissionPercent, setCommissionPercent] = useState('15');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();

  const priceNum = finalPrice || 0;
  const commNum = Math.min(100, Math.max(0, Number(commissionPercent) || 0));
  const commissionAmount = priceNum * commNum / 100;
  const netAmount = priceNum - commissionAmount;

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
    setError('');
    if (!selected) { setError("Usta tanlanmagan"); return; }
    if (!priceNum || priceNum <= 0) { setError("Kelishilgan summani kiriting"); return; }
    setSubmitting(true);
    try {
      await adminService.assignWorkerToProject(project.id, selected.user.id, priceNum, commNum);
      onAssigned(project.id);
      onClose();
    } catch (e: any) {
      setError(e?.response?.data?.message ?? 'Xatolik yuz berdi');
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
        <div className="flex-1 overflow-y-auto divide-y divide-border min-h-0">
          {loadingWorkers ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : workers.length === 0 ? (
            <p className="text-center text-muted-foreground py-10">Usta topilmadi</p>
          ) : (
            workers.map((w) => (
              <button
                key={w.id}
                onClick={() => setSelected(selected?.id === w.id ? null : w)}
                className={`w-full flex items-center gap-3 px-5 py-3 text-left transition-colors ${
                  selected?.id === w.id ? 'bg-primary/10 border-l-4 border-primary' : 'hover:bg-surface-100'
                }`}
              >
                <Avatar src={getImageUrl(w.user.avatar)} alt={`${w.user.firstName} ${w.user.lastName}`} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{w.user.firstName} {w.user.lastName}</p>
                  <p className="text-xs text-muted-foreground">
                    {categoryLabels[w.category] ?? w.category}
                    {w.city ? ` · ${w.city}` : ''}
                    {` · ⭐ ${w.rating.toFixed(1)}`}
                  </p>
                </div>
                {w.isVerified && <Badge variant="success" className="shrink-0">Tasdiqlangan</Badge>}
                {selected?.id === w.id && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            ))
          )}
        </div>

        {/* Price + commission + submit */}
        <div className="p-4 border-t border-border space-y-3">
          {/* Inputs row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Kelishilgan summa <span className="text-red-500">*</span>
              </label>
              <MoneyInput
                value={finalPrice}
                onChange={(raw) => setFinalPrice(raw)}
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Komissiya %</label>
              <div className="relative">
                <input
                  type="number"
                  className="input pr-7"
                  placeholder="15"
                  value={commissionPercent}
                  onChange={(e) => setCommissionPercent(e.target.value)}
                  min={0}
                  max={100}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          {/* Commission preview */}
          {priceNum > 0 && (
            <div className="rounded-xl bg-surface-50 border border-border p-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <p className="text-muted-foreground mb-0.5">Kelishilgan summa</p>
                <p className="font-semibold">{priceNum.toLocaleString()} so'm</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Platforma ({commNum}%)</p>
                <p className="font-semibold text-amber-600">{commissionAmount.toLocaleString()} so'm</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-0.5">Ustaga tushadi</p>
                <p className="font-semibold text-emerald-600">{netAmount.toLocaleString()} so'm</p>
              </div>
            </div>
          )}

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <div className="flex gap-2">
            <Button variant="outline" fullWidth onClick={onClose}>Bekor qilish</Button>
            <Button fullWidth disabled={!selected || !priceNum} loading={submitting} onClick={handleAssign}>
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
  const limit = 10;

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
            <div className="divide-y divide-border">
              {Array.from({ length: 8 }).map((_, i) => <SkeletonProjectRow key={i} />)}
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
                      {new Date(project.createdAt).toLocaleDateString('en-GB').split('/').reverse().join('.')}
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

      <Pagination
        page={page}
        totalPages={totalPages}
        total={total}
        limit={limit}
        onChange={setPage}
      />

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
