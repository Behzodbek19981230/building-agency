import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { workersService } from '@services/workers.service';
import { Search, Star, MapPin, CheckCircle, Loader2 } from 'lucide-react';

const categoryLabels: Record<string, string> = {
  BUILDER: 'Quruvchi', ELECTRICIAN: 'Elektrik', PLUMBER: 'Santexnik',
  PAINTER: 'Molyar', CARPENTER: 'Duradgor', INTERIOR_DESIGNER: 'Interyer Dizayner',
  ARCHITECT: 'Arxitektor', TILE_INSTALLER: 'Plitka ustasi', ROOFER: 'Tom ustasi',
  WELDER: 'Payvandchi', SMART_HOME: 'Smart Home', HVAC_SPECIALIST: 'HVAC Mutaxassisi',
  PLASTERER: 'Suvoqchi', STUCCO_WORKER: 'Shtukaturchi',
};

export function WorkersListPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['workers', search, category, page],
    queryFn: () => workersService.getAll({ search: search || undefined, category: category || undefined, page, limit: 12 }),
  });

  const workers = data?.data?.data || [];
  const meta = data?.data?.meta;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Ustalar</h1>
      <p className="text-muted-foreground mb-8">Tasdiqlangan va reytinglangan mutaxassislar</p>

      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Usta qidirish..." className="input w-full pl-9" />
        </div>
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="input">
          <option value="">Barcha xizmatlar</option>
          {Object.entries(categoryLabels).map(([val, label]) => (
            <option key={val} value={val}>{label}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
      ) : workers.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Ustalar topilmadi</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {workers.map((w: any) => (
            <Link key={w.id} to={`/workers/${w.id}`} className="card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <img
                    src={w.user?.avatar || `https://ui-avatars.com/api/?name=${w.user?.firstName}&background=3b82f6&color=fff`}
                    alt="" className="w-12 h-12 rounded-full object-cover"
                  />
                  {w.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{w.user?.firstName} {w.user?.lastName}</div>
                  <div className="text-xs text-muted-foreground">{categoryLabels[w.category] || w.category}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(w.rating) ? 'text-amber-400 fill-current' : 'text-gray-200'}`} />
                ))}
                <span className="text-xs text-muted-foreground ml-1">{w.rating?.toFixed(1)} ({w.reviewCount})</span>
              </div>

              {w.bio && <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{w.bio}</p>}

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {w.city || '—'}
                </div>
                <div>{w.completedProjects} loyiha</div>
              </div>

              {w.hourlyRate && (
                <div className="mt-3 pt-3 border-t text-xs">
                  <span className="text-muted-foreground">Soatlik:</span>{' '}
                  <span className="font-semibold text-primary">{Number(w.hourlyRate).toLocaleString()} so'm</span>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: Math.min(meta.totalPages, 10) }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-primary text-white' : 'border hover:bg-muted'}`}>{p}</button>
          ))}
        </div>
      )}
    </div>
  );
}
