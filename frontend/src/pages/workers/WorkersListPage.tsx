import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { workersService } from '@services/workers.service';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { SearchInput, Select, Avatar, Pagination, SkeletonWorkerPublicCard } from '@ui';
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
				limit: 10,
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
				<div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
					{Array.from({ length: 8 }).map((_, i) => <SkeletonWorkerPublicCard key={i} />)}
				</div>
			) : workers.length === 0 ? (
				<div className='text-center py-20 text-muted-foreground'>Ustalar topilmadi</div>
			) : (
				<div className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
					{workers.map((w: any) => (
						<Link
							key={w.id}
							to={`/workers/${w.id}`}
							className='card p-5 hover:shadow-card-hover transition-shadow block'
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

							<div className='flex items-center justify-between text-xs text-muted-foreground mb-3'>
								<div className='flex items-center gap-1'>
									<MapPin className='w-3 h-3' /> {w.city || '—'}
								</div>
								<div>{w.completedProjects} loyiha</div>
							</div>

							{/* Services with sub-item prices */}
							{(() => {
								const allItems = (w.skills ?? []).flatMap((s: any) =>
									(s.items ?? []).map((i: any) => ({ ...i, skillName: s.name }))
								).slice(0, 4);
								if (!allItems.length) return null;
								return (
									<div className='border-t divide-y divide-border mt-1'>
										{allItems.map((item: any) => (
											<div key={item.id} className='flex items-center justify-between py-1.5 gap-2'>
												<span className='text-xs text-muted-foreground truncate'>{item.name}</span>
												<span className='text-xs font-semibold text-primary whitespace-nowrap shrink-0'>
													{Number(item.price).toLocaleString()} so'm
												</span>
											</div>
										))}
									</div>
								);
							})()}
						</Link>
					))}
				</div>
			)}

			{/* ─── Pagination ─── */}
			{meta && (
				<Pagination
					page={page}
					totalPages={meta.totalPages}
					total={meta.total}
					limit={10}
					onChange={setPage}
					className='mt-10'
				/>
			)}
		</div>
	);
}
