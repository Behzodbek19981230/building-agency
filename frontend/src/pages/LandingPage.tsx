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
	CheckCircle,
} from 'lucide-react';

const categories = [
	{ name: 'Quruvchi', icon: Building2, color: 'bg-blue-100 text-blue-600', slug: 'BUILDER' },
	{ name: 'Elektrik', icon: Plug, color: 'bg-yellow-100 text-yellow-600', slug: 'ELECTRICIAN' },
	{ name: 'Santexnik', icon: Droplets, color: 'bg-cyan-100 text-cyan-600', slug: 'PLUMBER' },
	{ name: 'Molyar', icon: Paintbrush, color: 'bg-purple-100 text-purple-600', slug: 'PAINTER' },
	{ name: 'Duradgor', icon: Wrench, color: 'bg-amber-100 text-amber-600', slug: 'CARPENTER' },
	{ name: 'Interyer Dizayner', icon: Home, color: 'bg-pink-100 text-pink-600', slug: 'INTERIOR_DESIGNER' },
];

const features = [
	{ icon: Zap, title: 'Tez topish', desc: 'Bir necha daqiqada yaqin joydagi usta toping' },
	{ icon: Shield, title: "Xavfsiz to'lov", desc: 'Escrow tizimi — pul faqat ish tugagach chiqariladi' },
	{ icon: Star, title: 'Ishonchli ustalar', desc: 'Har bir usta tekshirilgan va reytinglangan' },
];

const stats = [
	{ value: '5,000+', label: "Ro'yxatdan o'tgan usta" },
	{ value: '12,000+', label: 'Bajarilgan loyiha' },
	{ value: '4.8★', label: "O'rtacha reyting" },
	{ value: '98%', label: 'Mamnun mijozlar' },
];

export function LandingPage() {
	return (
		<div className='overflow-hidden'>
			{/* Hero */}
			<section className='relative bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 text-white py-24 px-4'>
				<div
					className='absolute inset-0 opacity-10'
					style={{
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}}
				/>

				<div className='relative max-w-5xl mx-auto text-center'>
					<div className='inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 text-sm mb-6 backdrop-blur-sm'>
						<HardHat className='w-4 h-4' />
						<span>O'zbekistonning #1 qurilish platformasi</span>
					</div>

					<h1 className='text-4xl md:text-6xl font-extrabold mb-6 leading-tight'>
						Qurilish va ta'mirlash uchun
						<br />
						<span className='text-blue-300'>ishonchli ustani toping</span>
					</h1>

					<p className='text-xl text-blue-200 mb-10 max-w-2xl mx-auto'>
						Minglab tekshirilgan quruvchi, elektrik, santexnik, molyar va boshqa mutaxassislar bir
						platformada.
					</p>

					<div className='flex flex-col sm:flex-row gap-4 justify-center'>
						<Link
							to='/auth/register'
							className='bg-white text-blue-900 hover:bg-blue-50 font-bold px-8 py-4 rounded-xl text-lg transition-all shadow-lg hover:shadow-xl flex items-center gap-2 justify-center'
						>
							Boshlash <ChevronRight className='w-5 h-5' />
						</Link>
						<Link
							to='/workers'
							className='bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-xl text-lg transition-all flex items-center gap-2 justify-center'
						>
							Ustalarni ko'rish
						</Link>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className='bg-white border-b py-12'>
				<div className='max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8'>
					{stats.map((s) => (
						<div key={s.label} className='text-center'>
							<div className='text-3xl font-extrabold text-primary mb-1'>{s.value}</div>
							<div className='text-sm text-muted-foreground'>{s.label}</div>
						</div>
					))}
				</div>
			</section>

			{/* Categories */}
			<section className='py-20 px-4 bg-gray-50'>
				<div className='max-w-5xl mx-auto'>
					<h2 className='text-3xl font-bold text-center mb-3'>Xizmat turlari</h2>
					<p className='text-muted-foreground text-center mb-12'>
						Barcha qurilish va ta'mirlash xizmatlarini bir joyda toping
					</p>

					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{categories.map((cat) => {
							const Icon = cat.icon;
							return (
								<Link
									key={cat.slug}
									to={`/workers?category=${cat.slug}`}
									className='card p-4 text-center hover:shadow-md hover:-translate-y-1 transition-all group'
								>
									<div
										className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
									>
										<Icon className='w-6 h-6' />
									</div>
									<span className='text-sm font-medium'>{cat.name}</span>
								</Link>
							);
						})}
					</div>

					<div className='text-center mt-8'>
						<Link to='/workers' className='btn-outline'>
							Barcha xizmatlar →
						</Link>
					</div>
				</div>
			</section>

			{/* Features */}
			<section className='py-20 px-4 bg-white'>
				<div className='max-w-5xl mx-auto'>
					<h2 className='text-3xl font-bold text-center mb-12'>Nima uchun BuildHub?</h2>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
						{features.map((f) => {
							const Icon = f.icon;
							return (
								<div key={f.title} className='text-center p-6'>
									<div className='w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4'>
										<Icon className='w-7 h-7 text-primary' />
									</div>
									<h3 className='font-bold text-lg mb-2'>{f.title}</h3>
									<p className='text-muted-foreground text-sm'>{f.desc}</p>
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className='py-20 px-4 bg-gray-50'>
				<div className='max-w-4xl mx-auto'>
					<h2 className='text-3xl font-bold text-center mb-12'>Qanday ishlaydi?</h2>
					<div className='grid md:grid-cols-2 gap-12'>
						<div>
							<h3 className='font-bold text-xl mb-6 text-primary'>Mijoz uchun</h3>
							{[
								'Loyiha yarating va rasm yuklang',
								'Ustalar takliflarini qabul qiling',
								'Eng yaxshisini tanlang',
								'Ishni kuzating va baho bering',
							].map((step, i) => (
								<div key={i} className='flex items-center gap-3 mb-4'>
									<div className='w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold flex-shrink-0'>
										{i + 1}
									</div>
									<span className='text-sm'>{step}</span>
								</div>
							))}
						</div>
						<div>
							<h3 className='font-bold text-xl mb-6 text-green-600'>Usta uchun</h3>
							{[
								'Profilingizni yarating',
								"Portfolio va malaka qo'shing",
								'Loyihalarga taklif bering',
								'Ishni bajaring va daromad toping',
							].map((step, i) => (
								<div key={i} className='flex items-center gap-3 mb-4'>
									<CheckCircle className='w-8 h-8 text-green-500 flex-shrink-0' />
									<span className='text-sm'>{step}</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			{/* CTA */}
			<section className='py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center'>
				<h2 className='text-3xl font-bold mb-4'>Bugun boshlang!</h2>
				<p className='text-blue-200 mb-8 max-w-lg mx-auto'>
					Minglab foydalanuvchilar allaqachon BuildHub orqali o'z muammolarini hal qilishmoqda.
				</p>
				<div className='flex flex-col sm:flex-row gap-4 justify-center'>
					<Link
						to='/auth/register?role=CLIENT'
						className='bg-white text-blue-900 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors'
					>
						Mijoz sifatida kirish
					</Link>
					<Link
						to='/auth/register?role=WORKER'
						className='bg-white/10 border border-white/20 text-white font-bold px-8 py-3 rounded-xl hover:bg-white/20 transition-colors'
					>
						Usta sifatida kirish
					</Link>
				</div>
			</section>
		</div>
	);
}
