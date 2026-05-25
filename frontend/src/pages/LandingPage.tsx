import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
	HardHat,
	Zap,
	Shield,
	Star,
	ChevronRight,
	Wrench,
	Paintbrush,
	Plug,
	Droplets,
	Home,
	Building2,
	CheckCircle2,
	ArrowRight,
	Users,
	TrendingUp,
	Clock,
	MapPin,
	Search,
	ChevronDown,
	ChevronUp,
	Layers,
	Thermometer,
	ThumbsUp,
	BadgeCheck,
	MessageSquare,
	Hammer,
	Wind,
} from 'lucide-react';

/* ─── Data ─────────────────────────────────────────── */
const categories = [
	{
		name: 'Qurilishchi',
		icon: Building2,
		slug: 'BUILDER',
		count: '1 200+',
		subs: ['Beton ishlari', "G'isht terish", 'Poydevor'],
	},
	{
		name: 'Elektrik',
		icon: Plug,
		slug: 'ELECTRICIAN',
		count: '850+',
		subs: ['Provodka', 'Elektr panel', 'Rozetka'],
	},
	{
		name: 'Santexnik',
		icon: Droplets,
		slug: 'PLUMBER',
		count: '670+',
		subs: ['Quvur', 'Vannaxona', 'Kondensator'],
	},
	{
		name: 'Molyar',
		icon: Paintbrush,
		slug: 'PAINTER',
		count: '540+',
		subs: ["Bo'yash", "Devor qog'oz", 'Parket'],
	},
	{
		name: 'Duradgor',
		icon: Wrench,
		slug: 'CARPENTER',
		count: '430+',
		subs: ['Eshik', 'Shkaf', 'Parket'],
	},
	{
		name: 'Dizayner',
		icon: Home,
		slug: 'INTERIOR_DESIGNER',
		count: '310+',
		subs: ['Ichki bezak', '3D dizayn', 'Mebel'],
	},
	{
		name: 'Plitkachi',
		icon: Layers,
		slug: 'TILE_INSTALLER',
		count: '290+',
		subs: ['Pol plitkasi', 'Devor plitkasi', 'Mozaika'],
	},
	{
		name: 'HVAC',
		icon: Wind,
		slug: 'HVAC_SPECIALIST',
		count: '180+',
		subs: ['Konditioner', 'Ventilyatsiya', 'Isitish'],
	},
	{
		name: 'Payvandchi',
		icon: Zap,
		slug: 'WELDER',
		count: '220+',
		subs: ['Metal', 'Darvoza', 'Panjaralar'],
	},
	{
		name: 'Tom ustasi',
		icon: HardHat,
		slug: 'ROOFER',
		count: '150+',
		subs: ['Shifer', 'Ondulin', "Tom ta'miri"],
	},
	{
		name: 'Shtukaturchi',
		icon: Hammer,
		slug: 'PLASTERER',
		count: '380+',
		subs: ['Devor suvash', 'Gips', 'Fasad'],
	},
	{
		name: 'Aqlli uy',
		icon: Thermometer,
		slug: 'SMART_HOME',
		count: '90+',
		subs: ['Signalizatsiya', 'Kamera', 'Avtomatika'],
	},
];

const stats = [
	{ value: '5 000+', label: "Ro'yxatdan o'tgan usta", icon: Users, color: 'text-primary' },
	{ value: '95%', label: 'Ajoyib sharhlarga ega', icon: ThumbsUp, color: 'text-primary' },
	{ value: '120+', label: 'Kunlik yangi buyurtma', icon: TrendingUp, color: 'text-primary' },
];

const steps = [
	{
		num: '01',
		title: 'Buyurtma yuboring',
		desc: "Qanday ish kerakligini tasvirlab bering — rasm va manzil qo'shing.",
		icon: MessageSquare,
	},
	{
		num: '02',
		title: 'Takliflarni oling',
		desc: 'Bir necha daqiqada ustalar narx takliflari yuboradi, tanlang.',
		icon: Users,
	},
	{
		num: '03',
		title: 'Ustani tanlang',
		desc: 'Reyting, portfolio va sharhlar asosida eng yaxshi ustani tanlang.',
		icon: BadgeCheck,
	},
	{
		num: '04',
		title: "To'lov va baho",
		desc: "Ish tugagandan so'ng xavfsiz escrow tizimi orqali to'lang va baho bering.",
		icon: Shield,
	},
];

