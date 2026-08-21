import { Outlet, useLocation } from "react-router";
import BottomNavbar from "@/components/Dashboard/BottomNavbar";
import Sidebar from "@/components/Dashboard/Sidebar";
import TopBar from "@/components/global/TopBar";

export default function DashboardLayout() {
  const location = useLocation();

  const isKycPage = location.pathname.startsWith("/kyc");

  return (
    <div className="relative min-h-dvh">
      <div className="hidden md:block h-full sticky top-0 z-[15] w-full md:fixed md:left-0 md:top-0 md:h-dvh md:w-[17rem] bg-white">
        <div className="h-full">
          <Sidebar />
        </div>
      </div>

      {/* Only show BottomNavbar if we're NOT on a KYC page */}
      {!isKycPage && (
        <div className="md:hidden w-full fixed bottom-0 z-[15]">
          <BottomNavbar />
        </div>
      )}

      <div className="min-h-dvh w-full overflow-y-auto mb-[4rem] md:mb-0 md:ml-[17rem] md:h-dvh md:w-[calc(100vw-17rem)]">
        <div className="hidden md:block">
          <TopBar />
        </div>
        <div className="px-[16px] md:px-screen-x py-[25px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
