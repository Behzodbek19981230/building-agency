import {
  PrismaClient,
  WorkerCategory,
  UserRole,
  UserStatus,
  WorkerStatus,
  VerificationStatus,
  ProjectStatus,
  ProjectUrgency,
  BidStatus,
  PaymentStatus,
  EscrowStatus,
  DisputeStatus,
  NotificationType,
  MessageType,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── helpers ─────────────────────────────────────────────────────────────────

const hash = (pw: string) => bcrypt.hash(pw, 10);

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

// ─── CATEGORIES ──────────────────────────────────────────────────────────────

async function seedCategories() {
  const rows: Array<{
    slug: WorkerCategory;
    nameUz: string;
    nameRu: string;
    nameEn: string;
    icon: string;
    order: number;
  }> = [
    { slug: 'BUILDER',          nameUz: 'Quruvchi',            nameRu: 'Строитель',              nameEn: 'Builder',            icon: '🏗️', order: 1  },
    { slug: 'ELECTRICIAN',      nameUz: 'Elektrik',            nameRu: 'Электрик',               nameEn: 'Electrician',        icon: '⚡',  order: 2  },
    { slug: 'PLUMBER',          nameUz: 'Santexnik',           nameRu: 'Сантехник',              nameEn: 'Plumber',            icon: '🔧', order: 3  },
    { slug: 'PAINTER',          nameUz: 'Molyar',              nameRu: 'Маляр',                  nameEn: 'Painter',            icon: '🎨', order: 4  },
    { slug: 'CARPENTER',        nameUz: 'Duradgor',            nameRu: 'Плотник',                nameEn: 'Carpenter',          icon: '🪚', order: 5  },
    { slug: 'INTERIOR_DESIGNER',nameUz: 'Interyer Dizayner',   nameRu: 'Дизайнер интерьера',     nameEn: 'Interior Designer',  icon: '🛋️', order: 6  },
    { slug: 'ARCHITECT',        nameUz: 'Arxitektor',          nameRu: 'Архитектор',             nameEn: 'Architect',          icon: '📐', order: 7  },
    { slug: 'TILE_INSTALLER',   nameUz: 'Plitka ustasi',       nameRu: 'Плиточник',              nameEn: 'Tile Installer',     icon: '🏠', order: 8  },
    { slug: 'ROOFER',           nameUz: 'Tom ustasi',          nameRu: 'Кровельщик',             nameEn: 'Roofer',             icon: '🏘️', order: 9  },
    { slug: 'WELDER',           nameUz: 'Payvandchi',          nameRu: 'Сварщик',                nameEn: 'Welder',             icon: '🔥', order: 10 },
    { slug: 'SMART_HOME',       nameUz: 'Smart Home Ustasi',   nameRu: 'Специалист Smart Home',  nameEn: 'Smart Home Installer',icon: '🏡', order: 11 },
    { slug: 'HVAC_SPECIALIST',  nameUz: 'HVAC Mutaxassisi',    nameRu: 'Специалист HVAC',        nameEn: 'HVAC Specialist',    icon: '❄️', order: 12 },
    { slug: 'PLASTERER',        nameUz: 'Suvoqchi',            nameRu: 'Штукатур',               nameEn: 'Plasterer',          icon: '🧱', order: 13 },
    { slug: 'STUCCO_WORKER',    nameUz: 'Gajak ustasi',        nameRu: 'Лепщик',                 nameEn: 'Stucco Worker',      icon: '🪣', order: 14 },
  ];

  for (const cat of rows) {
    await prisma.category.upsert({ where: { slug: cat.slug }, create: cat, update: cat });
  }
  console.log('✅ Categories');
}

// ─── USERS ───────────────────────────────────────────────────────────────────

async function seedUsers() {
  // Admin
  await prisma.user.upsert({
    where: { email: 'admin@buildhub.uz' },
    create: {
      email: 'admin@buildhub.uz', firstName: 'Admin', lastName: 'BuildHub',
      passwordHash: await hash('Admin123!'), role: UserRole.ADMIN,
      status: UserStatus.ACTIVE, emailVerified: true,
    },
    update: {},
  });

  // Clients
  const clients = [
    { email: 'alisher@test.uz', firstName: 'Alisher', lastName: 'Karimov',  phone: '+998901111001' },
    { email: 'dilnoza@test.uz', firstName: 'Dilnoza', lastName: 'Yusupova', phone: '+998901111002' },
    { email: 'jasur@test.uz',   firstName: 'Jasur',   lastName: 'Toshmatov',phone: '+998901111003' },
  ];

  for (const c of clients) {
    await prisma.user.upsert({
      where: { email: c.email },
      create: {
        ...c, passwordHash: await hash('Client123!'), role: UserRole.CLIENT,
        status: UserStatus.ACTIVE, emailVerified: true, phoneVerified: true,
      },
      update: {},
    });
  }

  // Workers
  const workers = [
    { email: 'bobur@test.uz',   firstName: 'Bobur',   lastName: 'Usmonov',  phone: '+998902222001',
      cat: WorkerCategory.ELECTRICIAN, bio: 'Professional elektrik usta, 8 yillik tajriba. Har qanday elektr montaj ishlari.',
      exp: 8, hourly: 55000, daily: 380000, min: 250000, rating: 4.8, reviews: 47, completed: 130,
      city: 'Toshkent', region: 'Toshkent shahri', skills: ['Elektr montaj', 'Quvur tortish', "Panel o'rnatish", 'Konditsioner'], featured: true },
    { email: 'sardor@test.uz',  firstName: 'Sardor',  lastName: 'Hamidov',  phone: '+998902222002',
      cat: WorkerCategory.PLUMBER, bio: "Santexnik. Suv quvurlari, kanalizatsiya, vannaxona jihozlash bo'yicha mutaxassis.",
      exp: 6, hourly: 45000, daily: 320000, min: 200000, rating: 4.6, reviews: 31, completed: 87,
      city: 'Toshkent', region: 'Toshkent shahri', skills: ['Quvur ulash', 'Nasoslar', 'Kanalizatsiya', 'Isitish tizimi'], featured: false },
    { email: 'nodir@test.uz',   firstName: 'Nodir',   lastName: 'Raximov',  phone: '+998902222003',
      cat: WorkerCategory.BUILDER, bio: "Quruvchi usta. Poydevor, devor, tom ishlari, turli ta'mirlash ishlari.",
      exp: 12, hourly: 60000, daily: 420000, min: 500000, rating: 4.9, reviews: 68, completed: 210,
      city: 'Samarqand', region: 'Samarqand viloyati', skills: ['Karkasli qurilish', "G'isht terish", 'Beton ishlari', 'Gidroizolyatsiya'], featured: true },
    { email: 'kamol@test.uz',   firstName: 'Kamol',   lastName: 'Sobirov',  phone: '+998902222004',
      cat: WorkerCategory.PAINTER, bio: "Dekorativ bo'yoq, dekor-shtukaturka, fasad bo'yash bo'yicha usta.",
      exp: 5, hourly: 35000, daily: 250000, min: 150000, rating: 4.5, reviews: 22, completed: 64,
      city: 'Buxoro', region: 'Buxoro viloyati', skills: ["Akvarel bo'yash", "Dekorativ bo'yoq", "Fasad bo'yash", "Rol bo'yash"], featured: false },
    { email: 'ulmas@test.uz',   firstName: 'Ulmas',   lastName: 'Ergashev', phone: '+998902222005',
      cat: WorkerCategory.TILE_INSTALLER, bio: "Plitka ustasi. Hammom, oshxona, pol plitkalari o'rnatish.",
      exp: 7, hourly: 50000, daily: 350000, min: 300000, rating: 4.7, reviews: 39, completed: 105,
      city: 'Toshkent', region: 'Toshkent shahri', skills: ['Granit plitka', 'Keramika', 'Mozaika', 'Epoksid fuga'], featured: false },
    { email: 'sherzod@test.uz', firstName: 'Sherzod', lastName: 'Nazarov',  phone: '+998902222006',
      cat: WorkerCategory.CARPENTER, bio: "Duradgor. Eshik, deraza, shkaf, parket o'rnatish.",
      exp: 10, hourly: 48000, daily: 340000, min: 200000, rating: 4.6, reviews: 54, completed: 142,
      city: 'Namangan', region: 'Namangan viloyati', skills: ['Parket yotqizish', "Eshik o'rnatish", 'Shkaf yasash', 'MDF ishlash'], featured: false },
  ];

  for (const w of workers) {
    const user = await prisma.user.upsert({
      where: { email: w.email },
      create: {
        email: w.email, firstName: w.firstName, lastName: w.lastName, phone: w.phone,
        passwordHash: await hash('Worker123!'), role: UserRole.WORKER,
        status: UserStatus.ACTIVE, emailVerified: true, phoneVerified: true,
      },
      update: {},
    });

    const profile = await prisma.workerProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id, category: w.cat, bio: w.bio, experience: w.exp,
        hourlyRate: w.hourly, dailyRate: w.daily, minProjectBudget: w.min,
        status: WorkerStatus.AVAILABLE, verificationStatus: VerificationStatus.VERIFIED,
        isVerified: true, isFeatured: w.featured, rating: w.rating,
        reviewCount: w.reviews, completedProjects: w.completed,
        city: w.city, region: w.region,
      },
      update: {},
    });

    // Skills
    await prisma.workerSkill.deleteMany({ where: { workerProfileId: profile.id } });
    await prisma.workerSkill.createMany({
      data: w.skills.map((name, i) => ({ workerProfileId: profile.id, name, level: 5 - i })),
    });

    // Portfolio (2 items each)
    await prisma.portfolio.deleteMany({ where: { workerProfileId: profile.id } });
    await prisma.portfolio.createMany({
      data: [
        {
          workerProfileId: profile.id, category: w.cat,
          title: `${w.firstName} — loyiha 1`,
          description: 'Muvaffaqiyatli yakunlangan ish. Mijoz 5 yulduz baho berdi.',
          images: [], completedAt: daysAgo(30),
        },
        {
          workerProfileId: profile.id, category: w.cat,
          title: `${w.firstName} — loyiha 2`,
          description: 'Murakkab ob\'ekt. Muddatidan oldin topshirildi.',
          images: [], completedAt: daysAgo(60),
        },
      ],
    });

    // Availability (Mon–Fri)
    await prisma.availability.deleteMany({ where: { workerProfileId: profile.id } });
    await prisma.availability.createMany({
      data: [1, 2, 3, 4, 5].map((day) => ({
        workerProfileId: profile.id, dayOfWeek: day,
        startTime: '09:00', endTime: '18:00', isAvailable: true,
      })),
    });
  }

  console.log('✅ Users, worker profiles, skills, portfolios, availability');
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

