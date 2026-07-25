"use client";

import { History, Home, Settings, TrendingUp } from "lucide-react";
import { Link, NavLink } from "react-router";
import logo from "../../assets/imgs/sfx-logo-purple.png";
import LogOutBtn from "../global/LogOutBtn";
import UserProfileCard from "../global/UserProfileCard";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rates", label: "Rates", icon: TrendingUp },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function Sidebar() {
  return (
    <nav className="isolate w-full h-full p-[1rem]">
      <div className="h-full flex flex-col items-start justify-between">
        <div className="w-full">
          <Link to="/" className="inline-flex gap-1 items-center">
            <img src={logo} alt="company logo" className="w-[100px]" />
          </Link>

          <div className="">
            <UserProfileCard />

            <div className="w-full flex flex-col gap-1.5">
              {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                <NavLink key={href} to={href} end={href === "/"}>
                  {({ isActive }) => (
                    <div
                      className={`w-full flex gap-4 items-center text-[16px] px-[1rem] py-[.5rem] rounded-full transition duration-400 ease-in-out ${
                        isActive ? "bg-sfx-primary-tint" : "hover:bg-sfx-primary-tint"
                      }`}
                    >
                      <Icon
                        className={`w-[20px] transition-colors duration-400 ease-in-out ${
                          isActive ? "text-sfx-muted" : "text-sfx-muted/50"
                        }`}
                      />
                      <span
                        className={`inline-block font-rh-m text-[15px] transition-colors duration-400 ease-in-out ${
                          isActive ? "text-sfx-muted" : "text-sfx-muted"
                        }`}
                      >
                        {label}
                      </span>
                    </div>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 pl-[1rem]">
          <LogOutBtn />
        </div>
      </div>
    </nav>
  );
}
