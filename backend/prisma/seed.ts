import { PrismaClient, WorkerCategory } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Categories
  const categories: Array<{ slug: WorkerCategory; nameUz: string; nameRu: string; nameEn: string; icon: string; order: number }> = [
    { slug: 'BUILDER', nameUz: 'Quruvchi', nameRu: 'Строитель', nameEn: 'Builder', icon: '🏗️', order: 1 },
    { slug: 'ELECTRICIAN', nameUz: 'Elektrik', nameRu: 'Электрик', nameEn: 'Electrician', icon: '⚡', order: 2 },
    { slug: 'PLUMBER', nameUz: 'Santexnik', nameRu: 'Сантехник', nameEn: 'Plumber', icon: '🔧', order: 3 },
    { slug: 'PAINTER', nameUz: 'Molyar', nameRu: 'Маляр', nameEn: 'Painter', icon: '🎨', order: 4 },
    { slug: 'CARPENTER', nameUz: 'Duradgor', nameRu: 'Плотник', nameEn: 'Carpenter', icon: '🪚', order: 5 },
    { slug: 'INTERIOR_DESIGNER', nameUz: 'Interyer Dizayner', nameRu: 'Дизайнер интерьера', nameEn: 'Interior Designer', icon: '🛋️', order: 6 },
    { slug: 'ARCHITECT', nameUz: 'Arxitektor', nameRu: 'Архитектор', nameEn: 'Architect', icon: '📐', order: 7 },
    { slug: 'TILE_INSTALLER', nameUz: 'Plitka ustasi', nameRu: 'Плиточник', nameEn: 'Tile Installer', icon: '🏠', order: 8 },
    { slug: 'ROOFER', nameUz: 'Tom ustasi', nameRu: 'Кровельщик', nameEn: 'Roofer', icon: '🏘️', order: 9 },
    { slug: 'WELDER', nameUz: 'Payvandchi', nameRu: 'Сварщик', nameEn: 'Welder', icon: '🔥', order: 10 },
    { slug: 'SMART_HOME', nameUz: 'Smart Home Ustasi', nameRu: 'Специалист Smart Home', nameEn: 'Smart Home Installer', icon: '🏡', order: 11 },
    { slug: 'HVAC_SPECIALIST', nameUz: 'HVAC Mutaxassisi', nameRu: 'Специалист HVAC', nameEn: 'HVAC Specialist', icon: '❄️', order: 12 },
    { slug: 'PLASTERER', nameUz: 'Suvoqchi', nameRu: 'Штукатур', nameEn: 'Plasterer', icon: '🧱', order: 13 },
    { slug: 'STUCCO_WORKER', nameUz: 'Gajak ustasi', nameRu: 'Лепщик', nameEn: 'Stucco Worker', icon: '🪣', order: 14 },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    });
  }
  console.log('✅ Categories seeded');

  // Admin user
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@buildhub.uz' },
    create: {
      email: 'admin@buildhub.uz',
      firstName: 'Admin',
      lastName: 'BuildHub',
      passwordHash: adminHash,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
    update: {},
  });
  console.log('✅ Admin user created:', admin.email);

  // Test client
  const clientHash = await bcrypt.hash('Client123!', 12);
  const client = await prisma.user.upsert({
    where: { email: 'client@test.uz' },
    create: {
      email: 'client@test.uz',
      firstName: 'Alisher',
      lastName: 'Testov',
      phone: '+998901234567',
      passwordHash: clientHash,
      role: 'CLIENT',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    },
    update: {},
  });
  console.log('✅ Test client created:', client.email);

  // Test worker
  const workerHash = await bcrypt.hash('Worker123!', 12);
  const worker = await prisma.user.upsert({
    where: { email: 'worker@test.uz' },
    create: {
      email: 'worker@test.uz',
      firstName: 'Bobur',
      lastName: 'Ustaxonov',
      phone: '+998901234568',
      passwordHash: workerHash,
      role: 'WORKER',
      status: 'ACTIVE',
      emailVerified: true,
      phoneVerified: true,
    },
    update: {},
  });

  // Worker profile
  await prisma.workerProfile.upsert({
    where: { userId: worker.id },
    create: {
      userId: worker.id,
      category: 'ELECTRICIAN',
      bio: 'Professional elektrik usta, 8 yillik tajriba. Har qanday elektr ishlari.',
      experience: 8,
      hourlyRate: 50000,
      dailyRate: 350000,
      minProjectBudget: 200000,
      status: 'AVAILABLE',
      verificationStatus: 'VERIFIED',
      isVerified: true,
      rating: 4.8,
      reviewCount: 45,
      completedProjects: 123,
      city: 'Toshkent',
      region: 'Toshkent viloyati',
    },
    update: {},
  });
  console.log('✅ Test worker created:', worker.email);

  // Commission settings
  await prisma.commissionSetting.upsert({
    where: { name: 'default' },
    create: {
      name: 'default',
      clientRate: 0.05,
      workerRate: 0.10,
    },
    update: {},
  });

  // Platform settings
  const settings = [
    { key: 'platform_name', value: 'BuildHub', type: 'string' },
    { key: 'maintenance_mode', value: 'false', type: 'boolean' },
    { key: 'max_images_per_project', value: '10', type: 'number' },
    { key: 'min_bid_amount', value: '100000', type: 'number' },
  ];

  for (const s of settings) {
    await prisma.platformSetting.upsert({
      where: { key: s.key },
      create: s,
      update: s,
    });
  }

  console.log('✅ Platform settings configured');
  console.log('\n🎉 Database seeded successfully!');
  console.log('\nTest credentials:');
  console.log('  Admin:  admin@buildhub.uz / Admin123!');
  console.log('  Client: client@test.uz / Client123!');
  console.log('  Worker: worker@test.uz / Worker123!');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
