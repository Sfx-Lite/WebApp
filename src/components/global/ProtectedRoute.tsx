import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "../../hooks/reduxHooks";

type ProtectedRouteProps = {
  roles?: string[];
};

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, token, hasPin } = useAppSelector(s => s.auth);

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasPin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
