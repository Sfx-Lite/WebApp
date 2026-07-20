import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "@/hooks/reduxHooks";

export default function PublicRoute() {
  const { user, token, isPinVerified } = useAppSelector(s => s.auth);

  if (token && user) {
    if (!isPinVerified) {
      return <Navigate to="/pin" state={{ from: "login" }} replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
