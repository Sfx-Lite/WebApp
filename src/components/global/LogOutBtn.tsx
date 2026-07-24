import { MdLogout } from "react-icons/md";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { logout } from "@/store/authSlice";

export default function LogOutBtn() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <button
      onClick={handleLogout}
      className="
            flex
            items-center
            justify-center
            gap-2
            text-sfx-muted
            cursor-grab
            "
    >
      <MdLogout className="text-[22px]" />
      <span className="inline-block font-rh-m text-[15px] text-sfx-muted">
        Log out
      </span>
    </button>
  );
}
