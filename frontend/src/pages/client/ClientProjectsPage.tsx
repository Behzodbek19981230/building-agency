import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsService } from '@services/projects.service';
import {
  Plus, MapPin, Calendar, DollarSign, Users,
  CheckCircle, XCircle, ChevronRight, Briefcase,
} from 'lucide-react';
import { Card, CardBody, Button, Badge, StatusBadge, Spinner, ConfirmModal } from '@components/ui';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/utils/image';

const STATUS_TABS = [
  { value: '',            label: 'Barchasi' },
  { value: 'OPEN',        label: 'Ochiq' },
  { value: 'IN_PROGRESS', label: 'Jarayonda' },
  { value: 'COMPLETED',   label: 'Bajarildi' },
  { value: 'CANCELLED',   label: 'Bekor qilindi' },
];

const urgencyLabel: Record<string, string> = {
  LOW: 'Past', MEDIUM: "O'rta", HIGH: 'Yuqori', URGENT: 'Shoshilinch',
};
const urgencyColor: Record<string, string> = {
  LOW: 'bg-gray-100 text-gray-600',
  MEDIUM: 'bg-blue-100 text-blue-700',
  HIGH: 'bg-amber-100 text-amber-700',
  URGENT: 'bg-red-100 text-red-700',
};

export function ClientProjectsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    variant: 'danger' | 'success' | 'default';
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['client-projects'],
    queryFn: () => projectsService.getMy(),
  });

  const allProjects: any[] = data?.data?.data ?? [];
  const projects = filter ? allProjects.filter((p) => p.status === filter) : allProjects;

  const counts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab.value] = tab.value === '' ? allProjects.length : allProjects.filter((p) => p.status === tab.value).length;
    return acc;
  }, {} as Record<string, number>);

  const completeMutation = useMutation({
    mutationFn: (id: string) => projectsService.complete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-projects'] });
      toast.success('Loyiha bajarildi deb belgilandi');
      setConfirmModal(null);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
    onSettled: () => setActionId(null),
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => projectsService.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-projects'] });
      toast.success('Loyiha bekor qilindi');
      setConfirmModal(null);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
    onSettled: () => setActionId(null),
  });

  const handleComplete = (id: string) => {
    setConfirmModal({
      open: true,
      title: 'Loyihani bajarildi deb belgilash',
      description: 'Bu amalni qaytarib bo\'lmaydi. Loyiha tugallangan deb belgilanadi.',
      variant: 'success',
      confirmLabel: 'Ha, bajarildi',
      onConfirm: () => {
        setActionId(id);
        completeMutation.mutate(id);
      },
    });
  };

  const handleCancel = (id: string) => {
    setConfirmModal({
      open: true,
      title: 'Loyihani bekor qilish',
      description: 'Loyihani bekor qilmoqchimisiz? Bu amalni qaytarib bo\'lmaydi.',
      variant: 'danger',
      confirmLabel: 'Ha, bekor qilish',
      onConfirm: () => {
        setActionId(id);
        cancelMutation.mutate(id);
      },
    });
  };

  return (
    <>
    {confirmModal && (
      <ConfirmModal
        open={confirmModal.open}
        title={confirmModal.title}
        description={confirmModal.description}
        variant={confirmModal.variant}
        confirmLabel={confirmModal.confirmLabel}
        loading={completeMutation.isPending || cancelMutation.isPending}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal(null)}
      />
    )}
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Loyihalarim</h1>
        <Link to="/projects/create">
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Yangi loyiha
          </Button>
        </Link>
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 bg-surface-100 rounded-2xl overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === tab.value
                ? 'bg-background shadow text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {counts[tab.value] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === tab.value ? 'bg-primary/10 text-primary' : 'bg-muted'
              }`}>
                {counts[tab.value]}
              </span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : projects.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center text-muted-foreground">
            <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Loyihalar topilmadi</p>
            <Link to="/projects/create">
              <Button variant="outline" size="sm" className="mt-4" leftIcon={<Plus className="w-4 h-4" />}>
                Loyiha yaratish
              </Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {projects.map((p) => (
            <Card key={p.id} hover>
              <CardBody className="p-0">
                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/projects/${p.id}`}
                        className="font-semibold hover:text-primary transition-colors flex items-center gap-1 group"
                      >
                        <span className="truncate">{p.title}</span>
                        <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {p.category && (
                          <span className="text-xs text-muted-foreground">{p.category.nameUz}</span>
                        )}
                        {p.urgency && (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgencyColor[p.urgency]}`}>
                            {urgencyLabel[p.urgency]}
                          </span>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={p.status} />
                  </div>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                    {p.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {p.city}
                      </span>
                    )}
                    {(p.budgetMin || p.budgetMax) && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {p.budgetMin ? Number(p.budgetMin).toLocaleString() : ''}
                        {p.budgetMin && p.budgetMax ? ' – ' : ''}
                        {p.budgetMax ? `${Number(p.budgetMax).toLocaleString()} so'm` : ''}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(p.createdAt).toLocaleDateString('en-GB').split('/').reverse().join('.')}
                    </span>
                    {p._count?.bids !== undefined && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" /> {p._count.bids} ta taklif
                      </span>
                    )}
                  </div>

                  {/* Assigned worker */}
                  {p.assignedWorker && (
                    <Link
                      to={`/workers/${p.assignedWorker.id}`}
                      className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors w-fit"
                    >
                      <img
                        src={
                          getImageUrl(p.assignedWorker.avatar) ||
                          `https://ui-avatars.com/api/?name=${p.assignedWorker.firstName}&size=24&background=6366f1&color=fff`
                        }
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      {p.assignedWorker.firstName} {p.assignedWorker.lastName}
                      <span className="text-primary underline underline-offset-2">Usta profili</span>
                    </Link>
                  )}
                </div>

                {/* Actions */}
                <div className="border-t border-border px-5 py-3 bg-surface-50 rounded-b-2xl flex items-center justify-between gap-3">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    Batafsil ko'rish
                  </Link>
                  <div className="flex items-center gap-2">
                    {p.status === 'OPEN' && (
                      <Button
                        variant="danger"
                        size="xs"
                        loading={actionId === p.id && cancelMutation.isPending}
                        leftIcon={<XCircle className="w-3.5 h-3.5" />}
                        onClick={() => handleCancel(p.id)}
                      >
                        Bekor qilish
                      </Button>
                    )}
                    {p.status === 'IN_PROGRESS' && (
                      <Button
                        variant="primary"
                        size="xs"
                        loading={actionId === p.id && completeMutation.isPending}
                        leftIcon={<CheckCircle className="w-3.5 h-3.5" />}
                        onClick={() => handleComplete(p.id)}
                      >
                        Bajarildi
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
