"use client";

import { History, Home, Settings, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "../../assets/imgs/sfx-logo-purple.png";
import LogOutBtn from "../global/LogOutBtn";

type SidebarUser = {
  displayName?: string;
  email?: string;
  photoURL?: string;
};

type SidebarProps = {
  user?: SidebarUser;
  // onSignOut?: () => void;
};

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/rates", label: "Rates", icon: TrendingUp },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export default function Sidebar({ user }: SidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isProfileOpen)
      return;

    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  return (
    <nav className="isolate w-full h-full p-[1rem]">
      <div className="h-full flex flex-col items-start justify-between">
        <div className="w-full">
          <Link
            to="/"
            className="inline-flex gap-1 items-center"
          >
            <img
              src={logo}
              alt="company logo"
              className="w-[100px]"
            />
          </Link>

          <div className="">
            <div className="p-2 rounded-[10px] bg-sfx-card shadow-md border border-sfx-muted/20 my-[1.75rem]">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsProfileOpen(prev => !prev)}
                  className="h-[2.25rem] w-[2.25rem] rounded-full"
                >
                  <img
                    src={user?.photoURL ?? "/sneaks.jpg"}
                    alt={user?.displayName ?? "User avatar"}
                    className="h-full w-full rounded-[inherit] object-cover"
                  />
                </button>

                <div className="flex flex-col gap-1 leading-4">
                  <span className="inline-block font-rh-b text-[15px]">
                    Finney Charles
                  </span>
                  <span className="inline-block text-sfx-muted font-rh-m text-[14px]">
                    @blandirony
                  </span>
                </div>
              </div>
            </div>
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
      <div className="relative">
        {/* <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                variants={popoverContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{ transformOrigin: "bottom left" }}
                className="absolute bottom-18 left-[1.5rem] w-[30rem] rounded-[1.25rem] border border-[#f5f5f5] bg-col-white p-[.75rem] shadow-xl overflow-hidden"
              >
                <motion.div variants={popoverItemVariants} className="flex gap-4 px-[.5rem] mb-[1.25rem]">
                  <div className="h-[3.5rem] w-[3.5rem] rounded-full">
                    <img
                      src={user?.photoURL ?? "/images/image.jpg"}
                      alt={user?.displayName ?? "User avatar"}
                      className="h-full w-full rounded-[inherit] object-cover"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="inline-block font-elms-b text-[1.65rem]">
                      {user?.displayName ?? "User Name"}
                    </span>
                    <span className="inline-block font-elms-m text-[1.45rem] text-col-dark-gray">
                      {user?.email ?? "user@gmail.com"}
                    </span>
                  </div>
                </motion.div>

                <motion.div variants={popoverItemVariants} className="w-full border-t border-[#f5f5f5] pt-[.75rem]">
                  <button
                    onClick={() => {
                      setIsProfileOpen(false);
                      onSignOut?.();
                    }}
                    className="w-full flex gap-3 items-center px-[.5rem] py-[.5rem] rounded-[.75rem] hover:bg-col-light-gray font-elms-m text-[1.45rem] text-col-dark"
                  >
                    <LogOut className="text-[1.6rem]" />
                    Sign out
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence> */}
      </div>
    </nav>
  );
}
