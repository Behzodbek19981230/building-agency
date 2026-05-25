import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { projectsService } from '@services/projects.service';
import { Search, Filter, MapPin, Clock, DollarSign, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { getImageUrl } from '@/utils/image';

const urgencyLabels: Record<string, { label: string; color: string }> = {
  LOW: { label: 'Past', color: 'bg-gray-100 text-gray-600' },
  MEDIUM: { label: "O'rta", color: 'bg-blue-100 text-blue-600' },
  HIGH: { label: 'Yuqori', color: 'bg-amber-100 text-amber-600' },
  URGENT: { label: 'Shoshilinch', color: 'bg-red-100 text-red-600' },
};

export function ProjectsListPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['projects', search, page],
    queryFn: () => projectsService.getAll({ search: search || undefined, page, limit: 12 }),
  });

  const projects = data?.data?.data || [];
  const meta = data?.data?.meta;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Loyihalar</h1>
      <p className="text-muted-foreground mb-8">Ochiq loyihalarni ko'ring va taklif bering</p>

      {/* Search */}
      <div className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Loyiha qidirish..."
            className="input w-full pl-9"
          />
        </div>
        <button className="btn-outline gap-2"><Filter className="w-4 h-4" /> Filter</button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Loyihalar topilmadi</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p: any) => {
            const u = urgencyLabels[p.urgency] || { label: p.urgency, color: 'bg-gray-100 text-gray-600' };
            return (
              <Link key={p.id} to={`/projects/${p.id}`} className="card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all group">
                {p.images?.[0] ? (
                  <img src={getImageUrl(p.images[0].url)} alt={p.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl">🏗️</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm line-clamp-2 flex-1">{p.title}</h3>
                    <span className={clsx('badge text-xs flex-shrink-0', u.color)}>{u.label}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{p.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {p.city || 'Noma\'lum'}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {p.budgetMin ? `${(p.budgetMin/1000000).toFixed(1)}M` : '—'}
                      {p.budgetMax ? ` - ${(p.budgetMax/1000000).toFixed(1)}M` : ''}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {p._count?.bids || 0} taklif
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={clsx('w-9 h-9 rounded-lg text-sm font-medium transition-colors', p === page ? 'bg-primary text-white' : 'border hover:bg-muted')}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
