import { useEffect, useState } from 'react';
import { Users, FolderOpen, CheckCircle, DollarSign } from 'lucide-react';
import { Card, CardBody, Button, Spinner } from '@components/ui';
import { adminService } from '@services/admin.service';

interface AnalyticsRecord {
  id: string;
  date: string;
  metric: string;
  value: number;
}

type Period = 'week' | 'month' | 'year';

const periodLabels: Record<Period, string> = {
  week: 'Hafta',
  month: 'Oy',
  year: 'Yil',
};

const metricConfig: Record<string, { label: string; icon: React.ElementType; color: string; suffix: string }> = {
  new_users: { label: 'Yangi foydalanuvchilar', icon: Users, color: 'text-blue-600', suffix: 'ta' },
  new_projects: { label: 'Yangi loyihalar', icon: FolderOpen, color: 'text-violet-600', suffix: 'ta' },
  completed_projects: { label: 'Tugallangan loyihalar', icon: CheckCircle, color: 'text-emerald-600', suffix: 'ta' },
  revenue: { label: 'Daromad (komissiya)', icon: DollarSign, color: 'text-amber-600', suffix: "so'm" },
};

function groupByMetric(records: AnalyticsRecord[]) {
  return records.reduce(
    (acc, r) => {
      if (!acc[r.metric]) acc[r.metric] = [];
      acc[r.metric].push(r);
      return acc;
    },
    {} as Record<string, AnalyticsRecord[]>,
  );
}

function SimpleBarChart({ data }: { data: AnalyticsRecord[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data.map((d) => d.value), 1);
  const items = data.slice(0, 30);

  return (
    <div className="flex items-end gap-1 h-24 mt-3">
      {items.map((d) => (
        <div
          key={d.id}
          className="flex-1 bg-primary/20 hover:bg-primary/40 rounded-t transition-colors relative group"
          style={{ height: `${Math.max(4, (d.value / max) * 96)}px` }}
          title={`${new Date(d.date).toLocaleDateString('uz-UZ')}: ${d.value}`}
        >
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-foreground text-background text-xs px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {d.value}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AdminAnalyticsPage() {
  const [records, setRecords] = useState<AnalyticsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>('month');

  useEffect(() => {
    setLoading(true);
    adminService
      .getAnalytics(period)
      .then((res) => setRecords(res.data.data))
      .finally(() => setLoading(false));
  }, [period]);

  const grouped = groupByMetric(records);

  const totals = Object.entries(grouped).reduce(
    (acc, [metric, data]) => {
      acc[metric] = data.reduce((s, r) => s + r.value, 0);
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold">Analitika</h1>
        <div className="flex gap-2">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setPeriod(p)}
            >
              {periodLabels[p]}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      ) : records.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center text-muted-foreground">
            Analitika ma'lumotlari mavjud emas
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(metricConfig).map(([metric, config]) => {
            const data = grouped[metric] ?? [];
            const total = totals[metric] ?? 0;
            const Icon = config.icon;

            return (
              <Card key={metric}>
                <CardBody className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-surface-100 rounded-xl">
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{config.label}</p>
                      <p className="text-xl font-bold">
                        {metric === 'revenue'
                          ? `${total.toLocaleString()} ${config.suffix}`
                          : `${total} ${config.suffix}`}
                      </p>
                    </div>
                  </div>
                  <SimpleBarChart data={[...data].reverse()} />
                  <p className="text-xs text-muted-foreground mt-2 text-right">
                    {periodLabels[period]} davomida
                  </p>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
