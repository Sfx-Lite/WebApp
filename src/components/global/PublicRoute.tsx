import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../hooks/reduxHooks";

export default function PublicRoute() {
  const { user, token, hasPin } = useAppSelector(s => s.auth);

  if (token && user && hasPin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
