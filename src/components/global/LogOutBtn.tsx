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
            w-10
            h-10
            rounded-full
            bg-white
            flex
            items-center
            justify-center
            text-sfx-primary
            shadow-sm
            cursor-grab
            "
    >
      <MdLogout size={22} />
    </button>
  );
}
