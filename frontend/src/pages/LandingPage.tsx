import { Link } from 'react-router-dom';
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
	Play,
} from 'lucide-react';

const categories = [
	{ name: 'Quruvchi', icon: Building2, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', slug: 'BUILDER' },
	{ name: 'Elektrik', icon: Plug, color: 'from-yellow-500 to-amber-500', bg: 'bg-yellow-50', slug: 'ELECTRICIAN' },
	{ name: 'Santexnik', icon: Droplets, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', slug: 'PLUMBER' },
	{ name: 'Molyar', icon: Paintbrush, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', slug: 'PAINTER' },
	{ name: 'Duradgor', icon: Wrench, color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', slug: 'CARPENTER' },
	{ name: 'Dizayner', icon: Home, color: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', slug: 'INTERIOR_DESIGNER' },
];

const features = [
	{
		icon: Zap,
		title: 'Tez topish',
		desc: 'Bir necha daqiqada yaqin joydagi tekshirilgan ustani toping',
		color: 'text-amber-500',
		bg: 'bg-amber-50',
	},
	{
		icon: Shield,
		title: "Xavfsiz to'lov",
		desc: "Escrow tizimi — pul faqat ish muvaffaqiyatli tugagach ustaga o'tkaziladi",
		color: 'text-emerald-500',
		bg: 'bg-emerald-50',
	},
	{
		icon: Star,
		title: 'Ishonchli ustalar',
		desc: 'Har bir usta hujjatlari, malakasi va reytingi asosida tekshirilgan',
		color: 'text-primary',
		bg: 'bg-primary/5',
	},
];

const stats = [
	{ value: '5,000+', label: "Ro'yxatdan o'tgan usta", icon: Users },
	{ value: '12,000+', label: 'Bajarilgan loyiha', icon: TrendingUp },
	{ value: '4.8★', label: "O'rtacha reyting", icon: Star },
	{ value: '98%', label: 'Mamnun mijozlar', icon: CheckCircle2 },
];

const steps = {
	client: [
		{ title: 'Loyiha yarating', desc: 'Bajarmoqchi bo\'lgan ishingizni tasvirlab bering va rasm yuklang' },
		{ title: "Takliflarni qabul qiling", desc: "Bir necha daqiqada ishchi ustalardan taklif va narx baho qiling" },
		{ title: 'Eng yaxshisini tanlang', desc: 'Reyting, portfolio va narx asosida o\'zingizga mos ustani tanlang' },
		{ title: 'Kuzating va baho bering', desc: "Ishni real vaqtda kuzating, natijadan xursand bo'ling" },
	],
	worker: [
		{ title: 'Profil yarating', desc: 'Portfolio va malakangizni ko\'rsatib profil to\'ldiring' },
		{ title: 'Loyihalarga taklif bering', desc: 'O\'zingizga mos loyihalarga narx taklifi yuboring' },
		{ title: 'Ish bajaring', desc: 'Mijoz bilan muloqot qilib, sifatli ish bajaring' },
		{ title: 'Daromad toping', desc: 'Xavfsiz to\'lov tizimi orqali daromadingizni oling' },
	],
};

const testimonials = [
	{
		name: 'Nodira Xasanova',
		role: 'Mijoz, Toshkent',
		text: 'Uy ta\'mirotim uchun elektrik topish juda oson bo\'ldi. Ustam professional, ishi ham sifatli chiqdi!',
		rating: 5,
		avatar: 'N',
	},
	{
		name: 'Jasur Toshmatov',
		role: 'Quruvchi usta',
		text: "BuildHub orqali oyiga 4-5 ta loyiha topaman. To'lov xavfsiz, mijozlar ham sifatli.",
		rating: 5,
		avatar: 'J',
	},
	{
		name: 'Dilnoza Karimova',
		role: 'Mijoz, Samarqand',
		text: "Vannaxonamni ta'mirlash uchun santexnik topish oson bo'ldi. Narxi ham adolatli edi.",
		rating: 5,
		avatar: 'D',
	},
];

export function LandingPage() {
	return (
		<div className='overflow-x-hidden'>
			{/* ─── Hero ─────────────────────────────────────── */}
			<section className='relative hero-gradient text-white overflow-hidden'>
				{/* Background decorations */}
				<div className='absolute inset-0 overflow-hidden'>
					<div className='absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl' />
					<div className='absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl' />
					<div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl' />
				</div>

				{/* Grid pattern overlay */}
				<div
					className='absolute inset-0 opacity-[0.03]'
					style={{
						backgroundImage: `linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)`,
						backgroundSize: '50px 50px',
					}}
				/>

				<div className='relative max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-28 md:pt-32 md:pb-36'>
					{/* Badge */}
					<div className='flex justify-center mb-8 animate-fade-in'>
						<div className='inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm font-medium'>
							<span className='w-2 h-2 bg-emerald-400 rounded-full animate-pulse-slow' />
							O'zbekistonning #1 qurilish platformasi
						</div>
					</div>

					{/* Heading */}
					<div className='text-center max-w-4xl mx-auto'>
						<h1 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-slide-up'>
							Qurilish va ta'mirlash
							<br />
							<span className='gradient-text'>ustasini toping</span>
						</h1>
						<p className='text-lg sm:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in'>
							Minglab tekshirilgan quruvchi, elektrik, santexnik, molyar va
							boshqa mutaxassislar — bir platformada.
						</p>

						{/* CTA buttons */}
						<div className='flex flex-col sm:flex-row gap-3 justify-center animate-fade-in'>
							<Link
								to='/auth/register'
								className='group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all shadow-glow hover:shadow-glow-lg active:scale-95'
							>
								Boshlash
								<ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
							</Link>
							<Link
								to='/workers'
								className='inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold px-7 py-3.5 rounded-xl text-base transition-all active:scale-95'
							>
								<Play className='w-4 h-4' />
								Ustalarni ko'rish
							</Link>
						</div>

						{/* Trust signals */}
						<div className='flex flex-wrap justify-center gap-x-6 gap-y-2 mt-10 text-sm text-white/50'>
							<span className='flex items-center gap-1.5'><CheckCircle2 className='w-4 h-4 text-emerald-400' /> Bepul ro'yxatdan o'tish</span>
							<span className='flex items-center gap-1.5'><CheckCircle2 className='w-4 h-4 text-emerald-400' /> Tekshirilgan ustalar</span>
							<span className='flex items-center gap-1.5'><CheckCircle2 className='w-4 h-4 text-emerald-400' /> Xavfsiz to'lov</span>
						</div>
					</div>
				</div>

				{/* Bottom wave */}
				<div className='absolute bottom-0 left-0 right-0'>
					<svg viewBox='0 0 1440 60' fill='none' xmlns='http://www.w3.org/2000/svg' className='w-full'>
						<path d='M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z' fill='white' />
					</svg>
				</div>
			</section>

			{/* ─── Stats ─────────────────────────────────────── */}
			<section className='bg-white py-12'>
				<div className='max-w-5xl mx-auto px-4'>
					<div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
						{stats.map((s) => {
							const Icon = s.icon;
							return (
								<div key={s.label} className='text-center group'>
									<div className='inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-2xl mb-3 group-hover:scale-110 transition-transform'>
										<Icon className='w-5 h-5 text-primary' />
									</div>
									<div className='text-2xl md:text-3xl font-bold text-foreground mb-0.5'>{s.value}</div>
									<div className='text-xs md:text-sm text-muted-foreground'>{s.label}</div>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ─── Categories ─────────────────────────────────── */}
			<section className='section bg-surface-50'>
				<div className='container-max'>
					<div className='text-center mb-12'>
						<span className='badge-primary mb-3'>Xizmatlar</span>
						<h2 className='text-3xl md:text-4xl font-bold mt-2 mb-3'>Qanday xizmat kerak?</h2>
						<p className='text-muted-foreground max-w-md mx-auto'>
							Barcha qurilish va ta'mirlash xizmatlarini bir joyda toping
						</p>
					</div>

					<div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4'>
						{categories.map((cat) => {
							const Icon = cat.icon;
							return (
								<Link
									key={cat.slug}
									to={`/workers?category=${cat.slug}`}
									className='group flex flex-col items-center gap-3 p-4 md:p-5 bg-white rounded-2xl border border-border hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200'
								>
									<div className={`w-12 h-12 md:w-14 md:h-14 ${cat.bg} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
										<Icon className='w-6 h-6 md:w-7 md:h-7 text-gray-700' />
									</div>
									<span className='text-xs md:text-sm font-semibold text-center leading-tight'>{cat.name}</span>
								</Link>
							);
						})}
					</div>

					<div className='text-center mt-8'>
						<Link to='/workers' className='btn-outline'>
							Barcha xizmatlar <ArrowRight className='w-4 h-4' />
						</Link>
					</div>
				</div>
			</section>

			{/* ─── How it works ─────────────────────────────── */}
			<section className='section bg-white'>
				<div className='container-max'>
					<div className='text-center mb-12'>
						<span className='badge-primary mb-3'>Qanday ishlaydi</span>
						<h2 className='text-3xl md:text-4xl font-bold mt-2'>Oddiy va tez</h2>
					</div>

					<div className='grid md:grid-cols-2 gap-8 md:gap-12'>
						{/* Client steps */}
						<div className='bg-gradient-to-br from-primary/5 to-orange-50 rounded-3xl p-6 md:p-8'>
							<div className='flex items-center gap-3 mb-6'>
								<div className='w-10 h-10 bg-primary rounded-xl flex items-center justify-center'>
									<Users className='w-5 h-5 text-white' />
								</div>
								<h3 className='font-bold text-xl'>Mijoz uchun</h3>
							</div>
							<div className='space-y-4'>
								{steps.client.map((step, i) => (
									<div key={i} className='flex gap-4'>
										<div className='flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold'>
											{i + 1}
										</div>
										<div>
											<div className='font-semibold text-sm mb-0.5'>{step.title}</div>
											<div className='text-xs text-muted-foreground leading-relaxed'>{step.desc}</div>
										</div>
									</div>
								))}
							</div>
							<Link to='/auth/register?role=CLIENT' className='btn-primary w-full mt-6'>
								Mijoz sifatida kirish <ArrowRight className='w-4 h-4' />
							</Link>
						</div>

						{/* Worker steps */}
						<div className='bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-8'>
							<div className='flex items-center gap-3 mb-6'>
								<div className='w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center'>
									<HardHat className='w-5 h-5 text-white' />
								</div>
								<h3 className='font-bold text-xl'>Usta uchun</h3>
							</div>
							<div className='space-y-4'>
								{steps.worker.map((step, i) => (
									<div key={i} className='flex gap-4'>
										<div className='flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center'>
											<CheckCircle2 className='w-4 h-4' />
										</div>
										<div>
											<div className='font-semibold text-sm mb-0.5'>{step.title}</div>
											<div className='text-xs text-muted-foreground leading-relaxed'>{step.desc}</div>
										</div>
									</div>
								))}
							</div>
							<Link to='/auth/register?role=WORKER' className='inline-flex items-center justify-center gap-2 w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all mt-6 active:scale-95'>
								Usta sifatida kirish <ArrowRight className='w-4 h-4' />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* ─── Features ─────────────────────────────────── */}
			<section className='section bg-surface-50'>
				<div className='container-max'>
					<div className='text-center mb-12'>
						<span className='badge-primary mb-3'>Afzalliklar</span>
						<h2 className='text-3xl md:text-4xl font-bold mt-2 mb-3'>Nima uchun BuildHub?</h2>
						<p className='text-muted-foreground max-w-lg mx-auto'>
							Minglab foydalanuvchilar allaqachon BuildHub orqali o'z muammolarini hal qildi
						</p>
					</div>

					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{features.map((f) => {
							const Icon = f.icon;
							return (
								<div key={f.title} className='bg-white rounded-2xl p-6 md:p-8 border border-border hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200'>
									<div className={`w-12 h-12 ${f.bg} rounded-2xl flex items-center justify-center mb-4`}>
										<Icon className={`w-6 h-6 ${f.color}`} />
									</div>
									<h3 className='font-bold text-lg mb-2'>{f.title}</h3>
									<p className='text-muted-foreground text-sm leading-relaxed'>{f.desc}</p>
								</div>
							);
						})}
					</div>

					{/* Additional features row */}
					<div className='grid grid-cols-2 md:grid-cols-4 gap-4 mt-6'>
						{[
							{ icon: Clock, text: '24/7 Qo\'llab-quvvatlash' },
							{ icon: MapPin, text: 'Joylashuv bo\'yicha topish' },
							{ icon: Shield, text: 'Kafolatlangan sifat' },
							{ icon: TrendingUp, text: 'Reyting tizimi' },
						].map((item) => {
							const Icon = item.icon;
							return (
								<div key={item.text} className='flex items-center gap-3 bg-white rounded-xl p-4 border border-border'>
									<Icon className='w-4 h-4 text-primary flex-shrink-0' />
									<span className='text-xs md:text-sm font-medium'>{item.text}</span>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* ─── Testimonials ─────────────────────────────── */}
			<section className='section bg-white'>
				<div className='container-max'>
					<div className='text-center mb-12'>
						<span className='badge-primary mb-3'>Fikrlar</span>
						<h2 className='text-3xl md:text-4xl font-bold mt-2'>Foydalanuvchilar nima deydi?</h2>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						{testimonials.map((t) => (
							<div key={t.name} className='bg-surface-50 rounded-2xl p-6 border border-border'>
								{/* Stars */}
								<div className='flex gap-0.5 mb-4'>
									{Array.from({ length: t.rating }).map((_, i) => (
										<Star key={i} className='w-4 h-4 fill-amber-400 text-amber-400' />
									))}
								</div>
								<p className='text-sm text-foreground/80 leading-relaxed mb-5'>"{t.text}"</p>
								<div className='flex items-center gap-3'>
									<div className='w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm'>
										{t.avatar}
									</div>
									<div>
										<div className='font-semibold text-sm'>{t.name}</div>
										<div className='text-xs text-muted-foreground'>{t.role}</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* ─── CTA ──────────────────────────────────────── */}
			<section className='section bg-gradient-to-br from-primary via-orange-500 to-amber-500 text-white'>
				<div className='container-max text-center'>
					<div className='max-w-2xl mx-auto'>
						<h2 className='text-3xl md:text-5xl font-bold mb-4 leading-tight'>
							Bugun boshlang!
						</h2>
						<p className='text-white/80 mb-10 text-base md:text-lg'>
							Minglab foydalanuvchilar allaqachon BuildHub orqali o'z muammolarini hal qilishmoqda.
						</p>
						<div className='flex flex-col sm:flex-row gap-3 justify-center'>
							<Link
								to='/auth/register?role=CLIENT'
								className='inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-7 py-3.5 rounded-xl hover:bg-white/90 transition-all active:scale-95 shadow-float text-sm md:text-base'
							>
								Mijoz sifatida boshlash <ArrowRight className='w-4 h-4' />
							</Link>
							<Link
								to='/auth/register?role=WORKER'
								className='inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-bold px-7 py-3.5 rounded-xl hover:bg-white/25 transition-all active:scale-95 text-sm md:text-base backdrop-blur-sm'
							>
								Usta sifatida boshlash
							</Link>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
