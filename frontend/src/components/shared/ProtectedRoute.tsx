import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
