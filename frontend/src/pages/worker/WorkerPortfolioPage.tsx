import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useRef } from 'react';
import { workersService } from '@services/workers.service';
import { Plus, X, ImagePlus, Loader2, FolderOpen } from 'lucide-react';
import { Button, Input, Textarea, Select, Card, CardBody, Spinner } from '@components/ui';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'BUILDER',           label: 'Qurilish' },
  { value: 'ELECTRICIAN',       label: 'Elektr' },
  { value: 'PLUMBER',           label: 'Santexnika' },
  { value: 'PAINTER',           label: "Bo'yash" },
  { value: 'CARPENTER',         label: 'Duradgorlik' },
  { value: 'INTERIOR_DESIGNER', label: 'Dizayn' },
  { value: 'ARCHITECT',         label: 'Arxitektura' },
  { value: 'TILE_INSTALLER',    label: 'Plitkachi' },
  { value: 'ROOFER',            label: 'Tom' },
  { value: 'WELDER',            label: 'Payvandlash' },
  { value: 'SMART_HOME',        label: 'Aqlli uy' },
  { value: 'HVAC_SPECIALIST',   label: 'HVAC' },
  { value: 'PLASTERER',         label: 'Shtukaturlash' },
  { value: 'STUCCO_WORKER',     label: 'Gips' },
];

function AddPortfolioForm({ onSuccess }: { onSuccess: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [previews, setPreviews] = useState<{ file: File; url: string }[]>([]);

  const mutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('title', title);
      if (description) fd.append('description', description);
      if (category) fd.append('category', category);
      previews.forEach((p) => fd.append('images', p.file));
      return workersService.addPortfolio(fd);
    },
    onSuccess: () => {
      toast.success("Portfolio qo'shildi");
      setTitle(''); setDescription(''); setCategory('');
      previews.forEach((p) => URL.revokeObjectURL(p.url));
      setPreviews([]);
      onSuccess();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
  });

  const addImages = (files: FileList | null) => {
    if (!files) return;
    const items = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, 10 - previews.length)
      .map((f) => ({ file: f, url: URL.createObjectURL(f) }));
    setPreviews((p) => [...p, ...items]);
  };

  const removeImage = (i: number) => {
    URL.revokeObjectURL(previews[i].url);
    setPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  return (
    <Card>
      <CardBody className="p-5 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Plus className="w-5 h-5 text-primary" /> Yangi ish qo'shish
        </h2>

        <Input
          label="Sarlavha *"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masalan: 3 xonali kvartira ta'miri"
        />

        <Select
          label="Kategoriya"
          options={CATEGORIES}
          value={category}
          onChange={(v) => setCategory(v as string)}
          placeholder="Tanlang"
        />

        <Textarea
          label="Tavsif (ixtiyoriy)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Ish haqida qisqacha..."
        />

        {/* Image upload */}
        <div>
          <label className="text-sm font-medium mb-2 block">Rasmlar (max 10)</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => addImages(e.target.files)}
          />

          {previews.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {previews.map((p, i) => (
                <div key={i} className="relative">
                  <img
                    src={p.url}
                    alt=""
                    className="h-20 w-20 object-cover rounded-xl border border-border"
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

          {previews.length < 10 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground border border-dashed border-border rounded-xl px-4 py-2.5 w-full justify-center transition-colors hover:bg-surface-100"
            >
              <ImagePlus className="w-4 h-4" />
              Rasm yuklash ({previews.length}/10)
            </button>
          )}
        </div>

        <Button
          fullWidth
          loading={mutation.isPending}
          disabled={!title.trim()}
          onClick={() => mutation.mutate()}
        >
          Saqlash
        </Button>
      </CardBody>
    </Card>
  );
}

export function WorkerPortfolioPage() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: () => workersService.getMyProfile(),
  });

  const portfolio: any[] = data?.data?.data?.portfolio ?? [];

  const handleAdded = () => {
    queryClient.invalidateQueries({ queryKey: ['worker-profile'] });
    setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Portfolio</h1>
        <Button
          variant={showForm ? 'outline' : 'primary'}
          size="sm"
          leftIcon={showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Yopish' : "Qo'shish"}
        </Button>
      </div>

      {showForm && <AddPortfolioForm onSuccess={handleAdded} />}

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner /></div>
      ) : portfolio.length === 0 ? (
        <Card>
          <CardBody className="py-16 text-center text-muted-foreground">
            <FolderOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>Portfolio bo'sh</p>
            <p className="text-sm mt-1">Bajargan ishlaringizni qo'shing</p>
            {!showForm && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={() => setShowForm(true)}
              >
                Birinchi ish qo'shish
              </Button>
            )}
          </CardBody>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {portfolio.map((item) => (
            <Card key={item.id} hover>
              <CardBody className="p-0">
                {/* Image */}
                <div className="aspect-video w-full overflow-hidden rounded-t-2xl bg-muted">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🏗️
                    </div>
                  )}
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight">{item.title}</h3>
                    {item.images?.length > 1 && (
                      <span className="shrink-0 text-xs bg-surface-100 text-muted-foreground px-2 py-0.5 rounded-full">
                        {item.images.length} rasm
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                  )}

                  {item.images?.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto pt-1">
                      {item.images.slice(1, 5).map((img: string, i: number) => (
                        <img
                          key={i}
                          src={img}
                          alt=""
                          className="h-10 w-10 object-cover rounded-lg border border-border shrink-0"
                        />
                      ))}
                      {item.images.length > 5 && (
                        <div className="h-10 w-10 rounded-lg border border-border bg-surface-100 flex items-center justify-center text-xs text-muted-foreground shrink-0">
                          +{item.images.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
