import { useEffect, useState, useCallback } from 'react';
import { CheckCircle } from 'lucide-react';
import { Card, CardBody, Button, StatusBadge, Spinner, Badge, Select, Textarea } from '@components/ui';
import { adminService } from '@services/admin.service';

interface Dispute {
  id: string;
  projectId: string;
  reason: string;
  description: string;
  status: string;
  resolution?: string;
  createdAt: string;
  resolvedAt?: string;
  project: { id: string; title: string };
  openedBy: { id: string; firstName: string; lastName: string; email: string };
}

const statusOptions = [
  { value: '', label: 'Barchasi' },
  { value: 'OPEN', label: 'Ochiq' },
  { value: 'UNDER_REVIEW', label: "Ko'rib chiqilmoqda" },
  { value: 'RESOLVED', label: 'Hal qilindi' },
];

export function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [resolving, setResolving] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState<Record<string, string>>({});

  const fetchDisputes = useCallback(() => {
    setLoading(true);
    adminService
      .getAllDisputes(status || undefined)
      .then((res) => setDisputes(res.data.data))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    fetchDisputes();
  }, [fetchDisputes]);

  const handleResolve = async (disputeId: string) => {
    const resolution = resolutionText[disputeId];
    if (!resolution?.trim()) return;
    setResolving(disputeId);
    try {
      await adminService.resolveDispute(disputeId, resolution);
      setDisputes((prev) =>
        prev.map((d) => (d.id === disputeId ? { ...d, status: 'RESOLVED', resolution } : d)),
      );
      setResolutionText((prev) => ({ ...prev, [disputeId]: '' }));
    } finally {
      setResolving(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Nizolar</h1>
        {!loading && <Badge variant="secondary">{disputes.length} ta</Badge>}
      </div>

      <div className="flex">
        <Select
          options={statusOptions}
          value={status}
          onChange={(v) => setStatus(v as string)}
          className="w-52"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : disputes.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center text-muted-foreground">Nizolar topilmadi</CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <Card key={dispute.id}>
              <CardBody className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{dispute.project.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {dispute.openedBy.firstName} {dispute.openedBy.lastName} · {dispute.openedBy.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={dispute.status} />
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {new Date(dispute.createdAt).toLocaleDateString('en-GB').split('/').reverse().join('.')}
                    </span>
                  </div>
                </div>

                <div className="bg-surface-100 rounded-xl p-3 space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Sabab:</p>
                  <p className="text-sm">{dispute.reason}</p>
                  {dispute.description && (
                    <p className="text-sm text-muted-foreground">{dispute.description}</p>
                  )}
                </div>

                {dispute.status === 'RESOLVED' && dispute.resolution && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3">
                    <p className="text-xs font-medium text-emerald-700 mb-1">Hal qilish yo'li:</p>
                    <p className="text-sm text-emerald-800">{dispute.resolution}</p>
                  </div>
                )}

                {dispute.status !== 'RESOLVED' && (
                  <div className="space-y-2 pt-1">
                    <Textarea
                      placeholder="Hal qilish yo'lini yozing..."
                      value={resolutionText[dispute.id] ?? ''}
                      onChange={(e) =>
                        setResolutionText((prev) => ({ ...prev, [dispute.id]: e.target.value }))
                      }
                      rows={2}
                    />
                    <Button
                      variant="success"
                      size="sm"
                      loading={resolving === dispute.id}
                      disabled={!resolutionText[dispute.id]?.trim()}
                      leftIcon={<CheckCircle className="w-4 h-4" />}
                      onClick={() => handleResolve(dispute.id)}
                    >
                      Hal qilish
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
