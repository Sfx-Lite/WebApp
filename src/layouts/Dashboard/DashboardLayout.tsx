import { Outlet } from "react-router";
import Sidebar from "@/components/Dashboard/Sidebar";

export default function DashboardLayout() {
  return (
    <div className="relative min-h-dvh">
      <div className="sticky top-0 z-[15] w-full md:fixed md:left-0 md:top-0 md:h-dvh md:w-[17rem] bg-white">
        <div className="hidden md:block">
          <Sidebar />
        </div>
      </div>

      <Outlet />
    </div>
  );
}
