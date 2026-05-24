import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

// Layouts
import { PublicLayout } from '@components/layout/PublicLayout';
import { ClientLayout } from '@components/layout/ClientLayout';
import { WorkerLayout } from '@components/layout/WorkerLayout';
import { AdminLayout } from '@components/layout/AdminLayout';

// Auth Pages
import { LoginPage } from '@pages/auth/LoginPage';
import { RegisterPage } from '@pages/auth/RegisterPage';
import { ForgotPasswordPage } from '@pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '@pages/auth/ResetPasswordPage';
import { VerifyEmailPage } from '@pages/auth/VerifyEmailPage';

// Public Pages
import { LandingPage } from '@pages/LandingPage';
import { ProjectsListPage } from '@pages/projects/ProjectsListPage';
import { ProjectDetailPage } from '@pages/projects/ProjectDetailPage';
import { WorkersListPage } from '@pages/workers/WorkersListPage';
import { WorkerDetailPage } from '@pages/workers/WorkerDetailPage';

// Client Pages
import { ClientDashboard } from '@pages/client/ClientDashboard';
import { CreateProjectPage } from '@pages/client/CreateProjectPage';
import { ClientProjectsPage } from '@pages/client/ClientProjectsPage';
import { ClientPaymentsPage } from '@pages/client/ClientPaymentsPage';

// Worker Pages
import { WorkerDashboard } from '@pages/worker/WorkerDashboard';
import { WorkerProfilePage } from '@pages/worker/WorkerProfilePage';
import { WorkerBidsPage } from '@pages/worker/WorkerBidsPage';
import { WorkerPortfolioPage } from '@pages/worker/WorkerPortfolioPage';
import { WorkerEarningsPage } from '@pages/worker/WorkerEarningsPage';

// Shared Pages
import { ChatPage } from '@pages/chat/ChatPage';
import { NotificationsPage } from '@pages/NotificationsPage';

// Admin Pages
import { AdminDashboard } from '@pages/admin/AdminDashboard';
import { AdminUsersPage } from '@pages/admin/AdminUsersPage';
import { AdminWorkersPage } from '@pages/admin/AdminWorkersPage';
import { AdminProjectsPage } from '@pages/admin/AdminProjectsPage';
import { AdminDisputesPage } from '@pages/admin/AdminDisputesPage';
import { AdminAnalyticsPage } from '@pages/admin/AdminAnalyticsPage';

// Guards
import { ProtectedRoute } from '@components/shared/ProtectedRoute';
import { RoleRoute } from '@components/shared/RoleRoute';

function App() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/projects" element={<ProjectsListPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/workers" element={<WorkersListPage />} />
        <Route path="/workers/:id" element={<WorkerDetailPage />} />
      </Route>

      {/* Auth routes */}
      <Route path="/auth/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/auth/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/verify-email" element={<VerifyEmailPage />} />

      {/* Smart redirect */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          {user?.role === 'ADMIN' ? <Navigate to="/admin" replace /> :
           user?.role === 'WORKER' ? <Navigate to="/worker" replace /> :
           <Navigate to="/client" replace />}
        </ProtectedRoute>
      } />

      {/* Client routes */}
      <Route element={<RoleRoute role="CLIENT"><ClientLayout /></RoleRoute>}>
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/projects" element={<ClientProjectsPage />} />
        <Route path="/client/projects/create" element={<CreateProjectPage />} />
        <Route path="/client/payments" element={<ClientPaymentsPage />} />
        <Route path="/client/chat" element={<ChatPage />} />
        <Route path="/client/chat/:chatId" element={<ChatPage />} />
        <Route path="/client/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Worker routes */}
      <Route element={<RoleRoute role="WORKER"><WorkerLayout /></RoleRoute>}>
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/worker/profile" element={<WorkerProfilePage />} />
        <Route path="/worker/bids" element={<WorkerBidsPage />} />
        <Route path="/worker/portfolio" element={<WorkerPortfolioPage />} />
        <Route path="/worker/earnings" element={<WorkerEarningsPage />} />
        <Route path="/worker/chat" element={<ChatPage />} />
        <Route path="/worker/chat/:chatId" element={<ChatPage />} />
        <Route path="/worker/notifications" element={<NotificationsPage />} />
      </Route>

      {/* Admin routes */}
      <Route element={<RoleRoute role="ADMIN"><AdminLayout /></RoleRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/workers" element={<AdminWorkersPage />} />
        <Route path="/admin/projects" element={<AdminProjectsPage />} />
        <Route path="/admin/disputes" element={<AdminDisputesPage />} />
        <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