async function seedProjects() {
  const alisher = await prisma.user.findUnique({ where: { email: 'alisher@test.uz' } });
  const dilnoza = await prisma.user.findUnique({ where: { email: 'dilnoza@test.uz' } });
  const jasur   = await prisma.user.findUnique({ where: { email: 'jasur@test.uz'   } });

  const bobur   = await prisma.user.findUnique({ where: { email: 'bobur@test.uz'   } });
  const sardor  = await prisma.user.findUnique({ where: { email: 'sardor@test.uz'  } });
  const nodir   = await prisma.user.findUnique({ where: { email: 'nodir@test.uz'   } });
  const ulmas   = await prisma.user.findUnique({ where: { email: 'ulmas@test.uz'   } });

  const boburProfile  = await prisma.workerProfile.findUnique({ where: { userId: bobur!.id   } });
  const sardorProfile = await prisma.workerProfile.findUnique({ where: { userId: sardor!.id  } });
  const nodirProfile  = await prisma.workerProfile.findUnique({ where: { userId: nodir!.id   } });
  const ulmasProfile  = await prisma.workerProfile.findUnique({ where: { userId: ulmas!.id   } });

  const catElec  = await prisma.category.findUnique({ where: { slug: 'ELECTRICIAN'   } });
  const catPlumb = await prisma.category.findUnique({ where: { slug: 'PLUMBER'       } });
  const catBuild = await prisma.category.findUnique({ where: { slug: 'BUILDER'       } });
  const catTile  = await prisma.category.findUnique({ where: { slug: 'TILE_INSTALLER'} });

  // ── 1. OPEN project ─────────────────────────────────────────────────────
  const openProject = await prisma.project.create({
    data: {
      clientId: alisher!.id, categoryId: catElec!.id,
      title: 'Uyda elektr montaj ishlari',
      description: '3 xonali kvartiraga to\'liq elektr montaj: rozetka, yorug\'lik, panel o\'rnatish. Yangi bino.',
      urgency: ProjectUrgency.HIGH, status: ProjectStatus.OPEN,
      budgetMin: 3000000, budgetMax: 5000000,
      city: 'Toshkent', region: 'Toshkent shahri',
      address: 'Yunusobod tumani, 19-mavze',
    },
  });

  await prisma.projectImage.createMany({
    data: [
      { projectId: openProject.id, url: '/uploads/projects/open-1.jpg', order: 0 },
      { projectId: openProject.id, url: '/uploads/projects/open-2.jpg', order: 1 },
    ],
  });

  // Bids on open project
  await prisma.bid.create({
    data: {
      projectId: openProject.id, workerId: bobur!.id, workerProfileId: boburProfile!.id,
      amount: 4200000, message: 'Assalomu alaykum! 8 yillik tajribam bor. 5 kun ichida ishni tamomlayman.',
      duration: 5, durationUnit: 'kun', status: BidStatus.PENDING,
    },
  });
  await prisma.bid.create({
    data: {
      projectId: openProject.id, workerId: sardor!.id, workerProfileId: sardorProfile!.id,
      amount: 3800000, message: 'Salom, men ham elektr ishlari bilan shug\'ullanaman. Arzon va sifatli.',
      duration: 7, durationUnit: 'kun', status: BidStatus.PENDING,
    },
  });

  // Notifications for open project
  await prisma.notification.createMany({
    data: [
      {
        userId: bobur!.id, type: NotificationType.PROJECT_CREATED,
        title: 'Yangi loyiha',
        body: `"${openProject.title}" loyihasi e'lon qilindi`,
        data: { projectId: openProject.id },
      },
      {
        userId: alisher!.id, type: NotificationType.BID_RECEIVED,
        title: 'Yangi taklif keldi',
        body: `Bobur Usmonov loyihangizga taklif yubordi`,
        data: { projectId: openProject.id },
      },
    ],
  });

  // ── 2. IN_PROGRESS project ──────────────────────────────────────────────
  const inProgressProject = await prisma.project.create({
    data: {
      clientId: dilnoza!.id, categoryId: catPlumb!.id,
      title: 'Hammom ta\'mirlash — santexnik kerak',
      description: 'Vannaxonada to\'liq santexnika ishlari. Rakovinka, unitaz, duş almashtiriladi.',
      urgency: ProjectUrgency.MEDIUM, status: ProjectStatus.IN_PROGRESS,
      budgetMin: 2000000, budgetMax: 3500000, finalPrice: 2800000,
      assignedWorkerId: sardor!.id,
      city: 'Toshkent', region: 'Toshkent shahri',
      address: 'Chilonzor tumani, 7-kvartal',
      startDate: daysAgo(5),
    },
  });

  const acceptedBid = await prisma.bid.create({
    data: {
      projectId: inProgressProject.id, workerId: sardor!.id, workerProfileId: sardorProfile!.id,
      amount: 2800000, message: 'Ishni 4 kunda yakunlayman, material narxi alohida.',
      duration: 4, durationUnit: 'kun', status: BidStatus.ACCEPTED,
    },
  });
  await prisma.bid.create({
    data: {
      projectId: inProgressProject.id, workerId: ulmas!.id, workerProfileId: ulmasProfile!.id,
      amount: 3100000, message: 'Yuqori sifatli ish beraman.',
      duration: 5, durationUnit: 'kun', status: BidStatus.REJECTED,
      rejectedReason: 'Boshqa usta tanlandi',
    },
  });

  // Chat + messages
  const chat = await prisma.chat.create({
    data: { projectId: inProgressProject.id },
  });
  await prisma.message.createMany({
    data: [
      {
        chatId: chat.id, senderId: dilnoza!.id, type: MessageType.TEXT,
        content: 'Salom Sardor aka, qachon boshlay olasiz?',
        isRead: true, readAt: daysAgo(4),
        createdAt: daysAgo(5),
      },
      {
        chatId: chat.id, senderId: sardor!.id, type: MessageType.TEXT,
        content: 'Salom! Ertaga soat 10da kelaman. Material ro\'yxatini jo\'natdim.',
        isRead: true, readAt: daysAgo(3),
        createdAt: daysAgo(4),
      },
      {
        chatId: chat.id, senderId: dilnoza!.id, type: MessageType.TEXT,
        content: 'Yaxshi, kutaman. Eshik ochiq bo\'ladi.',
        isRead: true, readAt: daysAgo(3),
        createdAt: daysAgo(4),
      },
      {
        chatId: chat.id, senderId: sardor!.id, type: MessageType.TEXT,
        content: 'Ish boshlandi. Birinchi kun rakovinka va unitaz almashtirdim.',
        isRead: true, readAt: daysAgo(2),
        createdAt: daysAgo(3),
      },
      {
        chatId: chat.id, senderId: dilnoza!.id, type: MessageType.TEXT,
        content: 'Rahmat, zo\'r chiqibdi! Dush qachon tayyor bo\'ladi?',
        isRead: false,
        createdAt: daysAgo(1),
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: sardor!.id, type: NotificationType.BID_ACCEPTED,
        title: 'Taklifingiz qabul qilindi',
        body: `"${inProgressProject.title}" loyihasi uchun taklifingiz qabul qilindi`,
        isRead: true, readAt: daysAgo(4),
        data: { projectId: inProgressProject.id, bidId: acceptedBid.id },
      },
      {
        userId: ulmas!.id, type: NotificationType.BID_REJECTED,
        title: 'Taklifingiz rad etildi',
        body: `"${inProgressProject.title}" loyihasi uchun taklifingiz rad etildi`,
        data: { projectId: inProgressProject.id },
      },
    ],
  });

  // ── 3. COMPLETED project ────────────────────────────────────────────────
  const completedProject = await prisma.project.create({
    data: {
      clientId: jasur!.id, categoryId: catBuild!.id,
      title: 'Devor qurilishi va suvoq ishlari',
      description: "120 kv.m maydon. Devor g'isht terish, suvoq va shtukaturka ishlari.",
      urgency: ProjectUrgency.LOW, status: ProjectStatus.COMPLETED,
      budgetMin: 8000000, budgetMax: 15000000, finalPrice: 11500000,
      assignedWorkerId: nodir!.id,
      city: 'Samarqand', region: 'Samarqand viloyati',
      address: "Registon ko'chasi, 45-uy",
      startDate: daysAgo(30), endDate: daysAgo(5),
    },
  });

  await prisma.bid.create({
    data: {
      projectId: completedProject.id, workerId: nodir!.id, workerProfileId: nodirProfile!.id,
      amount: 11500000, message: '12 yillik tajribam bor. Sifatni kafolatlayman.',
      duration: 25, durationUnit: 'kun', status: BidStatus.ACCEPTED,
    },
  });

  // Payment + Escrow
  const payment = await prisma.payment.create({
    data: {
      projectId: completedProject.id, payerId: jasur!.id,
      amount: 11500000, commission: 575000, netAmount: 10925000,
      currency: 'UZS', status: PaymentStatus.COMPLETED,
      method: 'click', transactionId: 'TXN-2024-001234',
    },
  });
  await prisma.escrowTransaction.create({
    data: {
      paymentId: payment.id, amount: 10925000,
      status: EscrowStatus.RELEASED,
      heldAt: daysAgo(10), releasedAt: daysAgo(5),
      releaseNote: 'Ish muvaffaqiyatli yakunlandi, to\'lov ustaga o\'tkazildi.',
    },
  });

  // Review (client → worker)
  await prisma.review.create({
    data: {
      projectId: completedProject.id, reviewerId: jasur!.id, revieweeId: nodir!.id,
      rating: 5,
      comment: 'Nodir aka juda professional usta. Muddatidan oldin va sifatli topshirdi. Albatta qayta ishlaymiz!',
    },
  });
  // Review (worker → client)
  await prisma.review.create({
    data: {
      projectId: completedProject.id, reviewerId: nodir!.id, revieweeId: jasur!.id,
      rating: 5, comment: 'Yaxshi mijoz. Barcha sharoitlarni yaratdi, to\'lovni o\'z vaqtida amalga oshirdi.',
    },
  });

  // Update worker stats
  await prisma.workerProfile.update({
    where: { userId: nodir!.id },
    data: { completedProjects: { increment: 1 }, totalEarnings: { increment: 10925000 } },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: nodir!.id, type: NotificationType.PAYMENT_RELEASED,
        title: 'To\'lov o\'tkazildi',
        body: `"${completedProject.title}" loyihasi uchun 10 925 000 so'm hisobingizga o'tkazildi`,
        isRead: true, readAt: daysAgo(4),
        data: { projectId: completedProject.id, paymentId: payment.id },
      },
      {
        userId: jasur!.id, type: NotificationType.REVIEW_RECEIVED,
        title: 'Sizga baho berildi',
        body: 'Nodir Raximov loyihangiz uchun 5 yulduz baho berdi',
        isRead: true, readAt: daysAgo(4),
        data: { projectId: completedProject.id },
      },
    ],
  });

  // ── 4. OPEN project — plitka ────────────────────────────────────────────
  const tileProject = await prisma.project.create({
    data: {
      clientId: alisher!.id, categoryId: catTile!.id,
      title: 'Oshxona va hammom uchun plitka o\'rnatish',
      description: '45 kv.m. Yerga va devorga plitka yotqiziladi. Material mijozda mavjud.',
      urgency: ProjectUrgency.MEDIUM, status: ProjectStatus.OPEN,
      budgetMin: 4000000, budgetMax: 6000000,
      city: 'Toshkent', region: 'Toshkent shahri',
      address: 'Mirzo Ulug\'bek tumani, 12-mavze',
    },
  });

  await prisma.bid.create({
    data: {
      projectId: tileProject.id, workerId: ulmas!.id, workerProfileId: ulmasProfile!.id,
      amount: 4800000, message: "Salom! Plitka ishlari bo'yicha 7 yillik tajribam bor. Sifatli epoksid fuga ishlataman.",
      duration: 8, durationUnit: 'kun', status: BidStatus.PENDING,
    },
  });

  // ── 5. DISPUTED project ─────────────────────────────────────────────────
  const disputedProject = await prisma.project.create({
    data: {
      clientId: dilnoza!.id, categoryId: catBuild!.id,
      title: 'Kvartira ta\'mirlash — umumiy',
      description: '2 xonali kvartira. Barcha xonalar ta\'mirlash. Bitiruv muddati: 1 oy.',
      urgency: ProjectUrgency.HIGH, status: ProjectStatus.DISPUTED,
      budgetMin: 20000000, budgetMax: 35000000, finalPrice: 28000000,
      assignedWorkerId: nodir!.id,
      city: 'Toshkent', region: 'Toshkent shahri',
      address: "Uchtepa tumani, 3-ko'cha",
      startDate: daysAgo(45),
    },
  });

  await prisma.bid.create({
    data: {
      projectId: disputedProject.id, workerId: nodir!.id, workerProfileId: nodirProfile!.id,
      amount: 28000000, message: 'Professional buyurtmalarni bajaraman.',
      duration: 30, durationUnit: 'kun', status: BidStatus.ACCEPTED,
    },
  });

  await prisma.dispute.create({
    data: {
      projectId: disputedProject.id, openedById: dilnoza!.id,
      reason: 'Ish sifati past va muddati buzilgan',
      description: 'Kelishilgan muddatdan 10 kun o\'tdi, ish hali ham tugallanmagan. Bajarilgan ishlar kelishilgan sifatga mos emas.',
      status: DisputeStatus.UNDER_REVIEW,
      evidence: [],
    },
  });

  await prisma.notification.create({
    data: {
      userId: nodir!.id, type: NotificationType.DISPUTE_OPENED,
      title: 'Shikoyat ochildi',
      body: `"${disputedProject.title}" loyihasi bo'yicha shikoyat ochildi`,
      data: { projectId: disputedProject.id },
    },
  });

  console.log('✅ Projects, bids, chats, messages, payments, reviews, disputes');
}

