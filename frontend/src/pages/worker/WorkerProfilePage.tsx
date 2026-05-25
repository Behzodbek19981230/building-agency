import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { workersService } from '@services/workers.service';
import { useAuthStore } from '@store/authStore';
import {
  Save, Plus, X, Loader2, CheckCircle, MapPin, Briefcase,
  DollarSign, User, Star,
} from 'lucide-react';
import { Button, Input, Textarea, Select, Badge, Card, CardBody, CardHeader, CardTitle, Spinner } from '@components/ui';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'BUILDER',          label: 'Qurilishchi' },
  { value: 'ELECTRICIAN',      label: 'Elektrik' },
  { value: 'PLUMBER',          label: 'Santexnik' },
  { value: 'PAINTER',          label: "Bo'yoqchi" },
  { value: 'CARPENTER',        label: 'Duradgor' },
  { value: 'INTERIOR_DESIGNER',label: 'Dizayner' },
  { value: 'ARCHITECT',        label: 'Arxitektor' },
  { value: 'TILE_INSTALLER',   label: 'Plitkachi' },
  { value: 'ROOFER',           label: 'Tom ustasi' },
  { value: 'WELDER',           label: 'Payvandchi' },
  { value: 'SMART_HOME',       label: 'Aqlli uy' },
  { value: 'HVAC_SPECIALIST',  label: 'HVAC' },
  { value: 'PLASTERER',        label: 'Shtukaturchi' },
  { value: 'STUCCO_WORKER',    label: 'Gipschi' },
];

const REGIONS = [
  'Toshkent', 'Samarqand', 'Buxoro', 'Namangan', 'Andijon',
  'Farg\'ona', 'Qashqadaryo', 'Surxondaryo', 'Xorazm', 'Navoiy',
  'Jizzax', 'Sirdaryo', "Qoraqalpog'iston",
].map((r) => ({ value: r, label: r }));

interface ProfileForm {
  category: string;
  bio: string;
  experience: string;
  hourlyRate: string;
  dailyRate: string;
  minProjectBudget: string;
  city: string;
  region: string;
  address: string;
}

const empty: ProfileForm = {
  category: '', bio: '', experience: '', hourlyRate: '',
  dailyRate: '', minProjectBudget: '', city: '', region: '', address: '',
};

