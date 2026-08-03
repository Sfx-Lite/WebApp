import { useEffect, useState } from "react";
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

import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/hooks/reduxHooks";
import { useKycStatus } from "@/hooks/useKycStatus";
import { logout } from "@/store/authSlice";
import { KYC_BADGES } from "@/utils/kycBadge";

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
      className="
        flex
        min-h-[64px]
        items-center
        justify-between
        gap-3
        rounded-2xl
        border
        border-sfx-primary-tint/20
        bg-white
        px-4
        py-3
        mb-3
        shadow-brand
        transition-all
        hover:border-sfx-primary/20
        cursor-pointer
      "
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`
            flex
            size-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            ${iconBgClass}
          `}
        >
          {icon}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className="
              truncate
              font-rh-b
              text-sm
              sm:text-base
              text-sfx-ink
            "
            >
              {title}
            </h3>

            {badge && (
              <span
                className={`
                  shrink-0
                  rounded-full
                  px-2.5
                  py-0.5
                  text-[11px]
                  font-rh-sb
                  ${badge.className}
                `}
              >
                {badge.text}
              </span>
            )}
          </div>

          <p
            className="
            truncate
            font-rh-r
            text-xs
            text-sfx-muted
            mt-1
          "
          >
            {subtitle}
          </p>
        </div>
      </div>

      <div className="shrink-0">
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

const USER_PROFILE_URL = "/users/profile";

export default function Settings() {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const [profile, setProfile] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  const { kycData, loading: kycLoading } = useKycStatus();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.get(USER_PROFILE_URL);

        setProfile(res.data.data);
      }
      catch {
        setProfile(null);
      }
      finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logout());

    navigate("/login");
  };

  const fullName = profile ? `${profile.firstName} ${profile.lastName}` : "";

  const initial = profile?.firstName
    ? profile.firstName.charAt(0).toUpperCase()
    : "U";

  const currentKycBadge = kycData ? KYC_BADGES[kycData.kycStatus] : null;

  return (
    <div
      className="
          flex
          min-h-dvh
          w-full
          flex-col
          overflow-y-auto
          "
    >
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-lg
          flex-1
          flex-col
          px-4
          py-8
          sm:px-6
          lg:px-8
          "
      >
        <div className="space-y-8">
          {/* PROFILE */}

          <div
            className="
          flex
          items-center
          gap-4
          "
          >
            <div
              className="
          flex
          size-12
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-sfx-primary
          text-lg
          font-rh-b
          text-white
          "
            >
              {isLoading ? "..." : initial}
            </div>

            <div className="min-w-0">
              <h1
                className="
          truncate
          font-rh-b
          text-lg
          sm:text-xl
          text-sfx-ink
          "
              >
                {isLoading ? "Loading..." : fullName || "Guest User"}
              </h1>

              <p
                className="
          text-xs
          font-rh-r
          text-sfx-muted
          "
              >
                {profile?.username && `@${profile.username}`}
              </p>
            </div>
          </div>

          <section className="space-y-4">
            <h2
              className="
          px-1
          font-rh-b
          text-xs
          uppercase
          tracking-widest
          text-sfx-muted
          "
            >
              Account
            </h2>

            <div className="space-y-4">
              <SettingItem
                icon={<MdOutlinePerson className="size-6 text-sfx-primary" />}
                iconBgClass="bg-sfx-primary/10"
                title="Profile"
                subtitle="Personal details and home country."
                to="/profile"
              />

              <SettingItem
                icon={
                  <MdOutlineCheckCircle className="size-6 text-sfx-success" />
                }
                iconBgClass="bg-sfx-success/10"
                title="Identity verification"
                subtitle={
                  kycLoading
                    ? "Checking verification status."
                    : "Your identity was approved."
                }
                badge={
                  currentKycBadge
                    ? {
                        text: currentKycBadge.text,
                        className: currentKycBadge.className,
                      }
                    : undefined
                }
                to="/kyc/status"
              />

              <SettingItem
                icon={<MdOutlineShield className="size-6 text-sfx-primary" />}
                iconBgClass="bg-sfx-primary/10"
                title="Security"
                subtitle="Manage Password."
                badge={{
                  text: "Medium",
                  className: "bg-amber-100 text-amber-700",
                }}
                to="/password"
              />

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

                    className={`
          relative
          inline-flex
          h-7
          w-12
          rounded-full
          transition
          ${notificationsEnabled ? "bg-sfx-primary" : "bg-gray-200"}
          `}
                  >
                    <span
                      className={`
          absolute
          top-0.5
          size-6
          rounded-full
          bg-white
          shadow
          transition-transform
          ${notificationsEnabled ? "translate-x-5" : "translate-x-0"}
          `}
                    />
                  </button>
                )}
              />
            </div>
          </section>

          <section className="space-y-4">
            <h2
              className="
          px-1
          font-rh-b
          text-xs
          uppercase
          tracking-widest
          text-sfx-muted
          "
            >
              Support
            </h2>

            <div className="space-y-4">
              <SettingItem
                icon={<MdOutlineChat className="size-6 text-sfx-success" />}
                iconBgClass="bg-sfx-success/10"
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

        <div
          className="
          mt-auto
          pt-10
          pb-4
          "
        >
          <Button
            onClick={handleLogout}
            className="
          w-full
          h-11
          border
          border-sfx-ink/15
          bg-white
          text-sm
          font-rh-sb
          text-red-500
          hover:bg-sfx-primary-soft
          "
          >
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
}
