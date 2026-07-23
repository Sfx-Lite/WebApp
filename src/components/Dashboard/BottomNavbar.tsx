import { FaRegClock } from "react-icons/fa";
import { MdHome, MdSettings, MdTrendingUp } from "react-icons/md";
import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Home", icon: MdHome },
  { to: "/rates", label: "Rates", icon: MdTrendingUp },
  { to: "/history", label: "History", icon: FaRegClock },
  { to: "/settings", label: "Settings", icon: MdSettings },
];

export default function BottomNavbar() {
  return (
    <nav className="flex w-full absolute bottom-0 bg-sfx-card px-2 pt-2.5 pb-4 mt-auto">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 text-center text-[10.5px] font-rh-m flex flex-col items-center gap-0.5 transition-colors ${
              isActive ? "text-sfx-primary-strong" : "text-[#A49DBB]"
            }`}
        >
          <Icon className="w-[25px] h-[30px]" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
