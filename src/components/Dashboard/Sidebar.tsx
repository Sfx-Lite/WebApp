"use client";

import { History, Home, LogOut, Settings, TrendingUp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useDashboardView } from "@/hooks/useDashboardView";
import logo from "../../assets/imgs/sfx-logo-purple.png";
import { popoverContainerVariants, popoverItemVariants } from "../../lib/animations/popover-variants";

type SidebarUser = {
  displayName?: string;
  email?: string;
  photoURL?: string;
};

type SidebarProps = {
  user?: SidebarUser;
  onSignOut?: () => void;
};

const NAV_ITEMS = [
  { view: "home", label: "New event", icon: Home },
  { view: "rates", label: "Previous events", icon: TrendingUp },
  { view: "history", label: "History", icon: History },
  { view: "settings", label: "Settings", icon: Settings },
] as const;

export default function Sidebar({ user, onSignOut }: SidebarProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { activeView, setActiveView } = useDashboardView();
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
        <div className="w-full space-y-[1rem]">
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

          <div className="w-full flex flex-col gap-0.5">
            {NAV_ITEMS.map(({ view, label, icon: Icon }) => {
              const isActive = activeView === view;

              return (
                <button
                  key={view}
                  onClick={() => setActiveView(view)}
                  className={`w-full flex gap-4 items-center text-[16px] px-[1rem] py-[.65rem] rounded-full transition duration-400 ease-in-out ${
                    isActive ? "bg-col-light-gray" : "hover:bg-col-light-gray"
                  }`}
                >
                  <Icon
                    className={`w-[22px] transition-colors duration-400 ease-in-out ${
                      isActive ? "text-sfx-muted" : "text-sfx-muted"
                    }`}
                  />
                  <span
                    className={`inline-block font-rh-m transition-colors duration-400 ease-in-out ${
                      isActive ? "text-sfx-muted" : ""
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div ref={profileRef} className="relative flex items-center gap-2 pl-[1.5rem]">
          {/* <div className="flex items-center gap-4">
            <button
              onClick={() => setIsProfileOpen(prev => !prev)}
              className="h-[3.5rem] w-[3.5rem] rounded-full"
            >
              <img
                src={user?.photoURL ?? "/images/image.jpg"}
                alt={user?.displayName ?? "User avatar"}
                className="h-full w-full rounded-[inherit] object-cover"
              />
            </button>
          </div> */}

          <AnimatePresence>
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
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}
