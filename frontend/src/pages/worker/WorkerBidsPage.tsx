import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { bidsService } from '@services/bids.service';
import {
  MapPin, Calendar, DollarSign, Clock, Trash2,
  ChevronRight, FileText, MessageSquare, User,
} from 'lucide-react';
import { Card, CardBody, Button, Badge, StatusBadge, Spinner } from '@components/ui';
import toast from 'react-hot-toast';

const STATUS_TABS = [
  { value: '',           label: 'Barchasi' },
  { value: 'PENDING',    label: 'Kutilmoqda' },
  { value: 'ACCEPTED',   label: 'Qabul qilindi' },
  { value: 'REJECTED',   label: 'Rad etildi' },
  { value: 'WITHDRAWN',  label: 'Qaytarildi' },
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

export function WorkerBidsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('');
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['worker-bids'],
    queryFn: () => bidsService.getMy(),
  });

  const allBids: any[] = data?.data?.data ?? [];
  const bids = filter ? allBids.filter((b) => b.status === filter) : allBids;

  const counts = STATUS_TABS.reduce((acc, tab) => {
    acc[tab.value] = tab.value === '' ? allBids.length : allBids.filter((b) => b.status === tab.value).length;
    return acc;
  }, {} as Record<string, number>);

  const withdrawMutation = useMutation({
    mutationFn: (bidId: string) => bidsService.withdraw(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-bids'] });
      queryClient.invalidateQueries({ queryKey: ['worker-stats'] });
      toast.success('Taklif qaytarib olindi');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
    onSettled: () => setWithdrawingId(null),
  });

  const handleWithdraw = (bidId: string) => {
    setWithdrawingId(bidId);
    withdrawMutation.mutate(bidId);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Takliflarim</h1>
        <Badge variant="secondary">{allBids.length} ta</Badge>
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
      ) : bids.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center text-muted-foreground">
            <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Takliflar topilmadi</p>
            <Link to="/projects" className="btn-primary text-sm mt-4 inline-flex">
              Loyihalarni ko'rish
            </Link>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {bids.map((bid) => {
            const project = bid.project;
            return (
              <Card key={bid.id}>
                <CardBody className="p-0">
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/projects/${project?.id}`}
                          className="font-semibold hover:text-primary transition-colors flex items-center gap-1 group"
                        >
                          <span className="truncate">{project?.title}</span>
                          <ChevronRight className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {project?.category && (
                            <span className="text-xs text-muted-foreground">{project.category.nameUz}</span>
                          )}
                          {project?.urgency && (
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${urgencyColor[project.urgency]}`}>
                              {urgencyLabel[project.urgency]}
                            </span>
                          )}
                        </div>
                      </div>
                      <StatusBadge status={bid.status} />
                    </div>

                    {/* Project meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                      {project?.city && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {project.city}
                        </span>
                      )}
                      {(project?.budgetMin || project?.budgetMax) && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {project.budgetMin ? `${Number(project.budgetMin).toLocaleString()}` : ''}
                          {project.budgetMin && project.budgetMax ? ' – ' : ''}
                          {project.budgetMax ? `${Number(project.budgetMax).toLocaleString()} so'm` : ''}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(bid.createdAt).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>

                    {/* Client info (ACCEPTED bids) */}
                    {bid.status === 'ACCEPTED' && project?.client && (
                      <Link
                        to={`/clients/${project.client.id}`}
                        className="mt-3 flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors w-fit"
                      >
                        <img
                          src={
                            project.client.avatar ||
                            `https://ui-avatars.com/api/?name=${project.client.firstName}&size=28&background=6366f1&color=fff`
                          }
                          alt=""
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <User className="w-3 h-3" />
                        {project.client.firstName} {project.client.lastName}
                        <span className="text-primary underline underline-offset-2">Profilni ko'rish</span>
                      </Link>
                    )}
                  </div>

                  {/* Bid details */}
                  <div className="border-t border-border px-5 py-3 bg-surface-50 rounded-b-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Mening taklifim</p>
                        <p className="font-bold text-primary">{Number(bid.amount).toLocaleString()} so'm</p>
                      </div>
                      {bid.duration && (
                        <div>
                          <p className="text-xs text-muted-foreground">Muddat</p>
                          <p className="font-medium text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {bid.duration} {bid.durationUnit ?? 'kun'}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {bid.status === 'ACCEPTED' && project?.client && (
                        <Link
                          to={`/clients/${project.client.id}`}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Baholash
                        </Link>
                      )}
                      {bid.status === 'PENDING' && (
                        <Button
                          variant="danger"
                          size="xs"
                          loading={withdrawingId === bid.id}
                          leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                          onClick={() => handleWithdraw(bid.id)}
                        >
                          Qaytarish
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Bid message */}
                  {bid.message && (
                    <div className="px-5 pb-4">
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{bid.message}</p>
                    </div>
                  )}
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
