import { Outlet } from "react-router";
import BottomNavbar from "@/components/Home/BottomNavbar";

export default function HomeLayout() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen w-full bg-[#2e2c36]
       p-0 sm:p-4 md:p-6 select-none overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-30%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-sfx-primary opacity-20 blur-[150px]" />

        <div className="absolute bottom-[-30%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-sfx-primary opacity-20 blur-[150px]" />
      </div>
      <div
        className="
        relative
        w-full
        h-screen
        sm:h-[844px]
        sm:w-[390px]
        bg-sfx-primary-tint
        sm:rounded-[44px]
        shadow-brand
        sm:border-[10px]
        sm:border-[#221a38]
        flex
        flex-col
        overflow-hidden
        transition-all
        duration-300
        "
      >
        <Outlet />
        <div className="w-full">
          <BottomNavbar />
        </div>
      </div>
      {" "}
    </div>
  );
}
