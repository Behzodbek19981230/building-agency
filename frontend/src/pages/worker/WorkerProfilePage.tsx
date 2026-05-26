import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { workersService } from '@services/workers.service';
import { useAuthStore } from '@store/authStore';
import {
  Save, Plus, X, CheckCircle, MapPin, Briefcase,
  DollarSign, User, Star, Sparkles,
} from 'lucide-react';
import { Button, Input, Textarea, Select, Badge, Card, CardBody, CardHeader, CardTitle, Spinner } from '@components/ui';
import { AvatarUpload } from '@components/shared/AvatarUpload';
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

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  BUILDER:          ['Poydevor qurish', 'Devor g\'ishtlash', 'Beton ishlari', 'Armatura ishlari', 'Qolip ishlari', 'Taxta ishlari', 'Yuk ko\'tarish'],
  ELECTRICIAN:      ['Simlar tortish', 'Rozetka o\'rnatish', 'Panel o\'rnatish', 'Chiroq o\'rnatish', 'Yerga ulash', 'Smart uy elektri', 'Transformator'],
  PLUMBER:          ['Truba o\'rnatish', 'Kran almashtirish', 'Kanalizatsiya', 'Isitish tizimi', 'Suv o\'tkazgich', 'Bojxona'],
  PAINTER:          ['Devor bo\'yash', 'Ship bo\'yash', 'Dekorativ bo\'yoq', 'Grunt qilish', 'Rollka ishlari', 'Fasad bo\'yash'],
  CARPENTER:        ['Eshik o\'rnatish', 'Deraza o\'rnatish', 'Shkaf yasash', 'Parket yotqizish', 'Laminat yotqizish', 'Mebel yasash'],
  INTERIOR_DESIGNER:['3D loyihalash', 'Interyer dekor', 'Rang sxemasi', 'Mebel dizayni', 'Aphorism naqsh', 'Yoritish dizayni'],
  ARCHITECT:        ['Bino loyihasi', 'Uy rejasi', 'Ruxsatnoma', 'Hisob-kitob', 'Konstruktiv loyiha', 'Balandlik hisob'],
  TILE_INSTALLER:   ['Plitkalar yotqizish', 'Mozaika', 'Granit plitka', 'Serklash', 'Sirlash', 'Fugalash'],
  ROOFER:           ['Tom qoplash', 'Metall tom', 'Cherepitsa', 'Yomg\'ir kanali', 'Izolyatsiya', 'Mansard tom'],
  WELDER:           ['Metall payvandlash', 'Darvoza yasash', 'Panjara o\'rnatish', 'Quvur payvandlash', 'Metall konstruksiya', 'TIG/MIG payvand'],
  SMART_HOME:       ['Avtomatika', 'Signalizatsiya', 'Kamera o\'rnatish', 'Smart switch', 'Interkom', 'Aqlli yorug\'lik'],
  HVAC_SPECIALIST:  ['Konditsioner montaji', 'Ventilyatsiya', 'Isitish tizimi', 'Sovutish tizimi', 'Filtr almashtirish', 'Kanal montaji'],
  PLASTERER:        ['Suvoq ishlari', 'Tekislash', 'Shkaturka', 'Akril suvoq', 'Sement suvoq', 'Ko\'pik blok suvoq'],
  STUCCO_WORKER:    ['Gips ishlari', 'Dekor gips', 'Shift gipsi', 'Gips qolip', 'Gipsli panellar', 'Rozetka va leplinnye'],
};

export interface SubItem { name: string; price: number; }
export interface SkillItem { name: string; items: SubItem[]; }

