import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Star, MapPin } from 'lucide-react';
import { Card, CardBody, Button, StatusBadge, Avatar, Spinner, Badge } from '@components/ui';
import { adminService } from '@services/admin.service';

interface PendingWorker {
  id: string;
  userId: string;
  category: string;
  bio?: string;
  experience: number;
  hourlyRate?: number;
  city?: string;
  rating: number;
  verificationStatus: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  };
}

const categoryLabels: Record<string, string> = {
  BUILDER: 'Qurilishchi',
  ELECTRICIAN: 'Elektrik',
  PLUMBER: 'Santexnik',
  PAINTER: "Bo'yoqchi",
  CARPENTER: 'Duradgor',
  INTERIOR_DESIGNER: 'Dizayner',
  ARCHITECT: 'Arxitektor',
  TILE_INSTALLER: 'Plitkachi',
  ROOFER: 'Tom ustasi',
  WELDER: 'Payvandchi',
  SMART_HOME: 'Aqlli uy',
  HVAC_SPECIALIST: 'HVAC mutaxassis',
  PLASTERER: 'Shtukaturchi',
  STUCCO_WORKER: 'Gipschi',
};

export function AdminWorkersPage() {
  const [workers, setWorkers] = useState<PendingWorker[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchPending = () => {
    setLoading(true);
    adminService
      .getPendingWorkers()
      .then((res) => setWorkers(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (workerId: string, status: 'VERIFIED' | 'REJECTED') => {
    setProcessingId(workerId);
    try {
      await adminService.verifyWorker(workerId, status);
      setWorkers((prev) => prev.filter((w) => w.id !== workerId));
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ustalar – Tasdiq kutayotganlar</h1>
        {!loading && <Badge variant="warning">{workers.length} ta kutmoqda</Badge>}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : workers.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center text-muted-foreground">
            Tasdiq kutayotgan usta yo'q
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {workers.map((worker) => (
            <Card key={worker.id}>
              <CardBody className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <Avatar
                    alt={`${worker.user.firstName} ${worker.user.lastName}`}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold">
                      {worker.user.firstName} {worker.user.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{worker.user.email}</p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      <Badge variant="info">{categoryLabels[worker.category] ?? worker.category}</Badge>
                      <StatusBadge status={worker.verificationStatus} />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Star className="w-3.5 h-3.5" />
                    <span>{worker.experience} yil tajriba</span>
                  </div>
                  {worker.city && (
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{worker.city}</span>
                    </div>
                  )}
                  {worker.hourlyRate && (
                    <div className="text-muted-foreground">
                      Soatbay: {worker.hourlyRate.toLocaleString()} so'm
                    </div>
                  )}
                  <div className="text-muted-foreground">
                    Ro'yxat: {new Date(worker.user.createdAt).toLocaleDateString('en-GB').split('/').reverse().join('.')}
                  </div>
                </div>

                {worker.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{worker.bio}</p>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="success"
                    size="sm"
                    fullWidth
                    loading={processingId === worker.id}
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => handleVerify(worker.id, 'VERIFIED')}
                  >
                    Tasdiqlash
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    fullWidth
                    loading={processingId === worker.id}
                    leftIcon={<XCircle className="w-4 h-4" />}
                    onClick={() => handleVerify(worker.id, 'REJECTED')}
                  >
                    Rad etish
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