// ─── SAVED WORKERS ───────────────────────────────────────────────────────────

async function seedSavedWorkers() {
  const alisher = await prisma.user.findUnique({ where: { email: 'alisher@test.uz' } });
  const dilnoza = await prisma.user.findUnique({ where: { email: 'dilnoza@test.uz' } });
  const bobur   = await prisma.user.findUnique({ where: { email: 'bobur@test.uz'  } });
  const nodir   = await prisma.user.findUnique({ where: { email: 'nodir@test.uz'  } });
  const ulmas   = await prisma.user.findUnique({ where: { email: 'ulmas@test.uz'  } });

  const pairs = [
    { clientId: alisher!.id, workerId: bobur!.id  },
    { clientId: alisher!.id, workerId: nodir!.id  },
    { clientId: dilnoza!.id, workerId: ulmas!.id  },
  ];

  for (const p of pairs) {
    await prisma.savedWorker.upsert({
      where: { clientId_workerId: p },
      create: p,
      update: {},
    });
  }

  console.log('✅ Saved workers');
}

// ─── ANALYTICS ───────────────────────────────────────────────────────────────

async function seedAnalytics() {
  const metrics = [
    'daily_signups', 'daily_projects', 'daily_bids',
    'daily_payments_amount', 'daily_completed_projects',
  ];

  const baseValues: Record<string, number> = {
    daily_signups: 8, daily_projects: 5, daily_bids: 18,
    daily_payments_amount: 25000000, daily_completed_projects: 3,
  };

  const rows: Array<{ date: Date; metric: string; value: number }> = [];

  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    for (const metric of metrics) {
      const base = baseValues[metric];
      const jitter = 1 + (Math.random() * 0.4 - 0.2);
      rows.push({ date, metric, value: Math.round(base * jitter) });
    }
  }

  for (const row of rows) {
    await prisma.analytics.upsert({
      where: { date_metric: { date: row.date, metric: row.metric } },
      create: row,
      update: { value: row.value },
    });
  }

  console.log('✅ Analytics (30 days)');
}

