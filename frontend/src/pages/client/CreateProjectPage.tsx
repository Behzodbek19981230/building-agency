import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectsService } from '@services/projects.service';
import { Loader2, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';

const schema = z.object({
  title: z.string().min(5, 'Kamida 5 ta belgi'),
  description: z.string().min(20, 'Kamida 20 ta belgi'),
  urgency: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  budgetMin: z.number().min(0).optional(),
  budgetMax: z.number().min(0).optional(),
  city: z.string().optional(),
  address: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CreateProjectPage() {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { urgency: 'MEDIUM' },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    maxFiles: 10,
    onDrop: (files) => {
      setImages((prev) => [...prev, ...files].slice(0, 10));
      setPreviews((prev) => [...prev, ...files.map((f) => URL.createObjectURL(f))].slice(0, 10));
    },
  });

  const removeImage = (i: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== i));
    setPreviews((prev) => prev.filter((_, idx) => idx !== i));
  };

  const onSubmit = async (data: FormData) => {
    try {
      const fd = new FormData();
      Object.entries(data).forEach(([k, v]) => { if (v !== undefined) fd.append(k, String(v)); });
      images.forEach((img) => fd.append('images', img));

      await projectsService.create(fd);
      toast.success('Loyiha muvaffaqiyatli yaratildi!');
      navigate('/client/projects');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Xatolik yuz berdi');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Yangi loyiha yaratish</h1>
      <p className="text-muted-foreground mb-8">Loyihangiz haqida ma'lumot bering</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Asosiy ma'lumotlar</h2>

          <div>
            <label className="block text-sm font-medium mb-1.5">Loyiha nomi *</label>
            <input {...register('title')} className="input w-full" placeholder="Masalan: Oshxona ta'miri" />
            {errors.title && <p className="text-destructive text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Tavsif *</label>
            <textarea {...register('description')} rows={5} className="input w-full resize-none" placeholder="Nima qilinishi kerakligini batafsil yozing..." />
            {errors.description && <p className="text-destructive text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Shoshilinchlik</label>
            <select {...register('urgency')} className="input w-full">
              <option value="LOW">Past (1 oy ichida)</option>
              <option value="MEDIUM">O'rta (2 hafta ichida)</option>
              <option value="HIGH">Yuqori (1 hafta ichida)</option>
              <option value="URGENT">Shoshilinch (24 soat)</option>
            </select>
          </div>
        </div>

        <div className="card p-6 space-y-4">
          <h2 className="font-semibold">Byudjet va joylashuv</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Min. byudjet (so'm)</label>
              <input {...register('budgetMin', { valueAsNumber: true })} type="number" className="input w-full" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Max. byudjet (so'm)</label>
              <input {...register('budgetMax', { valueAsNumber: true })} type="number" className="input w-full" placeholder="0" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Shahar</label>
            <input {...register('city')} className="input w-full" placeholder="Toshkent" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Manzil</label>
            <input {...register('address')} className="input w-full" placeholder="Ko'cha, uy raqami" />
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold mb-4">Rasmlar (ixtiyoriy, max 10 ta)</h2>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50'}`}
          >
            <input {...getInputProps()} />
            <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isDragActive ? 'Rasmni tashlang...' : 'Rasmlarni shu yerga tashlang yoki bosing'}
            </p>
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group">
                  <img src={src} alt="" className="w-full h-20 object-cover rounded-lg" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={() => navigate(-1)} className="btn-outline flex-1 py-2.5">Bekor qilish</button>
          <button type="submit" disabled={isSubmitting} className="btn-primary flex-1 py-2.5">
            {isSubmitting ? <span className="flex items-center gap-2 justify-center"><Loader2 className="w-4 h-4 animate-spin" /> Yaratilmoqda...</span> : 'Loyiha yaratish'}
          </button>
        </div>
      </form>
    </div>
  );
}