const testimonials = [
	{
		name: 'Nodira Xasanova',
		role: 'Mijoz, Toshkent',
		text: "Uy ta'mirotim uchun elektrik topish juda oson bo'ldi. Ustam professional, ishi ham sifatli chiqdi!",
		rating: 5,
		initials: 'NX',
	},
	{
		name: 'Jasur Toshmatov',
		role: 'Quruvchi usta',
		text: "BuildHub orqali oyiga 4–5 ta loyiha topaman. To'lov xavfsiz, mijozlar ham sifatli.",
		rating: 5,
		initials: 'JT',
	},
	{
		name: 'Dilnoza Karimova',
		role: 'Mijoz, Samarqand',
		text: "Vannaxonamni ta'mirlash uchun santexnik topish oson bo'ldi. Narxi ham adolatli edi.",
		rating: 5,
		initials: 'DK',
	},
	{
		name: 'Bobur Rahimov',
		role: 'Elektrik usta',
		text: 'Avval ish topish qiyin edi. Endi har hafta yangi loyihalar topaman. Juda qulay platforma.',
		rating: 5,
		initials: 'BR',
	},
	{
		name: 'Malika Yusupova',
		role: 'Mijoz, Namangan',
		text: "Kvartira ta'mirotini to'liq shu yerdan tashkil etdim. Hammasi vaqtida va sifatli bajarildi.",
		rating: 5,
		initials: 'MY',
	},
	{
		name: 'Sardor Aliyev',
		role: 'Santexnik usta',
		text: "To'lov muammosi yo'q, mijozlar doimiy. BuildHub — ishonchli platforma!",
		rating: 5,
		initials: 'SA',
	},
];

const faqs = [
	{
		q: 'BuildHub xizmati pullikmi?',
		a: "Ro'yxatdan o'tish va loyiha ko'rish bepul. Komissiya faqat muvaffaqiyatli to'lovdan olinadi.",
	},
	{
		q: 'Ustalarni qanday tekshirasiz?',
		a: 'Har bir usta hujjatlari, portfolio va oldingi mijozlar sharhlari asosida tekshiriladi. Tasdiqlangan ustalar maxsus badge oladi.',
	},
	{
		q: 'Escrow tizimi qanday ishlaydi?',
		a: "To'lov ish boshlanishida escrowda ushlanadi. Faqat siz ish tugadi deb tasdiqlagan vaqtda usta hisobiga o'tkaziladi.",
	},
	{
		q: "Usta sifatida qanday ro'yxatdan o'taman?",
		a: "Ro'yxatdan o'tish sahifasida 'Usta sifatida' variantini tanlang, profil to'ldiring va moderatsiya orqali tasdiqlaning.",
	},
	{
		q: 'Nizo yuzaga kelsa nima qilaman?',
		a: "Ilovada 'Nizo ochish' tugmasi orqali muammoni bildiring. Admin jamoasi 24 soat ichida ko'rib chiqadi.",
	},
	{
		q: 'Qaysi shaharlarda ishlaydi?',
		a: "Hozirda O'zbekistonning barcha viloyatlari va yirik shaharlarida faoliyat yuritamiz.",
	},
];

const cities = ['Toshkent', 'Samarqand', 'Namangan', 'Andijon', "Farg'ona", 'Buxoro'];

/* ─── Subcomponents ────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
	const [open, setOpen] = useState(false);
	return (
		<div className='border border-border rounded-2xl overflow-hidden'>
			<button
				onClick={() => setOpen(!open)}
				className='w-full flex items-center justify-between px-5 py-4 text-left hover:bg-surface-50 transition-colors gap-4'
			>
				<span className='font-medium text-sm md:text-base'>{q}</span>
				{open ? (
					<ChevronUp className='w-4 h-4 text-primary shrink-0' />
				) : (
					<ChevronDown className='w-4 h-4 text-muted-foreground shrink-0' />
				)}
			</button>
			{open && (
				<div className='px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border bg-surface-50'>
					<p className='pt-3'>{a}</p>
				</div>
			)}
		</div>
	);
}

/* ─── Hero slider images — replace src strings when ready ── */
const SLIDES = ['/images/auto.webp', '/images/builder.webp', '/images/plumber.jpg', '/images/electrician.jpg'];