// ─── COMMISSION & PLATFORM SETTINGS ─────────────────────────────────────────

async function seedSettings() {
  await prisma.commissionSetting.upsert({
    where: { name: 'default' },
    create: { name: 'default', clientRate: 0.05, workerRate: 0.10 },
    update: {},
  });

  const settings = [
    { key: 'platform_name',         value: 'BuildHub',  type: 'string'  },
    { key: 'maintenance_mode',       value: 'false',     type: 'boolean' },
    { key: 'max_images_per_project', value: '10',        type: 'number'  },
    { key: 'min_bid_amount',         value: '100000',    type: 'number'  },
    { key: 'max_bid_amount',         value: '500000000', type: 'number'  },
    { key: 'support_email',          value: 'support@buildhub.uz', type: 'string' },
    { key: 'support_phone',          value: '+998712345678',        type: 'string' },
  ];

  for (const s of settings) {
    await prisma.platformSetting.upsert({ where: { key: s.key }, create: s, update: s });
  }

  console.log('✅ Commission & platform settings');
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🌱 Seeding database...\n');

  await seedCategories();
  await seedSettings();
  await seedUsers();
  await seedProjects();
  await seedSavedWorkers();
  await seedAnalytics();

  console.log('\n🎉 Done!\n');
  console.log('  Admin:   admin@buildhub.uz   / Admin123!');
  console.log('  Clients: alisher@test.uz     / Client123!');
  console.log('           dilnoza@test.uz     / Client123!');
  console.log('           jasur@test.uz       / Client123!');
  console.log('  Workers: bobur@test.uz       / Worker123!  (Elektrik)');
  console.log('           sardor@test.uz      / Worker123!  (Santexnik)');
  console.log('           nodir@test.uz       / Worker123!  (Quruvchi)');
  console.log('           kamol@test.uz       / Worker123!  (Molyar)');
  console.log('           ulmas@test.uz       / Worker123!  (Plitka ustasi)');
  console.log('           sherzod@test.uz     / Worker123!  (Duradgor)\n');
}

main()
  .catch((e) => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
