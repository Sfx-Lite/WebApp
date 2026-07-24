import { useState } from "react";
import {
  MdChevronRight,
  MdOutlineChat,
  MdOutlineCheckCircle,
  MdOutlineNotifications,
  MdOutlinePerson,
  MdOutlineShield,
  MdOutlineWarningAmber,
} from "react-icons/md";
import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

type SettingItemProps = {
  icon: React.ReactNode;
  iconBgClass: string;
  title: string;
  subtitle: string;
  badge?: {
    text: string;
    className: string;
  };
  rightElement?: React.ReactNode;
  to?: string;
  onClick?: () => void;
};

function SettingItem({
  icon,
  iconBgClass,
  title,
  subtitle,
  badge,
  rightElement,
  to,
  onClick,
}: SettingItemProps) {
  const content = (
    <div
      onClick={onClick}
      className="flex mb-2 items-center justify-between rounded-2xl border border-sfx-primary-tint/20 bg-white p-4 shadow-brand transition-all hover:border-sfx-primary/20 cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${iconBgClass}`}
        >
          {icon}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-rh-b text-sm sm:text-base text-sfx-ink leading-tight">
              {title}
            </h3>
            {badge && (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-rh-sb ${badge.className}`}
              >
                {badge.text}
              </span>
            )}
          </div>
          <p className="font-rh-r text-xs text-sfx-muted mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="pl-2">
        {rightElement || (
          <MdChevronRight className="size-5 text-sfx-muted/60" />
        )}
      </div>
    </div>
  );

  if (to) {
    return <Link to={to}>{content}</Link>;
  }

  return content;
}

export default function Settings() {
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-dvh w-full flex-col bg-sfx-primary-tint overflow-y-auto">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-between p-4 sm:p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-1 py-2">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-sfx-primary text-lg font-rh-b text-white shadow-sm">
              A
            </div>
            <div>
              <h1 className="font-rh-b text-lg leading-snug text-sfx-ink">
                Amara Okafor
              </h1>
              <p className="font-rh-r text-xs text-sfx-muted">
                @amara &middot; Joined Jul 2026
              </p>
            </div>
          </div>

          <section className="space-y-3">
            <h2 className="px-1 font-rh-b text-xs uppercase tracking-widest text-sfx-muted">
              Account
            </h2>

            <div className="space-y-3">
              <SettingItem
                icon={<MdOutlinePerson className="size-6 text-sfx-primary" />}
                iconBgClass="bg-sfx-primary/10"
                title="Profile"
                subtitle="Personal details and home country."
                to="/profile"
              />

              <SettingItem
                icon={
                  <MdOutlineCheckCircle className="size-6 text-emerald-600" />
                }
                iconBgClass="bg-emerald-100/70"
                title="Identity verification"
                subtitle="Your identity was approved on 9 Jul."
                badge={{
                  text: "Verified",
                  className: "bg-emerald-100 text-emerald-700",
                }}
                to="/kyc/status"
              />

              <SettingItem
                icon={<MdOutlineShield className="size-6 text-sfx-primary" />}
                iconBgClass="bg-sfx-primary/10"
                title="Security"
                subtitle="Password and transaction PIN."
                badge={{
                  text: "Medium",
                  className: "bg-amber-100 text-amber-700",
                }}
                to="/security"
              />

              {/* Notifications */}
              <SettingItem
                icon={
                  <MdOutlineNotifications className="size-6 text-sfx-primary" />
                }
                iconBgClass="bg-sfx-primary/10"
                title="Notifications"
                subtitle="In-app notification preferences."
                rightElement={(
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotificationsEnabled(!notificationsEnabled);
                    }}
                    className={`relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      notificationsEnabled ? "bg-sfx-primary" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block size-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        notificationsEnabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                )}
              />
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="px-1 font-rh-b text-xs uppercase tracking-widest text-sfx-muted">
              Support
            </h2>

            <div className="space-y-3">
              {/* Help & Support */}
              <SettingItem
                icon={<MdOutlineChat className="size-6 text-emerald-600" />}
                iconBgClass="bg-emerald-100/70"
                title="Help & support"
                subtitle="Chat with the SFx Lite assistant."
                to="/support"
              />

              <SettingItem
                icon={
                  <MdOutlineWarningAmber className="size-6 text-amber-600" />
                }
                iconBgClass="bg-amber-100/70"
                title="About us"
                subtitle="FAQ, privacy policy, terms."
                to="/about"
              />
            </div>
          </section>
        </div>

        <div className="pt-8 pb-4 text-center">
          <Button
            type="button"
            onClick={handleLogout}
            className="font-rh-sb border border-sfx-ink/10 w-full bg-white text-sm text-red-500 hover:text-red-600 transition-colors py-2 px-4 focus:outline-none"
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