/* ─── Predefined sub-items per skill ─────────────────── */
const SUB_ITEMS_BY_SKILL: Record<string, string[]> = {
  "Poydevor qurish":    ["Qazish", "Beton quyish", "Armatura ishlari", "Qolip o'rnatish", "Gidroizolyatsiya"],
  "Devor g'ishtlash":   ["G'isht terish", "Blok terish", "Tuynuk qoldirish", "Sement qorishmasi"],
  "Beton ishlari":      ["Pol betoni", "Ship betoni", "Ustun betoni", "Zinapoya betoni"],
  "Armatura ishlari":   ["Armatura to'rini yig'ish", "Bog'lash", "Kesish va egilish"],
  "Qolip ishlari":      ["Taxtali qolip", "Metall qolip", "Shnurkovka"],
  "Taxta ishlari":      ["Taxta yotqizish", "Zamin taxta", "Tom taxtasi"],
  "Simlar tortish":     ["220V sim", "380V sim", "Internet kabeli", "Alarm sim", "Ko'p o'tkazgichli sim"],
  "Rozetka o'rnatish":  ["Oddiy rozetka", "USB rozetka", "Yerga ulangan rozetka", "Ko'pli rozetka"],
  "Chiroq o'rnatish":   ["Oddiy chiroq", "Spot chiroq", "LED panel", "Lyustra", "Diorit chiroq"],
  "Panel o'rnatish":    ["Hisoblagich o'rnatish", "Avtomatik uzgich", "DIF avtomat"],
  "Truba o'rnatish":    ["Mis truba", "Plastik truba (PPR)", "Metal-plastik truba", "Fitink va ulagich"],
  "Kran almashtirish":  ["Qo'l krani", "Shar krani", "Santexnik armatura", "Angel krani"],
  "Kanalizatsiya":      ["Kanal quvuri (110mm)", "Reviziya o'rnatish", "Sifon", "Tiqilinchni ochish"],
  "Isitish tizimi":     ["Radiator o'rnatish", "Kollektor montaji", "Qozon ulanishi", "Termostat"],
  "Devor bo'yash":      ["Gruntlash", "Zaxira bo'yash", "Asosiy bo'yash (2 qavat)"],
  "Dekorativ bo'yoq":   ["Venetsian shtukatirka", "Fakturniy bo'yoq", "Yog'li bo'yoq", "Akvarel effekt"],
  "Grunt qilish":       ["Chuqur kiradigan grunt", "Akril grunt", "Beton kontakt"],
  "Eshik o'rnatish":    ["Ichki eshik", "Tashqi eshik", "Shomil", "Laylak va ilmoqlar"],
  "Deraza o'rnatish":   ["Plastik deraza", "Alyuminiy deraza", "Germetizatsiya", "Podokonnik"],
  "Parket yotqizish":   ["Massiv parket", "Muhandislik taxtasi", "Gerbetizatsiya", "Plintus"],
  "Laminat yotqizish":  ["Substrat yotqizish", "Laminat qatorlash", "Plintus", "Tirqishsiz yotqizish"],
  "Plitkalar yotqizish":["Pol plitkasi", "Devor plitkasi", "Burchak yo'laklari", "Mozaika frizi"],
  "Fugalash":           ["Oddiy fuga", "Epoksid fuga", "Silikon fuga"],
  "Tom qoplash":        ["Metall profil", "Ondullin", "Bitum shinglas", "Izolyatsiya qatlami"],
  "Yomg'ir kanali":     ["Plastik kanal", "Metall kanal", "Kruchok o'rnatish", "Kollektor"],
  "Metall payvandlash": ["TIG payvandlash", "MIG payvandlash", "Elektr payvandlash", "Gaz payvandlash"],
  "Darvoza yasash":     ["Metall darvoza", "Suzuvchi darvoza", "Ikkiqanotli darvoza", "Poyabzalxona"],
  "Panjara o'rnatish":  ["Metall panjara", "Eshik panjarasi", "Zina panjarasi", "Derazali panjara"],
  "Suvoq ishlari":      ["Gips suvoq", "Sement suvoq", "Mashinali suvoq", "Burchak profil"],
  "Tekislash":          ["Mayda tekislash (shlif)", "Shpaklyovka", "Silliq qilish"],
  "Konditsioner montaji":["Ichki blok o'rnatish", "Tashqi blok o'rnatish", "Drenaj quvuri", "Freون to'ldirish"],
  "Ventilyatsiya":      ["Kanal o'rnatish", "Diffuzor", "Fan coil", "Havo taqsimlash tizimi"],
  "Gips ishlari":       ["Gipsli panel", "Arqova", "Nish", "Dekorativ gips element"],
  "Dekor gips":         ["Rozetka va leplinnye", "Ustun kapitel", "Baguet", "Gipsokarton qoplash"],
};

