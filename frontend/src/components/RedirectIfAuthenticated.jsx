import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import LoadingSpinner from './ui/LoadingSpinner';

export default function RedirectIfAuthenticated({ children }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (isAuthenticated) {
    const destination =
      user?.role === ROLES.ADMIN
        ? '/Students'
        : user?.role === ROLES.TEACHER
          ? '/Dashboard'
          : '/LandingpageLogin';
    return <Navigate to={destination} replace />;
  }

  return children || <Outlet />;
}
