import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ROLES } from '../utils/constants';
import LoadingSpinner from './ui/LoadingSpinner';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    if (user?.role === ROLES.ADMIN) return <Navigate to="/Students" replace />;
    if (user?.role === ROLES.TEACHER) return <Navigate to="/Dashboard" replace />;
    return <Navigate to="/landingpage" replace />;
  }

  return children || <Outlet />;
}
