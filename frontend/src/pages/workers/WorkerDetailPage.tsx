import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { workersService } from '@services/workers.service';
import { reviewsService } from '@services/reviews.service';
import { projectsService } from '@services/projects.service';
import { useAuthStore } from '@store/authStore';
import { Select } from '@components/ui';
import {
  Star, MapPin, CheckCircle, Briefcase, Award, Loader2, ArrowLeft,
  MessageSquare, Calendar, Clock, AlertCircle, FolderOpen,
  ImagePlus, X, Send, ChevronDown, ChevronUp,
} from 'lucide-react';

/* ─── helpers ─────────────────────────────────────── */
const urgencyConfig: Record<string, { label: string; color: string }> = {
  LOW:    { label: 'Past',          color: 'bg-gray-100 text-gray-600' },
  MEDIUM: { label: "O'rta",        color: 'bg-blue-100 text-blue-700' },
  HIGH:   { label: 'Yuqori',       color: 'bg-amber-100 text-amber-700' },
  URGENT: { label: 'Shoshilinch',  color: 'bg-red-100 text-red-700' },
};

function formatDate(d?: string) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' });
}
function daysLeft(d?: string) {
  if (!d) return null;
  return Math.ceil((new Date(d).getTime() - Date.now()) / 86_400_000);
}

/* ─── Star rating picker ───────────────────────────── */
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

