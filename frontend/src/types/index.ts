export type UserRole = 'CLIENT' | 'WORKER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
export type WorkerStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';
export type ProjectStatus = 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED';
export type ProjectUrgency = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type BidStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
export type EscrowStatus = 'HELD' | 'RELEASED' | 'REFUNDED' | 'DISPUTED';
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE' | 'SYSTEM';
export type NotificationType =
  | 'PROJECT_CREATED' | 'BID_RECEIVED' | 'BID_ACCEPTED' | 'BID_REJECTED'
  | 'PROJECT_STARTED' | 'PROJECT_COMPLETED' | 'PAYMENT_RECEIVED' | 'PAYMENT_RELEASED'
  | 'REVIEW_RECEIVED' | 'MESSAGE_RECEIVED' | 'DISPUTE_OPENED' | 'DISPUTE_RESOLVED'
  | 'WORKER_VERIFIED' | 'SYSTEM';

export type WorkerCategory =
  | 'BUILDER' | 'ELECTRICIAN' | 'PLUMBER' | 'PAINTER' | 'CARPENTER'
  | 'INTERIOR_DESIGNER' | 'ARCHITECT' | 'TILE_INSTALLER' | 'ROOFER'
  | 'WELDER' | 'SMART_HOME' | 'HVAC_SPECIALIST' | 'PLASTERER' | 'STUCCO_WORKER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  createdAt: string;
  workerProfile?: WorkerProfileSummary;
}

export interface WorkerProfileSummary {
  id: string;
  category: WorkerCategory;
  rating: number;
  isVerified: boolean;
}

export interface WorkerProfile {
  id: string;
  userId: string;
  category: WorkerCategory;
  bio?: string;
  experience: number;
  hourlyRate?: number;
  dailyRate?: number;
  minProjectBudget?: number;
  status: WorkerStatus;
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  isFeatured: boolean;
  completedProjects: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  region?: string;
  skills: WorkerSkill[];
  portfolio: Portfolio[];
  user: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar' | 'createdAt'>;
}

export interface WorkerSkill {
  id: string;
  name: string;
  level: number;
}

export interface Portfolio {
  id: string;
  title: string;
  description?: string;
  images: string[];
  category: WorkerCategory;
  completedAt?: string;
}

export interface Category {
  id: string;
  slug: WorkerCategory;
  nameUz: string;
  nameRu: string;
  nameEn: string;
  name?: string;
  icon?: string;
}

export interface Project {
  id: string;
  clientId: string;
  categoryId?: string;
  title: string;
  description: string;
  urgency: ProjectUrgency;
  status: ProjectStatus;
  budgetMin?: number;
  budgetMax?: number;
  finalPrice?: number;
  latitude?: number;
  longitude?: number;
  address?: string;
  city?: string;
  region?: string;
  startDate?: string;
  endDate?: string;
  viewCount: number;
  bidCount: number;
  assignedWorkerId?: string;
  createdAt: string;
  updatedAt: string;
  images: ProjectImage[];
  category?: Category;
  client: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  bids?: Bid[];
  reviews?: Review[];
  _count?: { bids: number };
}

export interface ProjectImage {
  id: string;
  url: string;
  thumbnail?: string;
  order: number;
}

export interface Bid {
  id: string;
  projectId: string;
  workerId: string;
  amount: number;
  message: string;
  duration?: number;
  durationUnit?: string;
  status: BidStatus;
  createdAt: string;
  worker: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
  workerProfile: Pick<WorkerProfile, 'id' | 'rating' | 'completedProjects' | 'isVerified' | 'category'>;
}

export interface Review {
  id: string;
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'>;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  isRead: boolean;
  createdAt: string;
  sender: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar' | 'role'>;
}

export interface Chat {
  id: string;
  projectId: string;
  isActive: boolean;
  project: Pick<Project, 'id' | 'title' | 'status' | 'clientId'> & { assignedWorkerId?: string; client: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatar'> };
  messages: Message[];
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  projectId: string;
  amount: number;
  commission: number;
  netAmount: number;
  currency: string;
  status: PaymentStatus;
  createdAt: string;
  project: Pick<Project, 'id' | 'title'>;
  escrowTransaction?: { status: EscrowStatus };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}