/* ─── Main page ────────────────────────────────────── */
export function LandingPage() {
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [slide, setSlide] = useState(0);

	const next = useCallback(() => setSlide((s) => (s + 1) % SLIDES.length), []);

	useEffect(() => {
		const t = setInterval(next, 4000);
		return () => clearInterval(t);
	}, [next]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams();
		if (search) params.set('search', search);
		navigate(`/workers?${params.toString()}`);
	};

	return (
		<div className='overflow-x-hidden'>
			{/* ═══════════════════════════════════════════════
          HERO  — oq fon, chap matn, o'ng circular slider
      ═══════════════════════════════════════════════ */}
			<section className='bg-white'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-0 md:pt-16'>
					<div className='grid lg:grid-cols-[1fr_440px] gap-6 md:gap-12 items-center'>
						{/* ── Left ───────────────────────────────── */}
						<div className='pb-10 md:pb-14'>
							<h1 className='text-[2.15rem] sm:text-5xl md:text-[3.25rem] font-black leading-[1.1] text-foreground mb-4'>
								Qurilish va ta'mirlash
								<br />
								ustasini — <span className='text-primary'>tez va</span>
								<br />
								ishonchli toping
							</h1>

							<p className='text-muted-foreground text-base md:text-lg mb-8'>
								Tekshirilgan elektrik, santexnik, quruvchi va boshqa ustalar — bir platformada. Xavfsiz
								to'lov kafolatlanadi.
							</p>

							{/* Pill search */}
							<form
								onSubmit={handleSearch}
								className='flex items-center border-2 border-border rounded-full overflow-hidden bg-white hover:border-primary/40 focus-within:border-primary transition-colors max-w-xl'
							>
								<input
									type='text'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder='Qaysi ishlarga usta kerak?'
									className='flex-1 px-5 py-3.5 text-sm md:text-base text-foreground placeholder-muted-foreground outline-none bg-transparent'
								/>
								<button
									type='submit'
									className='shrink-0 m-1.5 bg-primary hover:bg-primary/90 active:scale-95 text-white font-bold text-xs md:text-sm px-5 md:px-7 py-3 rounded-full transition-all whitespace-nowrap uppercase tracking-wide'
								>
									Usta topish
								</button>
							</form>
						</div>

						{/* ── Right: circular image slider ──────── */}
						<div className='hidden lg:flex flex-col items-center pb-0'>
							{/* Circle container */}
							<div
								className='relative overflow-hidden'
								style={{
									width: 420,
									height: 420,
									borderRadius: '50%',
									background: 'hsl(var(--primary) / 0.08)',
								}}
							>
								{SLIDES.map((src, i) => (
									<div
										key={i}
										className='absolute inset-0 transition-opacity duration-700'
										style={{ opacity: i === slide ? 1 : 0 }}
									>
										{src ? (
											<img
												src={src}
												alt=''
												className='w-full h-full object-cover object-top'
												draggable={false}
											/>
										) : (
											/* placeholder when no image provided */
											<div className='w-full h-full flex flex-col items-center justify-center gap-4'>
												<div className='w-20 h-20 bg-primary/15 rounded-3xl flex items-center justify-center'>
													<HardHat className='w-10 h-10 text-primary' />
												</div>
												<p className='text-primary/60 text-sm font-medium'>Rasm {i + 1}</p>
											</div>
										)}
									</div>
								))}
							</div>

							{/* Dots */}
							<div className='flex items-center gap-2 mt-4'>
								{SLIDES.map((_, i) => (
									<button
										key={i}
										onClick={() => setSlide(i)}
										className={`rounded-full transition-all ${
											i === slide
												? 'w-6 h-2.5 bg-primary'
												: 'w-2.5 h-2.5 bg-primary/25 hover:bg-primary/50'
										}`}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════════
          STATS  — ustabor.uz uslubida
      ═══════════════════════════════════════════════ */}
			<section className='bg-white border-t border-border py-10 md:py-12'>
				<div className='max-w-5xl mx-auto px-4'>
					<div className='grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border'>
						{stats.map((s) => {
							const Icon = s.icon;
							return (
								<div
									key={s.label}
									className='flex items-center gap-4 px-6 py-5 sm:py-3 sm:justify-center'
								>
									<Icon className='w-9 h-9 text-primary shrink-0' />
									<div>
										<p className='text-3xl md:text-4xl font-black text-primary leading-none'>
											{s.value}
										</p>
										<p className='text-sm text-muted-foreground mt-1 leading-snug max-w-[180px]'>
											{s.label}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════════
          CATEGORIES
      ═══════════════════════════════════════════════ */}
			<section className='py-16 md:py-20 bg-surface-50'>
				<div className='max-w-6xl mx-auto px-4'>
					<div className='text-center mb-10'>
						<span className='inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3'>
							Xizmatlar
						</span>
						<h2 className='text-2xl md:text-4xl font-extrabold mb-3'>Qanday xizmat kerak?</h2>
						<p className='text-muted-foreground max-w-md mx-auto text-sm md:text-base'>
							Barcha qurilish va ta'mirlash xizmatlarini bir joyda toping
						</p>
					</div>

					<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4'>
						{categories.map((cat) => {
							const Icon = cat.icon;
							return (
								<Link
									key={cat.slug}
									to={`/workers?category=${cat.slug}`}
									className='group bg-white rounded-2xl border border-border p-4 md:p-5 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-200'
								>
									<div className='flex items-start gap-3 mb-3'>
										<div className='w-10 h-10 md:w-11 md:h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors'>
											<Icon className='w-5 h-5 md:w-6 md:h-6 text-primary' />
										</div>
										<div className='min-w-0'>
											<p className='font-semibold text-sm leading-tight'>{cat.name}</p>
											<p className='text-xs text-primary font-medium mt-0.5'>{cat.count} usta</p>
										</div>
									</div>
									<ul className='space-y-1'>
										{cat.subs.map((sub) => (
											<li
												key={sub}
												className='text-xs text-muted-foreground flex items-center gap-1.5'
											>
												<span className='w-1 h-1 rounded-full bg-border shrink-0' />
												{sub}
											</li>
										))}
									</ul>
									<div className='flex items-center gap-1 mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity'>
										Ko'rish <ChevronRight className='w-3 h-3' />
									</div>
								</Link>
							);
						})}
					</div>

					<div className='text-center mt-8'>
						<Link
							to='/workers'
							className='inline-flex items-center gap-2 border-2 border-primary/60 text-primary font-semibold px-6 py-2.5 rounded-xl hover:bg-primary hover:text-white transition-all text-sm'
						>
							Barcha ustalarni ko'rish <ArrowRight className='w-4 h-4' />
						</Link>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════ */}
			<section className='py-16 md:py-20 bg-white'>
				<div className='max-w-6xl mx-auto px-4'>
					<div className='text-center mb-12'>
						<span className='inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3'>
							Qanday ishlaydi
						</span>
						<h2 className='text-2xl md:text-4xl font-extrabold mb-3'>Oddiy va tez</h2>
						<p className='text-muted-foreground text-sm md:text-base max-w-sm mx-auto'>
							To'rtta oddiy qadam bilan ustani toping va ishni boshlang
						</p>
					</div>

					{/* Steps */}
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14'>
						{steps.map((step, i) => {
							const Icon = step.icon;
							return (
								<div key={step.num} className='relative'>
									{/* connector line */}
									{i < steps.length - 1 && (
										<div className='hidden lg:block absolute top-8 left-[calc(100%-12px)] w-full h-px border-t-2 border-dashed border-primary/20 z-0' />
									)}
									<div className='relative z-10 flex flex-col items-center text-center p-6 bg-surface-50 rounded-2xl border border-border hover:border-primary/30 hover:shadow-md transition-all'>
										<div className='w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm'>
											<Icon className='w-6 h-6 text-white' />
										</div>
										<span className='text-4xl font-black text-primary/10 absolute top-3 right-5 leading-none select-none'>
											{step.num}
										</span>
										<h3 className='font-bold text-base mb-2'>{step.title}</h3>
										<p className='text-xs text-muted-foreground leading-relaxed'>{step.desc}</p>
									</div>
								</div>
							);
						})}
					</div>

					{/* Two CTA cards */}
					<div className='grid md:grid-cols-2 gap-5'>
						<div className='bg-gradient-to-br from-primary/8 to-orange-50 border border-primary/20 rounded-3xl p-7'>
							<div className='flex items-center gap-3 mb-5'>
								<div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm'>
									<Users className='w-5 h-5 text-white' />
								</div>
								<h3 className='font-bold text-xl'>Mijoz uchun</h3>
							</div>
							<ul className='space-y-3 mb-6'>
								{[
									'Loyiha yarating va takliflar oling',
									'Reytinglar asosida eng yaxshisini tanlang',
									'Kuzating va baholang',
								].map((t) => (
									<li key={t} className='flex items-start gap-2.5 text-sm text-muted-foreground'>
										<CheckCircle2 className='w-4 h-4 text-primary shrink-0 mt-0.5' />
										{t}
									</li>
								))}
							</ul>
							<Link
								to='/auth/register?role=CLIENT'
								className='inline-flex items-center gap-2 bg-primary text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-primary/90 transition-all active:scale-95 w-full justify-center'
							>
								Mijoz sifatida boshlash <ArrowRight className='w-4 h-4' />
							</Link>
						</div>

						<div className='bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-7'>
							<div className='flex items-center gap-3 mb-5'>
								<div className='w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center shadow-sm'>
									<HardHat className='w-5 h-5 text-white' />
								</div>
								<h3 className='font-bold text-xl'>Usta uchun</h3>
							</div>
							<ul className='space-y-3 mb-6'>
								{[
									"Portfolio va malakangizni ko'rsating",
									"O'zingizga mos loyihalarga taklif bering",
									'Xavfsiz tizim orqali daromad toping',
								].map((t) => (
									<li key={t} className='flex items-start gap-2.5 text-sm text-muted-foreground'>
										<CheckCircle2 className='w-4 h-4 text-amber-500 shrink-0 mt-0.5' />
										{t}
									</li>
								))}
							</ul>
							<Link
								to='/auth/register?role=WORKER'
								className='inline-flex items-center gap-2 bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-amber-600 transition-all active:scale-95 w-full justify-center'
							>
								Usta sifatida boshlash <ArrowRight className='w-4 h-4' />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════════
          WHY US (features)
      ═══════════════════════════════════════════════ */}
			<section className='py-16 md:py-20 bg-surface-50'>
				<div className='max-w-6xl mx-auto px-4'>
					<div className='text-center mb-10'>
						<span className='inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3'>
							Afzalliklar
						</span>
						<h2 className='text-2xl md:text-4xl font-extrabold mb-3'>Nima uchun BuildHub?</h2>
						<p className='text-muted-foreground text-sm md:text-base'>
							Minglab foydalanuvchilar allaqachon muammolarini hal qildi
						</p>
					</div>

					<div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-5'>
						{[
							{
								icon: BadgeCheck,
								title: 'Tekshirilgan ustalar',
								desc: 'Har bir usta hujjatlari, malakasi va reytingi asosida tekshirilgan. Tasdiqlangan belgili ustalar ishonchli.',
							},
							{
								icon: Shield,
								title: "Xavfsiz to'lov",
								desc: "Escrow tizimi — pul faqat ish muvaffaqiyatli tugagach ustaga o'tkaziladi. Pulizingiz kafolatlangan.",
							},
							{
								icon: Star,
								title: 'Real sharhlar',
								desc: 'Faqat ish bajargan mijozlar sharh qoldira oladi. Soxta baholash imkonsiz.',
							},
							{
								icon: Clock,
								title: "24/7 Qo'llab-quvvatlash",
								desc: 'Istalgan vaqt savol va muammolaringiz uchun yordam olishingiz mumkin.',
							},
							{
								icon: MapPin,
								title: "Joylashuv bo'yicha",
								desc: "Yaqin joyingizdagi ustalarni toping. Shahar va tuman bo'yicha filterlash imkoniyati.",
							},
							{
								icon: TrendingUp,
								title: 'Narxlarni solishtiring',
								desc: 'Bir nechta taklif oling va narx-sifat nisbatini solishtirib, eng yaxshi variantni tanlang.',
							},
						].map((f) => {
							const Icon = f.icon;
							return (
								<div
									key={f.title}
									className='bg-white rounded-2xl border border-border p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200'
								>
									<div className='w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center mb-4'>
										<Icon className='w-5 h-5 text-primary' />
									</div>
									<h3 className='font-bold text-base mb-2'>{f.title}</h3>
									<p className='text-muted-foreground text-sm leading-relaxed'>{f.desc}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════ */}
			<section className='py-16 md:py-20 bg-white'>
				<div className='max-w-6xl mx-auto px-4'>
					<div className='text-center mb-10'>
						<span className='inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3'>
							Fikrlar
						</span>
						<h2 className='text-2xl md:text-4xl font-extrabold mb-3'>Foydalanuvchilar nima deydi?</h2>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
						{testimonials.map((t) => (
							<div
								key={t.name}
								className='bg-surface-50 border border-border rounded-2xl p-6 flex flex-col'
							>
								{/* Stars */}
								<div className='flex gap-0.5 mb-3'>
									{Array.from({ length: t.rating }).map((_, i) => (
										<Star key={i} className='w-4 h-4 fill-amber-400 text-amber-400' />
									))}
								</div>
								<p className='text-sm text-foreground/80 leading-relaxed mb-5 flex-1'>"{t.text}"</p>
								<div className='flex items-center gap-3 border-t border-border pt-4'>
									<div className='w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm shrink-0'>
										{t.initials}
									</div>
									<div>
										<p className='font-semibold text-sm'>{t.name}</p>
										<p className='text-xs text-muted-foreground'>{t.role}</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════ */}
			<section className='py-16 md:py-20 bg-surface-50'>
				<div className='max-w-3xl mx-auto px-4'>
					<div className='text-center mb-10'>
						<span className='inline-block bg-primary/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-3'>
							FAQ
						</span>
						<h2 className='text-2xl md:text-4xl font-extrabold mb-3'>Ko'p so'raladigan savollar</h2>
					</div>
					<div className='space-y-3'>
						{faqs.map((faq) => (
							<FaqItem key={faq.q} q={faq.q} a={faq.a} />
						))}
					</div>
				</div>
			</section>

			{/* ═══════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════ */}
			<section className='py-16 md:py-24 bg-gradient-to-br from-primary via-orange-500 to-amber-400 text-white relative overflow-hidden'>
				<div className='absolute inset-0 overflow-hidden pointer-events-none'>
					<div className='absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl' />
					<div className='absolute -bottom-10 -left-10 w-60 h-60 bg-black/10 rounded-full blur-3xl' />
				</div>
				<div className='relative max-w-3xl mx-auto px-4 text-center'>
					<div className='w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6'>
						<HardHat className='w-8 h-8 text-white' />
					</div>
					<h2 className='text-3xl md:text-5xl font-extrabold mb-4 leading-tight'>Bugun boshlang!</h2>
					<p className='text-white/80 text-base md:text-lg mb-10 max-w-xl mx-auto'>
						Minglab foydalanuvchilar allaqachon BuildHub orqali o'z muammolarini hal qilishmoqda.
					</p>
					<div className='flex flex-col sm:flex-row gap-3 justify-center'>
						<Link
							to='/auth/register?role=CLIENT'
							className='inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-white/95 transition-all active:scale-95 shadow-lg text-sm md:text-base'
						>
							Mijoz sifatida kirish <ArrowRight className='w-4 h-4' />
						</Link>
						<Link
							to='/auth/register?role=WORKER'
							className='inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-white/25 transition-all active:scale-95 text-sm md:text-base backdrop-blur-sm'
						>
							Usta sifatida kirish <ArrowRight className='w-4 h-4' />
						</Link>
					</div>

					{/* mini trust */}
					<div className='flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-sm text-white/60'>
						<span className='flex items-center gap-1.5'>
							<CheckCircle2 className='w-4 h-4 text-white/80' /> Bepul ro'yxatdan o'tish
						</span>
						<span className='flex items-center gap-1.5'>
							<CheckCircle2 className='w-4 h-4 text-white/80' /> Komissiya faqat muvaffaqiyatda
						</span>
						<span className='flex items-center gap-1.5'>
							<CheckCircle2 className='w-4 h-4 text-white/80' /> 24/7 qo'llab-quvvatlash
						</span>
					</div>
				</div>
			</section>
		</div>
	);
}