/* ─── Review card ─────────────────────────────────── */
function ReviewCard({ review }: { review: any }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.comment && review.comment.length > 160;
  return (
    <div className="border border-border rounded-2xl p-4 space-y-3 bg-surface-50">
      <div className="flex items-start gap-3">
        <Link to={`/clients/${review.reviewer.id}`}>
          <img
            src={
              review.reviewer.avatar ||
              `https://ui-avatars.com/api/?name=${review.reviewer.firstName}&size=40&background=6366f1&color=fff`
            }
            className="w-10 h-10 rounded-full object-cover hover:opacity-80 transition-opacity"
            alt=""
          />
        </Link>
        <div className="flex-1 min-w-0">
          <Link
            to={`/clients/${review.reviewer.id}`}
            className="font-semibold text-sm hover:underline"
          >
            {review.reviewer.firstName} {review.reviewer.lastName}
          </Link>
          {review.project && (
            <p className="text-xs text-muted-foreground truncate">
              Loyiha: {review.project.title}
            </p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star
                key={n}
                className={`w-3.5 h-3.5 ${
                  n <= review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
        </div>
      </div>

      {review.comment && (
        <div>
          <p className={`text-sm text-muted-foreground leading-relaxed ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
            {review.comment}
          </p>
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-primary mt-1 flex items-center gap-0.5"
            >
              {expanded ? <><ChevronUp className="w-3 h-3" /> Yopish</> : <><ChevronDown className="w-3 h-3" /> Ko'proq</>}
            </button>
          )}
        </div>
      )}

      {review.images?.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {review.images.map((img: string, i: number) => (
            <a key={i} href={img} target="_blank" rel="noopener noreferrer">
              <img
                src={img}
                alt=""
                className="h-20 w-20 object-cover rounded-xl border border-border hover:opacity-80 transition-opacity"
              />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Review form ─────────────────────────────────── */
function ReviewForm({
  workerId,
  workerUserId,
  onSuccess,
}: {
  workerId: string;
  workerUserId: string;
  onSuccess: () => void;
}) {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);
  const [error, setError] = useState('');

  // Fetch client's completed projects with this worker
  const { data: myProjects } = useQuery({
    queryKey: ['my-projects-completed'],
    queryFn: () => projectsService.getMy('COMPLETED'),
    enabled: !!user && user.role === 'CLIENT',
  });

  const completedWithWorker = (myProjects?.data?.data ?? []).filter(
    (p: any) => p.assignedWorkerId === workerUserId,
  );

  const [selectedProjectId, setSelectedProjectId] = useState('');

  const mutation = useMutation({
    mutationFn: (fd: FormData) =>
      reviewsService.create(selectedProjectId, workerUserId, fd),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-reviews', workerId] });
      queryClient.invalidateQueries({ queryKey: ['worker', workerId] });
      setRating(0);
      setComment('');
      setPreviews([]);
      setSelectedProjectId('');
      setError('');
      onSuccess();
    },
    onError: (e: any) => {
      setError(e?.response?.data?.message ?? 'Xatolik yuz berdi');
    },
  });

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const newItems = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 5 - previews.length)
      .map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews((p) => [...p, ...newItems]);
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

  if (!user || user.role !== 'CLIENT') return null;
  if (completedWithWorker.length === 0) return null;

  return (
    <div className="card p-5 space-y-4">
      <h2 className="font-semibold flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        Baholash va sharh
      </h2>

      {/* Project select */}
      <Select
        label="Loyiha tanlang"
        placeholder="— Tanlang —"
        options={completedWithWorker.map((p: any) => ({ value: p.id, label: p.title }))}
        value={selectedProjectId || null}
        onChange={(v) => setSelectedProjectId(v as string ?? '')}
      />

      {/* Stars */}
      <div>
        <label className="text-xs text-muted-foreground mb-2 block">Reyting</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      {/* Comment */}
      <div>
        <label className="text-xs text-muted-foreground mb-1 block">Izoh (ixtiyoriy)</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="Usta haqida fikringizni yozing..."
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-surface-50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Image upload */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => addImages(e.target.files)}
        />
        {previews.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {previews.map((p, i) => (
              <div key={i} className="relative">
                <img
                  src={p.url}
                  alt=""
                  className="h-16 w-16 object-cover rounded-xl border border-border"
                />
                <button
                  onClick={() => removeImage(i)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center shadow"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        {previews.length < 5 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-xl px-4 py-2 transition-colors hover:bg-surface-100"
          >
            <ImagePlus className="w-4 h-4" />
            Rasm qo'shish ({previews.length}/5)
          </button>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        onClick={submit}
        disabled={mutation.isPending}
        className="btn-primary w-full gap-2 flex items-center justify-center"
      >
        {mutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Sharh yuborish
      </button>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────── */
export function WorkerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const [reviewsPage, setReviewsPage] = useState(1);
  const [showForm, setShowForm] = useState(true);
  const LIMIT = 5;
  const reviewsRef = useRef<HTMLDivElement>(null);

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const { data, isLoading } = useQuery({
    queryKey: ['worker', id],
    queryFn: () => workersService.getOne(id!),
  });

  const { data: reviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ['worker-reviews', id, reviewsPage],
    queryFn: () => reviewsService.getWorkerReviews(id!, { page: reviewsPage, limit: LIMIT }),
    enabled: !!id,
  });

  const worker = data?.data?.data;
  const reviews: any[] = reviewsData?.data?.data ?? [];
  const reviewsMeta = reviewsData?.data?.meta;
  const activeProjects: any[] = worker?.activeProjects ?? [];

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  if (!worker)
    return <div className="text-center py-20 text-muted-foreground">Usta topilmadi</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/workers"
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 w-fit"
      >
        <ArrowLeft className="w-4 h-4" /> Ustalarga qaytish
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* ── Left column ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Profile header */}
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="relative">
                <img
                  src={
                    worker.user?.avatar ||
                    `https://ui-avatars.com/api/?name=${worker.user?.firstName}&size=80&background=3b82f6&color=fff`
                  }
                  alt=""
                  className="w-20 h-20 rounded-2xl object-cover"
                />
                {worker.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-bold">
                  {worker.user?.firstName} {worker.user?.lastName}
                </h1>
                <p className="text-muted-foreground">{worker.category}</p>
                <div className="flex items-center gap-3 mt-2">
                  <button
                    onClick={scrollToReviews}
                    className="flex items-center gap-1 group"
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(worker.rating)
                            ? 'text-amber-400 fill-current'
                            : 'text-gray-200'
                        }`}
                      />
                    ))}
                    <span className="text-sm ml-1 text-primary underline underline-offset-2 group-hover:text-primary/80 transition-colors">
                      {worker.rating?.toFixed(1)} ({worker.reviewCount} sharh)
                    </span>
                  </button>
                  {worker.city && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" /> {worker.city}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {worker.bio && (
              <p className="mt-4 text-muted-foreground leading-relaxed">{worker.bio}</p>
            )}

            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t">
              {[
                { icon: Briefcase, label: 'Bajarilgan', value: worker.completedProjects },
                { icon: Award,     label: 'Tajriba',    value: `${worker.experience} yil` },
                { icon: Star,      label: 'Reyting',    value: worker.rating?.toFixed(1) },
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

          {/* Active projects */}
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-4">
              <FolderOpen className="w-5 h-5 text-primary" />
              <h2 className="font-semibold">Hozirgi loyihalar</h2>
              {activeProjects.length > 0 && (
                <span className="ml-auto text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                  {activeProjects.length} ta faol
                </span>
              )}
            </div>

            {activeProjects.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <FolderOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-sm">Hozirda faol loyiha yo'q</p>
                <p className="text-xs mt-1 text-emerald-600 font-medium">
                  Usta bo'sh — loyiha taklif qilishingiz mumkin
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activeProjects.map((project) => {
                  const days = daysLeft(project.endDate);
                  const urgency = urgencyConfig[project.urgency] ?? urgencyConfig.MEDIUM;
                  return (
                    <div
                      key={project.id}
                      className="border border-border rounded-2xl p-4 space-y-3 bg-surface-50"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold truncate">{project.title}</p>
                          {project.category && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {project.category.nameUz}
                            </p>
                          )}
                        </div>
                        <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${urgency.color}`}>
                          {urgency.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {project.startDate && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>Boshlangan: {formatDate(project.startDate)}</span>
                          </div>
                        )}
                        {project.endDate && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 shrink-0" />
                            <span>Tugaydi: {formatDate(project.endDate)}</span>
                          </div>
                        )}
                        {project.city && (
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span>{project.city}</span>
                          </div>
                        )}
                      </div>
                      {project.endDate && days !== null && (
                        <div
                          className={`flex items-center gap-2 text-sm font-medium rounded-xl px-3 py-2 ${
                            days < 0 ? 'bg-red-50 text-red-700' :
                            days <= 3 ? 'bg-amber-50 text-amber-700' :
                            'bg-emerald-50 text-emerald-700'
                          }`}
                        >
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {days < 0
                            ? `Muddat ${Math.abs(days)} kun o'tib ketgan`
                            : days === 0
                            ? 'Bugun tugaydi'
                            : `${days} kun qoldi`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Skills */}
          {worker.skills?.length > 0 && (
            <div className="card p-5">
              <h2 className="font-semibold mb-3">Ko'nikmalar</h2>
              <div className="flex flex-wrap gap-2">
                {worker.skills.map((s: any) => (
                  <span
                    key={s.id}
                    className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                  >
                    {s.name}
                  </span>
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
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="w-full h-32 bg-muted flex items-center justify-center text-3xl">
                        🏗️
                      </div>
                    )}
                    <div className="p-2">
                      <div className="text-sm font-medium truncate">{p.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review form */}
          {showForm && (
            <ReviewForm
              workerId={id!}
              workerUserId={worker.userId}
              onSuccess={() => setShowForm(false)}
            />
          )}

          {/* Reviews list */}
          <div ref={reviewsRef} className="card p-5 scroll-mt-6">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <h2 className="font-semibold">Sharhlar</h2>
              {reviewsMeta && (
                <span className="ml-auto text-xs bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full">
                  {reviewsMeta.total} ta
                </span>
              )}
            </div>

            {loadingReviews ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : reviews.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Hali sharh yo'q</p>
            ) : (
              <div className="space-y-3">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            )}

            {reviewsMeta && reviewsMeta.total > LIMIT && (
              <div className="flex justify-center gap-2 mt-4">
                <button
                  disabled={reviewsPage === 1}
                  onClick={() => setReviewsPage((p) => p - 1)}
                  className="btn-outline text-sm px-4 py-1.5 disabled:opacity-40"
                >
                  Oldingi
                </button>
                <span className="flex items-center text-sm text-muted-foreground px-3">
                  {reviewsPage} / {Math.ceil(reviewsMeta.total / LIMIT)}
                </span>
                <button
                  disabled={reviewsPage >= Math.ceil(reviewsMeta.total / LIMIT)}
                  onClick={() => setReviewsPage((p) => p + 1)}
                  className="btn-outline text-sm px-4 py-1.5 disabled:opacity-40"
                >
                  Keyingi
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          {/* Availability */}
          <div
            className={`card p-4 flex items-center gap-3 ${
              activeProjects.length === 0
                ? 'border-emerald-200 bg-emerald-50'
                : 'border-amber-200 bg-amber-50'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full shrink-0 animate-pulse ${
                activeProjects.length === 0 ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <div>
              <p className={`text-sm font-semibold ${activeProjects.length === 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {activeProjects.length === 0
                  ? 'Loyiha qabul qilishga tayyor'
                  : 'Faol loyihada band'}
              </p>
              {activeProjects.length > 0 && activeProjects[0].endDate && (
                <p className="text-xs text-amber-600 mt-0.5">
                  Bo'shaydi: {formatDate(activeProjects[0].endDate)}
                </p>
              )}
            </div>
          </div>

          {/* Rates & actions */}
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
