import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { projectsService } from '@services/projects.service';
import { bidsService } from '@services/bids.service';
import { useAuthStore } from '@store/authStore';
import {
  MapPin, Clock, DollarSign, Star, ArrowLeft, HardHat, Send,
  CheckCircle2, Calendar, Eye, Tag, Banknote, User, ChevronDown, ChevronUp,
} from 'lucide-react';
import { getImageUrl } from '@/utils/image';
import { StatusBadge, MoneyInput } from '@components/ui';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

const urgencyLabel: Record<string, { text: string; cls: string }> = {
  LOW:    { text: 'Past',         cls: 'bg-gray-100 text-gray-600' },
  MEDIUM: { text: "O'rta",       cls: 'bg-blue-100 text-blue-700' },
  HIGH:   { text: 'Yuqori',      cls: 'bg-amber-100 text-amber-700' },
  URGENT: { text: 'Shoshilinch', cls: 'bg-red-100 text-red-700' },
};

function fmt(d?: string | null) {
  if (!d) return null;
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
}

/* ─── Bid message expander ─────────────────────────── */
function BidMessage({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const isLong = text.length > 120;
  return (
    <div>
      <p className={clsx('text-sm text-muted-foreground leading-relaxed', !open && isLong && 'line-clamp-2')}>
        {text}
      </p>
      {isLong && (
        <button onClick={() => setOpen(!open)} className="text-xs text-primary mt-1 flex items-center gap-0.5">
          {open ? <><ChevronUp className="w-3 h-3" /> Yopish</> : <><ChevronDown className="w-3 h-3" /> Ko'proq</>}
        </button>
      )}
    </div>
  );
}

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState('');
  const [duration, setDuration] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ amount?: string; message?: string }>({});

  const { data, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectsService.getOne(id!),
  });

  const bidMutation = useMutation({
    mutationFn: (payload: { amount: number; message: string; duration?: number; durationUnit?: string }) =>
      bidsService.create(id!, payload),
    onSuccess: () => {
      toast.success('Taklifingiz muvaffaqiyatli yuborildi!');
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      queryClient.invalidateQueries({ queryKey: ['worker-bids'] });
      setAmount(0); setMessage(''); setDuration(''); setFieldErrors({});
    },
    onError: (e: any) => {
      const raw = e?.response?.data?.message;
      const msgs: string[] = Array.isArray(raw) ? raw : raw ? [raw] : [];
      const errs: { amount?: string; message?: string } = {};
      msgs.forEach((m: string) => {
        const lo = m.toLowerCase();
        if (lo.includes('narx') || lo.includes('amount')) errs.amount = m;
        else if (lo.includes('xabar') || lo.includes('message')) errs.message = m;
        else toast.error(m);
      });
      if (Object.keys(errs).length) setFieldErrors(errs);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { amount?: string; message?: string } = {};
    if (!amount || amount <= 0) errs.amount = 'Narxni kiriting';
    if (!message.trim()) errs.message = 'Xabar yozing';
    if (message.trim().length > 0 && message.trim().length < 5) errs.message = "Xabar kamida 5 ta belgidan iborat bo'lishi kerak";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    setFieldErrors({});
    bidMutation.mutate({
      amount, message: message.trim(),
      duration: duration ? Number(duration) : undefined,
      durationUnit: duration ? 'kun' : undefined,
    });
  };

  const project = data?.data?.data;
  const bids: any[] = project?.bids ?? [];
  const acceptedBid = bids.find((b: any) => b.status === 'ACCEPTED') ?? null;
  const assignedWorker = acceptedBid
    ? { ...acceptedBid.worker, profileId: acceptedBid.workerProfile.id, bid: acceptedBid }
    : null;
  const myExistingBid = user?.role === 'WORKER'
    ? bids.find((b: any) => b.worker?.id === user.id)
    : null;
  const isOwner = user?.role === 'CLIENT' && project?.clientId === user.id;
  const isAdmin = user?.role === 'ADMIN';
  const urgency = urgencyLabel[project?.urgency] ?? { text: project?.urgency, cls: 'bg-gray-100 text-gray-600' };

  if (isLoading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
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

        {/* ── Main column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Images */}
          {project.images?.length > 0 && (
            <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden">
              {project.images.slice(0, 4).map((img: any, i: number) => (
                <img key={img.id} src={getImageUrl(img.url)} alt=""
                  className={clsx('w-full object-cover', i === 0 ? 'col-span-2 h-64' : 'h-36')} />
              ))}
            </div>
          )}

          {/* Title */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-3">
              <h1 className="text-2xl font-bold leading-snug">{project.title}</h1>
              <StatusBadge status={project.status} />
            </div>
            {project.description && (
              <p className="text-muted-foreground leading-relaxed">{project.description}</p>
            )}
          </div>

          {/* Parameters */}
          <div className="card p-5">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-primary" /> Loyiha parametrlari
            </h2>
            <div>
              {project.category && (
                <Row label="Kategoriya" value={project.category.nameUz} />
              )}
              <Row label="Shoshilinchlik"
                value={<span className={clsx('text-xs font-medium px-2 py-0.5 rounded-full', urgency.cls)}>{urgency.text}</span>}
              />
              {project.city && <Row label="Shahar" value={project.city} />}
              {project.address && <Row label="Manzil" value={project.address} />}
              {project.region && <Row label="Viloyat" value={project.region} />}
              {(project.budgetMin || project.budgetMax) && (
                <Row label="Byudjet" value={
                  project.budgetMin && project.budgetMax
                    ? `${Number(project.budgetMin).toLocaleString()} – ${Number(project.budgetMax).toLocaleString()} so'm`
                    : project.budgetMin
                    ? `${Number(project.budgetMin).toLocaleString()} so'mdan`
                    : `${Number(project.budgetMax).toLocaleString()} so'mgacha`
                } />
              )}
              {project.startDate && <Row label="Boshlanish" value={fmt(project.startDate)} />}
              {project.endDate && <Row label="Tugash" value={fmt(project.endDate)} />}
              <Row label="E'lon qilingan" value={fmt(project.createdAt)} />
              <Row label="Ko'rishlar" value={
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-muted-foreground" />{project.viewCount ?? 0}</span>
              } />
              <Row label="Takliflar soni" value={`${bids.length} ta`} />
            </div>
          </div>

          {/* Assigned worker — IN_PROGRESS / COMPLETED */}
          {assignedWorker && (
            <div className="card p-5 border-emerald-200 bg-emerald-50/40">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <HardHat className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Loyihani qabul qilgan usta</span>
              </h2>
              <Link to={`/workers/${assignedWorker.profileId}`} className="flex items-center gap-3 group mb-4">
                <img
                  src={getImageUrl(assignedWorker.avatar) || `https://ui-avatars.com/api/?name=${assignedWorker.firstName}&background=10b981&color=fff`}
                  alt="" className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <div className="font-semibold group-hover:text-primary transition-colors">
                    {assignedWorker.firstName} {assignedWorker.lastName}
                  </div>
                  <div className="text-xs text-emerald-600 font-medium">
                    ⭐ {assignedWorker.bid?.workerProfile?.rating?.toFixed(1)} · Qabul qilindi
                  </div>
                </div>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">Kelishilgan narx</p>
                  <p className="font-bold text-primary">{Number(assignedWorker.bid.amount).toLocaleString()} so'm</p>
                </div>
                {assignedWorker.bid.duration && (
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Muddat</p>
                    <p className="font-bold">{assignedWorker.bid.duration} {assignedWorker.bid.durationUnit ?? 'kun'}</p>
                  </div>
                )}
                {project.finalPrice && (
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Admin kelishilgan summa</p>
                    <p className="font-bold text-amber-600">{Number(project.finalPrice).toLocaleString()} so'm</p>
                  </div>
                )}
                {project.commissionPercent && (
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-muted-foreground mb-0.5">Komissiya</p>
                    <p className="font-bold">{Number(project.commissionPercent)}%</p>
                  </div>
                )}
              </div>
              {assignedWorker.bid.message && (
                <div className="mt-3 bg-white rounded-xl p-3">
                  <p className="text-xs text-muted-foreground mb-1">Ustaning xabari</p>
                  <BidMessage text={assignedWorker.bid.message} />
                </div>
              )}
            </div>
          )}

          {/* Bids list — owner or admin sees all; others see count only */}
          {bids.length > 0 && (isOwner || isAdmin) && (
            <div className="card overflow-hidden">
              <div className="px-5 py-3.5 border-b font-semibold flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Takliflar
                <span className="ml-auto text-xs bg-surface-100 px-2 py-0.5 rounded-full font-normal text-muted-foreground">
                  {bids.length} ta
                </span>
              </div>
              <div className="divide-y">
                {bids.map((bid: any) => (
                  <Link key={bid.id} to={`/workers/${bid.workerProfile.id}`}
                    className={clsx(
                      'flex gap-4 px-5 py-4 hover:bg-surface-50 transition-colors',
                      bid.status === 'ACCEPTED' && 'bg-emerald-50/60 hover:bg-emerald-50',
                    )}
                  >
                    <img
                      src={getImageUrl(bid.worker.avatar) || `https://ui-avatars.com/api/?name=${bid.worker.firstName}`}
                      alt="" className="w-10 h-10 rounded-full shrink-0 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{bid.worker.firstName} {bid.worker.lastName}</span>
                        {bid.status === 'ACCEPTED' && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">Qabul qilindi</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {bid.workerProfile.rating?.toFixed(1)} · {bid.workerProfile.completedProjects} loyiha
                      </div>
                      {bid.message && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{bid.message}</p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-primary text-sm">{Number(bid.amount).toLocaleString()} so'm</div>
                      {bid.duration && (
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1 justify-end">
                          <Clock className="w-3 h-3" />{bid.duration} {bid.durationUnit ?? 'kun'}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground mt-0.5">{fmt(bid.createdAt)}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Bid form — WORKER only */}
          {user?.role === 'WORKER' && project.status === 'OPEN' && (
            <div id="bid" className="card p-6 scroll-mt-6">
              <h2 className="text-lg font-semibold mb-5">
                {myExistingBid ? 'Sizning taklifingiz' : 'Taklif yuborish'}
              </h2>

              {myExistingBid ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 rounded-xl px-4 py-3 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Taklif yuborildi — kutilmoqda
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-surface-50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-1">Narx</p>
                      <p className="font-bold text-primary text-lg">{Number(myExistingBid.amount).toLocaleString()} so'm</p>
                    </div>
                    {myExistingBid.duration && (
                      <div className="bg-surface-50 rounded-xl p-4">
                        <p className="text-xs text-muted-foreground mb-1">Muddat</p>
                        <p className="font-bold text-sm">{myExistingBid.duration} {myExistingBid.durationUnit ?? 'kun'}</p>
                      </div>
                    )}
                  </div>
                  {myExistingBid.message && (
                    <div className="bg-surface-50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground mb-2">Xabaringiz</p>
                      <p className="text-sm leading-relaxed">{myExistingBid.message}</p>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Narx <span className="text-red-500">*</span></label>
                      <MoneyInput
                        value={amount}
                        onChange={(raw) => { setAmount(raw); setFieldErrors(p => ({ ...p, amount: undefined })); }}
                        placeholder="2 500 000"
                        min={0}
                        error={fieldErrors.amount}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1.5 block">Muddat (kun)</label>
                      <input type="number" className="input" placeholder="masalan: 5"
                        value={duration} onChange={e => setDuration(e.target.value)} min={1} />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Xabar <span className="text-red-500">*</span></label>
                    <textarea
                      className={clsx('input min-h-[100px] resize-none', fieldErrors.message && 'border-destructive focus-visible:ring-destructive/30')}
                      placeholder="Tajribangiz, ish rejasi yoki savollaringizni yozing..."
                      value={message}
                      onChange={e => { setMessage(e.target.value); setFieldErrors(p => ({ ...p, message: undefined })); }}
                      rows={4}
                    />
                    {fieldErrors.message && <p className="text-xs text-destructive mt-1">{fieldErrors.message}</p>}
                  </div>
                  <button type="submit" disabled={bidMutation.isPending}
                    className="btn-primary w-full flex items-center justify-center gap-2">
                    {bidMutation.isPending
                      ? <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      : <Send className="w-4 h-4" />}
                    {bidMutation.isPending ? 'Yuklanmoqda...' : 'Taklif yuborish'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">

          {/* Client */}
          <div className="card p-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Mijoz
            </p>
            <Link to={`/clients/${project.client.id}`} className="flex items-center gap-3 group">
              <img
                src={getImageUrl(project.client.avatar) || `https://ui-avatars.com/api/?name=${project.client.firstName}`}
                alt="" className="w-11 h-11 rounded-xl object-cover"
              />
              <div>
                <div className="font-semibold text-sm group-hover:text-primary transition-colors">
                  {project.client.firstName} {project.client.lastName}
                </div>
                <div className="text-xs text-muted-foreground">Profilni ko'rish →</div>
              </div>
            </Link>

            {user?.role === 'WORKER' && project.status === 'OPEN' && !myExistingBid && (
              <a href="#bid" className="btn-primary w-full text-center py-2.5 mt-4 block">
                Taklif berish
              </a>
            )}
            {user?.role === 'WORKER' && myExistingBid && (
              <div className="flex items-center justify-center gap-2 w-full py-2.5 mt-4 text-sm font-medium text-emerald-600 bg-emerald-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4" /> Taklif yuborildi
              </div>
            )}
          </div>

          {/* Financials */}
          <div className="card p-5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3 flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5" /> Moliyaviy
            </p>
            <div className="space-y-2.5">
              {project.budgetMin && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Byudjet (min)</span>
                  <span className="font-medium">{Number(project.budgetMin).toLocaleString()} so'm</span>
                </div>
              )}
              {project.budgetMax && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Byudjet (max)</span>
                  <span className="font-medium">{Number(project.budgetMax).toLocaleString()} so'm</span>
                </div>
              )}
              {project.finalPrice && (
                <>
                  <div className="border-t pt-2.5 flex justify-between text-sm">
                    <span className="text-muted-foreground">Kelishilgan summa</span>
                    <span className="font-bold text-primary">{Number(project.finalPrice).toLocaleString()} so'm</span>
                  </div>
                  {project.commissionPercent && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Komissiya ({Number(project.commissionPercent)}%)</span>
                      <span className="font-medium text-amber-600">
                        {(Number(project.finalPrice) * Number(project.commissionPercent) / 100).toLocaleString()} so'm
                      </span>
                    </div>
                  )}
                  {project.commissionPercent && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Ustaga</span>
                      <span className="font-bold text-emerald-600">
                        {(Number(project.finalPrice) * (1 - Number(project.commissionPercent) / 100)).toLocaleString()} so'm
                      </span>
                    </div>
                  )}
                </>
              )}
              {!project.budgetMin && !project.budgetMax && !project.finalPrice && (
                <p className="text-sm text-muted-foreground">Narx belgilanmagan</p>
              )}
            </div>
          </div>

          {/* Dates & stats */}
          <div className="card p-5 space-y-2.5">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-3 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Vaqt & statistika
            </p>
            {project.startDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Boshlanish</span>
                <span className="font-medium">{fmt(project.startDate)}</span>
              </div>
            )}
            {project.endDate && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tugash</span>
                <span className="font-medium">{fmt(project.endDate)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">E'lon qilingan</span>
              <span className="font-medium">{fmt(project.createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> Ko'rishlar</span>
              <span className="font-medium">{project.viewCount ?? 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground flex items-center gap-1"><DollarSign className="w-3.5 h-3.5" /> Takliflar</span>
              <span className="font-medium">{bids.length} ta</span>
            </div>
          </div>

          {project.category && (
            <div className="card p-4 flex items-center gap-3">
              <Tag className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Kategoriya</p>
                <p className="font-medium text-sm">{project.category.nameUz}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
