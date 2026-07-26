import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import { useUserStore } from "@/store/useUserStore";
import { useAppSelector } from "../../hooks/reduxHooks";

type ProtectedRouteProps = {
  roles?: string[];
};

export default function ProtectedRoute({ roles }: ProtectedRouteProps) {
  const location = useLocation();
  const { user, token, hasPin } = useAppSelector(s => s.auth);
  const fetchProfile = useUserStore(s => s.fetchProfile);
  const profile = useUserStore(s => s.profile);

  useEffect(() => {
    // Only attempt to load the detailed profile once authenticated & PIN-verified
    if (token && user && hasPin && !profile) {
      fetchProfile();
    }
  }, [token, user, hasPin, profile, fetchProfile]);

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
