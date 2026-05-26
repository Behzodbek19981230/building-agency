import { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Star, MapPin, Search, SlidersHorizontal, TrendingUp, Briefcase, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardBody, Button, StatusBadge, Spinner, Badge, Select, Pagination, SkeletonWorkerCard } from '@components/ui';
import { adminService } from '@services/admin.service';
import { getImageUrl } from '@/utils/image';
import { clsx } from 'clsx';

/* ─── constants ─────────────────────────────────────── */
const categoryLabels: Record<string, string> = {
  BUILDER: 'Qurilishchi', ELECTRICIAN: 'Elektrik', PLUMBER: 'Santexnik',
  PAINTER: "Bo'yoqchi", CARPENTER: 'Duradgor', INTERIOR_DESIGNER: 'Dizayner',
  ARCHITECT: 'Arxitektor', TILE_INSTALLER: 'Plitkachi', ROOFER: 'Tom ustasi',
  WELDER: 'Payvandchi', SMART_HOME: 'Aqlli uy', HVAC_SPECIALIST: 'HVAC',
  PLASTERER: 'Shtukaturchi', STUCCO_WORKER: 'Gipschi',
};

const CATEGORIES = Object.entries(categoryLabels).map(([v, l]) => ({ value: v, label: l }));

const statusConfig: Record<string, { label: string; dot: string; badge: string }> = {
  AVAILABLE: { label: 'Bo\'sh',     dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  BUSY:      { label: 'Band',       dot: 'bg-amber-500',   badge: 'bg-amber-50 text-amber-700 border-amber-200' },
  OFFLINE:   { label: 'Offline',    dot: 'bg-gray-400',    badge: 'bg-gray-50 text-gray-500 border-gray-200' },
};

type SortKey = 'rating' | 'completedProjects' | 'experience' | 'reviewCount';
type SortOrder = 'desc' | 'asc';

interface Worker {
  id: string; userId: string; category: string; bio?: string;
  experience: number; hourlyRate?: number; dailyRate?: number;
  city?: string; rating: number; reviewCount: number;
  completedProjects: number; isVerified: boolean;
  status: string; verificationStatus: string; createdAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; avatar?: string };
}

interface PendingWorker extends Worker {
  user: Worker['user'] & { createdAt: string };
}

