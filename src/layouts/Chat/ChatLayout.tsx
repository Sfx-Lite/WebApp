import { Outlet } from "react-router";
import Sidebar from "@/components/Dashboard/Sidebar";
import TopBar from "@/components/global/TopBar";

export default function ChatLayout() {
  return (
    <div className="relative min-h-dvh">
      <div className="hidden md:block h-full sticky top-0 z-[15] w-full md:fixed md:left-0 md:top-0 md:h-dvh md:w-[17rem] bg-white">
        <div className="h-full">
          <Sidebar />
        </div>
      </div>

      <div className="fixed inset-0 z-50 h-dvh w-full overflow-hidden md:static md:z-auto md:ml-[17rem] md:h-dvh md:w-[calc(100vw-17rem)]">
        <div className="hidden md:block">
          <TopBar />
        </div>
        <div className="h-dvh md:h-[calc(100dvh-3.5rem)] w-full flex flex-col overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
