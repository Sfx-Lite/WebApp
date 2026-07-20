import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/hooks/reduxHooks";

type ProtectedRouteProps = {
  roles?: string[];
};

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, token, isPinVerified } = useAppSelector(s => s.auth);

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isPinVerified) {
    return <Navigate to="/pin" state={{ from: "login" }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