/* ─── Sub-item row ───────────────────────────────────── */
function SubItemRow({ item, onRemove, onPriceChange }: {
  item: SubItem;
  onRemove: () => void;
  onPriceChange: (price: number) => void;
}) {
  return (
    <div className="flex items-center gap-2 py-2 pl-4 pr-3 bg-surface-50">
      <span className="w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
      <span className="flex-1 text-sm truncate">{item.name}</span>
      <div className="flex items-center gap-1 shrink-0">
        <input
          type="number"
          min={0}
          value={item.price || ''}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          placeholder="Narx"
          className="w-28 h-7 px-2 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-right"
        />
        <span className="text-xs text-muted-foreground">so'm</span>
      </div>
      <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Single skill block (expanded) ─────────────────── */
function SkillBlock({ skill, onRemove, onAddItem, onRemoveItem, onItemPriceChange }: {
  skill: SkillItem;
  onRemove: () => void;
  onAddItem: (name: string) => void;
  onRemoveItem: (name: string) => void;
  onItemPriceChange: (name: string, price: number) => void;
}) {
  const [itemInput, setItemInput] = useState('');
  const predefined = SUB_ITEMS_BY_SKILL[skill.name] ?? [];
  const selectedNames = skill.items.map((i) => i.name);

  const handleAdd = (name: string) => {
    if (name && !selectedNames.includes(name)) onAddItem(name);
    setItemInput('');
  };

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {/* header */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-background border-b border-border">
        <CheckCircle className="w-4 h-4 text-primary shrink-0" />
        <span className="flex-1 text-sm font-semibold">{skill.name}</span>
        <span className="text-xs text-muted-foreground">
          {skill.items.length > 0 ? `${skill.items.length} ta ish turi` : 'Ish turlari yo\'q'}
        </span>
        <button type="button" onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors ml-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* sub-items */}
      {skill.items.map((item) => (
        <SubItemRow
          key={item.name}
          item={item}
          onRemove={() => onRemoveItem(item.name)}
          onPriceChange={(price) => onItemPriceChange(item.name, price)}
        />
      ))}

      {/* predefined suggestions */}
      {predefined.filter((n) => !selectedNames.includes(n)).length > 0 && (
        <div className="px-3 py-2 bg-surface-50 border-t border-dashed border-border/60">
          <p className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Tez qo'shish:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {predefined.filter((n) => !selectedNames.includes(n)).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => handleAdd(n)}
                className="text-xs px-2.5 py-1 rounded-lg border border-dashed border-primary/40 text-primary/80 hover:bg-primary/10 hover:border-primary transition-all"
              >
                + {n}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* custom sub-item input */}
      <div className="flex gap-2 p-2 bg-surface-50 border-t border-dashed border-border/60">
        <input
          value={itemInput}
          onChange={(e) => setItemInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd(itemInput.trim()))}
          placeholder="Boshqa ish turi..."
          className="flex-1 h-8 px-2.5 text-xs rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <button
          type="button"
          onClick={() => handleAdd(itemInput.trim())}
          disabled={!itemInput.trim()}
          className="h-8 px-3 rounded-lg text-xs font-medium border border-border text-muted-foreground hover:text-primary hover:border-primary/50 disabled:opacity-40 transition-all flex items-center gap-1"
        >
          <Plus className="w-3 h-3" /> Qo'sh
        </button>
      </div>
    </div>
  );
}

/* ─── Main SkillsSection ─────────────────────────────── */
function SkillsSection({
  category,
  skills,
  onToggle,
  onAddCustom,
  onRemove,
  onAddItem,
  onRemoveItem,
  onItemPriceChange,
}: {
  category: string;
  skills: SkillItem[];
  onToggle: (name: string) => void;
  onAddCustom: (name: string) => void;
  onRemove: (name: string) => void;
  onAddItem: (skillName: string, itemName: string) => void;
  onRemoveItem: (skillName: string, itemName: string) => void;
  onItemPriceChange: (skillName: string, itemName: string, price: number) => void;
}) {
  const [input, setInput] = useState('');
  const predefined = SKILLS_BY_CATEGORY[category] ?? [];
  const selectedNames = skills.map((s) => s.name);

  const handleAddCustom = () => {
    const s = input.trim();
    if (s && !selectedNames.includes(s)) onAddCustom(s);
    setInput('');
  };

  return (
    <div className="space-y-4">
      {/* ── Predefined service chips ── */}
      {predefined.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Xizmat turi tanlang (bir nechta bo'lishi mumkin)
          </p>
          <div className="flex flex-wrap gap-2">
            {predefined.map((name) => {
              const active = selectedNames.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => onToggle(name)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${
                    active
                      ? 'bg-primary text-white border-primary shadow-sm'
                      : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {active && <CheckCircle className="w-3.5 h-3.5 shrink-0" />}
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Expanded skill blocks with sub-items ── */}
      {skills.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground">Ish turlari va narxlar</p>
          {skills.map((skill) => (
            <SkillBlock
              key={skill.name}
              skill={skill}
              onRemove={() => onRemove(skill.name)}
              onAddItem={(itemName) => onAddItem(skill.name, itemName)}
              onRemoveItem={(itemName) => onRemoveItem(skill.name, itemName)}
              onItemPriceChange={(itemName, price) => onItemPriceChange(skill.name, itemName, price)}
            />
          ))}
        </div>
      )}

      {/* ── Custom service input ── */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustom())}
          placeholder="Ro'yxatda yo'q xizmat qo'shing..."
          className="flex-1 h-9 px-3 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground/60"
        />
        <button
          type="button"
          onClick={handleAddCustom}
          disabled={!input.trim()}
          className="h-9 px-4 rounded-xl border border-border text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary hover:bg-primary/5 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" /> Qo'sh
        </button>
      </div>

      {skills.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">
          Xizmat turini tanlang yoki qo'shing
        </p>
      )}
    </div>
  );
}

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
  const [skills, setSkills] = useState<SkillItem[]>([]);

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
      setSkills(profile.skills?.map((s: any) => ({
        name: s.name,
        items: (s.items ?? []).map((i: any) => ({ name: i.name, price: i.price })),
      })) ?? []);
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

  const toggleSkill = (name: string) =>
    setSkills((p) =>
      p.some((x) => x.name === name)
        ? p.filter((x) => x.name !== name)
        : [...p, { name, items: [] }],
    );

  const addCustomSkill = (name: string) => setSkills((p) => [...p, { name, items: [] }]);

  const removeSkill = (name: string) => setSkills((p) => p.filter((x) => x.name !== name));

  const addSubItem = (skillName: string, itemName: string) =>
    setSkills((p) => p.map((s) =>
      s.name === skillName ? { ...s, items: [...s.items, { name: itemName, price: 0 }] } : s,
    ));

  const removeSubItem = (skillName: string, itemName: string) =>
    setSkills((p) => p.map((s) =>
      s.name === skillName ? { ...s, items: s.items.filter((i) => i.name !== itemName) } : s,
    ));

  const updateSubItemPrice = (skillName: string, itemName: string, price: number) =>
    setSkills((p) => p.map((s) =>
      s.name === skillName
        ? { ...s, items: s.items.map((i) => i.name === itemName ? { ...i, price } : i) }
        : s,
    ));

  const submit = () => hasProfile ? updateMutation.mutate() : createMutation.mutate();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <AvatarUpload size="md" />
          <div>
            <h1 className="text-2xl font-bold">Mening profilim</h1>
            <p className="text-sm text-muted-foreground">{user?.firstName} {user?.lastName}</p>
          </div>
        </div>
        <div>
          {profile?.isVerified && (
            <Badge variant="success" dot>Tasdiqlangan</Badge>
          )}
          {profile && !profile.isVerified && (
            <Badge variant="warning" dot>Tasdiq kutilmoqda</Badge>
          )}
        </div>
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
          <SkillsSection
            category={form.category}
            skills={skills}
            onToggle={toggleSkill}
            onAddCustom={addCustomSkill}
            onRemove={removeSkill}
            onAddItem={addSubItem}
            onRemoveItem={removeSubItem}
            onItemPriceChange={updateSubItemPrice}
          />
        </CardBody>
      </Card>

      <Button fullWidth size="lg" loading={isPending} leftIcon={<Save className="w-5 h-5" />} onClick={submit}>
        {hasProfile ? 'Saqlash' : 'Profil yaratish'}
      </Button>
    </div>
  );
}
