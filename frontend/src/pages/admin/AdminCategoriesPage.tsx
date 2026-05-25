import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Plus, Pencil, ToggleLeft, ToggleRight, X, Eye, Trash2 } from 'lucide-react';
import { Button, Spinner, ConfirmModal } from '@components/ui';
import { adminService } from '@services/admin.service';
import toast from 'react-hot-toast';

interface Category {
  id: string;
  slug: string;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  nameCyr: string | null;
  icon: string | null;
  description: string | null;
  subServices: string[] | null;
  order: number;
  isActive: boolean;
  _count: { projects: number };
}

const SLUG_OPTIONS = [
  'BUILDER', 'ELECTRICIAN', 'PLUMBER', 'PAINTER', 'CARPENTER',
  'INTERIOR_DESIGNER', 'ARCHITECT', 'TILE_INSTALLER', 'ROOFER',
  'WELDER', 'SMART_HOME', 'HVAC_SPECIALIST', 'PLASTERER', 'STUCCO_WORKER',
];

const emptyForm = {
  slug: '',
  nameUz: '',
  nameRu: '',
  nameEn: '',
  nameCyr: '',
  icon: '',
  description: '',
  order: 0,
  isActive: true,
  subServices: [] as string[],
};

function isSvg(str: string) {
  return str.trim().startsWith('<svg');
}

