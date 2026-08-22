import { History, Home, Settings, TrendingUp } from "lucide-react";
import { NavLink } from "react-router";

const navItems = [
  { to: "/", label: "Home", icon: Home },
  { to: "/rates", label: "Rates", icon: TrendingUp },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function BottomNavbar() {
  return (
    <nav className="w-full flex flex-row gap-0.5 bg-sfx-card p-2">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 text-center text-[15px] font-rh-m flex flex-col items-center gap-0.5 transition-colors ${
              isActive ? "text-sfx-primary-strong" : "text-[#A49DBB]"
            }`}
        >
          <Icon className="w-[20px] h-[20px]" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
