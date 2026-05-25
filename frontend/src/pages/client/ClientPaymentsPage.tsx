import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { paymentsService } from '@services/payments.service';
import { projectsService } from '@services/projects.service';
import {
  DollarSign, Lock, CheckCircle, Clock, ExternalLink,
  CreditCard, TrendingUp, AlertCircle,
} from 'lucide-react';
import { Card, CardBody, Button, Badge, Spinner } from '@components/ui';
import toast from 'react-hot-toast';

function statusLabel(status: string) {
  switch (status) {
    case 'PENDING':   return 'Kutilmoqda';
    case 'COMPLETED': return 'Bajarildi';
    case 'REFUNDED':  return 'Qaytarildi';
    default:          return status;
  }
}

function statusVariant(status: string): 'warning' | 'success' | 'danger' | 'secondary' {
  if (status === 'COMPLETED') return 'success';
  if (status === 'REFUNDED')  return 'danger';
  if (status === 'PENDING')   return 'warning';
  return 'secondary';
}

export function ClientPaymentsPage() {
  const queryClient = useQueryClient();
  const [releasingId, setReleasingId] = useState<string | null>(null);
  const [initiatingId, setInitiatingId] = useState<string | null>(null);

  const { data: paymentsData, isLoading: paymentsLoading } = useQuery({
    queryKey: ['client-payments'],
    queryFn: () => paymentsService.getMy(),
  });

  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ['client-projects-completed'],
    queryFn: () => projectsService.getMy('COMPLETED'),
  });

  const payments: any[] = paymentsData?.data?.data ?? [];
  const completedProjects: any[] = projectsData?.data?.data ?? [];

  const paidProjectIds = new Set(payments.map((p: any) => p.projectId));
  const unpaidCompleted = completedProjects.filter((p) => !paidProjectIds.has(p.id) && p.finalPrice);

  const totalSpent   = payments.filter((p) => p.status === 'COMPLETED').reduce((s, p) => s + Number(p.amount), 0);
  const totalEscrow  = payments.filter((p) => p.status === 'PENDING').reduce((s, p) => s + Number(p.amount), 0);
  const totalReleased = payments.filter((p) => p.status === 'COMPLETED').reduce((s, p) => s + Number(p.netAmount), 0);

  const releaseMutation = useMutation({
    mutationFn: (paymentId: string) => paymentsService.release(paymentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-payments'] });
      queryClient.invalidateQueries({ queryKey: ['client-projects'] });
      toast.success('To\'lov ustaga yuborildi');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
    onSettled: () => setReleasingId(null),
  });

  const initiateMutation = useMutation({
    mutationFn: (projectId: string) => paymentsService.initiate(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['client-payments'] });
      queryClient.invalidateQueries({ queryKey: ['client-projects-completed'] });
      toast.success('To\'lov boshlatildi, pul escrowda saqlanmoqda');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
    onSettled: () => setInitiatingId(null),
  });

  const handleRelease = (paymentId: string) => {
    if (!window.confirm("Pulni ustaga chiqarishga rozimisiz?")) return;
    setReleasingId(paymentId);
    releaseMutation.mutate(paymentId);
  };

  const handleInitiate = (projectId: string) => {
    setInitiatingId(projectId);
    initiateMutation.mutate(projectId);
  };

  const isLoading = paymentsLoading || projectsLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">To'lovlar</h1>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <>
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Jami sarflangan', value: `${totalSpent.toLocaleString()} so'm`, icon: DollarSign, color: 'bg-emerald-500' },
              { label: 'Escrowda',         value: `${totalEscrow.toLocaleString()} so'm`, icon: Lock,       color: 'bg-amber-500'  },
              { label: 'Ustaga o\'tgan',   value: `${totalReleased.toLocaleString()} so'm`, icon: TrendingUp, color: 'bg-blue-500'  },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <Card key={s.label}>
                  <CardBody className="flex items-center gap-3 p-5">
                    <div className={`p-2.5 rounded-xl ${s.color} shrink-0`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">{s.label}</p>
                      <p className="font-bold">{s.value}</p>
                    </div>
                  </CardBody>
                </Card>
              );
            })}
          </div>

          {/* Unpaid completed projects */}
          {unpaidCompleted.length > 0 && (
            <Card>
              <CardBody className="p-0">
                <div className="p-5 border-b border-border flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                  <h2 className="font-semibold">To'lov kutilayotgan loyihalar</h2>
                </div>
                <div className="divide-y divide-border">
                  {unpaidCompleted.map((p) => (
                    <div key={p.id} className="flex items-center justify-between gap-4 px-5 py-4">
                      <div className="min-w-0">
                        <Link to={`/projects/${p.id}`} className="font-medium text-sm hover:text-primary transition-colors truncate block">
                          {p.title}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Bajarilgan narx: <span className="font-semibold text-foreground">{Number(p.finalPrice).toLocaleString()} so'm</span>
                        </p>
                      </div>
                      <Button
                        size="sm"
                        loading={initiatingId === p.id}
                        leftIcon={<CreditCard className="w-4 h-4" />}
                        onClick={() => handleInitiate(p.id)}
                      >
                        To'lov qilish
                      </Button>
                    </div>
                  ))}
                </div>
              </CardBody>
            </Card>
          )}

          {/* Payment history */}
          <Card>
            <CardBody className="p-0">
              <div className="p-5 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold">To'lovlar tarixi</h2>
                {payments.length > 0 && (
                  <span className="text-xs bg-surface-100 text-muted-foreground px-2 py-0.5 rounded-full">
                    {payments.length} ta
                  </span>
                )}
              </div>

              {payments.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">
                  <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Hali to'lovlar yo'q</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {payments.map((pay) => (
                    <div key={pay.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Link
                              to={`/projects/${pay.project?.id}`}
                              className="font-medium text-sm hover:text-primary transition-colors flex items-center gap-1"
                            >
                              {pay.project?.title}
                              <ExternalLink className="w-3 h-3 opacity-50" />
                            </Link>
                            <Badge variant={statusVariant(pay.status)}>
                              {statusLabel(pay.status)}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Jami: <span className="font-semibold text-foreground ml-0.5">{Number(pay.amount).toLocaleString()} so'm</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Komissiya: {Number(pay.commission).toLocaleString()} so'm
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              Ustaga: <span className="font-semibold text-emerald-600 ml-0.5">{Number(pay.netAmount).toLocaleString()} so'm</span>
                            </span>
                          </div>

                          {pay.escrowTransaction && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs">
                              {pay.escrowTransaction.status === 'HELD' ? (
                                <>
                                  <Lock className="w-3 h-3 text-amber-500" />
                                  <span className="text-amber-600">Escrowda saqlanmoqda</span>
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-3 h-3 text-emerald-500" />
                                  <span className="text-emerald-600">
                                    {pay.escrowTransaction.releasedAt
                                      ? `${new Date(pay.escrowTransaction.releasedAt).toLocaleDateString('uz-UZ')} da chiqarildi`
                                      : 'Chiqarildi'}
                                  </span>
                                </>
                              )}
                            </div>
                          )}

                          <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(pay.createdAt).toLocaleDateString('uz-UZ')}
                          </p>
                        </div>

                        {/* Release button */}
                        {pay.status === 'PENDING' && pay.escrowTransaction?.status === 'HELD' && (
                          <Button
                            variant="primary"
                            size="sm"
                            loading={releasingId === pay.id}
                            leftIcon={<CheckCircle className="w-4 h-4" />}
                            onClick={() => handleRelease(pay.id)}
                          >
                            Chiqarish
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </>
      )}
    </div>
  );
}
