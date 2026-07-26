import { Outlet } from "react-router";
import BottomNavbar from "@/components/Dashboard/BottomNavbar";
import Sidebar from "@/components/Dashboard/Sidebar";
import TopBar from "@/components/global/TopBar";

export default function DashboardLayout() {
  return (
    <div className="relative min-h-dvh">
      <div className="hidden md:block h-full sticky top-0 z-[15] w-full md:fixed md:left-0 md:top-0 md:h-dvh md:w-[17rem] bg-white">
        <div className="">
          <Sidebar />
        </div>
      </div>
      <div className="md:hidden w-full fixed bottom-0 z-[15]">
        <BottomNavbar />
      </div>

      <div className="min-h-dvh w-full overflow-y-auto mb-[4rem] md:ml-[17rem] md:h-dvh md:w-[calc(100vw-17rem)]">
        <div className="hidden md:block">
          <TopBar />
        </div>
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
