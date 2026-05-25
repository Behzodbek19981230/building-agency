import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { reviewsService } from '@services/reviews.service';
import { projectsService } from '@services/projects.service';
import { useAuthStore } from '@store/authStore';
import { Select } from '@components/ui';
import { getImageUrl } from '@/utils/image';
import {
  Star, MapPin, ArrowLeft, Loader2, FolderOpen, Calendar,
  ChevronDown, ChevronUp, Users, ImagePlus, X, Send,
} from 'lucide-react';

const statusConfig: Record<string, { label: string; color: string }> = {
  OPEN:        { label: 'Ochiq',          color: 'bg-emerald-100 text-emerald-700' },
  IN_PROGRESS: { label: 'Jarayonda',      color: 'bg-blue-100 text-blue-700' },
  COMPLETED:   { label: 'Tugallandi',     color: 'bg-gray-100 text-gray-600' },
  CANCELLED:   { label: 'Bekor qilindi',  color: 'bg-red-100 text-red-700' },
  DISPUTED:    { label: 'Nizo',           color: 'bg-amber-100 text-amber-700' },
  DRAFT:       { label: 'Qoralama',       color: 'bg-gray-100 text-gray-500' },
};

function formatDate(d?: string) {
  if (!d) return '';
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}
function formatDateShort(d?: string) {
  if (!d) return '';
  const date = new Date(d);
  return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}.${date.getFullYear()}`;
}

/* ─── Star picker ─────────────────────────────────── */
function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              n <= (hovered || value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-gray-200 fill-gray-100'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/* ─── Review form (worker → client) ──────────────── */
function WorkerReviewForm({
  clientId,
  onSuccess,
}: {
  clientId: string;
  onSuccess: () => void;
}) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [error, setError] = useState('');

  const { data: myProjects } = useQuery({
    queryKey: ['worker-my-projects-completed'],
    queryFn: () => projectsService.getMy('COMPLETED'),
    enabled: !!user && user.role === 'WORKER',
  });

  // only projects where the client matches this profile
  const completedWithClient = (myProjects?.data?.data ?? []).filter(
    (p: any) => p.client?.id === clientId || p.clientId === clientId,
  );

  const mutation = useMutation({
    mutationFn: (fd: FormData) => reviewsService.create(selectedProjectId, clientId, fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-public-profile', clientId] });
      setRating(0); setComment(''); setPreviews([]); setSelectedProjectId(''); setError('');
      onSuccess();
    },
    onError: (e: any) => setError(e?.response?.data?.message ?? 'Xatolik yuz berdi'),
  });

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const items = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 5 - previews.length)
      .map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews((p) => [...p, ...items]);
  };

  const removeImage = (i: number) => {
    URL.revokeObjectURL(previews[i].url);
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const submit = () => {
    if (!rating) { setError("Reyting qo'ying"); return; }
    if (!selectedProjectId) { setError('Loyihani tanlang'); return; }
    const fd = new FormData();
    fd.append('rating', String(rating));
    if (comment.trim()) fd.append('comment', comment.trim());
    previews.forEach((p) => fd.append('images', p.file));
    mutation.mutate(fd);
  };

  if (!user || user.role !== 'WORKER') return null;
  if (completedWithClient.length === 0) return null;

  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-semibold flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        Baholash va sharh
      </h2>

      <Select
        label="Loyiha tanlang"
        placeholder="— Tanlang —"
        options={completedWithClient.map((p: any) => ({ value: p.id, label: p.title }))}
        value={selectedProjectId || null}
        onChange={(v) => setSelectedProjectId(v as string ?? '')}
      />

      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Reyting</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Izoh (ixtiyoriy)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Mijoz haqida fikringizni yozing..."
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      <div>
        <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
          onChange={(e) => addImages(e.target.files)} />
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {previews.map((p, i) => (
              <div key={i} className="relative">
                <img src={p.url} alt="" className="h-16 w-16 object-cover rounded-xl border border-border" />
                <button onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {previews.length < 5 && (
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-xl px-4 py-2 transition-colors hover:bg-surface-100">
            <ImagePlus className="w-4 h-4" />
            Rasm qo'shish ({previews.length}/5)
          </button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button onClick={submit} disabled={mutation.isPending}
        className="btn-primary w-full gap-2 flex items-center justify-center">
        {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        Sharh yuborish
      </button>
    </div>
  );
}

/* ─── Review card ─────────────────────────────────── */
function ReviewCard({ review }: { review: any }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.comment && review.comment.length > 160;

  return (
    <div className="border border-border rounded-2xl p-4 space-y-3 bg-surface-50">
      <div className="flex items-start gap-3">
        <img
          src={
            getImageUrl(review.reviewer?.avatar) ||
            `https://ui-avatars.com/api/?name=${review.reviewer?.firstName}&size=40&background=8b5cf6&color=fff`
          }
          className="w-10 h-10 rounded-full object-cover shrink-0"
          alt=""
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">
            {review.reviewer?.firstName} {review.reviewer?.lastName}
          </p>
          {review.project && (
            <p className="text-xs text-muted-foreground truncate">
              Loyiha: {review.project.title}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className={`w-3.5 h-3.5 ${n <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{formatDateShort(review.createdAt)}</span>
        </div>
      </div>

      {review.comment && (
        <div>
          <p className={`text-sm text-muted-foreground leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
            {review.comment}
          </p>
          {isLong && (
            <button onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary mt-1 flex items-center gap-0.5">
              {expanded ? <><ChevronUp className="w-3 h-3" />Yopish</> : <><ChevronDown className="w-3 h-3" />Ko'proq</>}
            </button>
          )}
        </div>
      )}

      {review.images?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.images.map((img: string, i: number) => (
            <a key={i} href={img} target="_blank" rel="noopener noreferrer">
              <img src={getImageUrl(img)} alt=""
                className="h-20 w-20 object-cover rounded-xl border border-border hover:opacity-80 transition-opacity" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Project card ────────────────────────────────── */
function ProjectCard({ project }: { project: any }) {
  const st = statusConfig[project.status] ?? statusConfig.DRAFT;
  return (
    <div className="border border-border rounded-2xl p-4 space-y-2 bg-surface-50">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{project.title}</p>
          {project.category && (
            <p className="text-xs text-muted-foreground mt-0.5">{project.category.nameUz}</p>
          )}
        </div>
        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${st.color}`}>
          {st.label}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {project.city && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {project.city}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {formatDateShort(project.createdAt)}
        </span>
        {(project.budgetMin || project.budgetMax) && (
          <span>
            {[
              project.budgetMin ? Number(project.budgetMin).toLocaleString() : '',
              project.budgetMax ? Number(project.budgetMax).toLocaleString() : '',
            ].filter(Boolean).join(' – ')} {"so'm"}
          </span>
        )}
        {project._count?.bids > 0 && (
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {project._count.bids} taklif
          </span>
        )}
      </div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────── */
export function ClientProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews'>('projects');
  const [formDone, setFormDone] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['client-public-profile', id],
    queryFn: () => reviewsService.getUserPublicProfile(id!),
    enabled: !!id,
  });

  const profile = data?.data?.data;

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  if (!profile)
    return <div className="text-center py-20 text-muted-foreground">Foydalanuvchi topilmadi</div>;

  const projects: any[]       = profile.projects ?? [];
  const reviewsReceived: any[] = profile.reviewsReceived ?? [];
  const avgRating: number | null = profile.avgRating;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link to="/workers"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit">
        <ArrowLeft className="w-4 h-4" /> Orqaga
      </Link>

      {/* Profile header */}
      <div className="card p-6 mb-6">
        <div className="flex items-center gap-5">
          <img
            src={
              getImageUrl(profile.avatar) ||
              `https://ui-avatars.com/api/?name=${profile.firstName}&size=80&background=6366f1&color=fff`
            }
            alt=""
            className="w-20 h-20 rounded-2xl object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{profile.firstName} {profile.lastName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Ro'yxatdan o'tgan: {formatDate(profile.createdAt)}
            </p>
            <div className="flex flex-wrap gap-4 mt-3">
              <div className="text-center">
                <p className="text-lg font-bold">{projects.length}</p>
                <p className="text-xs text-muted-foreground">Loyiha</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold">{reviewsReceived.length}</p>
                <p className="text-xs text-muted-foreground">Sharh</p>
              </div>
              {avgRating !== null && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span className="text-lg font-bold">{avgRating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">o'rtacha</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Review form for workers */}
      {!formDone && <WorkerReviewForm clientId={id!} onSuccess={() => { setFormDone(true); setActiveTab('reviews'); }} />}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl mb-5 mt-5">
        {[
          { key: 'projects', label: 'Loyihalar', icon: FolderOpen, count: projects.length },
          { key: 'reviews',  label: 'Sharhlar',  icon: Star,        count: reviewsReceived.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all ${
                active ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === 'projects' && (
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="card py-16 text-center text-muted-foreground">
              <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Loyihalar mavjud emas</p>
            </div>
          ) : (
            projects.map((p) => <ProjectCard key={p.id} project={p} />)
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="space-y-3">
          {reviewsReceived.length === 0 ? (
            <div className="card py-16 text-center text-muted-foreground">
              <Star className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>Hali sharh yo'q</p>
            </div>
          ) : (
            reviewsReceived.map((r) => <ReviewCard key={r.id} review={r} />)
          )}
        </div>
      )}
    </div>
  );
}
