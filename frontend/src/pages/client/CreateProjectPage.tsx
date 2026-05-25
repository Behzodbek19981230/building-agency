import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectsService } from '@services/projects.service';
import { Upload, X, MapPin, Banknote, Info, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone';
import { Button, Input, Textarea, Select, MoneyInput, Card, CardTitle } from '@ui';
import { clsx } from 'clsx';

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

const urgencyOptions = [
	{ value: 'LOW', label: "Past — 1 oy ichida" },
	{ value: 'MEDIUM', label: "O'rta — 2 hafta ichida" },
	{ value: 'HIGH', label: "Yuqori — 1 hafta ichida" },
	{ value: 'URGENT', label: "Shoshilinch — 24 soat" },
];

const cityOptions = [
	{ value: 'Toshkent', label: 'Toshkent' },
	{ value: 'Samarqand', label: 'Samarqand' },
	{ value: 'Buxoro', label: 'Buxoro' },
	{ value: 'Namangan', label: 'Namangan' },
	{ value: 'Andijon', label: 'Andijon' },
	{ value: 'Farg\'ona', label: "Farg'ona" },
	{ value: 'Qo\'qon', label: "Qo'qon" },
	{ value: 'Nukus', label: 'Nukus' },
	{ value: 'Qarshi', label: 'Qarshi' },
	{ value: 'Termiz', label: 'Termiz' },
	{ value: 'Jizzax', label: 'Jizzax' },
	{ value: 'Navoiy', label: 'Navoiy' },
];

export function CreateProjectPage() {
	const navigate = useNavigate();
	const [images, setImages] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);

	const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
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
		<div className='max-w-2xl mx-auto pb-4'>
			<div className='mb-6'>
				<h1 className='text-2xl font-bold mb-1'>Yangi loyiha yaratish</h1>
				<p className='text-muted-foreground text-sm'>Loyihangiz haqida to'liq ma'lumot bering — shunda usta to'g'ri narx taklif qila oladi</p>
			</div>

			<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
				{/* ─── Asosiy ma'lumotlar ─── */}
				<Card padding='md'>
					<div className='flex items-center gap-2 mb-5'>
						<div className='w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center'>
							<Info className='w-4 h-4 text-primary' />
						</div>
						<CardTitle>Asosiy ma'lumotlar</CardTitle>
					</div>

					<div className='space-y-4'>
						<Input
							label="Loyiha nomi *"
							placeholder="Masalan: Oshxona ta'miri"
							error={errors.title?.message}
							{...register('title')}
						/>

						<Textarea
							label="Tavsif *"
							rows={5}
							placeholder="Nima qilinishi kerakligini batafsil yozing: xona o'lchami, materiallar, qo'shimcha talablar..."
							error={errors.description?.message}
							showCount
							maxLength={2000}
							{...register('description')}
						/>

						<Controller
							name='urgency'
							control={control}
							render={({ field }) => (
								<Select
									label='Shoshilinchlik darajasi'
									options={urgencyOptions}
									value={field.value}
									onChange={(val) => field.onChange(val)}
									error={errors.urgency?.message}
								/>
							)}
						/>
					</div>
				</Card>

				{/* ─── Byudjet ─── */}
				<Card padding='md'>
					<div className='flex items-center gap-2 mb-5'>
						<div className='w-8 h-8 bg-emerald-50 rounded-xl flex items-center justify-center'>
							<Banknote className='w-4 h-4 text-emerald-600' />
						</div>
						<CardTitle>Byudjet</CardTitle>
					</div>

					<div className='space-y-4'>
						<div className='grid grid-cols-2 gap-4'>
							<Controller
								name='budgetMin'
								control={control}
								render={({ field }) => (
									<MoneyInput
										label='Minimal byudjet'
										placeholder='500 000'
										value={field.value}
										onChange={(raw) => field.onChange(raw)}
										error={errors.budgetMin?.message}
										hint="So'mda kiriting"
										min={0}
									/>
								)}
							/>
							<Controller
								name='budgetMax'
								control={control}
								render={({ field }) => (
									<MoneyInput
										label='Maksimal byudjet'
										placeholder='2 000 000'
										value={field.value}
										onChange={(raw) => field.onChange(raw)}
										error={errors.budgetMax?.message}
										hint="So'mda kiriting"
										min={0}
									/>
								)}
							/>
						</div>

						<div className='bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2'>
							<Info className='w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5' />
							<p className='text-xs text-amber-700'>
								Byudjetni ko'rsatmasangiz ham bo'ladi — ustalar o'zlari narx taklif qiladi. Byudjet faqat sizga mos takliflarni saralashga yordam beradi.
							</p>
						</div>
					</div>
				</Card>

				{/* ─── Joylashuv ─── */}
				<Card padding='md'>
					<div className='flex items-center gap-2 mb-5'>
						<div className='w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center'>
							<MapPin className='w-4 h-4 text-blue-600' />
						</div>
						<CardTitle>Joylashuv</CardTitle>
					</div>

					<div className='space-y-4'>
						<Controller
							name='city'
							control={control}
							render={({ field }) => (
								<Select
									label='Shahar'
									options={cityOptions}
									value={field.value ?? null}
									onChange={(val) => field.onChange(val)}
									placeholder='Shaharni tanlang...'
									isClearable
								/>
							)}
						/>

						<Input
							label='Manzil (ixtiyoriy)'
							placeholder="Ko'cha, uy raqami"
							{...register('address')}
						/>
					</div>
				</Card>

				{/* ─── Rasmlar ─── */}
				<Card padding='md'>
					<div className='flex items-center gap-2 mb-5'>
						<div className='w-8 h-8 bg-purple-50 rounded-xl flex items-center justify-center'>
							<ImageIcon className='w-4 h-4 text-purple-600' />
						</div>
						<CardTitle>Rasmlar <span className='text-muted-foreground font-normal text-sm'>(ixtiyoriy, max 10)</span></CardTitle>
					</div>

					<div
						{...getRootProps()}
						className={clsx(
							'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
							isDragActive
								? 'border-primary bg-primary/5 scale-[0.99]'
								: 'border-border hover:border-primary/50 hover:bg-muted/30',
						)}
					>
						<input {...getInputProps()} />
						<Upload className={clsx('w-8 h-8 mx-auto mb-3 transition-colors', isDragActive ? 'text-primary' : 'text-muted-foreground')} />
						<p className='text-sm font-medium mb-1'>
							{isDragActive ? 'Rasmni tashlang!' : 'Rasmlarni bu yerga tashlang'}
						</p>
						<p className='text-xs text-muted-foreground'>yoki bosib tanlang · PNG, JPG, WEBP · Max 10 ta</p>
					</div>

					{previews.length > 0 && (
						<div className='grid grid-cols-4 sm:grid-cols-5 gap-2 mt-4'>
							{previews.map((src, i) => (
								<div key={i} className='relative group rounded-xl overflow-hidden aspect-square'>
									<img src={src} alt='' className='w-full h-full object-cover' />
									<div className='absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors' />
									<button
										type='button'
										onClick={() => removeImage(i)}
										className='absolute top-1 right-1 w-6 h-6 bg-black/70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500'
									>
										<X className='w-3 h-3' />
									</button>
								</div>
							))}
						</div>
					)}
				</Card>

				{/* ─── Actions ─── */}
				<div className='flex gap-3 pt-2'>
					<Button
						type='button'
						variant='outline'
						size='lg'
						onClick={() => navigate(-1)}
						className='flex-1'
					>
						Bekor qilish
					</Button>
					<Button
						type='submit'
						loading={isSubmitting}
						size='lg'
						className='flex-1'
					>
						Loyiha yaratish
					</Button>
				</div>
			</form>
		</div>
	);
}