function IconPreview({ icon, size = 28 }: { icon: string; size?: number }) {
  if (!icon) return <span className="text-muted-foreground text-xs">—</span>;
  if (isSvg(icon)) {
    return (
      <span
        style={{ width: size, height: size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.85 }}>{icon}</span>;
}

export function AdminCategoriesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [iconTab, setIconTab] = useState<'emoji' | 'svg'>('emoji');
  const [toggleConfirm, setToggleConfirm] = useState<Category | null>(null);
  const [newSub, setNewSub] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => adminService.getCategories(),
  });
  const categories: Category[] = data?.data?.data ?? [];

  const saveMutation = useMutation({
    mutationFn: (payload: typeof emptyForm) =>
      editing
        ? adminService.updateCategory(editing.id, payload)
        : adminService.createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(editing ? 'Yangilandi' : 'Yaratildi');
      closeModal();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
  });

  const toggleMutation = useMutation({
    mutationFn: (cat: Category) =>
      adminService.updateCategory(cat.id, { isActive: !cat.isActive }),
    onSuccess: (_, cat) => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast.success(cat.isActive ? 'Nofaol qilindi' : 'Faollashtirildi');
      setToggleConfirm(null);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
  });

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyForm });
    setIconTab('emoji');
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditing(cat);
    setForm({
      slug: cat.slug,
      nameUz: cat.nameUz,
      nameRu: cat.nameRu,
      nameEn: cat.nameEn,
      nameCyr: cat.nameCyr ?? '',
      icon: cat.icon ?? '',
      description: cat.description ?? '',
      order: cat.order,
      isActive: cat.isActive,
      subServices: cat.subServices ?? [],
    });
    setIconTab(isSvg(cat.icon ?? '') ? 'svg' : 'emoji');
    setNewSub('');
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditing(null);
  }

  const field = (key: keyof typeof form) => (
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }))
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Xizmatlar (Kategoriyalar)</h1>
        <Button leftIcon={<Plus className="w-4 h-4" />} size="sm" onClick={openCreate}>
          Yangi qo'shish
        </Button>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-100 text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3 font-medium w-10">#</th>
                  <th className="text-left px-4 py-3 font-medium w-14">Icon</th>
                  <th className="text-left px-4 py-3 font-medium">UZ (lotin)</th>
                  <th className="text-left px-4 py-3 font-medium">UZ (kril)</th>
                  <th className="text-left px-4 py-3 font-medium">RU</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Slug</th>
                  <th className="text-center px-4 py-3 font-medium hidden md:table-cell">Loyihalar</th>
                  <th className="text-center px-4 py-3 font-medium">Holat</th>
                  <th className="text-right px-4 py-3 font-medium">Amal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className={`hover:bg-surface-50 transition-colors ${!cat.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 text-muted-foreground">{cat.order}</td>
                    <td className="px-4 py-3">
                      <IconPreview icon={cat.icon ?? ''} size={26} />
                    </td>
                    <td className="px-4 py-3 font-medium">{cat.nameUz}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cat.nameCyr ?? '—'}</td>
                    <td className="px-4 py-3 text-muted-foreground">{cat.nameRu}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <code className="text-xs bg-surface-100 px-1.5 py-0.5 rounded">{cat.slug}</code>
                    </td>
                    <td className="px-4 py-3 text-center hidden md:table-cell text-muted-foreground">
                      {cat._count.projects}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                        cat.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {cat.isActive ? 'Faol' : 'Nofaol'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-surface-100 text-muted-foreground hover:text-foreground transition-colors"
                          title="Tahrirlash"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setToggleConfirm(cat)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            cat.isActive
                              ? 'hover:bg-red-50 text-emerald-600 hover:text-red-500'
                              : 'hover:bg-emerald-50 text-gray-400 hover:text-emerald-600'
                          }`}
                          title={cat.isActive ? 'Nofaol qilish' : 'Faollashtirish'}
                        >
                          {cat.isActive
                            ? <ToggleRight className="w-5 h-5" />
                            : <ToggleLeft className="w-5 h-5" />
                          }
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toggle confirm */}
      {toggleConfirm && (
        <ConfirmModal
          open
          title={toggleConfirm.isActive ? 'Nofaol qilish' : 'Faollashtirish'}
          description={`"${toggleConfirm.nameUz}" kategoriyasini ${toggleConfirm.isActive ? 'nofaol' : 'faol'} qilmoqchimisiz?`}
          variant={toggleConfirm.isActive ? 'danger' : 'success'}
          confirmLabel={toggleConfirm.isActive ? 'Nofaol qilish' : 'Faollashtirish'}
          loading={toggleMutation.isPending}
          onConfirm={() => toggleMutation.mutate(toggleConfirm)}
          onClose={() => setToggleConfirm(null)}
        />
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-background rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal header */}
            <div className="sticky top-0 bg-background flex items-center justify-between px-6 py-4 border-b border-border z-10">
              <h2 className="font-semibold text-base">
                {editing ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya'}
              </h2>
              <button onClick={closeModal} className="p-2 rounded-xl hover:bg-surface-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Slug (only for create) */}
              {!editing && (
                <div>
                  <label className="block text-sm font-medium mb-1.5">Slug <span className="text-destructive">*</span></label>
                  <select
                    value={form.slug}
                    onChange={field('slug')}
                    className="w-full input"
                  >
                    <option value="">Tanlang...</option>
                    {SLUG_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Names grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    UZ (lotin) <span className="text-destructive">*</span>
                  </label>
                  <input
                    className="input w-full"
                    placeholder="Quruvchi"
                    value={form.nameUz}
                    onChange={field('nameUz')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    UZ (kril)
                  </label>
                  <input
                    className="input w-full"
                    placeholder="Қурувчи"
                    value={form.nameCyr}
                    onChange={field('nameCyr')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    RU <span className="text-destructive">*</span>
                  </label>
                  <input
                    className="input w-full"
                    placeholder="Строитель"
                    value={form.nameRu}
                    onChange={field('nameRu')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">EN</label>
                  <input
                    className="input w-full"
                    placeholder="Builder"
                    value={form.nameEn}
                    onChange={field('nameEn')}
                  />
                </div>
              </div>

              {/* Icon */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Icon</label>
                <div className="flex gap-2 mb-2">
                  {(['emoji', 'svg'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setIconTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        iconTab === tab
                          ? 'bg-primary text-white'
                          : 'bg-surface-100 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab === 'emoji' ? 'Emoji' : 'SVG kod'}
                    </button>
                  ))}
                </div>

                {iconTab === 'emoji' ? (
                  <input
                    className="input w-full"
                    placeholder="🏗️"
                    value={form.icon}
                    onChange={field('icon')}
                  />
                ) : (
                  <textarea
                    className="input w-full font-mono text-xs"
                    rows={5}
                    placeholder={'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">\n  ...\n</svg>'}
                    value={form.icon}
                    onChange={field('icon')}
                  />
                )}

                {/* Preview */}
                {form.icon && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="w-3.5 h-3.5" />
                    Ko'rinish:
                    <span className="ml-1 p-2 bg-surface-100 rounded-lg inline-flex">
                      <IconPreview icon={form.icon} size={24} />
                    </span>
                  </div>
                )}
              </div>

              {/* Description & order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Tavsif</label>
                  <input
                    className="input w-full"
                    placeholder="Qisqacha tavsif..."
                    value={form.description}
                    onChange={field('description')}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Tartib</label>
                  <input
                    type="number"
                    className="input w-full"
                    value={form.order}
                    onChange={(e) => setForm((p) => ({ ...p, order: Number(e.target.value) }))}
                  />
                </div>
              </div>

              {/* Sub-services */}
              <div>
                <label className="block text-sm font-medium mb-2">Qo'shimcha xizmatlar (sub-services)</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="input flex-1"
                    placeholder="Masalan: Beton ishlari"
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSub.trim()) {
                        e.preventDefault();
                        setForm((p) => ({ ...p, subServices: [...p.subServices, newSub.trim()] }));
                        setNewSub('');
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={!newSub.trim()}
                    onClick={() => {
                      if (newSub.trim()) {
                        setForm((p) => ({ ...p, subServices: [...p.subServices, newSub.trim()] }));
                        setNewSub('');
                      }
                    }}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {form.subServices.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {form.subServices.map((sub, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-surface-100 text-sm px-2.5 py-1 rounded-lg"
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, subServices: p.subServices.filter((_, idx) => idx !== i) }))}
                          className="text-muted-foreground hover:text-destructive transition-colors ml-0.5"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* isActive toggle */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                  className={`relative w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-primary' : 'bg-gray-300'}`}
                >
                  <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isActive ? 'translate-x-4' : ''}`} />
                </button>
                <span className="text-sm font-medium">{form.isActive ? 'Faol' : 'Nofaol'}</span>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" fullWidth onClick={closeModal}>
                  Bekor qilish
                </Button>
                <Button
                  fullWidth
                  loading={saveMutation.isPending}
                  disabled={!form.nameUz || !form.nameRu || (!editing && !form.slug)}
                  onClick={() => saveMutation.mutate(form)}
                >
                  {editing ? 'Saqlash' : 'Yaratish'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
