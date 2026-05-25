import { HardHat, Mail, Phone, MapPin, Instagram, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
	return (
		<footer className='bg-gray-950 text-gray-400'>
			{/* Main footer */}
			<div className='max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-10'>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10'>
					{/* Brand */}
					<div className='sm:col-span-2 lg:col-span-1'>
						<Link to='/' className='flex items-center gap-2.5 mb-4 group'>
							<div className='w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform'>
								<HardHat className='w-5 h-5 text-white' />
							</div>
							<span className='font-bold text-lg text-white'>
								Build<span className='text-primary'>Hub</span>
							</span>
						</Link>
						<p className='text-sm leading-relaxed mb-6'>
							O'zbekistonning eng yirik qurilish va ta'mirlash xizmatlari platformasi. Ishonchli
							ustalar, xavfsiz to'lov.
						</p>
						<div className='flex items-center gap-3'>
							<a
								href='#'
								className='w-8 h-8 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-lg flex items-center justify-center transition-all'
							>
								<Instagram className='w-4 h-4' />
							</a>
							<a
								href='#'
								className='w-8 h-8 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-lg flex items-center justify-center transition-all'
							>
								<Send className='w-4 h-4' />
							</a>
						</div>
					</div>

					{/* Platforma */}
					<div>
						<h3 className='text-white font-semibold text-sm mb-4'>Platforma</h3>
						<ul className='space-y-3 text-sm'>
							{[
								{ to: '/projects', label: 'Loyihalar' },
								{ to: '/workers', label: 'Ustalar' },
								{ to: '/auth/register', label: "Ro'yxatdan o'tish" },
								{ to: '/auth/login', label: 'Kirish' },
							].map((item) => (
								<li key={item.to}>
									<Link
										to={item.to}
										className='hover:text-white hover:translate-x-1 transition-all inline-block'
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Xizmatlar */}
					<div>
						<h3 className='text-white font-semibold text-sm mb-4'>Xizmatlar</h3>
						<ul className='space-y-3 text-sm'>
							{['Quruvchi', 'Elektrik', 'Santexnik', 'Molyar', 'Duradgor', 'Dizayner'].map(
								(service) => (
									<li key={service} className='hover:text-white transition-colors cursor-default'>
										{service}
									</li>
								),
							)}
						</ul>
					</div>

					{/* Aloqa */}
					<div>
						<h3 className='text-white font-semibold text-sm mb-4'>Aloqa</h3>
						<ul className='space-y-3 text-sm'>
							<li className='flex items-center gap-2.5 hover:text-white transition-colors'>
								<Mail className='w-3.5 h-3.5 text-primary flex-shrink-0' />
								info@buildhub.uz
							</li>
							<li className='flex items-center gap-2.5 hover:text-white transition-colors'>
								<Phone className='w-3.5 h-3.5 text-primary flex-shrink-0' />
								+998 71 200 00 00
							</li>
							<li className='flex items-start gap-2.5 hover:text-white transition-colors'>
								<MapPin className='w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5' />
								Toshkent, O'zbekiston
							</li>
						</ul>
					</div>
				</div>
			</div>

			{/* Bottom bar */}
			<div className='border-t border-white/5'>
				<div className='max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs'>
					<span>© {new Date().getFullYear()} BuildHub. Barcha huquqlar himoyalangan.</span>
					<div className='flex items-center gap-5'>
						<a href='#' className='hover:text-white transition-colors'>Maxfiylik siyosati</a>
						<a href='#' className='hover:text-white transition-colors'>Foydalanish shartlari</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