export function WorkerProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['worker-profile'],
    queryFn: () => workersService.getMyProfile(),
  });

  const profile = data?.data?.data;
  const hasProfile = !!profile;

  const [form, setForm] = useState<ProfileForm>(empty);
  const [newSkill, setNewSkill] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    if (profile) {
      setForm({
        category:        profile.category ?? '',
        bio:             profile.bio ?? '',
        experience:      String(profile.experience ?? ''),
        hourlyRate:      profile.hourlyRate ? String(Number(profile.hourlyRate)) : '',
        dailyRate:       profile.dailyRate  ? String(Number(profile.dailyRate))  : '',
        minProjectBudget:profile.minProjectBudget ? String(Number(profile.minProjectBudget)) : '',
        city:            profile.city    ?? '',
        region:          profile.region  ?? '',
        address:         profile.address ?? '',
      });
      setSkills(profile.skills?.map((s: any) => s.name) ?? []);
    }
  }, [profile]);

  const set = (k: keyof ProfileForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const payload = () => ({
    category:         form.category || undefined,
    bio:              form.bio      || undefined,
    experience:       form.experience ? Number(form.experience) : undefined,
    hourlyRate:       form.hourlyRate       ? Number(form.hourlyRate)       : undefined,
    dailyRate:        form.dailyRate        ? Number(form.dailyRate)        : undefined,
    minProjectBudget: form.minProjectBudget ? Number(form.minProjectBudget) : undefined,
    city:             form.city    || undefined,
    region:           form.region  || undefined,
    address:          form.address || undefined,
    skills,
  });

  const createMutation = useMutation({
    mutationFn: () => workersService.createProfile(payload()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-profile'] });
      toast.success('Profil yaratildi!');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
  });

  const updateMutation = useMutation({
    mutationFn: () => workersService.updateProfile(payload()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['worker-profile'] });
      toast.success('Profil yangilandi!');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message ?? 'Xatolik'),
  });

  const isPending = createMutation.isPending || updateMutation.isPending;

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) setSkills((p) => [...p, s]);
    setNewSkill('');
  };

  const removeSkill = (s: string) => setSkills((p) => p.filter((x) => x !== s));

  const submit = () => hasProfile ? updateMutation.mutate() : createMutation.mutate();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mening profilim</h1>
        {profile?.isVerified && (
          <Badge variant="success" dot>Tasdiqlangan</Badge>
        )}
        {profile && !profile.isVerified && (
          <Badge variant="warning" dot>Tasdiq kutilmoqda</Badge>
        )}
      </div>

      {/* Stats row */}
      {profile && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Reyting', value: `${(profile.rating ?? 0).toFixed(1)} ★`, icon: Star },
            { label: 'Bajarilgan', value: profile.completedProjects ?? 0, icon: Briefcase },
            { label: 'Daromad', value: `${Number(profile.totalEarnings ?? 0).toLocaleString()} so'm`, icon: DollarSign },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <Card key={s.label}>
                <CardBody className="p-4 flex items-center gap-3">
                  <Icon className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="font-bold text-sm">{s.value}</p>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main form */}
      <Card>
        <CardBody className="p-5 space-y-5">
          <CardHeader>
            <CardTitle><User className="w-5 h-5 inline mr-2 text-primary" />Asosiy ma'lumotlar</CardTitle>
          </CardHeader>

          <Select
            label="Mutaxassislik"
            options={CATEGORIES}
            value={form.category}
            onChange={(v) => setForm((f) => ({ ...f, category: v as string }))}
            placeholder="Tanlang"
          />

          <Textarea
            label="Bio / Qisqacha ma'lumot"
            value={form.bio}
            onChange={set('bio')}
            rows={4}
            placeholder="O'zingiz haqingizda yozing..."
          />

          <Input
            label="Tajriba (yil)"
            type="number"
            min={0}
            value={form.experience}
            onChange={set('experience')}
            placeholder="5"
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-5 space-y-5">
          <CardHeader>
            <CardTitle><DollarSign className="w-5 h-5 inline mr-2 text-primary" />Narxlar</CardTitle>
          </CardHeader>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Soatlik narx (so'm)"
              type="number"
              min={0}
              value={form.hourlyRate}
              onChange={set('hourlyRate')}
              placeholder="50 000"
            />
            <Input
              label="Kunlik narx (so'm)"
              type="number"
              min={0}
              value={form.dailyRate}
              onChange={set('dailyRate')}
              placeholder="300 000"
            />
          </div>

          <Input
            label="Minimal loyiha summasi (so'm)"
            type="number"
            min={0}
            value={form.minProjectBudget}
            onChange={set('minProjectBudget')}
            placeholder="500 000"
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-5 space-y-5">
          <CardHeader>
            <CardTitle><MapPin className="w-5 h-5 inline mr-2 text-primary" />Joylashuv</CardTitle>
          </CardHeader>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Shahar"
              value={form.city}
              onChange={set('city')}
              placeholder="Toshkent"
            />
            <Select
              label="Viloyat"
              options={REGIONS}
              value={form.region}
              onChange={(v) => setForm((f) => ({ ...f, region: v as string }))}
              placeholder="Tanlang"
            />
          </div>

          <Input
            label="Manzil"
            value={form.address}
            onChange={set('address')}
            placeholder="Ko'cha, uy raqami..."
          />
        </CardBody>
      </Card>

      <Card>
        <CardBody className="p-5 space-y-4">
          <CardHeader>
            <CardTitle>Ko'nikmalar</CardTitle>
          </CardHeader>

          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Yangi ko'nikma..."
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              className="flex-1"
            />
            <Button variant="outline" onClick={addSkill} leftIcon={<Plus className="w-4 h-4" />}>
              Qo'sh
            </Button>
          </div>

          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                >
                  {s}
                  <button onClick={() => removeSkill(s)} className="hover:text-destructive transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      <Button fullWidth size="lg" loading={isPending} leftIcon={<Save className="w-5 h-5" />} onClick={submit}>
        {hasProfile ? 'Saqlash' : 'Profil yaratish'}
      </Button>
    </div>
  );
}