/* ─── WorkerCard (reestr) ────────────────────────────── */
function WorkerCard({ w }: { w: Worker }) {
  const st = statusConfig[w.status] ?? statusConfig.OFFLINE;
  const isAvailable = w.status === 'AVAILABLE';

  return (
    <div className={clsx(
      'card p-4 flex flex-col gap-3 transition-all duration-200 hover:shadow-md',
      isAvailable ? 'border-emerald-200' : w.status === 'BUSY' ? 'border-amber-200' : '',
    )}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          {w.user.avatar ? (
            <img src={getImageUrl(w.user.avatar)} alt="" className="w-11 h-11 rounded-xl object-cover" />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-base">
              {w.user.firstName[0]}{w.user.lastName[0]}
            </div>
          )}
          <span className={clsx('absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white', st.dot)} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="font-semibold text-sm truncate">
              {w.user.firstName} {w.user.lastName}
            </p>
            {w.isVerified && (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground truncate">{w.user.email}</p>
          <div className="flex items-center gap-1.5 flex-wrap mt-1">
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              {categoryLabels[w.category] ?? w.category}
            </span>
            <span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full border', st.badge)}>
              {st.label}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-1.5 text-center">
        <div className="bg-surface-50 rounded-lg py-1.5">
          <p className="text-sm font-bold text-amber-500">{w.rating.toFixed(1)}</p>
          <p className="text-[10px] text-muted-foreground">Reyting</p>
        </div>
        <div className="bg-surface-50 rounded-lg py-1.5">
          <p className="text-sm font-bold">{w.completedProjects}</p>
          <p className="text-[10px] text-muted-foreground">Bajarilgan</p>
        </div>
        <div className="bg-surface-50 rounded-lg py-1.5">
          <p className="text-sm font-bold">{w.experience}</p>
          <p className="text-[10px] text-muted-foreground">Yil tajriba</p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        {w.city && (
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.city}</span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Star className="w-3 h-3 text-amber-400" />
          {w.reviewCount} sharh
        </span>
      </div>
    </div>
  );
}

/* ─── PendingCard (tasdiq) ──────────────────────────── */
function PendingCard({ w, onVerify, processingId }: {
  w: PendingWorker; processingId: string | null;
  onVerify: (id: string, status: 'VERIFIED' | 'REJECTED') => void;
}) {
  return (
    <Card>
      <CardBody className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          {w.user.avatar ? (
            <img src={getImageUrl(w.user.avatar)} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
              {w.user.firstName[0]}{w.user.lastName[0]}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">{w.user.firstName} {w.user.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{w.user.email}</p>
            <div className="flex gap-1.5 mt-1 flex-wrap">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                {categoryLabels[w.category] ?? w.category}
              </span>
              <StatusBadge status={w.verificationStatus} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-xs text-muted-foreground">
          <span>{w.experience} yil tajriba</span>
          {w.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{w.city}</span>}
          {w.hourlyRate && <span>Soat: {Number(w.hourlyRate).toLocaleString()} so'm</span>}
          <span>Ro'yxat: {new Date(w.user.createdAt).toLocaleDateString('ru-RU')}</span>
        </div>

        {w.bio && <p className="text-xs text-muted-foreground line-clamp-2">{w.bio}</p>}

        <div className="flex gap-2">
          <Button variant="success" size="sm" fullWidth loading={processingId === w.id}
            leftIcon={<CheckCircle className="w-4 h-4" />} onClick={() => onVerify(w.id, 'VERIFIED')}>
            Tasdiqlash
          </Button>
          <Button variant="danger" size="sm" fullWidth loading={processingId === w.id}
            leftIcon={<XCircle className="w-4 h-4" />} onClick={() => onVerify(w.id, 'REJECTED')}>
            Rad etish
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

/* ─── SortButton ─────────────────────────────────────── */
function SortBtn({ label, icon: Icon, active, order, onClick }: {
  label: string; icon: React.ElementType;
  active: boolean; order: SortOrder; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all',
        active
          ? 'bg-primary text-white border-primary'
          : 'bg-white text-muted-foreground border-border hover:border-primary/40 hover:text-foreground',
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
      {active && (order === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />)}
    </button>
  );
}

/* ─── Main page ─────────────────────────────────────── */
export function AdminWorkersPage() {
  const [tab, setTab] = useState<'registry' | 'pending'>('registry');

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [registryLoading, setRegistryLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('rating');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [pending, setPending] = useState<PendingWorker[]>([]);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRegistry = useCallback(() => {
    setRegistryLoading(true);
    adminService.getWorkerRegistry({
      page,
      limit,
      search: search || undefined,
      category: filterCategory || undefined,
      status: filterStatus || undefined,
      sortBy: sortKey,
      sortOrder: sortOrder,
    })
      .then((res) => {
        setWorkers(res.data?.data ?? []);
        setTotal(res.data?.meta?.total ?? 0);
        setTotalPages(res.data?.meta?.totalPages ?? 1);
      })
      .finally(() => setRegistryLoading(false));
  }, [page, search, filterCategory, filterStatus, sortKey, sortOrder]);

  useEffect(() => {
    const t = setTimeout(fetchRegistry, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [fetchRegistry]);

  useEffect(() => {
    setPendingLoading(true);
    adminService.getPendingWorkers()
      .then((res) => setPending(res.data?.data ?? []))
      .finally(() => setPendingLoading(false));
  }, []);

  const handleVerify = async (workerId: string, status: 'VERIFIED' | 'REJECTED') => {
    setProcessingId(workerId);
    try {
      await adminService.verifyWorker(workerId, status);
      setPending((p) => p.filter((w) => w.id !== workerId));
    } finally {
      setProcessingId(null);
    }
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
    else { setSortKey(key); setSortOrder('desc'); }
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">Ustalar reestri</h1>
          {!registryLoading && (
            <p className="text-sm text-muted-foreground mt-0.5">Jami {total} ta usta</p>
          )}
        </div>
        {pending.length > 0 && (
          <button onClick={() => setTab('pending')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium hover:bg-amber-100 transition-colors">
            ⏳ {pending.length} ta tasdiq kutmoqda
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 p-1 rounded-xl w-fit border border-border">
        {[
          { key: 'registry', label: 'Reestr' },
          { key: 'pending', label: `Tasdiq ${pending.length > 0 ? `(${pending.length})` : ''}` },
        ].map((t) => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            className={clsx(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all',
              tab === t.key ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground',
            )}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── REGISTRY TAB ── */}
      {tab === 'registry' && (
        <div className="space-y-4">
          <div className="card p-3 md:p-4 space-y-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Ism yoki shahar bo'yicha qidirish..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-border bg-surface-50 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 items-center">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />

              <div className="w-52">
                <Select
                  options={CATEGORIES}
                  value={filterCategory || null}
                  onChange={(v) => { setFilterCategory((v as string) ?? ''); setPage(1); }}
                  placeholder="Barcha mutaxassislik"
                  isClearable
                />
              </div>

              <div className="w-40">
                <Select
                  options={[
                    { value: 'AVAILABLE', label: "Bo'sh" },
                    { value: 'BUSY',      label: 'Band' },
                    { value: 'OFFLINE',   label: 'Offline' },
                  ]}
                  value={filterStatus || null}
                  onChange={(v) => { setFilterStatus((v as string) ?? ''); setPage(1); }}
                  placeholder="Barcha holat"
                  isClearable
                />
              </div>

              {(search || filterCategory || filterStatus) && (
                <button
                  onClick={() => { setSearch(''); setFilterCategory(''); setFilterStatus(''); setPage(1); }}
                  className="text-xs text-destructive hover:underline shrink-0"
                >
                  Hammasini tozalash
                </button>
              )}
            </div>

            {/* Sort */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-muted-foreground shrink-0">Saralash:</span>
              <SortBtn label="Reyting"    icon={Star}      active={sortKey === 'rating'}            order={sortOrder} onClick={() => toggleSort('rating')} />
              <SortBtn label="Bajarilgan" icon={Briefcase} active={sortKey === 'completedProjects'} order={sortOrder} onClick={() => toggleSort('completedProjects')} />
              <SortBtn label="Tajriba"    icon={TrendingUp} active={sortKey === 'experience'}       order={sortOrder} onClick={() => toggleSort('experience')} />
              <SortBtn label="Sharhlar"   icon={Star}      active={sortKey === 'reviewCount'}       order={sortOrder} onClick={() => toggleSort('reviewCount')} />
            </div>
          </div>

          {registryLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonWorkerCard key={i} />)}
            </div>
          ) : workers.length === 0 ? (
            <div className="card p-12 text-center text-muted-foreground text-sm">Usta topilmadi</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {workers.map((w: Worker) => <WorkerCard key={w.id} w={w} />)}
            </div>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            total={total}
            limit={limit}
            onChange={setPage}
          />
        </div>
      )}

      {/* ── PENDING TAB ── */}
      {tab === 'pending' && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">Tasdiq kutayotganlar</h2>
            {!pendingLoading && <Badge variant="warning">{pending.length} ta</Badge>}
          </div>

          {pendingLoading ? (
            <div className="flex justify-center py-16"><Spinner /></div>
          ) : pending.length === 0 ? (
            <Card>
              <CardBody className="py-16 text-center text-muted-foreground text-sm">
                Tasdiq kutayotgan usta yo'q
              </CardBody>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pending.map((w) => (
                <PendingCard key={w.id} w={w} processingId={processingId} onVerify={handleVerify} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
