import type { RootState } from "@/store";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";

export default function TopBar() {
  const title = useSelector((state: RootState) => state.topBar.title);

  return (
    <div className="py-[14px] px-screen-x bg-sfx-card">
      <div className="flex justify-between items-center gap-4">
        <h2 className="font-rh-b text-[20px]">
          { title }
          {" "}
          Home
        </h2>

        <div className="flex items-center gap-2">
          <Bell className="text-[18px] text-sfx-primary" />
        </div>
      </div>
    </div>
  );
}
