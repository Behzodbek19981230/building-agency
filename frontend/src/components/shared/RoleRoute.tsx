import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { ReactNode } from 'react';
import { UserRole } from '@/types';

interface Props {
  role: UserRole;
  children: ReactNode;
}

export function RoleRoute({ role, children }: Props) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (user?.role !== role) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
}
