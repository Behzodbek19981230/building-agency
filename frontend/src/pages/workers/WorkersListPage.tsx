import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { workersService } from '@services/workers.service';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { SearchInput, Select, PageSpinner, Avatar, MoneyDisplay } from '@ui';
import { getImageUrl } from '@/utils/image';

const categoryOptions = [
	{ value: '', label: 'Barcha xizmatlar' },
	{ value: 'BUILDER', label: 'Quruvchi' },
	{ value: 'ELECTRICIAN', label: 'Elektrik' },
	{ value: 'PLUMBER', label: 'Santexnik' },
	{ value: 'PAINTER', label: 'Molyar' },
	{ value: 'CARPENTER', label: 'Duradgor' },
	{ value: 'INTERIOR_DESIGNER', label: 'Interyer Dizayner' },
	{ value: 'ARCHITECT', label: 'Arxitektor' },
	{ value: 'TILE_INSTALLER', label: 'Plitka ustasi' },
	{ value: 'ROOFER', label: 'Tom ustasi' },
	{ value: 'WELDER', label: 'Payvandchi' },
	{ value: 'SMART_HOME', label: 'Smart Home' },
	{ value: 'HVAC_SPECIALIST', label: 'HVAC Mutaxassisi' },
	{ value: 'PLASTERER', label: 'Suvoqchi' },
	{ value: 'STUCCO_WORKER', label: 'Shtukaturchi' },
];

const categoryLabels: Record<string, string> = Object.fromEntries(
	categoryOptions.slice(1).map((o) => [o.value, o.label]),
);

export function WorkersListPage() {
	const [searchParams] = useSearchParams();
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState(searchParams.get('category') || '');
	const [page, setPage] = useState(1);

	const { data, isLoading } = useQuery({
		queryKey: ['workers', search, category, page],
		queryFn: () =>
			workersService.getAll({
				search: search || undefined,
				category: category || undefined,
				page,
				limit: 12,
			}),
	});

	const workers = data?.data?.data || [];
	const meta = data?.data?.meta;

	return (
		<div className='max-w-6xl mx-auto px-4 py-8'>
			<h1 className='text-3xl font-bold mb-1'>Ustalar</h1>
			<p className='text-muted-foreground mb-6'>Tasdiqlangan va reytinglangan mutaxassislar</p>

			{/* ─── Filters ─── */}
			<div className='flex gap-3 mb-6 flex-wrap items-end'>
				<SearchInput
					placeholder='Usta qidirish...'
					value={search}
					onChange={(e) => { setSearch(e.target.value); setPage(1); }}
					wrapperClassName='flex-1 min-w-52'
				/>
				<Select
					options={categoryOptions}
					value={category}
					onChange={(val) => { setCategory(String(val ?? '')); setPage(1); }}
					placeholder='Barcha xizmatlar'
					isClearable
					wrapperClassName='w-56'
				/>
			</div>

			{/* ─── Content ─── */}
			{isLoading ? (
				<PageSpinner label='Ustalar yuklanmoqda...' />
			) : workers.length === 0 ? (
				<div className='text-center py-20 text-muted-foreground'>Ustalar topilmadi</div>
			) : (
				<div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
					{workers.map((w: any) => (
						<Link
							key={w.id}
							to={`/workers/${w.id}`}
							className='card p-5 hover:shadow-card-hover hover:-translate-y-0.5 transition-all block'
						>
							<div className='flex items-center gap-3 mb-3'>
								<div className='relative'>
									<Avatar
										src={getImageUrl(w.user?.avatar)}
										name={`${w.user?.firstName} ${w.user?.lastName}`}
										size='md'
										shape='circle'
									/>
									{w.isVerified && (
										<div className='absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center border-2 border-white'>
											<CheckCircle className='w-3 h-3 text-white' />
										</div>
									)}
								</div>
								<div className='flex-1 min-w-0'>
									<div className='font-semibold text-sm truncate'>
										{w.user?.firstName} {w.user?.lastName}
									</div>
									<div className='text-xs text-muted-foreground'>
										{categoryLabels[w.category] || w.category}
									</div>
								</div>
							</div>

							<div className='flex items-center gap-0.5 mb-2'>
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className={`w-3.5 h-3.5 ${i < Math.round(w.rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}`}
									/>
								))}
								<span className='text-xs text-muted-foreground ml-1'>
									{w.rating?.toFixed(1)} ({w.reviewCount})
								</span>
							</div>

							{w.bio && (
								<p className='text-xs text-muted-foreground line-clamp-2 mb-3'>{w.bio}</p>
							)}

							<div className='flex items-center justify-between text-xs text-muted-foreground'>
								<div className='flex items-center gap-1'>
									<MapPin className='w-3 h-3' /> {w.city || '—'}
								</div>
								<div>{w.completedProjects} loyiha</div>
							</div>

							{w.hourlyRate && (
								<div className='mt-3 pt-3 border-t text-xs flex items-center justify-between'>
									<span className='text-muted-foreground'>Soatlik:</span>
									<MoneyDisplay amount={w.hourlyRate} size='sm' className='text-primary font-semibold' />
								</div>
							)}
						</Link>
					))}
				</div>
			)}

			{/* ─── Pagination ─── */}
			{meta && meta.totalPages > 1 && (
				<div className='flex justify-center gap-2 mt-10'>
					{Array.from({ length: Math.min(meta.totalPages, 10) }, (_, i) => i + 1).map((p) => (
						<button
							key={p}
							onClick={() => setPage(p)}
							className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
								p === page
									? 'bg-primary text-white shadow-sm'
									: 'border border-border hover:bg-muted'
							}`}
						>
							{p}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
