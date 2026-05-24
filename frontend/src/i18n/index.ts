import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  uz: {
    translation: {
      common: { loading: 'Yuklanmoqda...', error: 'Xatolik', save: 'Saqlash', cancel: 'Bekor qilish', delete: 'O\'chirish', edit: 'Tahrirlash', back: 'Orqaga', submit: 'Yuborish', confirm: 'Tasdiqlash', search: 'Qidirish', filter: 'Filter', all: 'Barchasi', yes: 'Ha', no: "Yo'q" },
      nav: { home: 'Bosh sahifa', projects: 'Loyihalar', workers: 'Ustalar', login: 'Kirish', register: "Ro'yxatdan o'tish", logout: 'Chiqish', dashboard: 'Dashboard', profile: 'Profil', notifications: 'Bildirishnomalar', chat: 'Xabarlar' },
      auth: { login: 'Kirish', register: "Ro'yxatdan o'tish", email: 'Email', password: 'Parol', firstName: 'Ism', lastName: 'Familiya', phone: 'Telefon', forgotPassword: 'Parolni unutdingizmi?', resetPassword: 'Parolni tiklash', verifyEmail: 'Emailni tasdiqlash', welcomeBack: 'Xush kelibsiz!', createAccount: 'Hisob yaratish', client: 'Mijoz', worker: 'Usta' },
      project: { create: 'Loyiha yaratish', title: 'Sarlavha', description: 'Tavsif', budget: 'Byudjet', urgency: 'Shoshilinchlik', location: 'Joylashuv', images: 'Rasmlar', status: { OPEN: 'Ochiq', IN_PROGRESS: 'Jarayonda', COMPLETED: 'Tugallangan', CANCELLED: 'Bekor', DISPUTED: 'Nizo' }, urgencyLevels: { LOW: 'Past', MEDIUM: "O'rta", HIGH: 'Yuqori', URGENT: 'Shoshilinch' } },
      worker: { profile: 'Profil', skills: 'Ko\'nikmalar', portfolio: 'Portfolio', rating: 'Reyting', experience: 'Tajriba', category: 'Kategoriya', status: { AVAILABLE: 'Mavjud', BUSY: 'Band', OFFLINE: 'Offline' }, verified: 'Tasdiqlangan' },
      bid: { place: 'Taklif berish', amount: 'Summa', message: 'Xabar', accept: 'Qabul qilish', reject: 'Rad etish', withdraw: 'Qaytarish', status: { PENDING: 'Kutilmoqda', ACCEPTED: 'Qabul qilindi', REJECTED: 'Rad etildi', WITHDRAWN: 'Qaytarildi' } },
      payment: { initiate: "To'lovni boshlash", release: 'Chiqarish', status: { PENDING: 'Kutilmoqda', COMPLETED: 'Yakunlandi', FAILED: 'Xato' }, escrow: 'Escrow tizimi' },
    },
  },
  ru: {
    translation: {
      common: { loading: 'Загрузка...', error: 'Ошибка', save: 'Сохранить', cancel: 'Отмена', delete: 'Удалить', edit: 'Редактировать', back: 'Назад', submit: 'Отправить', confirm: 'Подтвердить', search: 'Поиск', filter: 'Фильтр', all: 'Все', yes: 'Да', no: 'Нет' },
      nav: { home: 'Главная', projects: 'Проекты', workers: 'Мастера', login: 'Войти', register: 'Регистрация', logout: 'Выйти', dashboard: 'Панель', profile: 'Профиль', notifications: 'Уведомления', chat: 'Сообщения' },
      auth: { login: 'Войти', register: 'Регистрация', email: 'Email', password: 'Пароль', firstName: 'Имя', lastName: 'Фамилия', phone: 'Телефон', forgotPassword: 'Забыли пароль?', resetPassword: 'Сброс пароля', verifyEmail: 'Подтверждение email', welcomeBack: 'Добро пожаловать!', createAccount: 'Создать аккаунт', client: 'Клиент', worker: 'Мастер' },
      project: { create: 'Создать проект', title: 'Название', description: 'Описание', budget: 'Бюджет', urgency: 'Срочность', location: 'Местоположение', images: 'Фотографии', status: { OPEN: 'Открыт', IN_PROGRESS: 'В работе', COMPLETED: 'Завершён', CANCELLED: 'Отменён', DISPUTED: 'Спор' }, urgencyLevels: { LOW: 'Низкая', MEDIUM: 'Средняя', HIGH: 'Высокая', URGENT: 'Срочно' } },
      worker: { profile: 'Профиль', skills: 'Навыки', portfolio: 'Портфолио', rating: 'Рейтинг', experience: 'Опыт', category: 'Категория', status: { AVAILABLE: 'Доступен', BUSY: 'Занят', OFFLINE: 'Оффлайн' }, verified: 'Подтверждён' },
    },
  },
  en: {
    translation: {
      common: { loading: 'Loading...', error: 'Error', save: 'Save', cancel: 'Cancel', delete: 'Delete', edit: 'Edit', back: 'Back', submit: 'Submit', confirm: 'Confirm', search: 'Search', filter: 'Filter', all: 'All', yes: 'Yes', no: 'No' },
      nav: { home: 'Home', projects: 'Projects', workers: 'Workers', login: 'Login', register: 'Register', logout: 'Logout', dashboard: 'Dashboard', profile: 'Profile', notifications: 'Notifications', chat: 'Messages' },
      auth: { login: 'Login', register: 'Register', email: 'Email', password: 'Password', firstName: 'First Name', lastName: 'Last Name', phone: 'Phone', forgotPassword: 'Forgot password?', resetPassword: 'Reset password', verifyEmail: 'Verify email', welcomeBack: 'Welcome back!', createAccount: 'Create account', client: 'Client', worker: 'Worker' },
      project: { create: 'Create project', title: 'Title', description: 'Description', budget: 'Budget', urgency: 'Urgency', location: 'Location', images: 'Images', status: { OPEN: 'Open', IN_PROGRESS: 'In Progress', COMPLETED: 'Completed', CANCELLED: 'Cancelled', DISPUTED: 'Disputed' }, urgencyLevels: { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent' } },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'uz',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
