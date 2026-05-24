# 🏗️ BuildHub — Construction Services Marketplace

> O'zbekistondagi qurilish va ta'mirlash xizmatlari uchun ishonchli platforma.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite, TypeScript, TailwindCSS, shadcn/ui |
| **Backend** | NestJS, TypeScript |
| **Database** | PostgreSQL 16 |
| **ORM** | Prisma |
| **Auth** | JWT + Refresh Tokens |
| **Real-time** | Socket.io |
| **Storage** | MinIO (S3-compatible) |
| **State** | Zustand |
| **API Client** | TanStack Query + Axios |
| **Container** | Docker + Docker Compose |

## Architecture

```
building-agency/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/           # JWT, refresh tokens, email verify
│   │   │   ├── users/          # User profiles
│   │   │   ├── workers/        # Worker profiles, portfolio
│   │   │   ├── projects/       # Project CRUD, status management
│   │   │   ├── bids/           # Bidding system
│   │   │   ├── chat/           # WebSocket real-time chat
│   │   │   ├── reviews/        # Rating & review system
│   │   │   ├── payments/       # Escrow payment system
│   │   │   ├── notifications/  # Push notifications
│   │   │   ├── disputes/       # Dispute management
│   │   │   ├── analytics/      # Platform analytics (cron)
│   │   │   ├── admin/          # Admin panel API
│   │   │   └── categories/     # Service categories
│   │   ├── common/
│   │   │   ├── guards/         # JWT, Roles guards
│   │   │   ├── decorators/     # @CurrentUser, @Roles, @Public
│   │   │   ├── filters/        # Global exception filter
│   │   │   └── interceptors/   # Transform, Logging
│   │   └── config/             # Prisma, App config
│   └── prisma/
│       ├── schema.prisma       # Full database schema
│       └── seed.ts             # Database seeder
│
├── frontend/                   # React SPA
│   └── src/
│       ├── pages/
│       │   ├── auth/           # Login, Register, Forgot/Reset password
│       │   ├── client/         # Dashboard, Projects, Payments
│       │   ├── worker/         # Dashboard, Profile, Bids, Earnings
│       │   ├── admin/          # Admin panel pages
│       │   ├── projects/       # Public project list & detail
│       │   ├── workers/        # Public worker list & detail
│       │   └── chat/           # Real-time chat
│       ├── components/
│       │   ├── layout/         # Navbar, Footer, Sidebars, Layouts
│       │   └── shared/         # ProtectedRoute, RoleRoute
│       ├── store/              # Zustand stores (auth, chat, notifications)
│       ├── services/           # API service layer
│       ├── types/              # TypeScript interfaces
│       └── i18n/               # uz/ru/en translations
│
├── docker-compose.yml
└── .env.example
```

## Tez boshlash (Local Development)

### 1. Talablar
- Node.js 20+
- Docker + Docker Compose
- Git

### 2. Klonlash
```bash
git clone <repo-url>
cd building-agency
```

### 3. Environment fayllari
```bash
cp .env.example .env
# .env faylini tahrirlang: JWT secret, email, va boshqalar
```

### 4. Docker services (PostgreSQL + MinIO + Redis)
```bash
docker-compose up postgres minio redis -d
```

### 5. Backend sozlash
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed      # Test ma'lumotlarni yuklash
npm run start:dev
```

### 6. Frontend sozlash
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Brauzerda oching: http://localhost:5173

## Test foydalanuvchilar (Seed dan keyin)

| Rol | Email | Parol |
|-----|-------|-------|
| Admin | admin@buildhub.uz | Admin123! |
| Mijoz | client@test.uz | Client123! |
| Usta | worker@test.uz | Worker123! |

## API Dokumentatsiyasi (Swagger)

Backend ishga tushganda: http://localhost:3000/api/docs

## Docker bilan ishga tushirish (Production)

```bash
docker-compose up --build -d
```

## Asosiy API Endpointlar

```
POST   /api/v1/auth/register         - Ro'yxatdan o'tish
POST   /api/v1/auth/login            - Kirish
POST   /api/v1/auth/refresh          - Token yangilash
POST   /api/v1/auth/logout           - Chiqish
POST   /api/v1/auth/verify-email     - Email tasdiqlash
POST   /api/v1/auth/forgot-password  - Parol tiklash
GET    /api/v1/auth/me               - Joriy foydalanuvchi

GET    /api/v1/projects              - Loyihalar ro'yxati
POST   /api/v1/projects              - Yangi loyiha (CLIENT)
GET    /api/v1/projects/:id          - Loyiha detallari
GET    /api/v1/projects/my           - Mening loyihalarim
PATCH  /api/v1/projects/:id/assign/:workerId  - Usta biriktirish
PATCH  /api/v1/projects/:id/complete - Loyihani yakunlash

GET    /api/v1/workers               - Ustalar qidirish
POST   /api/v1/workers/profile       - Profil yaratish (WORKER)
GET    /api/v1/workers/my/profile    - Mening profilim
GET    /api/v1/workers/my/stats      - Statistika
GET    /api/v1/workers/:id           - Usta profili

POST   /api/v1/bids/project/:id      - Taklif berish (WORKER)
GET    /api/v1/bids/project/:id      - Loyiha takliflari (CLIENT)
GET    /api/v1/bids/my               - Mening takliflarim

GET    /api/v1/chat                  - Mening chatlarim
GET    /api/v1/chat/:chatId/messages - Chat xabarlari

POST   /api/v1/reviews/project/:id/user/:uid  - Sharh yozish

POST   /api/v1/payments/project/:id/initiate  - To'lov boshlash
PATCH  /api/v1/payments/:id/release  - To'lovni chiqarish

GET    /api/v1/admin/dashboard       - Admin statistika (ADMIN)
GET    /api/v1/admin/users           - Foydalanuvchilar (ADMIN)
PATCH  /api/v1/admin/workers/:id/verify  - Usta tasdiqlash (ADMIN)
```

## WebSocket Events

```javascript
// Client → Server
join_chat    { chatId }
send_message { chatId, content, type }
leave_chat   { chatId }
typing       { chatId, isTyping }
mark_read    { chatId }

// Server → Client
connected    { userId }
new_message  { data: Message }
user_typing  { userId, isTyping }
messages_read { chatId, userId }
```

## Xavfsizlik

- JWT access token: 15 daqiqa
- Refresh token: 7 kun, faqat bir marta ishlatiladi
- Parol: bcryptjs (12 rounds)
- API: Helmet, CORS, Rate limiting (ThrottlerModule)
- SQL injection: Prisma ORM (parameterized queries)
- File upload: mime type validation, max 10 ta rasm

## Kengaytirish imkoniyatlari

- **Microservices**: har bir NestJS modul alohida servis sifatida ajratilishi mumkin
- **Redis**: caching va queue uchun
- **CDN**: rasm va fayllar uchun CloudFront/Cloudflare
- **ElasticSearch**: kengaytirilgan qidiruv uchun
- **GraphQL**: REST bilan birga
- **Push notifications**: Firebase FCM

## Komissiya tizimi

- Mijozdan: 5% (sozlanishi mumkin)
- Ustadan: 10% (sozlanishi mumkin)
- Escrow: to'lov ish tugagunicha saqlanadi
- Nizo: Admin hal qiladi

---

Savol va takliflar uchun: info@buildhub.uz
